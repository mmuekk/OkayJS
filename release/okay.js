define(["require", "exports"], function(require, exports) {
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

    function minNumberMsg(min) {
        return config.minNumberMsg.replace('{min}', min.toString());
    }

    function maxNumberMsg(max) {
        return config.maxNumberMsg.replace('{max}', max.toString());
    }

    function minMaxNumberMsg(min, max) {
        return config.minMaxNumberMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
    }

    function minDateMsg(min) {
        return config.minDateMsg.replace('{min}', config.formatDate(min));
    }

    function maxDateMsg(max) {
        return config.maxDateMsg.replace('{max}', config.formatDate(max));
    }

    function minMaxDateMsg(min, max) {
        return config.minMaxNumberMsg.replace('{min}', config.formatDate(min)).replace('{max}', config.formatDate(max));
    }

    function minLengthMsg(min) {
        return config.minLengthMsg.replace('{min}', min.toString());
    }

    function maxLengthMsg(max) {
        return config.maxLengthMsg.replace('{max}', max.toString());
    }

    function minMaxLengthMsg(min, max) {
        return config.minMaxLengthMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
    }

    function extend(obj, withObj) {
        for (var key in withObj) {
            if (withObj.hasOwnProperty(key) && typeof obj[key] === 'undefined') {
                obj[key] = obj[key] || withObj[key];
            }
        }
    }

    function isArray(obj) {
        return obj.constructor.toString().indexOf("Array") > -1;
    }

    function defineSingleRuleProperty(type, key, rule) {
        Object.defineProperty(type.prototype, key, {
            get: function () {
                return rule(this.target[key]);
            },
            enumerable: true,
            configurable: true
        });
    }

    function defineMultiRuleProperty(type, key, rules) {
        var len = rules.length;
        Object.defineProperty(type.prototype, key, {
            get: function () {
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

    function Define(rules) {
        function Validator(target) {
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
    exports.Define = Define;

    function Required(unvalues, message) {
        var error = {
            error: "Required",
            message: message || config.requiredMsg
        };
        return function (value) {
            if (typeof value === "undefined") {
                return error;
            }
            if (unvalues && unvalues.indexOf(value) > -1) {
                return error;
            }
            return undefined;
        };
    }
    exports.Required = Required;

    function Regex(expression, message) {
        var error = {
            error: "Regex",
            message: message || config.regexMsg
        };
        return function (value) {
            if (!expression.test(value.toString())) {
                return error;
            }
            return undefined;
        };
    }
    exports.Regex = Regex;

    function formatDate(date) {
        if (date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() === 0) {
            return date.toDateString();
        } else {
            return date.toString();
        }
    }

    function Min(min, message) {
        var error = { error: 'Min', message: '' };
        if (typeof min === 'number') {
            error.message = message || minNumberMsg(min);
            return function (value) {
                return (Number(value) < min) ? error : undefined;
            };
        } else if (min.constructor.name === 'Date') {
            error.message = message || minDateMsg(min);
            return function (value) {
                return (config.parseDate(value) < min) ? error : undefined;
            };
        }
        throw "Invalid Min value";
    }
    exports.Min = Min;

    function Max(max, message) {
        var error = { error: 'Max', message: '' };
        if (typeof max === 'number') {
            error.message = message || maxNumberMsg(max);
            return function (value) {
                return (Number(value) > max) ? error : undefined;
            };
        } else if (max.constructor.name === 'Date') {
            error.message = message || maxDateMsg(max);
            return function (value) {
                return (config.parseDate(value) > max) ? error : undefined;
            };
        }
        throw "Invalid Max value";
    }
    exports.Max = Max;

    function MinMax(min, max, message) {
        var error = { error: 'MinMax', message: '' };
        if (typeof min === 'number' && typeof max === 'number') {
            error.message = message || minMaxNumberMsg(min, max);
            return function (value) {
                value = Number(value);
                return (value < min || value > max) ? error : undefined;
            };
        } else if (min.constructor.name === 'Date' && max.constructor.name === 'Date') {
            error.message = message || minMaxDateMsg(min, max);
            return function (value) {
                value = config.parseDate(value);
                return (value < min || value > max) ? error : undefined;
            };
        }
    }
    exports.MinMax = MinMax;

    function MinLength(min, message) {
        var error = {
            error: "MinLength",
            message: message || minLengthMsg(min)
        };
        return function (value) {
            return value.toString().length < min ? error : undefined;
        };
    }
    exports.MinLength = MinLength;

    function MaxLength(max, message) {
        var error = {
            error: "MaxLength",
            message: message || maxLengthMsg(max)
        };
        return function (value) {
            return value.toString().length > max ? error : undefined;
        };
    }
    exports.MaxLength = MaxLength;

    function MinMaxLength(min, max, message) {
        var error = {
            error: "MinMaxLength",
            message: message || minMaxLengthMsg(min, max)
        };
        return function (value) {
            value = value.toString();
            return (value.length < min || value.length > max) ? error : undefined;
        };
    }
    exports.MinMaxLength = MinMaxLength;

    function IsNumeric(message) {
        var error = {
            error: "IsNumeric",
            message: message || config.isNumericMsg
        };
        return function (value) {
            return isNaN(value) ? error : undefined;
        };
    }
    exports.IsNumeric = IsNumeric;

    function IsDate(message) {
        var error = {
            error: "IsDate",
            message: message || config.isDateMsg
        };
        return function (value) {
            return isNaN(config.parseDate(value)) ? error : undefined;
        };
    }
    exports.IsDate = IsDate;

    function Custom(fn, error) {
        if (!error) {
            error = { error: "Custom", message: config.customMsg };
        } else if (!error.message) {
            error.message = config.customMsg;
        }
        return function (value) {
            return !fn(value) ? error : undefined;
        };
    }
    exports.Custom = Custom;
});
