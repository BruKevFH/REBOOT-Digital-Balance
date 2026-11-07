import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizePublicOrigin, verifyNinjaDeployment} from '../scripts/verify_ninja_deployment.mjs';

const ORIGIN = 'https://ninja-accounts.example.com';
const PAGES = 'https://brukevfh.github.io';

function backend({
  cors = PAGES,
  storage = 'postgresql',
  persistent = true,
  verified = true,
  accountEnabled = true,
  preflight = 204,
  apiVersion = 3,
} = {}) {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    const parsed = new URL(url);
    const path = parsed.pathname;
    const method = options.method || 'GET';
    calls.push({path, method, headers: options.headers});
    const headers = {'access-control-allow-origin': cors, 'content-type': 'application/json'};
    let body;
    let status = 200;
    if (path === '/api/v3/health') {
      body = {ok: true, service: 'notification-ninja', apiVersion,
        durableStorage: persistent, storage, ruleset: 'open-v2'};
    } else if (path === '/notification-ninja/accounts-config.json') {
      body = {enabled: accountEnabled, apiVersion: 3,
        durableStorage: persistent, endpoint: ORIGIN + '/api/v3'};
    } else if (path === '/api/v3/leaderboard') {
      body = {verified, ruleset: 'open-v2', entries: [], total: 0, own: null};
    } else if (path === '/api/v3/auth/register' && method === 'OPTIONS') {
      status = preflight;
      body = null;
      headers['access-control-allow-methods'] = 'GET, POST, PATCH, DELETE, OPTIONS';
      headers['access-control-allow-headers'] = 'Authorization, Content-Type';
    } else {
      return new Response('missing', {status: 404});
    }
    return new Response(body === null ? null : JSON.stringify(body), {status, headers});
  };
  return {fetchImpl, calls};
}

test('only HTTPS service origins or local HTTP are allowed', () => {
  assert.equal(normalizePublicOrigin(ORIGIN), ORIGIN);
  assert.equal(normalizePublicOrigin('http://127.0.0.1:8083'), 'http://127.0.0.1:8083');
  for (const value of [
    'http://remote.example.com', 'https://user:password@remote.example.com',
    'https://remote.example.com/api/v3', 'https://remote.example.com/?secret=x',
    'https://remote.example.com/#token', ' https://remote.example.com',
    'postgresql://localhost/mydb', '',
  ]) {
    assert.throws(() => normalizePublicOrigin(value), TypeError, value);
  }
});

test('read-only preflight checks real v3 PostgreSQL and CORS contracts', async () => {
  const fake = backend();
  const result = await verifyNinjaDeployment(ORIGIN, {fetchImpl: fake.fetchImpl});
  assert.equal(result.ok, true);
  assert.equal(result.configuredEndpoint, ORIGIN + '/api/v3');
  assert.equal(result.checks.length, 4);
  assert.deepEqual(fake.calls.map(call => call.method), ['GET', 'GET', 'GET', 'OPTIONS']);
  assert(fake.calls.some(call => call.path === '/api/v3/leaderboard'));
  assert(fake.calls.some(call => call.path === '/api/v3/auth/register' && call.headers.Origin === PAGES));
  assert(!fake.calls.some(call => call.method === 'POST' || call.method === 'DELETE'));
});

test('ephemeral storage is never approved for public accounts', async () => {
  await assert.rejects(
    verifyNinjaDeployment(ORIGIN, {fetchImpl: backend({storage: 'sqlite'}).fetchImpl}),
    /persistent PostgreSQL/);
  await assert.rejects(
    verifyNinjaDeployment(ORIGIN, {fetchImpl: backend({persistent: false}).fetchImpl}),
    /persistent PostgreSQL/);
});

test('rejects invalid or unexpected API version and CORS', async () => {
  await assert.rejects(verifyNinjaDeployment(ORIGIN, {
    fetchImpl: backend({apiVersion: 2}).fetchImpl,
  }), /expected Notification Ninja v3/);
  await assert.rejects(verifyNinjaDeployment(ORIGIN, {
    fetchImpl: backend({cors: 'https://example.org'}).fetchImpl,
  }), /CORS/);
});

test('refuses unpublished account configuration', async () => {
  await assert.rejects(verifyNinjaDeployment(ORIGIN, {
    fetchImpl: backend({accountEnabled: false}).fetchImpl,
  }), /invalid account configuration/);
});

test('does not accept an unverified leaderboard', async () => {
  await assert.rejects(verifyNinjaDeployment(ORIGIN, {
    fetchImpl: backend({verified: false}).fetchImpl,
  }), /verified database-backed/);
});

test('registration preflight must be allowed', async () => {
  await assert.rejects(verifyNinjaDeployment(ORIGIN, {
    fetchImpl: backend({preflight: 403}).fetchImpl,
  }), /HTTP 403/);
});

test('wrong pages origin and unreasonable timeouts are rejected', async () => {
  await assert.rejects(verifyNinjaDeployment(ORIGIN, {
    fetchImpl: backend().fetchImpl, pagesOrigin: 'http://brukevfh.github.io',
  }), /exact HTTPS origin/);
  await assert.rejects(verifyNinjaDeployment(ORIGIN, {
    fetchImpl: backend().fetchImpl, timeoutMs: 0,
  }), /Timeout must be/);
});
