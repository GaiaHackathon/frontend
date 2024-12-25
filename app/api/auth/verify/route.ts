import { NextResponse } from 'next/server';
import { verifySignature } from '@/lib/authUtils';

export async function POST(request: Request) {
  try {
    const { message, signature } = await request.json();
    const verified = await verifySignature(signature, message);
    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid nonce' }, 
        { status: 401 }
      );
    }
    return NextResponse.json({ 
      ok: true
    });
  } catch (error) {
    console.error('SIWE verification error:', error);
    return NextResponse.json(
      { error: 'Invalid signature' }, 
      { status: 401 }
    );
  }
}

