/**
 * 表单H5自定义验插件
 * @param {type} angular
 */
define(['angular', 'jquery', 'myDebug', 'pace', 'myDialog'], function (angular, $, myDebug, pace) {

    // 表单DEBUG处理
    myDebug.init();

    // 创建 myForm 模块
    var app = angular.module('myForm', ['myDialog']);

    // 定义表单数据通信Provider
    app.provider('$form', ['$dialogProvider', function ($dialog) {

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
            pace.track(function () {
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
            });
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
         * 自动表单处理
         * @param form
         */
        this.listen = function (form) {
            var self = this;
            $(form).on('submit', function () {
                if ($(this).hasClass('ng-valid')) {
                    self.load(this.action, this, this.method || 'get', false, this.getAttribute('data-time') || 3);
                }
                return false;
            });
        };

        this.$get = function () {
            return this;
        }
    }]);

    // 创建表单加强指令
    app.directive('form', ['$compile', '$form', function ($compile, $form) {

        function getRandName(type) {
            return (type || 'default') + Math.ceil(Math.random() * 1000000000000);
        }

        function getFormBindName(element) {
            var bindName = '';
            for (var i in element[0].elements) {
                var input = element[0].elements[i];
                if (typeof input === 'object') {
                    var bind = input.getAttribute('data-ng-model') || input.getAttribute('ng-model') || false;
                    if (bind && bind.indexOf('.') > -1) {
                        bindName = bind.split('.').shift();
                    }
                }
            }
            return (bindName || getRandName('form')) + 'Form';
        }

        return {
            restrict: 'E',
            compile: function (element, attr) {
                // 表单名字重建
                attr.name = attr.name || getFormBindName(element);
                if (element.attr('name') !== attr.name) {
                    element.attr('name', attr.name);
                    $compile(element)(element.scope());
                }
                // 表单自动提交，表单需要给属性 data-auto=true
                if (attr.auto && !element.attr('data-autolisten')) {
                    element.attr('data-autolisten', true);
                    $form.listen(element);
                }
                // 移除表单H5默认验证
                element.attr('novalidate', 'novalidate');
                // 表单元素验证属性检测
                var checkAttrs = ['$error-minlength', '$error-maxlength', '$error-required', '$invalid'];
                var css = 'right:0;animation-duration:.2s;padding-right:20px;color:#a94442;position:absolute;font-size:12px;z-index:2;display:block;text-align:center;pointer-events:none';
                for (var i in element[0].elements) {
                    var input = element[0].elements[i];
                    if (typeof input === 'object' && input.tagName && input.tagName.toLowerCase() !== 'button') {
                        if ($(input).next('.form-error-tips').size() < 1) {
                            // 提交按钮处理
                            var $submitbtn = $(element[0]).find('[type=submit]');
                            if (!$submitbtn.attr('data-ng-disabled') && !$submitbtn.attr('ng-disabled')) {
                                $submitbtn.attr("data-ng-disabled", attr.name + ".$invalid")
                            }
                            // 自动验证标签解析
                            var bindName = input.getAttribute('data-ng-model') || input.getAttribute('ng-model') || '';
                            if (!input.name && bindName) {
                                $(input).attr('name', bindName.split('.').pop() || getRandName('input'));
                            }
                            // 未设置绑定数据源时，动态生成绑定
                            if (!bindName && input.name) {
                                $(input).attr('data-ng-model', (bindName = attr.name.replace('Form', '') + '.' + input.name));
                            }
                            var first = attr.name + '.' + input.name + '.';
                            for (var j in checkAttrs) {
                                var checkAttr = 'data-tips-' + checkAttrs[j];
                                if ($(input).attr(checkAttr)) {
                                    if ($(input).nextAll('[data-rule="' + checkAttr + '"]').size() > 0) {
                                        continue;
                                    }
                                    var data = {
                                        attr: [first + checkAttrs[j].replace(/-/g, '.')],
                                        title: $(input).attr(checkAttr)
                                    };
                                    if ($(input).attr('data-tips-$error-required') && checkAttr !== 'data-tips-$error-required') {
                                        data.attr.push('!' + first + '$error.required');
                                    }
                                    // 当表单修改后再显示提示
                                    data.attr.push(first + '$dirty');
                                    var rule = data.attr.join(' && ');
                                    var tpl = '<span data-rule="' + checkAttr + '" style="' + css + '" class="form-error-tips" data-ng-show="' + rule + '">' + data.title + '</span>';
                                    $(input).after($(tpl).css({
                                        top: $(input).position().top + 'px',
                                        marginTop: $(input).css('marginTop'),
                                        paddingBottom: $(input).css('paddingBottom'),
                                        lineHeight: $(input).css('height'),
                                        paddingRight: (parseFloat($(input).css('marginRight')) + parseFloat($(input).css('paddingRight')) + 30) + 'px'
                                    }));
                                }
                            }
                        }
                    }
                }
            }
        }
    }]);
});