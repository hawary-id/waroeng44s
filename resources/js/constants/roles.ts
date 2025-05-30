export const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    EMPLOYEE: 'employee',
  } as const;

  export type Role = keyof typeof ROLES;

  export const allRoles = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.USER]: 'User',
    [ROLES.EMPLOYEE]: 'Employee',
  };
