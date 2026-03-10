#!/usr/bin/env node

const baseUrl = (process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const timeoutMs = Number(process.env.HEALTHCHECK_TIMEOUT_MS || 12000);

const checks = [
  { name: "CMS admin page is protected", path: "/admin/cms", method: "GET", expectStatus: 307 },
  { name: "CMS stats is protected", path: "/api/admin/cms/stats", method: "GET", expectStatus: 401 },
  { name: "CMS posts list is protected", path: "/api/admin/cms/posts", method: "GET", expectStatus: 401 },
  {
    name: "CMS posts create is protected",
    path: "/api/admin/cms/posts",
    method: "POST",
    expectStatus: 401,
    json: { title: "x", content: "x" },
  },
  { name: "CMS categories is protected", path: "/api/admin/cms/categories", method: "GET", expectStatus: 401 },
  { name: "CMS tags is protected", path: "/api/admin/cms/tags", method: "GET", expectStatus: 401 },
  { name: "CMS media is protected", path: "/api/admin/cms/media", method: "GET", expectStatus: 401 },
  { name: "CMS users is protected", path: "/api/admin/cms/users", method: "GET", expectStatus: 401 },
  { name: "CMS settings is protected", path: "/api/admin/cms/settings", method: "GET", expectStatus: 401 },
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

    return {
      ok: res.status === check.expectStatus,
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
  console.log(`CMS healthcheck target: ${baseUrl}`);

  const results = [];
  for (const check of checks) {
    // eslint-disable-next-line no-await-in-loop
    const result = await runCheck(check);
    results.push(result);

    if (result.ok) {
      console.log(`OK: ${result.name} (${result.received})`);
    } else {
      console.log(`FAIL: ${result.name} (expected ${result.expected}, got ${result.received})`);
      if (result.error) console.log(`  -> ${result.error}`);
    }
  }

  const failed = results.filter((result) => !result.ok);
  if (failed.length) {
    console.log(`\nHealthcheck failed: ${failed.length}/${results.length} checks failing.`);
    process.exit(1);
  }

  console.log(`\nHealthcheck passed: ${results.length}/${results.length} checks OK.`);
})();
