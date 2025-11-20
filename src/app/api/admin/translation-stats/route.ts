
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { translationRepository } from '@/lib/db/repositories/TranslationRepository';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const [stats, keyStats, errors, operations] = await Promise.all([
      translationRepository.getStatistics(),
      translationRepository.getKeyStats(),
      translationRepository.getErrors(false),
      translationRepository.getOperations({ page: 1, perPage: 10 }),
    ]);

    return NextResponse.json({
      stats,
      keyStats,
      errors,
      recentOperations: operations.data,
    });

  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
