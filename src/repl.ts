import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import repl from 'repl';
import { fileURLToPath } from 'url';
import logger from './utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTOLOAD_DIRS = ['utils', 'services', 'lib'];

await (async () => {
  try {
    logger.info('Bootstrapping application context...');

    // ---- UNIVERSAL RECURSIVE LOADER ----
    const loadFilesRecursively = async (dirPath: string, label: string) => {
      if (!fs.existsSync(dirPath)) return [];

      const loaded: string[] = [];

      const walk = async (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            await walk(fullPath);
          } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
            try {
              const module = await import(fullPath);
              Object.entries(module).forEach(([exportName, exported]) => {
                (globalThis as Record<string, unknown>)[exportName] = exported;
              });
              loaded.push(fullPath);
            } catch (err) {
              logger.error(err, `Failed to load ${label}: ${entry.name}`);
            }
          }
        }
      };

      await walk(dirPath);
      return loaded;
    };

    // ---- AUTO-LOAD ALL CONFIGURED DIRECTORIES ----
    for (const relPath of AUTOLOAD_DIRS) {
      const fullPath = path.join(__dirname, relPath);
      const loaded = await loadFilesRecursively(fullPath, relPath);
      if (loaded.length > 0) logger.success(`Loaded ${loaded.length} items from '${relPath}'`);
    }

    logger.success('Your REPL environment is ready!\n');

    // ---- START REPL ----
    setTimeout(() => {
      const r = repl.start({
        prompt: '> ',
        useGlobal: true,
        ignoreUndefined: true,
      });

      // ---- CORE CONTEXT ----
      r.context.logger = logger;

      const historyFile = path.join(process.cwd(), '.repl_history');
      r.setupHistory(historyFile, (err) => {
        if (err) console.error('⚠️  Failed to load REPL history:', err);
      });

      r.displayPrompt(true);
    }, 200);
  } catch (err) {
    logger.error(err, 'Failed to start REPL:');
    process.exit(1);
  }
})();
