// Lightweight esbuild pipeline for wp-intranet-blocks
// Replaces @wordpress/scripts (which drags in lighthouse/puppeteer).
import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const REPO = 'C:/WPDemo/repos/wp-intranet-blocks';
const BUILD = join(REPO, 'build');

const wpPackages = [
  'blocks', 'block-editor', 'components', 'element', 'i18n',
  'data', 'core-data', 'server-side-render', 'compose', 'icons', 'primitives',
];

const wpExternals = {
  name: 'wp-globals',
  setup(build) {
    for (const pkg of wpPackages) {
      build.onResolve({ filter: new RegExp('^@wordpress/' + pkg + '$') }, (args) => ({
        path: args.path, namespace: 'wp-global',
      }));
      build.onLoad({ filter: /.*/, namespace: 'wp-global' }, (args) => {
        const short = args.path.replace('@wordpress/', '');
        return { contents: `module.exports = window.wp.${short};`, loader: 'js' };
      });
    }
  },
};

mkdirSync(BUILD, { recursive: true });
mkdirSync(join(BUILD, 'blocks', 'news-card'), { recursive: true });
mkdirSync(join(BUILD, 'blocks', 'quick-action'), { recursive: true });

// 1. Bundle editor script
await esbuild.build({
  entryPoints: [join(REPO, 'src', 'index.js')],
  bundle: true,
  outfile: join(BUILD, 'index.js'),
  format: 'iife',
  loader: { '.js': 'jsx' },
  jsx: 'transform',
  jsxFactory: 'wp.element.createElement',
  banner: { js: 'var wp = window.wp;' },
  minify: true,
  sourcemap: false,
  plugins: [wpExternals],
  logLevel: 'info',
});
console.log('index.js bundled');

// 2. Copy block.json files
for (const block of ['news-card', 'quick-action']) {
  copyFileSync(
    join(REPO, 'src', 'blocks', block, 'block.json'),
    join(BUILD, 'blocks', block, 'block.json')
  );
}
console.log('block.json copied');

// 3. Stylesheets
if (existsSync(join(REPO, 'src', 'style.css'))) {
  copyFileSync(join(REPO, 'src', 'style.css'), join(BUILD, 'style-index.css'));
}
writeFileSync(join(BUILD, 'index.css'), '/* editor styles */\n');
console.log('css copied');

// 4. Sanity check
const bundled = readFileSync(join(BUILD, 'index.js'), 'utf8');
console.log('index.js size:', bundled.length, 'bytes');
console.log('DONE');
