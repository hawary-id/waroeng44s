export const STATUS = {
    SUCCESS: 'success',
    CANCEL: 'canceled',
  } as const;

  export type Status = keyof typeof STATUS;

  export const transactionStatus = {
    [STATUS.SUCCESS]: 'SUKSES',
    [STATUS.CANCEL]: 'CANCEL',
  };
