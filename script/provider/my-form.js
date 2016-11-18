/**
 * 表单H5自定义验插件
 * @param {type} angular
 */
define(['angular', 'jquery', 'myDebug', 'myDialog'], function (angular, $, myDebug) {

    // 表单DEBUG处理
    myDebug.init();

    // 表决模块定义
    angular.module('myForm', ['myDialog']).provider('$form', ['$dialogProvider', function ($dialog) {

        var self = this;

        /**
         * 表单H5自定义验插件
         * @param form element表单元素
         * @param callback
         * @param options
         * @private
         */
        var _form = function (form, callback, options) {
            /*! 默认配置项 */
            var defaults = {
                checkTag: 'input,textarea,select', // 需验证的表单元素
                callback: callback, // 验证成功的回调函数
                checkEvent: {change: true, blur: true, keyup: false},// 验证触发事件
                validate: function () {
                    return true;
                }  // 其他额外的验证
            };
            // 合并配置项
            var self = this;
            this.form = form;
            this.options = $.extend({}, defaults, options || {});
            // 去除HTML5的自动验证
            $(form).attr("novalidate", "novalidate");
            // 元素动态监听
            this.$elements = $(form).find(this.options.checkTag).not('[data-none-auto],[data-auto-none]');
            this.$elements.map(function () {
                var checkInput = function () {
                    self.checkInput(this);
                };
                for (var i in self.checkEvent) {
                    if (self.checkEvent[i] === true) {
                        $(this).off(i, checkInput).on(i, checkInput);
                    }
                }
            });

            // 提交事件处理
            function submitHandler(event) {
                self.check(self.options.callback);
                event.preventDefault();
                return false;
            }

            $(form).off('submit').bind("submit", submitHandler).data('validate', this);
        };


        /**
         * 检查验证表单并返回数据
         * @param {function} callback
         * @returns {object|Boolean}
         */
        _form.prototype.check = function (callback) {
            if (this.isAllpass() && this.options.validate.call(this)) {
                var _data = {};
                var data = $(this.form).serializeArray();
                for (var i in data) {
                    var key = data[i].name, value = data[i].value;
                    if (_data.hasOwnProperty(key)) {
                        (typeof _data[key] === 'object') ? _data[key].push(value) : (_data[key] = [_data[key], value]);
                    } else {
                        _data[key] = value;
                    }
                }
                (typeof callback === 'function') && callback.call(this.form, _data);
                return _data;
            }
            return false;
        };

        /**
         * 获取表单元素的类型
         * @param {element} ele
         * @returns {string}
         */
        _form.prototype.getElementType = function (ele) {
            return (ele.getAttribute("type") + "").replace(/\W+$/, "").toLowerCase();
        };

        /**
         * 去除字符串两头的空格
         * @param {string} str
         * @returns {string}
         */
        _form.prototype.trim = function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        };

        /**
         * 表单元素是否可见
         * @param {type} ele
         * @returns {Boolean}
         */
        _form.prototype.isVisible = function (ele) {
            return $(ele).is(':visible');
        };

        /**
         * 检测表单元素属性是否有定义
         * @param {element} ele
         * @param {string} prop
         * @param {undefined} undefined
         * @returns {Boolean}
         */
        _form.prototype.hasProp = function (ele, prop, undefined) {
            if (typeof prop !== "string") {
                return false;
            }
            var attrProp = ele.getAttribute(prop);
            return (attrProp !== undefined && attrProp !== null && attrProp !== false)
        };

        /**
         * 判断表单元素是否为空
         * @param {type} ele
         * @param {type} value
         * @returns {Boolean}
         */
        _form.prototype.isEmpty = function (ele, value) {
            value = value || ele.getAttribute('placeholder');
            var trimValue = ele.value;
            trimValue = this.trim(trimValue);
            if (trimValue === "" || trimValue === value) {
                return true;
            }
            return false;
        };

        /**
         * 正则验证表单元素
         * @param {type} ele
         * @param {type} regex
         * @param {type} params
         * @returns {Boolean}
         */
        _form.prototype.isRegex = function (ele, regex, params) {
            var self = this;
            // 原始值和处理值
            var inputValue = ele.value;
            var dealValue = inputValue;
            var type = this.getElementType(ele);
            if (type !== "password") {
                // 密码不trim前后空格
                dealValue = this.trim(inputValue);
                if (dealValue !== inputValue) {
                    if (ele.tagName.toLowerCase() !== "textarea") {
                        ele.value = dealValue;
                    } else {
                        ele.innerHTML = dealValue;
                    }
                }
            }
            // 获取正则表达式，pattern属性获取优先，然后通过type类型匹配。注意，不处理为空的情况
            regex = regex || ele.getAttribute('pattern');
            if (dealValue === "" || !regex) {
                return true;
            }
            // multiple多数据的处理
            var isMultiple = this.hasProp(ele, 'multiple'), newRegExp = new RegExp(regex, params || 'i');
            // number类型下multiple是无效的
            if (isMultiple && !/^number|range$/i.test(type)) {
                var isAllPass = true;
                var dealValues = dealValue.split(",");
                for (var i in dealValues) {
                    var partValue = self.trim(dealValues[i]);
                    if (isAllPass && !newRegExp.test(partValue)) {
                        isAllPass = false;
                    }
                }
                return isAllPass;
            } else {
                return newRegExp.test(dealValue);
            }
            return true;
        };

        /**
         * 验证所有表单元素
         * @returns {Boolean}
         */
        _form.prototype.isAllpass = function () {
            var pass = true, self = this;
            this.$elements.each(function () {
                if (self.checkInput(this) === false) {
                    $(this).focus();
                    return pass = false;
                }
            });
            return pass;
        };

        /**
         * 验证标志
         * @param {element} input
         * @param {string} type
         * @param {string} tag
         * @returns {boolean}
         */
        _form.prototype.remind = function (input, type, tag) {
            var text = '';
            // 如果元素完全显示
            if (this.isVisible(input)) {
                if (type === "radio" || type === "checkbox") {
                    this.setError(input, this.getErrMsg(input));
                } else if (tag === "select" || tag === "empty") {
                    // 下拉值为空或文本框文本域等为空
                    this.setError(input, (tag === "empty" && text) ? "您尚未输入" + text : this.getErrMsg(input));
                } else if (/^range|number$/i.test(type) && Number(input.value)) {
                    // 整数值与数值的特殊提示
                    this.setError(input, "值无效");
                } else {
                    // 文本框文本域格式不准确
                    var finalText = this.getErrMsg(input);
                    if (text) {
                        finalText = "您输入的" + text + "格式不准确";
                    }
                    this.setError(input, finalText);
                }
            }
            return false;
        };

        /**
         * 表单元素验证检测
         * @param {element} input
         * @returns {undefined|Boolean}
         */
        _form.prototype.checkInput = function (input) {
            var type = this.getElementType(input);
            var tag = input.tagName.toLowerCase();
            var isRequired = this.hasProp(input, "required");
            var isNone = this.hasProp(input, 'data-auto-none') || this.hasProp(input, 'data-none-auto');
            // 无需要验证
            if (isNone || input.disabled || type === 'submit' || type === 'reset' || type === 'file' || type === 'image' || !this.isVisible(input)) {
                return true;
            }
            var allpass = true;
            // 需要验证的有
            if (type === "radio" && isRequired) {
                var eleRadios = input.name ? $("input[type='radio'][name='" + input.name + "']") : $(input);
                var radiopass = false;
                eleRadios.each(function () {
                    if (radiopass === false && $(this).is("[checked]")) {
                        radiopass = true;
                    }
                });
                if (radiopass === false) {
                    allpass = this.remind(eleRadios.get(0), type, tag);
                } else {
                    this.setSuccess(input);
                }
            } else if (type === "checkbox" && isRequired && !$(input).is("[checked]")) {
                allpass = this.remind(input, type, tag);
            } else if (tag === "select" && isRequired && !input.value) {
                allpass = this.remind(input, type, tag);
            } else if ((isRequired && this.isEmpty(input)) || !(allpass = this.isRegex(input))) {
                allpass ? this.remind(input, type, "empty") : this.remind(input, type, tag);
                allpass = false;
            } else {
                this.setSuccess(input);
            }
            return allpass;
        };

        /**
         * 读取表单元素错误提示消息
         * @param {type} ele
         * @returns {String}
         */
        _form.prototype.getErrMsg = function (ele) {
            return ele.getAttribute('title') || '';
        };

        /**
         * 错误消息标签插入
         * @param {element} ele
         * @returns {jQuery}
         */
        _form.prototype.insertErrorEle = function (ele) {
            var $html = $('<span style="-webkit-animation-duration:.2s;animation-duration:.2s;padding-right:20px;color:#a94442;position:absolute;right:0;font-size:12px;z-index:2;display:block;width:34px;text-align:center;pointer-events:none"></span>');
            $html.css({
                top: $(ele).position().top + 'px',
                marginTop: $(ele).css('marginTop'),
                paddingBottom: $(ele).css('paddingBottom'),
                lineHeight: $(ele).css('height'),
                paddingRight: (parseFloat($(ele).css('marginRight')) + parseFloat($(ele).css('paddingRight')) + 30) + 'px'
            });
            $(ele).data('input-info') || $(ele).data('input-info', $html.insertAfter(ele));
        };

        /**
         * 错误消息显示
         * @param {element} ele
         * @param {string} content
         * @returns {jQuery}
         */
        _form.prototype.setError = function (ele, content) {
            $(ele).addClass('validate-error');
            this.insertErrorEle(ele);
            return $($(ele).data('input-info')).addClass('fadeInRight animated').css({width: 'auto'}).html(content);
        };

        /**
         * 错误消息消除
         * @param {element}  ele
         * @returns {jQuery}
         */
        _form.prototype.setSuccess = function (ele) {
            $(ele).removeClass('validate-error');
            this.insertErrorEle(ele);
            return $($(ele).data('input-info')).removeClass('fadeInRight').css({width: '30px'}).html('');
        };

        /**
         * 表单验证创建
         * @param form
         * @param callback
         * @param options
         * @returns {_form}
         */
        this.validate = function (form, callback, options) {
            return new _form(form, callback, options);
        };

        /**
         * 自动处理显示Think返回的Json数据
         * @param {type} data JSON数据对象
         * @param {type} time 延迟关闭时间
         */
        this.autoResult = function (data, time) {
            if (data.code === 'SUCCESS') {
                $dialog.success(data.info, time, function () {
                    if (data.referer === 'back') {
                    } else if (data.referer) {
                        window.location.href = data.referer;
                    } else if (data.referer === 'reload') {
                        window.location.reload();
                    } else {
                        window.location.reload();
                    }
                });
            } else {
                $dialog.error(data.info, 3, function () {
                    if (data.referer) {
                        window.location.href = data.referer;
                    }
                });
            }
        };

        /**
         * 异步加载的数据
         * @param {type} url Ajax请求地址
         * @param {type} data Ajax请求数据
         * @param {type} type Ajax请求类型
         * @param {type} callback 请求成功后的回调函数
         * @param {type} time 自动提示等待时间
         * @returns {undefined}
         */
        this.load = function (url, data, type, callback, time) {
            this.errMsg = '{status}服务器繁忙，请稍候再试！';
            var self = this;
            var send_data = (typeof data === 'object' && data.tagName === 'FORM') ? $(data).serialize() : data;
            $.ajax({
                url: url,
                type: type || 'GET',
                data: send_data || {},
                statusCode: {
                    404: function () {
                        $dialog.error(self.errMsg.replace('{status}', 'E404 - '));
                    },
                    500: function () {
                        $dialog.error(self.errMsg.replace('{status}', 'E500 - '));
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $dialog.error(self.errMsg.replace('{status}', 'E' + textStatus + ' - '));
                },
                success: function (res) {
                    if (typeof callback === 'function' && callback.call(self, res) === false) {
                        return false;
                    }
                    if (typeof (res) === 'object') {
                        return self.autoResult(res, time);
                    }
                    if (res.indexOf('A PHP Error was encountered') !== -1) {
                        return $dialog.error(self.errMsg.replace('{status}', 'E505 - '));
                    }
                }
            });
        };

        /**
         * 表单初始化监听
         * @param {type} app
         * @returns {undefined}
         */
        this.listen = function () {
            var self = this;
            $('form[data-auto]').map(function () {
                if ($(this).attr('data-validate-listen') === 'true') {
                    return;
                }
                $(this).attr('data-validate-listen', "true");
                self.validate(this, function (data) {
                    var action = this.getAttribute('method') || 'POST';
                    var url = this.getAttribute('action') || window.location.href;
                    var callback = window[$(this).attr('data-callback') || '_default_callback'] || undefined;
                    self.load(url, data, action, callback, this.getAttribute('data-time') || undefined);
                }, {});
            });
        };

        this.$get = function () {
            return this;
        }
    }]);
});