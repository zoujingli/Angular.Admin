/* global swal */

/**
 * 消息提示自定义插件
 * @param {type} angular
 */
define(['angular', 'sweetalert'], function (angular) {

    angular.module('myDialog', []).provider('$dialog', function () {

        /**
         * 关闭消息框
         * @returns {void|*}
         */
        this.close = function () {
            return swal.close();
        };

        /**
         * 弹出警告消息框
         * @param {string} msg
         * @param {function} callback
         * @returns {*}
         */
        this.alert = function (msg, callback) {
            return swal({
                title: msg,
                type: "warning",
                animation: "slide-from-top",
                showCancelButton: false,
                confirmButtonColor: "#32c5d2",
                confirmButtonText: "确定",
                closeOnConfirm: false,
                closeOnCancel: false
            }, callback);
        };

        /**
         * 确认对话框
         * @param {string} msg 提示消息内容
         * @param {function} ok 确认的回调函数
         * @param {function} no 取消的回调函数
         * @returns {*}
         */
        this.confirm = function (msg, ok, no) {
            return swal({
                title: msg,
                type: "info",
                animation: "slide-from-top",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#32c5d2",
                confirmButtonText: "确定",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isok) {
                isok ? (typeof ok === 'function') && ok.call() : (typeof no === 'function') && no.call();
                swal.close();
            });
        };

        /**
         * 显示成功类型的消息
         * @param {string} msg 消息内容
         * @param {int} time  延迟关闭时间
         * @param {function} callback 回调函数
         * @return {*}
         */
        this.success = function (msg, time, callback) {
            return swal({
                title: msg,
                type: "success",
                timer: (time || 2) * 1000,
                animation: "slide-from-top",
                showCancelButton: false,
                cancelButtonText: "取消",
                confirmButtonColor: "#32c5d2",
                confirmButtonText: "确定",
                closeOnConfirm: false,
                closeOnCancel: false
            }, callback);
        };

        /**
         * 显示失败类型的消息
         * @param {string} msg 消息内容
         * @param {int} time 延迟关闭时间
         * @param {function} callback 回调函数
         * @return {*}
         */

        this.error = function (msg, time, callback) {
            return swal({
                title: msg,
                type: "error",
                timer: (time || 2) * 1000,
                animation: "slide-from-top",
                showCancelButton: false,
                cancelButtonText: "取消",
                confirmButtonColor: "#32c5d2",
                confirmButtonText: "确定",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function () {
                (typeof callback === 'function') && callback.call();
                swal.close();
            });
        };

        /**
         * 状态消息提示
         * @param {string} msg
         * @param {int} time
         * @param {function} callback
         * @returns {*}
         */
        this.tips = function (msg, time, callback) {
            return swal({
                title: msg,
                text: (time || 3) + ' 秒钟自动关闭',
                timer: (time || 3) * 1000,
                showConfirmButton: false
            });
        };

        this.$get = function () {
            return this;
        };
    });
});