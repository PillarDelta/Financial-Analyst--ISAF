# API Documentation

##  **Overview**

The Financial Analyst Strategic Analyst Platform provides RESTful APIs for integrating advanced strategic analysis capabilities into your applications. This documentation covers all available endpoints, authentication, request/response formats, and integration examples.

**Base URL**: `http://localhost:3000/api` (development) or `https://your-domain.com/api` (production)

---

##  **Authentication**

### **Current Version (1.0)**
- **No authentication required** for basic analysis endpoints
- **Optional database features** require environment configuration
- **Rate limiting** may apply in production environments

### **Future Versions**
- API key authentication for production use
- User-based access controls
- Usage analytics and quotas

---

##  **Core Analysis Endpoints**

### **POST /api/chat**

Performs comprehensive strategic analysis using the ISAF-V2 engine.

#### **Request Format**
```json
{
  "content": "string",           // Required: Text content to analyze
  "analysisType": "string",     // Optional: "isaf", "financial", or auto-detect
  "documents": [                // Optional: Array of documents
    {
      "content": "string",      // Text content of document
      "imageUrl": "string",     // Base64 image data or URL
      "filename": "string"      // Original filename
    }
  ]
}
```

#### **Response Format**
```json
{
  "content": "string"          // Formatted analysis results
}
```

#### **Example Request**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Analyze Tesla'\''s strategic position in the electric vehicle market",
    "analysisType": "isaf"
  }'
```

#### **Example Response**
```json
{
  "content": "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nINTEGRATED STRATEGIC ANALYSIS REPORT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nEXECUTIVE SUMMARY\nTesla operates in Electric Vehicles, Automotive sectors with a complex strategic landscape...\n\nStrategic fit score: 78.5%\n\nKEY FINDINGS\n• Strategic Factor Analysis: The most significant strategic factors are...\n\nSTRATEGIC RECOMMENDATIONS\n1. Market Leadership Consolidation (85% confidence)\n   • Leverage first-mover advantage in premium EV segment...\n"
}
```

#### **Analysis Types**

| Type | Description | Best For |
|------|-------------|----------|
| `isaf` | Comprehensive strategic analysis using PESTEL, Five Forces, SWOT | Strategic planning, competitive analysis |
| `financial` | Financial health assessment with ratios | Due diligence, investment analysis |
| `auto` | Automatically detects best analysis type | General purpose analysis |

---

## 🏢 **Enterprise Endpoints**

### **GET /api/companies**

Retrieve company information from the database.

#### **Query Parameters**
- `search`: Search companies by name, ticker, or industry
- `ticker`: Get specific company by ticker symbol
- `id`: Get specific company by ID
- `limit`: Maximum number of results (default: 10)

#### **Example Request**
```bash
curl "http://localhost:3000/api/companies?search=Apple&limit=5"
```

#### **Response Format**
```json
{
  "companies": [
    {
      "id": 1,
      "name": "Apple Inc.",
      "ticker_symbol": "AAPL",
      "industry": "Technology",
      "sector": "Consumer Electronics",
      "market_cap": 3000000000000,
      "country": "US",
      "employees": 164000,
      "founded_year": 1976,
      "created_at": "2025-01-09T10:00:00Z"
    }
  ],
  "count": 1
}
```

### **POST /api/companies**

Create a new company record.

#### **Request Format**
```json
{
  "name": "string",              // Required
  "ticker_symbol": "string",     // Optional
  "industry": "string",          // Optional
  "sector": "string",            // Optional
  "market_cap": number,          // Optional
  "country": "string",           // Optional, default: "US"
  "exchange": "string",          // Optional
  "description": "string",       // Optional
  "website": "string",           // Optional
  "employees": number,           // Optional
  "founded_year": number         // Optional
}
```

### **GET /api/financial-data**

Retrieve financial data and ratios.

#### **Query Parameters**
- `companyId`: Company ID (required)
- `type`: "statements" or "ratios" (default: "statements")
- `statementType`: "income", "balance", or "cashflow" (for statements)
- `limit`: Maximum number of records (default: 10)

#### **Example Request**
```bash
curl "http://localhost:3000/api/financial-data?companyId=1&type=ratios&limit=5"
```

### **POST /api/financial-data**

Store financial statements or calculated ratios.

#### **Request Format**
```json
{
  "type": "statement",          // "statement" or "ratios"
  "data": {
    "company_id": 1,
    "statement_type": "income",  // "income", "balance", "cashflow"
    "period_end": "2023-12-31",
    "period_type": "annual",     // "annual", "quarterly", "monthly"
    "currency": "USD",
    "data": {
      "revenue": 1000000,
      "netIncome": 150000,
      "totalAssets": 2000000
      // ... other financial data
    }
  }
}
```

---

## **Financial Analysis Integration**

### **Using the Financial Analysis Engine**

```javascript
// Example: Integrate financial analysis in your application
const analyzeCompanyFinancials = async (financialData) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: `Analyze the financial health of this company: ${JSON.stringify(financialData)}`,
      analysisType: 'financial'
    })
  });
  
  const result = await response.json();
  return result.content;
};
```

### **Financial Ratios Available**

The platform calculates 25+ financial ratios including:

#### **Liquidity Ratios**
- Current Ratio
- Quick Ratio
- Cash Ratio
- Operating Cash Flow Ratio

#### **Profitability Ratios**
- Gross Margin
- Operating Margin
- Net Margin
- Return on Equity (ROE)
- Return on Assets (ROA)

#### **Efficiency Ratios**
- Asset Turnover
- Inventory Turnover
- Receivables Turnover

#### **Leverage Ratios**
- Debt-to-Equity
- Debt-to-Assets
- Interest Coverage

#### **Market Ratios**
- Price-to-Earnings (P/E)
- Price-to-Book (P/B)
- Dividend Yield

---

##  **Document Processing**

### **Supported Formats**

| Format | Extension | Max Size | Notes |
|--------|-----------|----------|-------|
| PDF | `.pdf` | 10MB | Text extraction and analysis |
| Excel | `.xlsx`, `.xls` | 10MB | Financial data processing |
| Word | `.docx` | 10MB | Text extraction |
| Images | `.png`, `.jpg`, `.jpeg` | 5MB | OCR and chart analysis |

### **Document Upload Example**

```javascript
const analyzeDocument = async (file) => {
  const formData = new FormData();
  formData.append('document', file);
  
  // Convert to base64 for API
  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Data = e.target.result;
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: 'Analyze this document',
        documents: [{
          imageUrl: base64Data,
          filename: file.name
        }]
      })
    });
    
    const result = await response.json();
    return result.content;
  };
  
  reader.readAsDataURL(file);
};
```

---

## 🔧 **Error Handling**

### **HTTP Status Codes**

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Invalid or missing API key (future) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server processing error |
| 503 | Service Unavailable | Database or external service unavailable |

### **Error Response Format**

```json
{
  "error": "string",            // Error message
  "details": "string",          // Additional error details
  "code": "string"              // Error code (optional)
}
```

### **Common Errors**

#### **Invalid OpenAI API Key**
```json
{
  "error": "OpenAI API key invalid or missing",
  "details": "Please provide a valid key in .env.local"
}
```

#### **Database Unavailable**
```json
{
  "error": "Database not configured",
  "details": "Company management features are disabled."
}
```

#### **Rate Limit Exceeded**
```json
{
  "error": "API rate limit exceeded",
  "details": "Please wait before making another request"
}
```

---

## 🚀 **Integration Examples**

### **React/Next.js Integration**

```jsx
import { useState } from 'react';

const StrategicAnalysis = () => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeStrategy = async (question) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: question,
          analysisType: 'isaf'
        })
      });

      const result = await response.json();
      setAnalysis(result.content);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => analyzeStrategy('Analyze Tesla\'s strategy')}>
        Analyze Tesla
      </button>
      {loading && <p>Analyzing...</p>}
      {analysis && <pre>{analysis}</pre>}
    </div>
  );
};
```

### **Node.js Backend Integration**

```javascript
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Proxy endpoint for strategic analysis
app.post('/analyze', async (req, res) => {
  try {
    const { company, question } = req.body;
    
    const response = await axios.post('http://localhost:3000/api/chat', {
      content: `${question} for ${company}`,
      analysisType: 'isaf'
    });
    
    res.json({
      company,
      analysis: response.data.content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Analysis service running on port 3001');
});
```

### **Python Integration**

```python
import requests
import json

class StrategicAnalyzer:
    def __init__(self, base_url="http://localhost:3000/api"):
        self.base_url = base_url
    
    def analyze_strategy(self, content, analysis_type="isaf"):
        """Perform strategic analysis"""
        url = f"{self.base_url}/chat"
        payload = {
            "content": content,
            "analysisType": analysis_type
        }
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        return response.json()["content"]
    
    def get_company(self, ticker):
        """Get company information"""
        url = f"{self.base_url}/companies"
        params = {"ticker": ticker}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        companies = response.json()["companies"]
        return companies[0] if companies else None

# Usage example
analyzer = StrategicAnalyzer()
analysis = analyzer.analyze_strategy("Analyze Apple's competitive position")
print(analysis)
```

---

## 📊 **Data Validation**

### **Input Validation**

The API includes comprehensive data validation:

```javascript
// Example: Validate company data before submission
const validateCompany = (companyData) => {
  const response = await fetch('/api/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Validation failed:', error.details);
    return false;
  }
  
  return true;
};
```

### **Data Quality Assessment**

```javascript
// The platform provides data quality scoring
const assessDataQuality = (analysisResult) => {
  // Look for quality indicators in the response
  const hasHighConfidence = analysisResult.includes('high-confidence');
  const hasStrategicScore = /strategic fit score: \d+/.test(analysisResult);
  const hasRecommendations = analysisResult.includes('STRATEGIC RECOMMENDATIONS');
  
  return {
    confidence: hasHighConfidence ? 'high' : 'medium',
    completeness: hasStrategicScore && hasRecommendations ? 'complete' : 'partial'
  };
};
```

---

##  **Webhooks (Coming Soon)**

### **Event Types**
- `analysis.completed` - Analysis finished processing
- `company.created` - New company added to database
- `financial.updated` - Financial data updated

### **Webhook Format**
```json
{
  "event": "analysis.completed",
  "timestamp": "2025-01-09T10:00:00Z",
  "data": {
    "analysisId": "uuid",
    "type": "isaf",
    "status": "completed",
    "results": "..."
  }
}
```

---

## 📈 **Rate Limits**

### **Current Limits**
- **Development**: No limits
- **Production**: 100 requests per 15 minutes per IP

### **Rate Limit Headers**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641734400
```

---

##  **Testing**

### **Test Endpoints**

```bash
# Health check
curl http://localhost:3000/api/health

# Test analysis
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"content": "Test analysis", "analysisType": "isaf"}'

# Test company search
curl "http://localhost:3000/api/companies?search=test"
```

### **Test Data**

The platform includes sample data for testing:

```javascript
const testCompany = {
  name: "Test Company Inc.",
  ticker_symbol: "TEST",
  industry: "Technology",
  sector: "Software",
  market_cap: 1000000000,
  employees: 5000,
  founded_year: 2000
};

const testFinancialData = {
  revenue: 1000000,
  netIncome: 150000,
  totalAssets: 2000000,
  currentAssets: 800000,
  currentLiabilities: 400000,
  shareholdersEquity: 800000
};
```

---

##  **SDK Development**

### **JavaScript/TypeScript SDK**

```typescript
interface AnalysisOptions {
  content: string;
  analysisType?: 'isaf' | 'financial' | 'auto';
  documents?: Document[];
}

interface AnalysisResult {
  content: string;
  confidence?: string;
  strategicScore?: number;
}

class StrategicAnalystSDK {
  constructor(private baseUrl: string = 'http://localhost:3000/api') {}
  
  async analyze(options: AnalysisOptions): Promise<AnalysisResult> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    
    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

---

##  **Roadmap**

### **Version 1.1 (Q2 2025)**
- API key authentication
- Webhook support
- Batch processing endpoints
- Enhanced error reporting

### **Version 1.2 (Q3 2025)**
- GraphQL API
- Real-time analysis streaming
- Custom framework endpoints
- Advanced filtering and search

### **Version 2.0 (Q4 2025)**
- Machine learning model endpoints
- Predictive analytics API
- Industry benchmarking API
- Multi-tenant support

---

##  **Support**

### **API Support**
- **Documentation**: This guide and inline API docs
- **GitHub Issues**: Report bugs and request features
- **Community**: Developer forum (coming soon)

### **Integration Help**
- **Sample Code**: Available in multiple languages
- **Best Practices**: Performance and security guidelines
- **Migration Guides**: Upgrading between versions

---

** Ready to integrate strategic analysis into your application? Start with the `/api/chat` endpoint and explore the possibilities!** 
