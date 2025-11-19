import { NextResponse } from 'next/server';
import { migrate, checkDatabase } from '@/lib/db/migrate';

/**
 * API endpoint لتطبيق Database Schema + Migrations
 * POST /api/db/migrate
 */
export async function POST() {
  try {
    const result = await migrate();
    const tables = await checkDatabase();
    
    return NextResponse.json({
      status: result.success ? 'success' : 'partial',
      message: result.message,
      migrations: result.migrations,
      errors: result.errors,
      tables: tables.map((t: any) => t.table_name)
    }, { status: result.success ? 200 : 500 });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: '❌ فشل في تطبيق Schema',
      error: error.message
    }, { status: 500 });
  }
}

/**
 * GET /api/db/migrate - عرض الجداول الحالية
 */
export async function GET() {
  try {
    const tables = await checkDatabase();
    
    return NextResponse.json({
      status: 'success',
      tables: tables.map((t: any) => t.table_name)
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: '❌ فشل في قراءة الجداول',
      error: error.message
    }, { status: 500 });
  }
}
