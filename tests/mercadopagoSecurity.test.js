const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

const {
  parseMpSignature,
  verifyMpWebhookSignature,
  validateMpCardTokenId,
  buildMpIdempotencyKey,
} = require('../controllers/utils/mercadopagoSecurity');

test('parseMpSignature extracts ts and v1', () => {
  const parsed = parseMpSignature('ts=1704908010,v1=abc123');
  assert.deepEqual(parsed, { ts: '1704908010', v1: 'abc123' });
});

test('verifyMpWebhookSignature validates correct signature', () => {
  const secret = 'secret123';
  const dataId = '999999999';
  const requestId = 'req-1';
  const ts = '1704908010';
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const v1 = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  const header = `ts=${ts},v1=${v1}`;

  const out = verifyMpWebhookSignature({ secret, signatureHeader: header, requestId, dataId });
  assert.equal(out.ok, true);
  assert.equal(out.skipped, false);
});

test('verifyMpWebhookSignature rejects invalid signature', () => {
  const out = verifyMpWebhookSignature({
    secret: 'secret123',
    signatureHeader: 'ts=1,v1=deadbeef',
    requestId: 'req-1',
    dataId: '999',
  });
  assert.equal(out.ok, false);
  assert.equal(out.skipped, false);
  assert.equal(out.reason, 'invalid_signature');
});

test('validateMpCardTokenId accepts typical token formats', () => {
  const ok = validateMpCardTokenId('abcDEF_123-45678901234567890');
  assert.equal(ok.ok, true);
});

test('validateMpCardTokenId rejects empty/short', () => {
  assert.equal(validateMpCardTokenId('').ok, false);
  assert.equal(validateMpCardTokenId('short').ok, false);
});

test('buildMpIdempotencyKey returns stable 32 hex chars', () => {
  const k1 = buildMpIdempotencyKey(['a', 1, 'b']);
  const k2 = buildMpIdempotencyKey(['a', 1, 'b']);
  assert.equal(k1, k2);
  assert.match(k1, /^[a-f0-9]{32}$/);
});

