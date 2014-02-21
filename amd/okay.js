define([], function() {
var Okay;
(function (Okay) {
    function extend(obj, withObj) {
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

    function formatDate(date) {
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

    var Builder = (function () {
        function Builder(config) {
            this._config = config ? extend(config, defaultConfig) : defaultConfig;
        }
        Builder.prototype.minNumberMsg = function (min) {
            return this._config.minNumberMsg.replace('{min}', min.toString());
        };

        Builder.prototype.maxNumberMsg = function (max) {
            return this._config.maxNumberMsg.replace('{max}', max.toString());
        };

        Builder.prototype.minMaxNumberMsg = function (min, max) {
            return this._config.minMaxNumberMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
        };

        Builder.prototype.minDateMsg = function (min) {
            return this._config.minDateMsg.replace('{min}', this._config.formatDate(min));
        };

        Builder.prototype.maxDateMsg = function (max) {
            return this._config.maxDateMsg.replace('{max}', this._config.formatDate(max));
        };

        Builder.prototype.minMaxDateMsg = function (min, max) {
            return this._config.minMaxNumberMsg.replace('{min}', this._config.formatDate(min)).replace('{max}', this._config.formatDate(max));
        };

        Builder.prototype.minLengthMsg = function (min) {
            return this._config.minLengthMsg.replace('{min}', min.toString());
        };

        Builder.prototype.maxLengthMsg = function (max) {
            return this._config.maxLengthMsg.replace('{max}', max.toString());
        };

        Builder.prototype.minMaxLengthMsg = function (min, max) {
            return this._config.minMaxLengthMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
        };

        Builder.prototype.Define = function (rules) {
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
        };

        Builder.prototype.Required = function (unvalues, message) {
            var error = {
                error: "Required",
                message: message || this._config.requiredMsg
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
        };

        Builder.prototype.Regex = function (expression, message) {
            var error = {
                error: "Regex",
                message: message || this._config.regexMsg
            };
            return function (value) {
                if (!expression.test(value.toString())) {
                    return error;
                }
                return undefined;
            };
        };

        Builder.prototype.Min = function (min, message) {
            var _this = this;
            var error = { error: 'Min', message: '' };
            if (typeof min === 'number') {
                error.message = message || this.minNumberMsg(min);
                return function (value) {
                    return (Number(value) < min) ? error : undefined;
                };
            } else if (min.constructor.name === 'Date') {
                error.message = message || this.minDateMsg(min);
                return function (value) {
                    return (_this._config.parseDate(value) < min) ? error : undefined;
                };
            }
            throw "Invalid Min value";
        };

        Builder.prototype.Max = function (max, message) {
            var _this = this;
            var error = { error: 'Max', message: '' };
            if (typeof max === 'number') {
                error.message = message || this.maxNumberMsg(max);
                return function (value) {
                    return (Number(value) > max) ? error : undefined;
                };
            } else if (max.constructor.name === 'Date') {
                error.message = message || this.maxDateMsg(max);
                return function (value) {
                    return (_this._config.parseDate(value) > max) ? error : undefined;
                };
            }
            throw "Invalid Max value";
        };

        Builder.prototype.MinMax = function (min, max, message) {
            var _this = this;
            var error = { error: 'MinMax', message: '' };
            if (typeof min === 'number' && typeof max === 'number') {
                error.message = message || this.minMaxNumberMsg(min, max);
                return function (value) {
                    value = Number(value);
                    return (value < min || value > max) ? error : undefined;
                };
            } else if (min.constructor.name === 'Date' && max.constructor.name === 'Date') {
                error.message = message || this.minMaxDateMsg(min, max);
                return function (value) {
                    value = _this._config.parseDate(value);
                    return (value < min || value > max) ? error : undefined;
                };
            }
        };

        Builder.prototype.MinLength = function (min, message) {
            var error = {
                error: "MinLength",
                message: message || this.minLengthMsg(min)
            };
            return function (value) {
                return value.toString().length < min ? error : undefined;
            };
        };

        Builder.prototype.MaxLength = function (max, message) {
            var error = {
                error: "MaxLength",
                message: message || this.maxLengthMsg(max)
            };
            return function (value) {
                return value.toString().length > max ? error : undefined;
            };
        };

        Builder.prototype.MinMaxLength = function (min, max, message) {
            var error = {
                error: "MinMaxLength",
                message: message || this.minMaxLengthMsg(min, max)
            };
            return function (value) {
                value = value.toString();
                return (value.length < min || value.length > max) ? error : undefined;
            };
        };

        Builder.prototype.IsNumeric = function (message) {
            var error = {
                error: "IsNumeric",
                message: message || this._config.isNumericMsg
            };
            return function (value) {
                return isNaN(value) ? error : undefined;
            };
        };

        Builder.prototype.IsDate = function (message) {
            var _this = this;
            var error = {
                error: "IsDate",
                message: message || this._config.isDateMsg
            };
            return function (value) {
                return isNaN(_this._config.parseDate(value)) ? error : undefined;
            };
        };

        Builder.prototype.Custom = function (fn, error) {
            if (!error) {
                error = { error: "Custom", message: this._config.customMsg };
            } else if (!error.message) {
                error.message = this._config.customMsg;
            }
            return function (value) {
                return !fn(value) ? error : undefined;
            };
        };
        return Builder;
    })();
    Okay.Builder = Builder;
})(Okay || (Okay = {}));

  return new Okay.Builder();
});