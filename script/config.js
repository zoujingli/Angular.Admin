/**
 * 应用配置文件
 * 
 * @author Anyon <zoujingli@qq.com>
 * @date 2016/11/04 13:58
 * @returns {undefined}
 */
define(function () {

    /*! 配置对象构造函数 */
    var config = function () {
        // 接口基础地址
        this.apiBaseUrl = 'http://service.demo.cuci.cc';
    };

    /*! 将URI转换成实际接口地址 */
    config.prototype.getApi = function (uri) {
        if (uri.indexOf('://') !== -1) {
            return uri;
        }
        return this.apiBaseUrl + ('/' + uri).replace(/\/\//gi, '/');
    };

    /*! 返回配置对象实例 */
    return new config();
});