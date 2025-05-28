// Data Validation Protocols for AFAS MVP
// This completes Milestone 4 - Data validation protocols

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CompanyValidationRules {
  name: { required: boolean; minLength?: number; maxLength?: number };
  ticker_symbol?: { pattern?: RegExp; maxLength?: number };
  industry?: { allowedValues?: string[] };
  sector?: { allowedValues?: string[] };
  market_cap?: { min?: number; max?: number };
  employees?: { min?: number; max?: number };
  founded_year?: { min?: number; max?: number };
}

export interface FinancialDataValidationRules {
  revenue?: { min?: number; required?: boolean };
  netIncome?: { required?: boolean };
  totalAssets?: { min?: number; required?: boolean };
  currentAssets?: { min?: number };
  currentLiabilities?: { min?: number };
  totalDebt?: { min?: number };
  shareholdersEquity?: { required?: boolean };
}

export class DataValidator {
  
  /**
   * Validate company data
   */
  public static validateCompany(data: any, rules?: CompanyValidationRules): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const defaultRules: CompanyValidationRules = {
      name: { required: true, minLength: 2, maxLength: 255 },
      ticker_symbol: { pattern: /^[A-Z]{1,10}$/, maxLength: 10 },
      market_cap: { min: 0, max: 10000000000000 }, // 10 trillion max
      employees: { min: 0, max: 10000000 },
      founded_year: { min: 1800, max: new Date().getFullYear() }
    };

    const validationRules = { ...defaultRules, ...rules };

    // Validate required fields
    if (validationRules.name.required && !data.name) {
      result.errors.push('Company name is required');
      result.isValid = false;
    }

    // Validate name length
    if (data.name) {
      if (validationRules.name.minLength && data.name.length < validationRules.name.minLength) {
        result.errors.push(`Company name must be at least ${validationRules.name.minLength} characters`);
        result.isValid = false;
      }
      if (validationRules.name.maxLength && data.name.length > validationRules.name.maxLength) {
        result.errors.push(`Company name must not exceed ${validationRules.name.maxLength} characters`);
        result.isValid = false;
      }
    }

    // Validate ticker symbol
    if (data.ticker_symbol && validationRules.ticker_symbol?.pattern) {
      if (!validationRules.ticker_symbol.pattern.test(data.ticker_symbol)) {
        result.errors.push('Ticker symbol must be uppercase letters only (1-10 characters)');
        result.isValid = false;
      }
    }

    // Validate market cap
    if (data.market_cap !== undefined) {
      if (validationRules.market_cap?.min !== undefined && data.market_cap < validationRules.market_cap.min) {
        result.errors.push(`Market cap cannot be negative`);
        result.isValid = false;
      }
      if (validationRules.market_cap?.max !== undefined && data.market_cap > validationRules.market_cap.max) {
        result.errors.push(`Market cap exceeds maximum allowed value`);
        result.isValid = false;
      }
    }

    // Validate employees
    if (data.employees !== undefined) {
      if (validationRules.employees?.min !== undefined && data.employees < validationRules.employees.min) {
        result.errors.push('Number of employees cannot be negative');
        result.isValid = false;
      }
      if (validationRules.employees?.max !== undefined && data.employees > validationRules.employees.max) {
        result.errors.push('Number of employees exceeds reasonable limit');
        result.isValid = false;
      }
    }

    // Validate founded year
    if (data.founded_year !== undefined) {
      if (validationRules.founded_year?.min !== undefined && data.founded_year < validationRules.founded_year.min) {
        result.errors.push('Founded year is too early');
        result.isValid = false;
      }
      if (validationRules.founded_year?.max !== undefined && data.founded_year > validationRules.founded_year.max) {
        result.errors.push('Founded year cannot be in the future');
        result.isValid = false;
      }
    }

    // Add warnings for missing optional but recommended fields
    if (!data.industry) {
      result.warnings.push('Industry classification is recommended for better analysis');
    }
    if (!data.sector) {
      result.warnings.push('Sector classification is recommended for benchmarking');
    }

    return result;
  }

  /**
   * Validate financial data
   */
  public static validateFinancialData(data: any, rules?: FinancialDataValidationRules): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const defaultRules: FinancialDataValidationRules = {
      revenue: { min: 0, required: true },
      totalAssets: { min: 0, required: true },
      currentAssets: { min: 0 },
      currentLiabilities: { min: 0 },
      totalDebt: { min: 0 },
      shareholdersEquity: { required: true }
    };

    const validationRules = { ...defaultRules, ...rules };

    // Validate required fields
    if (validationRules.revenue?.required && (data.revenue === undefined || data.revenue === null)) {
      result.errors.push('Revenue is required');
      result.isValid = false;
    }

    if (validationRules.totalAssets?.required && (data.totalAssets === undefined || data.totalAssets === null)) {
      result.errors.push('Total assets is required');
      result.isValid = false;
    }

    if (validationRules.shareholdersEquity?.required && (data.shareholdersEquity === undefined || data.shareholdersEquity === null)) {
      result.errors.push('Shareholders equity is required');
      result.isValid = false;
    }

    // Validate numeric constraints
    Object.entries(validationRules).forEach(([field, rules]) => {
      const value = data[field];
      if (value !== undefined && value !== null && rules && 'min' in rules) {
        if (rules.min !== undefined && value < rules.min) {
          result.errors.push(`${field} cannot be negative`);
          result.isValid = false;
        }
      }
    });

    // Validate logical relationships
    if (data.currentAssets && data.totalAssets && data.currentAssets > data.totalAssets) {
      result.errors.push('Current assets cannot exceed total assets');
      result.isValid = false;
    }

    if (data.grossProfit && data.revenue && data.grossProfit > data.revenue) {
      result.errors.push('Gross profit cannot exceed revenue');
      result.isValid = false;
    }

    if (data.netIncome && data.grossProfit && data.netIncome > data.grossProfit) {
      result.warnings.push('Net income exceeds gross profit - please verify');
    }

    if (data.cash && data.currentAssets && data.cash > data.currentAssets) {
      result.errors.push('Cash cannot exceed current assets');
      result.isValid = false;
    }

    // Add warnings for missing recommended fields
    if (!data.operatingIncome) {
      result.warnings.push('Operating income is recommended for comprehensive analysis');
    }
    if (!data.operatingCashFlow) {
      result.warnings.push('Operating cash flow is recommended for liquidity analysis');
    }

    return result;
  }

  /**
   * Validate financial statement data
   */
  public static validateFinancialStatement(data: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Required fields
    if (!data.company_id) {
      result.errors.push('Company ID is required');
      result.isValid = false;
    }

    if (!data.statement_type) {
      result.errors.push('Statement type is required');
      result.isValid = false;
    } else if (!['income', 'balance', 'cashflow'].includes(data.statement_type)) {
      result.errors.push('Statement type must be income, balance, or cashflow');
      result.isValid = false;
    }

    if (!data.period_end) {
      result.errors.push('Period end date is required');
      result.isValid = false;
    } else {
      const periodEnd = new Date(data.period_end);
      if (isNaN(periodEnd.getTime())) {
        result.errors.push('Period end must be a valid date');
        result.isValid = false;
      } else if (periodEnd > new Date()) {
        result.errors.push('Period end cannot be in the future');
        result.isValid = false;
      }
    }

    if (!data.period_type) {
      result.errors.push('Period type is required');
      result.isValid = false;
    } else if (!['annual', 'quarterly', 'monthly'].includes(data.period_type)) {
      result.errors.push('Period type must be annual, quarterly, or monthly');
      result.isValid = false;
    }

    if (!data.data || typeof data.data !== 'object') {
      result.errors.push('Financial data object is required');
      result.isValid = false;
    } else {
      // Validate the financial data within the statement
      const financialValidation = this.validateFinancialData(data.data);
      result.errors.push(...financialValidation.errors);
      result.warnings.push(...financialValidation.warnings);
      if (!financialValidation.isValid) {
        result.isValid = false;
      }
    }

    return result;
  }

  /**
   * Validate API request data
   */
  public static validateApiRequest(endpoint: string, method: string, data: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validate based on endpoint and method
    if (endpoint === '/api/companies') {
      if (method === 'POST') {
        const companyValidation = this.validateCompany(data);
        result.errors.push(...companyValidation.errors);
        result.warnings.push(...companyValidation.warnings);
        if (!companyValidation.isValid) {
          result.isValid = false;
        }
      }
    } else if (endpoint === '/api/financial-data') {
      if (method === 'POST') {
        if (!data.type) {
          result.errors.push('Data type is required');
          result.isValid = false;
        } else if (data.type === 'statement') {
          const statementValidation = this.validateFinancialStatement(data.data);
          result.errors.push(...statementValidation.errors);
          result.warnings.push(...statementValidation.warnings);
          if (!statementValidation.isValid) {
            result.isValid = false;
          }
        } else if (data.type === 'ratios') {
          if (!data.data.company_id) {
            result.errors.push('Company ID is required for financial ratios');
            result.isValid = false;
          }
          if (!data.data.period_end) {
            result.errors.push('Period end is required for financial ratios');
            result.isValid = false;
          }
        }
      }
    }

    return result;
  }

  /**
   * Sanitize input data
   */
  public static sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      return data.trim().replace(/[<>]/g, ''); // Basic XSS protection
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      Object.keys(data).forEach(key => {
        sanitized[key] = this.sanitizeInput(data[key]);
      });
      return sanitized;
    }
    
    return data;
  }

  /**
   * Check data quality and completeness
   */
  public static assessDataQuality(data: any, dataType: 'company' | 'financial'): {
    score: number;
    completeness: number;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let completeness = 0;
    let totalFields = 0;

    if (dataType === 'company') {
      const expectedFields = ['name', 'ticker_symbol', 'industry', 'sector', 'market_cap', 'employees', 'founded_year', 'description'];
      totalFields = expectedFields.length;
      
      expectedFields.forEach(field => {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
          completeness++;
        } else {
          recommendations.push(`Consider adding ${field} for better analysis`);
        }
      });

      // Check for data consistency
      if (data.founded_year && data.founded_year > new Date().getFullYear() - 1) {
        issues.push('Recently founded company - limited historical data available');
      }

      if (data.employees && data.market_cap) {
        const marketCapPerEmployee = data.market_cap / data.employees;
        if (marketCapPerEmployee > 10000000) { // $10M per employee
          issues.push('Unusually high market cap per employee ratio');
        }
      }

    } else if (dataType === 'financial') {
      const expectedFields = ['revenue', 'netIncome', 'totalAssets', 'currentAssets', 'currentLiabilities', 'totalDebt', 'shareholdersEquity', 'operatingCashFlow'];
      totalFields = expectedFields.length;
      
      expectedFields.forEach(field => {
        if (data[field] !== undefined && data[field] !== null) {
          completeness++;
        } else {
          recommendations.push(`Consider adding ${field} for comprehensive analysis`);
        }
      });

      // Check for financial red flags
      if (data.netIncome && data.revenue && (data.netIncome / data.revenue) < -0.5) {
        issues.push('Significant losses relative to revenue');
      }

      if (data.totalDebt && data.shareholdersEquity && (data.totalDebt / data.shareholdersEquity) > 3) {
        issues.push('High debt-to-equity ratio indicates financial risk');
      }

      if (data.currentAssets && data.currentLiabilities && (data.currentAssets / data.currentLiabilities) < 1) {
        issues.push('Current ratio below 1.0 indicates potential liquidity issues');
      }
    }

    const completenessPercentage = (completeness / totalFields) * 100;
    const qualityScore = Math.max(0, 100 - (issues.length * 10) - (recommendations.length * 2));

    return {
      score: qualityScore,
      completeness: completenessPercentage,
      issues,
      recommendations
    };
  }
}

// Export validation utilities
export const validateCompany = DataValidator.validateCompany;
export const validateFinancialData = DataValidator.validateFinancialData;
export const validateFinancialStatement = DataValidator.validateFinancialStatement;
export const validateApiRequest = DataValidator.validateApiRequest;
export const sanitizeInput = DataValidator.sanitizeInput;
export const assessDataQuality = DataValidator.assessDataQuality; 