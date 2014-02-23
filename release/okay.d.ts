declare module OkayJS {
    interface IError {
        error: string;
        message: string;
    }
    interface IConfig {
        requiredMsg?: string;
        regexMsg?: string;
        isNumericMsg?: string;
        isDateMsg?: string;
        customMsg?: string;
        minNumberMsg?: string;
        maxNumberMsg?: string;
        minMaxNumberMsg?: string;
        minDateMsg?: string;
        maxDateMsg?: string;
        minMaxDateMsg?: string;
        lengthMsg?: string;
        minLengthMsg?: string;
        maxLengthMsg?: string;
        minMaxLengthMsg?: string;
        parseDate?: (s: string) => Date;
        formatDate?: (d: Date) => string;
    }
    class Okay {
        private _config;
        constructor(config?: IConfig);
        public defineWrapper(rules: any): (target: any) => void;
        public wrap(obj: any, rules: any): any;
        public Required(message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public Regex(expression: RegExp, message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public Min(min: any, message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public Max(max: any, message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public MinMax(min: any, max: any, message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public Length(length: number, message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public MinLength(min: number, message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public MaxLength(max: number, message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public MinMaxLength(min: number, max: number, message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public IsNumeric(message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public IsDate(message?: string): (value: any) => {
            error: string;
            message: string;
        };
        public Custom(fn: (value: any) => boolean, error?: IError): (value: any) => IError;
    }
}
