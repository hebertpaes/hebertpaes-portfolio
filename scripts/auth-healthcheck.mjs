#!/usr/bin/env node

const baseUrl = (process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const timeoutMs = Number(process.env.HEALTHCHECK_TIMEOUT_MS || 12000);

const checks = [
  {
    name: "Login page is reachable",
    path: "/login",
    method: "GET",
    expectStatus: 200,
  },
  {
    name: "Admin login page is reachable",
    path: "/admin/login",
    method: "GET",
    expectStatus: 200,
  },
  {
    name: "Admin overview is protected",
    path: "/api/admin/overview",
    method: "GET",
    expectStatus: 401,
  },
  {
    name: "Admin audit is protected",
    path: "/api/admin/audit",
    method: "GET",
    expectStatus: 401,
  },
  {
    name: "2FA verify endpoint is protected",
    path: "/api/admin/2fa/verify",
    method: "POST",
    expectStatus: 401,
    json: { code: "000000" },
  },
];

async function runCheck(check) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const url = `${baseUrl}${check.path}`;

  try {
    const res = await fetch(url, {
      method: check.method,
      headers: check.json ? { "Content-Type": "application/json" } : undefined,
      body: check.json ? JSON.stringify(check.json) : undefined,
      redirect: "manual",
      signal: controller.signal,
    });

    const ok = res.status === check.expectStatus;
    return {
      ok,
      name: check.name,
      expected: check.expectStatus,
      received: res.status,
      url,
    };
  } catch (error) {
    return {
      ok: false,
      name: check.name,
      expected: check.expectStatus,
      received: "network-error",
      url,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

(async () => {
  console.log(`🔎 Auth healthcheck target: ${baseUrl}`);

  const results = [];
  for (const check of checks) {
    // sequential on purpose for cleaner logs and easier throttling
    // eslint-disable-next-line no-await-in-loop
    const result = await runCheck(check);
    results.push(result);

    if (result.ok) {
      console.log(`✅ ${result.name} (${result.received})`);
    } else {
      console.log(`❌ ${result.name} (expected ${result.expected}, got ${result.received})`);
      if (result.error) console.log(`   ↳ ${result.error}`);
    }
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.log(`\n❌ Healthcheck failed: ${failed.length}/${results.length} checks failing.`);
    process.exit(1);
  }

  console.log(`\n✅ Healthcheck passed: ${results.length}/${results.length} checks OK.`);
})();
