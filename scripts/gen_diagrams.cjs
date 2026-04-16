const fs = require('fs');
const path = require('path');

const svgDir = 'src/assets/diagrams/svg';
const outDir = 'src/data/diagrams';
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));

let indexContent = `// Auto-generated diagram SVGs\n\n`;
let mappingEntries = [];

for (const file of files) {
  const name = file.replace('.svg', '');
  const svgContent = fs.readFileSync(path.join(svgDir, file), 'utf8');
  
  const constName = name.replace(/-/g, '_');
  const tsContent = `export const ${constName}: string = ${JSON.stringify(svgContent)};\n`;
  fs.writeFileSync(path.join(outDir, `${name}.ts`), tsContent);
  
  indexContent += `export { ${constName} } from './${name}';\n`;
  mappingEntries.push(`  '${name}': ${constName},`);
}

indexContent += `\nexport const diagramMap: Record<string, string> = {\n${mappingEntries.join('\n')}\n};\n`;

fs.writeFileSync(path.join(outDir, 'index.ts'), indexContent);

console.log(`Generated ${files.length} diagram modules`);
