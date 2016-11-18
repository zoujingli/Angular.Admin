define(['sweetalert', 'jquery'], function (swal) {

    /**
     * 定义消息处理构造方法
     * @returns {common_L11._msg}
     */
    function message() {
        this.version = '2.0';
        this.shade = [0.02, '#000'];
    }

    /**
     * 关闭消息框
     */
    message.prototype.close = function () {
        return swal.close();
    };

    /**
     * 弹出警告消息框
     * @param {type} msg
     * @param {type} callback
     * @returns {undefined}
     */
    message.prototype.alert = function (msg, callback) {
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
     * @param {type} msg 提示消息内容
     * @param {type} ok 确认的回调函数
     * @param {type} no 取消的回调函数
     * @returns {undefined}
     */
    message.prototype.confirm = function (msg, ok, no) {
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
     * @param {type} msg 消息内容
     * @param {type} time  延迟关闭时间
     * @param {type} callback 回调函数
     */
    message.prototype.success = function (msg, time, callback) {
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
     * @param {type} msg 消息内容
     * @param {type} time 延迟关闭时间
     * @param {type} callback 回调函数
     */
    message.prototype.error = function (msg, time, callback) {
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
     * @param {type} msg
     * @param {type} time
     * @param {type} callback
     * @returns {unresolved}
     */
    message.prototype.tips = function (msg, time, callback) {
        return swal({
            title: msg,
            text: (time || 3) + ' 秒钟自动关闭',
            timer: (time || 3) * 1000,
            showConfirmButton: false
        });
    };

    /**
     * 将消息对象挂载到Jq
     */
    return new message();
});