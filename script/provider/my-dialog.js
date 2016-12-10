/* global layui */

/**
 * 消息提示自定义插件
 * @param {type} angular
 */
define(['angular'], function (angular) {

    angular.module('myDialog', []).provider('$dialog', function () {

        var self = this;

        // 记录需要关闭的提示框
        this.needCloseIndex = [];

        // 关闭指定的窗口
        this.close = function () {
            layui.use('layer', function () {
                for (var i in self.needCloseIndex) {
                    layui.layer.close(self.needCloseIndex[i]);
                    delete self.needCloseIndex[i];
                }
            });
        };

        // Tips 提示框
        this.tips = function (content, time, callback) {
            layui.use('layer', function () {
                layui.layer.msg(content, {time: (time || 3) * 1000, shadeClose: true}, callback);
            });
        };

        // Loading 消息提示
        this.loading = function (callback) {
            layui.use('layer', function () {
                var index = layui.layer.load(1, {shade: [0.1, '#fff'], end: callback});
                self.needCloseIndex.push(index);
            });
        };

        // 成功提示框
        this.success = function (content, time, callback) {
            layui.use('layer', function () {
                layui.layer.msg(content, {time: (time || 3) * 1000, shadeClose: true, icon: 1}, callback);
            });
        };

        // 错误提示框
        this.error = function (content, time, callback) {
            layui.use('layer', function () {
                layui.layer.msg(content, {time: (time || 3) * 1000, shadeClose: true, icon: 2}, callback);
            });
        };

        // 询问提示框
        this.confirm = function (content, success, cancel) {
            layui.use('layer', function () {
                var index = layui.layer.confirm(content, {btn: ['确定', '取消']}, function () {
                    typeof success === 'function' && success.call();
                    layui.layer.close(index);
                }, function () {
                    layui.layer.close(index);
                    typeof cancel === 'function' && cancel.call();
                });
            });
        };

        this.$get = function () {
            return self;
        };
    });
});