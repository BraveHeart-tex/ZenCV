import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const sourceRoot = join(process.cwd(), 'src');

const listSourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return listSourceFiles(path);
    }
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });

describe('Document Builder consumer boundaries', () => {
  it('keeps PDF and derived consumers on semantic section snapshots', () => {
    const consumerRoots = [
      join(sourceRoot, 'components/appHome/resumeTemplates'),
      join(sourceRoot, 'components/documentBuilder/resumeOverview'),
      join(sourceRoot, 'components/documentBuilder/resumeScore'),
      join(sourceRoot, 'lib/stores/documentBuilder/builderTemplateStore.ts'),
    ];
    const consumerFiles = consumerRoots.flatMap((root) =>
      root.endsWith('.ts') ? [root] : listSourceFiles(root)
    );
    const violations = consumerFiles
      .filter((path) => !path.includes('/__tests__/'))
      .filter((path) =>
        /currentStoreProjection|TemplateDataSection|client-db\/clientDbSchema|FIELD_NAMES|persistedType/.test(
          readFileSync(path, 'utf8')
        )
      )
      .map((path) => path.slice(process.cwd().length + 1));

    expect(violations).toEqual([]);
  });
});
