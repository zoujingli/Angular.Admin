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
    app.provider('$form', ['$dialogProvider', '$rootScopeProvider', function ($dialog) {

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
                console.log('====== 服务器返回的数据 ======');
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
             * @param element
             */
            this.listen = function (element) {
                var self = this;
                $(element).on('submit', function (e) {
                    if (!$(this).hasClass('ng-valid')) {
                        return false;
                    }
                    var time = this.getAttribute('data-time');
                    self.load(this.action, element.scope()[element.attr('bind')], this.method || 'get', false, time);
                    return false;
                });
            };

            this.$get = function () {
                return this;
            };

        }]);

    // input 标签编译
    app.directive('input', function () {
        return {
            restrict: 'E',
            compile: function (element, attr) {
                if (!attr.type || element.data('layui-build')) {
                    return;
                }
                var $tpl = null, $scope = element.scope();
                switch (attr.type.toLowerCase()) {
                    case 'checkbox':
                        if ((attr.ngStyle || 'checked') === 'checked') {
                            var styleChecked = 'layui-form-checked';
                            $tpl = $('<div class="layui-unselect layui-form-checkbox"><span>' + (element.attr('title') || '') + '</span><i class="layui-icon">&#xe618;</i></div>');
                        } else {
                            var styleChecked = 'layui-form-onswitch';
                            $tpl = $('<div class="layui-unselect layui-form-switch"><i></i></div>');
                        }
                        $scope.$watch(attr.ngModel, function (newValue) {
                            var split = attr.ngModel.split('.'), key = split.pop(), name = split.pop(), bind = element.data('bind'), values = [];
                            if ($scope[bind][name]) {
                                if (typeof $scope[bind][name] === 'object') {
                                    for (var i in $scope[bind][name]) {
                                        values[i] = $scope[bind][name][i];
                                    }
                                } else {
                                    values.push('' + $scope[bind][name]);
                                }
                            }
                            $scope[bind][name] = values;
                            if (newValue === undefined) {
                                for (var i in values) {
                                    (values[i] === element.val()) && (values['_' + element.val()] = true);
                                }
                            } else if (newValue === true) {
                                $tpl.addClass(styleChecked);
                                var isAdd = true;
                                for (var i in values) {
                                    (values[i] === element.val()) && (isAdd = false);
                                }
                                isAdd && values.push(element.val());
                            } else {
                                $tpl.removeClass(styleChecked);
                                for (var i in values) {
                                    if (values[i] === element.val()) {
                                        delete values[i];
                                    }
                                }
                            }
                        });
                        element.data('layui-build', $tpl.on('click', function () {
                            $(element).trigger('click');
                        })).after($tpl);
                        break;
                    case 'radio':
                        var styleChecked = 'layui-form-radioed';
                        var $tpl = angular.element('<div class="layui-unselect layui-form-radio"><i class="layui-anim layui-icon"></i><span>' + (element.attr('title') || '') + '</span></div>');
                        $scope.$watch(attr.ngModel, function (newValue) {
                            if (newValue === element.val()) {
                                $tpl.addClass(styleChecked).find('i').addClass('layui-anim-scaleSpring').html('&#xe643;');
                            } else {
                                $tpl.removeClass(styleChecked).find('i').removeClass('layui-anim-scaleSpring').html('&#xe63f;');
                            }
                        });
                        element.data('layui-build', $tpl.on('click', function () {
                            $(element).trigger('click').trigger('click').trigger('click');
                        })).after($tpl);
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
                    var placeholder = attr.placeholder || '请选择';
                    var select = angular.element('\n\
                        <div class="layui-unselect layui-form-select">\
                            <div class="layui-select-title"><input type="text" placeholder="' + placeholder + '" readonly="readonly" class="layui-input layui-unselect"><i class="layui-edge"></i></div>\
                            <dl class="layui-anim layui-anim-upbit"></dl>\
                        </div>');
                    var $scope = element.scope(), options = select.find('dl');
                    $scope.$watch(attr.ngModel, function () {
                        var split = attr.ngModel.split('.'), name = split.pop(), bind = element.data('bind');
                        $scope[bind][name] = $scope[bind][name] || '';
                        options.empty();
                        angular.forEach(element.find('option'), function (option) {
                            var $option = angular.element('<dd></dd>').attr('value', option.value).html(option.innerHTML);
                            if (angular.element(option).prop('disabled')) {
                                $option.addClass('layui-disabled');
                            } else if ($scope[bind][name] === option.value) {
                                $option.addClass('layui-this');
                                select.find('input').attr('placeholder', option.innerHTML);
                            }
                            options.append($option);
                            $option.on('click', function (e) {
                                if (angular.element(this).hasClass('layui-disabled')) {
                                    e.stopPropagation();
                                    return false;
                                }
                                element.val(option.value);
                                $scope[bind][name] = option.value;
                                select.find('input').attr('placeholder', option.innerHTML);
                                select.find('dd').removeClass('layui-this');
                                $option.addClass('layui-this');
                            });
                        });
                    });
                    select.on('layui.hide', function () {
                        var input = angular.element(this);
                        input.removeClass('layui-form-selected');
                    }).on('layui.show', function () {
                        var input = angular.element(this);
                        angular.element(this).addClass('layui-form-selected');
                        angular.element(document).one('click', function (e) {
                            input.triggerHandler('layui.hide');
                            e.stopPropagation();
                        });
                    }).on('click', function (e) {
                        $('.layui-form-select.layui-form-selected').not(this).removeClass('layui-form-selected');
                        select.triggerHandler(this.className.indexOf('layui-form-selected') > -1 ? 'layui.hide' : 'layui.show');
                        e.stopPropagation();
                    });
                    element.after(select).data('layui-build', select);
                }
            }
        };
    });


    // 创建表单加强指令
    app.directive('form', ['$timeout', '$form', function ($timeout, $form) {

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
                    var checkStyle = 'right:0;animation-duration:0.2s;color:#a94442;position:absolute;font-size:12px;z-index:2;display:block;text-align:right;width:100%;pointer-events:none';
                    var tips = [];
                    // 生成表单元素验证错误提示
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
                            var name = this.name.replace(/\W/g, '');
                            modelFirst = attr.bind;
                            if (($input.attr('type') || '') === 'checkbox') {
                                $input.attr('data-ng-model', attr.bind + '.' + name + '._' + $input.val());
                            } else {
                                $input.attr('data-ng-model', attr.bind + '.' + name);
                            }
                        }
                        $input.data('bind', attr.bind);
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
                                // 当表单修改或提交时显示提示错误信息
                                data.attr.push('(' + attr.name + '.$submitted||' + ruleFrist + '$dirty)');
                                var $tpl = angular.element('<span class="form-error-tips" style="' + checkStyle + '" data-ng-show="' + data.attr.join(' && ') + '">' + data.title + '</span>');
                                $input.after($tpl).data(listenAttr, $tpl.data('input', $input));
                                tips.push($tpl);
                            }
                        }
                    });
                    // 计算并重新定位表单元素验证错误提示
                    $timeout(function () {
                        for (var i in tips) {
                            var tip = tips[i], input = tip.data('input');
                            tip.css({
                                top: $(input).position().top + 'px',
                                marginTop: $(input).css('marginTop'),
                                paddingBottom: $(input).css('paddingBottom'),
                                lineHeight: $(input).css('height'),
                                paddingRight: (parseFloat($(input).css('marginRight')) + parseFloat($(input).css('paddingRight')) + 20) + 'px'
                            });
                        }
                    });
                }
            };
        }]);
});