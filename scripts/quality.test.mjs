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
  assert.ok(html.includes("function renderModule0Hook"));
  assert.match(html, /if\s*\(w\s*<\s*\d+/);
  assert.ok(html.includes("function handleModuleNavKeydown"));
  assert.ok(html.includes("prefers-reduced-motion"));
  assert.ok(html.includes(":focus-visible"));
  assert.ok(html.includes("role=\"tabpanel\""));
  assert.ok(html.includes("aria-label=\"Learning modules\""));
});

test("all diagrams use one responsive path and defined module renderers", () => {
  const renderers = [
    "renderModule0Hook",
    "renderModule1RAG",
    "renderModule2Cost",
    "renderModule3Evals",
    "renderModule4Guardrails",
    "renderModule5Agents",
    "renderModule6FullStack"
  ];

  const dispatcherStart = html.indexOf("function renderScene()");
  const dispatcherEnd = html.indexOf("// SCENE 0:", dispatcherStart);
  assert.ok(dispatcherStart >= 0 && dispatcherEnd > dispatcherStart, "diagram dispatcher exists");
  const dispatcher = html.slice(dispatcherStart, dispatcherEnd);

  assert.ok(!dispatcher.includes("renderCompactSchematic"), "dispatcher must not call a removed compact renderer");
  for (const renderer of renderers) {
    assert.ok(html.includes("function " + renderer + "("), "missing diagram renderer: " + renderer);
    assert.ok(dispatcher.includes(renderer), "dispatcher does not route to " + renderer);
  }

  const compactLayouts = [
    ...html.matchAll(/if\s*\(\s*w\s*<\s*620\s*\)|const compact = w < 620;/g)
  ];
  assert.equal(compactLayouts.length, 7, "each module must use the shared 620px compact-layout breakpoint");
  assert.ok(!/w\s*<\s*(540|560)\b/.test(html), "stale diagram breakpoints found");
});

test("interactive diagrams stay in sync with their controls", () => {
  const landingStart = html.indexOf("function renderModule0Hook");
  const landingEnd = html.indexOf("// SCENE 1:", landingStart);
  assert.ok(landingStart >= 0 && landingEnd > landingStart, "landing diagram renderer exists");
  const landing = html.slice(landingStart, landingEnd);
  assert.ok(landing.includes("simState.mod0Collapsed"), "landing control must change the drawing");
  assert.ok(landing.includes("simState.mod0Particles"), "tool ecosystem view must render its tool list");

  const autoStart = html.indexOf("function toggleMod5Auto");
  const autoEnd = html.indexOf("function selectMod6Node", autoStart);
  assert.ok(autoStart >= 0 && autoEnd > autoStart, "agent auto-loop handler exists");
  const autoLoop = html.slice(autoStart, autoEnd);
  assert.ok(autoLoop.includes("setInterval"), "auto-loop should advance the sample workflow");
  assert.ok(autoLoop.includes("clearInterval"), "auto-loop should be cancellable");
  assert.ok(autoLoop.includes("currentModuleIndex === 5"), "auto-loop should run only while its module is active");
  assert.ok(autoLoop.includes("document.visibilityState === 'visible'"), "auto-loop should pause while the page is hidden");

  const capstoneStart = html.indexOf("function renderModule6FullStack");
  const capstoneEnd = html.indexOf("function openMasterQuizModal", capstoneStart);
  assert.ok(capstoneStart >= 0 && capstoneEnd > capstoneStart, "capstone renderer exists");
  const capstone = html.slice(capstoneStart, capstoneEnd);
  assert.ok(capstone.includes("simState.mod6SelectedNode"), "capstone renderer should read selected layer state");
  for (const key of ["IN_CHECK", "RAG", "LLM", "TOOLS", "OUT_CHECK"]) {
    assert.ok(capstone.includes('key: "' + key + '"'), "capstone request path does not map selected layer " + key);
  }
  assert.ok(capstone.includes('selectedNode === "ROUTER"'), "capstone diagram does not highlight cache/routing");
  assert.ok(capstone.includes('key: "EVALS"'), "capstone diagram does not highlight evaluation");
});

test("text architecture diagrams match optional components and trust boundaries", () => {
  assert.ok(html.includes("Provider-specific cache eligibility; hits are not guaranteed"));
  assert.ok(html.includes("[OPTIONAL CACHE / MODEL ROUTING]"));
  assert.ok(html.includes("[OPTIONAL RETRIEVAL]"));
  assert.ok(html.includes("[OPTIONAL TOOL RUNTIME: AUTHORIZE -> EXECUTE -> CHECK]"));
  assert.ok(html.includes("Prompt filters are defense in depth; authorization is enforced in code."));
  assert.ok(html.includes("VERIFY SOURCE SUPPORT OR ABSTAIN"));
  assert.ok(!html.includes("[STATIC PREFIX (Cached KV)]"));
  assert.ok(!html.includes("[SAFE ANSWER]"));
  assert.ok(!html.includes("5-8 high-level semantic tools"));
  assert.ok(!html.includes("Request passes through Prefix Cache alignment"));
  assert.ok(!html.includes("1M-token context window instead of building RAG"));
  assert.ok(!html.includes("gates every CI/CD change"));
  assert.ok(!html.includes("Production costs spike 4x overnight"));
});

test("quiz modal traps keyboard focus while open", () => {
  assert.ok(html.includes("const focusable = [...modal.querySelectorAll("));
  assert.ok(html.includes("document.activeElement === first"));
  assert.ok(html.includes("document.activeElement === last"));
  assert.ok(html.includes("event.target === event.currentTarget"));
});

test("workflow triggers and Node.js versions are consistent", () => {
  const qualityWorkflow = readFileSync(new URL("../.github/workflows/quality.yml", import.meta.url), "utf8");
  const appWorkflow = readFileSync(new URL("../.github/workflows/validate-static-app.yml", import.meta.url), "utf8");
  for (const [name, workflow] of [["quality", qualityWorkflow], ["static app", appWorkflow]]) {
    assert.ok(workflow.includes("branches: [main]"), name + " workflow must run on main");
    assert.ok(workflow.includes("pull_request:"), name + " workflow must validate pull requests");
    assert.ok(workflow.includes("workflow_dispatch:"), name + " workflow must support manual runs");
    assert.ok(workflow.includes("node-version: 22"), name + " workflow must use Node.js 22");
    assert.ok(!workflow.includes("final-quality-pass") && !workflow.includes("final-quality-overhaul"), name + " workflow should not depend on obsolete branch names");
  }
  assert.ok(qualityWorkflow.includes("node --test scripts/quality.test.mjs"));
  assert.ok(appWorkflow.includes("node scripts/check-static.mjs"));
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

test("dynamic HTML and clipboard fallback cleanup are hardened", () => {
  const escapeStart = html.indexOf("function escapeHtml(str)");
  const escapeEnd = html.indexOf("async function copyCurrentCode", escapeStart);
  assert.ok(escapeStart >= 0 && escapeEnd > escapeStart, "HTML escaping helper exists");
  const escapeFn = html.slice(escapeStart, escapeEnd);
  for (const entity of ['"&quot;"', "'&#39;'"]) {
    assert.ok(escapeFn.includes(entity), "HTML escaping should encode " + entity);
  }
  const copyStart = html.indexOf("async function copyCurrentCode");
  const copyEnd = html.indexOf("function renderVisualizerControls", copyStart);
  assert.ok(copyStart >= 0 && copyEnd > copyStart, "copy handler exists");
  const copyFn = html.slice(copyStart, copyEnd);
  assert.ok(copyFn.includes("finally"), "clipboard fallback must remove temporary nodes on failure");
  assert.ok(copyFn.includes("temp.remove()"), "clipboard fallback must remove its temporary textarea");
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
  assert.ok(html.toLowerCase().includes("measure its latency and reliability impact against a baseline"));
});
