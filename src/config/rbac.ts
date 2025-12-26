export const RBAC_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export type Role = typeof RBAC_ROLES[keyof typeof RBAC_ROLES];

export const RBAC_CONFIG = {
  [RBAC_ROLES.SUPER_ADMIN]: ['/super-admin/*'],
  [RBAC_ROLES.ADMIN]: [
    '/admin/*', 
    '!/admin/grades' // Explicitly forbid grades
  ],
  [RBAC_ROLES.TEACHER]: ['/teacher/*'],
  [RBAC_ROLES.STUDENT]: ['/student/*'],
  [RBAC_ROLES.PARENT]: ['/parent/*'],
};
