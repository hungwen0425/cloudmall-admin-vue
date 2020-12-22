// Copyright (c) 2009, Baidu Inc. All rights reserved.
//
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http:// tangram.baidu.com/license.html
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
* @namespace T Tangram七巧板
* @name T
* @version 1.6.0
*/

/**
 * 声明baidu包
 * @author: allstar, erik, meizz, berg
 */
var T,
    baidu = T = baidu || { version: "1.5.0" };
baidu.guid = "$BAIDU$";
baidu.$$ = window[baidu.guid] = window[baidu.guid] || { global: {} };

/**
 * 使用flash资源封装的一些功能
 * @namespace baidu.flash
 */
baidu.flash = baidu.flash || {};

/**
 * 操作dom的方法
 * @namespace baidu.dom
 */
baidu.dom = baidu.dom || {};


/**
 * 从文档中取得指定的DOM元素
 * @name baidu.dom.g
 * @function
 * @grammar baidu.dom.g(id)
 * @param {string|HTMLElement} id 元素的id或DOM元素.
 * @shortcut g,T.G
 * @meta standard
 * @see baidu.dom.q
 *
 * @return {HTMLElement|null} 取得的元素，查找不到時返回null,如果参數不合法，直接返回参數.
 */
baidu.dom.g = function (id) {
    if (!id) return null;
    if ('string' == typeof id || id instanceof String) {
        return document.getElementById(id);
    } else if (id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
        return id;
    }
    return null;
};
baidu.g = baidu.G = baidu.dom.g;


/**
 * 操作數组的方法
 * @namespace baidu.array
 */

baidu.array = baidu.array || {};


/**
 * 遍历數组中所有元素
 * @name baidu.array.each
 * @function
 * @grammar baidu.array.each(source, iterator[, thisObject])
 * @param {Array} source 需要遍历的數组
 * @param {Function} iterator 對每個數组元素进行調用的函數，该函數有兩個参數，第一個為數组元素，第二個為數组索引值，function (item, index)。
 * @param {Object} [thisObject] 函數調用時的this指针，如果没有此参數，默认是当前遍历的數组
 * @remark
 * each方法不支持對Object的遍历,對Object的遍历使用baidu.object.each 。
 * @shortcut each
 * @meta standard
 *
 * @returns {Array} 遍历的數组
 */

baidu.each = baidu.array.forEach = baidu.array.each = function (source, iterator, thisObject) {
    var returnValue, item, i, len = source.length;

    if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
            item = source[i];
            returnValue = iterator.call(thisObject || source, item, i);

            if (returnValue === false) {
                break;
            }
        }
    }
    return source;
};

/**
 * 對语言層面的封装，包括類型判断、模块擴展、繼承基類以及物件自定义事件的支持。
 * @namespace baidu.lang
 */
baidu.lang = baidu.lang || {};


/**
 * 判断目標参數是否為function或Function實例
 * @name baidu.lang.isFunction
 * @function
 * @grammar baidu.lang.isFunction(source)
 * @param {Any} source 目標参數
 * @version 1.2
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 * @meta standard
 * @returns {boolean} 類型判断结果
 */
baidu.lang.isFunction = function (source) {
    return '[object Function]' == Object.prototype.toString.call(source);
};

/**
 * 判断目標参數是否string類型或String物件
 * @name baidu.lang.isString
 * @function
 * @grammar baidu.lang.isString(source)
 * @param {Any} source 目標参數
 * @shortcut isString
 * @meta standard
 * @see baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *
 * @returns {boolean} 類型判断结果
 */
baidu.lang.isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};
baidu.isString = baidu.lang.isString;


/**
 * 判断瀏覽器類型和特性的屬性
 * @namespace baidu.browser
 */
baidu.browser = baidu.browser || {};


/**
 * 判断是否為opera瀏覽器
 * @property opera opera版本号
 * @grammar baidu.browser.opera
 * @meta standard
 * @see baidu.browser.ie,baidu.browser.firefox,baidu.browser.safari,baidu.browser.chrome
 * @returns {Number} opera版本号
 */

/**
 * opera 从10开始不是用opera後面的字符串进行版本的判断
 * 在Browser identification最後添加Version + 數字进行版本標识
 * opera後面的數字保持在9.80不变
 */
baidu.browser.opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ? + (RegExp["\x246"] || RegExp["\x242"]) : undefined;


/**
 * 在目標元素的指定位置插入HTML代码
 * @name baidu.dom.insertHTML
 * @function
 * @grammar baidu.dom.insertHTML(element, position, html)
 * @param {HTMLElement|string} element 目標元素或目標元素的id
 * @param {string} position 插入html的位置信息，取值為beforeBegin,afterBegin,beforeEnd,afterEnd
 * @param {string} html 要插入的html
 * @remark
 *
 * 對于position参數，大小写不敏感<br>
 * 参數的意思：beforeBegin&lt;span&gt;afterBegin   this is span! beforeEnd&lt;/span&gt; afterEnd <br />
 * 此外，如果使用本函數插入带有script標签的HTML字符串，script標签對應的脚本將不會被执行。
 *
 * @shortcut insertHTML
 * @meta standard
 *
 * @returns {HTMLElement} 目標元素
 */
baidu.dom.insertHTML = function (element, position, html) {
    element = baidu.dom.g(element);
    var range, begin;
    if (element.insertAdjacentHTML && !baidu.browser.opera) {
        element.insertAdjacentHTML(position, html);
    } else {
        range = element.ownerDocument.createRange();
        position = position.toUpperCase();
        if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
            range.selectNodeContents(element);
            range.collapse(position == 'AFTERBEGIN');
        } else {
            begin = position == 'BEFOREBEGIN';
            range[begin ? 'setStartBefore' : 'setEndAfter'](element);
            range.collapse(begin);
        }
        range.insertNode(range.createContextualFragment(html));
    }
    return element;
};

baidu.insertHTML = baidu.dom.insertHTML;

/**
 * 操作flash物件的方法，包括创建flash物件、取得flash物件以及判断flash插件的版本号
 * @namespace baidu.swf
 */
baidu.swf = baidu.swf || {};


/**
 * 瀏覽器支持的flash插件版本
 * @property version 瀏覽器支持的flash插件版本
 * @grammar baidu.swf.version
 * @return {String} 版本号
 * @meta standard
 */
baidu.swf.version = (function () {
    var n = navigator;
    if (n.plugins && n.mimeTypes.length) {
        var plugin = n.plugins["Shockwave Flash"];
        if (plugin && plugin.description) {
            return plugin.description
                .replace(/([a-zA-Z]|\s)+/, "")
                .replace(/(\s)+r/, ".") + ".0";
        }
    } else if (window.ActiveXObject && !window.opera) {
        for (var i = 12; i >= 2; i--) {
            try {
                var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
                if (c) {
                    var version = c.GetVariable("$version");
                    return version.replace(/WIN/g, '').replace(/,/g, '.');
                }
            } catch (e) { }
        }
    }
})();

/**
 * 操作字符串的方法
 * @namespace baidu.string
 */
baidu.string = baidu.string || {};


/**
 * 對目標字符串进行html编码
 * @name baidu.string.encodeHTML
 * @function
 * @grammar baidu.string.encodeHTML(source)
 * @param {string} source 目標字符串
 * @remark
 * 编码字符有5個：&<>"'
 * @shortcut encodeHTML
 * @meta standard
 * @see baidu.string.decodeHTML
 *
 * @returns {string} html编码後的字符串
 */
baidu.string.encodeHTML = function (source) {
    return String(source)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

baidu.encodeHTML = baidu.string.encodeHTML;

/**
 * 创建flash物件的html字符串
 * @name baidu.swf.createHTML
 * @function
 * @grammar baidu.swf.createHTML(options)
 *
 * @param {Object} 	options 					创建flash的选项参數
 * @param {string} 	options.id 					要创建的flash的標识
 * @param {string} 	options.url 				flash檔案的url
 * @param {String} 	options.errorMessage 		未安装flash player或flash player版本号過低時的提示
 * @param {string} 	options.ver 				最低需要的flash player版本号
 * @param {string} 	options.width 				flash的宽度
 * @param {string} 	options.height 				flash的高度
 * @param {string} 	options.align 				flash的對齐方式，允许值：middle/left/right/top/bottom
 * @param {string} 	options.base 				设置用于解析swf檔案中的所有相對路径语句的基本目录或URL
 * @param {string} 	options.bgcolor 			swf檔案的背景色
 * @param {string} 	options.salign 				设置縮放的swf檔案在由width和height设置定义的区域内的位置。允许值：l/r/t/b/tl/tr/bl/br
 * @param {boolean} options.menu 				是否顯示右键菜单，允许值：true/false
 * @param {boolean} options.loop 				播放到最後一帧時是否重新播放，允许值： true/false
 * @param {boolean} options.play 				flash是否在瀏覽器加载時就开始播放。允许值：true/false
 * @param {string} 	options.quality 			设置flash播放的画质，允许值：low/medium/high/autolow/autohigh/best
 * @param {string} 	options.scale 				设置flash内容如何縮放來适應设置的宽高。允许值：showall/noborder/exactfit
 * @param {string} 	options.wmode 				设置flash的顯示模式。允许值：window/opaque/transparent
 * @param {string} 	options.allowscriptaccess 	设置flash與页面的通信权限。允许值：always/never/sameDomain
 * @param {string} 	options.allownetworking 	设置swf檔案中允许使用的网络API。允许值：all/internal/none
 * @param {boolean} options.allowfullscreen 	是否允许flash全屏。允许值：true/false
 * @param {boolean} options.seamlesstabbing 	允许设置执行無缝跳格，从而使用户能跳出flash應用程序。该参數只能在安装Flash7及更高版本的Windows中使用。允许值：true/false
 * @param {boolean} options.devicefont 			设置静態文本物件是否以设备字體呈现。允许值：true/false
 * @param {boolean} options.swliveconnect 		第一次加载flash時瀏覽器是否應启動Java。允许值：true/false
 * @param {Object} 	options.vars 				要傳递给flash的参數，支持JSON或string類型。
 *
 * @see baidu.swf.create
 * @meta standard
 * @returns {string} flash物件的html字符串
 */
baidu.swf.createHTML = function (options) {
    options = options || {};
    var version = baidu.swf.version,
        needVersion = options['ver'] || '6.0.0',
        vUnit1, vUnit2, i, k, len, item, tmpOpt = {},
        encodeHTML = baidu.string.encodeHTML;
    for (k in options) {
        tmpOpt[k] = options[k];
    }
    options = tmpOpt;
    if (version) {
        version = version.split('.');
        needVersion = needVersion.split('.');
        for (i = 0; i < 3; i++) {
            vUnit1 = parseInt(version[i], 10);
            vUnit2 = parseInt(needVersion[i], 10);
            if (vUnit2 < vUnit1) {
                break;
            } else if (vUnit2 > vUnit1) {
                return '';
            }
        }
    } else {
        return '';
    }

    var vars = options['vars'],
        objProperties = ['classid', 'codebase', 'id', 'width', 'height', 'align'];
    options['align'] = options['align'] || 'middle';
    options['classid'] = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
    options['codebase'] = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0';
    options['movie'] = options['url'] || '';
    delete options['vars'];
    delete options['url'];
    if ('string' == typeof vars) {
        options['flashvars'] = vars;
    } else {
        var fvars = [];
        for (k in vars) {
            item = vars[k];
            fvars.push(k + "=" + encodeURIComponent(item));
        }
        options['flashvars'] = fvars.join('&');
    }
    var str = ['<object '];
    for (i = 0, len = objProperties.length; i < len; i++) {
        item = objProperties[i];
        str.push(' ', item, '="', encodeHTML(options[item]), '"');
    }
    str.push('>');
    var params = {
        'wmode': 1,
        'scale': 1,
        'quality': 1,
        'play': 1,
        'loop': 1,
        'menu': 1,
        'salign': 1,
        'bgcolor': 1,
        'base': 1,
        'allowscriptaccess': 1,
        'allownetworking': 1,
        'allowfullscreen': 1,
        'seamlesstabbing': 1,
        'devicefont': 1,
        'swliveconnect': 1,
        'flashvars': 1,
        'movie': 1
    };

    for (k in options) {
        item = options[k];
        k = k.toLowerCase();
        if (params[k] && (item || item === false || item === 0)) {
            str.push('<param name="' + k + '" value="' + encodeHTML(item) + '" />');
        }
    }
    options['src'] = options['movie'];
    options['name'] = options['id'];
    delete options['id'];
    delete options['movie'];
    delete options['classid'];
    delete options['codebase'];
    options['type'] = 'application/x-shockwave-flash';
    options['pluginspage'] = 'http://www.macromedia.com/go/getflashplayer';
    str.push('<embed');
    var salign;
    for (k in options) {
        item = options[k];
        if (item || item === false || item === 0) {
            if ((new RegExp("^salign\x24", "i")).test(k)) {
                salign = item;
                continue;
            }

            str.push(' ', k, '="', encodeHTML(item), '"');
        }
    }

    if (salign) {
        str.push(' salign="', encodeHTML(salign), '"');
    }
    str.push('></embed></object>');

    return str.join('');
};


/**
 * 在页面中创建一個flash物件
 * @name baidu.swf.create
 * @function
 * @grammar baidu.swf.create(options[, container])
 *
 * @param {Object} 	options 					创建flash的选项参數
 * @param {string} 	options.id 					要创建的flash的標识
 * @param {string} 	options.url 				flash檔案的url
 * @param {String} 	options.errorMessage 		未安装flash player或flash player版本号過低時的提示
 * @param {string} 	options.ver 				最低需要的flash player版本号
 * @param {string} 	options.width 				flash的宽度
 * @param {string} 	options.height 				flash的高度
 * @param {string} 	options.align 				flash的對齐方式，允许值：middle/left/right/top/bottom
 * @param {string} 	options.base 				设置用于解析swf檔案中的所有相對路径语句的基本目录或URL
 * @param {string} 	options.bgcolor 			swf檔案的背景色
 * @param {string} 	options.salign 				设置縮放的swf檔案在由width和height设置定义的区域内的位置。允许值：l/r/t/b/tl/tr/bl/br
 * @param {boolean} options.menu 				是否顯示右键菜单，允许值：true/false
 * @param {boolean} options.loop 				播放到最後一帧時是否重新播放，允许值： true/false
 * @param {boolean} options.play 				flash是否在瀏覽器加载時就开始播放。允许值：true/false
 * @param {string} 	options.quality 			设置flash播放的画质，允许值：low/medium/high/autolow/autohigh/best
 * @param {string} 	options.scale 				设置flash内容如何縮放來适應设置的宽高。允许值：showall/noborder/exactfit
 * @param {string} 	options.wmode 				设置flash的顯示模式。允许值：window/opaque/transparent
 * @param {string} 	options.allowscriptaccess 	设置flash與页面的通信权限。允许值：always/never/sameDomain
 * @param {string} 	options.allownetworking 	设置swf檔案中允许使用的网络API。允许值：all/internal/none
 * @param {boolean} options.allowfullscreen 	是否允许flash全屏。允许值：true/false
 * @param {boolean} options.seamlesstabbing 	允许设置执行無缝跳格，从而使用户能跳出flash應用程序。该参數只能在安装Flash7及更高版本的Windows中使用。允许值：true/false
 * @param {boolean} options.devicefont 			设置静態文本物件是否以设备字體呈现。允许值：true/false
 * @param {boolean} options.swliveconnect 		第一次加载flash時瀏覽器是否應启動Java。允许值：true/false
 * @param {Object} 	options.vars 				要傳递给flash的参數，支持JSON或string類型。
 *
 * @param {HTMLElement|string} [container] 		flash物件的父容器元素，不傳递该参數時在当前代码位置创建flash物件。
 * @meta standard
 * @see baidu.swf.createHTML,baidu.swf.getMovie
 */
baidu.swf.create = function (options, target) {
    options = options || {};
    var html = baidu.swf.createHTML(options)
        || options['errorMessage']
        || '';

    if (target && 'string' == typeof target) {
        target = document.getElementById(target);
    }
    baidu.dom.insertHTML(target || document.body, 'beforeEnd', html);
};
/**
 * 判断是否為ie瀏覽器
 * @name baidu.browser.ie
 * @field
 * @grammar baidu.browser.ie
 * @returns {Number} IE版本号
 */
baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;

/**
 * 移除數组中的项
 * @name baidu.array.remove
 * @function
 * @grammar baidu.array.remove(source, match)
 * @param {Array} source 需要移除项的數组
 * @param {Any} match 要移除的项
 * @meta standard
 * @see baidu.array.removeAt
 *
 * @returns {Array} 移除後的數组
 */
baidu.array.remove = function (source, match) {
    var len = source.length;

    while (len--) {
        if (len in source && source[len] === match) {
            source.splice(len, 1);
        }
    }
    return source;
};

/**
 * 判断目標参數是否Array物件
 * @name baidu.lang.isArray
 * @function
 * @grammar baidu.lang.isArray(source)
 * @param {Any} source 目標参數
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *
 * @returns {boolean} 類型判断结果
 */
baidu.lang.isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};



/**
 * 將一個变量转换成array
 * @name baidu.lang.toArray
 * @function
 * @grammar baidu.lang.toArray(source)
 * @param {mix} source 需要转换成array的变量
 * @version 1.3
 * @meta standard
 * @returns {array} 转换後的array
 */
baidu.lang.toArray = function (source) {
    if (source === null || source === undefined)
        return [];
    if (baidu.lang.isArray(source))
        return source;
    if (typeof source.length !== 'number' || typeof source === 'string' || baidu.lang.isFunction(source)) {
        return [source];
    }
    if (source.item) {
        var l = source.length, array = new Array(l);
        while (l--)
            array[l] = source[l];
        return array;
    }

    return [].slice.call(source);
};

/**
 * 获得flash物件的實例
 * @name baidu.swf.getMovie
 * @function
 * @grammar baidu.swf.getMovie(name)
 * @param {string} name flash物件的名称
 * @see baidu.swf.create
 * @meta standard
 * @returns {HTMLElement} flash物件的實例
 */
baidu.swf.getMovie = function (name) {
    var movie = document[name], ret;
    return baidu.browser.ie == 9 ?
        movie && movie.length ?
            (ret = baidu.array.remove(baidu.lang.toArray(movie), function (item) {
                return item.tagName.toLowerCase() != "embed";
            })).length == 1 ? ret[0] : ret
            : movie
        : movie || window[name];
};


baidu.flash._Base = (function () {

    var prefix = 'bd__flash__';

    /**
     * 创建一個随机的字符串
     * @private
     * @return {String}
     */
    function _createString() {
        return prefix + Math.floor(Math.random() * 2147483648).toString(36);
    };

    /**
     * 检查flash狀態
     * @private
     * @param {Object} target flash物件
     * @return {Boolean}
     */
    function _checkReady(target) {
        if (typeof target !== 'undefined' && typeof target.flashInit !== 'undefined' && target.flashInit()) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 調用之前进行壓栈的函數
     * @private
     * @param {Array} callQueue 調用隊列
     * @param {Object} target flash物件
     * @return {Null}
     */
    function _callFn(callQueue, target) {
        var result = null;

        callQueue = callQueue.reverse();
        baidu.each(callQueue, function (item) {
            result = target.call(item.fnName, item.params);
            item.callBack(result);
        });
    };

    /**
     * 為傳入的匿名函數创建函數名
     * @private
     * @param {String|Function} fun 傳入的匿名函數或者函數名
     * @return {String}
     */
    function _createFunName(fun) {
        var name = '';

        if (baidu.lang.isFunction(fun)) {
            name = _createString();
            window[name] = function () {
                fun.apply(window, arguments);
            };

            return name;
        } else if (baidu.lang.isString) {
            return fun;
        }
    };

    /**
     * 绘制flash
     * @private
     * @param {Object} options 创建参數
     * @return {Object}
     */
    function _render(options) {
        if (!options.id) {
            options.id = _createString();
        }

        var container = options.container || '';
        delete (options.container);

        baidu.swf.create(options, container);

        return baidu.swf.getMovie(options.id);
    };

    return function (options, callBack) {
        var me = this,
            autoRender = (typeof options.autoRender !== 'undefined' ? options.autoRender : true),
            createOptions = options.createOptions || {},
            target = null,
            isReady = false,
            callQueue = [],
            timeHandle = null,
            callBack = callBack || [];

        /**
         * 將flash檔案绘制到页面上
         * @public
         * @return {Null}
         */
        me.render = function () {
            target = _render(createOptions);

            if (callBack.length > 0) {
                baidu.each(callBack, function (funName, index) {
                    callBack[index] = _createFunName(options[funName] || new Function());
                });
            }
            me.call('setJSFuncName', [callBack]);
        };

        /**
         * 返回flash狀態
         * @return {Boolean}
         */
        me.isReady = function () {
            return isReady;
        };

        /**
         * 調用flash接口的统一入口
         * @param {String} fnName 調用的函數名
         * @param {Array} params 傳入的参數组成的數组,若不许要参數，需傳入空數组
         * @param {Function} [callBack] 異步調用後將返回值作為参數的調用回調函數，如無返回值，可以不傳入此参數
         * @return {Null}
        */
        me.call = function (fnName, params, callBack) {
            if (!fnName) return null;
            callBack = callBack || new Function();

            var result = null;

            if (isReady) {
                result = target.call(fnName, params);
                callBack(result);
            } else {
                callQueue.push({
                    fnName: fnName,
                    params: params,
                    callBack: callBack
                });

                (!timeHandle) && (timeHandle = setInterval(_check, 200));
            }
        };

        /**
         * 為傳入的匿名函數创建函數名
         * @public
         * @param {String|Function} fun 傳入的匿名函數或者函數名
         * @return {String}
         */
        me.createFunName = function (fun) {
            return _createFunName(fun);
        };

        /**
         * 检查flash是否ready， 并进行調用
         * @private
         * @return {Null}
         */
        function _check() {
            if (_checkReady(target)) {
                clearInterval(timeHandle);
                timeHandle = null;
                _call();

                isReady = true;
            }
        };

        /**
         * 調用之前进行壓栈的函數
         * @private
         * @return {Null}
         */
        function _call() {
            _callFn(callQueue, target);
            callQueue = [];
        }

        autoRender && me.render();
    };
})();



/**
 * 创建flash based imageUploader
 * @class
 * @grammar baidu.flash.imageUploader(options)
 * @param {Object} createOptions 创建flash時需要的参數，請参照baidu.swf.create文档
 * @config {Object} vars 创建imageUploader時所需要的参數
 * @config {Number} vars.gridWidth 每一個預覽圖片所占的宽度，應该為flash寛的整除
 * @config {Number} vars.gridHeight 每一個預覽圖片所占的高度，應该為flash高的整除
 * @config {Number} vars.picWidth 单張預覽圖片的宽度
 * @config {Number} vars.picHeight 单張預覽圖片的高度
 * @config {String} vars.uploadDataFieldName POST請求中圖片資料的key,默认值'picdata'
 * @config {String} vars.picDescFieldName POST請求中圖片描述的key,默认值'picDesc'
 * @config {Number} vars.maxSize 檔案的最大體積,单位'MB'
 * @config {Number} vars.compressSize 上傳前如果圖片體積超過该值，會先壓縮
 * @config {Number} vars.maxNum:32 最大上傳多少個檔案
 * @config {Number} vars.compressLength 能接受的最大边长，超過该值會等比壓縮
 * @config {String} vars.url 上傳的url地址
 * @config {Number} vars.mode mode == 0時，是使用滚動条，mode == 1時，拉伸flash, 默认值為0
 * @see baidu.swf.createHTML
 * @param {String} backgroundUrl 背景圖片路径
 * @param {String} listBacgroundkUrl 布局控件背景
 * @param {String} buttonUrl 按钮圖片不背景
 * @param {String|Function} selectFileCallback 选择檔案的回調
 * @param {String|Function} exceedFileCallback檔案超出限制的最大體積時的回調
 * @param {String|Function} deleteFileCallback 删除檔案的回調
 * @param {String|Function} startUploadCallback 开始上傳某個檔案時的回調
 * @param {String|Function} uploadCompleteCallback 某個檔案上傳完成的回調
 * @param {String|Function} uploadErrorCallback 某個檔案上傳失败的回調
 * @param {String|Function} allCompleteCallback 全部上傳完成時的回調
 * @param {String|Function} changeFlashHeight 改变Flash的高度，mode==1的時候才有用
 */
baidu.flash.imageUploader = baidu.flash.imageUploader || function (options) {

    var me = this,
        options = options || {},
        _flash = new baidu.flash._Base(options, [
            'selectFileCallback',
            'exceedFileCallback',
            'deleteFileCallback',
            'startUploadCallback',
            'uploadCompleteCallback',
            'uploadErrorCallback',
            'allCompleteCallback',
            'changeFlashHeight'
        ]);
    /**
     * 开始或回复上傳圖片
     * @public
     * @return {Null}
     */
    me.upload = function () {
        _flash.call('upload');
    };

    /**
     * 暫停上傳圖片
     * @public
     * @return {Null}
     */
    me.pause = function () {
        _flash.call('pause');
    };
    me.addCustomizedParams = function (index, obj) {
        _flash.call('addCustomizedParams', [index, obj]);
    }
};

/**
 * 操作原生物件的方法
 * @namespace baidu.object
 */
baidu.object = baidu.object || {};


/**
 * 將源物件的所有屬性拷贝到目標物件中
 * @author erik
 * @name baidu.object.extend
 * @function
 * @grammar baidu.object.extend(target, source)
 * @param {Object} target 目標物件
 * @param {Object} source 源物件
 * @see baidu.array.merge
 * @remark
 *
1.目標物件中，與源物件key相同的成员將會被覆盖。<br>
2.源物件的prototype成员不會拷贝。

 * @shortcut extend
 * @meta standard
 *
 * @returns {Object} 目標物件
 */
baidu.extend =
    baidu.object.extend = function (target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }

        return target;
    };





/**
 * 创建flash based fileUploader
 * @class
 * @grammar baidu.flash.fileUploader(options)
 * @param {Object} options
 * @config {Object} createOptions 创建flash時需要的参數，請参照baidu.swf.create文档
 * @config {String} createOptions.width
 * @config {String} createOptions.height
 * @config {Number} maxNum 最大可选檔案數
 * @config {Function|String} selectFile
 * @config {Function|String} exceedMaxSize
 * @config {Function|String} deleteFile
 * @config {Function|String} uploadStart
 * @config {Function|String} uploadComplete
 * @config {Function|String} uploadError
 * @config {Function|String} uploadProgress
 */
baidu.flash.fileUploader = baidu.flash.fileUploader || function (options) {
    var me = this,
        options = options || {};

    options.createOptions = baidu.extend({
        wmod: 'transparent'
    }, options.createOptions || {});

    var _flash = new baidu.flash._Base(options, [
        'selectFile',
        'exceedMaxSize',
        'deleteFile',
        'uploadStart',
        'uploadComplete',
        'uploadError',
        'uploadProgress'
    ]);

    _flash.call('setMaxNum', options.maxNum ? [options.maxNum] : [1]);

    /**
     * 设置当鼠標移動到flash上時，是否变成手型
     * @public
     * @param {Boolean} isCursor
     * @return {Null}
     */
    me.setHandCursor = function (isCursor) {
        _flash.call('setHandCursor', [isCursor || false]);
    };

    /**
     * 设置鼠標相應函數名
     * @param {String|Function} fun
     */
    me.setMSFunName = function (fun) {
        _flash.call('setMSFunName', [_flash.createFunName(fun)]);
    };

    /**
     * 执行上傳操作
     * @param {String} url 上傳的url
     * @param {String} fieldName 上傳的表单字段名
     * @param {Object} postData 键值對，上傳的POST資料
     * @param {Number|Array|null|-1} [index]上傳的檔案序列
     *                            Int值上傳该檔案
     *                            Array一次串行上傳该序列檔案
     *                            -1/null上傳所有檔案
     * @return {Null}
     */
    me.upload = function (url, fieldName, postData, index) {

        if (typeof url !== 'string' || typeof fieldName !== 'string') return null;
        if (typeof index === 'undefined') index = -1;

        _flash.call('upload', [url, fieldName, postData, index]);
    };

    /**
     * 取消上傳操作
     * @public
     * @param {Number|-1} index
     */
    me.cancel = function (index) {
        if (typeof index === 'undefined') index = -1;
        _flash.call('cancel', [index]);
    };

    /**
     * 删除檔案
     * @public
     * @param {Number|Array} [index] 要删除的index，不傳則全部删除
     * @param {Function} callBack
     * */
    me.deleteFile = function (index, callBack) {

        var callBackAll = function (list) {
            callBack && callBack(list);
        };

        if (typeof index === 'undefined') {
            _flash.call('deleteFilesAll', [], callBackAll);
            return;
        };

        if (typeof index === 'Number') index = [index];
        index.sort(function (a, b) {
            return b - a;
        });
        baidu.each(index, function (item) {
            _flash.call('deleteFileBy', item, callBackAll);
        });
    };

    /**
     * 添加檔案類型，支持macType
     * @public
     * @param {Object|Array[Object]} type {description:String, extention:String}
     * @return {Null};
     */
    me.addFileType = function (type) {
        var type = type || [[]];

        if (type instanceof Array) type = [type];
        else type = [[type]];
        _flash.call('addFileTypes', type);
    };

    /**
     * 设置檔案類型，支持macType
     * @public
     * @param {Object|Array[Object]} type {description:String, extention:String}
     * @return {Null};
     */
    me.setFileType = function (type) {
        var type = type || [[]];

        if (type instanceof Array) type = [type];
        else type = [[type]];
        _flash.call('setFileTypes', type);
    };

    /**
     * 设置可选檔案的數量限制
     * @public
     * @param {Number} num
     * @return {Null}
     */
    me.setMaxNum = function (num) {
        _flash.call('setMaxNum', [num]);
    };

    /**
     * 设置可选檔案大小限制，以兆M為单位
     * @public
     * @param {Number} num,0為無限制
     * @return {Null}
     */
    me.setMaxSize = function (num) {
        _flash.call('setMaxSize', [num]);
    };

    /**
     * @public
     */
    me.getFileAll = function (callBack) {
        _flash.call('getFileAll', [], callBack);
    };

    /**
     * @public
     * @param {Number} index
     * @param {Function} [callBack]
     */
    me.getFileByIndex = function (index, callBack) {
        _flash.call('getFileByIndex', [], callBack);
    };

    /**
     * @public
     * @param {Number} index
     * @param {function} [callBack]
     */
    me.getStatusByIndex = function (index, callBack) {
        _flash.call('getStatusByIndex', [], callBack);
    };
};

/**
 * 使用動態script標签請求服务器资源，包括由服务器端的回調和瀏覽器端的回調
 * @namespace baidu.sio
 */
baidu.sio = baidu.sio || {};

/**
 *
 * @param {HTMLElement} src script節点
 * @param {String} url script節点的地址
 * @param {String} [charset] 编码
 */
baidu.sio._createScriptTag = function (scr, url, charset) {
    scr.setAttribute('type', 'text/javascript');
    charset && scr.setAttribute('charset', charset);
    scr.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(scr);
};

/**
 * 删除script的屬性，再删除script標签，以解决修复内存泄漏的问题
 *
 * @param {HTMLElement} src script節点
 */
baidu.sio._removeScriptTag = function (scr) {
    if (scr.clearAttributes) {
        scr.clearAttributes();
    } else {
        for (var attr in scr) {
            if (scr.hasOwnProperty(attr)) {
                delete scr[attr];
            }
        }
    }
    if (scr && scr.parentNode) {
        scr.parentNode.removeChild(scr);
    }
    scr = null;
};


/**
 * 通過script標签加载資料，加载完成由瀏覽器端触发回調
 * @name baidu.sio.callByBrowser
 * @function
 * @grammar baidu.sio.callByBrowser(url, opt_callback, opt_options)
 * @param {string} url 加载資料的url
 * @param {Function|string} opt_callback 資料加载结束時調用的函數或函數名
 * @param {Object} opt_options 其他可选项
 * @config {String} [charset] script的字符集
 * @config {Integer} [timeOut] 超時時间，超過这個時间將不再响應本請求，并触发onfailure函數
 * @config {Function} [onfailure] timeOut设定後才生效，到达超時時间時触发本函數
 * @remark
 * 1、與callByServer不同，callback参數只支持Function類型，不支持string。
 * 2、如果請求了一個不存在的页面，callback函數在IE/opera下也會被調用，因此使用者需要在onsuccess函數中判断資料是否正确加载。
 * @meta standard
 * @see baidu.sio.callByServer
 */
baidu.sio.callByBrowser = function (url, opt_callback, opt_options) {
    var scr = document.createElement("SCRIPT"),
        scriptLoaded = 0,
        options = opt_options || {},
        charset = options['charset'],
        callback = opt_callback || function () { },
        timeOut = options['timeOut'] || 0,
        timer;
    scr.onload = scr.onreadystatechange = function () {
        if (scriptLoaded) {
            return;
        }

        var readyState = scr.readyState;
        if ('undefined' == typeof readyState
            || readyState == "loaded"
            || readyState == "complete") {
            scriptLoaded = 1;
            try {
                callback();
                clearTimeout(timer);
            } finally {
                scr.onload = scr.onreadystatechange = null;
                baidu.sio._removeScriptTag(scr);
            }
        }
    };

    if (timeOut) {
        timer = setTimeout(function () {
            scr.onload = scr.onreadystatechange = null;
            baidu.sio._removeScriptTag(scr);
            options.onfailure && options.onfailure();
        }, timeOut);
    }

    baidu.sio._createScriptTag(scr, url, charset);
};

/**
 * 通過script標签加载資料，加载完成由服务器端触发回調
 * @name baidu.sio.callByServer
 * @function
 * @grammar baidu.sio.callByServer(url, callback[, opt_options])
 * @param {string} url 加载資料的url.
 * @param {Function|string} callback 服务器端調用的函數或函數名。如果没有指定本参數，將在URL中寻找options['queryField']做為callback的方法名.
 * @param {Object} opt_options 加载資料時的选项.
 * @config {string} [charset] script的字符集
 * @config {string} [queryField] 服务器端callback請求字段名，默认為callback
 * @config {Integer} [timeOut] 超時時间(单位：ms)，超過这個時间將不再响應本請求，并触发onfailure函數
 * @config {Function} [onfailure] timeOut设定後才生效，到达超時時间時触发本函數
 * @remark
 * 如果url中已经包含key為“options['queryField']”的query项，將會被替换成callback中参數傳递或自動生成的函數名。
 * @meta standard
 * @see baidu.sio.callByBrowser
 */
baidu.sio.callByServer = /**@function*/function (url, callback, opt_options) {
    var scr = document.createElement('SCRIPT'),
        prefix = 'bd__cbs__',
        callbackName,
        callbackImpl,
        options = opt_options || {},
        charset = options['charset'],
        queryField = options['queryField'] || 'callback',
        timeOut = options['timeOut'] || 0,
        timer,
        reg = new RegExp('(\\?|&)' + queryField + '=([^&]*)'),
        matches;

    if (baidu.lang.isFunction(callback)) {
        callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
        window[callbackName] = getCallBack(0);
    } else if (baidu.lang.isString(callback)) {
        callbackName = callback;
    } else {
        if (matches = reg.exec(url)) {
            callbackName = matches[2];
        }
    }

    if (timeOut) {
        timer = setTimeout(getCallBack(1), timeOut);
    }
    url = url.replace(reg, '\x241' + queryField + '=' + callbackName);

    if (url.search(reg) < 0) {
        url += (url.indexOf('?') < 0 ? '?' : '&') + queryField + '=' + callbackName;
    }
    baidu.sio._createScriptTag(scr, url, charset);

    /*
     * 返回一個函數，用于立即（挂在window上）或者超時（挂在setTimeout中）時执行
     */
    function getCallBack(onTimeOut) {
        /*global callbackName, callback, scr, options;*/
        return function () {
            try {
                if (onTimeOut) {
                    options.onfailure && options.onfailure();
                } else {
                    callback.apply(window, arguments);
                    clearTimeout(timer);
                }
                window[callbackName] = null;
                delete window[callbackName];
            } catch (exception) {
            } finally {
                baidu.sio._removeScriptTag(scr);
            }
        }
    }
};

/**
 * 通過請求一個圖片的方式令服务器存储一条日誌
 * @function
 * @grammar baidu.sio.log(url)
 * @param {string} url 要发送的地址.
 * @author: int08h,leeight
 */
baidu.sio.log = function (url) {
    var img = new Image(),
        key = 'tangram_sio_log_' + Math.floor(Math.random() *
            2147483648).toString(36);
    window[key] = img;

    img.onload = img.onerror = img.onabort = function () {
        img.onload = img.onerror = img.onabort = null;

        window[key] = null;
        img = null;
    };
    img.src = url;
};



/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: baidu/json.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/02
 */


/**
 * 操作json物件的方法
 * @namespace baidu.json
 */
baidu.json = baidu.json || {};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: baidu/json/parse.js
 * author: erik, berg
 * version: 1.2
 * date: 2009/11/23
 */



/**
 * 將字符串解析成json物件。注：不會自動祛除空格
 * @name baidu.json.parse
 * @function
 * @grammar baidu.json.parse(data)
 * @param {string} source 需要解析的字符串
 * @remark
 * 该方法的實现與ecma-262第五版中规定的JSON.parse不同，暫時只支持傳入一個参數。後續會进行功能丰富。
 * @meta standard
 * @see baidu.json.stringify,baidu.json.decode
 *
 * @returns {JSON} 解析结果json物件
 */
baidu.json.parse = function (data) {
    //2010/12/09：更新至不使用原生parse，不检测用户输入是否正确
    return (new Function("return (" + data + ")"))();
};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: baidu/json/decode.js
 * author: erik, cat
 * version: 1.3.4
 * date: 2010/12/23
 */



/**
 * 將字符串解析成json物件，為過時接口，今後會被baidu.json.parse代替
 * @name baidu.json.decode
 * @function
 * @grammar baidu.json.decode(source)
 * @param {string} source 需要解析的字符串
 * @meta out
 * @see baidu.json.encode,baidu.json.parse
 *
 * @returns {JSON} 解析结果json物件
 */
baidu.json.decode = baidu.json.parse;
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: baidu/json/stringify.js
 * author: erik
 * version: 1.1.0
 * date: 2010/01/11
 */



/**
 * 將json物件序列化
 * @name baidu.json.stringify
 * @function
 * @grammar baidu.json.stringify(value)
 * @param {JSON} value 需要序列化的json物件
 * @remark
 * 该方法的實现與ecma-262第五版中规定的JSON.stringify不同，暫時只支持傳入一個参數。後續會进行功能丰富。
 * @meta standard
 * @see baidu.json.parse,baidu.json.encode
 *
 * @returns {string} 序列化後的字符串
 */
baidu.json.stringify = (function () {
    /**
     * 字符串處理時需要转义的字符表
     * @private
     */
    var escapeMap = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\'
    };

    /**
     * 字符串序列化
     * @private
     */
    function encodeString(source) {
        if (/["\\\x00-\x1f]/.test(source)) {
            source = source.replace(
                /["\\\x00-\x1f]/g,
                function (match) {
                    var c = escapeMap[match];
                    if (c) {
                        return c;
                    }
                    c = match.charCodeAt();
                    return "\\u00"
                        + Math.floor(c / 16).toString(16)
                        + (c % 16).toString(16);
                });
        }
        return '"' + source + '"';
    }

    /**
     * 數组序列化
     * @private
     */
    function encodeArray(source) {
        var result = ["["],
            l = source.length,
            preComma, i, item;

        for (i = 0; i < l; i++) {
            item = source[i];

            switch (typeof item) {
                case "undefined":
                case "function":
                case "unknown":
                    break;
                default:
                    if (preComma) {
                        result.push(',');
                    }
                    result.push(baidu.json.stringify(item));
                    preComma = 1;
            }
        }
        result.push("]");
        return result.join("");
    }

    /**
     * 處理日期序列化時的补零
     * @private
     */
    function pad(source) {
        return source < 10 ? '0' + source : source;
    }

    /**
     * 日期序列化
     * @private
     */
    function encodeDate(source) {
        return '"' + source.getFullYear() + "-"
            + pad(source.getMonth() + 1) + "-"
            + pad(source.getDate()) + "T"
            + pad(source.getHours()) + ":"
            + pad(source.getMinutes()) + ":"
            + pad(source.getSeconds()) + '"';
    }

    return function (value) {
        switch (typeof value) {
            case 'undefined':
                return 'undefined';

            case 'number':
                return isFinite(value) ? String(value) : "null";

            case 'string':
                return encodeString(value);

            case 'boolean':
                return String(value);

            default:
                if (value === null) {
                    return 'null';
                } else if (value instanceof Array) {
                    return encodeArray(value);
                } else if (value instanceof Date) {
                    return encodeDate(value);
                } else {
                    var result = ['{'],
                        encode = baidu.json.stringify,
                        preComma,
                        item;

                    for (var key in value) {
                        if (Object.prototype.hasOwnProperty.call(value, key)) {
                            item = value[key];
                            switch (typeof item) {
                                case 'undefined':
                                case 'unknown':
                                case 'function':
                                    break;
                                default:
                                    if (preComma) {
                                        result.push(',');
                                    }
                                    preComma = 1;
                                    result.push(encode(key) + ':' + encode(item));
                            }
                        }
                    }
                    result.push('}');
                    return result.join('');
                }
        }
    };
})();
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: baidu/json/encode.js
 * author: erik, cat
 * version: 1.3.4
 * date: 2010/12/23
 */



/**
 * 將json物件序列化，為過時接口，今後會被baidu.json.stringify代替
 * @name baidu.json.encode
 * @function
 * @grammar baidu.json.encode(value)
 * @param {JSON} value 需要序列化的json物件
 * @meta out
 * @see baidu.json.decode,baidu.json.stringify
 *
 * @returns {string} 序列化後的字符串
 */
baidu.json.encode = baidu.json.stringify;
