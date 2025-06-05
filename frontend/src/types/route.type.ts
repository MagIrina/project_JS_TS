export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: string | false,
    load?: () => void;
    unLoad?: () => void;
    styles?: string[];
    scripts?: string[];
}