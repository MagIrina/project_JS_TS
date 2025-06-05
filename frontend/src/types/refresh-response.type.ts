import {TokensType} from "./tokens.type";


export type RefreshResponseType = {
    error?: string;
    response?: {
        tokens: TokensType;
    };
}