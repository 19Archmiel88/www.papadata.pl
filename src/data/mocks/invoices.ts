export type Invoice = {
  id: string;
  number: string;
  amount: number;
  statusKey: string;
  issued: string;
  due: string;
};

export const invoices: Invoice[] = [
  {
    id: 'inv-2024-08',
    number: 'INV-2024-08',
    amount: 18900,
    statusKey: 'dashboard.billing.status.paid',
    issued: '2024-08-01',
    due: '2024-08-10',
  },
  {
    id: 'inv-2024-07',
    number: 'INV-2024-07',
    amount: 18900,
    statusKey: 'dashboard.billing.status.paid',
    issued: '2024-07-01',
    due: '2024-07-10',
  },
  {
    id: 'inv-2024-06',
    number: 'INV-2024-06',
    amount: 18900,
    statusKey: 'dashboard.billing.status.processing',
    issued: '2024-06-01',
    due: '2024-06-10',
  },
];
