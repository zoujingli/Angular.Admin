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
        function ($dialog) {

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
                    var select = angular.element('\n\
                        <div class="layui-unselect layui-form-select">\
                            <div class="layui-select-title"><input type="text" placeholder="请选择" value="" readonly="" class="layui-input layui-unselect"><i class="layui-edge"></i></div>\
                            <dl class="layui-anim layui-anim-upbit"></dl>\
                        </div>').on('layui.hide', function () {
                        var input = angular.element(this);
                        input.removeClass('layui-form-selected');
                    }).on('layui.show', function (e) {
                        var input = angular.element(this);
                        angular.element(this).addClass('layui-form-selected');
                        angular.element(document).one('click', function (e) {
                            input.triggerHandler('layui.hide');
                            e.stopPropagation();
                        });
                    }).on('click', function (e) {
                        angular.element(this).triggerHandler(this.className.indexOf('layui-form-selected') > -1 ? 'layui.hide' : 'layui.show');
                        e.stopPropagation();
                    });
                    var options = select.find('dl');
                    element.on('change', function () {
                        options.empty();
                        angular.forEach(element.find('option'), function (option) {
                            var $option = angular.element('<dd></dd>').attr('value', option.value).html(option.innerHTML);
                            (element.val() === option.value) && $option.addClass('layui-this');
                            options.append($option);
                            $option.on('click', function () {
                                element.val(this.value);
                                select.find('input').attr('placeholder', this.innerHTML);
                                select.find('dd').removeClass('layui-this');
                                $option.addClass('layui-this');
                            });
                        });
                    });
                    element.after(select).data('layui-build', select).triggerHandler('change');
                }
            }
        };
    });

    // 创建表单加强指令
    app.directive('form', ['$compile', '$form', function ($compile, $form) {

            function getRandName(type) {
                return type + Math.ceil(Math.random() * 1000000000000);
            }

            return {
                restrict: 'E',
                compile: function (element, attr) {
                    if (!attr.name) {
                        return false;
                    }
                    // 数据绑定名称
                    attr.bind = attr.bind || attr.name || getRandName('data');
                    // 表单绑定名称
                    attr.name = attr.name || getRandName('form');
                    // 防止重名, 优先保存 bind 名
                    (attr.bind === attr.name) && (attr.name += 'Form');
                    // 写入 Attr bind 更新
                    (element.attr('bind') !== attr.bind) && element.attr('bind', attr.bind);
                    // 写入 Attr name 更新
                    (element.attr('name') !== attr.name) && element.attr('name', attr.name);

                    // 表单自动提交，表单需要给属性 data-auto=true
                    if (attr.auto && !element.attr('data-auto-listen')) {
                        element.attr('data-auto-listen', true);
                        $form.listen(element);
                    }

                    // 移除表单H5默认验证
                    element.attr('novalidate', 'novalidate');
                    // 提交按钮处理
                    var $submitbtn = $(element[0]).find('[type=submit]');
                    if (!$submitbtn.attr('data-ng-disabled') && !$submitbtn.attr('ng-disabled')) {
                        $submitbtn.attr("data-ng-disabled", attr.bind + ".$invalid");
                        $submitbtn.attr('data-ng-class', "{true:'layui-btn-disabled',false:''}[" + attr.name + ".$invalid" + "]");
                    }
                    // 表单元素验证属性检测
                    var checkAttrs = ['$error-minlength', '$error-maxlength', '$error-required', '$invalid'];
                    var checkStyle = 'right:0;animation-duration:0.2s;color:#a94442;position:absolute;font-size:12px;z-index:2;display:block;text-align:left;width:100%;pointer-events:none';
                    $(element[0].elements).each(function () {
                        if (typeof this !== 'object' || !this.tagName || this.tagName.toLowerCase() === 'button') {
                            return true;
                        }
                        var $input = angular.element(this);
                        // 自动验证标签解析
                        var modelFirst = $input.attr('data-ng-model') || $input.attr('ng-model') || '';
                        if (!this.name && !!modelFirst) {
                            $input.attr('name', modelFirst.substring(modelFirst.indexOf('.') + 1) || getRandName('input'));
                        }
                        // 未设置绑定数据源时，动态生成绑定
                        if (!modelFirst && !!this.name) {
                            modelFirst = attr.bind;
                            $input.attr('data-ng-model', (attr.bind + '.' + this.name));
                        }
                        var ruleFrist = attr.name + '.' + this.name + '.';
                        for (var j in checkAttrs) {
                            var checkAttr = 'data-tips-' + checkAttrs[j].replace(/^\$/, '');
                            var listenAttr = checkAttr + '-layui-build';
                            // 检查消息是否设置，并且未初始化验证标签
                            if ($input.attr(checkAttr) && !$input.data(listenAttr)) {
                                var data = {attr: [ruleFrist + checkAttrs[j].replace(/-/g, '.')], title: $input.attr(checkAttr)};
                                //  优先显示空验证
                                if ($input.attr('data-tips-error-required') && checkAttr !== 'data-tips-error-required') {
                                    data.attr.push('!' + ruleFrist + '$error.required');
                                }
                                // 当表单修改后再显示提示
                                data.attr.push(ruleFrist + '$dirty');
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