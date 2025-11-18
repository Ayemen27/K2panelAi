import { NextResponse } from 'next/server';
import { adminAuth, firestore } from '../../../../firebase/admin';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

export async function GET(req: Request) {
  try {
    // التحقق من وجود adminAuth و firestore
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Admin Auth is not initialized' },
        { status: 500 }
      );
    }

    if (!firestore) {
      return NextResponse.json(
        { error: 'Firestore is not initialized' },
        { status: 500 }
      );
    }

    // الحصول على ID token من الهيدر
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // التحقق من صلاحية التوكن
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // الحصول على بيانات المستخدم من Firestore
    const userDoc = await firestore.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const stripeCustomerId = userData?.stripeCustomerId;
    if (!stripeCustomerId) {
      return NextResponse.json({ subscriptionStatus: 'none' }, { status: 200 });
    }

    // جلب الاشتراك من Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    const subscription = subscriptions.data[0] || null;
    const subscriptionStatus = subscription?.status || 'none';

    return NextResponse.json({ subscriptionStatus }, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}