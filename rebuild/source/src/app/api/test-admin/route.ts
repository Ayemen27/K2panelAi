import { adminAuth } from '@/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const listUsersResult = await adminAuth.listUsers(1);
    
    return NextResponse.json({ 
      success: true, 
      adminSDKInitialized: true,
      userCount: listUsersResult.users.length,
      message: 'Firebase Admin SDK is working correctly!' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      adminSDKInitialized: false,
      error: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
