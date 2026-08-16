import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
const packages = lock.packages ?? {};
const inventory = new Map();

for (const [packagePath, lockEntry] of Object.entries(packages)) {
  if (!packagePath.includes("node_modules/")) continue;
  const manifestPath = path.join(root, packagePath, "package.json");
  let manifest = {};
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    manifest = lockEntry;
  }
  const name = manifest.name ?? packagePath.split("node_modules/").at(-1);
  const version = manifest.version ?? lockEntry.version ?? "unknown";
  const rawLicense = manifest.license ?? lockEntry.license ?? manifest.licenses;
  const license = Array.isArray(rawLicense)
    ? rawLicense.map((item) => item.type ?? item).join(" OR ")
    : rawLicense ?? "UNKNOWN";
  inventory.set(`${name}@${version}`, { name, version, license: String(license) });
}

const rows = [...inventory.values()].sort((a, b) =>
  a.name.localeCompare(b.name) || a.version.localeCompare(b.version)
);
const counts = new Map();
for (const row of rows) counts.set(row.license, (counts.get(row.license) ?? 0) + 1);

const summary = [...counts.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([license, count]) => `| ${license} | ${count} |`)
  .join("\n");
const details = rows
  .map(({ name, version, license }) => `| ${name} | ${version} | ${license} |`)
  .join("\n");

const report = `# Dependency license inventory

Generated from \`package-lock.json\` and installed package manifests by \`npm run audit:licenses\`.

- Unique package/version entries: ${rows.length}
- Entries without detected license metadata: ${counts.get("UNKNOWN") ?? 0}

## Summary

| License expression | Count |
| --- | ---: |
${summary}

## Packages

| Package | Version | License expression |
| --- | --- | --- |
${details}
`;

fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(path.join(root, "docs", "dependency-license-inventory.md"), report);

if (counts.has("UNKNOWN")) {
  console.error(`License audit failed: ${counts.get("UNKNOWN")} package entries have unknown licenses.`);
  process.exit(1);
}
console.log(`License audit passed for ${rows.length} unique package/version entries.`);
