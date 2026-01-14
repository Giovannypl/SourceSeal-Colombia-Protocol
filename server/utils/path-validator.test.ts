import { validatePathInBounds } from './path-validator';
import path from 'path';

describe('Path Validator - Honeytoken Trap Security', () => {
  const BASE_DIR = '/tmp/secure_traps';

  test('should allow files directly inside the base directory', () => {
    const target = path.join(BASE_DIR, 'sensitive_contacts.vcf');
    expect(validatePathInBounds(BASE_DIR, target)).toBe(true);
  });

  test('should allow files in subdirectories (if applicable)', () => {
    const target = path.join(BASE_DIR, 'logs', 'audit.log');
    expect(validatePathInBounds(BASE_DIR, target)).toBe(true);
  });

  test('should block directory traversal attempts using ..', () => {
    const target = path.join(BASE_DIR, '../../etc/passwd');
    expect(validatePathInBounds(BASE_DIR, target)).toBe(false);
  });

  test('should block absolute paths outside the base directory', () => {
    const target = '/etc/passwd';
    expect(validatePathInBounds(BASE_DIR, target)).toBe(false);
  });

  test('should block null byte injection attempts (if possible via path resolve)', () => {
    const target = path.join(BASE_DIR, 'file.txt\0/../../etc/passwd');
    expect(validatePathInBounds(BASE_DIR, target)).toBe(false);
  });

  test('should handle edge case where target is the base directory itself', () => {
    expect(validatePathInBounds(BASE_DIR, BASE_DIR)).toBe(true);
  });
});
