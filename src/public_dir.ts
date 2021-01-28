import path from 'path';
import fs from 'fs/promises';

export function getPublicDir(): string {
  return path.join(__dirname, '..', 'public');
}

export async function saveToPublicDir(
  fileName: string,
  content: string,
): Promise<void> {
  const dir = getPublicDir();

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), content);
}
