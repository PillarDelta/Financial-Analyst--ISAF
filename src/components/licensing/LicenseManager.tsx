'use client';

import React, { useState, useEffect } from 'react';
import LicenseService, { LicenseInfo } from '@/services/licensing/LicenseService';

interface LicenseManagerProps {
  onLicenseChange?: (isValid: boolean, license?: LicenseInfo) => void;
}

export default function LicenseManager({ onLicenseChange }: LicenseManagerProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [showTrialForm, setShowTrialForm] = useState(false);
  const [trialEmail, setTrialEmail] = useState('');
  const [trialCompany, setTrialCompany] = useState('');

  useEffect(() => {
    // Load saved license key from localStorage
    const savedLicenseKey = localStorage.getItem('license_key');
    if (savedLicenseKey) {
      setLicenseKey(savedLicenseKey);
      validateLicense(savedLicenseKey);
    }
  }, []);

  const validateLicense = async (key: string) => {
    if (!key.trim()) {
      setError('Please enter a license key');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const licenseService = LicenseService.getInstance();
      const validation = await licenseService.validateLicense(key);

      if (validation.isValid && validation.license) {
        setLicense(validation.license);
        localStorage.setItem('license_key', key);
        onLicenseChange?.(true, validation.license);
        setError('');
      } else {
        setLicense(null);
        localStorage.removeItem('license_key');
        onLicenseChange?.(false);
        setError(validation.error || 'Invalid license key');
      }
    } catch (err) {
      setLicense(null);
      localStorage.removeItem('license_key');
      onLicenseChange?.(false);
      setError('Failed to validate license. Please check your connection.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateLicense(licenseKey);
  };

  const handleTrialRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trialEmail.trim() || !trialCompany.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const licenseService = LicenseService.getInstance();
      const result = await licenseService.requestTrialLicense(trialEmail, trialCompany);

      if (result.success && result.licenseKey) {
        setLicenseKey(result.licenseKey);
        setShowTrialForm(false);
        await validateLicense(result.licenseKey);
      } else {
        setError(result.error || 'Failed to create trial license');
      }
    } catch (err) {
      setError('Failed to request trial license. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleLogout = () => {
    setLicenseKey('');
    setLicense(null);
    setError('');
    localStorage.removeItem('license_key');
    onLicenseChange?.(false);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (license) {
    return (
      <div className="bg-background-light rounded-lg p-6 border border-border-color">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">License Information</h3>
            <p className="text-text-secondary text-sm">Active license for {license.companyName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-text-secondary hover:text-text-primary text-sm"
          >
            Change License
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Plan</label>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                license.plan === 'trial' ? 'bg-yellow-100 text-yellow-800' :
                license.plan === 'basic' ? 'bg-blue-100 text-blue-800' :
                license.plan === 'professional' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {license.plan.toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                license.status === 'active' ? 'bg-green-100 text-green-800' :
                license.status === 'expired' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {license.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Expires</label>
            <p className="text-text-primary">{formatDate(license.expiresAt)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">User</label>
            <p className="text-text-primary">{license.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-text-primary">Usage This Period</h4>
          
          {/* Analyses Usage */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">Analyses</span>
              <span className={getUsageColor(getUsagePercentage(license.currentUsage.analysesThisMonth, license.usageLimit.analysesPerMonth))}>
                {license.currentUsage.analysesThisMonth} / {license.usageLimit.analysesPerMonth}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  getUsagePercentage(license.currentUsage.analysesThisMonth, license.usageLimit.analysesPerMonth) >= 90 ? 'bg-red-500' :
                  getUsagePercentage(license.currentUsage.analysesThisMonth, license.usageLimit.analysesPerMonth) >= 75 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${getUsagePercentage(license.currentUsage.analysesThisMonth, license.usageLimit.analysesPerMonth)}%` }}
              ></div>
            </div>
          </div>

          {/* Documents Usage */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">Documents</span>
              <span className={getUsageColor(getUsagePercentage(license.currentUsage.documentsThisMonth, license.usageLimit.documentsPerMonth))}>
                {license.currentUsage.documentsThisMonth} / {license.usageLimit.documentsPerMonth}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  getUsagePercentage(license.currentUsage.documentsThisMonth, license.usageLimit.documentsPerMonth) >= 90 ? 'bg-red-500' :
                  getUsagePercentage(license.currentUsage.documentsThisMonth, license.usageLimit.documentsPerMonth) >= 75 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${getUsagePercentage(license.currentUsage.documentsThisMonth, license.usageLimit.documentsPerMonth)}%` }}
              ></div>
            </div>
          </div>

          {/* API Calls Usage */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">API Calls (Today)</span>
              <span className={getUsageColor(getUsagePercentage(license.currentUsage.apiCallsToday, license.usageLimit.apiCallsPerDay))}>
                {license.currentUsage.apiCallsToday} / {license.usageLimit.apiCallsPerDay}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  getUsagePercentage(license.currentUsage.apiCallsToday, license.usageLimit.apiCallsPerDay) >= 90 ? 'bg-red-500' :
                  getUsagePercentage(license.currentUsage.apiCallsToday, license.usageLimit.apiCallsPerDay) >= 75 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${getUsagePercentage(license.currentUsage.apiCallsToday, license.usageLimit.apiCallsPerDay)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {license.plan === 'trial' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-sm">
              You're using a trial license. Upgrade to a paid plan for unlimited access and additional features.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-background-light rounded-lg p-6 border border-border-color">
      <h3 className="text-lg font-semibold text-text-primary mb-4">License Required</h3>
      
      {!showTrialForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="licenseKey" className="block text-sm font-medium text-text-secondary mb-2">
              License Key
            </label>
            <input
              type="text"
              id="licenseKey"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="Enter your license key"
              className="w-full px-3 py-2 border border-border-color rounded-md bg-background-dark text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
              disabled={isValidating}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isValidating}
              className="flex-1 bg-accent-blue text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Validating...' : 'Validate License'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowTrialForm(true)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Start Free Trial
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleTrialRequest} className="space-y-4">
          <div>
            <label htmlFor="trialEmail" className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="trialEmail"
              value={trialEmail}
              onChange={(e) => setTrialEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-border-color rounded-md bg-background-dark text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
              disabled={isValidating}
              required
            />
          </div>

          <div>
            <label htmlFor="trialCompany" className="block text-sm font-medium text-text-secondary mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="trialCompany"
              value={trialCompany}
              onChange={(e) => setTrialCompany(e.target.value)}
              placeholder="Your Company"
              className="w-full px-3 py-2 border border-border-color rounded-md bg-background-dark text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
              disabled={isValidating}
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isValidating}
              className="flex-1 bg-accent-blue text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Creating Trial...' : 'Start Free Trial'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowTrialForm(false)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Back to License
            </button>
          </div>

          <p className="text-xs text-text-secondary">
            Trial includes 10 analyses, 5 documents, and 100 API calls for 14 days.
          </p>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-border-color">
        <p className="text-sm text-text-secondary">
          Need a license? Contact sales at{' '}
          <a href="mailto:sales@your-domain.com" className="text-accent-blue hover:underline">
            sales@your-domain.com
          </a>
        </p>
      </div>
    </div>
  );
} 