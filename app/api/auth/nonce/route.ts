import { generateNonce } from '@/lib/authUtils';

declare global {
  var nonceStore: Map<string, string> | undefined
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address')?.toLowerCase();
  
  if (!address) {
    return Response.json({ error: 'Address required' }, { status: 400 });
  }

  const nonce = generateNonce();
  // Store nonce in global scope
  global.nonceStore = global.nonceStore || new Map();
  global.nonceStore.set(address, nonce);
  
  return Response.json({ nonce });
}
