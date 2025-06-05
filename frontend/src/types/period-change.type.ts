export type PeriodChangeType = {
    period: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
}

export type FilterControlsOptions = {
    onPeriodChange: (payload: PeriodChangeType) => void;
};
