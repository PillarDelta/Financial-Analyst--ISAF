// Remote Licensing Service for AFAS MVP
// Prevents unauthorized usage through remote license verification

export interface LicenseInfo {
  licenseKey: string;
  userId: string;
  companyName: string;
  email: string;
  plan: 'trial' | 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  expiresAt: Date;
  createdAt: Date;
  features: string[];
  usageLimit: {
    analysesPerMonth: number;
    documentsPerMonth: number;
    apiCallsPerDay: number;
  };
  currentUsage: {
    analysesThisMonth: number;
    documentsThisMonth: number;
    apiCallsToday: number;
    lastUsed: Date;
  };
}

export interface LicenseValidationResult {
  isValid: boolean;
  license?: LicenseInfo;
  error?: string;
  remainingUsage?: {
    analyses: number;
    documents: number;
    apiCalls: number;
  };
}

export class LicenseService {
  private static instance: LicenseService;
  private licenseCache: Map<string, { license: LicenseInfo; cachedAt: Date }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly LICENSE_SERVER_URL = process.env.LICENSE_SERVER_URL || 'https://license.your-domain.com/api';
  private readonly FALLBACK_GRACE_PERIOD = 24 * 60 * 60 * 1000; // 24 hours
  
  private constructor() {}

  public static getInstance(): LicenseService {
    if (!LicenseService.instance) {
      LicenseService.instance = new LicenseService();
    }
    return LicenseService.instance;
  }

  /**
   * Validate license key with remote server
   */
  public async validateLicense(licenseKey: string): Promise<LicenseValidationResult> {
    try {
      // Check cache first
      const cached = this.licenseCache.get(licenseKey);
      if (cached && (Date.now() - cached.cachedAt.getTime()) < this.CACHE_DURATION) {
        return this.validateCachedLicense(cached.license);
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Validate with remote server
      const response = await fetch(`${this.LICENSE_SERVER_URL}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.LICENSE_API_KEY || '',
        },
        body: JSON.stringify({
          licenseKey,
          machineId: await this.getMachineId(),
          timestamp: Date.now(),
          version: process.env.npm_package_version || '1.0.0'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // If server is unreachable, check for grace period
        return this.handleServerUnavailable(licenseKey);
      }

      const data = await response.json();
      
      if (data.success && data.license) {
        // Cache the license
        this.licenseCache.set(licenseKey, {
          license: data.license,
          cachedAt: new Date()
        });

        return this.validateCachedLicense(data.license);
      } else {
        return {
          isValid: false,
          error: data.error || 'Invalid license key'
        };
      }

    } catch (error) {
      console.error('License validation error:', error);
      return this.handleServerUnavailable(licenseKey);
    }
  }

  /**
   * Check if user can perform a specific action
   */
  public async canPerformAction(
    licenseKey: string, 
    action: 'analysis' | 'document' | 'api_call'
  ): Promise<{ allowed: boolean; reason?: string }> {
    const validation = await this.validateLicense(licenseKey);
    
    if (!validation.isValid) {
      return { allowed: false, reason: validation.error };
    }

    const license = validation.license!;
    const usage = license.currentUsage;
    const limits = license.usageLimit;

    switch (action) {
      case 'analysis':
        if (usage.analysesThisMonth >= limits.analysesPerMonth) {
          return { 
            allowed: false, 
            reason: `Monthly analysis limit reached (${limits.analysesPerMonth}). Upgrade your plan or wait for next month.` 
          };
        }
        break;
      
      case 'document':
        if (usage.documentsThisMonth >= limits.documentsPerMonth) {
          return { 
            allowed: false, 
            reason: `Monthly document limit reached (${limits.documentsPerMonth}). Upgrade your plan or wait for next month.` 
          };
        }
        break;
      
      case 'api_call':
        if (usage.apiCallsToday >= limits.apiCallsPerDay) {
          return { 
            allowed: false, 
            reason: `Daily API call limit reached (${limits.apiCallsPerDay}). Try again tomorrow or upgrade your plan.` 
          };
        }
        break;
    }

    return { allowed: true };
  }

  /**
   * Record usage for billing and limits
   */
  public async recordUsage(
    licenseKey: string, 
    action: 'analysis' | 'document' | 'api_call',
    metadata?: any
  ): Promise<void> {
    try {
      await fetch(`${this.LICENSE_SERVER_URL}/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.LICENSE_API_KEY || '',
        },
        body: JSON.stringify({
          licenseKey,
          action,
          timestamp: Date.now(),
          machineId: await this.getMachineId(),
          metadata
        })
      });

      // Update local cache
      const cached = this.licenseCache.get(licenseKey);
      if (cached) {
        switch (action) {
          case 'analysis':
            cached.license.currentUsage.analysesThisMonth++;
            break;
          case 'document':
            cached.license.currentUsage.documentsThisMonth++;
            break;
          case 'api_call':
            cached.license.currentUsage.apiCallsToday++;
            break;
        }
        cached.license.currentUsage.lastUsed = new Date();
      }

    } catch (error) {
      console.error('Failed to record usage:', error);
      // Continue operation even if usage recording fails
    }
  }

  /**
   * Get license information for display
   */
  public async getLicenseInfo(licenseKey: string): Promise<LicenseInfo | null> {
    const validation = await this.validateLicense(licenseKey);
    return validation.isValid ? validation.license! : null;
  }

  /**
   * Check for license updates or revocations
   */
  public async checkLicenseStatus(licenseKey: string): Promise<{
    status: 'active' | 'expired' | 'suspended' | 'revoked';
    message?: string;
    action?: 'continue' | 'warn' | 'block';
  }> {
    try {
      const response = await fetch(`${this.LICENSE_SERVER_URL}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.LICENSE_API_KEY || '',
        },
        body: JSON.stringify({
          licenseKey,
          machineId: await this.getMachineId()
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: data.status,
          message: data.message,
          action: data.action
        };
      }

      return { status: 'active', action: 'continue' };
    } catch (error) {
      console.error('License status check failed:', error);
      return { status: 'active', action: 'continue' };
    }
  }

  /**
   * Validate cached license
   */
  private validateCachedLicense(license: LicenseInfo): LicenseValidationResult {
    const now = new Date();
    
    // Check expiration
    if (license.expiresAt && new Date(license.expiresAt) < now) {
      return {
        isValid: false,
        error: 'License has expired. Please renew your subscription.'
      };
    }

    // Check status
    if (license.status !== 'active') {
      const messages = {
        expired: 'License has expired. Please renew your subscription.',
        suspended: 'License has been suspended. Please contact support.',
        revoked: 'License has been revoked. Please contact support.'
      };
      return {
        isValid: false,
        error: messages[license.status] || 'License is not active.'
      };
    }

    // Calculate remaining usage
    const remainingUsage = {
      analyses: Math.max(0, license.usageLimit.analysesPerMonth - license.currentUsage.analysesThisMonth),
      documents: Math.max(0, license.usageLimit.documentsPerMonth - license.currentUsage.documentsThisMonth),
      apiCalls: Math.max(0, license.usageLimit.apiCallsPerDay - license.currentUsage.apiCallsToday)
    };

    return {
      isValid: true,
      license,
      remainingUsage
    };
  }

  /**
   * Handle server unavailable scenario
   */
  private handleServerUnavailable(licenseKey: string): LicenseValidationResult {
    const cached = this.licenseCache.get(licenseKey);
    
    if (cached) {
      const gracePeriodEnd = new Date(cached.cachedAt.getTime() + this.FALLBACK_GRACE_PERIOD);
      
      if (new Date() < gracePeriodEnd) {
        // Allow operation during grace period
        return this.validateCachedLicense(cached.license);
      }
    }

    return {
      isValid: false,
      error: 'Unable to verify license. Please check your internet connection and try again.'
    };
  }

  /**
   * Generate machine ID for license binding
   */
  private async getMachineId(): Promise<string> {
    try {
      // In browser environment
      if (typeof window !== 'undefined') {
        let machineId = localStorage.getItem('machine_id');
        if (!machineId) {
          machineId = this.generateMachineId();
          localStorage.setItem('machine_id', machineId);
        }
        return machineId;
      }

      // In Node.js environment
      const os = await import('os');
      const crypto = await import('crypto');
      
      const networkInterfaces = os.networkInterfaces();
      const macAddresses = Object.values(networkInterfaces)
        .flat()
        .filter(iface => iface && !iface.internal && iface.mac !== '00:00:00:00:00:00')
        .map(iface => iface!.mac)
        .sort();

      const machineInfo = {
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        macs: macAddresses.slice(0, 2) // Use first 2 MAC addresses
      };

      return crypto.createHash('sha256')
        .update(JSON.stringify(machineInfo))
        .digest('hex')
        .substring(0, 32);

    } catch (error) {
      console.error('Failed to generate machine ID:', error);
      return this.generateMachineId();
    }
  }

  /**
   * Generate fallback machine ID
   */
  private generateMachineId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Clear license cache (for testing or logout)
   */
  public clearCache(): void {
    this.licenseCache.clear();
  }

  /**
   * Get trial license for new users
   */
  public async requestTrialLicense(email: string, companyName: string): Promise<{
    success: boolean;
    licenseKey?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.LICENSE_SERVER_URL}/trial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.LICENSE_API_KEY || '',
        },
        body: JSON.stringify({
          email,
          companyName,
          machineId: await this.getMachineId(),
          timestamp: Date.now()
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          licenseKey: data.licenseKey
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to create trial license'
        };
      }

    } catch (error) {
      console.error('Trial license request failed:', error);
      return {
        success: false,
        error: 'Unable to connect to licensing server'
      };
    }
  }
}

export default LicenseService; 