import crypto from "node:crypto";

function base32ToBuffer(input: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = input.toUpperCase().replace(/=+$/g, "").replace(/\s+/g, "");

  let bits = "";
  for (const char of clean) {
    const val = alphabet.indexOf(char);
    if (val === -1) throw new Error("Invalid base32 secret");
    bits += val.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  return Buffer.from(bytes);
}

function hotp(secret: Buffer, counter: number, digits = 6) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac("sha1", secret).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return (code % 10 ** digits).toString().padStart(digits, "0");
}

export function verifyTotp(codeRaw: string, secretBase32: string, stepSeconds = 30, window = 1) {
  const code = codeRaw.replace(/\D/g, "");
  if (!/^\d{6}$/.test(code)) return false;

  const secret = base32ToBuffer(secretBase32);
  const nowCounter = Math.floor(Date.now() / 1000 / stepSeconds);

  for (let w = -window; w <= window; w += 1) {
    const candidate = hotp(secret, nowCounter + w);
    if (candidate === code) return true;
  }

  return false;
}
