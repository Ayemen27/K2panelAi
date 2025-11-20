import { NextRequest, NextResponse } from 'next/server';
import { healthService } from '@/server/db-admin/HealthService';
import { requireAdminAuth } from '@/lib/auth/api-auth';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const result = await healthService.runFullHealthCheck();

    return NextResponse.json({
      success: true,
      health: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
