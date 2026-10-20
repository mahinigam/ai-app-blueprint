import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const projectRoot = new URL("../", import.meta.url);
const html = readFileSync(new URL("index.html", projectRoot), "utf8");
const inlineScriptStart = html.lastIndexOf("<script>");
const inlineScriptEnd = html.lastIndexOf("</script>");
const appScript = html.slice(inlineScriptStart + "<script>".length, inlineScriptEnd);

test("inline application JavaScript parses", () => {
  assert.ok(inlineScriptStart >= 0, "inline application script exists");
  assert.ok(inlineScriptEnd > inlineScriptStart, "inline script has a closing tag");
  assert.doesNotThrow(() => new Function(appScript));
});

test("the seven-module learning path is present", () => {
  for (const label of [
    "00. START HERE",
    "01. CONTEXT",
    "02. LATENCY & COST",
    "03. EVALUATION",
    "04. SECURITY",
    "05. TOOLS",
    "06. CAPSTONE"
  ]) {
    assert.ok(html.includes(label), "missing module label: " + label);
  }
  assert.equal((html.match(/shortTitle:\s*"/g) || []).length, 7);
});

test("all five detail tabs and ship-check content are wired", () => {
  for (const tab of ["atoz", "arch", "code", "interview", "ship"]) {
    assert.ok(html.includes("id=\"tab-" + tab + "\""), "missing tab: " + tab);
    assert.ok(html.includes("switchDetailTab('" + tab + "')"), "missing tab action: " + tab);
  }
  assert.ok(html.includes("function handleDetailTabKeydown"));
  assert.ok(html.includes("const SHIP_CHECKLISTS"));
  for (const moduleIndex of [0, 1, 2, 3, 4, 5, 6]) {
    assert.match(html, new RegExp("\\b" + moduleIndex + ":\\s*\\{"));
  }
});

test("responsive and accessibility safeguards remain present", () => {
  assert.ok(html.includes("function renderCompactSchematic"));
  assert.ok(html.includes("if (w < 620)"));
  assert.ok(html.includes("function handleModuleNavKeydown"));
  assert.ok(html.includes("prefers-reduced-motion"));
  assert.ok(html.includes(":focus-visible"));
  assert.ok(html.includes("role=\"tabpanel\""));
  assert.ok(html.includes("aria-label=\"Learning modules\""));
});

test("examples do not reintroduce known unqualified performance claims", () => {
  const forbidden = [
    "100% CACHE HIT",
    "cutting latency by 10x",
    "slashing cost by 95%",
    "$15/1M tokens",
    "$0.10/1M tokens",
    "the universal reference architecture for every production AI product",
    "within 24 hours someone will type"
  ];
  for (const phrase of forbidden) {
    assert.ok(!html.toLowerCase().includes(phrase.toLowerCase()), "stale claim found: " + phrase);
  }
});

test("technical references use HTTPS", () => {
  const urls = [...html.matchAll(/https:\/\/[A-Za-z0-9./_?=&%#-]+/g)].map((match) => match[0]);
  assert.ok(urls.length >= 8, "expected primary technical references and project metadata");
  assert.ok(urls.every((url) => url.startsWith("https://")));
});

test("examples enforce access boundaries before model context and tool execution", () => {
  assert.ok(html.includes("tenant_id=req.principal.tenant_id"));
  assert.ok(html.includes("allowed_permissions=req.principal.permissions"));
  assert.ok(html.includes("tool_registry.allowed_for(req.principal)"));
  assert.ok(html.includes("authorization.can_execute(principal, fn_name, args)"));
  assert.ok(html.includes("filters are not an authorization boundary"));
});

test("incident guidance separates hypotheses from confirmed root causes", () => {
  assert.ok(!html.includes("pinpoints any failure immediately"));
  assert.ok(html.includes("Treat the first explanation as a hypothesis to test"));
  assert.ok(html.toLowerCase().includes("measure the actual latency and reliability impact against a baseline"));
});
