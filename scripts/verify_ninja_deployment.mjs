#!/usr/bin/env node
/**
 * Read-only verification of a public Notification Ninja v3 deployment.
 * Never accepts provider API keys or a database connection string.
 */
import {pathToFileURL} from 'node:url';

export const PAGES_ORIGIN = 'https://brukevfh.github.io';

export function normalizePublicOrigin(value) {
  if (typeof value !== 'string' || !value.trim() || value !== value.trim()) {
    throw new TypeError('Provide the public Render HTTPS origin, without spaces.');
  }
  let url;
  try { url = new URL(value); }
  catch { throw new TypeError('Invalid URL. Use https://your-service.onrender.com'); }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (!(url.protocol === 'https:' || (url.protocol === 'http:' && local))) {
    throw new TypeError('A remote deployment must use HTTPS.');
  }
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new TypeError('Supply only the service origin; no credentials, paths, queries or fragments.');
  }
  return url.origin;
}

function insist(condition, reason) {
  if (!condition) throw new Error(reason);
}

async function request(fetchImpl, origin, pathname, {method = 'GET', headers = {}, timeoutMs} = {}) {
  const response = await fetchImpl(origin + pathname, {
    method,
    headers,
    redirect: 'manual',
    cache: 'no-store',
    signal: AbortSignal.timeout(timeoutMs),
  });
  insist(response.status === (method === 'OPTIONS' ? 204 : 200),
    method + ' ' + pathname + ' returned HTTP ' + response.status);
  return response;
}

/**
 * Does not mutate anything. Success proves basic readiness, not persistence
 * across a Render restart or that users can complete actual gameplay.
 */
export async function verifyNinjaDeployment(value, {
  fetchImpl = globalThis.fetch,
  pagesOrigin = PAGES_ORIGIN,
  timeoutMs = 110000,
} = {}) {
  const origin = normalizePublicOrigin(value);
  const pages = new URL(pagesOrigin);
  insist(pages.origin === pagesOrigin && pages.protocol === 'https:',
    'The GitHub Pages origin must be an exact HTTPS origin.');
  insist(typeof fetchImpl === 'function', 'A fetch implementation is required.');
  insist(Number.isInteger(timeoutMs) && timeoutMs >= 100 && timeoutMs <= 120000,
    'Timeout must be between 100 and 120000 milliseconds.');
  const corsHeaders = {Origin: pagesOrigin};
  const checks = [];

  const healthResponse = await request(fetchImpl, origin, '/api/v3/health', {
    headers: corsHeaders, timeoutMs,
  });
  insist(healthResponse.headers.get('access-control-allow-origin') === pagesOrigin,
    'Health API does not authorize the GitHub Pages origin (CORS).');
  const health = await healthResponse.json();
  insist(health?.ok === true && health.service === 'notification-ninja' && health.apiVersion === 3,
    'The service is not the expected Notification Ninja v3 backend.');
  insist(health.storage === 'postgresql' && health.durableStorage === true,
    'A persistent PostgreSQL connection was not confirmed; refusing to approve ephemeral SQLite.');
  insist(health.ruleset === 'open-v2',
    'Unexpected game ruleset; public results would not be comparable.');
  checks.push('v3 health, PostgreSQL, durable storage, ruleset and CORS');

  const configResponse = await request(fetchImpl, origin,
    '/notification-ninja/accounts-config.json', {timeoutMs});
  const config = await configResponse.json();
  insist(config?.enabled === true && config.apiVersion === 3 &&
    config.durableStorage === true && config.endpoint === origin + '/api/v3',
  'The service reports an invalid account configuration.');
  checks.push('Backend account configuration');

  const leaderboardResponse = await request(fetchImpl, origin,
    '/api/v3/leaderboard?ruleset=open-v2&limit=2', {
      headers: corsHeaders, timeoutMs,
    });
  insist(leaderboardResponse.headers.get('access-control-allow-origin') === pagesOrigin,
    'Leaderboard API does not authorize the GitHub Pages origin (CORS).');
  const leaderboard = await leaderboardResponse.json();
  insist(leaderboard?.verified === true && leaderboard.ruleset === 'open-v2' &&
    Array.isArray(leaderboard.entries) && Number.isInteger(leaderboard.total),
  'A verified database-backed Open Run leaderboard was not confirmed.');
  checks.push('Public verified Open Run leaderboard');

  const preflight = await request(fetchImpl, origin, '/api/v3/auth/register', {
    method: 'OPTIONS', timeoutMs,
    headers: {
      Origin: pagesOrigin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });
  insist(preflight.headers.get('access-control-allow-origin') === pagesOrigin &&
    /\bPOST\b/.test(preflight.headers.get('access-control-allow-methods') || '') &&
    /\bcontent-type\b/i.test(preflight.headers.get('access-control-allow-headers') || ''),
  'Registration CORS preflight is not configured for GitHub Pages.');
  checks.push('Registration CORS preflight');

  return {ok: true, origin, checks, configuredEndpoint: origin + '/api/v3'};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const candidate = process.argv[2];
  if (!candidate || process.argv.length !== 3) {
    process.stderr.write('Usage: npm run verify:ninja:deployment -- https://YOUR-ACCOUNT-SERVICE.onrender.com\n');
    process.exitCode = 2;
  } else {
    try {
      const result = await verifyNinjaDeployment(candidate);
      process.stdout.write(result.checks.map(item => 'PASS ' + item).join('\n') + '\n');
      process.stdout.write('Public backend preflight passed: ' + result.origin + '\n');
      process.stdout.write('Next: manually test two accounts, restart Render, confirm Neon persistence and delete test data.\n');
      process.stdout.write('Only then enable notification-ninja/accounts-config.json with endpoint ' + result.configuredEndpoint + '\n');
    } catch (error) {
      process.stderr.write('Deployment preflight FAILED: ' + error.message + '\n');
      process.exitCode = 1;
    }
  }
}
