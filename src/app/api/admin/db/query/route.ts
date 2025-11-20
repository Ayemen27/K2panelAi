import { NextRequest, NextResponse } from 'next/server';
import { queryService } from '@/server/db-admin/QueryService';
import { requireAdminAuth } from '@/lib/auth/api-auth';

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { query, timeout } = body;

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query is required',
      }, { status: 400 });
    }

    const result = await queryService.executeQuery(query, timeout);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const history = queryService.getQueryHistory(50);

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
