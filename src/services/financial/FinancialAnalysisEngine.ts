// Financial Analysis Engine for AFAS MVP
// This adds comprehensive financial analysis capabilities without affecting existing ISAF functionality

export interface FinancialData {
  // Income Statement
  revenue?: number;
  grossProfit?: number;
  operatingIncome?: number;
  netIncome?: number;
  ebitda?: number;
  interestExpense?: number;
  
  // Balance Sheet
  totalAssets?: number;
  currentAssets?: number;
  cash?: number;
  inventory?: number;
  accountsReceivable?: number;
  totalLiabilities?: number;
  currentLiabilities?: number;
  totalDebt?: number;
  accountsPayable?: number;
  shareholdersEquity?: number;
  
  // Cash Flow
  operatingCashFlow?: number;
  freeCashFlow?: number;
  
  // Market Data
  marketCap?: number;
  sharesOutstanding?: number;
  stockPrice?: number;
  dividendPerShare?: number;
  
  // Period Information
  periodEnd?: Date;
  periodType?: 'annual' | 'quarterly' | 'monthly';
}

export interface FinancialRatioResults {
  // Liquidity Ratios
  currentRatio?: number;
  quickRatio?: number;
  cashRatio?: number;
  operatingCashFlowRatio?: number;
  
  // Profitability Ratios
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;
  ebitdaMargin?: number;
  returnOnEquity?: number;
  returnOnAssets?: number;
  returnOnInvestedCapital?: number;
  
  // Efficiency Ratios
  assetTurnover?: number;
  inventoryTurnover?: number;
  receivablesTurnover?: number;
  payablesTurnover?: number;
  
  // Leverage Ratios
  debtToEquity?: number;
  debtToAssets?: number;
  debtToCapital?: number;
  interestCoverage?: number;
  debtServiceCoverage?: number;
  
  // Market Ratios
  priceToEarnings?: number;
  priceToBook?: number;
  priceToSales?: number;
  enterpriseValueToEbitda?: number;
  dividendYield?: number;
  
  // Growth Ratios (requires historical data)
  revenueGrowth?: number;
  earningsGrowth?: number;
  dividendGrowth?: number;
}

export interface IndustryBenchmark {
  industry: string;
  sector?: string;
  metric: string;
  percentile10?: number;
  percentile25?: number;
  median?: number;
  percentile75?: number;
  percentile90?: number;
  average?: number;
}

export interface AnalysisResult {
  ratios: FinancialRatioResults;
  benchmarkComparison?: BenchmarkComparison[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface BenchmarkComparison {
  metric: string;
  companyValue: number;
  industryMedian: number;
  industryAverage: number;
  percentileRank: number;
  performance: 'Excellent' | 'Above Average' | 'Average' | 'Below Average' | 'Poor';
}

export class FinancialAnalysisEngine {
  
  /**
   * Calculate comprehensive financial ratios from financial data
   */
  public calculateRatios(data: FinancialData): FinancialRatioResults {
    const ratios: FinancialRatioResults = {};
    
    // Liquidity Ratios
    if (data.currentAssets && data.currentLiabilities) {
      ratios.currentRatio = this.safeDivide(data.currentAssets, data.currentLiabilities);
    }
    
    if (data.currentAssets && data.inventory && data.currentLiabilities) {
      ratios.quickRatio = this.safeDivide(data.currentAssets - data.inventory, data.currentLiabilities);
    }
    
    if (data.cash && data.currentLiabilities) {
      ratios.cashRatio = this.safeDivide(data.cash, data.currentLiabilities);
    }
    
    if (data.operatingCashFlow && data.currentLiabilities) {
      ratios.operatingCashFlowRatio = this.safeDivide(data.operatingCashFlow, data.currentLiabilities);
    }
    
    // Profitability Ratios
    if (data.grossProfit && data.revenue) {
      ratios.grossMargin = this.safeDivide(data.grossProfit, data.revenue) * 100;
    }
    
    if (data.operatingIncome && data.revenue) {
      ratios.operatingMargin = this.safeDivide(data.operatingIncome, data.revenue) * 100;
    }
    
    if (data.netIncome && data.revenue) {
      ratios.netMargin = this.safeDivide(data.netIncome, data.revenue) * 100;
    }
    
    if (data.ebitda && data.revenue) {
      ratios.ebitdaMargin = this.safeDivide(data.ebitda, data.revenue) * 100;
    }
    
    if (data.netIncome && data.shareholdersEquity) {
      ratios.returnOnEquity = this.safeDivide(data.netIncome, data.shareholdersEquity) * 100;
    }
    
    if (data.netIncome && data.totalAssets) {
      ratios.returnOnAssets = this.safeDivide(data.netIncome, data.totalAssets) * 100;
    }
    
    if (data.netIncome && data.shareholdersEquity && data.totalDebt) {
      const investedCapital = data.shareholdersEquity + data.totalDebt;
      ratios.returnOnInvestedCapital = this.safeDivide(data.netIncome, investedCapital) * 100;
    }
    
    // Efficiency Ratios
    if (data.revenue && data.totalAssets) {
      ratios.assetTurnover = this.safeDivide(data.revenue, data.totalAssets);
    }
    
    if (data.revenue && data.inventory) {
      ratios.inventoryTurnover = this.safeDivide(data.revenue, data.inventory);
    }
    
    if (data.revenue && data.accountsReceivable) {
      ratios.receivablesTurnover = this.safeDivide(data.revenue, data.accountsReceivable);
    }
    
    if (data.revenue && data.accountsPayable) {
      ratios.payablesTurnover = this.safeDivide(data.revenue, data.accountsPayable);
    }
    
    // Leverage Ratios
    if (data.totalDebt && data.shareholdersEquity) {
      ratios.debtToEquity = this.safeDivide(data.totalDebt, data.shareholdersEquity);
    }
    
    if (data.totalDebt && data.totalAssets) {
      ratios.debtToAssets = this.safeDivide(data.totalDebt, data.totalAssets);
    }
    
    if (data.totalDebt && data.shareholdersEquity) {
      const totalCapital = data.totalDebt + data.shareholdersEquity;
      ratios.debtToCapital = this.safeDivide(data.totalDebt, totalCapital);
    }
    
    if (data.operatingIncome && data.interestExpense) {
      ratios.interestCoverage = this.safeDivide(data.operatingIncome, data.interestExpense);
    }
    
    if (data.operatingCashFlow && data.interestExpense) {
      ratios.debtServiceCoverage = this.safeDivide(data.operatingCashFlow, data.interestExpense);
    }
    
    // Market Ratios
    if (data.stockPrice && data.netIncome && data.sharesOutstanding) {
      const earningsPerShare = this.safeDivide(data.netIncome, data.sharesOutstanding);
      ratios.priceToEarnings = this.safeDivide(data.stockPrice, earningsPerShare);
    }
    
    if (data.marketCap && data.shareholdersEquity) {
      ratios.priceToBook = this.safeDivide(data.marketCap, data.shareholdersEquity);
    }
    
    if (data.marketCap && data.revenue) {
      ratios.priceToSales = this.safeDivide(data.marketCap, data.revenue);
    }
    
    if (data.marketCap && data.totalDebt && data.cash && data.ebitda) {
      const enterpriseValue = data.marketCap + data.totalDebt - data.cash;
      ratios.enterpriseValueToEbitda = this.safeDivide(enterpriseValue, data.ebitda);
    }
    
    if (data.dividendPerShare && data.stockPrice) {
      ratios.dividendYield = this.safeDivide(data.dividendPerShare, data.stockPrice) * 100;
    }
    
    return ratios;
  }
  
  /**
   * Calculate growth rates from historical data
   */
  public calculateGrowthRates(currentData: FinancialData, previousData: FinancialData): Partial<FinancialRatioResults> {
    const growthRates: Partial<FinancialRatioResults> = {};
    
    if (currentData.revenue && previousData.revenue) {
      growthRates.revenueGrowth = this.calculateGrowthRate(previousData.revenue, currentData.revenue);
    }
    
    if (currentData.netIncome && previousData.netIncome) {
      growthRates.earningsGrowth = this.calculateGrowthRate(previousData.netIncome, currentData.netIncome);
    }
    
    if (currentData.dividendPerShare && previousData.dividendPerShare) {
      growthRates.dividendGrowth = this.calculateGrowthRate(previousData.dividendPerShare, currentData.dividendPerShare);
    }
    
    return growthRates;
  }
  
  /**
   * Perform comprehensive financial analysis
   */
  public analyzeFinancialHealth(
    data: FinancialData, 
    benchmarks?: IndustryBenchmark[]
  ): AnalysisResult {
    const ratios = this.calculateRatios(data);
    const benchmarkComparison = benchmarks ? this.compareToBenchmarks(ratios, benchmarks) : undefined;
    
    const strengths = this.identifyStrengths(ratios, benchmarkComparison);
    const weaknesses = this.identifyWeaknesses(ratios, benchmarkComparison);
    const recommendations = this.generateRecommendations(ratios, strengths, weaknesses);
    
    const overallScore = this.calculateOverallScore(ratios, benchmarkComparison);
    const riskLevel = this.assessRiskLevel(ratios);
    
    return {
      ratios,
      benchmarkComparison,
      strengths,
      weaknesses,
      recommendations,
      overallScore,
      riskLevel
    };
  }
  
  /**
   * Compare company ratios to industry benchmarks
   */
  private compareToBenchmarks(ratios: FinancialRatioResults, benchmarks: IndustryBenchmark[]): BenchmarkComparison[] {
    const comparisons: BenchmarkComparison[] = [];
    
    Object.entries(ratios).forEach(([metric, value]) => {
      if (value !== undefined && value !== null) {
        const benchmark = benchmarks.find(b => this.normalizeMetricName(b.metric) === this.normalizeMetricName(metric));
        
        if (benchmark && benchmark.median !== undefined) {
          const percentileRank = this.calculatePercentileRank(value, benchmark);
          const performance = this.getPerformanceRating(percentileRank);
          
          comparisons.push({
            metric,
            companyValue: value,
            industryMedian: benchmark.median,
            industryAverage: benchmark.average || benchmark.median,
            percentileRank,
            performance
          });
        }
      }
    });
    
    return comparisons;
  }
  
  /**
   * Identify financial strengths
   */
  private identifyStrengths(ratios: FinancialRatioResults, benchmarks?: BenchmarkComparison[]): string[] {
    const strengths: string[] = [];
    
    // Liquidity strengths
    if (ratios.currentRatio && ratios.currentRatio > 2) {
      strengths.push('Strong liquidity position with current ratio above 2.0');
    }
    
    if (ratios.quickRatio && ratios.quickRatio > 1) {
      strengths.push('Excellent quick liquidity without relying on inventory');
    }
    
    // Profitability strengths
    if (ratios.netMargin && ratios.netMargin > 15) {
      strengths.push('High net profit margin indicating efficient operations');
    }
    
    if (ratios.returnOnEquity && ratios.returnOnEquity > 15) {
      strengths.push('Strong return on equity demonstrating effective use of shareholder capital');
    }
    
    if (ratios.returnOnAssets && ratios.returnOnAssets > 10) {
      strengths.push('High return on assets showing efficient asset utilization');
    }
    
    // Efficiency strengths
    if (ratios.assetTurnover && ratios.assetTurnover > 1.5) {
      strengths.push('Efficient asset turnover generating strong revenue per dollar of assets');
    }
    
    // Leverage strengths
    if (ratios.debtToEquity && ratios.debtToEquity < 0.5) {
      strengths.push('Conservative debt levels providing financial flexibility');
    }
    
    if (ratios.interestCoverage && ratios.interestCoverage > 5) {
      strengths.push('Strong interest coverage providing debt service security');
    }
    
    // Benchmark-based strengths
    if (benchmarks) {
      benchmarks.forEach(benchmark => {
        if (benchmark.performance === 'Excellent' || benchmark.performance === 'Above Average') {
          strengths.push(`${benchmark.metric} performance above industry average`);
        }
      });
    }
    
    return strengths;
  }
  
  /**
   * Identify financial weaknesses
   */
  private identifyWeaknesses(ratios: FinancialRatioResults, benchmarks?: BenchmarkComparison[]): string[] {
    const weaknesses: string[] = [];
    
    // Liquidity weaknesses
    if (ratios.currentRatio && ratios.currentRatio < 1) {
      weaknesses.push('Low current ratio indicating potential liquidity concerns');
    }
    
    if (ratios.quickRatio && ratios.quickRatio < 0.5) {
      weaknesses.push('Poor quick ratio suggesting difficulty meeting short-term obligations');
    }
    
    // Profitability weaknesses
    if (ratios.netMargin && ratios.netMargin < 5) {
      weaknesses.push('Low net profit margin indicating operational inefficiencies');
    }
    
    if (ratios.returnOnEquity && ratios.returnOnEquity < 10) {
      weaknesses.push('Below-average return on equity suggesting suboptimal capital utilization');
    }
    
    // Leverage weaknesses
    if (ratios.debtToEquity && ratios.debtToEquity > 2) {
      weaknesses.push('High debt-to-equity ratio indicating elevated financial risk');
    }
    
    if (ratios.interestCoverage && ratios.interestCoverage < 2) {
      weaknesses.push('Low interest coverage raising concerns about debt service ability');
    }
    
    // Efficiency weaknesses
    if (ratios.assetTurnover && ratios.assetTurnover < 0.5) {
      weaknesses.push('Low asset turnover suggesting inefficient asset utilization');
    }
    
    // Benchmark-based weaknesses
    if (benchmarks) {
      benchmarks.forEach(benchmark => {
        if (benchmark.performance === 'Poor' || benchmark.performance === 'Below Average') {
          weaknesses.push(`${benchmark.metric} performance below industry standards`);
        }
      });
    }
    
    return weaknesses;
  }
  
  /**
   * Generate strategic recommendations
   */
  private generateRecommendations(
    ratios: FinancialRatioResults, 
    strengths: string[], 
    weaknesses: string[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Liquidity recommendations
    if (ratios.currentRatio && ratios.currentRatio < 1.5) {
      recommendations.push('Improve working capital management to enhance liquidity position');
    }
    
    // Profitability recommendations
    if (ratios.netMargin && ratios.netMargin < 10) {
      recommendations.push('Focus on cost optimization and operational efficiency improvements');
    }
    
    if (ratios.returnOnAssets && ratios.returnOnAssets < 8) {
      recommendations.push('Evaluate asset portfolio for optimization opportunities');
    }
    
    // Leverage recommendations
    if (ratios.debtToEquity && ratios.debtToEquity > 1.5) {
      recommendations.push('Consider debt reduction strategies to improve financial flexibility');
    }
    
    // Growth recommendations
    if (ratios.assetTurnover && ratios.assetTurnover < 1) {
      recommendations.push('Implement strategies to improve asset utilization and revenue generation');
    }
    
    // Strategic recommendations based on overall profile
    if (strengths.length > weaknesses.length) {
      recommendations.push('Leverage financial strengths to pursue growth opportunities');
    } else {
      recommendations.push('Address key financial weaknesses before pursuing aggressive growth');
    }
    
    return recommendations;
  }
  
  /**
   * Calculate overall financial health score (0-100)
   */
  private calculateOverallScore(ratios: FinancialRatioResults, benchmarks?: BenchmarkComparison[]): number {
    let score = 50; // Base score
    let factors = 0;
    
    // Liquidity scoring
    if (ratios.currentRatio) {
      score += this.scoreRatio(ratios.currentRatio, 1, 2, 3) * 0.15;
      factors++;
    }
    
    // Profitability scoring
    if (ratios.netMargin) {
      score += this.scoreRatio(ratios.netMargin, 0, 10, 20) * 0.25;
      factors++;
    }
    
    if (ratios.returnOnEquity) {
      score += this.scoreRatio(ratios.returnOnEquity, 0, 15, 25) * 0.20;
      factors++;
    }
    
    // Efficiency scoring
    if (ratios.assetTurnover) {
      score += this.scoreRatio(ratios.assetTurnover, 0.5, 1, 2) * 0.15;
      factors++;
    }
    
    // Leverage scoring (inverse - lower is better)
    if (ratios.debtToEquity) {
      score += this.scoreRatio(2 - ratios.debtToEquity, 0, 1, 1.5) * 0.15;
      factors++;
    }
    
    // Benchmark scoring
    if (benchmarks && benchmarks.length > 0) {
      const avgPercentile = benchmarks.reduce((sum, b) => sum + b.percentileRank, 0) / benchmarks.length;
      score += (avgPercentile - 50) * 0.10;
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Assess risk level based on financial ratios
   */
  private assessRiskLevel(ratios: FinancialRatioResults): 'Low' | 'Medium' | 'High' {
    let riskScore = 0;
    
    // Liquidity risk
    if (ratios.currentRatio && ratios.currentRatio < 1) riskScore += 2;
    else if (ratios.currentRatio && ratios.currentRatio < 1.5) riskScore += 1;
    
    // Leverage risk
    if (ratios.debtToEquity && ratios.debtToEquity > 2) riskScore += 2;
    else if (ratios.debtToEquity && ratios.debtToEquity > 1) riskScore += 1;
    
    // Profitability risk
    if (ratios.netMargin && ratios.netMargin < 0) riskScore += 2;
    else if (ratios.netMargin && ratios.netMargin < 5) riskScore += 1;
    
    // Interest coverage risk
    if (ratios.interestCoverage && ratios.interestCoverage < 2) riskScore += 2;
    else if (ratios.interestCoverage && ratios.interestCoverage < 5) riskScore += 1;
    
    if (riskScore >= 4) return 'High';
    if (riskScore >= 2) return 'Medium';
    return 'Low';
  }
  
  // Utility methods
  private safeDivide(numerator: number, denominator: number): number {
    return denominator === 0 ? 0 : numerator / denominator;
  }
  
  private calculateGrowthRate(oldValue: number, newValue: number): number {
    return oldValue === 0 ? 0 : ((newValue - oldValue) / oldValue) * 100;
  }
  
  private normalizeMetricName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  
  private calculatePercentileRank(value: number, benchmark: IndustryBenchmark): number {
    // Simple percentile calculation - could be enhanced with more sophisticated methods
    if (benchmark.percentile10 && value <= benchmark.percentile10) return 10;
    if (benchmark.percentile25 && value <= benchmark.percentile25) return 25;
    if (benchmark.median && value <= benchmark.median) return 50;
    if (benchmark.percentile75 && value <= benchmark.percentile75) return 75;
    if (benchmark.percentile90 && value <= benchmark.percentile90) return 90;
    return 95;
  }
  
  private getPerformanceRating(percentileRank: number): 'Excellent' | 'Above Average' | 'Average' | 'Below Average' | 'Poor' {
    if (percentileRank >= 90) return 'Excellent';
    if (percentileRank >= 75) return 'Above Average';
    if (percentileRank >= 25) return 'Average';
    if (percentileRank >= 10) return 'Below Average';
    return 'Poor';
  }
  
  private scoreRatio(value: number, min: number, target: number, max: number): number {
    if (value <= min) return 0;
    if (value >= max) return 50;
    if (value <= target) return (value - min) / (target - min) * 25;
    return 25 + (value - target) / (max - target) * 25;
  }
}

// Singleton instance
export const financialAnalysisEngine = new FinancialAnalysisEngine(); 