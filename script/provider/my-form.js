/* global API_URL */

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
    app.provider('$form', ['$dialogProvider', function ($dialog) {
            var self = this;

            /*! Request 通用请求 */
            this.request = function (url, data, type, callback) {
                var headers = {"content-type": "application/x-www-form-urlencoded"};
                url = (url.indexOf('://') > -1 ? '' : API_URL || '') + url;
                if (angular.$cookies.get('token')) {
                    data.token = angular.$cookies.get('token');
                }
                pace.track(function () {
                    angular.$http({method: type || 'get', data: angular.$httpParamSerializerJQLike(data), url: url, headers: headers}).success(function (ret, status) {
                        if (parseInt(status) === 200) {
                            // 授权失败
                            if (ret.code && ret.code === 'AUTH_TOKEN_FAILD') {
                                return $dialog.error('服务器授权失败，请重新授权！', 3, function () {
                                    angular.$view.goto('login.html');
                                });
                            }
                            if (typeof callback === 'function' && callback.call(self, ret) === false) {
                                return false;
                            }
                            if (typeof (ret) === 'object') {
                                return self.autoResult(ret);
                            }
                            return true;
                        }
                        $dialog.error('E{status}-服务器繁忙，请稍候再试！'.replace('{status}', status));
                    }).error(function () {
                        $dialog.tips('服务器繁忙，请稍候再试！');
                    });
                });
            };

            /*! POST 请求 */
            this.post = function (url, data, callback) {
                self.request(url, data, 'post', callback);
            };

            /*! GET 请求 */
            this.get = function (url, data, callback) {
                self.request(url, data, 'get', callback);
            };

            /**
             * 自动处理显示Think返回的Json数据
             * @param {type} data JSON数据对象
             * @param {type} time 延迟关闭时间
             * @param {type} success 回调函数
             * @param {type} error 回调函数
             */
            this.autoResult = function (data, time, success, error) {
                console.log('====== 服务器返回的数据 ======');
                console.log(data);
                if (data.code === 'SUCCESS') {
                    $dialog.success(data.info, time, function () {
                        if (!(typeof success === 'function' && false === success.call(this, data))) {
                            if (data.referer) {
                                window.location.href = data.referer;
                            } else {
                                window.location.reload();
                            }
                        }
                    });
                } else {
                    $dialog.error(data.info, 3, function () {
                        if (!(typeof error === 'function' && false === error.call(this, data))) {
                            !data.referer && (window.location.href = data.referer);
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
                    // 表单数据
                    var data = element.scope()[element.attr('bind')] || {};
                    // 请求URL
                    var action = element.attr('action') || '', url = (action.indexOf('://') > -1 ? '' : (API_URL || '')) + action;
                    // 成功等待成功、成功回跳地址
                    var time = element.attr('data-time') || 2, success = element.attr('data-success') || false;
                    // 执行Ajax请求，并设置回头回调
                    self.load(url, data, this.method || 'get', function (ret) {
                        // Ajax结果处理，使用自动解析机制
                        self.autoResult(ret, time, function () {
                            // 接口调用成功，判断表单是否需要自动跳转
                            if (success) {
                                window.location.href = success;
                                return false;
                            }
                        });
                        return false;
                    }, time);
                    return false;
                });
            };
            var self = this;

            this.$get = function () {
                return {
                    listen: self.listen,
                    request: self.request,
                    post: self.post,
                    get: self.get,
                    autoResult: self.autoResult,
                    $dialog: $dialog
                };
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
                        element.attr('onsubmit', 'return false');
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