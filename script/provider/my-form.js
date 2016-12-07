/**
 * 表单H5自定义验插件
 * @param {type} angular
 * @author Anyon <zoujingli@qq.com>
 * @date 2016/11/20 01:23
 */
define(['angular', 'jquery', 'debug', 'pace', 'myDialog'], function (angular, $, debug, pace) {

    // 表单DEBUG处理
    debug.init();

    // 创建 myForm 模块
    var app = angular.module('myForm', ['myDialog']);

    // 定义表单数据通信Provider
    app.provider('$form', [
        '$dialogProvider',
        '$rootScopeProvider',
        function ($dialog, $rootScope) {

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
                        success: function (ret) {
                            if (typeof callback === 'function' && callback.call(self, ret) === false) {
                                return false;
                            }
                            if (typeof ret === 'string') {
                                try {
                                    var t = JSON.parse(ret);
                                    !!t && (ret = t);
                                } catch (e) {
                                }
                            }
                            console.log(typeof ret);
                            if (typeof (ret) === 'object') {
                                return self.autoResult(ret, time);
                            }
                            if (ret.indexOf('A PHP Error was encountered') !== -1) {
                                return $dialog.error(self.errMsg.replace('{status}', 'E505 - '));
                            }
                        }
                    });
                }
                );
            };

            /**
             * 自动处理显示Think返回的Json数据
             * @param {type} data JSON数据对象
             * @param {type} time 延迟关闭时间
             */
            this.autoResult = function (data, time) {
                console.log(data);
                if (data.code === 'SUCCESS') {
                    $dialog.success(data.info, time, function () {
                        if (data.referer) {
                            window.location.href = data.referer;
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
                    if (!$(this).hasClass('ng-valid')) {
                        return false;
                    }
                    var time = this.getAttribute('data-time');
                    self.load(this.action, this, this.method || 'get', false, time);
                    return false;
                });
            };

            this.$get = function () {
                return this;
            }
            ;
        }]);

    // input 标签编译
    app.directive('input', function () {
        return {
            restrict: 'E',
            compile: function (element, attr) {
                if (!attr.type || element.data('layui-build')) {
                    return;
                }
                var style = (attr.ngStyle || 'checked') === 'checked' ? 'layui-form-checkbox' : 'layui-form-switch';
                var styleChecked = (attr.ngStyle || 'checked') === 'checked' ? 'layui-form-checked' : 'layui-form-onswitch';
                switch (attr.type.toLowerCase()) {
                    case 'checkbox':
                        var $tpl = $('<div class="layui-unselect ' + style + '"><span>' + element.attr('title') + '</span><i class="layui-icon">&#xe618;</i></div>').on('click', function () {
                            $(element).trigger('click');
                        });
                        element.on('change', function () {
                            element[0].checked ? $tpl.addClass(styleChecked) : $tpl.removeClass(styleChecked);
                        }).data('layui-build', $tpl).triggerHandler('change').after($tpl);
                        break;
                }
            }
        };
    });

    // select 标签编译
    app.directive('select', function () {
        return {
            restrict: 'E',
            compile: function (element, attr) {
                if (!element.data('layui-build')) {
                    var $select = $('\n\
                        <div class="layui-unselect layui-form-select">\
                            <div class="layui-select-title"><input type="text" placeholder="请选择" value="" readonly="" class="layui-input layui-unselect"><i class="layui-edge"></i></div>\
                            <dl class="layui-anim layui-anim-upbit"></dl>\
                        </div>'), $dl = $select.find('dl');
                    $('body').on('click', function () {
                        $select.removeClass('layui-form-selected');
                    });
                    $select.find('.layui-select-title').on('click', function (e) {
                        $select.addClass('layui-form-selected');
                        e.stopPropagation();
                    });
                    $(element).find('option').map(function () {
                        var $option = $('<dd></dd>').attr('value', this.value).html(this.innerHTML);
                        (element.val() === this.value) && $option.addClass('layui-this');
                        $option.on('click', function (e) {
                            element.val(this.value);
                            $select.removeClass('layui-form-selected').find('input').attr('placeholder', this.innerHTML);
                            $option.addClass('layui-this').siblings('dd').removeClass('layui-this');
                            e.stopPropagation();
                        });
                        $dl.append($option);
                    });
                    element.after($select).data('layui-build', $select);
                }
            }
        };
    });

    // 创建表单加强指令
    app.directive('form', ['$compile', '$form', function ($compile, $form) {

            function getRandName(type) {
                return (type || 'default') + Math.ceil(Math.random() * 1000000000000);
            }

            function getFormBindName(element) {
                var bindName = '';
                for (var i in element[0].elements) {
                    var input = element[0].elements[i];
                    if (typeof input === 'object' && input.getAttribute) {
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
                    // 提交按钮处理
                    var $submitbtn = $(element[0]).find('[type=submit]');
                    if (!$submitbtn.attr('data-ng-disabled') && !$submitbtn.attr('ng-disabled')) {
                        $submitbtn.attr("data-ng-disabled", attr.name + ".$invalid");
                        $submitbtn.attr('data-ng-class', "{true:'layui-btn-disabled',false:''}[" + attr.name + ".$invalid" + "]");
                    }
                    // 移除表单H5默认验证
                    element.attr('novalidate', 'novalidate');
                    // 表单元素验证属性检测
                    var checkAttrs = ['$error-minlength', '$error-maxlength', '$error-required', '$invalid'];
                    var checkStyle = 'right:0;animation-duration:0.2s;color:#a94442;position:absolute;font-size:12px;z-index:2;display:block;text-align:left;width:100%;pointer-events:none';
                    $(element[0].elements).each(function () {
                        if (typeof this !== 'object' || !this.tagName || this.tagName.toLowerCase() === 'button') {
                            return true;
                        }
                        var $input = angular.element(this);
                        // 自动验证标签解析
                        var bindName = $input.attr('data-ng-model') || $input.attr('ng-model') || '';
                        if (!this.name && !!bindName) {
                            $input.attr('name', bindName.substring(bindName.indexOf('.') + 1) || getRandName('input'));
                        }
                        // 未设置绑定数据源时，动态生成绑定
                        if (!bindName && !!this.name) {
                            $input.attr('data-ng-model', (bindName = attr.name.replace(/Form$/, '') + '.' + this.name));
                        }
                        var first = attr.name + '.' + this.name + '.';
                        for (var j in checkAttrs) {
                            var checkAttr = 'data-tips-' + checkAttrs[j].replace(/^\$/, '');
                            var listenAttr = checkAttr + '-layui-build';
                            // 检查消息是否设置，并且未初始化验证标签
                            if ($input.attr(checkAttr) && !$input.data(listenAttr)) {
                                $input.attr(checkAttr + '-listen', true);
                                var data = {attr: [first + checkAttrs[j].replace(/-/g, '.')], title: $input.attr(checkAttr)};
                                //  优先显示空验证
                                if ($input.attr('data-tips-error-required') && checkAttr !== 'data-tips-error-required') {
                                    data.attr.push('!' + first + '$error.required');
                                }
                                // 当表单修改后再显示提示
                                data.attr.push(first + '$dirty');
                                var $tpl = angular.element('<span class="form-error-tips" style="' + checkStyle + '" data-ng-show="' + data.attr.join(' && ') + '">' + data.title + '</span>');
                                $input.after($tpl).data(listenAttr, $tpl);
                            }
                        }
                    });
                }
            }
            ;
        }]);
});