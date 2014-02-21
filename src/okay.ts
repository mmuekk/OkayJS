export interface IError {
  error: string;
  message: string;
}

var config = {
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

function minNumberMsg(min: number) {
  return config.minNumberMsg.replace('{min}', min.toString());
}

function maxNumberMsg(max: number) {
  return config.maxNumberMsg.replace('{max}', max.toString());
}

function minMaxNumberMsg(min: number, max: number) {
  return config.minMaxNumberMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
}

function minDateMsg(min: Date) {
  return config.minDateMsg.replace('{min}', config.formatDate(min));
}

function maxDateMsg(max: Date) {
  return config.maxDateMsg.replace('{max}', config.formatDate(max));
}

function minMaxDateMsg(min: Date, max: Date) {
  return config.minMaxNumberMsg.replace('{min}', config.formatDate(min)).replace('{max}', config.formatDate(max));
}

function minLengthMsg(min: number) {
  return config.minLengthMsg.replace('{min}', min.toString());
}

function maxLengthMsg(max: number) {
  return config.maxLengthMsg.replace('{max}', max.toString());
}

function minMaxLengthMsg(min: number, max: number) {
  return config.minMaxLengthMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
}

function extend(obj: any, withObj: any) {
  for (var key in withObj) {
    if (withObj.hasOwnProperty(key) && typeof obj[key] === 'undefined') {
      obj[key] = obj[key] || withObj[key];
    }
  }
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

export function Define(rules: any) {
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

export function Required(unvalues?: any[], message?: string) {
  var error = {
    error: "Required",
    message: message || config.requiredMsg
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

export function Regex(expression: RegExp, message?: string) {
  var error = {
    error: "Regex",
    message: message || config.regexMsg
  };
  return (value: any) => {
    if (!expression.test(value.toString())) {
      return error;
    }
    return undefined;
  }
}

function formatDate(date: Date) {
  if (date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() === 0) {
    return date.toDateString();
  } else {
    return date.toString();
  }
}

export function Min(min: any, message?: string) {
  var error = {error: 'Min', message: ''};
  if (typeof min === 'number') {
    error.message = message || minNumberMsg(min);
    return (value: any) => (Number(value) < min) ? error : undefined;
  } else if (min.constructor.name === 'Date') {
    error.message = message || minDateMsg(min);
    return (value: any) => (config.parseDate(value) < min) ? error : undefined;
  }
  throw "Invalid Min value";
}

export function Max(max: any, message?: string) {
  var error = {error: 'Max', message: ''};
  if (typeof max === 'number') {
    error.message = message || maxNumberMsg(max);
    return (value: any) => (Number(value) > max) ? error : undefined;
  } else if (max.constructor.name === 'Date') {
    error.message = message || maxDateMsg(max);
    return (value: any) => (config.parseDate(value) > max) ? error : undefined;
  }
  throw "Invalid Max value";
}

export function MinMax(min: any, max: any, message?: string) {
  var error = {error: 'MinMax', message: ''};
  if (typeof min === 'number' && typeof max === 'number') {
    error.message = message || minMaxNumberMsg(min, max);
    return (value: any) => {
      value = Number(value);
      return (value < min || value > max) ? error : undefined;
    }
  } else if (min.constructor.name === 'Date' && max.constructor.name === 'Date') {
    error.message = message || minMaxDateMsg(min, max);
    return (value: any) => {
      value = config.parseDate(value);
      return (value < min || value > max) ? error : undefined;
    }
  }
}

export function MinLength(min: number, message?: string) {
  var error = {
    error: "MinLength",
    message: message || minLengthMsg(min)
  };
  return (value: any) => value.toString().length < min ? error : undefined;
}

export function MaxLength(max: number, message?: string) {
  var error = {
    error: "MaxLength",
    message: message || maxLengthMsg(max)
  };
  return (value: any) => value.toString().length > max ? error : undefined;
}

export function MinMaxLength(min: number, max: number, message?: string) {
  var error = {
    error: "MinMaxLength",
    message: message || minMaxLengthMsg(min, max)
  };
  return (value: any) => {
    value = value.toString();
    return (value.length < min || value.length > max) ? error : undefined;
  }
}

export function IsNumeric(message?: string) {
  var error = {
    error: "IsNumeric",
    message: message || config.isNumericMsg
  };
  return (value: any) => isNaN(value) ? error : undefined;
}

export function IsDate(message?: string) {
  var error = {
    error: "IsDate",
    message: message || config.isDateMsg
  };
  return (value: any) => isNaN(config.parseDate(value)) ? error : undefined;
}

export function Custom(fn: (value: any) => boolean, error?: IError) {
  if (!error) {
    error = {error: "Custom", message: config.customMsg};
  } else if (!error.message) {
    error.message = config.customMsg;
  }
  return (value: any) => !fn(value) ? error : undefined;
}