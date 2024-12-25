import { SiweMessage } from 'siwe';

export function createSiweMessage(address: string, nonce: string) {
  return new SiweMessage({
    domain: window.location.host,
    address,
    statement: 'Sign in to OpenHands',
    uri: window.location.origin,
    version: '1',
    chainId: 8453, // Base chain ID
    nonce
  });
}

export async function verifySignature(signature: string, message: string) {
  // Verify signature
  try {
    const siweMessage = new SiweMessage(message);

    const { data: fields } = await siweMessage.verify({ signature });
    // Extract verified address from the SIWE message
    const verifiedAddress = fields.address;
    // Verify nonce using the verified address
    const storedNonce = global.nonceStore?.get(verifiedAddress);
    // Clean up used nonce
    global.nonceStore?.delete(verifiedAddress);
    return (storedNonce && storedNonce == fields.nonce);
  }
  catch (error) {
    return false;
  }
}

export function generateNonce(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).substr(2)}`;
}
