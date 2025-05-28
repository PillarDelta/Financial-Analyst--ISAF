// Enterprise Database Service for AFAS MVP
// This service adds database capabilities without affecting existing functionality

import { Pool, PoolClient } from 'pg';

export interface Company {
  id?: number;
  name: string;
  ticker_symbol?: string;
  industry?: string;
  sector?: string;
  market_cap?: number;
  country?: string;
  exchange?: string;
  description?: string;
  website?: string;
  employees?: number;
  founded_year?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface FinancialStatement {
  id?: number;
  company_id: number;
  statement_type: 'income' | 'balance' | 'cashflow';
  period_end: Date;
  period_type: 'annual' | 'quarterly' | 'monthly';
  fiscal_year?: number;
  fiscal_quarter?: number;
  currency?: string;
  data: any;
  source?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface FinancialRatios {
  id?: number;
  company_id: number;
  period_end: Date;
  // Liquidity Ratios
  current_ratio?: number;
  quick_ratio?: number;
  cash_ratio?: number;
  operating_cash_flow_ratio?: number;
  // Profitability Ratios
  gross_margin?: number;
  operating_margin?: number;
  net_margin?: number;
  ebitda_margin?: number;
  roe?: number;
  roa?: number;
  roic?: number;
  // Efficiency Ratios
  asset_turnover?: number;
  inventory_turnover?: number;
  receivables_turnover?: number;
  payables_turnover?: number;
  // Leverage Ratios
  debt_to_equity?: number;
  debt_to_assets?: number;
  debt_to_capital?: number;
  interest_coverage?: number;
  debt_service_coverage?: number;
  // Market Ratios
  pe_ratio?: number;
  pb_ratio?: number;
  ps_ratio?: number;
  ev_ebitda?: number;
  dividend_yield?: number;
  // Growth Ratios
  revenue_growth?: number;
  earnings_growth?: number;
  dividend_growth?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface AnalysisResult {
  id?: number;
  company_id: number;
  analysis_type: string;
  analysis_date?: Date;
  input_data?: any;
  results: any;
  confidence_score?: number;
  strategic_fit_score?: number;
  risk_assessment?: string;
  recommendations?: any;
  created_by?: string;
  created_at?: Date;
}

export class DatabaseService {
  private pool: Pool | null = null;
  private isConnected = false;

  constructor() {
    this.initializePool();
  }

  private initializePool() {
    try {
      // Only initialize if database environment variables are present
      const dbUrl = process.env.DATABASE_URL;
      const dbHost = process.env.DB_HOST;
      const dbUser = process.env.DB_USER;
      const dbPassword = process.env.DB_PASSWORD;
      const dbName = process.env.DB_NAME;

      if (dbUrl) {
        this.pool = new Pool({
          connectionString: dbUrl,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
      } else if (dbHost && dbUser && dbPassword && dbName) {
        this.pool = new Pool({
          host: dbHost,
          port: parseInt(process.env.DB_PORT || '5432'),
          user: dbUser,
          password: dbPassword,
          database: dbName,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
      } else {
        console.log('Database configuration not found. Database features will be disabled.');
        return;
      }

      this.pool.on('connect', () => {
        console.log('Connected to PostgreSQL database');
        this.isConnected = true;
      });

      this.pool.on('error', (err: Error) => {
        console.error('Database connection error:', err);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('Failed to initialize database pool:', error);
      this.pool = null;
    }
  }

  public async testConnection(): Promise<boolean> {
    if (!this.pool) return false;

    try {
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  public isAvailable(): boolean {
    return this.pool !== null && this.isConnected;
  }

  // Company Management
  public async createCompany(company: Company): Promise<Company | null> {
    if (!this.isAvailable()) return null;

    try {
      const query = `
        INSERT INTO companies (name, ticker_symbol, industry, sector, market_cap, country, exchange, description, website, employees, founded_year)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      const values = [
        company.name,
        company.ticker_symbol,
        company.industry,
        company.sector,
        company.market_cap,
        company.country || 'US',
        company.exchange,
        company.description,
        company.website,
        company.employees,
        company.founded_year
      ];

      const result = await this.pool!.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating company:', error);
      return null;
    }
  }

  public async getCompany(id: number): Promise<Company | null> {
    if (!this.isAvailable()) return null;

    try {
      const result = await this.pool!.query('SELECT * FROM companies WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching company:', error);
      return null;
    }
  }

  public async getCompanyByTicker(ticker: string): Promise<Company | null> {
    if (!this.isAvailable()) return null;

    try {
      const result = await this.pool!.query('SELECT * FROM companies WHERE ticker_symbol = $1', [ticker]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching company by ticker:', error);
      return null;
    }
  }

  public async searchCompanies(searchTerm: string, limit: number = 10): Promise<Company[]> {
    if (!this.isAvailable()) return [];

    try {
      const query = `
        SELECT * FROM companies 
        WHERE name ILIKE $1 OR ticker_symbol ILIKE $1 OR industry ILIKE $1 OR sector ILIKE $1
        ORDER BY name
        LIMIT $2
      `;
      const result = await this.pool!.query(query, [`%${searchTerm}%`, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error searching companies:', error);
      return [];
    }
  }

  // Financial Statements
  public async saveFinancialStatement(statement: FinancialStatement): Promise<FinancialStatement | null> {
    if (!this.isAvailable()) return null;

    try {
      const query = `
        INSERT INTO financial_statements (company_id, statement_type, period_end, period_type, fiscal_year, fiscal_quarter, currency, data, source)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (company_id, statement_type, period_end, period_type)
        DO UPDATE SET data = $8, source = $9, updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      const values = [
        statement.company_id,
        statement.statement_type,
        statement.period_end,
        statement.period_type,
        statement.fiscal_year,
        statement.fiscal_quarter,
        statement.currency || 'USD',
        JSON.stringify(statement.data),
        statement.source
      ];

      const result = await this.pool!.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error saving financial statement:', error);
      return null;
    }
  }

  public async getFinancialStatements(companyId: number, statementType?: string, limit: number = 10): Promise<FinancialStatement[]> {
    if (!this.isAvailable()) return [];

    try {
      let query = `
        SELECT * FROM financial_statements 
        WHERE company_id = $1
      `;
      const values: any[] = [companyId];

      if (statementType) {
        query += ' AND statement_type = $2';
        values.push(statementType);
      }

      query += ' ORDER BY period_end DESC LIMIT $' + (values.length + 1);
      values.push(limit);

      const result = await this.pool!.query(query, values);
      return result.rows.map((row: any) => ({
        ...row,
        data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
      }));
    } catch (error) {
      console.error('Error fetching financial statements:', error);
      return [];
    }
  }

  // Financial Ratios
  public async saveFinancialRatios(ratios: FinancialRatios): Promise<FinancialRatios | null> {
    if (!this.isAvailable()) return null;

    try {
      const fields = Object.keys(ratios).filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at');
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      const values = fields.map(field => (ratios as any)[field]);

      const query = `
        INSERT INTO financial_ratios (${fields.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT (company_id, period_end)
        DO UPDATE SET ${fields.slice(2).map((field, index) => `${field} = $${index + 3}`).join(', ')}, updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;

      const result = await this.pool!.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error saving financial ratios:', error);
      return null;
    }
  }

  public async getFinancialRatios(companyId: number, limit: number = 10): Promise<FinancialRatios[]> {
    if (!this.isAvailable()) return [];

    try {
      const result = await this.pool!.query(
        'SELECT * FROM financial_ratios WHERE company_id = $1 ORDER BY period_end DESC LIMIT $2',
        [companyId, limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching financial ratios:', error);
      return [];
    }
  }

  // Analysis Results
  public async saveAnalysisResult(analysis: AnalysisResult): Promise<AnalysisResult | null> {
    if (!this.isAvailable()) return null;

    try {
      const query = `
        INSERT INTO analysis_results (company_id, analysis_type, input_data, results, confidence_score, strategic_fit_score, risk_assessment, recommendations, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const values = [
        analysis.company_id,
        analysis.analysis_type,
        JSON.stringify(analysis.input_data),
        JSON.stringify(analysis.results),
        analysis.confidence_score,
        analysis.strategic_fit_score,
        analysis.risk_assessment,
        JSON.stringify(analysis.recommendations),
        analysis.created_by
      ];

      const result = await this.pool!.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error saving analysis result:', error);
      return null;
    }
  }

  public async getAnalysisResults(companyId: number, analysisType?: string, limit: number = 10): Promise<AnalysisResult[]> {
    if (!this.isAvailable()) return [];

    try {
      let query = `
        SELECT * FROM analysis_results 
        WHERE company_id = $1
      `;
      const values: any[] = [companyId];

      if (analysisType) {
        query += ' AND analysis_type = $2';
        values.push(analysisType);
      }

      query += ' ORDER BY analysis_date DESC LIMIT $' + (values.length + 1);
      values.push(limit);

      const result = await this.pool!.query(query, values);
      return result.rows.map((row: any) => ({
        ...row,
        input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
        results: typeof row.results === 'string' ? JSON.parse(row.results) : row.results,
        recommendations: typeof row.recommendations === 'string' ? JSON.parse(row.recommendations) : row.recommendations
      }));
    } catch (error) {
      console.error('Error fetching analysis results:', error);
      return [];
    }
  }

  // Utility Methods
  public async executeQuery(query: string, values?: any[]): Promise<any> {
    if (!this.isAvailable()) return null;

    try {
      const result = await this.pool!.query(query, values);
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      return null;
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
    }
  }
}

// Singleton instance
export const databaseService = new DatabaseService(); 