import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CURRENT_STORE_DTO_IMPORT_ALLOWLIST,
  CURRENT_STORE_PROJECTION_IMPORT_ALLOWLIST,
} from '../currentStoreProjection';

const sourceRoot = join(process.cwd(), 'src');

const listSourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return listSourceFiles(path);
    }
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });

const relativePath = (path: string) => path.slice(process.cwd().length + 1);

describe('current store projection architecture', () => {
  it('has one explicit projection importer', () => {
    const consumers = listSourceFiles(sourceRoot)
      .filter((path) =>
        readFileSync(path, 'utf8').includes('currentStoreProjection')
      )
      .map(relativePath)
      .filter(
        (path) =>
          path !== 'src/lib/stores/documentBuilder/currentStoreProjection.ts' &&
          !path.includes('/__tests__/')
      );

    expect(consumers).toEqual([...CURRENT_STORE_PROJECTION_IMPORT_ALLOWLIST]);
  });

  it('contains persistence DTO imports inside approved domain and legacy boundaries', () => {
    const consumers = [
      ...listSourceFiles(join(sourceRoot, 'lib/builderDocument')),
      ...listSourceFiles(join(sourceRoot, 'lib/stores/documentBuilder')),
    ]
      .filter((path) =>
        readFileSync(path, 'utf8').includes('client-db/clientDbSchema')
      )
      .map(relativePath)
      .filter((path) => !path.includes('/__tests__/'));

    expect(consumers.sort()).toEqual(
      [...CURRENT_STORE_DTO_IMPORT_ALLOWLIST].sort()
    );
  });
});
