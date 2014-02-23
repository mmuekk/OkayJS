(function(){

var OkayJS;
(function (OkayJS) {
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
        lengthMsg: "must be {length} characters",
        minLengthMsg: "must be at least {min} characters",
        maxLengthMsg: "must be no more than {max} characters",
        minMaxLengthMsg: "must be between {min} and {max} characters",
        parseDate: function (s) {
            return new Date(Date.parse(s));
        },
        formatDate: formatDate
    };

    function minNumberMsg(min, config) {
        if (typeof config === "undefined") { config = defaultConfig; }
        return config.minNumberMsg.replace('{min}', min.toString());
    }

    function maxNumberMsg(max, config) {
        if (typeof config === "undefined") { config = defaultConfig; }
        return config.maxNumberMsg.replace('{max}', max.toString());
    }

    function minMaxNumberMsg(min, max, config) {
        if (typeof config === "undefined") { config = defaultConfig; }
        return config.minMaxNumberMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
    }

    function minDateMsg(min, config) {
        if (typeof config === "undefined") { config = defaultConfig; }
        return config.minDateMsg.replace('{min}', config.formatDate(min));
    }

    function maxDateMsg(max, config) {
        if (typeof config === "undefined") { config = defaultConfig; }
        return config.maxDateMsg.replace('{max}', config.formatDate(max));
    }

    function minMaxDateMsg(min, max, config) {
        if (typeof config === "undefined") { config = defaultConfig; }
        return config.minMaxNumberMsg.replace('{min}', config.formatDate(min)).replace('{max}', config.formatDate(max));
    }

    function lengthMsg(length, config) {
        if (typeof config === "undefined") { config = defaultConfig; }
        return config.lengthMsg.replace('{length}', length.toString());
    }

    function minLengthMsg(min, config) {
        if (typeof config === "undefined") { config = defaultConfig; }
        return config.minLengthMsg.replace('{min}', min.toString());
    }

    function maxLengthMsg(max, config) {
        if (typeof config === "undefined") { config = defaultConfig; }
        return config.maxLengthMsg.replace('{max}', max.toString());
    }

    function minMaxLengthMsg(min, max, config) {
        if (typeof config === "undefined") { config = defaultConfig; }
        return config.minMaxLengthMsg.replace('{min}', min.toString()).replace('{max}', max.toString());
    }

    var Okay = (function () {
        function Okay(config) {
            this._config = config ? extend(config, defaultConfig) : defaultConfig;
        }
        Okay.prototype.defineWrapper = function (rules) {
            function Validator(target) {
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
            Validator.prototype.any = function () {
                for (var i = 0; i < keys.length; i++) {
                    if (this[keys[i]]) {
                        return true;
                    }
                }
                return false;
            };
            return Validator;
        };

        Okay.prototype.wrap = function (obj, rules) {
            var wrapper = this.defineWrapper(rules);
            return new wrapper(obj);
        };

        Okay.prototype.Required = function (message) {
            var error = {
                error: "Required",
                message: message || this._config.requiredMsg
            };
            return function (value) {
                if (typeof value === "undefined" || value === null || value.toString() === '') {
                    return error;
                }
                return undefined;
            };
        };

        Okay.prototype.Regex = function (expression, message) {
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

        Okay.prototype.Min = function (min, message) {
            var _this = this;
            var error = { error: 'Min', message: '' };
            if (typeof min === 'number') {
                error.message = message || minNumberMsg(min, this._config);
                return function (value) {
                    return (Number(value) < min) ? error : undefined;
                };
            } else if (min.constructor.name === 'Date') {
                error.message = message || minDateMsg(min, this._config);
                return function (value) {
                    return (_this._config.parseDate(value) < min) ? error : undefined;
                };
            }
            throw "Invalid Min value";
        };

        Okay.prototype.Max = function (max, message) {
            var _this = this;
            var error = { error: 'Max', message: '' };
            if (typeof max === 'number') {
                error.message = message || maxNumberMsg(max, this._config);
                return function (value) {
                    return (Number(value) > max) ? error : undefined;
                };
            } else if (max.constructor.name === 'Date') {
                error.message = message || maxDateMsg(max, this._config);
                return function (value) {
                    return (_this._config.parseDate(value) > max) ? error : undefined;
                };
            }
            throw "Invalid Max value";
        };

        Okay.prototype.MinMax = function (min, max, message) {
            var _this = this;
            var error = { error: 'MinMax', message: '' };
            if (typeof min === 'number' && typeof max === 'number') {
                error.message = message || minMaxNumberMsg(min, max, this._config);
                return function (value) {
                    value = Number(value);
                    return (value < min || value > max) ? error : undefined;
                };
            } else if (min.constructor.name === 'Date' && max.constructor.name === 'Date') {
                error.message = message || minMaxDateMsg(min, max, this._config);
                return function (value) {
                    value = _this._config.parseDate(value);
                    return (value < min || value > max) ? error : undefined;
                };
            }
        };

        Okay.prototype.Length = function (length, message) {
            var error = {
                error: "Length",
                message: message || lengthMsg(length, this._config)
            };
            return function (value) {
                return value.toString().length !== length ? error : undefined;
            };
        };

        Okay.prototype.MinLength = function (min, message) {
            var error = {
                error: "MinLength",
                message: message || minLengthMsg(min, this._config)
            };
            return function (value) {
                return value.toString().length < min ? error : undefined;
            };
        };

        Okay.prototype.MaxLength = function (max, message) {
            var error = {
                error: "MaxLength",
                message: message || maxLengthMsg(max, this._config)
            };
            return function (value) {
                return value.toString().length > max ? error : undefined;
            };
        };

        Okay.prototype.MinMaxLength = function (min, max, message) {
            var error = {
                error: "MinMaxLength",
                message: message || minMaxLengthMsg(min, max, this._config)
            };
            return function (value) {
                value = value.toString();
                return (value.length < min || value.length > max) ? error : undefined;
            };
        };

        Okay.prototype.IsNumeric = function (message) {
            var error = {
                error: "IsNumeric",
                message: message || this._config.isNumericMsg
            };
            return function (value) {
                return isNaN(value) ? error : undefined;
            };
        };

        Okay.prototype.IsDate = function (message) {
            var _this = this;
            var error = {
                error: "IsDate",
                message: message || this._config.isDateMsg
            };
            return function (value) {
                return isNaN(_this._config.parseDate(value)) ? error : undefined;
            };
        };

        Okay.prototype.Custom = function (fn, error) {
            if (!error) {
                error = { error: "Custom", message: this._config.customMsg };
            } else if (!error.message) {
                error.message = this._config.customMsg;
            }
            return function (value) {
                return !fn(value) ? error : undefined;
            };
        };
        return Okay;
    })();
    OkayJS.Okay = Okay;
})(OkayJS || (OkayJS = {}));

  var _config;
  angular.module('okay', [])
    .provider('okay', {
      setDefaults: function(config) { _config = config; },
      $get: function() { return new OkayJS.Okay(_config); }
    });
})();
