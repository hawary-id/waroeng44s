export const STATUS = {
    NONACTIVE: '0',
    ACTIVE: '1',
    // EXPIRED: '2',
  } as const;

  export type Status = keyof typeof STATUS;

  export const employeeStatus = {
    [STATUS.ACTIVE]: 'Aktif',
    [STATUS.NONACTIVE]: 'Non Aktif',
    // [STATUS.EXPIRED]: 'Expired',
  };
