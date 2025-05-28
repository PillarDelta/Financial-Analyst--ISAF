// Companies API endpoint for AFAS MVP
// This adds enterprise company management without affecting existing chat functionality

import { NextRequest, NextResponse } from 'next/server';
import { databaseService, Company } from '@/services/database/DatabaseService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const ticker = searchParams.get('ticker');
    const id = searchParams.get('id');

    // If database is not available, return graceful fallback
    if (!databaseService.isAvailable()) {
      return NextResponse.json({
        message: 'Database not configured. Company management features are disabled.',
        companies: []
      }, { status: 200 });
    }

    let companies: Company[] = [];

    if (id) {
      const company = await databaseService.getCompany(parseInt(id));
      companies = company ? [company] : [];
    } else if (ticker) {
      const company = await databaseService.getCompanyByTicker(ticker);
      companies = company ? [company] : [];
    } else if (search) {
      companies = await databaseService.searchCompanies(search);
    } else {
      // Return empty array for now - could implement pagination later
      companies = [];
    }

    return NextResponse.json({
      companies,
      count: companies.length
    });

  } catch (error) {
    console.error('Error in companies API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // If database is not available, return graceful fallback
    if (!databaseService.isAvailable()) {
      return NextResponse.json({
        error: 'Database not configured. Company management features are disabled.'
      }, { status: 503 });
    }

    const companyData: Company = await request.json();

    // Basic validation
    if (!companyData.name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    const company = await databaseService.createCompany(companyData);

    if (!company) {
      return NextResponse.json(
        { error: 'Failed to create company' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      company,
      message: 'Company created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
} 