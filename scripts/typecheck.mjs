// Optional QA compiler; no dependency is installed or needed to preview the site.
import { pathToFileURL } from 'node:url';
const compilerPath = process.env.TYPESCRIPT_PATH;
if (!compilerPath) throw Error('Set TYPESCRIPT_PATH to an already installed TypeScript compiler file. See README.');
const { default: ts } = await import(pathToFileURL(compilerPath).href);
const program = ts.createProgram(['src/app.js'], { allowJs: true, checkJs: true, noEmit: true, target: ts.ScriptTarget.ES2022, lib: ['lib.es2022.d.ts','lib.dom.d.ts','lib.dom.iterable.d.ts'], strict: true });
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) { console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCanonicalFileName: f => f, getCurrentDirectory: () => process.cwd(), getNewLine: () => '\n' })); process.exitCode = 1; } else console.log('Website JavaScript typecheck passed.');
