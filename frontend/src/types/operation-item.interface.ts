export interface OperationItemInterface {
    id: number | string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: string;
    comment?: string | null;
}