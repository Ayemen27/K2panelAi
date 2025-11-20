import { NextResponse } from 'next/server';
import { databaseIntrospector } from '@/server/db-admin/DatabaseIntrospector';

export async function GET() {
  try {
    const tables = await databaseIntrospector.getAllTables();
    
    const tablesWithInfo = await Promise.all(
      tables.map(async (table) => {
        const info = await databaseIntrospector.getTableInfo(table);
        return info;
      })
    );

    return NextResponse.json({
      success: true,
      tables: tablesWithInfo,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
