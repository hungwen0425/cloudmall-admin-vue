/*! WebUploader 0.1.2 */


/**
 * @fileOverview 讓内部各個部件的代码可以用[amd](https://github.com/amdjs/amdjs-api/wiki/AMD)模块定义方式组织起來。
 *
 * AMD API 内部的简单不完全實现，請忽略。只有当WebUploader被合并成一個檔案的時候才會引入。
 */
(function (root, factory) {
    var modules = {},

        // 内部require, 简单不完全實现。
        // https://github.com/amdjs/amdjs-api/wiki/require
        _require = function (deps, callback) {
            var args, len, i;

            // 如果deps不是數组，則直接返回指定module
            if (typeof deps === 'string') {
                return getModule(deps);
            } else {
                args = [];
                for (len = deps.length, i = 0; i < len; i++) {
                    args.push(getModule(deps[i]));
                }

                return callback.apply(null, args);
            }
        },

        // 内部define，暫時不支持不指定id.
        _define = function (id, deps, factory) {
            if (arguments.length === 2) {
                factory = deps;
                deps = null;
            }

            _require(deps || [], function () {
                setModule(id, factory, arguments);
            });
        },

        // 设置module, 兼容CommonJs写法。
        setModule = function (id, factory, args) {
            var module = {
                exports: factory
            },
                returned;

            if (typeof factory === 'function') {
                args.length || (args = [_require, module.exports, module]);
                returned = factory.apply(null, args);
                returned !== undefined && (module.exports = returned);
            }

            modules[id] = module.exports;
        },

        // 根据id取得module
        getModule = function (id) {
            var module = modules[id] || root[id];

            if (!module) {
                throw new Error('`' + id + '` is undefined');
            }

            return module;
        },

        // 將所有modules，將路径ids装换成物件。
        exportsTo = function (obj) {
            var key, host, parts, part, last, ucFirst;

            // make the first character upper case.
            ucFirst = function (str) {
                return str && (str.charAt(0).toUpperCase() + str.substr(1));
            };

            for (key in modules) {
                host = obj;

                if (!modules.hasOwnProperty(key)) {
                    continue;
                }

                parts = key.split('/');
                last = ucFirst(parts.pop());

                while ((part = ucFirst(parts.shift()))) {
                    host[part] = host[part] || {};
                    host = host[part];
                }

                host[last] = modules[key];
            }
        },

        exports = factory(root, _define, _require),
        origin;

    // exports every module.
    exportsTo(exports);

    if (typeof module === 'object' && typeof module.exports === 'object') {

        // For CommonJS and CommonJS-like environments where a proper window is present,
        module.exports = exports;
    } else if (typeof define === 'function' && define.amd) {

        // Allow using this built library as an AMD module
        // in another project. That other project will only
        // see this AMD call, not the internal modules in
        // the closure below.
        define([], exports);
    } else {

        // Browser globals case. Just assign the
        // result to a property on the global.
        origin = root.WebUploader;
        root.WebUploader = exports;
        root.WebUploader.noConflict = function () {
            root.WebUploader = origin;
        };
    }
})(this, function (window, define, require) {


    /**
     * @fileOverview jQuery or Zepto
     */
    define('dollar-third', [], function () {
        return window.jQuery || window.Zepto;
    });
    /**
     * @fileOverview Dom 操作相關
     */
    define('dollar', [
        'dollar-third'
    ], function (_) {
        return _;
    });
    /**
     * @fileOverview 使用jQuery的Promise
     */
    define('promise-third', [
        'dollar'
    ], function ($) {
        return {
            Deferred: $.Deferred,
            when: $.when,

            isPromise: function (anything) {
                return anything && typeof anything.then === 'function';
            }
        };
    });
    /**
     * @fileOverview Promise/A+
     */
    define('promise', [
        'promise-third'
    ], function (_) {
        return _;
    });
    /**
     * @fileOverview 基础類方法。
     */

    /**
     * Web Uploader内部類的详细说明，以下提及的功能類，都可以在`WebUploader`这個变量中访问到。
     *
     * As you know, Web Uploader的每個檔案都是用過[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)规范中的`define`组织起來的, 每個Module都會有個module id.
     * 默认module id该檔案的路径，而此路径將會转化成名字空间存放在WebUploader中。如：
     *
     * * module `base`：WebUploader.Base
     * * module `file`: WebUploader.File
     * * module `lib/dnd`: WebUploader.Lib.Dnd
     * * module `runtime/html5/dnd`: WebUploader.Runtime.Html5.Dnd
     *
     *
     * 以下文档將可能省略`WebUploader`前缀。
     * @module WebUploader
     * @title WebUploader API文档
     */
    define('base', [
        'dollar',
        'promise'
    ], function ($, promise) {

        var noop = function () { },
            call = Function.call;

        // http://jsperf.com/uncurrythis
        // 反科里化
        function uncurryThis(fn) {
            return function () {
                return call.apply(fn, arguments);
            };
        }

        function bindFn(fn, context) {
            return function () {
                return fn.apply(context, arguments);
            };
        }

        function createObject(proto) {
            var f;

            if (Object.create) {
                return Object.create(proto);
            } else {
                f = function () { };
                f.prototype = proto;
                return new f();
            }
        }


        /**
         * 基础類，提供一些简单常用的方法。
         * @class Base
         */
        return {

            /**
             * @property {String} version 当前版本号。
             */
            version: '0.1.2',

            /**
             * @property {jQuery|Zepto} $ 引用依赖的jQuery或者Zepto物件。
             */
            $: $,

            Deferred: promise.Deferred,

            isPromise: promise.isPromise,

            when: promise.when,

            /**
             * @description  简单的瀏覽器检查结果。
             *
             * * `webkit`  webkit版本号，如果瀏覽器為非webkit内核，此屬性為`undefined`。
             * * `chrome`  chrome瀏覽器版本号，如果瀏覽器為chrome，此屬性為`undefined`。
             * * `ie`  ie瀏覽器版本号，如果瀏覽器為非ie，此屬性為`undefined`。**暫不支持ie10+**
             * * `firefox`  firefox瀏覽器版本号，如果瀏覽器為非firefox，此屬性為`undefined`。
             * * `safari`  safari瀏覽器版本号，如果瀏覽器為非safari，此屬性為`undefined`。
             * * `opera`  opera瀏覽器版本号，如果瀏覽器為非opera，此屬性為`undefined`。
             *
             * @property {Object} [browser]
             */
            browser: (function (ua) {
                var ret = {},
                    webkit = ua.match(/WebKit\/([\d.]+)/),
                    chrome = ua.match(/Chrome\/([\d.]+)/) ||
                        ua.match(/CriOS\/([\d.]+)/),

                    ie = ua.match(/MSIE\s([\d\.]+)/) ||
                        ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i),
                    firefox = ua.match(/Firefox\/([\d.]+)/),
                    safari = ua.match(/Safari\/([\d.]+)/),
                    opera = ua.match(/OPR\/([\d.]+)/);

                webkit && (ret.webkit = parseFloat(webkit[1]));
                chrome && (ret.chrome = parseFloat(chrome[1]));
                ie && (ret.ie = parseFloat(ie[1]));
                firefox && (ret.firefox = parseFloat(firefox[1]));
                safari && (ret.safari = parseFloat(safari[1]));
                opera && (ret.opera = parseFloat(opera[1]));

                return ret;
            })(navigator.userAgent),

            /**
             * @description  操作系统检查结果。
             *
             * * `android`  如果在android瀏覽器環境下，此值為對應的android版本号，否則為`undefined`。
             * * `ios` 如果在ios瀏覽器環境下，此值為對應的ios版本号，否則為`undefined`。
             * @property {Object} [os]
             */
            os: (function (ua) {
                var ret = {},

                    // osx = !!ua.match( /\(Macintosh\; Intel / ),
                    android = ua.match(/(?:Android);?[\s\/]+([\d.]+)?/),
                    ios = ua.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/);

                // osx && (ret.osx = true);
                android && (ret.android = parseFloat(android[1]));
                ios && (ret.ios = parseFloat(ios[1].replace(/_/g, '.')));

                return ret;
            })(navigator.userAgent),

            /**
             * 實现類與類之间的繼承。
             * @method inherits
             * @grammar Base.inherits( super ) => child
             * @grammar Base.inherits( super, protos ) => child
             * @grammar Base.inherits( super, protos, statics ) => child
             * @param  {Class} super 父類
             * @param  {Object | Function} [protos] 子類或者物件。如果物件中包含constructor，子類將是用此屬性值。
             * @param  {Function} [protos.constructor] 子類構造器，不指定的话將创建個临時的直接执行父類構造器的方法。
             * @param  {Object} [statics] 静態屬性或方法。
             * @return {Class} 返回子類。
             * @example
             * function Person() {
             *     console.log( 'Super' );
             * }
             * Person.prototype.hello = function() {
             *     console.log( 'hello' );
             * };
             *
             * var Manager = Base.inherits( Person, {
             *     world: function() {
             *         console.log( 'World' );
             *     }
             * });
             *
             * // 因為没有指定構造器，父類的構造器將會执行。
             * var instance = new Manager();    // => Super
             *
             * // 繼承子父類的方法
             * instance.hello();    // => hello
             * instance.world();    // => World
             *
             * // 子類的__super__屬性指向父類
             * console.log( Manager.__super__ === Person );    // => true
             */
            inherits: function (Super, protos, staticProtos) {
                var child;

                if (typeof protos === 'function') {
                    child = protos;
                    protos = null;
                } else if (protos && protos.hasOwnProperty('constructor')) {
                    child = protos.constructor;
                } else {
                    child = function () {
                        return Super.apply(this, arguments);
                    };
                }

                // 复制静態方法
                $.extend(true, child, Super, staticProtos || {});

                /* jshint camelcase: false */

                // 讓子類的__super__屬性指向父類。
                child.__super__ = Super.prototype;

                // 構建原型，添加原型方法或屬性。
                // 暫時用Object.create實现。
                child.prototype = createObject(Super.prototype);
                protos && $.extend(true, child.prototype, protos);

                return child;
            },

            /**
             * 一個不做任何事情的方法。可以用來赋值给默认的callback.
             * @method noop
             */
            noop: noop,

            /**
             * 返回一個新的方法，此方法將已指定的`context`來执行。
             * @grammar Base.bindFn( fn, context ) => Function
             * @method bindFn
             * @example
             * var doSomething = function() {
             *         console.log( this.name );
             *     },
             *     obj = {
             *         name: 'Object Name'
             *     },
             *     aliasFn = Base.bind( doSomething, obj );
             *
             *  aliasFn();    // => Object Name
             *
             */
            bindFn: bindFn,

            /**
             * 引用Console.log如果存在的话，否則引用一個[空函數loop](#WebUploader:Base.log)。
             * @grammar Base.log( args... ) => undefined
             * @method log
             */
            log: (function () {
                if (window.console) {
                    return bindFn(console.log, console);
                }
                return noop;
            })(),

            nextTick: (function () {

                return function (cb) {
                    setTimeout(cb, 1);
                };

                // @bug 当瀏覽器不在当前窗口時就停了。
                // var next = window.requestAnimationFrame ||
                //     window.webkitRequestAnimationFrame ||
                //     window.mozRequestAnimationFrame ||
                //     function( cb ) {
                //         window.setTimeout( cb, 1000 / 60 );
                //     };

                // // fix: Uncaught TypeError: Illegal invocation
                // return bindFn( next, window );
            })(),

            /**
             * 被[uncurrythis](http://www.2ality.com/2011/11/uncurrying-this.html)的數组slice方法。
             * 將用來將非數组物件转化成數组物件。
             * @grammar Base.slice( target, start[, end] ) => Array
             * @method slice
             * @example
             * function doSomthing() {
             *     var args = Base.slice( arguments, 1 );
             *     console.log( args );
             * }
             *
             * doSomthing( 'ignored', 'arg2', 'arg3' );    // => Array ["arg2", "arg3"]
             */
            slice: uncurryThis([].slice),

            /**
             * 生成唯一的ID
             * @method guid
             * @grammar Base.guid() => String
             * @grammar Base.guid( prefx ) => String
             */
            guid: (function () {
                var counter = 0;

                return function (prefix) {
                    var guid = (+new Date()).toString(32),
                        i = 0;

                    for (; i < 5; i++) {
                        guid += Math.floor(Math.random() * 65535).toString(32);
                    }

                    return (prefix || 'wu_') + guid + (counter++).toString(32);
                };
            })(),

            /**
             * 格式化檔案大小, 输出成带单位的字符串
             * @method formatSize
             * @grammar Base.formatSize( size ) => String
             * @grammar Base.formatSize( size, pointLength ) => String
             * @grammar Base.formatSize( size, pointLength, units ) => String
             * @param {Number} size 檔案大小
             * @param {Number} [pointLength=2] 精确到的小數点數。
             * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位數组。从字節，到千字節，一直往上指定。如果单位數组里面只指定了到了K(千字節)，同時檔案大小大于M, 此方法的输出將還是顯示成多少K.
             * @example
             * console.log( Base.formatSize( 100 ) );    // => 100B
             * console.log( Base.formatSize( 1024 ) );    // => 1.00K
             * console.log( Base.formatSize( 1024, 0 ) );    // => 1K
             * console.log( Base.formatSize( 1024 * 1024 ) );    // => 1.00M
             * console.log( Base.formatSize( 1024 * 1024 * 1024 ) );    // => 1.00G
             * console.log( Base.formatSize( 1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'] ) );    // => 1024MB
             */
            formatSize: function (size, pointLength, units) {
                var unit;

                units = units || ['B', 'K', 'M', 'G', 'TB'];

                while ((unit = units.shift()) && size > 1024) {
                    size = size / 1024;
                }

                return (unit === 'B' ? size : size.toFixed(pointLength || 2)) +
                    unit;
            }
        };
    });
    /**
     * 事件處理類，可以独立使用，也可以擴展给物件使用。
     * @fileOverview Mediator
     */
    define('mediator', [
        'base'
    ], function (Base) {
        var $ = Base.$,
            slice = [].slice,
            separator = /\s+/,
            protos;

        // 根据条件過滤出事件handlers.
        function findHandlers(arr, name, callback, context) {
            return $.grep(arr, function (handler) {
                return handler &&
                    (!name || handler.e === name) &&
                    (!callback || handler.cb === callback ||
                        handler.cb._cb === callback) &&
                    (!context || handler.ctx === context);
            });
        }

        function eachEvent(events, callback, iterator) {
            // 不支持物件，只支持多個event用空格隔开
            $.each((events || '').split(separator), function (_, key) {
                iterator(key, callback);
            });
        }

        function triggerHanders(events, args) {
            var stoped = false,
                i = -1,
                len = events.length,
                handler;

            while (++i < len) {
                handler = events[i];

                if (handler.cb.apply(handler.ctx2, args) === false) {
                    stoped = true;
                    break;
                }
            }

            return !stoped;
        }

        protos = {

            /**
             * 绑定事件。
             *
             * `callback`方法在执行時，arguments將會來源于trigger的時候携带的参數。如
             * ```javascript
             * var obj = {};
             *
             * // 使得obj有事件行為
             * Mediator.installTo( obj );
             *
             * obj.on( 'testa', function( arg1, arg2 ) {
             *     console.log( arg1, arg2 ); // => 'arg1', 'arg2'
             * });
             *
             * obj.trigger( 'testa', 'arg1', 'arg2' );
             * ```
             *
             * 如果`callback`中，某一個方法`return false`了，則後續的其他`callback`都不會被执行到。
             * 切會影响到`trigger`方法的返回值，為`false`。
             *
             * `on`還可以用來添加一個特殊事件`all`, 这样所有的事件触发都會响應到。同時此類`callback`中的arguments有一個不同處，
             * 就是第一個参數為`type`，記录当前是什麼事件在触发。此類`callback`的优先级比脚低，會再正常`callback`执行完後触发。
             * ```javascript
             * obj.on( 'all', function( type, arg1, arg2 ) {
             *     console.log( type, arg1, arg2 ); // => 'testa', 'arg1', 'arg2'
             * });
             * ```
             *
             * @method on
             * @grammar on( name, callback[, context] ) => self
             * @param  {String}   name     事件名，支持多個事件用空格隔开
             * @param  {Function} callback 事件處理器
             * @param  {Object}   [context]  事件處理器的上下文。
             * @return {self} 返回自身，方便链式
             * @chainable
             * @class Mediator
             */
            on: function (name, callback, context) {
                var me = this,
                    set;

                if (!callback) {
                    return this;
                }

                set = this._events || (this._events = []);

                eachEvent(name, callback, function (name, callback) {
                    var handler = { e: name };

                    handler.cb = callback;
                    handler.ctx = context;
                    handler.ctx2 = context || me;
                    handler.id = set.length;

                    set.push(handler);
                });

                return this;
            },

            /**
             * 绑定事件，且当handler执行完後，自動解除绑定。
             * @method once
             * @grammar once( name, callback[, context] ) => self
             * @param  {String}   name     事件名
             * @param  {Function} callback 事件處理器
             * @param  {Object}   [context]  事件處理器的上下文。
             * @return {self} 返回自身，方便链式
             * @chainable
             */
            once: function (name, callback, context) {
                var me = this;

                if (!callback) {
                    return me;
                }

                eachEvent(name, callback, function (name, callback) {
                    var once = function () {
                        me.off(name, once);
                        return callback.apply(context || me, arguments);
                    };

                    once._cb = callback;
                    me.on(name, once, context);
                });

                return me;
            },

            /**
             * 解除事件绑定
             * @method off
             * @grammar off( [name[, callback[, context] ] ] ) => self
             * @param  {String}   [name]     事件名
             * @param  {Function} [callback] 事件處理器
             * @param  {Object}   [context]  事件處理器的上下文。
             * @return {self} 返回自身，方便链式
             * @chainable
             */
            off: function (name, cb, ctx) {
                var events = this._events;

                if (!events) {
                    return this;
                }

                if (!name && !cb && !ctx) {
                    this._events = [];
                    return this;
                }

                eachEvent(name, cb, function (name, cb) {
                    $.each(findHandlers(events, name, cb, ctx), function () {
                        delete events[this.id];
                    });
                });

                return this;
            },

            /**
             * 触发事件
             * @method trigger
             * @grammar trigger( name[, args...] ) => self
             * @param  {String}   type     事件名
             * @param  {*} [...] 任意参數
             * @return {Boolean} 如果handler中return false了，則返回false, 否則返回true
             */
            trigger: function (type) {
                var args, events, allEvents;

                if (!this._events || !type) {
                    return this;
                }

                args = slice.call(arguments, 1);
                events = findHandlers(this._events, type);
                allEvents = findHandlers(this._events, 'all');

                return triggerHanders(events, args) &&
                    triggerHanders(allEvents, arguments);
            }
        };

        /**
         * 中介者，它本身是個单例，但可以通過[installTo](#WebUploader:Mediator:installTo)方法，使任何物件具备事件行為。
         * 主要目的是负责模块與模块之间的合作，降低耦合度。
         *
         * @class Mediator
         */
        return $.extend({

            /**
             * 可以通過这個接口，使任何物件具备事件功能。
             * @method installTo
             * @param  {Object} obj 需要具备事件行為的物件。
             * @return {Object} 返回obj.
             */
            installTo: function (obj) {
                return $.extend(obj, protos);
            }

        }, protos);
    });
    /**
     * @fileOverview Uploader上傳類
     */
    define('uploader', [
        'base',
        'mediator'
    ], function (Base, Mediator) {

        var $ = Base.$;

        /**
         * 上傳入口類。
         * @class Uploader
         * @constructor
         * @grammar new Uploader( opts ) => Uploader
         * @example
         * var uploader = WebUploader.Uploader({
         *     swf: 'path_of_swf/Uploader.swf',
         *
         *     // 开起分片上傳。
         *     chunked: true
         * });
         */
        function Uploader(opts) {
            this.options = $.extend(true, {}, Uploader.options, opts);
            this._init(this.options);
        }

        // default Options
        // widgets中有相應擴展
        Uploader.options = {};
        Mediator.installTo(Uploader.prototype);

        // 批量添加纯命令式方法。
        $.each({
            upload: 'start-upload',
            stop: 'stop-upload',
            getFile: 'get-file',
            getFiles: 'get-files',
            addFile: 'add-file',
            addFiles: 'add-file',
            sort: 'sort-files',
            removeFile: 'remove-file',
            skipFile: 'skip-file',
            retry: 'retry',
            isInProgress: 'is-in-progress',
            makeThumb: 'make-thumb',
            getDimension: 'get-dimension',
            addButton: 'add-btn',
            getRuntimeType: 'get-runtime-type',
            refresh: 'refresh',
            disable: 'disable',
            enable: 'enable',
            reset: 'reset'
        }, function (fn, command) {
            Uploader.prototype[fn] = function () {
                return this.request(command, arguments);
            };
        });

        $.extend(Uploader.prototype, {
            state: 'pending',

            _init: function (opts) {
                var me = this;

                me.request('init', opts, function () {
                    me.state = 'ready';
                    me.trigger('ready');
                });
            },

            /**
             * 取得或者设置Uploader配置项。
             * @method option
             * @grammar option( key ) => *
             * @grammar option( key, val ) => self
             * @example
             *
             * // 初始狀態圖片上傳前不會壓縮
             * var uploader = new WebUploader.Uploader({
             *     resize: null;
             * });
             *
             * // 修改後圖片上傳前，尝试將圖片壓縮到1600 * 1600
             * uploader.options( 'resize', {
             *     width: 1600,
             *     height: 1600
             * });
             */
            option: function (key, val) {
                var opts = this.options;

                // setter
                if (arguments.length > 1) {

                    if ($.isPlainObject(val) &&
                        $.isPlainObject(opts[key])) {
                        $.extend(opts[key], val);
                    } else {
                        opts[key] = val;
                    }

                } else {    // getter
                    return key ? opts[key] : opts;
                }
            },

            /**
             * 取得檔案统计信息。返回一個包含一下信息的物件。
             * * `successNum` 上傳成功的檔案數
             * * `uploadFailNum` 上傳失败的檔案數
             * * `cancelNum` 被删除的檔案數
             * * `invalidNum` 無效的檔案數
             * * `queueNum` 還在隊列中的檔案數
             * @method getStats
             * @grammar getStats() => Object
             */
            getStats: function () {
                // return this._mgr.getStats.apply( this._mgr, arguments );
                var stats = this.request('get-stats');

                return {
                    successNum: stats.numOfSuccess,

                    // who care?
                    // queueFailNum: 0,
                    cancelNum: stats.numOfCancel,
                    invalidNum: stats.numOfInvalid,
                    uploadFailNum: stats.numOfUploadFailed,
                    queueNum: stats.numOfQueue
                };
            },

            // 需要重写此方法來來支持opts.onEvent和instance.onEvent的處理器
            trigger: function (type/*, args...*/) {
                var args = [].slice.call(arguments, 1),
                    opts = this.options,
                    name = 'on' + type.substring(0, 1).toUpperCase() +
                        type.substring(1);

                if (
                    // 調用通過on方法注册的handler.
                    Mediator.trigger.apply(this, arguments) === false ||

                    // 調用opts.onEvent
                    $.isFunction(opts[name]) &&
                    opts[name].apply(this, args) === false ||

                    // 調用this.onEvent
                    $.isFunction(this[name]) &&
                    this[name].apply(this, args) === false ||

                    // 广播所有uploader的事件。
                    Mediator.trigger.apply(Mediator,
                        [this, type].concat(args)) === false) {

                    return false;
                }

                return true;
            },

            // widgets/widget.js將补充此方法的详细文档。
            request: Base.noop
        });

        /**
         * 创建Uploader實例，等同于new Uploader( opts );
         * @method create
         * @class Base
         * @static
         * @grammar Base.create( opts ) => Uploader
         */
        Base.create = Uploader.create = function (opts) {
            return new Uploader(opts);
        };

        // 暴露Uploader，可以通過它來擴展业务逻辑。
        Base.Uploader = Uploader;

        return Uploader;
    });
    /**
     * @fileOverview Runtime管理器，负责Runtime的选择, 连接
     */
    define('runtime/runtime', [
        'base',
        'mediator'
    ], function (Base, Mediator) {

        var $ = Base.$,
            factories = {},

            // 取得物件的第一個key
            getFirstKey = function (obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        return key;
                    }
                }
                return null;
            };

        // 接口類。
        function Runtime(options) {
            this.options = $.extend({
                container: document.body
            }, options);
            this.uid = Base.guid('rt_');
        }

        $.extend(Runtime.prototype, {

            getContainer: function () {
                var opts = this.options,
                    parent, container;

                if (this._container) {
                    return this._container;
                }

                parent = $(opts.container || document.body);
                container = $(document.createElement('div'));

                container.attr('id', 'rt_' + this.uid);
                container.css({
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                });

                parent.append(container);
                parent.addClass('webuploader-container');
                this._container = container;
                return container;
            },

            init: Base.noop,
            exec: Base.noop,

            destroy: function () {
                if (this._container) {
                    this._container.parentNode.removeChild(this.__container);
                }

                this.off();
            }
        });

        Runtime.orders = 'html5,flash';


        /**
         * 添加Runtime實现。
         * @param {String} type    類型
         * @param {Runtime} factory 具體Runtime實现。
         */
        Runtime.addRuntime = function (type, factory) {
            factories[type] = factory;
        };

        Runtime.hasRuntime = function (type) {
            return !!(type ? factories[type] : getFirstKey(factories));
        };

        Runtime.create = function (opts, orders) {
            var type, runtime;

            orders = orders || Runtime.orders;
            $.each(orders.split(/\s*,\s*/g), function () {
                if (factories[this]) {
                    type = this;
                    return false;
                }
            });

            type = type || getFirstKey(factories);

            if (!type) {
                throw new Error('Runtime Error');
            }

            runtime = new factories[type](opts);
            return runtime;
        };

        Mediator.installTo(Runtime.prototype);
        return Runtime;
    });

    /**
     * @fileOverview Runtime管理器，负责Runtime的选择, 连接
     */
    define('runtime/client', [
        'base',
        'mediator',
        'runtime/runtime'
    ], function (Base, Mediator, Runtime) {

        var cache;

        cache = (function () {
            var obj = {};

            return {
                add: function (runtime) {
                    obj[runtime.uid] = runtime;
                },

                get: function (ruid, standalone) {
                    var i;

                    if (ruid) {
                        return obj[ruid];
                    }

                    for (i in obj) {
                        // 有些類型不能重用，比如filepicker.
                        if (standalone && obj[i].__standalone) {
                            continue;
                        }

                        return obj[i];
                    }

                    return null;
                },

                remove: function (runtime) {
                    delete obj[runtime.uid];
                }
            };
        })();

        function RuntimeClient(component, standalone) {
            var deferred = Base.Deferred(),
                runtime;

            this.uid = Base.guid('client_');

            // 允许runtime没有初始化之前，注册一些方法在初始化後执行。
            this.runtimeReady = function (cb) {
                return deferred.done(cb);
            };

            this.connectRuntime = function (opts, cb) {

                // already connected.
                if (runtime) {
                    throw new Error('already connected!');
                }

                deferred.done(cb);

                if (typeof opts === 'string' && cache.get(opts)) {
                    runtime = cache.get(opts);
                }

                // 像filePicker只能独立存在，不能公用。
                runtime = runtime || cache.get(null, standalone);

                // 需要创建
                if (!runtime) {
                    runtime = Runtime.create(opts, opts.runtimeOrder);
                    runtime.__promise = deferred.promise();
                    runtime.once('ready', deferred.resolve);
                    runtime.init();
                    cache.add(runtime);
                    runtime.__client = 1;
                } else {
                    // 來自cache
                    Base.$.extend(runtime.options, opts);
                    runtime.__promise.then(deferred.resolve);
                    runtime.__client++;
                }

                standalone && (runtime.__standalone = standalone);
                return runtime;
            };

            this.getRuntime = function () {
                return runtime;
            };

            this.disconnectRuntime = function () {
                if (!runtime) {
                    return;
                }

                runtime.__client--;

                if (runtime.__client <= 0) {
                    cache.remove(runtime);
                    delete runtime.__promise;
                    runtime.destroy();
                }

                runtime = null;
            };

            this.exec = function () {
                if (!runtime) {
                    return;
                }

                var args = Base.slice(arguments);
                component && args.unshift(component);

                return runtime.exec.apply(this, args);
            };

            this.getRuid = function () {
                return runtime && runtime.uid;
            };

            this.destroy = (function (destroy) {
                return function () {
                    destroy && destroy.apply(this, arguments);
                    this.trigger('destroy');
                    this.off();
                    this.exec('destroy');
                    this.disconnectRuntime();
                };
            })(this.destroy);
        }

        Mediator.installTo(RuntimeClient.prototype);
        return RuntimeClient;
    });
    /**
     * @fileOverview 錯誤信息
     */
    define('lib/dnd', [
        'base',
        'mediator',
        'runtime/client'
    ], function (Base, Mediator, RuntimeClent) {

        var $ = Base.$;

        function DragAndDrop(opts) {
            opts = this.options = $.extend({}, DragAndDrop.options, opts);

            opts.container = $(opts.container);

            if (!opts.container.length) {
                return;
            }

            RuntimeClent.call(this, 'DragAndDrop');
        }

        DragAndDrop.options = {
            accept: null,
            disableGlobalDnd: false
        };

        Base.inherits(RuntimeClent, {
            constructor: DragAndDrop,

            init: function () {
                var me = this;

                me.connectRuntime(me.options, function () {
                    me.exec('init');
                    me.trigger('ready');
                });
            },

            destroy: function () {
                this.disconnectRuntime();
            }
        });

        Mediator.installTo(DragAndDrop.prototype);

        return DragAndDrop;
    });
    /**
     * @fileOverview 组件基類。
     */
    define('widgets/widget', [
        'base',
        'uploader'
    ], function (Base, Uploader) {

        var $ = Base.$,
            _init = Uploader.prototype._init,
            IGNORE = {},
            widgetClass = [];

        function isArrayLike(obj) {
            if (!obj) {
                return false;
            }

            var length = obj.length,
                type = $.type(obj);

            if (obj.nodeType === 1 && length) {
                return true;
            }

            return type === 'array' || type !== 'function' && type !== 'string' &&
                (length === 0 || typeof length === 'number' && length > 0 &&
                    (length - 1) in obj);
        }

        function Widget(uploader) {
            this.owner = uploader;
            this.options = uploader.options;
        }

        $.extend(Widget.prototype, {

            init: Base.noop,

            // 類Backbone的事件监听声明，监听uploader實例上的事件
            // widget直接無法监听事件，事件只能通過uploader來傳递
            invoke: function (apiName, args) {

                /*
                    {
                        'make-thumb': 'makeThumb'
                    }
                 */
                var map = this.responseMap;

                // 如果無API响應声明則忽略
                if (!map || !(apiName in map) || !(map[apiName] in this) ||
                    !$.isFunction(this[map[apiName]])) {

                    return IGNORE;
                }

                return this[map[apiName]].apply(this, args);

            },

            /**
             * 发送命令。当傳入`callback`或者`handler`中返回`promise`時。返回一個当所有`handler`中的promise都完成後完成的新`promise`。
             * @method request
             * @grammar request( command, args ) => * | Promise
             * @grammar request( command, args, callback ) => Promise
             * @for  Uploader
             */
            request: function () {
                return this.owner.request.apply(this.owner, arguments);
            }
        });

        // 擴展Uploader.
        $.extend(Uploader.prototype, {

            // 覆写_init用來初始化widgets
            _init: function () {
                var me = this,
                    widgets = me._widgets = [];

                $.each(widgetClass, function (_, klass) {
                    widgets.push(new klass(me));
                });

                return _init.apply(me, arguments);
            },

            request: function (apiName, args, callback) {
                var i = 0,
                    widgets = this._widgets,
                    len = widgets.length,
                    rlts = [],
                    dfds = [],
                    widget, rlt, promise, key;

                args = isArrayLike(args) ? args : [args];

                for (; i < len; i++) {
                    widget = widgets[i];
                    rlt = widget.invoke(apiName, args);

                    if (rlt !== IGNORE) {

                        // Deferred物件
                        if (Base.isPromise(rlt)) {
                            dfds.push(rlt);
                        } else {
                            rlts.push(rlt);
                        }
                    }
                }

                // 如果有callback，則用異步方式。
                if (callback || dfds.length) {
                    promise = Base.when.apply(Base, dfds);
                    key = promise.pipe ? 'pipe' : 'then';

                    // 很重要不能删除。删除了會死循环。
                    // 保证执行顺序。讓callback总是在下一個tick中执行。
                    return promise[key](function () {
                        var deferred = Base.Deferred(),
                            args = arguments;

                        setTimeout(function () {
                            deferred.resolve.apply(deferred, args);
                        }, 1);

                        return deferred.promise();
                    })[key](callback || Base.noop);
                } else {
                    return rlts[0];
                }
            }
        });

        /**
         * 添加组件
         * @param  {object} widgetProto 组件原型，構造函數通過constructor屬性定义
         * @param  {object} responseMap API名称與函數實现的映射
         * @example
         *     Uploader.register( {
         *         init: function( options ) {},
         *         makeThumb: function() {}
         *     }, {
         *         'make-thumb': 'makeThumb'
         *     } );
         */
        Uploader.register = Widget.register = function (responseMap, widgetProto) {
            var map = { init: 'init' },
                klass;

            if (arguments.length === 1) {
                widgetProto = responseMap;
                widgetProto.responseMap = map;
            } else {
                widgetProto.responseMap = $.extend(map, responseMap);
            }

            klass = Base.inherits(Widget, widgetProto);
            widgetClass.push(klass);

            return klass;
        };

        return Widget;
    });
    /**
     * @fileOverview DragAndDrop Widget。
     */
    define('widgets/filednd', [
        'base',
        'uploader',
        'lib/dnd',
        'widgets/widget'
    ], function (Base, Uploader, Dnd) {
        var $ = Base.$;

        Uploader.options.dnd = '';

        /**
         * @property {Selector} [dnd=undefined]  指定Drag And Drop拖拽的容器，如果不指定，則不启動。
         * @namespace options
         * @for Uploader
         */

        /**
         * @event dndAccept
         * @param {DataTransferItemList} items DataTransferItem
         * @description 阻止此事件可以拒绝某些類型的檔案拖入进來。目前只有 chrome 提供这样的 API，且只能通過 mime-type 验证。
         * @for  Uploader
         */
        return Uploader.register({
            init: function (opts) {

                if (!opts.dnd ||
                    this.request('predict-runtime-type') !== 'html5') {
                    return;
                }

                var me = this,
                    deferred = Base.Deferred(),
                    options = $.extend({}, {
                        disableGlobalDnd: opts.disableGlobalDnd,
                        container: opts.dnd,
                        accept: opts.accept
                    }),
                    dnd;

                dnd = new Dnd(options);

                dnd.once('ready', deferred.resolve);
                dnd.on('drop', function (files) {
                    me.request('add-file', [files]);
                });

                // 检测檔案是否全部允许添加。
                dnd.on('accept', function (items) {
                    return me.owner.trigger('dndAccept', items);
                });

                dnd.init();

                return deferred.promise();
            }
        });
    });

    /**
     * @fileOverview 錯誤信息
     */
    define('lib/filepaste', [
        'base',
        'mediator',
        'runtime/client'
    ], function (Base, Mediator, RuntimeClent) {

        var $ = Base.$;

        function FilePaste(opts) {
            opts = this.options = $.extend({}, opts);
            opts.container = $(opts.container || document.body);
            RuntimeClent.call(this, 'FilePaste');
        }

        Base.inherits(RuntimeClent, {
            constructor: FilePaste,

            init: function () {
                var me = this;

                me.connectRuntime(me.options, function () {
                    me.exec('init');
                    me.trigger('ready');
                });
            },

            destroy: function () {
                this.exec('destroy');
                this.disconnectRuntime();
                this.off();
            }
        });

        Mediator.installTo(FilePaste.prototype);

        return FilePaste;
    });
    /**
     * @fileOverview 组件基類。
     */
    define('widgets/filepaste', [
        'base',
        'uploader',
        'lib/filepaste',
        'widgets/widget'
    ], function (Base, Uploader, FilePaste) {
        var $ = Base.$;

        /**
         * @property {Selector} [paste=undefined]  指定监听paste事件的容器，如果不指定，不启用此功能。此功能為通過粘贴來添加截屏的圖片。建议设置為`document.body`.
         * @namespace options
         * @for Uploader
         */
        return Uploader.register({
            init: function (opts) {

                if (!opts.paste ||
                    this.request('predict-runtime-type') !== 'html5') {
                    return;
                }

                var me = this,
                    deferred = Base.Deferred(),
                    options = $.extend({}, {
                        container: opts.paste,
                        accept: opts.accept
                    }),
                    paste;

                paste = new FilePaste(options);

                paste.once('ready', deferred.resolve);
                paste.on('paste', function (files) {
                    me.owner.request('add-file', [files]);
                });
                paste.init();

                return deferred.promise();
            }
        });
    });
    /**
     * @fileOverview Blob
     */
    define('lib/blob', [
        'base',
        'runtime/client'
    ], function (Base, RuntimeClient) {

        function Blob(ruid, source) {
            var me = this;

            me.source = source;
            me.ruid = ruid;

            RuntimeClient.call(me, 'Blob');

            this.uid = source.uid || this.uid;
            this.type = source.type || '';
            this.size = source.size || 0;

            if (ruid) {
                me.connectRuntime(ruid);
            }
        }

        Base.inherits(RuntimeClient, {
            constructor: Blob,

            slice: function (start, end) {
                return this.exec('slice', start, end);
            },

            getSource: function () {
                return this.source;
            }
        });

        return Blob;
    });
    /**
     * 為了统一化Flash的File和HTML5的File而存在。
     * 以至于要調用Flash里面的File，也可以像調用HTML5版本的File一下。
     * @fileOverview File
     */
    define('lib/file', [
        'base',
        'lib/blob'
    ], function (Base, Blob) {

        var uid = 1,
            rExt = /\.([^.]+)$/;

        function File(ruid, file) {
            var ext;

            Blob.apply(this, arguments);
            this.name = file.name || ('untitled' + uid++);
            ext = rExt.exec(file.name) ? RegExp.$1.toLowerCase() : '';

            // todo 支持其他類型檔案的转换。

            // 如果有mimetype, 但是檔案名里面没有找出後缀规律
            if (!ext && this.type) {
                ext = /\/(jpg|jpeg|png|gif|bmp)$/i.exec(this.type) ?
                    RegExp.$1.toLowerCase() : '';
                this.name += '.' + ext;
            }

            // 如果没有指定mimetype, 但是知道檔案後缀。
            if (!this.type && ~'jpg,jpeg,png,gif,bmp'.indexOf(ext)) {
                this.type = 'image/' + (ext === 'jpg' ? 'jpeg' : ext);
            }

            this.ext = ext;
            this.lastModifiedDate = file.lastModifiedDate ||
                (new Date()).toLocaleString();
        }

        return Base.inherits(Blob, File);
    });

    /**
     * @fileOverview 錯誤信息
     */
    define('lib/filepicker', [
        'base',
        'runtime/client',
        'lib/file'
    ], function (Base, RuntimeClent, File) {

        var $ = Base.$;

        function FilePicker(opts) {
            opts = this.options = $.extend({}, FilePicker.options, opts);

            opts.container = $(opts.id);

            if (!opts.container.length) {
                throw new Error('按钮指定錯誤');
            }

            opts.innerHTML = opts.innerHTML || opts.label ||
                opts.container.html() || '';

            opts.button = $(opts.button || document.createElement('div'));
            opts.button.html(opts.innerHTML);
            opts.container.html(opts.button);

            RuntimeClent.call(this, 'FilePicker', true);
        }

        FilePicker.options = {
            button: null,
            container: null,
            label: null,
            innerHTML: null,
            multiple: true,
            accept: null,
            name: 'file'
        };

        Base.inherits(RuntimeClent, {
            constructor: FilePicker,

            init: function () {
                var me = this,
                    opts = me.options,
                    button = opts.button;

                button.addClass('webuploader-pick');

                me.on('all', function (type) {
                    var files;

                    switch (type) {
                        case 'mouseenter':
                            button.addClass('webuploader-pick-hover');
                            break;

                        case 'mouseleave':
                            button.removeClass('webuploader-pick-hover');
                            break;

                        case 'change':
                            files = me.exec('getFiles');
                            me.trigger('select', $.map(files, function (file) {
                                file = new File(me.getRuid(), file);

                                // 記录來源。
                                file._refer = opts.container;
                                return file;
                            }), opts.container);
                            break;
                    }
                });

                me.connectRuntime(opts, function () {
                    me.refresh();
                    me.exec('init', opts);
                    me.trigger('ready');
                });

                $(window).on('resize', function () {
                    me.refresh();
                });
            },

            refresh: function () {
                var shimContainer = this.getRuntime().getContainer(),
                    button = this.options.button,
                    width = button.outerWidth ?
                        button.outerWidth() : button.width(),

                    height = button.outerHeight ?
                        button.outerHeight() : button.height(),

                    pos = button.offset();

                width && height && shimContainer.css({
                    bottom: 'auto',
                    right: 'auto',
                    width: width + 'px',
                    height: height + 'px'
                }).offset(pos);
            },

            enable: function () {
                var btn = this.options.button;

                btn.removeClass('webuploader-pick-disable');
                this.refresh();
            },

            disable: function () {
                var btn = this.options.button;

                this.getRuntime().getContainer().css({
                    top: '-99999px'
                });

                btn.addClass('webuploader-pick-disable');
            },

            destroy: function () {
                if (this.runtime) {
                    this.exec('destroy');
                    this.disconnectRuntime();
                }
            }
        });

        return FilePicker;
    });

    /**
     * @fileOverview 檔案选择相關
     */
    define('widgets/filepicker', [
        'base',
        'uploader',
        'lib/filepicker',
        'widgets/widget'
    ], function (Base, Uploader, FilePicker) {
        var $ = Base.$;

        $.extend(Uploader.options, {

            /**
             * @property {Selector | Object} [pick=undefined]
             * @namespace options
             * @for Uploader
             * @description 指定选择檔案的按钮容器，不指定則不创建按钮。
             *
             * * `id` {Seletor} 指定选择檔案的按钮容器，不指定則不创建按钮。
             * * `label` {String} 請采用 `innerHTML` 代替
             * * `innerHTML` {String} 指定按钮文字。不指定時优先从指定的容器中看是否自带文字。
             * * `multiple` {Boolean} 是否开起同時选择多個檔案能力。
             */
            pick: null,

            /**
             * @property {Arroy} [accept=null]
             * @namespace options
             * @for Uploader
             * @description 指定接受哪些類型的檔案。 由于目前還有ext转mimeType表，所以这里需要分开指定。
             *
             * * `title` {String} 文字描述
             * * `extensions` {String} 允许的檔案後缀，不带点，多個用逗号分割。
             * * `mimeTypes` {String} 多個用逗号分割。
             *
             * 如：
             *
             * ```
             * {
             *     title: 'Images',
             *     extensions: 'gif,jpg,jpeg,bmp,png',
             *     mimeTypes: 'image/*'
             * }
             * ```
             */
            accept: null/*{
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }*/
        });

        return Uploader.register({
            'add-btn': 'addButton',
            refresh: 'refresh',
            disable: 'disable',
            enable: 'enable'
        }, {

            init: function (opts) {
                this.pickers = [];
                return opts.pick && this.addButton(opts.pick);
            },

            refresh: function () {
                $.each(this.pickers, function () {
                    this.refresh();
                });
            },

            /**
             * @method addButton
             * @for Uploader
             * @grammar addButton( pick ) => Promise
             * @description
             * 添加檔案选择按钮，如果一個按钮不够，需要調用此方法來添加。参數跟[options.pick](#WebUploader:Uploader:options)一致。
             * @example
             * uploader.addButton({
             *     id: '#btnContainer',
             *     innerHTML: '选择檔案'
             * });
             */
            addButton: function (pick) {
                var me = this,
                    opts = me.options,
                    accept = opts.accept,
                    options, picker, deferred;

                if (!pick) {
                    return;
                }

                deferred = Base.Deferred();
                $.isPlainObject(pick) || (pick = {
                    id: pick
                });

                options = $.extend({}, pick, {
                    accept: $.isPlainObject(accept) ? [accept] : accept,
                    swf: opts.swf,
                    runtimeOrder: opts.runtimeOrder
                });

                picker = new FilePicker(options);

                picker.once('ready', deferred.resolve);
                picker.on('select', function (files) {
                    me.owner.request('add-file', [files]);
                });
                picker.init();

                this.pickers.push(picker);

                return deferred.promise();
            },

            disable: function () {
                $.each(this.pickers, function () {
                    this.disable();
                });
            },

            enable: function () {
                $.each(this.pickers, function () {
                    this.enable();
                });
            }
        });
    });
    /**
     * @fileOverview Image
     */
    define('lib/image', [
        'base',
        'runtime/client',
        'lib/blob'
    ], function (Base, RuntimeClient, Blob) {
        var $ = Base.$;

        // 構造器。
        function Image(opts) {
            this.options = $.extend({}, Image.options, opts);
            RuntimeClient.call(this, 'Image');

            this.on('load', function () {
                this._info = this.exec('info');
                this._meta = this.exec('meta');
            });
        }

        // 默认选项。
        Image.options = {

            // 默认的圖片處理质量
            quality: 90,

            // 是否裁剪
            crop: false,

            // 是否保留头部信息
            preserveHeaders: true,

            // 是否允许放大。
            allowMagnify: true
        };

        // 繼承RuntimeClient.
        Base.inherits(RuntimeClient, {
            constructor: Image,

            info: function (val) {

                // setter
                if (val) {
                    this._info = val;
                    return this;
                }

                // getter
                return this._info;
            },

            meta: function (val) {

                // setter
                if (val) {
                    this._meta = val;
                    return this;
                }

                // getter
                return this._meta;
            },

            loadFromBlob: function (blob) {
                var me = this,
                    ruid = blob.getRuid();

                this.connectRuntime(ruid, function () {
                    me.exec('init', me.options);
                    me.exec('loadFromBlob', blob);
                });
            },

            resize: function () {
                var args = Base.slice(arguments);
                return this.exec.apply(this, ['resize'].concat(args));
            },

            getAsDataUrl: function (type) {
                return this.exec('getAsDataUrl', type);
            },

            getAsBlob: function (type) {
                var blob = this.exec('getAsBlob', type);

                return new Blob(this.getRuid(), blob);
            }
        });

        return Image;
    });
    /**
     * @fileOverview 圖片操作, 负责預覽圖片和上傳前壓縮圖片
     */
    define('widgets/image', [
        'base',
        'uploader',
        'lib/image',
        'widgets/widget'
    ], function (Base, Uploader, Image) {

        var $ = Base.$,
            throttle;

        // 根据要處理的檔案大小來節流，一次不能處理太多，會卡。
        throttle = (function (max) {
            var occupied = 0,
                waiting = [],
                tick = function () {
                    var item;

                    while (waiting.length && occupied < max) {
                        item = waiting.shift();
                        occupied += item[0];
                        item[1]();
                    }
                };

            return function (emiter, size, cb) {
                waiting.push([size, cb]);
                emiter.once('destroy', function () {
                    occupied -= size;
                    setTimeout(tick, 1);
                });
                setTimeout(tick, 1);
            };
        })(5 * 1024 * 1024);

        $.extend(Uploader.options, {

            /**
             * @property {Object} [thumb]
             * @namespace options
             * @for Uploader
             * @description 配置生成縮略圖的选项。
             *
             * 默认為：
             *
             * ```javascript
             * {
             *     width: 110,
             *     height: 110,
             *
             *     // 圖片质量，只有type為`image/jpeg`的時候才有效。
             *     quality: 70,
             *
             *     // 是否允许放大，如果想要生成小圖的時候不失真，此选项應该设置為false.
             *     allowMagnify: true,
             *
             *     // 是否允许裁剪。
             *     crop: true,
             *
             *     // 是否保留头部meta信息。
             *     preserveHeaders: false,
             *
             *     // 為空的话則保留原有圖片格式。
             *     // 否則强制转换成指定的類型。
             *     type: 'image/jpeg'
             * }
             * ```
             */
            thumb: {
                width: 110,
                height: 110,
                quality: 70,
                allowMagnify: true,
                crop: true,
                preserveHeaders: false,

                // 為空的话則保留原有圖片格式。
                // 否則强制转换成指定的類型。
                // IE 8下面 base64 大小不能超過 32K 否則預覽失败，而非 jpeg 编码的圖片很可
                // 能會超過 32k, 所以这里设置成預覽的時候都是 image/jpeg
                type: 'image/jpeg'
            },

            /**
             * @property {Object} [compress]
             * @namespace options
             * @for Uploader
             * @description 配置壓縮的圖片的选项。如果此选项為`false`, 則圖片在上傳前不进行壓縮。
             *
             * 默认為：
             *
             * ```javascript
             * {
             *     width: 1600,
             *     height: 1600,
             *
             *     // 圖片质量，只有type為`image/jpeg`的時候才有效。
             *     quality: 90,
             *
             *     // 是否允许放大，如果想要生成小圖的時候不失真，此选项應该设置為false.
             *     allowMagnify: false,
             *
             *     // 是否允许裁剪。
             *     crop: false,
             *
             *     // 是否保留头部meta信息。
             *     preserveHeaders: true
             * }
             * ```
             */
            compress: {
                width: 1600,
                height: 1600,
                quality: 90,
                allowMagnify: false,
                crop: false,
                preserveHeaders: true
            }
        });

        return Uploader.register({
            'make-thumb': 'makeThumb',
            'before-send-file': 'compressImage'
        }, {


            /**
             * 生成縮略圖，此過程為異步，所以需要傳入`callback`。
             * 通常情况在圖片加入隊裡後調用此方法來生成預覽圖以增强交互效果。
             *
             * `callback`中可以接收到兩個参數。
             * * 第一個為error，如果生成縮略圖有錯誤，此error將為真。
             * * 第二個為ret, 縮略圖的Data URL值。
             *
             * **注意**
             * Date URL在IE6/7中不支持，所以不用調用此方法了，直接顯示一張暫不支持預覽圖片好了。
             *
             *
             * @method makeThumb
             * @grammar makeThumb( file, callback ) => undefined
             * @grammar makeThumb( file, callback, width, height ) => undefined
             * @for Uploader
             * @example
             *
             * uploader.on( 'fileQueued', function( file ) {
             *     var $li = ...;
             *
             *     uploader.makeThumb( file, function( error, ret ) {
             *         if ( error ) {
             *             $li.text('預覽錯誤');
             *         } else {
             *             $li.append('<img alt="" src="' + ret + '" />');
             *         }
             *     });
             *
             * });
             */
            makeThumb: function (file, cb, width, height) {
                var opts, image;

                file = this.request('get-file', file);

                // 只預覽圖片格式。
                if (!file.type.match(/^image/)) {
                    cb(true);
                    return;
                }

                opts = $.extend({}, this.options.thumb);

                // 如果傳入的是object.
                if ($.isPlainObject(width)) {
                    opts = $.extend(opts, width);
                    width = null;
                }

                width = width || opts.width;
                height = height || opts.height;

                image = new Image(opts);

                image.once('load', function () {
                    file._info = file._info || image.info();
                    file._meta = file._meta || image.meta();
                    image.resize(width, height);
                });

                image.once('complete', function () {
                    cb(false, image.getAsDataUrl(opts.type));
                    image.destroy();
                });

                image.once('error', function () {
                    cb(true);
                    image.destroy();
                });

                throttle(image, file.source.size, function () {
                    file._info && image.info(file._info);
                    file._meta && image.meta(file._meta);
                    image.loadFromBlob(file.source);
                });
            },

            compressImage: function (file) {
                var opts = this.options.compress || this.options.resize,
                    compressSize = opts && opts.compressSize || 300 * 1024,
                    image, deferred;

                file = this.request('get-file', file);

                // 只預覽圖片格式。
                if (!opts || !~'image/jpeg,image/jpg'.indexOf(file.type) ||
                    file.size < compressSize ||
                    file._compressed) {
                    return;
                }

                opts = $.extend({}, opts);
                deferred = Base.Deferred();

                image = new Image(opts);

                deferred.always(function () {
                    image.destroy();
                    image = null;
                });
                image.once('error', deferred.reject);
                image.once('load', function () {
                    file._info = file._info || image.info();
                    file._meta = file._meta || image.meta();
                    image.resize(opts.width, opts.height);
                });

                image.once('complete', function () {
                    var blob, size;

                    // 移動端 UC / qq 瀏覽器的無圖模式下
                    // ctx.getImageData 處理大圖的時候會報 Exception
                    // INDEX_SIZE_ERR: DOM Exception 1
                    try {
                        blob = image.getAsBlob(opts.type);

                        size = file.size;

                        // 如果壓縮後，比原來還大則不用壓縮後的。
                        if (blob.size < size) {
                            // file.source.destroy && file.source.destroy();
                            file.source = blob;
                            file.size = blob.size;

                            file.trigger('resize', blob.size, size);
                        }

                        // 標記，避免重複壓縮。
                        file._compressed = true;
                        deferred.resolve();
                    } catch (e) {
                        // 出錯了直接繼續，讓其上傳原始圖片
                        deferred.resolve();
                    }
                });

                file._info && image.info(file._info);
                file._meta && image.meta(file._meta);

                image.loadFromBlob(file.source);
                return deferred.promise();
            }
        });
    });
    /**
     * @fileOverview 檔案屬性封装
     */
    define('file', [
        'base',
        'mediator'
    ], function (Base, Mediator) {

        var $ = Base.$,
            idPrefix = 'WU_FILE_',
            idSuffix = 0,
            rExt = /\.([^.]+)$/,
            statusMap = {};

        function gid() {
            return idPrefix + idSuffix++;
        }

        /**
         * 檔案類
         * @class File
         * @constructor 構造函數
         * @grammar new File( source ) => File
         * @param {Lib.File} source [lib.File](#Lib.File)實例, 此source物件是带有Runtime信息的。
         */
        function WUFile(source) {

            /**
             * 檔案名，包括擴展名（後缀）
             * @property name
             * @type {string}
             */
            this.name = source.name || 'Untitled';

            /**
             * 檔案體積（字節）
             * @property size
             * @type {uint}
             * @default 0
             */
            this.size = source.size || 0;

            /**
             * 檔案MIMETYPE類型，與檔案類型的對應關係請参考[http://t.cn/z8ZnFny](http://t.cn/z8ZnFny)
             * @property type
             * @type {string}
             * @default 'application'
             */
            this.type = source.type || 'application';

            /**
             * 檔案最後修改日期
             * @property lastModifiedDate
             * @type {int}
             * @default 当前時间戳
             */
            this.lastModifiedDate = source.lastModifiedDate || (new Date() * 1);

            /**
             * 檔案ID，每個物件具有唯一ID，與檔案名無關
             * @property id
             * @type {string}
             */
            this.id = gid();

            /**
             * 檔案擴展名，通過檔案名取得，例如test.png的擴展名為png
             * @property ext
             * @type {string}
             */
            this.ext = rExt.exec(this.name) ? RegExp.$1 : '';


            /**
             * 狀態文字说明。在不同的status语境下有不同的用途。
             * @property statusText
             * @type {string}
             */
            this.statusText = '';

            // 存储檔案狀態，防止通過屬性直接修改
            statusMap[this.id] = WUFile.Status.INITED;

            this.source = source;
            this.loaded = 0;

            this.on('error', function (msg) {
                this.setStatus(WUFile.Status.ERROR, msg);
            });
        }

        $.extend(WUFile.prototype, {

            /**
             * 设置狀態，狀態变化時會触发`change`事件。
             * @method setStatus
             * @grammar setStatus( status[, statusText] );
             * @param {File.Status|String} status [檔案狀態值](#WebUploader:File:File.Status)
             * @param {String} [statusText=''] 狀態说明，常在error時使用，用http, abort,server等來標記是由于什麼原因导致檔案錯誤。
             */
            setStatus: function (status, text) {

                var prevStatus = statusMap[this.id];

                typeof text !== 'undefined' && (this.statusText = text);

                if (status !== prevStatus) {
                    statusMap[this.id] = status;
                    /**
                     * 檔案狀態变化
                     * @event statuschange
                     */
                    this.trigger('statuschange', status, prevStatus);
                }

            },

            /**
             * 取得檔案狀態
             * @return {File.Status}
             * @example
                     檔案狀態具體包括以下几种類型：
                     {
                         // 初始化
                        INITED:     0,
                        // 已入隊列
                        QUEUED:     1,
                        // 正在上傳
                        PROGRESS:     2,
                        // 上傳出錯
                        ERROR:         3,
                        // 上傳成功
                        COMPLETE:     4,
                        // 上傳取消
                        CANCELLED:     5
                    }
             */
            getStatus: function () {
                return statusMap[this.id];
            },

            /**
             * 取得檔案原始信息。
             * @return {*}
             */
            getSource: function () {
                return this.source;
            },

            destory: function () {
                delete statusMap[this.id];
            }
        });

        Mediator.installTo(WUFile.prototype);

        /**
         * 檔案狀態值，具體包括以下几种類型：
         * * `inited` 初始狀態
         * * `queued` 已经进入隊列, 等待上傳
         * * `progress` 上傳中
         * * `complete` 上傳完成。
         * * `error` 上傳出錯，可重试
         * * `interrupt` 上傳中断，可續傳。
         * * `invalid` 檔案不合格，不能重试上傳。會自動从隊列中移除。
         * * `cancelled` 檔案被移除。
         * @property {Object} Status
         * @namespace File
         * @class File
         * @static
         */
        WUFile.Status = {
            INITED: 'inited',    // 初始狀態
            QUEUED: 'queued',    // 已经进入隊列, 等待上傳
            PROGRESS: 'progress',    // 上傳中
            ERROR: 'error',    // 上傳出錯，可重试
            COMPLETE: 'complete',    // 上傳完成。
            CANCELLED: 'cancelled',    // 上傳取消。
            INTERRUPT: 'interrupt',    // 上傳中断，可續傳。
            INVALID: 'invalid'    // 檔案不合格，不能重试上傳。
        };

        return WUFile;
    });

    /**
     * @fileOverview 檔案隊列
     */
    define('queue', [
        'base',
        'mediator',
        'file'
    ], function (Base, Mediator, WUFile) {

        var $ = Base.$,
            STATUS = WUFile.Status;

        /**
         * 檔案隊列, 用來存储各個狀態中的檔案。
         * @class Queue
         * @extends Mediator
         */
        function Queue() {

            /**
             * 统计檔案數。
             * * `numOfQueue` 隊列中的檔案數。
             * * `numOfSuccess` 上傳成功的檔案數
             * * `numOfCancel` 被移除的檔案數
             * * `numOfProgress` 正在上傳中的檔案數
             * * `numOfUploadFailed` 上傳錯誤的檔案數。
             * * `numOfInvalid` 無效的檔案數。
             * @property {Object} stats
             */
            this.stats = {
                numOfQueue: 0,
                numOfSuccess: 0,
                numOfCancel: 0,
                numOfProgress: 0,
                numOfUploadFailed: 0,
                numOfInvalid: 0
            };

            // 上傳隊列，仅包括等待上傳的檔案
            this._queue = [];

            // 存储所有檔案
            this._map = {};
        }

        $.extend(Queue.prototype, {

            /**
             * 將新檔案加入對隊列尾部
             *
             * @method append
             * @param  {File} file   檔案物件
             */
            append: function (file) {
                this._queue.push(file);
                this._fileAdded(file);
                return this;
            },

            /**
             * 將新檔案加入對隊列头部
             *
             * @method prepend
             * @param  {File} file   檔案物件
             */
            prepend: function (file) {
                this._queue.unshift(file);
                this._fileAdded(file);
                return this;
            },

            /**
             * 取得檔案物件
             *
             * @method getFile
             * @param  {String} fileId   檔案ID
             * @return {File}
             */
            getFile: function (fileId) {
                if (typeof fileId !== 'string') {
                    return fileId;
                }
                return this._map[fileId];
            },

            /**
             * 从隊列中取出一個指定狀態的檔案。
             * @grammar fetch( status ) => File
             * @method fetch
             * @param {String} status [檔案狀態值](#WebUploader:File:File.Status)
             * @return {File} [File](#WebUploader:File)
             */
            fetch: function (status) {
                var len = this._queue.length,
                    i, file;

                status = status || STATUS.QUEUED;

                for (i = 0; i < len; i++) {
                    file = this._queue[i];

                    if (status === file.getStatus()) {
                        return file;
                    }
                }

                return null;
            },

            /**
             * 對隊列进行排序，能够控制檔案上傳顺序。
             * @grammar sort( fn ) => undefined
             * @method sort
             * @param {Function} fn 排序方法
             */
            sort: function (fn) {
                if (typeof fn === 'function') {
                    this._queue.sort(fn);
                }
            },

            /**
             * 取得指定類型的檔案列表, 列表中每一個成员為[File](#WebUploader:File)物件。
             * @grammar getFiles( [status1[, status2 ...]] ) => Array
             * @method getFiles
             * @param {String} [status] [檔案狀態值](#WebUploader:File:File.Status)
             */
            getFiles: function () {
                var sts = [].slice.call(arguments, 0),
                    ret = [],
                    i = 0,
                    len = this._queue.length,
                    file;

                for (; i < len; i++) {
                    file = this._queue[i];

                    if (sts.length && !~$.inArray(file.getStatus(), sts)) {
                        continue;
                    }

                    ret.push(file);
                }

                return ret;
            },

            _fileAdded: function (file) {
                var me = this,
                    existing = this._map[file.id];

                if (!existing) {
                    this._map[file.id] = file;

                    file.on('statuschange', function (cur, pre) {
                        me._onFileStatusChange(cur, pre);
                    });
                }

                file.setStatus(STATUS.QUEUED);
            },

            _onFileStatusChange: function (curStatus, preStatus) {
                var stats = this.stats;

                switch (preStatus) {
                    case STATUS.PROGRESS:
                        stats.numOfProgress--;
                        break;

                    case STATUS.QUEUED:
                        stats.numOfQueue--;
                        break;

                    case STATUS.ERROR:
                        stats.numOfUploadFailed--;
                        break;

                    case STATUS.INVALID:
                        stats.numOfInvalid--;
                        break;
                }

                switch (curStatus) {
                    case STATUS.QUEUED:
                        stats.numOfQueue++;
                        break;

                    case STATUS.PROGRESS:
                        stats.numOfProgress++;
                        break;

                    case STATUS.ERROR:
                        stats.numOfUploadFailed++;
                        break;

                    case STATUS.COMPLETE:
                        stats.numOfSuccess++;
                        break;

                    case STATUS.CANCELLED:
                        stats.numOfCancel++;
                        break;

                    case STATUS.INVALID:
                        stats.numOfInvalid++;
                        break;
                }
            }

        });

        Mediator.installTo(Queue.prototype);

        return Queue;
    });
    /**
     * @fileOverview 隊列
     */
    define('widgets/queue', [
        'base',
        'uploader',
        'queue',
        'file',
        'lib/file',
        'runtime/client',
        'widgets/widget'
    ], function (Base, Uploader, Queue, WUFile, File, RuntimeClient) {

        var $ = Base.$,
            rExt = /\.\w+$/,
            Status = WUFile.Status;

        return Uploader.register({
            'sort-files': 'sortFiles',
            'add-file': 'addFiles',
            'get-file': 'getFile',
            'fetch-file': 'fetchFile',
            'get-stats': 'getStats',
            'get-files': 'getFiles',
            'remove-file': 'removeFile',
            'retry': 'retry',
            'reset': 'reset',
            'accept-file': 'acceptFile'
        }, {

            init: function (opts) {
                var me = this,
                    deferred, len, i, item, arr, accept, runtime;

                if ($.isPlainObject(opts.accept)) {
                    opts.accept = [opts.accept];
                }

                // accept中的中生成匹配正則。
                if (opts.accept) {
                    arr = [];

                    for (i = 0, len = opts.accept.length; i < len; i++) {
                        item = opts.accept[i].extensions;
                        item && arr.push(item);
                    }

                    if (arr.length) {
                        accept = '\\.' + arr.join(',')
                            .replace(/,/g, '$|\\.')
                            .replace(/\*/g, '.*') + '$';
                    }

                    me.accept = new RegExp(accept, 'i');
                }

                me.queue = new Queue();
                me.stats = me.queue.stats;

                // 如果当前不是html5运行時，那就算了。
                // 不执行後續操作
                if (this.request('predict-runtime-type') !== 'html5') {
                    return;
                }

                // 创建一個 html5 运行時的 placeholder
                // 以至于外部添加原生 File 物件的時候能正确包裹一下供 webuploader 使用。
                deferred = Base.Deferred();
                runtime = new RuntimeClient('Placeholder');
                runtime.connectRuntime({
                    runtimeOrder: 'html5'
                }, function () {
                    me._ruid = runtime.getRuid();
                    deferred.resolve();
                });
                return deferred.promise();
            },


            // 為了支持外部直接添加一個原生File物件。
            _wrapFile: function (file) {
                if (!(file instanceof WUFile)) {

                    if (!(file instanceof File)) {
                        if (!this._ruid) {
                            throw new Error('Can\'t add external files.');
                        }
                        file = new File(this._ruid, file);
                    }

                    file = new WUFile(file);
                }

                return file;
            },

            // 判断檔案是否可以被加入隊列
            acceptFile: function (file) {
                var invalid = !file || file.size < 6 || this.accept &&

                    // 如果名字中有後缀，才做後缀白名单處理。
                    rExt.exec(file.name) && !this.accept.test(file.name);

                return !invalid;
            },


            /**
             * @event beforeFileQueued
             * @param {File} file File物件
             * @description 当檔案被加入隊列之前触发，此事件的handler返回值為`false`，則此檔案不會被添加进入隊列。
             * @for  Uploader
             */

            /**
             * @event fileQueued
             * @param {File} file File物件
             * @description 当檔案被加入隊列以後触发。
             * @for  Uploader
             */

            _addFile: function (file) {
                var me = this;

                file = me._wrapFile(file);

                // 不過類型判断允许不允许，先派送 `beforeFileQueued`
                if (!me.owner.trigger('beforeFileQueued', file)) {
                    return;
                }

                // 類型不匹配，則派送錯誤事件，并返回。
                if (!me.acceptFile(file)) {
                    me.owner.trigger('error', 'Q_TYPE_DENIED', file);
                    return;
                }

                me.queue.append(file);
                me.owner.trigger('fileQueued', file);
                return file;
            },

            getFile: function (fileId) {
                return this.queue.getFile(fileId);
            },

            /**
             * @event filesQueued
             * @param {File} files 數组，内容為原始File(lib/File）物件。
             * @description 当一批檔案添加进隊列以後触发。
             * @for  Uploader
             */

            /**
             * @method addFiles
             * @grammar addFiles( file ) => undefined
             * @grammar addFiles( [file1, file2 ...] ) => undefined
             * @param {Array of File or File} [files] Files 物件 數组
             * @description 添加檔案到隊列
             * @for  Uploader
             */
            addFiles: function (files) {
                var me = this;

                if (!files.length) {
                    files = [files];
                }

                files = $.map(files, function (file) {
                    return me._addFile(file);
                });

                me.owner.trigger('filesQueued', files);

                if (me.options.auto) {
                    me.request('start-upload');
                }
            },

            getStats: function () {
                return this.stats;
            },

            /**
             * @event fileDequeued
             * @param {File} file File物件
             * @description 当檔案被移除隊列後触发。
             * @for  Uploader
             */

            /**
             * @method removeFile
             * @grammar removeFile( file ) => undefined
             * @grammar removeFile( id ) => undefined
             * @param {File|id} file File物件或这File物件的id
             * @description 移除某一檔案。
             * @for  Uploader
             * @example
             *
             * $li.on('click', '.remove-this', function() {
             *     uploader.removeFile( file );
             * })
             */
            removeFile: function (file) {
                var me = this;

                file = file.id ? file : me.queue.getFile(file);

                file.setStatus(Status.CANCELLED);
                me.owner.trigger('fileDequeued', file);
            },

            /**
             * @method getFiles
             * @grammar getFiles() => Array
             * @grammar getFiles( status1, status2, status... ) => Array
             * @description 返回指定狀態的檔案集合，不傳参數將返回所有狀態的檔案。
             * @for  Uploader
             * @example
             * console.log( uploader.getFiles() );    // => all files
             * console.log( uploader.getFiles('error') )    // => all error files.
             */
            getFiles: function () {
                return this.queue.getFiles.apply(this.queue, arguments);
            },

            fetchFile: function () {
                return this.queue.fetch.apply(this.queue, arguments);
            },

            /**
             * @method retry
             * @grammar retry() => undefined
             * @grammar retry( file ) => undefined
             * @description 重试上傳，重试指定檔案，或者从出錯的檔案开始重新上傳。
             * @for  Uploader
             * @example
             * function retry() {
             *     uploader.retry();
             * }
             */
            retry: function (file, noForceStart) {
                var me = this,
                    files, i, len;

                if (file) {
                    file = file.id ? file : me.queue.getFile(file);
                    file.setStatus(Status.QUEUED);
                    noForceStart || me.request('start-upload');
                    return;
                }

                files = me.queue.getFiles(Status.ERROR);
                i = 0;
                len = files.length;

                for (; i < len; i++) {
                    file = files[i];
                    file.setStatus(Status.QUEUED);
                }

                me.request('start-upload');
            },

            /**
             * @method sort
             * @grammar sort( fn ) => undefined
             * @description 排序隊列中的檔案，在上傳之前調整可以控制上傳顺序。
             * @for  Uploader
             */
            sortFiles: function () {
                return this.queue.sort.apply(this.queue, arguments);
            },

            /**
             * @method reset
             * @grammar reset() => undefined
             * @description 重置uploader。目前只重置了隊列。
             * @for  Uploader
             * @example
             * uploader.reset();
             */
            reset: function () {
                this.queue = new Queue();
                this.stats = this.queue.stats;
            }
        });

    });
    /**
     * @fileOverview 添加取得Runtime相關信息的方法。
     */
    define('widgets/runtime', [
        'uploader',
        'runtime/runtime',
        'widgets/widget'
    ], function (Uploader, Runtime) {

        Uploader.support = function () {
            return Runtime.hasRuntime.apply(Runtime, arguments);
        };

        return Uploader.register({
            'predict-runtime-type': 'predictRuntmeType'
        }, {

            init: function () {
                if (!this.predictRuntmeType()) {
                    throw Error('Runtime Error');
                }
            },

            /**
             * 预测Uploader將采用哪個`Runtime`
             * @grammar predictRuntmeType() => String
             * @method predictRuntmeType
             * @for  Uploader
             */
            predictRuntmeType: function () {
                var orders = this.options.runtimeOrder || Runtime.orders,
                    type = this.type,
                    i, len;

                if (!type) {
                    orders = orders.split(/\s*,\s*/g);

                    for (i = 0, len = orders.length; i < len; i++) {
                        if (Runtime.hasRuntime(orders[i])) {
                            this.type = type = orders[i];
                            break;
                        }
                    }
                }

                return type;
            }
        });
    });
    /**
     * @fileOverview Transport
     */
    define('lib/transport', [
        'base',
        'runtime/client',
        'mediator'
    ], function (Base, RuntimeClient, Mediator) {

        var $ = Base.$;

        function Transport(opts) {
            var me = this;

            opts = me.options = $.extend(true, {}, Transport.options, opts || {});
            RuntimeClient.call(this, 'Transport');

            this._blob = null;
            this._formData = opts.formData || {};
            this._headers = opts.headers || {};

            this.on('progress', this._timeout);
            this.on('load error', function () {
                me.trigger('progress', 1);
                clearTimeout(me._timer);
            });
        }

        Transport.options = {
            server: '',
            method: 'POST',

            // 跨域時，是否允许携带cookie, 只有html5 runtime才有效
            withCredentials: false,
            fileVal: 'file',
            timeout: 2 * 60 * 1000,    // 2分钟
            formData: {},
            headers: {},
            sendAsBinary: false
        };

        $.extend(Transport.prototype, {

            // 添加Blob, 只能添加一次，最後一次有效。
            appendBlob: function (key, blob, filename) {
                var me = this,
                    opts = me.options;

                if (me.getRuid()) {
                    me.disconnectRuntime();
                }

                // 连接到blob归屬的同一個runtime.
                me.connectRuntime(blob.ruid, function () {
                    me.exec('init');
                });

                me._blob = blob;
                opts.fileVal = key || opts.fileVal;
                opts.filename = filename || opts.filename;
            },

            // 添加其他字段
            append: function (key, value) {
                if (typeof key === 'object') {
                    $.extend(this._formData, key);
                } else {
                    this._formData[key] = value;
                }
            },

            setRequestHeader: function (key, value) {
                if (typeof key === 'object') {
                    $.extend(this._headers, key);
                } else {
                    this._headers[key] = value;
                }
            },

            send: function (method) {
                this.exec('send', method);
                this._timeout();
            },

            abort: function () {
                clearTimeout(this._timer);
                return this.exec('abort');
            },

            destroy: function () {
                this.trigger('destroy');
                this.off();
                this.exec('destroy');
                this.disconnectRuntime();
            },

            getResponse: function () {
                return this.exec('getResponse');
            },

            getResponseAsJson: function () {
                return this.exec('getResponseAsJson');
            },

            getStatus: function () {
                return this.exec('getStatus');
            },

            _timeout: function () {
                var me = this,
                    duration = me.options.timeout;

                if (!duration) {
                    return;
                }

                clearTimeout(me._timer);
                me._timer = setTimeout(function () {
                    me.abort();
                    me.trigger('error', 'timeout');
                }, duration);
            }

        });

        // 讓Transport具备事件功能。
        Mediator.installTo(Transport.prototype);

        return Transport;
    });
    /**
     * @fileOverview 负责檔案上傳相關。
     */
    define('widgets/upload', [
        'base',
        'uploader',
        'file',
        'lib/transport',
        'widgets/widget'
    ], function (Base, Uploader, WUFile, Transport) {

        var $ = Base.$,
            isPromise = Base.isPromise,
            Status = WUFile.Status;

        // 添加默认配置项
        $.extend(Uploader.options, {


            /**
             * @property {Boolean} [prepareNextFile=false]
             * @namespace options
             * @for Uploader
             * @description 是否允许在檔案傳输時提前把下一個檔案准备好。
             * 對于一個檔案的准备工作比较耗時，比如圖片壓縮，md5序列化。
             * 如果能提前在当前檔案傳输期處理，可以節省总體耗時。
             */
            prepareNextFile: false,

            /**
             * @property {Boolean} [chunked=false]
             * @namespace options
             * @for Uploader
             * @description 是否要分片處理大檔案上傳。
             */
            chunked: false,

            /**
             * @property {Boolean} [chunkSize=5242880]
             * @namespace options
             * @for Uploader
             * @description 如果要分片，分多大一片？ 默认大小為5M.
             */
            chunkSize: 5 * 1024 * 1024,

            /**
             * @property {Boolean} [chunkRetry=2]
             * @namespace options
             * @for Uploader
             * @description 如果某個分片由于网络问题出錯，允许自動重傳多少次？
             */
            chunkRetry: 2,

            /**
             * @property {Boolean} [threads=3]
             * @namespace options
             * @for Uploader
             * @description 上傳并发數。允许同時最大上傳进程數。
             */
            threads: 3,


            /**
             * @property {Object} [formData]
             * @namespace options
             * @for Uploader
             * @description 檔案上傳請求的参數表，每次发送都會发送此物件中的参數。
             */
            formData: null

            /**
             * @property {Object} [fileVal='file']
             * @namespace options
             * @for Uploader
             * @description 设置檔案上傳域的name。
             */

            /**
             * @property {Object} [method='POST']
             * @namespace options
             * @for Uploader
             * @description 檔案上傳方式，`POST`或者`GET`。
             */

            /**
             * @property {Object} [sendAsBinary=false]
             * @namespace options
             * @for Uploader
             * @description 是否已二进制的流的方式发送檔案，这样整個上傳内容`php://input`都為檔案内容，
             * 其他参數在$_GET數组中。
             */
        });

        // 负责將檔案切片。
        function CuteFile(file, chunkSize) {
            var pending = [],
                blob = file.source,
                total = blob.size,
                chunks = chunkSize ? Math.ceil(total / chunkSize) : 1,
                start = 0,
                index = 0,
                len;

            while (index < chunks) {
                len = Math.min(chunkSize, total - start);

                pending.push({
                    file: file,
                    start: start,
                    end: chunkSize ? (start + len) : total,
                    total: total,
                    chunks: chunks,
                    chunk: index++
                });
                start += len;
            }

            file.blocks = pending.concat();
            file.remaning = pending.length;

            return {
                file: file,

                has: function () {
                    return !!pending.length;
                },

                fetch: function () {
                    return pending.shift();
                }
            };
        }

        Uploader.register({
            'start-upload': 'start',
            'stop-upload': 'stop',
            'skip-file': 'skipFile',
            'is-in-progress': 'isInProgress'
        }, {

            init: function () {
                var owner = this.owner;

                this.runing = false;

                // 記录当前正在傳的資料，跟threads相關
                this.pool = [];

                // 缓存即將上傳的檔案。
                this.pending = [];

                // 跟踪還有多少分片没有完成上傳。
                this.remaning = 0;
                this.__tick = Base.bindFn(this._tick, this);

                owner.on('uploadComplete', function (file) {
                    // 把其他块取消了。
                    file.blocks && $.each(file.blocks, function (_, v) {
                        v.transport && (v.transport.abort(), v.transport.destroy());
                        delete v.transport;
                    });

                    delete file.blocks;
                    delete file.remaning;
                });
            },

            /**
             * @event startUpload
             * @description 当开始上傳流程時触发。
             * @for  Uploader
             */

            /**
             * 开始上傳。此方法可以从初始狀態調用开始上傳流程，也可以从暫停狀態調用，繼續上傳流程。
             * @grammar upload() => undefined
             * @method upload
             * @for  Uploader
             */
            start: function () {
                var me = this;

                // 移出invalid的檔案
                $.each(me.request('get-files', Status.INVALID), function () {
                    me.request('remove-file', this);
                });

                if (me.runing) {
                    return;
                }

                me.runing = true;

                // 如果有暫停的，則續傳
                $.each(me.pool, function (_, v) {
                    var file = v.file;

                    if (file.getStatus() === Status.INTERRUPT) {
                        file.setStatus(Status.PROGRESS);
                        me._trigged = false;
                        v.transport && v.transport.send();
                    }
                });

                me._trigged = false;
                me.owner.trigger('startUpload');
                Base.nextTick(me.__tick);
            },

            /**
             * @event stopUpload
             * @description 当开始上傳流程暫停時触发。
             * @for  Uploader
             */

            /**
             * 暫停上傳。第一個参數為是否中断上傳当前正在上傳的檔案。
             * @grammar stop() => undefined
             * @grammar stop( true ) => undefined
             * @method stop
             * @for  Uploader
             */
            stop: function (interrupt) {
                var me = this;

                if (me.runing === false) {
                    return;
                }

                me.runing = false;

                interrupt && $.each(me.pool, function (_, v) {
                    v.transport && v.transport.abort();
                    v.file.setStatus(Status.INTERRUPT);
                });

                me.owner.trigger('stopUpload');
            },

            /**
             * 判断`Uplaode`r是否正在上傳中。
             * @grammar isInProgress() => Boolean
             * @method isInProgress
             * @for  Uploader
             */
            isInProgress: function () {
                return !!this.runing;
            },

            getStats: function () {
                return this.request('get-stats');
            },

            /**
             * 掉過一個檔案上傳，直接標記指定檔案為已上傳狀態。
             * @grammar skipFile( file ) => undefined
             * @method skipFile
             * @for  Uploader
             */
            skipFile: function (file, status) {
                file = this.request('get-file', file);

                file.setStatus(status || Status.COMPLETE);
                file.skipped = true;

                // 如果正在上傳。
                file.blocks && $.each(file.blocks, function (_, v) {
                    var _tr = v.transport;

                    if (_tr) {
                        _tr.abort();
                        _tr.destroy();
                        delete v.transport;
                    }
                });

                this.owner.trigger('uploadSkip', file);
            },

            /**
             * @event uploadFinished
             * @description 当所有檔案上傳结束時触发。
             * @for  Uploader
             */
            _tick: function () {
                var me = this,
                    opts = me.options,
                    fn, val;

                // 上一個promise還没有结束，則等待完成後再执行。
                if (me._promise) {
                    return me._promise.always(me.__tick);
                }

                // 還有位置，且還有檔案要處理的话。
                if (me.pool.length < opts.threads && (val = me._nextBlock())) {
                    me._trigged = false;

                    fn = function (val) {
                        me._promise = null;

                        // 有可能是reject過來的，所以要检测val的類型。
                        val && val.file && me._startSend(val);
                        Base.nextTick(me.__tick);
                    };

                    me._promise = isPromise(val) ? val.always(fn) : fn(val);

                    // 没有要上傳的了，且没有正在傳输的了。
                } else if (!me.remaning && !me.getStats().numOfQueue) {
                    me.runing = false;

                    me._trigged || Base.nextTick(function () {
                        me.owner.trigger('uploadFinished');
                    });
                    me._trigged = true;
                }
            },

            _nextBlock: function () {
                var me = this,
                    act = me._act,
                    opts = me.options,
                    next, done;

                // 如果当前檔案還有没有需要傳输的，則直接返回剩下的。
                if (act && act.has() &&
                    act.file.getStatus() === Status.PROGRESS) {

                    // 是否提前准备下一個檔案
                    if (opts.prepareNextFile && !me.pending.length) {
                        me._prepareNextFile();
                    }

                    return act.fetch();

                    // 否則，如果正在运行，則准备下一個檔案，并等待完成後返回下個分片。
                } else if (me.runing) {

                    // 如果缓存中有，則直接在缓存中取，没有則去queue中取。
                    if (!me.pending.length && me.getStats().numOfQueue) {
                        me._prepareNextFile();
                    }

                    next = me.pending.shift();
                    done = function (file) {
                        if (!file) {
                            return null;
                        }

                        act = CuteFile(file, opts.chunked ? opts.chunkSize : 0);
                        me._act = act;
                        return act.fetch();
                    };

                    // 檔案可能還在prepare中，也有可能已经完全准备好了。
                    return isPromise(next) ?
                        next[next.pipe ? 'pipe' : 'then'](done) :
                        done(next);
                }
            },


            /**
             * @event uploadStart
             * @param {File} file File物件
             * @description 某個檔案开始上傳前触发，一個檔案只會触发一次。
             * @for  Uploader
             */
            _prepareNextFile: function () {
                var me = this,
                    file = me.request('fetch-file'),
                    pending = me.pending,
                    promise;

                if (file) {
                    promise = me.request('before-send-file', file, function () {

                        // 有可能檔案被skip掉了。檔案被skip掉後，狀態坑定不是Queued.
                        if (file.getStatus() === Status.QUEUED) {
                            me.owner.trigger('uploadStart', file);
                            file.setStatus(Status.PROGRESS);
                            return file;
                        }

                        return me._finishFile(file);
                    });

                    // 如果還在pending中，則替换成檔案本身。
                    promise.done(function () {
                        var idx = $.inArray(promise, pending);

                        ~idx && pending.splice(idx, 1, file);
                    });

                    // befeore-send-file的钩子就有錯誤发生。
                    promise.fail(function (reason) {
                        file.setStatus(Status.ERROR, reason);
                        me.owner.trigger('uploadError', file, reason);
                        me.owner.trigger('uploadComplete', file);
                    });

                    pending.push(promise);
                }
            },

            // 讓出位置了，可以讓其他分片开始上傳
            _popBlock: function (block) {
                var idx = $.inArray(block, this.pool);

                this.pool.splice(idx, 1);
                block.file.remaning--;
                this.remaning--;
            },

            // 开始上傳，可以被掉過。如果promise被reject了，則表示跳過此分片。
            _startSend: function (block) {
                var me = this,
                    file = block.file,
                    promise;

                me.pool.push(block);
                me.remaning++;

                // 如果没有分片，則直接使用原始的。
                // 不會丢失content-type信息。
                block.blob = block.chunks === 1 ? file.source :
                    file.source.slice(block.start, block.end);

                // hook, 每個分片发送之前可能要做些異步的事情。
                promise = me.request('before-send', block, function () {

                    // 有可能檔案已经上傳出錯了，所以不需要再傳输了。
                    if (file.getStatus() === Status.PROGRESS) {
                        me._doSend(block);
                    } else {
                        me._popBlock(block);
                        Base.nextTick(me.__tick);
                    }
                });

                // 如果為fail了，則跳過此分片。
                promise.fail(function () {
                    if (file.remaning === 1) {
                        me._finishFile(file).always(function () {
                            block.percentage = 1;
                            me._popBlock(block);
                            me.owner.trigger('uploadComplete', file);
                            Base.nextTick(me.__tick);
                        });
                    } else {
                        block.percentage = 1;
                        me._popBlock(block);
                        Base.nextTick(me.__tick);
                    }
                });
            },


            /**
             * @event uploadBeforeSend
             * @param {Object} object
             * @param {Object} data 默认的上傳参數，可以擴展此物件來控制上傳参數。
             * @description 当某個檔案的分块在发送前触发，主要用來询问是否要添加附带参數，大檔案在开起分片上傳的前提下此事件可能會触发多次。
             * @for  Uploader
             */

            /**
             * @event uploadAccept
             * @param {Object} object
             * @param {Object} ret 服务端的返回資料，json格式，如果服务端不是json格式，从ret._raw中取資料，自行解析。
             * @description 当某個檔案上傳到服务端响應後，會派送此事件來询问服务端响應是否有效。如果此事件handler返回值為`false`, 則此檔案將派送`server`類型的`uploadError`事件。
             * @for  Uploader
             */

            /**
             * @event uploadProgress
             * @param {File} file File物件
             * @param {Number} percentage 上傳进度
             * @description 上傳過程中触发，携带上傳进度。
             * @for  Uploader
             */


            /**
             * @event uploadError
             * @param {File} file File物件
             * @param {String} reason 出錯的code
             * @description 当檔案上傳出錯時触发。
             * @for  Uploader
             */

            /**
             * @event uploadSuccess
             * @param {File} file File物件
             * @param {Object} response 服务端返回的資料
             * @description 当檔案上傳成功時触发。
             * @for  Uploader
             */

            /**
             * @event uploadComplete
             * @param {File} [file] File物件
             * @description 不管成功或者失败，檔案上傳完成時触发。
             * @for  Uploader
             */

            // 做上傳操作。
            _doSend: function (block) {
                var me = this,
                    owner = me.owner,
                    opts = me.options,
                    file = block.file,
                    tr = new Transport(opts),
                    data = $.extend({}, opts.formData),
                    headers = $.extend({}, opts.headers),
                    requestAccept, ret;

                block.transport = tr;

                tr.on('destroy', function () {
                    delete block.transport;
                    me._popBlock(block);
                    Base.nextTick(me.__tick);
                });

                // 广播上傳进度。以檔案為单位。
                tr.on('progress', function (percentage) {
                    var totalPercent = 0,
                        uploaded = 0;

                    // 可能没有abort掉，progress還是执行进來了。
                    // if ( !file.blocks ) {
                    //     return;
                    // }

                    totalPercent = block.percentage = percentage;

                    if (block.chunks > 1) {    // 计算檔案的整體速度。
                        $.each(file.blocks, function (_, v) {
                            uploaded += (v.percentage || 0) * (v.end - v.start);
                        });

                        totalPercent = uploaded / file.size;
                    }

                    owner.trigger('uploadProgress', file, totalPercent || 0);
                });

                // 用來询问，是否返回的结果是有錯誤的。
                requestAccept = function (reject) {
                    var fn;

                    ret = tr.getResponseAsJson() || {};
                    ret._raw = tr.getResponse();
                    fn = function (value) {
                        reject = value;
                    };

                    // 服务端响應了，不代表成功了，询问是否响應正确。
                    if (!owner.trigger('uploadAccept', block, ret, fn)) {
                        reject = reject || 'server';
                    }

                    return reject;
                };

                // 尝试重试，然後广播檔案上傳出錯。
                tr.on('error', function (type, flag) {
                    block.retried = block.retried || 0;

                    // 自動重试
                    if (block.chunks > 1 && ~'http,abort'.indexOf(type) &&
                        block.retried < opts.chunkRetry) {

                        block.retried++;
                        tr.send();

                    } else {

                        // http status 500 ~ 600
                        if (!flag && type === 'server') {
                            type = requestAccept(type);
                        }

                        file.setStatus(Status.ERROR, type);
                        owner.trigger('uploadError', file, type);
                        owner.trigger('uploadComplete', file);
                    }
                });

                // 上傳成功
                tr.on('load', function () {
                    var reason;

                    // 如果非预期，转向上傳出錯。
                    if ((reason = requestAccept())) {
                        tr.trigger('error', reason, true);
                        return;
                    }

                    // 全部上傳完成。
                    if (file.remaning === 1) {
                        me._finishFile(file, ret);
                    } else {
                        tr.destroy();
                    }
                });

                // 配置默认的上傳字段。
                data = $.extend(data, {
                    id: file.id,
                    name: file.name,
                    type: file.type,
                    lastModifiedDate: file.lastModifiedDate,
                    size: file.size
                });

                block.chunks > 1 && $.extend(data, {
                    chunks: block.chunks,
                    chunk: block.chunk
                });

                // 在发送之间可以添加字段什麼的。。。
                // 如果默认的字段不够使用，可以通過监听此事件來擴展
                owner.trigger('uploadBeforeSend', block, data, headers);

                // 开始发送。
                tr.appendBlob(opts.fileVal, block.blob, file.name);
                tr.append(data);
                tr.setRequestHeader(headers);
                tr.send();
            },

            // 完成上傳。
            _finishFile: function (file, ret, hds) {
                var owner = this.owner;

                return owner
                    .request('after-send-file', arguments, function () {
                        file.setStatus(Status.COMPLETE);
                        owner.trigger('uploadSuccess', file, ret, hds);
                    })
                    .fail(function (reason) {

                        // 如果外部已经標記為invalid什麼的，不再改狀態。
                        if (file.getStatus() === Status.PROGRESS) {
                            file.setStatus(Status.ERROR, reason);
                        }

                        owner.trigger('uploadError', file, reason);
                    })
                    .always(function () {
                        owner.trigger('uploadComplete', file);
                    });
            }

        });
    });
    /**
     * @fileOverview 各种验证，包括檔案总大小是否超出、单檔案是否超出和檔案是否重複。
     */

    define('widgets/validator', [
        'base',
        'uploader',
        'file',
        'widgets/widget'
    ], function (Base, Uploader, WUFile) {

        var $ = Base.$,
            validators = {},
            api;

        /**
         * @event error
         * @param {String} type 錯誤類型。
         * @description 当validate不通過時，會以派送錯誤事件的形式通知調用者。通過`upload.on('error', handler)`可以捕获到此類錯誤，目前有以下錯誤會在特定的情况下派送錯來。
         *
         * * `Q_EXCEED_NUM_LIMIT` 在设置了`fileNumLimit`且尝试给`uploader`添加的檔案數量超出这個值時派送。
         * * `Q_EXCEED_SIZE_LIMIT` 在设置了`Q_EXCEED_SIZE_LIMIT`且尝试给`uploader`添加的檔案总大小超出这個值時派送。
         * @for  Uploader
         */

        // 暴露给外面的api
        api = {

            // 添加验证器
            addValidator: function (type, cb) {
                validators[type] = cb;
            },

            // 移除验证器
            removeValidator: function (type) {
                delete validators[type];
            }
        };

        // 在Uploader初始化的時候启動Validators的初始化
        Uploader.register({
            init: function () {
                var me = this;
                $.each(validators, function () {
                    this.call(me.owner);
                });
            }
        });

        /**
         * @property {int} [fileNumLimit=undefined]
         * @namespace options
         * @for Uploader
         * @description 验证檔案总數量, 超出則不允许加入隊列。
         */
        api.addValidator('fileNumLimit', function () {
            var uploader = this,
                opts = uploader.options,
                count = 0,
                max = opts.fileNumLimit >> 0,
                flag = true;

            if (!max) {
                return;
            }

            uploader.on('beforeFileQueued', function (file) {

                if (count >= max && flag) {
                    flag = false;
                    this.trigger('error', 'Q_EXCEED_NUM_LIMIT', max, file);
                    setTimeout(function () {
                        flag = true;
                    }, 1);
                }

                return count >= max ? false : true;
            });

            uploader.on('fileQueued', function () {
                count++;
            });

            uploader.on('fileDequeued', function () {
                count--;
            });

            uploader.on('uploadFinished', function () {
                count = 0;
            });
        });


        /**
         * @property {int} [fileSizeLimit=undefined]
         * @namespace options
         * @for Uploader
         * @description 验证檔案总大小是否超出限制, 超出則不允许加入隊列。
         */
        api.addValidator('fileSizeLimit', function () {
            var uploader = this,
                opts = uploader.options,
                count = 0,
                max = opts.fileSizeLimit >> 0,
                flag = true;

            if (!max) {
                return;
            }

            uploader.on('beforeFileQueued', function (file) {
                var invalid = count + file.size > max;

                if (invalid && flag) {
                    flag = false;
                    this.trigger('error', 'Q_EXCEED_SIZE_LIMIT', max, file);
                    setTimeout(function () {
                        flag = true;
                    }, 1);
                }

                return invalid ? false : true;
            });

            uploader.on('fileQueued', function (file) {
                count += file.size;
            });

            uploader.on('fileDequeued', function (file) {
                count -= file.size;
            });

            uploader.on('uploadFinished', function () {
                count = 0;
            });
        });

        /**
         * @property {int} [fileSingleSizeLimit=undefined]
         * @namespace options
         * @for Uploader
         * @description 验证单個檔案大小是否超出限制, 超出則不允许加入隊列。
         */
        api.addValidator('fileSingleSizeLimit', function () {
            var uploader = this,
                opts = uploader.options,
                max = opts.fileSingleSizeLimit;

            if (!max) {
                return;
            }

            uploader.on('beforeFileQueued', function (file) {

                if (file.size > max) {
                    file.setStatus(WUFile.Status.INVALID, 'exceed_size');
                    this.trigger('error', 'F_EXCEED_SIZE', file);
                    return false;
                }

            });

        });

        /**
         * @property {int} [duplicate=undefined]
         * @namespace options
         * @for Uploader
         * @description 去重， 根据檔案名字、檔案大小和最後修改時间來生成hash Key.
         */
        api.addValidator('duplicate', function () {
            var uploader = this,
                opts = uploader.options,
                mapping = {};

            if (opts.duplicate) {
                return;
            }

            function hashString(str) {
                var hash = 0,
                    i = 0,
                    len = str.length,
                    _char;

                for (; i < len; i++) {
                    _char = str.charCodeAt(i);
                    hash = _char + (hash << 6) + (hash << 16) - hash;
                }

                return hash;
            }

            uploader.on('beforeFileQueued', function (file) {
                var hash = file.__hash || (file.__hash = hashString(file.name +
                    file.size + file.lastModifiedDate));

                // 已经重複了
                if (mapping[hash]) {
                    this.trigger('error', 'F_DUPLICATE', file);
                    return false;
                }
            });

            uploader.on('fileQueued', function (file) {
                var hash = file.__hash;

                hash && (mapping[hash] = true);
            });

            uploader.on('fileDequeued', function (file) {
                var hash = file.__hash;

                hash && (delete mapping[hash]);
            });
        });

        return api;
    });

    /**
     * @fileOverview Runtime管理器，负责Runtime的选择, 连接
     */
    define('runtime/compbase', [], function () {

        function CompBase(owner, runtime) {

            this.owner = owner;
            this.options = owner.options;

            this.getRuntime = function () {
                return runtime;
            };

            this.getRuid = function () {
                return runtime.uid;
            };

            this.trigger = function () {
                return owner.trigger.apply(owner, arguments);
            };
        }

        return CompBase;
    });
    /**
     * @fileOverview Html5Runtime
     */
    define('runtime/html5/runtime', [
        'base',
        'runtime/runtime',
        'runtime/compbase'
    ], function (Base, Runtime, CompBase) {

        var type = 'html5',
            components = {};

        function Html5Runtime() {
            var pool = {},
                me = this,
                destory = this.destory;

            Runtime.apply(me, arguments);
            me.type = type;


            // 这個方法的調用者，實际上是RuntimeClient
            me.exec = function (comp, fn/*, args...*/) {
                var client = this,
                    uid = client.uid,
                    args = Base.slice(arguments, 2),
                    instance;

                if (components[comp]) {
                    instance = pool[uid] = pool[uid] ||
                        new components[comp](client, me);

                    if (instance[fn]) {
                        return instance[fn].apply(instance, args);
                    }
                }
            };

            me.destory = function () {
                // @todo 删除池子中的所有實例
                return destory && destory.apply(this, arguments);
            };
        }

        Base.inherits(Runtime, {
            constructor: Html5Runtime,

            // 不需要连接其他程序，直接执行callback
            init: function () {
                var me = this;
                setTimeout(function () {
                    me.trigger('ready');
                }, 1);
            }

        });

        // 注册Components
        Html5Runtime.register = function (name, component) {
            var klass = components[name] = Base.inherits(CompBase, component);
            return klass;
        };

        // 注册html5运行時。
        // 只有在支持的前提下注册。
        if (window.Blob && window.FileReader && window.DataView) {
            Runtime.addRuntime(type, Html5Runtime);
        }

        return Html5Runtime;
    });
    /**
     * @fileOverview Blob Html實现
     */
    define('runtime/html5/blob', [
        'runtime/html5/runtime',
        'lib/blob'
    ], function (Html5Runtime, Blob) {

        return Html5Runtime.register('Blob', {
            slice: function (start, end) {
                var blob = this.owner.source,
                    slice = blob.slice || blob.webkitSlice || blob.mozSlice;

                blob = slice.call(blob, start, end);

                return new Blob(this.getRuid(), blob);
            }
        });
    });
    /**
     * @fileOverview FilePaste
     */
    define('runtime/html5/dnd', [
        'base',
        'runtime/html5/runtime',
        'lib/file'
    ], function (Base, Html5Runtime, File) {

        var $ = Base.$,
            prefix = 'webuploader-dnd-';

        return Html5Runtime.register('DragAndDrop', {
            init: function () {
                var elem = this.elem = this.options.container;

                this.dragEnterHandler = Base.bindFn(this._dragEnterHandler, this);
                this.dragOverHandler = Base.bindFn(this._dragOverHandler, this);
                this.dragLeaveHandler = Base.bindFn(this._dragLeaveHandler, this);
                this.dropHandler = Base.bindFn(this._dropHandler, this);
                this.dndOver = false;

                elem.on('dragenter', this.dragEnterHandler);
                elem.on('dragover', this.dragOverHandler);
                elem.on('dragleave', this.dragLeaveHandler);
                elem.on('drop', this.dropHandler);

                if (this.options.disableGlobalDnd) {
                    $(document).on('dragover', this.dragOverHandler);
                    $(document).on('drop', this.dropHandler);
                }
            },

            _dragEnterHandler: function (e) {
                var me = this,
                    denied = me._denied || false,
                    items;

                e = e.originalEvent || e;

                if (!me.dndOver) {
                    me.dndOver = true;

                    // 注意只有 chrome 支持。
                    items = e.dataTransfer.items;

                    if (items && items.length) {
                        me._denied = denied = !me.trigger('accept', items);
                    }

                    me.elem.addClass(prefix + 'over');
                    me.elem[denied ? 'addClass' :
                        'removeClass'](prefix + 'denied');
                }


                e.dataTransfer.dropEffect = denied ? 'none' : 'copy';

                return false;
            },

            _dragOverHandler: function (e) {
                // 只處理框内的。
                var parentElem = this.elem.parent().get(0);
                if (parentElem && !$.contains(parentElem, e.currentTarget)) {
                    return false;
                }

                clearTimeout(this._leaveTimer);
                this._dragEnterHandler.call(this, e);

                return false;
            },

            _dragLeaveHandler: function () {
                var me = this,
                    handler;

                handler = function () {
                    me.dndOver = false;
                    me.elem.removeClass(prefix + 'over ' + prefix + 'denied');
                };

                clearTimeout(me._leaveTimer);
                me._leaveTimer = setTimeout(handler, 100);
                return false;
            },

            _dropHandler: function (e) {
                var me = this,
                    ruid = me.getRuid(),
                    parentElem = me.elem.parent().get(0);

                // 只處理框内的。
                if (parentElem && !$.contains(parentElem, e.currentTarget)) {
                    return false;
                }

                me._getTansferFiles(e, function (results) {
                    me.trigger('drop', $.map(results, function (file) {
                        return new File(ruid, file);
                    }));
                });

                me.dndOver = false;
                me.elem.removeClass(prefix + 'over');
                return false;
            },

            // 如果傳入 callback 則去查看檔案夹，否則只管当前檔案夹。
            _getTansferFiles: function (e, callback) {
                var results = [],
                    promises = [],
                    items, files, dataTransfer, file, item, i, len, canAccessFolder;

                e = e.originalEvent || e;

                dataTransfer = e.dataTransfer;
                items = dataTransfer.items;
                files = dataTransfer.files;

                canAccessFolder = !!(items && items[0].webkitGetAsEntry);

                for (i = 0, len = files.length; i < len; i++) {
                    file = files[i];
                    item = items && items[i];

                    if (canAccessFolder && item.webkitGetAsEntry().isDirectory) {

                        promises.push(this._traverseDirectoryTree(
                            item.webkitGetAsEntry(), results));
                    } else {
                        results.push(file);
                    }
                }

                Base.when.apply(Base, promises).done(function () {

                    if (!results.length) {
                        return;
                    }

                    callback(results);
                });
            },

            _traverseDirectoryTree: function (entry, results) {
                var deferred = Base.Deferred(),
                    me = this;

                if (entry.isFile) {
                    entry.file(function (file) {
                        results.push(file);
                        deferred.resolve();
                    });
                } else if (entry.isDirectory) {
                    entry.createReader().readEntries(function (entries) {
                        var len = entries.length,
                            promises = [],
                            arr = [],    // 為了保证顺序。
                            i;

                        for (i = 0; i < len; i++) {
                            promises.push(me._traverseDirectoryTree(
                                entries[i], arr));
                        }

                        Base.when.apply(Base, promises).then(function () {
                            results.push.apply(results, arr);
                            deferred.resolve();
                        }, deferred.reject);
                    });
                }

                return deferred.promise();
            },

            destroy: function () {
                var elem = this.elem;

                elem.off('dragenter', this.dragEnterHandler);
                elem.off('dragover', this.dragEnterHandler);
                elem.off('dragleave', this.dragLeaveHandler);
                elem.off('drop', this.dropHandler);

                if (this.options.disableGlobalDnd) {
                    $(document).off('dragover', this.dragOverHandler);
                    $(document).off('drop', this.dropHandler);
                }
            }
        });
    });

    /**
     * @fileOverview FilePaste
     */
    define('runtime/html5/filepaste', [
        'base',
        'runtime/html5/runtime',
        'lib/file'
    ], function (Base, Html5Runtime, File) {

        return Html5Runtime.register('FilePaste', {
            init: function () {
                var opts = this.options,
                    elem = this.elem = opts.container,
                    accept = '.*',
                    arr, i, len, item;

                // accetp的mimeTypes中生成匹配正則。
                if (opts.accept) {
                    arr = [];

                    for (i = 0, len = opts.accept.length; i < len; i++) {
                        item = opts.accept[i].mimeTypes;
                        item && arr.push(item);
                    }

                    if (arr.length) {
                        accept = arr.join(',');
                        accept = accept.replace(/,/g, '|').replace(/\*/g, '.*');
                    }
                }
                this.accept = accept = new RegExp(accept, 'i');
                this.hander = Base.bindFn(this._pasteHander, this);
                elem.on('paste', this.hander);
            },

            _pasteHander: function (e) {
                var allowed = [],
                    ruid = this.getRuid(),
                    items, item, blob, i, len;

                e = e.originalEvent || e;
                items = e.clipboardData.items;

                for (i = 0, len = items.length; i < len; i++) {
                    item = items[i];

                    if (item.kind !== 'file' || !(blob = item.getAsFile())) {
                        continue;
                    }

                    allowed.push(new File(ruid, blob));
                }

                if (allowed.length) {
                    // 不阻止非檔案粘贴（文字粘贴）的事件冒泡
                    e.preventDefault();
                    e.stopPropagation();
                    this.trigger('paste', allowed);
                }
            },

            destroy: function () {
                this.elem.off('paste', this.hander);
            }
        });
    });

    /**
     * @fileOverview FilePicker
     */
    define('runtime/html5/filepicker', [
        'base',
        'runtime/html5/runtime'
    ], function (Base, Html5Runtime) {

        var $ = Base.$;

        return Html5Runtime.register('FilePicker', {
            init: function () {
                var container = this.getRuntime().getContainer(),
                    me = this,
                    owner = me.owner,
                    opts = me.options,
                    lable = $(document.createElement('label')),
                    input = $(document.createElement('input')),
                    arr, i, len, mouseHandler;

                input.attr('type', 'file');
                input.attr('name', opts.name);
                input.addClass('webuploader-element-invisible');

                lable.on('click', function () {
                    input.trigger('click');
                });

                lable.css({
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    cursor: 'pointer',
                    background: '#ffffff'
                });

                if (opts.multiple) {
                    input.attr('multiple', 'multiple');
                }

                // @todo Firefox不支持单独指定後缀
                if (opts.accept && opts.accept.length > 0) {
                    arr = [];

                    for (i = 0, len = opts.accept.length; i < len; i++) {
                        arr.push(opts.accept[i].mimeTypes);
                    }

                    input.attr('accept', arr.join(','));
                }

                container.append(input);
                container.append(lable);

                mouseHandler = function (e) {
                    owner.trigger(e.type);
                };

                input.on('change', function (e) {
                    var fn = arguments.callee,
                        clone;

                    me.files = e.target.files;

                    // reset input
                    clone = this.cloneNode(true);
                    this.parentNode.replaceChild(clone, this);

                    input.off();
                    input = $(clone).on('change', fn)
                        .on('mouseenter mouseleave', mouseHandler);

                    owner.trigger('change');
                });

                lable.on('mouseenter mouseleave', mouseHandler);

            },


            getFiles: function () {
                return this.files;
            },

            destroy: function () {
                // todo
            }
        });
    });
    /**
     * Terms:
     *
     * Uint8Array, FileReader, BlobBuilder, atob, ArrayBuffer
     * @fileOverview Image控件
     */
    define('runtime/html5/util', [
        'base'
    ], function (Base) {

        var urlAPI = window.createObjectURL && window ||
            window.URL && URL.revokeObjectURL && URL ||
            window.webkitURL,
            createObjectURL = Base.noop,
            revokeObjectURL = createObjectURL;

        if (urlAPI) {

            // 更安全的方式調用，比如android里面就能把context改成其他的物件。
            createObjectURL = function () {
                return urlAPI.createObjectURL.apply(urlAPI, arguments);
            };

            revokeObjectURL = function () {
                return urlAPI.revokeObjectURL.apply(urlAPI, arguments);
            };
        }

        return {
            createObjectURL: createObjectURL,
            revokeObjectURL: revokeObjectURL,

            dataURL2Blob: function (dataURI) {
                var byteStr, intArray, ab, i, mimetype, parts;

                parts = dataURI.split(',');

                if (~parts[0].indexOf('base64')) {
                    byteStr = atob(parts[1]);
                } else {
                    byteStr = decodeURIComponent(parts[1]);
                }

                ab = new ArrayBuffer(byteStr.length);
                intArray = new Uint8Array(ab);

                for (i = 0; i < byteStr.length; i++) {
                    intArray[i] = byteStr.charCodeAt(i);
                }

                mimetype = parts[0].split(':')[1].split(';')[0];

                return this.arrayBufferToBlob(ab, mimetype);
            },

            dataURL2ArrayBuffer: function (dataURI) {
                var byteStr, intArray, i, parts;

                parts = dataURI.split(',');

                if (~parts[0].indexOf('base64')) {
                    byteStr = atob(parts[1]);
                } else {
                    byteStr = decodeURIComponent(parts[1]);
                }

                intArray = new Uint8Array(byteStr.length);

                for (i = 0; i < byteStr.length; i++) {
                    intArray[i] = byteStr.charCodeAt(i);
                }

                return intArray.buffer;
            },

            arrayBufferToBlob: function (buffer, type) {
                var builder = window.BlobBuilder || window.WebKitBlobBuilder,
                    bb;

                // android不支持直接new Blob, 只能借助blobbuilder.
                if (builder) {
                    bb = new builder();
                    bb.append(buffer);
                    return bb.getBlob(type);
                }

                return new Blob([buffer], type ? { type: type } : {});
            },

            // 抽出來主要是為了解决android下面canvas.toDataUrl不支持jpeg.
            // 你得到的结果是png.
            canvasToDataUrl: function (canvas, type, quality) {
                return canvas.toDataURL(type, quality / 100);
            },

            // imagemeat會复写这個方法，如果用户选择加载那個檔案了的话。
            parseMeta: function (blob, callback) {
                callback(false, {});
            },

            // imagemeat會复写这個方法，如果用户选择加载那個檔案了的话。
            updateImageHead: function (data) {
                return data;
            }
        };
    });
    /**
     * Terms:
     *
     * Uint8Array, FileReader, BlobBuilder, atob, ArrayBuffer
     * @fileOverview Image控件
     */
    define('runtime/html5/imagemeta', [
        'runtime/html5/util'
    ], function (Util) {

        var api;

        api = {
            parsers: {
                0xffe1: []
            },

            maxMetaDataSize: 262144,

            parse: function (blob, cb) {
                var me = this,
                    fr = new FileReader();

                fr.onload = function () {
                    cb(false, me._parse(this.result));
                    fr = fr.onload = fr.onerror = null;
                };

                fr.onerror = function (e) {
                    cb(e.message);
                    fr = fr.onload = fr.onerror = null;
                };

                blob = blob.slice(0, me.maxMetaDataSize);
                fr.readAsArrayBuffer(blob.getSource());
            },

            _parse: function (buffer, noParse) {
                if (buffer.byteLength < 6) {
                    return;
                }

                var dataview = new DataView(buffer),
                    offset = 2,
                    maxOffset = dataview.byteLength - 4,
                    headLength = offset,
                    ret = {},
                    markerBytes, markerLength, parsers, i;

                if (dataview.getUint16(0) === 0xffd8) {

                    while (offset < maxOffset) {
                        markerBytes = dataview.getUint16(offset);

                        if (markerBytes >= 0xffe0 && markerBytes <= 0xffef ||
                            markerBytes === 0xfffe) {

                            markerLength = dataview.getUint16(offset + 2) + 2;

                            if (offset + markerLength > dataview.byteLength) {
                                break;
                            }

                            parsers = api.parsers[markerBytes];

                            if (!noParse && parsers) {
                                for (i = 0; i < parsers.length; i += 1) {
                                    parsers[i].call(api, dataview, offset,
                                        markerLength, ret);
                                }
                            }

                            offset += markerLength;
                            headLength = offset;
                        } else {
                            break;
                        }
                    }

                    if (headLength > 6) {
                        if (buffer.slice) {
                            ret.imageHead = buffer.slice(2, headLength);
                        } else {
                            // Workaround for IE10, which does not yet
                            // support ArrayBuffer.slice:
                            ret.imageHead = new Uint8Array(buffer)
                                .subarray(2, headLength);
                        }
                    }
                }

                return ret;
            },

            updateImageHead: function (buffer, head) {
                var data = this._parse(buffer, true),
                    buf1, buf2, bodyoffset;


                bodyoffset = 2;
                if (data.imageHead) {
                    bodyoffset = 2 + data.imageHead.byteLength;
                }

                if (buffer.slice) {
                    buf2 = buffer.slice(bodyoffset);
                } else {
                    buf2 = new Uint8Array(buffer).subarray(bodyoffset);
                }

                buf1 = new Uint8Array(head.byteLength + 2 + buf2.byteLength);

                buf1[0] = 0xFF;
                buf1[1] = 0xD8;
                buf1.set(new Uint8Array(head), 2);
                buf1.set(new Uint8Array(buf2), head.byteLength + 2);

                return buf1.buffer;
            }
        };

        Util.parseMeta = function () {
            return api.parse.apply(api, arguments);
        };

        Util.updateImageHead = function () {
            return api.updateImageHead.apply(api, arguments);
        };

        return api;
    });
    /**
     * 代码來自于：https://github.com/blueimp/JavaScript-Load-Image
     * 暫時项目中只用了orientation.
     *
     * 去除了 Exif Sub IFD Pointer, GPS Info IFD Pointer, Exif Thumbnail.
     * @fileOverview EXIF解析
     */

    // Sample
    // ====================================
    // Make : Apple
    // Model : iPhone 4S
    // Orientation : 1
    // XResolution : 72 [72/1]
    // YResolution : 72 [72/1]
    // ResolutionUnit : 2
    // Software : QuickTime 7.7.1
    // DateTime : 2013:09:01 22:53:55
    // ExifIFDPointer : 190
    // ExposureTime : 0.058823529411764705 [1/17]
    // FNumber : 2.4 [12/5]
    // ExposureProgram : Normal program
    // ISOSpeedRatings : 800
    // ExifVersion : 0220
    // DateTimeOriginal : 2013:09:01 22:52:51
    // DateTimeDigitized : 2013:09:01 22:52:51
    // ComponentsConfiguration : YCbCr
    // ShutterSpeedValue : 4.058893515764426
    // ApertureValue : 2.5260688216892597 [4845/1918]
    // BrightnessValue : -0.3126686601998395
    // MeteringMode : Pattern
    // Flash : Flash did not fire, compulsory flash mode
    // FocalLength : 4.28 [107/25]
    // SubjectArea : [4 values]
    // FlashpixVersion : 0100
    // ColorSpace : 1
    // PixelXDimension : 2448
    // PixelYDimension : 3264
    // SensingMethod : One-chip color area sensor
    // ExposureMode : 0
    // WhiteBalance : Auto white balance
    // FocalLengthIn35mmFilm : 35
    // SceneCaptureType : Standard
    define('runtime/html5/imagemeta/exif', [
        'base',
        'runtime/html5/imagemeta'
    ], function (Base, ImageMeta) {

        var EXIF = {};

        EXIF.ExifMap = function () {
            return this;
        };

        EXIF.ExifMap.prototype.map = {
            'Orientation': 0x0112
        };

        EXIF.ExifMap.prototype.get = function (id) {
            return this[id] || this[this.map[id]];
        };

        EXIF.exifTagTypes = {
            // byte, 8-bit unsigned int:
            1: {
                getValue: function (dataView, dataOffset) {
                    return dataView.getUint8(dataOffset);
                },
                size: 1
            },

            // ascii, 8-bit byte:
            2: {
                getValue: function (dataView, dataOffset) {
                    return String.fromCharCode(dataView.getUint8(dataOffset));
                },
                size: 1,
                ascii: true
            },

            // short, 16 bit int:
            3: {
                getValue: function (dataView, dataOffset, littleEndian) {
                    return dataView.getUint16(dataOffset, littleEndian);
                },
                size: 2
            },

            // long, 32 bit int:
            4: {
                getValue: function (dataView, dataOffset, littleEndian) {
                    return dataView.getUint32(dataOffset, littleEndian);
                },
                size: 4
            },

            // rational = two long values,
            // first is numerator, second is denominator:
            5: {
                getValue: function (dataView, dataOffset, littleEndian) {
                    return dataView.getUint32(dataOffset, littleEndian) /
                        dataView.getUint32(dataOffset + 4, littleEndian);
                },
                size: 8
            },

            // slong, 32 bit signed int:
            9: {
                getValue: function (dataView, dataOffset, littleEndian) {
                    return dataView.getInt32(dataOffset, littleEndian);
                },
                size: 4
            },

            // srational, two slongs, first is numerator, second is denominator:
            10: {
                getValue: function (dataView, dataOffset, littleEndian) {
                    return dataView.getInt32(dataOffset, littleEndian) /
                        dataView.getInt32(dataOffset + 4, littleEndian);
                },
                size: 8
            }
        };

        // undefined, 8-bit byte, value depending on field:
        EXIF.exifTagTypes[7] = EXIF.exifTagTypes[1];

        EXIF.getExifValue = function (dataView, tiffOffset, offset, type, length,
            littleEndian) {

            var tagType = EXIF.exifTagTypes[type],
                tagSize, dataOffset, values, i, str, c;

            if (!tagType) {
                Base.log('Invalid Exif data: Invalid tag type.');
                return;
            }

            tagSize = tagType.size * length;

            // Determine if the value is contained in the dataOffset bytes,
            // or if the value at the dataOffset is a pointer to the actual data:
            dataOffset = tagSize > 4 ? tiffOffset + dataView.getUint32(offset + 8,
                littleEndian) : (offset + 8);

            if (dataOffset + tagSize > dataView.byteLength) {
                Base.log('Invalid Exif data: Invalid data offset.');
                return;
            }

            if (length === 1) {
                return tagType.getValue(dataView, dataOffset, littleEndian);
            }

            values = [];

            for (i = 0; i < length; i += 1) {
                values[i] = tagType.getValue(dataView,
                    dataOffset + i * tagType.size, littleEndian);
            }

            if (tagType.ascii) {
                str = '';

                // Concatenate the chars:
                for (i = 0; i < values.length; i += 1) {
                    c = values[i];

                    // Ignore the terminating NULL byte(s):
                    if (c === '\u0000') {
                        break;
                    }
                    str += c;
                }

                return str;
            }
            return values;
        };

        EXIF.parseExifTag = function (dataView, tiffOffset, offset, littleEndian,
            data) {

            var tag = dataView.getUint16(offset, littleEndian);
            data.exif[tag] = EXIF.getExifValue(dataView, tiffOffset, offset,
                dataView.getUint16(offset + 2, littleEndian),    // tag type
                dataView.getUint32(offset + 4, littleEndian),    // tag length
                littleEndian);
        };

        EXIF.parseExifTags = function (dataView, tiffOffset, dirOffset,
            littleEndian, data) {

            var tagsNumber, dirEndOffset, i;

            if (dirOffset + 6 > dataView.byteLength) {
                Base.log('Invalid Exif data: Invalid directory offset.');
                return;
            }

            tagsNumber = dataView.getUint16(dirOffset, littleEndian);
            dirEndOffset = dirOffset + 2 + 12 * tagsNumber;

            if (dirEndOffset + 4 > dataView.byteLength) {
                Base.log('Invalid Exif data: Invalid directory size.');
                return;
            }

            for (i = 0; i < tagsNumber; i += 1) {
                this.parseExifTag(dataView, tiffOffset,
                    dirOffset + 2 + 12 * i,    // tag offset
                    littleEndian, data);
            }

            // Return the offset to the next directory:
            return dataView.getUint32(dirEndOffset, littleEndian);
        };

        // EXIF.getExifThumbnail = function(dataView, offset, length) {
        //     var hexData,
        //         i,
        //         b;
        //     if (!length || offset + length > dataView.byteLength) {
        //         Base.log('Invalid Exif data: Invalid thumbnail data.');
        //         return;
        //     }
        //     hexData = [];
        //     for (i = 0; i < length; i += 1) {
        //         b = dataView.getUint8(offset + i);
        //         hexData.push((b < 16 ? '0' : '') + b.toString(16));
        //     }
        //     return 'data:image/jpeg,%' + hexData.join('%');
        // };

        EXIF.parseExifData = function (dataView, offset, length, data) {

            var tiffOffset = offset + 10,
                littleEndian, dirOffset;

            // Check for the ASCII code for "Exif" (0x45786966):
            if (dataView.getUint32(offset + 4) !== 0x45786966) {
                // No Exif data, might be XMP data instead
                return;
            }
            if (tiffOffset + 8 > dataView.byteLength) {
                Base.log('Invalid Exif data: Invalid segment size.');
                return;
            }

            // Check for the two null bytes:
            if (dataView.getUint16(offset + 8) !== 0x0000) {
                Base.log('Invalid Exif data: Missing byte alignment offset.');
                return;
            }

            // Check the byte alignment:
            switch (dataView.getUint16(tiffOffset)) {
                case 0x4949:
                    littleEndian = true;
                    break;

                case 0x4D4D:
                    littleEndian = false;
                    break;

                default:
                    Base.log('Invalid Exif data: Invalid byte alignment marker.');
                    return;
            }

            // Check for the TIFF tag marker (0x002A):
            if (dataView.getUint16(tiffOffset + 2, littleEndian) !== 0x002A) {
                Base.log('Invalid Exif data: Missing TIFF marker.');
                return;
            }

            // Retrieve the directory offset bytes, usually 0x00000008 or 8 decimal:
            dirOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
            // Create the exif object to store the tags:
            data.exif = new EXIF.ExifMap();
            // Parse the tags of the main image directory and retrieve the
            // offset to the next directory, usually the thumbnail directory:
            dirOffset = EXIF.parseExifTags(dataView, tiffOffset,
                tiffOffset + dirOffset, littleEndian, data);

            // 尝试读取縮略圖
            // if ( dirOffset ) {
            //     thumbnailData = {exif: {}};
            //     dirOffset = EXIF.parseExifTags(
            //         dataView,
            //         tiffOffset,
            //         tiffOffset + dirOffset,
            //         littleEndian,
            //         thumbnailData
            //     );

            //     // Check for JPEG Thumbnail offset:
            //     if (thumbnailData.exif[0x0201]) {
            //         data.exif.Thumbnail = EXIF.getExifThumbnail(
            //             dataView,
            //             tiffOffset + thumbnailData.exif[0x0201],
            //             thumbnailData.exif[0x0202] // Thumbnail data length
            //         );
            //     }
            // }
        };

        ImageMeta.parsers[0xffe1].push(EXIF.parseExifData);
        return EXIF;
    });
    /**
     * 这個方式性能不行，但是可以解决android里面的toDataUrl的bug
     * android里面toDataUrl('image/jpege')得到的结果却是png.
     *
     * 所以这里没辙，只能借助这個工具
     * @fileOverview jpeg encoder
     */
    define('runtime/html5/jpegencoder', [], function (require, exports, module) {

        /*
          Copyright (c) 2008, Adobe Systems Incorporated
          All rights reserved.

          Redistribution and use in source and binary forms, with or without
          modification, are permitted provided that the following conditions are
          met:

          * Redistributions of source code must retain the above copyright notice,
            this list of conditions and the following disclaimer.

          * Redistributions in binary form must reproduce the above copyright
            notice, this list of conditions and the following disclaimer in the
            documentation and/or other materials provided with the distribution.

          * Neither the name of Adobe Systems Incorporated nor the names of its
            contributors may be used to endorse or promote products derived from
            this software without specific prior written permission.

          THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
          IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
          THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
          PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
          CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
          EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
          PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
          PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
          LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
          NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
          SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        */
        /*
        JPEG encoder ported to JavaScript and optimized by Andreas Ritter, www.bytestrom.eu, 11/2009

        Basic GUI blocking jpeg encoder
        */

        function JPEGEncoder(quality) {
            var self = this;
            var fround = Math.round;
            var ffloor = Math.floor;
            var YTable = new Array(64);
            var UVTable = new Array(64);
            var fdtbl_Y = new Array(64);
            var fdtbl_UV = new Array(64);
            var YDC_HT;
            var UVDC_HT;
            var YAC_HT;
            var UVAC_HT;

            var bitcode = new Array(65535);
            var category = new Array(65535);
            var outputfDCTQuant = new Array(64);
            var DU = new Array(64);
            var byteout = [];
            var bytenew = 0;
            var bytepos = 7;

            var YDU = new Array(64);
            var UDU = new Array(64);
            var VDU = new Array(64);
            var clt = new Array(256);
            var RGB_YUV_TABLE = new Array(2048);
            var currentQuality;

            var ZigZag = [
                0, 1, 5, 6, 14, 15, 27, 28,
                2, 4, 7, 13, 16, 26, 29, 42,
                3, 8, 12, 17, 25, 30, 41, 43,
                9, 11, 18, 24, 31, 40, 44, 53,
                10, 19, 23, 32, 39, 45, 52, 54,
                20, 22, 33, 38, 46, 51, 55, 60,
                21, 34, 37, 47, 50, 56, 59, 61,
                35, 36, 48, 49, 57, 58, 62, 63
            ];

            var std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
            var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            var std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
            var std_ac_luminance_values = [
                0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12,
                0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
                0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08,
                0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0,
                0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16,
                0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
                0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
                0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
                0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
                0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
                0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
                0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
                0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98,
                0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
                0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
                0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5,
                0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4,
                0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
                0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea,
                0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
                0xf9, 0xfa
            ];

            var std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
            var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            var std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77];
            var std_ac_chrominance_values = [
                0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21,
                0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71,
                0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91,
                0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0,
                0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34,
                0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26,
                0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38,
                0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48,
                0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,
                0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
                0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78,
                0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
                0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96,
                0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5,
                0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4,
                0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3,
                0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2,
                0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda,
                0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,
                0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
                0xf9, 0xfa
            ];

            function initQuantTables(sf) {
                var YQT = [
                    16, 11, 10, 16, 24, 40, 51, 61,
                    12, 12, 14, 19, 26, 58, 60, 55,
                    14, 13, 16, 24, 40, 57, 69, 56,
                    14, 17, 22, 29, 51, 87, 80, 62,
                    18, 22, 37, 56, 68, 109, 103, 77,
                    24, 35, 55, 64, 81, 104, 113, 92,
                    49, 64, 78, 87, 103, 121, 120, 101,
                    72, 92, 95, 98, 112, 100, 103, 99
                ];

                for (var i = 0; i < 64; i++) {
                    var t = ffloor((YQT[i] * sf + 50) / 100);
                    if (t < 1) {
                        t = 1;
                    } else if (t > 255) {
                        t = 255;
                    }
                    YTable[ZigZag[i]] = t;
                }
                var UVQT = [
                    17, 18, 24, 47, 99, 99, 99, 99,
                    18, 21, 26, 66, 99, 99, 99, 99,
                    24, 26, 56, 99, 99, 99, 99, 99,
                    47, 66, 99, 99, 99, 99, 99, 99,
                    99, 99, 99, 99, 99, 99, 99, 99,
                    99, 99, 99, 99, 99, 99, 99, 99,
                    99, 99, 99, 99, 99, 99, 99, 99,
                    99, 99, 99, 99, 99, 99, 99, 99
                ];
                for (var j = 0; j < 64; j++) {
                    var u = ffloor((UVQT[j] * sf + 50) / 100);
                    if (u < 1) {
                        u = 1;
                    } else if (u > 255) {
                        u = 255;
                    }
                    UVTable[ZigZag[j]] = u;
                }
                var aasf = [
                    1.0, 1.387039845, 1.306562965, 1.175875602,
                    1.0, 0.785694958, 0.541196100, 0.275899379
                ];
                var k = 0;
                for (var row = 0; row < 8; row++) {
                    for (var col = 0; col < 8; col++) {
                        fdtbl_Y[k] = (1.0 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                        fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                        k++;
                    }
                }
            }

            function computeHuffmanTbl(nrcodes, std_table) {
                var codevalue = 0;
                var pos_in_table = 0;
                var HT = new Array();
                for (var k = 1; k <= 16; k++) {
                    for (var j = 1; j <= nrcodes[k]; j++) {
                        HT[std_table[pos_in_table]] = [];
                        HT[std_table[pos_in_table]][0] = codevalue;
                        HT[std_table[pos_in_table]][1] = k;
                        pos_in_table++;
                        codevalue++;
                    }
                    codevalue *= 2;
                }
                return HT;
            }

            function initHuffmanTbl() {
                YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
                UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
                YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
                UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
            }

            function initCategoryNumber() {
                var nrlower = 1;
                var nrupper = 2;
                for (var cat = 1; cat <= 15; cat++) {
                    //Positive numbers
                    for (var nr = nrlower; nr < nrupper; nr++) {
                        category[32767 + nr] = cat;
                        bitcode[32767 + nr] = [];
                        bitcode[32767 + nr][1] = cat;
                        bitcode[32767 + nr][0] = nr;
                    }
                    //Negative numbers
                    for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
                        category[32767 + nrneg] = cat;
                        bitcode[32767 + nrneg] = [];
                        bitcode[32767 + nrneg][1] = cat;
                        bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
                    }
                    nrlower <<= 1;
                    nrupper <<= 1;
                }
            }

            function initRGBYUVTable() {
                for (var i = 0; i < 256; i++) {
                    RGB_YUV_TABLE[i] = 19595 * i;
                    RGB_YUV_TABLE[(i + 256) >> 0] = 38470 * i;
                    RGB_YUV_TABLE[(i + 512) >> 0] = 7471 * i + 0x8000;
                    RGB_YUV_TABLE[(i + 768) >> 0] = -11059 * i;
                    RGB_YUV_TABLE[(i + 1024) >> 0] = -21709 * i;
                    RGB_YUV_TABLE[(i + 1280) >> 0] = 32768 * i + 0x807FFF;
                    RGB_YUV_TABLE[(i + 1536) >> 0] = -27439 * i;
                    RGB_YUV_TABLE[(i + 1792) >> 0] = - 5329 * i;
                }
            }

            // IO functions
            function writeBits(bs) {
                var value = bs[0];
                var posval = bs[1] - 1;
                while (posval >= 0) {
                    if (value & (1 << posval)) {
                        bytenew |= (1 << bytepos);
                    }
                    posval--;
                    bytepos--;
                    if (bytepos < 0) {
                        if (bytenew == 0xFF) {
                            writeByte(0xFF);
                            writeByte(0);
                        }
                        else {
                            writeByte(bytenew);
                        }
                        bytepos = 7;
                        bytenew = 0;
                    }
                }
            }

            function writeByte(value) {
                byteout.push(clt[value]); // write char directly instead of converting later
            }

            function writeWord(value) {
                writeByte((value >> 8) & 0xFF);
                writeByte((value) & 0xFF);
            }

            // DCT & quantization core
            function fDCTQuant(data, fdtbl) {
                var d0, d1, d2, d3, d4, d5, d6, d7;
                /* Pass 1: process rows. */
                var dataOff = 0;
                var i;
                var I8 = 8;
                var I64 = 64;
                for (i = 0; i < I8; ++i) {
                    d0 = data[dataOff];
                    d1 = data[dataOff + 1];
                    d2 = data[dataOff + 2];
                    d3 = data[dataOff + 3];
                    d4 = data[dataOff + 4];
                    d5 = data[dataOff + 5];
                    d6 = data[dataOff + 6];
                    d7 = data[dataOff + 7];

                    var tmp0 = d0 + d7;
                    var tmp7 = d0 - d7;
                    var tmp1 = d1 + d6;
                    var tmp6 = d1 - d6;
                    var tmp2 = d2 + d5;
                    var tmp5 = d2 - d5;
                    var tmp3 = d3 + d4;
                    var tmp4 = d3 - d4;

                    /* Even part */
                    var tmp10 = tmp0 + tmp3;    /* phase 2 */
                    var tmp13 = tmp0 - tmp3;
                    var tmp11 = tmp1 + tmp2;
                    var tmp12 = tmp1 - tmp2;

                    data[dataOff] = tmp10 + tmp11; /* phase 3 */
                    data[dataOff + 4] = tmp10 - tmp11;

                    var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
                    data[dataOff + 2] = tmp13 + z1; /* phase 5 */
                    data[dataOff + 6] = tmp13 - z1;

                    /* Odd part */
                    tmp10 = tmp4 + tmp5; /* phase 2 */
                    tmp11 = tmp5 + tmp6;
                    tmp12 = tmp6 + tmp7;

                    /* The rotator is modified from fig 4-8 to avoid extra negations. */
                    var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
                    var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
                    var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
                    var z3 = tmp11 * 0.707106781; /* c4 */

                    var z11 = tmp7 + z3;    /* phase 5 */
                    var z13 = tmp7 - z3;

                    data[dataOff + 5] = z13 + z2; /* phase 6 */
                    data[dataOff + 3] = z13 - z2;
                    data[dataOff + 1] = z11 + z4;
                    data[dataOff + 7] = z11 - z4;

                    dataOff += 8; /* advance pointer to next row */
                }

                /* Pass 2: process columns. */
                dataOff = 0;
                for (i = 0; i < I8; ++i) {
                    d0 = data[dataOff];
                    d1 = data[dataOff + 8];
                    d2 = data[dataOff + 16];
                    d3 = data[dataOff + 24];
                    d4 = data[dataOff + 32];
                    d5 = data[dataOff + 40];
                    d6 = data[dataOff + 48];
                    d7 = data[dataOff + 56];

                    var tmp0p2 = d0 + d7;
                    var tmp7p2 = d0 - d7;
                    var tmp1p2 = d1 + d6;
                    var tmp6p2 = d1 - d6;
                    var tmp2p2 = d2 + d5;
                    var tmp5p2 = d2 - d5;
                    var tmp3p2 = d3 + d4;
                    var tmp4p2 = d3 - d4;

                    /* Even part */
                    var tmp10p2 = tmp0p2 + tmp3p2;  /* phase 2 */
                    var tmp13p2 = tmp0p2 - tmp3p2;
                    var tmp11p2 = tmp1p2 + tmp2p2;
                    var tmp12p2 = tmp1p2 - tmp2p2;

                    data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
                    data[dataOff + 32] = tmp10p2 - tmp11p2;

                    var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
                    data[dataOff + 16] = tmp13p2 + z1p2; /* phase 5 */
                    data[dataOff + 48] = tmp13p2 - z1p2;

                    /* Odd part */
                    tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
                    tmp11p2 = tmp5p2 + tmp6p2;
                    tmp12p2 = tmp6p2 + tmp7p2;

                    /* The rotator is modified from fig 4-8 to avoid extra negations. */
                    var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
                    var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
                    var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
                    var z3p2 = tmp11p2 * 0.707106781; /* c4 */

                    var z11p2 = tmp7p2 + z3p2;  /* phase 5 */
                    var z13p2 = tmp7p2 - z3p2;

                    data[dataOff + 40] = z13p2 + z2p2; /* phase 6 */
                    data[dataOff + 24] = z13p2 - z2p2;
                    data[dataOff + 8] = z11p2 + z4p2;
                    data[dataOff + 56] = z11p2 - z4p2;

                    dataOff++; /* advance pointer to next column */
                }

                // Quantize/descale the coefficients
                var fDCTQuant;
                for (i = 0; i < I64; ++i) {
                    // Apply the quantization and scaling factor & Round to nearest integer
                    fDCTQuant = data[i] * fdtbl[i];
                    outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5) | 0) : ((fDCTQuant - 0.5) | 0);
                    //outputfDCTQuant[i] = fround(fDCTQuant);

                }
                return outputfDCTQuant;
            }

            function writeAPP0() {
                writeWord(0xFFE0); // marker
                writeWord(16); // length
                writeByte(0x4A); // J
                writeByte(0x46); // F
                writeByte(0x49); // I
                writeByte(0x46); // F
                writeByte(0); // = "JFIF",'\0'
                writeByte(1); // versionhi
                writeByte(1); // versionlo
                writeByte(0); // xyunits
                writeWord(1); // xdensity
                writeWord(1); // ydensity
                writeByte(0); // thumbnwidth
                writeByte(0); // thumbnheight
            }

            function writeSOF0(width, height) {
                writeWord(0xFFC0); // marker
                writeWord(17);   // length, truecolor YUV JPG
                writeByte(8);    // precision
                writeWord(height);
                writeWord(width);
                writeByte(3);    // nrofcomponents
                writeByte(1);    // IdY
                writeByte(0x11); // HVY
                writeByte(0);    // QTY
                writeByte(2);    // IdU
                writeByte(0x11); // HVU
                writeByte(1);    // QTU
                writeByte(3);    // IdV
                writeByte(0x11); // HVV
                writeByte(1);    // QTV
            }

            function writeDQT() {
                writeWord(0xFFDB); // marker
                writeWord(132);    // length
                writeByte(0);
                for (var i = 0; i < 64; i++) {
                    writeByte(YTable[i]);
                }
                writeByte(1);
                for (var j = 0; j < 64; j++) {
                    writeByte(UVTable[j]);
                }
            }

            function writeDHT() {
                writeWord(0xFFC4); // marker
                writeWord(0x01A2); // length

                writeByte(0); // HTYDCinfo
                for (var i = 0; i < 16; i++) {
                    writeByte(std_dc_luminance_nrcodes[i + 1]);
                }
                for (var j = 0; j <= 11; j++) {
                    writeByte(std_dc_luminance_values[j]);
                }

                writeByte(0x10); // HTYACinfo
                for (var k = 0; k < 16; k++) {
                    writeByte(std_ac_luminance_nrcodes[k + 1]);
                }
                for (var l = 0; l <= 161; l++) {
                    writeByte(std_ac_luminance_values[l]);
                }

                writeByte(1); // HTUDCinfo
                for (var m = 0; m < 16; m++) {
                    writeByte(std_dc_chrominance_nrcodes[m + 1]);
                }
                for (var n = 0; n <= 11; n++) {
                    writeByte(std_dc_chrominance_values[n]);
                }

                writeByte(0x11); // HTUACinfo
                for (var o = 0; o < 16; o++) {
                    writeByte(std_ac_chrominance_nrcodes[o + 1]);
                }
                for (var p = 0; p <= 161; p++) {
                    writeByte(std_ac_chrominance_values[p]);
                }
            }

            function writeSOS() {
                writeWord(0xFFDA); // marker
                writeWord(12); // length
                writeByte(3); // nrofcomponents
                writeByte(1); // IdY
                writeByte(0); // HTY
                writeByte(2); // IdU
                writeByte(0x11); // HTU
                writeByte(3); // IdV
                writeByte(0x11); // HTV
                writeByte(0); // Ss
                writeByte(0x3f); // Se
                writeByte(0); // Bf
            }

            function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
                var EOB = HTAC[0x00];
                var M16zeroes = HTAC[0xF0];
                var pos;
                var I16 = 16;
                var I63 = 63;
                var I64 = 64;
                var DU_DCT = fDCTQuant(CDU, fdtbl);
                //ZigZag reorder
                for (var j = 0; j < I64; ++j) {
                    DU[ZigZag[j]] = DU_DCT[j];
                }
                var Diff = DU[0] - DC; DC = DU[0];
                //Encode DC
                if (Diff == 0) {
                    writeBits(HTDC[0]); // Diff might be 0
                } else {
                    pos = 32767 + Diff;
                    writeBits(HTDC[category[pos]]);
                    writeBits(bitcode[pos]);
                }
                //Encode ACs
                var end0pos = 63; // was const... which is crazy
                for (; (end0pos > 0) && (DU[end0pos] == 0); end0pos--) { };
                //end0pos = first element in reverse order !=0
                if (end0pos == 0) {
                    writeBits(EOB);
                    return DC;
                }
                var i = 1;
                var lng;
                while (i <= end0pos) {
                    var startpos = i;
                    for (; (DU[i] == 0) && (i <= end0pos); ++i) { }
                    var nrzeroes = i - startpos;
                    if (nrzeroes >= I16) {
                        lng = nrzeroes >> 4;
                        for (var nrmarker = 1; nrmarker <= lng; ++nrmarker)
                            writeBits(M16zeroes);
                        nrzeroes = nrzeroes & 0xF;
                    }
                    pos = 32767 + DU[i];
                    writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
                    writeBits(bitcode[pos]);
                    i++;
                }
                if (end0pos != I63) {
                    writeBits(EOB);
                }
                return DC;
            }

            function initCharLookupTable() {
                var sfcc = String.fromCharCode;
                for (var i = 0; i < 256; i++) { ///// ACHTUNG // 255
                    clt[i] = sfcc(i);
                }
            }

            this.encode = function (image, quality) // image data object
            {
                // var time_start = new Date().getTime();

                if (quality) setQuality(quality);

                // Initialize bit writer
                byteout = new Array();
                bytenew = 0;
                bytepos = 7;

                // Add JPEG headers
                writeWord(0xFFD8); // SOI
                writeAPP0();
                writeDQT();
                writeSOF0(image.width, image.height);
                writeDHT();
                writeSOS();


                // Encode 8x8 macroblocks
                var DCY = 0;
                var DCU = 0;
                var DCV = 0;

                bytenew = 0;
                bytepos = 7;


                this.encode.displayName = "_encode_";

                var imageData = image.data;
                var width = image.width;
                var height = image.height;

                var quadWidth = width * 4;
                var tripleWidth = width * 3;

                var x, y = 0;
                var r, g, b;
                var start, p, col, row, pos;
                while (y < height) {
                    x = 0;
                    while (x < quadWidth) {
                        start = quadWidth * y + x;
                        p = start;
                        col = -1;
                        row = 0;

                        for (pos = 0; pos < 64; pos++) {
                            row = pos >> 3;// /8
                            col = (pos & 7) * 4; // %8
                            p = start + (row * quadWidth) + col;

                            if (y + row >= height) { // padding bottom
                                p -= (quadWidth * (y + 1 + row - height));
                            }

                            if (x + col >= quadWidth) { // padding right
                                p -= ((x + col) - quadWidth + 4)
                            }

                            r = imageData[p++];
                            g = imageData[p++];
                            b = imageData[p++];


                            /* // calculate YUV values dynamically
                            YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
                            UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
                            VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
                            */

                            // use lookup table (slightly faster)
                            YDU[pos] = ((RGB_YUV_TABLE[r] + RGB_YUV_TABLE[(g + 256) >> 0] + RGB_YUV_TABLE[(b + 512) >> 0]) >> 16) - 128;
                            UDU[pos] = ((RGB_YUV_TABLE[(r + 768) >> 0] + RGB_YUV_TABLE[(g + 1024) >> 0] + RGB_YUV_TABLE[(b + 1280) >> 0]) >> 16) - 128;
                            VDU[pos] = ((RGB_YUV_TABLE[(r + 1280) >> 0] + RGB_YUV_TABLE[(g + 1536) >> 0] + RGB_YUV_TABLE[(b + 1792) >> 0]) >> 16) - 128;

                        }

                        DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
                        DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
                        DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
                        x += 32;
                    }
                    y += 8;
                }


                ////////////////////////////////////////////////////////////////

                // Do the bit alignment of the EOI marker
                if (bytepos >= 0) {
                    var fillbits = [];
                    fillbits[1] = bytepos + 1;
                    fillbits[0] = (1 << (bytepos + 1)) - 1;
                    writeBits(fillbits);
                }

                writeWord(0xFFD9); //EOI

                var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));

                byteout = [];

                // benchmarking
                // var duration = new Date().getTime() - time_start;
                // console.log('Encoding time: '+ currentQuality + 'ms');
                //

                return jpegDataUri
            }

            function setQuality(quality) {
                if (quality <= 0) {
                    quality = 1;
                }
                if (quality > 100) {
                    quality = 100;
                }

                if (currentQuality == quality) return // don't recalc if unchanged

                var sf = 0;
                if (quality < 50) {
                    sf = Math.floor(5000 / quality);
                } else {
                    sf = Math.floor(200 - quality * 2);
                }

                initQuantTables(sf);
                currentQuality = quality;
                // console.log('Quality set to: '+quality +'%');
            }

            function init() {
                // var time_start = new Date().getTime();
                if (!quality) quality = 50;
                // Create tables
                initCharLookupTable()
                initHuffmanTbl();
                initCategoryNumber();
                initRGBYUVTable();

                setQuality(quality);
                // var duration = new Date().getTime() - time_start;
                // console.log('Initialization '+ duration + 'ms');
            }

            init();

        };

        JPEGEncoder.encode = function (data, quality) {
            var encoder = new JPEGEncoder(quality);

            return encoder.encode(data);
        }

        return JPEGEncoder;
    });
    /**
     * @fileOverview Fix android canvas.toDataUrl bug.
     */
    define('runtime/html5/androidpatch', [
        'runtime/html5/util',
        'runtime/html5/jpegencoder',
        'base'
    ], function (Util, encoder, Base) {
        var origin = Util.canvasToDataUrl,
            supportJpeg;

        Util.canvasToDataUrl = function (canvas, type, quality) {
            var ctx, w, h, fragement, parts;

            // 非android手机直接跳過。
            if (!Base.os.android) {
                return origin.apply(null, arguments);
            }

            // 检测是否canvas支持jpeg导出，根据資料格式來判断。
            // JPEG 前兩位分别是：255, 216
            if (type === 'image/jpeg' && typeof supportJpeg === 'undefined') {
                fragement = origin.apply(null, arguments);

                parts = fragement.split(',');

                if (~parts[0].indexOf('base64')) {
                    fragement = atob(parts[1]);
                } else {
                    fragement = decodeURIComponent(parts[1]);
                }

                fragement = fragement.substring(0, 2);

                supportJpeg = fragement.charCodeAt(0) === 255 &&
                    fragement.charCodeAt(1) === 216;
            }

            // 只有在android環境下才修复
            if (type === 'image/jpeg' && !supportJpeg) {
                w = canvas.width;
                h = canvas.height;
                ctx = canvas.getContext('2d');

                return encoder.encode(ctx.getImageData(0, 0, w, h), quality);
            }

            return origin.apply(null, arguments);
        };
    });
    /**
     * @fileOverview Image
     */
    define('runtime/html5/image', [
        'base',
        'runtime/html5/runtime',
        'runtime/html5/util'
    ], function (Base, Html5Runtime, Util) {

        var BLANK = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

        return Html5Runtime.register('Image', {

            // flag: 標記是否被修改過。
            modified: false,

            init: function () {
                var me = this,
                    img = new Image();

                img.onload = function () {

                    me._info = {
                        type: me.type,
                        width: this.width,
                        height: this.height
                    };

                    // 读取meta信息。
                    if (!me._metas && 'image/jpeg' === me.type) {
                        Util.parseMeta(me._blob, function (error, ret) {
                            me._metas = ret;
                            me.owner.trigger('load');
                        });
                    } else {
                        me.owner.trigger('load');
                    }
                };

                img.onerror = function () {
                    me.owner.trigger('error');
                };

                me._img = img;
            },

            loadFromBlob: function (blob) {
                var me = this,
                    img = me._img;

                me._blob = blob;
                me.type = blob.type;
                img.src = Util.createObjectURL(blob.getSource());
                me.owner.once('load', function () {
                    Util.revokeObjectURL(img.src);
                });
            },

            resize: function (width, height) {
                var canvas = this._canvas ||
                    (this._canvas = document.createElement('canvas'));

                this._resize(this._img, canvas, width, height);
                this._blob = null;    // 没用了，可以删掉了。
                this.modified = true;
                this.owner.trigger('complete');
            },

            getAsBlob: function (type) {
                var blob = this._blob,
                    opts = this.options,
                    canvas;

                type = type || this.type;

                // blob需要重新生成。
                if (this.modified || this.type !== type) {
                    canvas = this._canvas;

                    if (type === 'image/jpeg') {

                        blob = Util.canvasToDataUrl(canvas, 'image/jpeg',
                            opts.quality);

                        if (opts.preserveHeaders && this._metas &&
                            this._metas.imageHead) {

                            blob = Util.dataURL2ArrayBuffer(blob);
                            blob = Util.updateImageHead(blob,
                                this._metas.imageHead);
                            blob = Util.arrayBufferToBlob(blob, type);
                            return blob;
                        }
                    } else {
                        blob = Util.canvasToDataUrl(canvas, type);
                    }

                    blob = Util.dataURL2Blob(blob);
                }

                return blob;
            },

            getAsDataUrl: function (type) {
                var opts = this.options;

                type = type || this.type;

                if (type === 'image/jpeg') {
                    return Util.canvasToDataUrl(this._canvas, type, opts.quality);
                } else {
                    return this._canvas.toDataURL(type);
                }
            },

            getOrientation: function () {
                return this._metas && this._metas.exif &&
                    this._metas.exif.get('Orientation') || 1;
            },

            info: function (val) {

                // setter
                if (val) {
                    this._info = val;
                    return this;
                }

                // getter
                return this._info;
            },

            meta: function (val) {

                // setter
                if (val) {
                    this._meta = val;
                    return this;
                }

                // getter
                return this._meta;
            },

            destroy: function () {
                var canvas = this._canvas;
                this._img.onload = null;

                if (canvas) {
                    canvas.getContext('2d')
                        .clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = canvas.height = 0;
                    this._canvas = null;
                }

                // 释放内存。非常重要，否則释放不了image的内存。
                this._img.src = BLANK;
                this._img = this._blob = null;
            },

            _resize: function (img, cvs, width, height) {
                var opts = this.options,
                    naturalWidth = img.width,
                    naturalHeight = img.height,
                    orientation = this.getOrientation(),
                    scale, w, h, x, y;

                // values that require 90 degree rotation
                if (~[5, 6, 7, 8].indexOf(orientation)) {

                    // 交换width, height的值。
                    width ^= height;
                    height ^= width;
                    width ^= height;
                }

                scale = Math[opts.crop ? 'max' : 'min'](width / naturalWidth,
                    height / naturalHeight);

                // 不允许放大。
                opts.allowMagnify || (scale = Math.min(1, scale));

                w = naturalWidth * scale;
                h = naturalHeight * scale;

                if (opts.crop) {
                    cvs.width = width;
                    cvs.height = height;
                } else {
                    cvs.width = w;
                    cvs.height = h;
                }

                x = (cvs.width - w) / 2;
                y = (cvs.height - h) / 2;

                opts.preserveHeaders || this._rotate2Orientaion(cvs, orientation);

                this._renderImageToCanvas(cvs, img, x, y, w, h);
            },

            _rotate2Orientaion: function (canvas, orientation) {
                var width = canvas.width,
                    height = canvas.height,
                    ctx = canvas.getContext('2d');

                switch (orientation) {
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        canvas.width = height;
                        canvas.height = width;
                        break;
                }

                switch (orientation) {
                    case 2:    // horizontal flip
                        ctx.translate(width, 0);
                        ctx.scale(-1, 1);
                        break;

                    case 3:    // 180 rotate left
                        ctx.translate(width, height);
                        ctx.rotate(Math.PI);
                        break;

                    case 4:    // vertical flip
                        ctx.translate(0, height);
                        ctx.scale(1, -1);
                        break;

                    case 5:    // vertical flip + 90 rotate right
                        ctx.rotate(0.5 * Math.PI);
                        ctx.scale(1, -1);
                        break;

                    case 6:    // 90 rotate right
                        ctx.rotate(0.5 * Math.PI);
                        ctx.translate(0, -height);
                        break;

                    case 7:    // horizontal flip + 90 rotate right
                        ctx.rotate(0.5 * Math.PI);
                        ctx.translate(width, -height);
                        ctx.scale(-1, 1);
                        break;

                    case 8:    // 90 rotate left
                        ctx.rotate(-0.5 * Math.PI);
                        ctx.translate(-width, 0);
                        break;
                }
            },

            // https://github.com/stomita/ios-imagefile-megapixel/
            // blob/master/src/megapix-image.js
            _renderImageToCanvas: (function () {

                // 如果不是ios, 不需要这麼复杂！
                if (!Base.os.ios) {
                    return function (canvas, img, x, y, w, h) {
                        canvas.getContext('2d').drawImage(img, x, y, w, h);
                    };
                }

                /**
                 * Detecting vertical squash in loaded image.
                 * Fixes a bug which squash image vertically while drawing into
                 * canvas for some images.
                 */
                function detectVerticalSquash(img, iw, ih) {
                    var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'),
                        sy = 0,
                        ey = ih,
                        py = ih,
                        data, alpha, ratio;


                    canvas.width = 1;
                    canvas.height = ih;
                    ctx.drawImage(img, 0, 0);
                    data = ctx.getImageData(0, 0, 1, ih).data;

                    // search image edge pixel position in case
                    // it is squashed vertically.
                    while (py > sy) {
                        alpha = data[(py - 1) * 4 + 3];

                        if (alpha === 0) {
                            ey = py;
                        } else {
                            sy = py;
                        }

                        py = (ey + sy) >> 1;
                    }

                    ratio = (py / ih);
                    return (ratio === 0) ? 1 : ratio;
                }

                // fix ie7 bug
                // http://stackoverflow.com/questions/11929099/
                // html5-canvas-drawimage-ratio-bug-ios
                if (Base.os.ios >= 7) {
                    return function (canvas, img, x, y, w, h) {
                        var iw = img.naturalWidth,
                            ih = img.naturalHeight,
                            vertSquashRatio = detectVerticalSquash(img, iw, ih);

                        return canvas.getContext('2d').drawImage(img, 0, 0,
                            iw * vertSquashRatio, ih * vertSquashRatio,
                            x, y, w, h);
                    };
                }

                /**
                 * Detect subsampling in loaded image.
                 * In iOS, larger images than 2M pixels may be
                 * subsampled in rendering.
                 */
                function detectSubsampling(img) {
                    var iw = img.naturalWidth,
                        ih = img.naturalHeight,
                        canvas, ctx;

                    // subsampling may happen overmegapixel image
                    if (iw * ih > 1024 * 1024) {
                        canvas = document.createElement('canvas');
                        canvas.width = canvas.height = 1;
                        ctx = canvas.getContext('2d');
                        ctx.drawImage(img, -iw + 1, 0);

                        // subsampled image becomes half smaller in rendering size.
                        // check alpha channel value to confirm image is covering
                        // edge pixel or not. if alpha value is 0
                        // image is not covering, hence subsampled.
                        return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
                    } else {
                        return false;
                    }
                }


                return function (canvas, img, x, y, width, height) {
                    var iw = img.naturalWidth,
                        ih = img.naturalHeight,
                        ctx = canvas.getContext('2d'),
                        subsampled = detectSubsampling(img),
                        doSquash = this.type === 'image/jpeg',
                        d = 1024,
                        sy = 0,
                        dy = 0,
                        tmpCanvas, tmpCtx, vertSquashRatio, dw, dh, sx, dx;

                    if (subsampled) {
                        iw /= 2;
                        ih /= 2;
                    }

                    ctx.save();
                    tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = tmpCanvas.height = d;

                    tmpCtx = tmpCanvas.getContext('2d');
                    vertSquashRatio = doSquash ?
                        detectVerticalSquash(img, iw, ih) : 1;

                    dw = Math.ceil(d * width / iw);
                    dh = Math.ceil(d * height / ih / vertSquashRatio);

                    while (sy < ih) {
                        sx = 0;
                        dx = 0;
                        while (sx < iw) {
                            tmpCtx.clearRect(0, 0, d, d);
                            tmpCtx.drawImage(img, -sx, -sy);
                            ctx.drawImage(tmpCanvas, 0, 0, d, d,
                                x + dx, y + dy, dw, dh);
                            sx += d;
                            dx += dw;
                        }
                        sy += d;
                        dy += dh;
                    }
                    ctx.restore();
                    tmpCanvas = tmpCtx = null;
                };
            })()
        });
    });
    /**
     * @fileOverview Transport
     * @todo 支持chunked傳输，优势：
     * 可以將大檔案分成小块，挨個傳输，可以提高大檔案成功率，当失败的時候，也只需要重傳那小部分，
     * 而不需要重头再傳一次。另外断点續傳也需要用chunked方式。
     */
    define('runtime/html5/transport', [
        'base',
        'runtime/html5/runtime'
    ], function (Base, Html5Runtime) {

        var noop = Base.noop,
            $ = Base.$;

        return Html5Runtime.register('Transport', {
            init: function () {
                this._status = 0;
                this._response = null;
            },

            send: function () {
                var owner = this.owner,
                    opts = this.options,
                    xhr = this._initAjax(),
                    blob = owner._blob,
                    server = opts.server,
                    formData, binary, fr;

                if (opts.sendAsBinary) {
                    server += (/\?/.test(server) ? '&' : '?') +
                        $.param(owner._formData);

                    binary = blob.getSource();
                } else {
                    formData = new FormData();
                    $.each(owner._formData, function (k, v) {
                        formData.append(k, v);
                    });

                    formData.append(opts.fileVal, blob.getSource(),
                        opts.filename || owner._formData.name || '');
                }

                if (opts.withCredentials && 'withCredentials' in xhr) {
                    xhr.open(opts.method, server, true);
                    xhr.withCredentials = true;
                } else {
                    xhr.open(opts.method, server);
                }

                this._setRequestHeader(xhr, opts.headers);

                if (binary) {
                    xhr.overrideMimeType('application/octet-stream');

                    // android直接发送blob會导致服务端接收到的是空檔案。
                    // bug详情。
                    // https://code.google.com/p/android/issues/detail?id=39882
                    // 所以先用fileReader读取出來再通過arraybuffer的方式发送。
                    if (Base.os.android) {
                        fr = new FileReader();

                        fr.onload = function () {
                            xhr.send(this.result);
                            fr = fr.onload = null;
                        };

                        fr.readAsArrayBuffer(binary);
                    } else {
                        xhr.send(binary);
                    }
                } else {
                    xhr.send(formData);
                }
            },

            getResponse: function () {
                return this._response;
            },

            getResponseAsJson: function () {
                return this._parseJson(this._response);
            },

            getStatus: function () {
                return this._status;
            },

            abort: function () {
                var xhr = this._xhr;

                if (xhr) {
                    xhr.upload.onprogress = noop;
                    xhr.onreadystatechange = noop;
                    xhr.abort();

                    this._xhr = xhr = null;
                }
            },

            destroy: function () {
                this.abort();
            },

            _initAjax: function () {
                var me = this,
                    xhr = new XMLHttpRequest(),
                    opts = this.options;

                if (opts.withCredentials && !('withCredentials' in xhr) &&
                    typeof XDomainRequest !== 'undefined') {
                    xhr = new XDomainRequest();
                }

                xhr.upload.onprogress = function (e) {
                    var percentage = 0;

                    if (e.lengthComputable) {
                        percentage = e.loaded / e.total;
                    }

                    return me.trigger('progress', percentage);
                };

                xhr.onreadystatechange = function () {

                    if (xhr.readyState !== 4) {
                        return;
                    }

                    xhr.upload.onprogress = noop;
                    xhr.onreadystatechange = noop;
                    me._xhr = null;
                    me._status = xhr.status;

                    if (xhr.status >= 200 && xhr.status < 300) {
                        me._response = xhr.responseText;
                        return me.trigger('load');
                    } else if (xhr.status >= 500 && xhr.status < 600) {
                        me._response = xhr.responseText;
                        return me.trigger('error', 'server');
                    }


                    return me.trigger('error', me._status ? 'http' : 'abort');
                };

                me._xhr = xhr;
                return xhr;
            },

            _setRequestHeader: function (xhr, headers) {
                $.each(headers, function (key, val) {
                    xhr.setRequestHeader(key, val);
                });
            },

            _parseJson: function (str) {
                var json;

                try {
                    json = JSON.parse(str);
                } catch (ex) {
                    json = {};
                }

                return json;
            }
        });
    });
    /**
     * @fileOverview FlashRuntime
     */
    define('runtime/flash/runtime', [
        'base',
        'runtime/runtime',
        'runtime/compbase'
    ], function (Base, Runtime, CompBase) {

        var $ = Base.$,
            type = 'flash',
            components = {};


        function getFlashVersion() {
            var version;

            try {
                version = navigator.plugins['Shockwave Flash'];
                version = version.description;
            } catch (ex) {
                try {
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                        .GetVariable('$version');
                } catch (ex2) {
                    version = '0.0';
                }
            }
            version = version.match(/\d+/g);
            return parseFloat(version[0] + '.' + version[1], 10);
        }

        function FlashRuntime() {
            var pool = {},
                clients = {},
                destory = this.destory,
                me = this,
                jsreciver = Base.guid('webuploader_');

            Runtime.apply(me, arguments);
            me.type = type;


            // 这個方法的調用者，實际上是RuntimeClient
            me.exec = function (comp, fn/*, args...*/) {
                var client = this,
                    uid = client.uid,
                    args = Base.slice(arguments, 2),
                    instance;

                clients[uid] = client;

                if (components[comp]) {
                    if (!pool[uid]) {
                        pool[uid] = new components[comp](client, me);
                    }

                    instance = pool[uid];

                    if (instance[fn]) {
                        return instance[fn].apply(instance, args);
                    }
                }

                return me.flashExec.apply(client, arguments);
            };

            function handler(evt, obj) {
                var type = evt.type || evt,
                    parts, uid;

                parts = type.split('::');
                uid = parts[0];
                type = parts[1];

                // console.log.apply( console, arguments );

                if (type === 'Ready' && uid === me.uid) {
                    me.trigger('ready');
                } else if (clients[uid]) {
                    clients[uid].trigger(type.toLowerCase(), evt, obj);
                }

                // Base.log( evt, obj );
            }

            // flash的接受器。
            window[jsreciver] = function () {
                var args = arguments;

                // 為了能捕获得到。
                setTimeout(function () {
                    handler.apply(null, args);
                }, 1);
            };

            this.jsreciver = jsreciver;

            this.destory = function () {
                // @todo 删除池子中的所有實例
                return destory && destory.apply(this, arguments);
            };

            this.flashExec = function (comp, fn) {
                var flash = me.getFlash(),
                    args = Base.slice(arguments, 2);

                return flash.exec(this.uid, comp, fn, args);
            };

            // @todo
        }

        Base.inherits(Runtime, {
            constructor: FlashRuntime,

            init: function () {
                var container = this.getContainer(),
                    opts = this.options,
                    html;

                // if not the minimal height, shims are not initialized
                // in older browsers (e.g FF3.6, IE6,7,8, Safari 4.0,5.0, etc)
                container.css({
                    position: 'absolute',
                    top: '-8px',
                    left: '-8px',
                    width: '9px',
                    height: '9px',
                    overflow: 'hidden'
                });

                // insert flash object
                html = '<object id="' + this.uid + '" type="application/' +
                    'x-shockwave-flash" data="' + opts.swf + '" ';

                if (Base.browser.ie) {
                    html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                }

                html += 'width="100%" height="100%" style="outline:0">' +
                    '<param name="movie" value="' + opts.swf + '" />' +
                    '<param name="flashvars" value="uid=' + this.uid +
                    '&jsreciver=' + this.jsreciver + '" />' +
                    '<param name="wmode" value="transparent" />' +
                    '<param name="allowscriptaccess" value="always" />' +
                    '</object>';

                container.html(html);
            },

            getFlash: function () {
                if (this._flash) {
                    return this._flash;
                }

                this._flash = $('#' + this.uid).get(0);
                return this._flash;
            }

        });

        FlashRuntime.register = function (name, component) {
            component = components[name] = Base.inherits(CompBase, $.extend({

                // @todo fix this later
                flashExec: function () {
                    var owner = this.owner,
                        runtime = this.getRuntime();

                    return runtime.flashExec.apply(owner, arguments);
                }
            }, component));

            return component;
        };

        if (getFlashVersion() >= 11.4) {
            Runtime.addRuntime(type, FlashRuntime);
        }

        return FlashRuntime;
    });
    /**
     * @fileOverview FilePicker
     */
    define('runtime/flash/filepicker', [
        'base',
        'runtime/flash/runtime'
    ], function (Base, FlashRuntime) {
        var $ = Base.$;

        return FlashRuntime.register('FilePicker', {
            init: function (opts) {
                var copy = $.extend({}, opts),
                    len, i;

                // 修复Flash再没有设置title的情况下無法彈出flash檔案选择框的bug.
                len = copy.accept && copy.accept.length;
                for (i = 0; i < len; i++) {
                    if (!copy.accept[i].title) {
                        copy.accept[i].title = 'Files';
                    }
                }

                delete copy.button;
                delete copy.container;

                this.flashExec('FilePicker', 'init', copy);
            },

            destroy: function () {
                // todo
            }
        });
    });
    /**
     * @fileOverview 圖片壓縮
     */
    define('runtime/flash/image', [
        'runtime/flash/runtime'
    ], function (FlashRuntime) {

        return FlashRuntime.register('Image', {
            // init: function( options ) {
            //     var owner = this.owner;

            //     this.flashExec( 'Image', 'init', options );
            //     owner.on( 'load', function() {
            //         debugger;
            //     });
            // },

            loadFromBlob: function (blob) {
                var owner = this.owner;

                owner.info() && this.flashExec('Image', 'info', owner.info());
                owner.meta() && this.flashExec('Image', 'meta', owner.meta());

                this.flashExec('Image', 'loadFromBlob', blob.uid);
            }
        });
    });
    /**
     * @fileOverview  Transport flash實现
     */
    define('runtime/flash/transport', [
        'base',
        'runtime/flash/runtime',
        'runtime/client'
    ], function (Base, FlashRuntime, RuntimeClient) {
        var $ = Base.$;

        return FlashRuntime.register('Transport', {
            init: function () {
                this._status = 0;
                this._response = null;
                this._responseJson = null;
            },

            send: function () {
                var owner = this.owner,
                    opts = this.options,
                    xhr = this._initAjax(),
                    blob = owner._blob,
                    server = opts.server,
                    binary;

                xhr.connectRuntime(blob.ruid);

                if (opts.sendAsBinary) {
                    server += (/\?/.test(server) ? '&' : '?') +
                        $.param(owner._formData);

                    binary = blob.uid;
                } else {
                    $.each(owner._formData, function (k, v) {
                        xhr.exec('append', k, v);
                    });

                    xhr.exec('appendBlob', opts.fileVal, blob.uid,
                        opts.filename || owner._formData.name || '');
                }

                this._setRequestHeader(xhr, opts.headers);
                xhr.exec('send', {
                    method: opts.method,
                    url: server
                }, binary);
            },

            getStatus: function () {
                return this._status;
            },

            getResponse: function () {
                return this._response;
            },

            getResponseAsJson: function () {
                return this._responseJson;
            },

            abort: function () {
                var xhr = this._xhr;

                if (xhr) {
                    xhr.exec('abort');
                    xhr.destroy();
                    this._xhr = xhr = null;
                }
            },

            destroy: function () {
                this.abort();
            },

            _initAjax: function () {
                var me = this,
                    xhr = new RuntimeClient('XMLHttpRequest');

                xhr.on('uploadprogress progress', function (e) {
                    return me.trigger('progress', e.loaded / e.total);
                });

                xhr.on('load', function () {
                    var status = xhr.exec('getStatus'),
                        err = '';

                    xhr.off();
                    me._xhr = null;

                    if (status >= 200 && status < 300) {
                        me._response = xhr.exec('getResponse');
                        me._responseJson = xhr.exec('getResponseAsJson');
                    } else if (status >= 500 && status < 600) {
                        me._response = xhr.exec('getResponse');
                        me._responseJson = xhr.exec('getResponseAsJson');
                        err = 'server';
                    } else {
                        err = 'http';
                    }

                    xhr.destroy();
                    xhr = null;

                    return err ? me.trigger('error', err) : me.trigger('load');
                });

                xhr.on('error', function () {
                    xhr.off();
                    me._xhr = null;
                    me.trigger('error', 'http');
                });

                me._xhr = xhr;
                return xhr;
            },

            _setRequestHeader: function (xhr, headers) {
                $.each(headers, function (key, val) {
                    xhr.exec('setRequestHeader', key, val);
                });
            }
        });
    });
    /**
     * @fileOverview 完全版本。
     */
    define('preset/all', [
        'base',

        // widgets
        'widgets/filednd',
        'widgets/filepaste',
        'widgets/filepicker',
        'widgets/image',
        'widgets/queue',
        'widgets/runtime',
        'widgets/upload',
        'widgets/validator',

        // runtimes
        // html5
        'runtime/html5/blob',
        'runtime/html5/dnd',
        'runtime/html5/filepaste',
        'runtime/html5/filepicker',
        'runtime/html5/imagemeta/exif',
        'runtime/html5/androidpatch',
        'runtime/html5/image',
        'runtime/html5/transport',

        // flash
        'runtime/flash/filepicker',
        'runtime/flash/image',
        'runtime/flash/transport'
    ], function (Base) {
        return Base;
    });
    define('webuploader', [
        'preset/all'
    ], function (preset) {
        return preset;
    });
    return require('webuploader');
});
