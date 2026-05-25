export interface IcOption {
    label: string;
    value: any;
}

export interface IQueryParam {
    param: string | null;
    value: string | null;
}

export interface IParamsCSelect {
    search: string;
    params?: IQueryParam[]
    queryParams?: IQueryParam[]
}