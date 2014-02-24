declare module OkayJS {
    interface IError {
        error: string;
        message: string;
    }
    interface IErrors {
        [key: string]: IError;
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
    class Wrapper {
        constructor(obj: any);
        public any(): boolean;
        public errors(): IErrors;
        static check(obj: any): IErrors;
    }
    class Okay {
        private _config;
        constructor(config?: IConfig);
        public configureDefaults(config: IConfig): void;
        public withConfig(config: IConfig): Okay;
        public defineWrapper(rules: any): typeof Wrapper;
        public wrap(obj: any, rules: any): Wrapper;
        public Required(message?: string): (value: any) => IError;
        public Regex(expression: RegExp, message?: string): (value: any) => IError;
        public Min(min: any, message?: string): (value: any) => IError;
        public Max(max: any, message?: string): (value: any) => IError;
        public MinMax(min: any, max: any, message?: string): (value: any) => IError;
        public Length(length: number, message?: string): (value: any) => IError;
        public MinLength(min: number, message?: string): (value: any) => IError;
        public MaxLength(max: number, message?: string): (value: any) => IError;
        public MinMaxLength(min: number, max: number, message?: string): (value: any) => IError;
        public IsNumeric(message?: string): (value: any) => IError;
        public IsDate(message?: string): (value: any) => IError;
        public Custom(fn: (value: any) => boolean, error?: IError): (value: any) => IError;
        public Custom(fn: (value: any) => Function, error?: IError): (value: any) => IError;
    }
}
