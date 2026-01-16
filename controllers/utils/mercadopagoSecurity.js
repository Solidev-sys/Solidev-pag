const crypto = require('crypto');

function parseMpSignature(signatureHeader) {
  const raw = String(signatureHeader || '').trim();
  if (!raw) return null;
  const parts = raw.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  const kv = {};
  for (const p of parts) {
    const idx = p.indexOf('=');
    if (idx === -1) continue;
    const k = p.slice(0, idx).trim();
    const v = p.slice(idx + 1).trim();
    if (k) kv[k] = v;
  }
  if (!kv.ts || !kv.v1) return null;
  return { ts: String(kv.ts), v1: String(kv.v1) };
}

function verifyMpWebhookSignature({ secret, signatureHeader, requestId, dataId }) {
  const s = String(secret || '').trim();
  if (!s) return { ok: true, skipped: true };
  const parsed = parseMpSignature(signatureHeader);
  const rid = String(requestId || '').trim();
  const did = String(dataId || '').trim();
  if (!parsed || !rid || !did) return { ok: false, skipped: false, reason: 'missing_signature_fields' };
  const manifest = `id:${did};request-id:${rid};ts:${parsed.ts};`;
  const expected = crypto.createHmac('sha256', s).update(manifest).digest('hex');
  const got = parsed.v1;
  const ok = expected.length === got.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(got));
  return { ok, skipped: false, reason: ok ? null : 'invalid_signature' };
}

function validateMpCardTokenId(cardTokenId) {
  const v = typeof cardTokenId === 'string' ? cardTokenId.trim() : '';
  if (!v) return { ok: false, reason: 'missing' };
  if (v.length < 20 || v.length > 255) return { ok: false, reason: 'length' };
  if (!/^[A-Za-z0-9_-]+$/.test(v)) return { ok: false, reason: 'charset' };
  return { ok: true, value: v };
}

function buildMpIdempotencyKey(parts) {
  const raw = Array.isArray(parts) ? parts.map((p) => String(p || '')).join('|') : String(parts || '');
  const h = crypto.createHash('sha256').update(raw).digest('hex');
  return h.slice(0, 32);
}

module.exports = {
  parseMpSignature,
  verifyMpWebhookSignature,
  validateMpCardTokenId,
  buildMpIdempotencyKey,
};

