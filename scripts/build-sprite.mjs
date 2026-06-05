import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const ICONS_DIR = './public/icons';
const OUTPUT = './public/sprite.svg';

const files = await readdir(ICONS_DIR);
const svgFiles = files.filter(f => f.endsWith('.svg'));

const symbols = await Promise.all(
  svgFiles.map(async file => {
    const name = file.replace('.svg', '');
    let content = await readFile(join(ICONS_DIR, file), 'utf-8');

    content = content.replace(/<\?xml[^?]*\?>/g, '');

    const viewBox = content.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';

    const inner = content
      .replace(/<svg[^>]*>/g, '')   
      .replace(/<\/svg>/g, '')      
      .replace(/fill="#[0-9a-fA-F]{3,6}"/g, 'fill="currentColor"')
      .replace(/fill="black"/gi, 'fill="currentColor"')
      .replace(/fill="white"/gi, 'fill="currentColor"')
      .trim();

    if (!inner) {
      console.warn(`(!) Skip empty file: ${file}`);
      return null;
    }

    console.log(`✓ ${name}`);
    return `  <symbol id="icon-${name}" viewBox="${viewBox}">\n    ${inner}\n  </symbol>`;
  })
);
const validSymbols = symbols.filter(Boolean);

const sprite = [
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">`,
  ...validSymbols,
  `</svg>`,
].join('\n');

await writeFile(OUTPUT, sprite, 'utf-8');
console.log(`\n✓ Done: ${validSymbols.length} icons:  ${OUTPUT}`);