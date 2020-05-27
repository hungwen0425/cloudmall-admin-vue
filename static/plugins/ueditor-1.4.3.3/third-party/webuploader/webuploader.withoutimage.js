/*! WebUploader 0.1.2 */


/**
 * @fileOverview 让内部各個部件的程式碼可以用[amd](https://github.com/amdjs/amdjs-api/wiki/AMD)模塊定義方式組织起來。
 *
 * AMD API 内部的簡單不完全實現，請忽略。只有當WebUploader被合併成一個文件的時候才會引入。
 */
(function (root, factory) {
    var modules = {},

        // 内部require, 簡單不完全實現。
        // https://github.com/amdjs/amdjs-api/wiki/require
        _require = function (deps, callback) {
            var args, len, i;

            // 如果deps不是陣列，則直接返回指定module
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

        // 設定module, 兼容CommonJs寫法。
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

        // 根據id取得module
        getModule = function (id) {
            var module = modules[id] || root[id];

            if (!module) {
                throw new Error('`' + id + '` is undefined');
            }

            return module;
        },

        // 將所有modules，將路徑ids装換成物件。
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
     * Web Uploader内部類的詳細說明，以下提及的功能類，都可以在`WebUploader`這個變量中訪問到。
     *
     * As you know, Web Uploader的每個文件都是用過[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)规范中的`define`組织起來的, 每個Module都會有個module id.
     * 默認module id該文件的路徑，而此路徑將會轉化成名稱空間存放在WebUploader中。如：
     *
     * * module `base`：WebUploader.Base
     * * module `file`: WebUploader.File
     * * module `lib/dnd`: WebUploader.Lib.Dnd
     * * module `runtime/html5/dnd`: WebUploader.Runtime.Html5.Dnd
     *
     *
     * 以下文件將可能省略`WebUploader`前缀。
     * @module WebUploader
     * @title WebUploader API文件
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
         * 基础類，提供一些簡單常用的方法。
         * @class Base
         */
        return {

            /**
             * @property {String} version 當前版本號。
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
             * @description  簡單的瀏覽器檢查結果。
             *
             * * `webkit`  webkit版本號，如果瀏覽器為非webkit内核，此屬性為`undefined`。
             * * `chrome`  chrome瀏覽器版本號，如果瀏覽器為chrome，此屬性為`undefined`。
             * * `ie`  ie瀏覽器版本號，如果瀏覽器為非ie，此屬性為`undefined`。**暫不支持ie10+**
             * * `firefox`  firefox瀏覽器版本號，如果瀏覽器為非firefox，此屬性為`undefined`。
             * * `safari`  safari瀏覽器版本號，如果瀏覽器為非safari，此屬性為`undefined`。
             * * `opera`  opera瀏覽器版本號，如果瀏覽器為非opera，此屬性為`undefined`。
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
             * @description  操作系统檢查結果。
             *
             * * `android`  如果在android瀏覽器環境下，此值為對應的android版本號，否則為`undefined`。
             * * `ios` 如果在ios瀏覽器環境下，此值為對應的ios版本號，否則為`undefined`。
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
             * 實現類與類之間的繼承。
             * @method inherits
             * @grammar Base.inherits( super ) => child
             * @grammar Base.inherits( super, protos ) => child
             * @grammar Base.inherits( super, protos, statics ) => child
             * @param  {Class} super 父類
             * @param  {Object | Function} [protos] 子類或者物件。如果物件中包含constructor，子類將是用此屬性值。
             * @param  {Function} [protos.constructor] 子類構造器，不指定的話將創建個臨時的直接执行父類構造器的方法。
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

                // 複製静態方法
                $.extend(true, child, Super, staticProtos || {});

                /* jshint camelcase: false */

                // 让子類的__super__屬性指向父類。
                child.__super__ = Super.prototype;

                // 構建原型，添加原型方法或屬性。
                // 暫時用Object.create實現。
                child.prototype = createObject(Super.prototype);
                protos && $.extend(true, child.prototype, protos);

                return child;
            },

            /**
             * 一個不做任何事情的方法。可以用來賦值給默認的callback.
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
             * 引用Console.log如果存在的話，否則引用一個[空函數loop](#WebUploader:Base.log)。
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

                // @bug 當瀏覽器不在當前窗口時就停了。
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
             * 被[uncurrythis](http://www.2ality.com/2011/11/uncurrying-this.html)的陣列slice方法。
             * 將用來將非陣列物件轉化成陣列物件。
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
             * 格式化文件大小, 输出成带單位的字符串
             * @method formatSize
             * @grammar Base.formatSize( size ) => String
             * @grammar Base.formatSize( size, pointLength ) => String
             * @grammar Base.formatSize( size, pointLength, units ) => String
             * @param {Number} size 文件大小
             * @param {Number} [pointLength=2] 精確到的小數點數。
             * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 單位陣列。從字節，到千字節，一直往上指定。如果單位陣列裡面只指定了到了K(千字節)，同時文件大小大於M, 此方法的输出將還是顯示成多少K.
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
     * 事件處理類，可以獨立使用，也可以擴展給物件使用。
     * @fileOverview Mediator
     */
    define('mediator', [
        'base'
    ], function (Base) {
        var $ = Base.$,
            slice = [].slice,
            separator = /\s+/,
            protos;

        // 根據條件過滤出事件handlers.
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
            // 不支持物件，只支持多個event用空格隔開
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
             * `on`還可以用來添加一個特殊事件`all`, 這樣所有的事件觸發都會響應到。同時此類`callback`中的arguments有一個不同處，
             * 就是第一個参數為`type`，记入當前是什么事件在觸發。此類`callback`的優先級比脚低，會再正常`callback`执行完後觸發。
             * ```javascript
             * obj.on( 'all', function( type, arg1, arg2 ) {
             *     console.log( type, arg1, arg2 ); // => 'testa', 'arg1', 'arg2'
             * });
             * ```
             *
             * @method on
             * @grammar on( name, callback[, context] ) => self
             * @param  {String}   name     事件名，支持多個事件用空格隔開
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
             * 绑定事件，且當handler执行完後，自動解除绑定。
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
             * 觸發事件
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
         * 中介者，它本身是個單例，但可以通過[installTo](#WebUploader:Mediator:installTo)方法，使任何物件具備事件行為。
         * 主要目的是负责模塊與模塊之間的合作，降低耦合度。
         *
         * @class Mediator
         */
        return $.extend({

            /**
             * 可以通過這個接口，使任何物件具備事件功能。
             * @method installTo
             * @param  {Object} obj 需要具備事件行為的物件。
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
         *     // 開起分片上傳。
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
             * 取得或者設定Uploader設定項。
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
             * // 修改後圖片上傳前，嘗試將圖片壓縮到1600 * 1600
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
             * 取得文件统計資料。返回一個包含一下資料的物件。
             * * `successNum` 上傳成功的文件數
             * * `uploadFailNum` 上傳失败的文件數
             * * `cancelNum` 被删除的文件數
             * * `invalidNum` 無效的文件數
             * * `queueNum` 還在队列中的文件數
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

            // 需要重寫此方法來來支持opts.onEvent和instance.onEvent的處理器
            trigger: function (type/*, args...*/) {
                var args = [].slice.call(arguments, 1),
                    opts = this.options,
                    name = 'on' + type.substring(0, 1).toUpperCase() +
                        type.substring(1);

                if (
                    // 調用通過on方法註冊的handler.
                    Mediator.trigger.apply(this, arguments) === false ||

                    // 調用opts.onEvent
                    $.isFunction(opts[name]) &&
                    opts[name].apply(this, args) === false ||

                    // 調用this.onEvent
                    $.isFunction(this[name]) &&
                    this[name].apply(this, args) === false ||

                    // 廣播所有uploader的事件。
                    Mediator.trigger.apply(Mediator,
                        [this, type].concat(args)) === false) {

                    return false;
                }

                return true;
            },

            // widgets/widget.js將补充此方法的詳細文件。
            request: Base.noop
        });

        /**
         * 創建Uploader實例，等同于new Uploader( opts );
         * @method create
         * @class Base
         * @static
         * @grammar Base.create( opts ) => Uploader
         */
        Base.create = Uploader.create = function (opts) {
            return new Uploader(opts);
        };

        // 暴露Uploader，可以通過它來擴展業務邏輯。
        Base.Uploader = Uploader;

        return Uploader;
    });
    /**
     * @fileOverview Runtime管理器，负责Runtime的選擇, 連接
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
         * 添加Runtime實現。
         * @param {String} type    類型
         * @param {Runtime} factory 具體Runtime實現。
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
     * @fileOverview Runtime管理器，负责Runtime的選擇, 連接
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

            // 允许runtime没有初始化之前，註冊一些方法在初始化後执行。
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

                // 像filePicker只能獨立存在，不能公用。
                runtime = runtime || cache.get(null, standalone);

                // 需要創建
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
     * @fileOverview 錯誤資料
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
     * @fileOverview 組件基類。
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

            // 類Backbone的事件監听声明，監听uploader實例上的事件
            // widget直接無法監听事件，事件只能通過uploader來傳递
            invoke: function (apiName, args) {

                /*
                    {
                        'make-thumb': 'makeThumb'
                    }
                 */
                var map = this.responseMap;

                // 如果無API響應声明則忽略
                if (!map || !(apiName in map) || !(map[apiName] in this) ||
                    !$.isFunction(this[map[apiName]])) {

                    return IGNORE;
                }

                return this[map[apiName]].apply(this, args);

            },

            /**
             * 發送命令。當傳入`callback`或者`handler`中返回`promise`時。返回一個當所有`handler`中的promise都完成後完成的新`promise`。
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

            // 覆寫_init用來初始化widgets
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

                // 如果有callback，則用异步方式。
                if (callback || dfds.length) {
                    promise = Base.when.apply(Base, dfds);
                    key = promise.pipe ? 'pipe' : 'then';

                    // 很重要不能删除。删除了會死循環。
                    // 保證执行順序。让callback總是在下一個tick中执行。
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
         * 添加組件
         * @param  {object} widgetProto 組件原型，構造函數通過constructor屬性定義
         * @param  {object} responseMap API名稱與函數實現的映射
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
         * @property {Selector} [dnd=undefined]  指定Drag And Drop托拽的容器，如果不指定，則不啟動。
         * @namespace options
         * @for Uploader
         */

        /**
         * @event dndAccept
         * @param {DataTransferItemList} items DataTransferItem
         * @description 阻止此事件可以拒绝某些類型的文件拖入進來。目前只有 chrome 提供這樣的 API，且只能通過 mime-type 驗證。
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

                // 檢测文件是否全部允许添加。
                dnd.on('accept', function (items) {
                    return me.owner.trigger('dndAccept', items);
                });

                dnd.init();

                return deferred.promise();
            }
        });
    });

    /**
     * @fileOverview 錯誤資料
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
     * @fileOverview 組件基類。
     */
    define('widgets/filepaste', [
        'base',
        'uploader',
        'lib/filepaste',
        'widgets/widget'
    ], function (Base, Uploader, FilePaste) {
        var $ = Base.$;

        /**
         * @property {Selector} [paste=undefined]  指定監听paste事件的容器，如果不指定，不啟用此功能。此功能為通過粘贴來添加截屏的圖片。建議設定為`document.body`.
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
     * 以至于要調用Flash裡面的File，也可以像調用HTML5版本的File一下。
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

            // todo 支持其他類型文件的轉換。

            // 如果有mimetype, 但是文件名裡面没有找出後缀规律
            if (!ext && this.type) {
                ext = /\/(jpg|jpeg|png|gif|bmp)$/i.exec(this.type) ?
                    RegExp.$1.toLowerCase() : '';
                this.name += '.' + ext;
            }

            // 如果没有指定mimetype, 但是知道文件後缀。
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
     * @fileOverview 錯誤資料
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

                                // 记入來源。
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
     * @fileOverview 文件選擇相關
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
             * @description 指定選擇文件的按钮容器，不指定則不創建按钮。
             *
             * * `id` {Seletor} 指定選擇文件的按钮容器，不指定則不創建按钮。
             * * `label` {String} 請采用 `innerHTML` 代替
             * * `innerHTML` {String} 指定按钮文字。不指定時優先從指定的容器中看是否自带文字。
             * * `multiple` {Boolean} 是否開起同時選擇多個文件能力。
             */
            pick: null,

            /**
             * @property {Arroy} [accept=null]
             * @namespace options
             * @for Uploader
             * @description 指定接受哪些類型的文件。 由於目前還有ext轉mimeType表，所以這裡需要分開指定。
             *
             * * `title` {String} 文字描述
             * * `extensions` {String} 允许的文件後缀，不带點，多個用逗號分割。
             * * `mimeTypes` {String} 多個用逗號分割。
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
             * 添加文件選擇按钮，如果一個按钮不够，需要調用此方法來添加。参數跟[options.pick](#WebUploader:Uploader:options)一致。
             * @example
             * uploader.addButton({
             *     id: '#btnContainer',
             *     innerHTML: '選擇文件'
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
     * @fileOverview 文件屬性封装
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
         * 文件類
         * @class File
         * @constructor 構造函數
         * @grammar new File( source ) => File
         * @param {Lib.File} source [lib.File](#Lib.File)實例, 此source物件是带有Runtime資料的。
         */
        function WUFile(source) {

            /**
             * 文件名，包括擴展名（後缀）
             * @property name
             * @type {string}
             */
            this.name = source.name || 'Untitled';

            /**
             * 文件體積（字節）
             * @property size
             * @type {uint}
             * @default 0
             */
            this.size = source.size || 0;

            /**
             * 文件MIMETYPE類型，與文件類型的對應關系請参考[http://t.cn/z8ZnFny](http://t.cn/z8ZnFny)
             * @property type
             * @type {string}
             * @default 'application'
             */
            this.type = source.type || 'application';

            /**
             * 文件最後修改日期
             * @property lastModifiedDate
             * @type {int}
             * @default 當前時間戳
             */
            this.lastModifiedDate = source.lastModifiedDate || (new Date() * 1);

            /**
             * 文件ID，每個物件具有唯一ID，與文件名無關
             * @property id
             * @type {string}
             */
            this.id = gid();

            /**
             * 文件擴展名，通過文件名取得，例如test.png的擴展名為png
             * @property ext
             * @type {string}
             */
            this.ext = rExt.exec(this.name) ? RegExp.$1 : '';


            /**
             * 狀態文字說明。在不同的status語境下有不同的用途。
             * @property statusText
             * @type {string}
             */
            this.statusText = '';

            // 存儲文件狀態，防止通過屬性直接修改
            statusMap[this.id] = WUFile.Status.INITED;

            this.source = source;
            this.loaded = 0;

            this.on('error', function (msg) {
                this.setStatus(WUFile.Status.ERROR, msg);
            });
        }

        $.extend(WUFile.prototype, {

            /**
             * 設定狀態，狀態變化時會觸發`change`事件。
             * @method setStatus
             * @grammar setStatus( status[, statusText] );
             * @param {File.Status|String} status [文件狀態值](#WebUploader:File:File.Status)
             * @param {String} [statusText=''] 狀態說明，常在error時使用，用http, abort,server等來標记是由於什么原因導致文件錯誤。
             */
            setStatus: function (status, text) {

                var prevStatus = statusMap[this.id];

                typeof text !== 'undefined' && (this.statusText = text);

                if (status !== prevStatus) {
                    statusMap[this.id] = status;
                    /**
                     * 文件狀態變化
                     * @event statuschange
                     */
                    this.trigger('statuschange', status, prevStatus);
                }

            },

            /**
             * 取得文件狀態
             * @return {File.Status}
             * @example
                     文件狀態具體包括以下幾種類型：
                     {
                         // 初始化
                        INITED:     0,
                        // 已入队列
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
             * 取得文件原始資料。
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
         * 文件狀態值，具體包括以下幾種類型：
         * * `inited` 初始狀態
         * * `queued` 已經進入队列, 等待上傳
         * * `progress` 上傳中
         * * `complete` 上傳完成。
         * * `error` 上傳出錯，可重試
         * * `interrupt` 上傳中断，可續傳。
         * * `invalid` 文件不合格，不能重試上傳。會自動從队列中移除。
         * * `cancelled` 文件被移除。
         * @property {Object} Status
         * @namespace File
         * @class File
         * @static
         */
        WUFile.Status = {
            INITED: 'inited',    // 初始狀態
            QUEUED: 'queued',    // 已經進入队列, 等待上傳
            PROGRESS: 'progress',    // 上傳中
            ERROR: 'error',    // 上傳出錯，可重試
            COMPLETE: 'complete',    // 上傳完成。
            CANCELLED: 'cancelled',    // 上傳取消。
            INTERRUPT: 'interrupt',    // 上傳中断，可續傳。
            INVALID: 'invalid'    // 文件不合格，不能重試上傳。
        };

        return WUFile;
    });

    /**
     * @fileOverview 文件队列
     */
    define('queue', [
        'base',
        'mediator',
        'file'
    ], function (Base, Mediator, WUFile) {

        var $ = Base.$,
            STATUS = WUFile.Status;

        /**
         * 文件队列, 用來存儲各個狀態中的文件。
         * @class Queue
         * @extends Mediator
         */
        function Queue() {

            /**
             * 统計文件數。
             * * `numOfQueue` 队列中的文件數。
             * * `numOfSuccess` 上傳成功的文件數
             * * `numOfCancel` 被移除的文件數
             * * `numOfProgress` 正在上傳中的文件數
             * * `numOfUploadFailed` 上傳錯誤的文件數。
             * * `numOfInvalid` 無效的文件數。
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

            // 上傳队列，仅包括等待上傳的文件
            this._queue = [];

            // 存儲所有文件
            this._map = {};
        }

        $.extend(Queue.prototype, {

            /**
             * 將新文件加入對队列尾部
             *
             * @method append
             * @param  {File} file   文件物件
             */
            append: function (file) {
                this._queue.push(file);
                this._fileAdded(file);
                return this;
            },

            /**
             * 將新文件加入對队列頭部
             *
             * @method prepend
             * @param  {File} file   文件物件
             */
            prepend: function (file) {
                this._queue.unshift(file);
                this._fileAdded(file);
                return this;
            },

            /**
             * 取得文件物件
             *
             * @method getFile
             * @param  {String} fileId   文件ID
             * @return {File}
             */
            getFile: function (fileId) {
                if (typeof fileId !== 'string') {
                    return fileId;
                }
                return this._map[fileId];
            },

            /**
             * 從队列中取出一個指定狀態的文件。
             * @grammar fetch( status ) => File
             * @method fetch
             * @param {String} status [文件狀態值](#WebUploader:File:File.Status)
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
             * 對队列進行排序，能够控制文件上傳順序。
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
             * 取得指定類型的文件列表, 列表中每一個成員為[File](#WebUploader:File)物件。
             * @grammar getFiles( [status1[, status2 ...]] ) => Array
             * @method getFiles
             * @param {String} [status] [文件狀態值](#WebUploader:File:File.Status)
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
     * @fileOverview 队列
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

                // 如果當前不是html5運行時，那就算了。
                // 不执行後續操作
                if (this.request('predict-runtime-type') !== 'html5') {
                    return;
                }

                // 創建一個 html5 運行時的 placeholder
                // 以至于外部添加原生 File 物件的時候能正確包裹一下供 webuploader 使用。
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

            // 判断文件是否可以被加入队列
            acceptFile: function (file) {
                var invalid = !file || file.size < 6 || this.accept &&

                    // 如果名稱中有後缀，才做後缀白名單處理。
                    rExt.exec(file.name) && !this.accept.test(file.name);

                return !invalid;
            },


            /**
             * @event beforeFileQueued
             * @param {File} file File物件
             * @description 當文件被加入队列之前觸發，此事件的handler返回值為`false`，則此文件不會被添加進入队列。
             * @for  Uploader
             */

            /**
             * @event fileQueued
             * @param {File} file File物件
             * @description 當文件被加入队列以後觸發。
             * @for  Uploader
             */

            _addFile: function (file) {
                var me = this;

                file = me._wrapFile(file);

                // 不過類型判断允许不允许，先派送 `beforeFileQueued`
                if (!me.owner.trigger('beforeFileQueued', file)) {
                    return;
                }

                // 類型不匹配，則派送錯誤事件，並返回。
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
             * @param {File} files 陣列，内容為原始File(lib/File）物件。
             * @description 當一批文件添加進队列以後觸發。
             * @for  Uploader
             */

            /**
             * @method addFiles
             * @grammar addFiles( file ) => undefined
             * @grammar addFiles( [file1, file2 ...] ) => undefined
             * @param {Array of File or File} [files] Files 物件 陣列
             * @description 添加文件到队列
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
             * @description 當文件被移除队列後觸發。
             * @for  Uploader
             */

            /**
             * @method removeFile
             * @grammar removeFile( file ) => undefined
             * @grammar removeFile( id ) => undefined
             * @param {File|id} file File物件或這File物件的id
             * @description 移除某一文件。
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
             * @description 返回指定狀態的文件集合，不傳参數將返回所有狀態的文件。
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
             * @description 重試上傳，重試指定文件，或者從出錯的文件開始重新上傳。
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
             * @description 排序队列中的文件，在上傳之前調整可以控制上傳順序。
             * @for  Uploader
             */
            sortFiles: function () {
                return this.queue.sort.apply(this.queue, arguments);
            },

            /**
             * @method reset
             * @grammar reset() => undefined
             * @description 重置uploader。目前只重置了队列。
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
     * @fileOverview 添加取得Runtime相關資料的方法。
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

                // 連接到blob归屬的同一個runtime.
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

        // 让Transport具備事件功能。
        Mediator.installTo(Transport.prototype);

        return Transport;
    });
    /**
     * @fileOverview 负责文件上傳相關。
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

        // 添加默認設定項
        $.extend(Uploader.options, {


            /**
             * @property {Boolean} [prepareNextFile=false]
             * @namespace options
             * @for Uploader
             * @description 是否允许在文件傳输時提前把下一個文件準備好。
             * 對于一個文件的準備工作比较耗時，比如圖片壓縮，md5序列化。
             * 如果能提前在當前文件傳输期處理，可以節省總體耗時。
             */
            prepareNextFile: false,

            /**
             * @property {Boolean} [chunked=false]
             * @namespace options
             * @for Uploader
             * @description 是否要分片處理大文件上傳。
             */
            chunked: false,

            /**
             * @property {Boolean} [chunkSize=5242880]
             * @namespace options
             * @for Uploader
             * @description 如果要分片，分多大一片？ 默認大小為5M.
             */
            chunkSize: 5 * 1024 * 1024,

            /**
             * @property {Boolean} [chunkRetry=2]
             * @namespace options
             * @for Uploader
             * @description 如果某個分片由於網络問題出錯，允许自動重傳多少次？
             */
            chunkRetry: 2,

            /**
             * @property {Boolean} [threads=3]
             * @namespace options
             * @for Uploader
             * @description 上傳並發數。允许同時最大上傳進程數。
             */
            threads: 3,


            /**
             * @property {Object} [formData]
             * @namespace options
             * @for Uploader
             * @description 文件上傳請求的参數表，每次發送都會發送此物件中的参數。
             */
            formData: null

            /**
             * @property {Object} [fileVal='file']
             * @namespace options
             * @for Uploader
             * @description 設定文件上傳域的name。
             */

            /**
             * @property {Object} [method='POST']
             * @namespace options
             * @for Uploader
             * @description 文件上傳方式，`POST`或者`GET`。
             */

            /**
             * @property {Object} [sendAsBinary=false]
             * @namespace options
             * @for Uploader
             * @description 是否已二進製的流的方式發送文件，這樣整個上傳内容`php://input`都為文件内容，
             * 其他参數在$_GET陣列中。
             */
        });

        // 负责將文件切片。
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

                // 记入當前正在傳的資料，跟threads相關
                this.pool = [];

                // 緩存即將上傳的文件。
                this.pending = [];

                // 跟踪還有多少分片没有完成上傳。
                this.remaning = 0;
                this.__tick = Base.bindFn(this._tick, this);

                owner.on('uploadComplete', function (file) {
                    // 把其他塊取消了。
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
             * @description 當開始上傳流程時觸發。
             * @for  Uploader
             */

            /**
             * 開始上傳。此方法可以從初始狀態調用開始上傳流程，也可以從暫停狀態調用，繼續上傳流程。
             * @grammar upload() => undefined
             * @method upload
             * @for  Uploader
             */
            start: function () {
                var me = this;

                // 移出invalid的文件
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
             * @description 當開始上傳流程暫停時觸發。
             * @for  Uploader
             */

            /**
             * 暫停上傳。第一個参數為是否中断上傳當前正在上傳的文件。
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
             * 掉過一個文件上傳，直接標记指定文件為已上傳狀態。
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
             * @description 當所有文件上傳結束時觸發。
             * @for  Uploader
             */
            _tick: function () {
                var me = this,
                    opts = me.options,
                    fn, val;

                // 上一個promise還没有結束，則等待完成後再执行。
                if (me._promise) {
                    return me._promise.always(me.__tick);
                }

                // 還有位置，且還有文件要處理的話。
                if (me.pool.length < opts.threads && (val = me._nextBlock())) {
                    me._trigged = false;

                    fn = function (val) {
                        me._promise = null;

                        // 有可能是reject過來的，所以要檢测val的類型。
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

                // 如果當前文件還有没有需要傳输的，則直接返回剩下的。
                if (act && act.has() &&
                    act.file.getStatus() === Status.PROGRESS) {

                    // 是否提前準備下一個文件
                    if (opts.prepareNextFile && !me.pending.length) {
                        me._prepareNextFile();
                    }

                    return act.fetch();

                    // 否則，如果正在運行，則準備下一個文件，並等待完成後返回下個分片。
                } else if (me.runing) {

                    // 如果緩存中有，則直接在緩存中取，没有則去queue中取。
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

                    // 文件可能還在prepare中，也有可能已經完全準備好了。
                    return isPromise(next) ?
                        next[next.pipe ? 'pipe' : 'then'](done) :
                        done(next);
                }
            },


            /**
             * @event uploadStart
             * @param {File} file File物件
             * @description 某個文件開始上傳前觸發，一個文件只會觸發一次。
             * @for  Uploader
             */
            _prepareNextFile: function () {
                var me = this,
                    file = me.request('fetch-file'),
                    pending = me.pending,
                    promise;

                if (file) {
                    promise = me.request('before-send-file', file, function () {

                        // 有可能文件被skip掉了。文件被skip掉後，狀態坑定不是Queued.
                        if (file.getStatus() === Status.QUEUED) {
                            me.owner.trigger('uploadStart', file);
                            file.setStatus(Status.PROGRESS);
                            return file;
                        }

                        return me._finishFile(file);
                    });

                    // 如果還在pending中，則替換成文件本身。
                    promise.done(function () {
                        var idx = $.inArray(promise, pending);

                        ~idx && pending.splice(idx, 1, file);
                    });

                    // befeore-send-file的钩子就有錯誤發生。
                    promise.fail(function (reason) {
                        file.setStatus(Status.ERROR, reason);
                        me.owner.trigger('uploadError', file, reason);
                        me.owner.trigger('uploadComplete', file);
                    });

                    pending.push(promise);
                }
            },

            // 让出位置了，可以让其他分片開始上傳
            _popBlock: function (block) {
                var idx = $.inArray(block, this.pool);

                this.pool.splice(idx, 1);
                block.file.remaning--;
                this.remaning--;
            },

            // 開始上傳，可以被掉過。如果promise被reject了，則表示跳過此分片。
            _startSend: function (block) {
                var me = this,
                    file = block.file,
                    promise;

                me.pool.push(block);
                me.remaning++;

                // 如果没有分片，則直接使用原始的。
                // 不會丢失content-type資料。
                block.blob = block.chunks === 1 ? file.source :
                    file.source.slice(block.start, block.end);

                // hook, 每個分片發送之前可能要做些异步的事情。
                promise = me.request('before-send', block, function () {

                    // 有可能文件已經上傳出錯了，所以不需要再傳输了。
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
             * @param {Object} data 默認的上傳参數，可以擴展此物件來控制上傳参數。
             * @description 當某個文件的分塊在發送前觸發，主要用來詢問是否要添加附带参數，大文件在開起分片上傳的前提下此事件可能會觸發多次。
             * @for  Uploader
             */

            /**
             * @event uploadAccept
             * @param {Object} object
             * @param {Object} ret 服務端的返回資料，json格式，如果服務端不是json格式，從ret._raw中取資料，自行解析。
             * @description 當某個文件上傳到服務端響應後，會派送此事件來詢問服務端響應是否有效。如果此事件handler返回值為`false`, 則此文件將派送`server`類型的`uploadError`事件。
             * @for  Uploader
             */

            /**
             * @event uploadProgress
             * @param {File} file File物件
             * @param {Number} percentage 上傳進度
             * @description 上傳過程中觸發，携带上傳進度。
             * @for  Uploader
             */


            /**
             * @event uploadError
             * @param {File} file File物件
             * @param {String} reason 出錯的code
             * @description 當文件上傳出錯時觸發。
             * @for  Uploader
             */

            /**
             * @event uploadSuccess
             * @param {File} file File物件
             * @param {Object} response 服務端返回的資料
             * @description 當文件上傳成功時觸發。
             * @for  Uploader
             */

            /**
             * @event uploadComplete
             * @param {File} [file] File物件
             * @description 不管成功或者失败，文件上傳完成時觸發。
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

                // 廣播上傳進度。以文件為單位。
                tr.on('progress', function (percentage) {
                    var totalPercent = 0,
                        uploaded = 0;

                    // 可能没有abort掉，progress還是执行進來了。
                    // if ( !file.blocks ) {
                    //     return;
                    // }

                    totalPercent = block.percentage = percentage;

                    if (block.chunks > 1) {    // 計算文件的整體速度。
                        $.each(file.blocks, function (_, v) {
                            uploaded += (v.percentage || 0) * (v.end - v.start);
                        });

                        totalPercent = uploaded / file.size;
                    }

                    owner.trigger('uploadProgress', file, totalPercent || 0);
                });

                // 用來詢問，是否返回的結果是有錯誤的。
                requestAccept = function (reject) {
                    var fn;

                    ret = tr.getResponseAsJson() || {};
                    ret._raw = tr.getResponse();
                    fn = function (value) {
                        reject = value;
                    };

                    // 服務端響應了，不代表成功了，詢問是否響應正確。
                    if (!owner.trigger('uploadAccept', block, ret, fn)) {
                        reject = reject || 'server';
                    }

                    return reject;
                };

                // 嘗試重試，然後廣播文件上傳出錯。
                tr.on('error', function (type, flag) {
                    block.retried = block.retried || 0;

                    // 自動重試
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

                    // 如果非预期，轉向上傳出錯。
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

                // 設定默認的上傳字段。
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

                // 在發送之間可以添加字段什么的。。。
                // 如果默認的字段不够使用，可以通過監听此事件來擴展
                owner.trigger('uploadBeforeSend', block, data, headers);

                // 開始發送。
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

                        // 如果外部已經標记為invalid什么的，不再改狀態。
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
     * @fileOverview 各種驗證，包括文件總大小是否超出、單文件是否超出和文件是否重複。
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
         * @description 當validate不通過時，會以派送錯誤事件的形式通知調用者。通過`upload.on('error', handler)`可以捕獲到此類錯誤，目前有以下錯誤會在特定的情况下派送錯來。
         *
         * * `Q_EXCEED_NUM_LIMIT` 在設定了`fileNumLimit`且嘗試給`uploader`添加的文件數量超出這個值時派送。
         * * `Q_EXCEED_SIZE_LIMIT` 在設定了`Q_EXCEED_SIZE_LIMIT`且嘗試給`uploader`添加的文件總大小超出這個值時派送。
         * @for  Uploader
         */

        // 暴露給外面的api
        api = {

            // 添加驗證器
            addValidator: function (type, cb) {
                validators[type] = cb;
            },

            // 移除驗證器
            removeValidator: function (type) {
                delete validators[type];
            }
        };

        // 在Uploader初始化的時候啟動Validators的初始化
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
         * @description 驗證文件總數量, 超出則不允许加入队列。
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
         * @description 驗證文件總大小是否超出限製, 超出則不允许加入队列。
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
         * @description 驗證單個文件大小是否超出限製, 超出則不允许加入队列。
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
         * @description 去重， 根據文件名稱、文件大小和最後修改時間來生成hash Key.
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

                // 已經重複了
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
     * @fileOverview Runtime管理器，负责Runtime的選擇, 連接
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


            // 這個方法的調用者，實际上是RuntimeClient
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

            // 不需要連接其他程序，直接执行callback
            init: function () {
                var me = this;
                setTimeout(function () {
                    me.trigger('ready');
                }, 1);
            }

        });

        // 註冊Components
        Html5Runtime.register = function (name, component) {
            var klass = components[name] = Base.inherits(CompBase, component);
            return klass;
        };

        // 註冊html5運行時。
        // 只有在支持的前提下註冊。
        if (window.Blob && window.FileReader && window.DataView) {
            Runtime.addRuntime(type, Html5Runtime);
        }

        return Html5Runtime;
    });
    /**
     * @fileOverview Blob Html實現
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

            // 如果傳入 callback 則去查看文件夹，否則只管當前文件夹。
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
                            arr = [],    // 為了保證順序。
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
                    // 不阻止非文件粘贴（文字粘贴）的事件冒泡
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

                // @todo Firefox不支持單獨指定後缀
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
     * @fileOverview Transport
     * @todo 支持chunked傳输，優势：
     * 可以將大文件分成小塊，挨個傳输，可以提高大文件成功率，當失败的時候，也只需要重傳那小部分，
     * 而不需要重頭再傳一次。另外断點續傳也需要用chunked方式。
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

                    // android直接發送blob會導致服務端接收到的是空文件。
                    // bug詳情。
                    // https://code.google.com/p/android/issues/detail?id=39882
                    // 所以先用fileReader读取出來再通過arraybuffer的方式發送。
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


            // 這個方法的調用者，實际上是RuntimeClient
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

                // 為了能捕取得到。
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

                // 修復Flash再没有設定title的情况下無法彈出flash文件選擇框的bug.
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
     * @fileOverview  Transport flash實現
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
     * @fileOverview 没有圖像處理的版本。
     */
    define('preset/withoutimage', [
        'base',

        // widgets
        'widgets/filednd',
        'widgets/filepaste',
        'widgets/filepicker',
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
        'runtime/html5/transport',

        // flash
        'runtime/flash/filepicker',
        'runtime/flash/transport'
    ], function (Base) {
        return Base;
    });
    define('webuploader', [
        'preset/withoutimage'
    ], function (preset) {
        return preset;
    });
    return require('webuploader');
});
