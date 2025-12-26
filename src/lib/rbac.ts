import { RBAC_CONFIG, type Role } from '@/config/rbac';

/**
 * Checks if a given path is allowed for a user role based on RBAC configuration.
 * Supports simple glob patterns:
 * - '*' matches anything
 * - '!' at start negates the match
 */
export function isPathAllowed(role: Role | undefined | string, path: string): boolean {
  if (!role || !RBAC_CONFIG[role as Role]) {
    return false;
  }

  const allowedPatterns = RBAC_CONFIG[role as Role];
  let isAllowed = false;

  for (const pattern of allowedPatterns) {
    if (pattern.startsWith('!')) {
      // Negation pattern
      const cleanPattern = pattern.slice(1);
      if (matchesPattern(cleanPattern, path)) {
        return false; // Explicitly denied
      }
    } else {
      // Positive pattern
      if (matchesPattern(pattern, path)) {
        isAllowed = true;
      }
    }
  }

  return isAllowed;
}

function matchesPattern(pattern: string, path: string): boolean {
  // Convert basic glob pattern to regex
  // * becomes .*
  // Escape other special regex characters
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexString = '^' + escaped.replace(/\*/g, '.*') + '$';
  const regex = new RegExp(regexString);
  return regex.test(path);
}
