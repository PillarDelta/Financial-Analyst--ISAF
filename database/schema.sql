-- AFAS MVP Database Schema
-- This schema adds enterprise database capabilities without affecting existing functionality

-- Companies table for corporate financial analysis
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    ticker_symbol VARCHAR(10),
    industry VARCHAR(100),
    sector VARCHAR(100),
    market_cap DECIMAL(15,2),
    country VARCHAR(50) DEFAULT 'US',
    exchange VARCHAR(50),
    description TEXT,
    website VARCHAR(255),
    employees INTEGER,
    founded_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial statements storage (income, balance sheet, cash flow)
CREATE TABLE IF NOT EXISTS financial_statements (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    statement_type VARCHAR(20) CHECK (statement_type IN ('income', 'balance', 'cashflow')),
    period_end DATE NOT NULL,
    period_type VARCHAR(10) CHECK (period_type IN ('annual', 'quarterly', 'monthly')),
    fiscal_year INTEGER,
    fiscal_quarter INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    data JSONB NOT NULL,
    source VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, statement_type, period_end, period_type)
);

-- Calculated financial ratios and metrics
CREATE TABLE IF NOT EXISTS financial_ratios (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    period_end DATE NOT NULL,
    
    -- Liquidity Ratios
    current_ratio DECIMAL(10,4),
    quick_ratio DECIMAL(10,4),
    cash_ratio DECIMAL(10,4),
    operating_cash_flow_ratio DECIMAL(10,4),
    
    -- Profitability Ratios
    gross_margin DECIMAL(10,4),
    operating_margin DECIMAL(10,4),
    net_margin DECIMAL(10,4),
    ebitda_margin DECIMAL(10,4),
    roe DECIMAL(10,4),
    roa DECIMAL(10,4),
    roic DECIMAL(10,4),
    
    -- Efficiency Ratios
    asset_turnover DECIMAL(10,4),
    inventory_turnover DECIMAL(10,4),
    receivables_turnover DECIMAL(10,4),
    payables_turnover DECIMAL(10,4),
    
    -- Leverage Ratios
    debt_to_equity DECIMAL(10,4),
    debt_to_assets DECIMAL(10,4),
    debt_to_capital DECIMAL(10,4),
    interest_coverage DECIMAL(10,4),
    debt_service_coverage DECIMAL(10,4),
    
    -- Market Ratios
    pe_ratio DECIMAL(10,4),
    pb_ratio DECIMAL(10,4),
    ps_ratio DECIMAL(10,4),
    ev_ebitda DECIMAL(10,4),
    dividend_yield DECIMAL(10,4),
    
    -- Growth Ratios
    revenue_growth DECIMAL(10,4),
    earnings_growth DECIMAL(10,4),
    dividend_growth DECIMAL(10,4),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, period_end)
);

-- Industry benchmarks for comparison
CREATE TABLE IF NOT EXISTS industry_benchmarks (
    id SERIAL PRIMARY KEY,
    industry VARCHAR(100) NOT NULL,
    sector VARCHAR(100),
    metric_name VARCHAR(100) NOT NULL,
    period_end DATE NOT NULL,
    percentile_10 DECIMAL(10,4),
    percentile_25 DECIMAL(10,4),
    percentile_50 DECIMAL(10,4),
    percentile_75 DECIMAL(10,4),
    percentile_90 DECIMAL(10,4),
    average DECIMAL(10,4),
    median DECIMAL(10,4),
    sample_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(industry, metric_name, period_end)
);

-- Store ISAF analysis results
CREATE TABLE IF NOT EXISTS analysis_results (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50) NOT NULL,
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    input_data JSONB,
    results JSONB NOT NULL,
    confidence_score DECIMAL(3,2),
    strategic_fit_score DECIMAL(5,2),
    risk_assessment TEXT,
    recommendations JSONB,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions and preferences (for future user management)
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_data JSONB,
    preferences JSONB,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Performance indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_companies_ticker ON companies(ticker_symbol);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_sector ON companies(sector);
CREATE INDEX IF NOT EXISTS idx_financial_statements_company_period ON financial_statements(company_id, period_end DESC);
CREATE INDEX IF NOT EXISTS idx_financial_statements_type ON financial_statements(statement_type);
CREATE INDEX IF NOT EXISTS idx_financial_ratios_company_period ON financial_ratios(company_id, period_end DESC);
CREATE INDEX IF NOT EXISTS idx_industry_benchmarks_industry_metric ON industry_benchmarks(industry, metric_name);
CREATE INDEX IF NOT EXISTS idx_analysis_results_company_type ON analysis_results(company_id, analysis_type);
CREATE INDEX IF NOT EXISTS idx_analysis_results_date ON analysis_results(analysis_date DESC);

-- Sample data for testing (optional)
INSERT INTO companies (name, ticker_symbol, industry, sector, market_cap) VALUES
('Apple Inc.', 'AAPL', 'Technology', 'Consumer Electronics', 3000000000000),
('Microsoft Corporation', 'MSFT', 'Technology', 'Software', 2800000000000),
('Amazon.com Inc.', 'AMZN', 'Consumer Discretionary', 'E-commerce', 1500000000000),
('Alphabet Inc.', 'GOOGL', 'Technology', 'Internet Services', 1700000000000),
('Tesla Inc.', 'TSLA', 'Consumer Discretionary', 'Automotive', 800000000000)
ON CONFLICT (name) DO NOTHING; 