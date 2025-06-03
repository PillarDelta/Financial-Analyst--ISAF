// License Middleware for API Protection
// Ensures only licensed users can access protected endpoints

import { NextRequest, NextResponse } from 'next/server';
import LicenseService from '@/services/licensing/LicenseService';

export interface LicenseMiddlewareOptions {
  requireLicense?: boolean;
  allowTrial?: boolean;
  requiredFeatures?: string[];
  action?: 'analysis' | 'document' | 'api_call';
}

/**
 * Middleware to validate license for API endpoints
 */
export async function licenseMiddleware(
  request: NextRequest,
  options: LicenseMiddlewareOptions = {}
): Promise<NextResponse | null> {
  const {
    requireLicense = true,
    allowTrial = true,
    requiredFeatures = [],
    action = 'api_call'
  } = options;

  // Skip license check if not required
  if (!requireLicense) {
    return null; // Continue to next middleware/handler
  }

  try {
    // Extract license key from headers or query params
    const licenseKey = 
      request.headers.get('X-License-Key') ||
      request.headers.get('Authorization')?.replace('Bearer ', '') ||
      request.nextUrl.searchParams.get('license_key');

    if (!licenseKey) {
      return NextResponse.json(
        {
          error: 'License key required',
          message: 'Please provide a valid license key to access this feature.',
          code: 'LICENSE_REQUIRED'
        },
        { status: 401 }
      );
    }

    const licenseService = LicenseService.getInstance();

    // Validate license
    const validation = await licenseService.validateLicense(licenseKey);
    
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid license',
          message: validation.error,
          code: 'LICENSE_INVALID'
        },
        { status: 403 }
      );
    }

    const license = validation.license!;

    // Check if trial licenses are allowed
    if (!allowTrial && license.plan === 'trial') {
      return NextResponse.json(
        {
          error: 'Trial license not allowed',
          message: 'This feature requires a paid license. Please upgrade your plan.',
          code: 'TRIAL_NOT_ALLOWED'
        },
        { status: 403 }
      );
    }

    // Check required features
    if (requiredFeatures.length > 0) {
      const missingFeatures = requiredFeatures.filter(
        feature => !license.features.includes(feature)
      );
      
      if (missingFeatures.length > 0) {
        return NextResponse.json(
          {
            error: 'Feature not available',
            message: `Your license does not include: ${missingFeatures.join(', ')}. Please upgrade your plan.`,
            code: 'FEATURE_NOT_AVAILABLE',
            missingFeatures
          },
          { status: 403 }
        );
      }
    }

    // Check usage limits
    const usageCheck = await licenseService.canPerformAction(licenseKey, action);
    
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Usage limit exceeded',
          message: usageCheck.reason,
          code: 'USAGE_LIMIT_EXCEEDED',
          remainingUsage: validation.remainingUsage
        },
        { status: 429 }
      );
    }

    // Record usage
    await licenseService.recordUsage(licenseKey, action, {
      endpoint: request.nextUrl.pathname,
      method: request.method,
      userAgent: request.headers.get('User-Agent'),
      ip: request.headers.get('X-Forwarded-For') || request.headers.get('X-Real-IP') || 'unknown'
    });

    // Add license info to request headers for downstream use
    const response = NextResponse.next();
    response.headers.set('X-License-Valid', 'true');
    response.headers.set('X-License-Plan', license.plan);
    response.headers.set('X-License-User', license.userId);
    response.headers.set('X-Remaining-Analyses', validation.remainingUsage?.analyses.toString() || '0');
    response.headers.set('X-Remaining-Documents', validation.remainingUsage?.documents.toString() || '0');
    response.headers.set('X-Remaining-API-Calls', validation.remainingUsage?.apiCalls.toString() || '0');

    return null; // Continue to next middleware/handler

  } catch (error) {
    console.error('License middleware error:', error);
    
    return NextResponse.json(
      {
        error: 'License validation failed',
        message: 'Unable to validate license. Please try again.',
        code: 'LICENSE_VALIDATION_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * Create license middleware with specific options
 */
export function createLicenseMiddleware(options: LicenseMiddlewareOptions) {
  return (request: NextRequest) => licenseMiddleware(request, options);
}

/**
 * Predefined middleware configurations
 */
export const middlewareConfigs = {
  // Basic API access
  basic: {
    requireLicense: true,
    allowTrial: true,
    action: 'api_call' as const
  },
  
  // Analysis endpoints
  analysis: {
    requireLicense: true,
    allowTrial: true,
    requiredFeatures: ['analysis'],
    action: 'analysis' as const
  },
  
  // Document processing
  document: {
    requireLicense: true,
    allowTrial: true,
    requiredFeatures: ['document_processing'],
    action: 'document' as const
  },
  
  // Premium features
  premium: {
    requireLicense: true,
    allowTrial: false,
    requiredFeatures: ['premium_analysis', 'advanced_features'],
    action: 'analysis' as const
  },
  
  // Enterprise features
  enterprise: {
    requireLicense: true,
    allowTrial: false,
    requiredFeatures: ['enterprise_features', 'api_access', 'bulk_processing'],
    action: 'api_call' as const
  }
};

export default licenseMiddleware; 