export type OperationType = {
    id: number;
    type: "income" | "expense";
    category: string;
    amount: number;
    date: string;
    comment?: string;
};