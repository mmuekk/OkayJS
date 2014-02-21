module Okay {
  export interface IError {
    error: string;
    message: string;
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
    minLengthMsg?: string;
    maxLengthMsg?: string;
    minMaxLengthMsg?: string;
    parseDate?: (s: string) => Date;
    formatDate?: (d: Date) => string;
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

  var defaultConfig = {
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
    minLengthMsg: "must be at least {min} characters",
    maxLengthMsg: "must be no more than {max} characters",
    minMaxLengthMsg: "must be between {min} and {max} characters",
    parseDate: Date.parse,
    formatDate: formatDate
  };

  export class Builder {
    private _config: IConfig;

    constructor(config?: IConfig) {
      this._config = config ? extend(config, defaultConfig) : defaultConfig;
    }

    private minNumberMsg(min: number) {
      return this._config.minNumberMsg.replace('{min}', min.toString());
    }

    private maxNumberMsg(max: number) {
      return this._config.maxNumberMsg.replace('{max}', max.toString());
    }

    private minMaxNumberMsg(min: number, max: number) {
      return this._config.minMaxNumberMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
    }

    private minDateMsg(min: Date) {
      return this._config.minDateMsg.replace('{min}', this._config.formatDate(min));
    }

    private maxDateMsg(max: Date) {
      return this._config.maxDateMsg.replace('{max}', this._config.formatDate(max));
    }

    private minMaxDateMsg(min: Date, max: Date) {
      return this._config.minMaxNumberMsg.replace('{min}', this._config.formatDate(min)).replace('{max}', this._config.formatDate(max));
    }

    private minLengthMsg(min: number) {
      return this._config.minLengthMsg.replace('{min}', min.toString());
    }

    private maxLengthMsg(max: number) {
      return this._config.maxLengthMsg.replace('{max}', max.toString());
    }

    private minMaxLengthMsg(min: number, max: number) {
      return this._config.minMaxLengthMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
    }

    public Define(rules: any) {
      function Validator(target: any) {
        this.target = target;
      }
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
      }
      return Validator;
    }

    public Required(unvalues?: any[], message?: string) {
      var error = {
        error: "Required",
        message: message || this._config.requiredMsg
      };
      return (value: any) => {
        if (typeof value === "undefined") {
          return error;
        }
        if (unvalues && unvalues.indexOf(value) > -1) {
          return error;
        }
        return undefined;
      }
    }

    public Regex(expression: RegExp, message?: string) {
      var error = {
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
      var error = {error: 'Min', message: ''};
      if (typeof min === 'number') {
        error.message = message || this.minNumberMsg(min);
        return (value: any) => (Number(value) < min) ? error : undefined;
      } else if (min.constructor.name === 'Date') {
        error.message = message || this.minDateMsg(min);
        return (value: any) => (this._config.parseDate(value) < min) ? error : undefined;
      }
      throw "Invalid Min value";
    }

    public Max(max: any, message?: string) {
      var error = {error: 'Max', message: ''};
      if (typeof max === 'number') {
        error.message = message || this.maxNumberMsg(max);
        return (value: any) => (Number(value) > max) ? error : undefined;
      } else if (max.constructor.name === 'Date') {
        error.message = message || this.maxDateMsg(max);
        return (value: any) => (this._config.parseDate(value) > max) ? error : undefined;
      }
      throw "Invalid Max value";
    }

    public MinMax(min: any, max: any, message?: string) {
      var error = {error: 'MinMax', message: ''};
      if (typeof min === 'number' && typeof max === 'number') {
        error.message = message || this.minMaxNumberMsg(min, max);
        return (value: any) => {
          value = Number(value);
          return (value < min || value > max) ? error : undefined;
        }
      } else if (min.constructor.name === 'Date' && max.constructor.name === 'Date') {
        error.message = message || this.minMaxDateMsg(min, max);
        return (value: any) => {
          value = this._config.parseDate(value);
          return (value < min || value > max) ? error : undefined;
        }
      }
    }

    public MinLength(min: number, message?: string) {
      var error = {
        error: "MinLength",
        message: message || this.minLengthMsg(min)
      };
      return (value: any) => value.toString().length < min ? error : undefined;
    }

    public MaxLength(max: number, message?: string) {
      var error = {
        error: "MaxLength",
        message: message || this.maxLengthMsg(max)
      };
      return (value: any) => value.toString().length > max ? error : undefined;
    }

    public MinMaxLength(min: number, max: number, message?: string) {
      var error = {
        error: "MinMaxLength",
        message: message || this.minMaxLengthMsg(min, max)
      };
      return (value: any) => {
        value = value.toString();
        return (value.length < min || value.length > max) ? error : undefined;
      }
    }

    public IsNumeric(message?: string) {
      var error = {
        error: "IsNumeric",
        message: message || this._config.isNumericMsg
      };
      return (value: any) => isNaN(value) ? error : undefined;
    }

    public IsDate(message?: string) {
      var error = {
        error: "IsDate",
        message: message || this._config.isDateMsg
      };
      return (value: any) => isNaN(<any>this._config.parseDate(value)) ? error : undefined;
    }

    public Custom(fn: (value: any) => boolean, error?: IError) {
      if (!error) {
        error = {error: "Custom", message: this._config.customMsg};
      } else if (!error.message) {
        error.message = this._config.customMsg;
      }
      return (value: any) => !fn(value) ? error : undefined;
    }
  }
}