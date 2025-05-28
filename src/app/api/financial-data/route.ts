// Financial Data API endpoint for AFAS MVP
// This adds enterprise financial data management without affecting existing chat functionality

import { NextRequest, NextResponse } from 'next/server';
import { databaseService, FinancialStatement, FinancialRatios } from '@/services/database/DatabaseService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const type = searchParams.get('type'); // 'statements' or 'ratios'
    const statementType = searchParams.get('statementType'); // 'income', 'balance', 'cashflow'
    const limit = parseInt(searchParams.get('limit') || '10');

    // If database is not available, return graceful fallback
    if (!databaseService.isAvailable()) {
      return NextResponse.json({
        message: 'Database not configured. Financial data features are disabled.',
        data: []
      }, { status: 200 });
    }

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const companyIdNum = parseInt(companyId);

    if (type === 'ratios') {
      const ratios = await databaseService.getFinancialRatios(companyIdNum, limit);
      return NextResponse.json({
        data: ratios,
        type: 'ratios',
        count: ratios.length
      });
    } else {
      // Default to financial statements
      const statements = await databaseService.getFinancialStatements(companyIdNum, statementType || undefined, limit);
      return NextResponse.json({
        data: statements,
        type: 'statements',
        count: statements.length
      });
    }

  } catch (error) {
    console.error('Error in financial-data API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // If database is not available, return graceful fallback
    if (!databaseService.isAvailable()) {
      return NextResponse.json({
        error: 'Database not configured. Financial data features are disabled.'
      }, { status: 503 });
    }

    const { type, data } = await request.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      );
    }

    if (type === 'statement') {
      const statement: FinancialStatement = data;
      
      // Basic validation
      if (!statement.company_id || !statement.statement_type || !statement.period_end || !statement.data) {
        return NextResponse.json(
          { error: 'Missing required fields for financial statement' },
          { status: 400 }
        );
      }

      const result = await databaseService.saveFinancialStatement(statement);
      
      if (!result) {
        return NextResponse.json(
          { error: 'Failed to save financial statement' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        statement: result,
        message: 'Financial statement saved successfully'
      }, { status: 201 });

    } else if (type === 'ratios') {
      const ratios: FinancialRatios = data;
      
      // Basic validation
      if (!ratios.company_id || !ratios.period_end) {
        return NextResponse.json(
          { error: 'Company ID and period end are required for financial ratios' },
          { status: 400 }
        );
      }

      const result = await databaseService.saveFinancialRatios(ratios);
      
      if (!result) {
        return NextResponse.json(
          { error: 'Failed to save financial ratios' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ratios: result,
        message: 'Financial ratios saved successfully'
      }, { status: 201 });

    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "statement" or "ratios"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error saving financial data:', error);
    return NextResponse.json(
      { error: 'Failed to save financial data' },
      { status: 500 }
    );
  }
} 