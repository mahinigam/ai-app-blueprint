import assert from "node:assert/strict";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const htmlPath = resolve(process.cwd(), "index.html");
const html = readFileSync(htmlPath, "utf8");

function check(condition, message) {
  assert.ok(condition, message);
}

const inlineScripts = [];
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  const attributes = match[1] ?? "";
  const body = match[2] ?? "";
  if (!/\bsrc\s*=/i.test(attributes) && body.trim()) inlineScripts.push(body);
}
check(inlineScripts.length > 0, "Expected at least one inline application script.");

for (const [index, source] of inlineScripts.entries()) {
  const tempPath = join(tmpdir(), `ai-app-blueprint-inline-${process.pid}-${index}.js`);
  try {
    writeFileSync(tempPath, source, "utf8");
    const result = spawnSync(process.execPath, ["--check", tempPath], { encoding: "utf8" });
    check(result.status === 0, `Inline script ${index + 1} failed node --check:\n${result.stderr || result.stdout}`);
  } finally {
    try { unlinkSync(tempPath); } catch {}
  }
}

// Check actual page markup, not IDs that appear inside JavaScript templates.
const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
const ids = [...markup.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
check(duplicates.length === 0, `Duplicate static IDs found: ${[...new Set(duplicates)].join(", ")}`);

for (let i = 0; i < 7; i++) {
  check(markup.includes(`id="nav-${i}"`), `Missing navigation button nav-${i}.`);
}
for (const tab of ["atoz", "arch", "code", "interview", "ship"]) {
  check(markup.includes(`id="tab-${tab}"`), `Missing detail tab tab-${tab}.`);
}
check(markup.includes('role="tablist"'), "Detail navigation must expose tablist semantics.");
check(markup.includes('role="tabpanel"'), "Detail content must expose tabpanel semantics.");
check(html.includes("function handleDetailTabKeydown"), "Keyboard tab navigation handler is missing.");

const moduleStart = html.indexOf("const MODULES_DATA = [");
const checklistStart = html.indexOf("const SHIP_CHECKLISTS = {");
const quizStart = html.indexOf("const MASTER_QUIZ_QUESTIONS = [");
const quizEnd = html.indexOf("let currentModuleIndex", quizStart);
check(moduleStart >= 0 && checklistStart > moduleStart, "Module data or ship checklists are missing.");
check(quizStart > checklistStart && quizEnd > quizStart, "Quiz data block is missing or malformed.");

const moduleData = html.slice(moduleStart, checklistStart);
const moduleCount = [...moduleData.matchAll(/shortTitle:\s*"/g)].length;
check(moduleCount === 7, `Expected 7 learning modules, found ${moduleCount}.`);

const checklistData = html.slice(checklistStart, quizStart);
const checklistCount = [...checklistData.matchAll(/^\s{2}[0-6]:\s*\{/gm)].length;
check(checklistCount === 7, `Expected 7 ship checklists, found ${checklistCount}.`);

const quizData = html.slice(quizStart, quizEnd);
const questionCount = [...quizData.matchAll(/question:\s*"/g)].length;
check(questionCount >= 6, `Expected at least 6 scenario questions, found ${questionCount}.`);
check(/ILLUSTRATIVE EXAMPLE/.test(html), "Code examples must be labelled as illustrative.");
check(/prefers-reduced-motion/.test(html), "Reduced-motion support is missing.");

console.log("AI App Blueprint checks passed.");
console.log(`Inline scripts checked: ${inlineScripts.length}; modules: ${moduleCount}; ship checklists: ${checklistCount}; quiz questions: ${questionCount}; duplicate static IDs: 0.`);
