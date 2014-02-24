module OkayJS {
  export interface IError {
    error: string;
    message: string;
  }

  export interface IErrors {
    [key: string]: IError;
  }

  export interface IConfig {
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

  export declare class Wrapper {
    constructor(obj: any);
    any(): boolean;
    errors(): IErrors;
    static check(obj: any): IErrors;
  }

  function extend(obj: any, withObj: any) {
    for (var key in withObj) {
      if (withObj.hasOwnProperty(key) && typeof obj[key] === 'undefined') {
        obj[key] = obj[key] || withObj[key];
      }
    }
    return obj;
  }

  function isArray(obj) {
    return obj.constructor.toString().indexOf("Array") > -1;
  }

  function defineSingleRuleProperty(type: any, key: string, rule: any) {
    Object.defineProperty(type.prototype, key, {
      get: function() {
        return rule(this.target[key]);
      },
      enumerable: true,
      configurable: true
    });
  }

  function defineMultiRuleProperty(type: any, key: string, rules: any) {
    var len = rules.length;
    Object.defineProperty(type.prototype, key, {
      get: function() {
        for (var i = 0; i < len; i++) {
          var error = rules[i](this.target[key]);
          if (error) {
            return error;
          }
        }
        return undefined;
      },
      enumerable: true,
      configurable: true
    });
  }

  function formatDate(date: Date) {
    if (date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() === 0) {
      return date.toDateString();
    } else {
      return date.toString();
    }
  }

  var defaultConfig: IConfig = {
    requiredMsg: "is required",
    regexMsg: "is not a valid value",
    isNumericMsg: "is not a numeric value",
    isDateMsg: "is not a date value",
    customMsg: "is not a valid value",
    minNumberMsg: "must be at least {min}",
    maxNumberMsg: "must be no more than {max}",
    minMaxNumberMsg: "must be between {min} and {max}",
    minDateMsg: "must be no earlier than {min}",
    maxDateMsg: "must be no later than {max}",
    minMaxDateMsg: "must be between {min} and {max}",
    lengthMsg: "must be {length} characters",
    minLengthMsg: "must be at least {min} characters",
    maxLengthMsg: "must be no more than {max} characters",
    minMaxLengthMsg: "must be between {min} and {max} characters",
    parseDate: (s) => new Date(Date.parse(s)),
    formatDate: formatDate
  };

  function minNumberMsg(min: number, config: IConfig = defaultConfig) {
    return config.minNumberMsg.replace('{min}', min.toString());
  }

  function maxNumberMsg(max: number, config: IConfig = defaultConfig) {
    return config.maxNumberMsg.replace('{max}', max.toString());
  }

  function minMaxNumberMsg(min: number, max: number, config: IConfig = defaultConfig) {
    return config.minMaxNumberMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
  }

  function minDateMsg(min: Date, config: IConfig = defaultConfig) {
    return config.minDateMsg.replace('{min}', config.formatDate(min));
  }

  function maxDateMsg(max: Date, config: IConfig = defaultConfig) {
    return config.maxDateMsg.replace('{max}', config.formatDate(max));
  }

  function minMaxDateMsg(min: Date, max: Date, config: IConfig = defaultConfig) {
    return config.minMaxNumberMsg.replace('{min}', config.formatDate(min)).replace('{max}', config.formatDate(max));
  }

  function lengthMsg(length: number, config: IConfig = defaultConfig) {
    return config.lengthMsg.replace('{length}', length.toString());
  }

  function minLengthMsg(min: number, config: IConfig = defaultConfig) {
    return config.minLengthMsg.replace('{min}', min.toString());
  }

  function maxLengthMsg(max: number, config: IConfig = defaultConfig) {
    return config.maxLengthMsg.replace('{max}', max.toString());
  }

  function minMaxLengthMsg(min: number, max: number, config: IConfig = defaultConfig) {
    return config.minMaxLengthMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
  }

  export class Okay {
    private _config: IConfig;

    constructor(config?: IConfig) {
      this._config = config ? extend(config, defaultConfig) : defaultConfig;
    }

    public configureDefaults(config: IConfig) {
      for (var key in config){
        if (config.hasOwnProperty(key) && typeof config[key] !== undefined) {
          defaultConfig[key] = config[key];
        }
      }
    }

    public withConfig(config: IConfig) {
      return new Okay(config);
    }

    public defineWrapper(rules: any) : typeof Wrapper {
      function Validator(target: any) {
        this.target = target;
      }
      var keys = [];
      for (var key in rules) {
        if (!rules.hasOwnProperty(key)) {
          continue;
        }
        var keyRules = rules[key];
        if (isArray(keyRules)) {
          defineMultiRuleProperty(Validator, key, keyRules);
        } else {
          defineSingleRuleProperty(Validator, key, keyRules);
        }
        keys.push(key);
      }

      Validator.prototype.any = function() {
        for (var i = 0; i < keys.length; i++) {
          if (this[keys[i]]) {
            return true;
          }
        }
        return false;
      };

      Validator.prototype.errors = function() {
        var errors = {};
        for (var i = 0; i < keys.length; i++) {
          if (this[keys[i]]) {
            errors[key] = this[keys[i]];
          }
        }
        return errors;
      };

      (<any>Validator).check = function(obj: any) {
        var wrapper = new Validator(obj);
        return wrapper.errors();
      }
      return <typeof Wrapper><any>Validator;
    }

    public wrap(obj: any, rules: any) {
      var wrapper = this.defineWrapper(rules);
      return new wrapper(obj);
    }

    public Required(message?: string) {
      var error: IError = {
        error: "Required",
        message: message || this._config.requiredMsg
      };
      return (value: any) => {
        if (typeof value === "undefined" || value === null || value.toString() === '') {
          return error;
        }
        return undefined;
      }
    }

    public Regex(expression: RegExp, message?: string) {
      var error: IError = {
        error: "Regex",
        message: message || this._config.regexMsg
      };
      return (value: any) => {
        if (!expression.test(value.toString())) {
          return error;
        }
        return undefined;
      }
    }

    public Min(min: any, message?: string) {
      var error: IError = {error: 'Min', message: ''};
      if (typeof min === 'number') {
        error.message = message || minNumberMsg(min, this._config);
        return (value: any) => (Number(value) < min) ? error : undefined;
      } else if (min.constructor.name === 'Date') {
        error.message = message || minDateMsg(min, this._config);
        return (value: any) => (this._config.parseDate(value) < min) ? error : undefined;
      }
      throw "Invalid Min value";
    }

    public Max(max: any, message?: string) {
      var error: IError = {error: 'Max', message: ''};
      if (typeof max === 'number') {
        error.message = message || maxNumberMsg(max, this._config);
        return (value: any) => (Number(value) > max) ? error : undefined;
      } else if (max.constructor.name === 'Date') {
        error.message = message || maxDateMsg(max, this._config);
        return (value: any) => (this._config.parseDate(value) > max) ? error : undefined;
      }
      throw "Invalid Max value";
    }

    public MinMax(min: any, max: any, message?: string) {
      var error: IError = {error: 'MinMax', message: ''};
      if (typeof min === 'number' && typeof max === 'number') {
        error.message = message || minMaxNumberMsg(min, max, this._config);
        return (value: any) => {
          value = Number(value);
          return (value < min || value > max) ? error : undefined;
        }
      } else if (min.constructor.name === 'Date' && max.constructor.name === 'Date') {
        error.message = message || minMaxDateMsg(min, max, this._config);
        return (value: any) => {
          value = this._config.parseDate(value);
          return (value < min || value > max) ? error : undefined;
        }
      }
    }

    public Length(length: number, message?: string) {
      var error: IError = {
        error: "Length",
        message: message || lengthMsg(length, this._config)
      };
      return (value: any) => value.toString().length !== length ? error : undefined;
    }

    public MinLength(min: number, message?: string) {
      var error: IError = {
        error: "MinLength",
        message: message || minLengthMsg(min, this._config)
      };
      return (value: any) => value.toString().length < min ? error : undefined;
    }

    public MaxLength(max: number, message?: string) {
      var error: IError = {
        error: "MaxLength",
        message: message || maxLengthMsg(max, this._config)
      };
      return (value: any) => value.toString().length > max ? error : undefined;
    }

    public MinMaxLength(min: number, max: number, message?: string) {
      var error: IError = {
        error: "MinMaxLength",
        message: message || minMaxLengthMsg(min, max, this._config)
      };
      return (value: any) => {
        value = value.toString();
        return (value.length < min || value.length > max) ? error : undefined;
      }
    }

    public IsNumeric(message?: string) {
      var error: IError = {
        error: "IsNumeric",
        message: message || this._config.isNumericMsg
      };
      return (value: any) => isNaN(value) ? error : undefined;
    }

    public IsDate(message?: string) {
      var error: IError = {
        error: "IsDate",
        message: message || this._config.isDateMsg
      };
      return (value: any) => isNaN(<any>this._config.parseDate(value)) ? error : undefined;
    }

    public Custom(fn: (value: any) => boolean, error?: IError) : (value: any) => IError;
    public Custom(fn: (value: any) => Function, error?: IError) : (value: any) => IError;
    public Custom(fn: (value: any) => any, error?: IError) {
      if (!error) {
        error = {error: "Custom", message: this._config.customMsg};
      } else if (!error.message) {
        error.message = this._config.customMsg;
      }
      return (value: any) : IError => !fn(value) ? error : undefined;
    }
  }
}