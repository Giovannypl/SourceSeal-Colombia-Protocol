import path from 'path';

/**
 * Validates that a target path is strictly within the allowed base directory.
 * Prevents directory traversal attacks (e.g., ../../etc/passwd).
 */
export function validatePathInBounds(baseDir: string, targetPath: string): boolean {
  const absoluteBase = path.resolve(baseDir);
  const absoluteTarget = path.resolve(targetPath);
  
  return absoluteTarget.startsWith(absoluteBase);
}
