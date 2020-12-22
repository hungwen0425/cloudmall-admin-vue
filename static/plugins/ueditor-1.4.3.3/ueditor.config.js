/**
 * ueditor完整配置项
 * 可以在这里配置整個编辑器的特性
 */
/**************************提示********************************
 * 所有被注释的配置项均為UEditor默认值。
 * 修改默认配置請首先确保已经完全明确该参數的真實用途。
 * 主要有兩种修改方案，一种是取消此處注释，然後修改成對應参數；另一种是在實例化编辑器時傳入對應参數。
 * 当升级编辑器時，可直接使用旧版配置檔案替换新版配置檔案,不用担心旧版配置檔案中因缺少新功能所需的参數而导致脚本報錯。
 **************************提示********************************/

(function () {

    /**
     * 编辑器资源檔案根路径。它所表示的含义是：以编辑器實例化页面為当前路径，指向编辑器资源檔案（即dialog等檔案夹）的路径。
     * 鉴于很多同学在使用编辑器的時候出现的种种路径问题，此處强烈建议大家使用"相對于网站根目录的相對路径"进行配置。
     * "相對于网站根目录的相對路径"也就是以斜杠开头的形如"/myProject/ueditor/"这样的路径。
     * 如果站点中有多個不在同一層级的页面需要實例化编辑器，且引用了同一UEditor的時候，此處的URL可能不适用于每個页面的编辑器。
     * 因此，UEditor提供了针對不同页面的编辑器可单独配置的根路径，具體來说，在需要實例化编辑器的页面最顶部写上如下代码即可。当然，需要令此處的URL等于對應的配置。
     * window.UEDITOR_HOME_URL = "/xxxx/xxxx/";
     */
    var URL = window.UEDITOR_HOME_URL || getUEBasePath();

    /**
     * 配置项主體。注意，此處所有涉及到路径的配置别遗漏URL变量。
     */
    window.UEDITOR_CONFIG = {

        //為编辑器實例添加一個路径，这個不能被注释
        UEDITOR_HOME_URL: URL

        // 服务器统一請求接口路径
        , serverUrl: URL + "jsp/controller.jsp"

        //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的實例時选择自己需要的重新定义
        , toolbars: [[
            'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
            'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'print', 'preview', 'searchreplace', 'drafts', 'help'
        ]]
        //当鼠標放在工具栏上時顯示的tooltip提示,留空支持自動多语言配置，否則以配置值為准
        //,labelMap:{
        //    'anchor':'', 'undo':''
        //}

        //语言配置项,默认是zh-cn。有需要的话也可以使用如下这样的方式來自動多语言切换，当然，前提条件是lang檔案夹下存在對應的语言檔案：
        //lang值也可以通過自動取得 (navigator.language||navigator.browserLanguage ||navigator.userLanguage).toLowerCase()
        //,lang:"zh-cn"
        //,langPath:URL +"lang/"

        //主题配置项,默认是default。有需要的话也可以使用如下这样的方式來自動多主题切换，当然，前提条件是themes檔案夹下存在對應的主题檔案：
        //现有如下皮肤:default
        //,theme:'default'
        //,themePath:URL +"themes/"

        //,zIndex : 900     //编辑器層级的基數,默认是900

        //针對getAllHtml方法，會在對應的head標签中增加该编码设置。
        //,charset:"utf-8"

        //若實例化编辑器的页面手動修改的domain，此處需要设置為true
        //,customDomain:false

        //常用配置项目
        //,isShow : true    //默认顯示编辑器

        //,textarea:'editorValue' // 提交表单時，服务器取得编辑器提交内容的所用的参數，多實例時可以给容器name屬性，會將name给定的值最為每個實例的键值，不用每次實例化的時候都设置这個值

        //,initialContent:'欢迎使用ueditor!'    //初始化编辑器的内容,也可以通過textarea/script给值，看官网例子

        //,autoClearinitialContent:true //是否自動清除编辑器初始内容，注意：如果focus屬性设置為true,这個也為真，那麼编辑器一上來就會触发导致初始化的内容看不到了

        //,focus:false //初始化時，是否讓编辑器获得焦点true或false

        //如果自定义，最好给p標签如下的行高，要不输入中文時，會有跳動感
        //,initialStyle:'p{line-height:1em}'//编辑器層级的基數,可以用來改变字體等

        //,iframeCssUrl: URL + '/themes/iframe.css' //给编辑区域的iframe引入一個css檔案

        //indentValue
        //首行縮进距离,默认是2em
        //,indentValue:'2em'

        //,initialFrameWidth:1000  //初始化编辑器宽度,默认1000
        //,initialFrameHeight:320  //初始化编辑器高度,默认320

        //,readonly : false //编辑器初始化结束後,编辑区域是否是只读的，默认是false

        //,autoClearEmptyNode : true //getContent時，是否删除空的inlineElement節点（包括嵌套的情况）

        //启用自動保存
        //,enableAutoSave: true
        //自動保存间隔時间， 单位ms
        //,saveInterval: 500

        //,fullscreen : false //是否开启初始化時即全屏，默认關闭

        //,imagePopup:true      //圖片操作的浮層开關，默认打开

        //,autoSyncData:true //自動同步编辑器要提交的資料
        //,emotionLocalization:false //是否开启表情本地化，默认關闭。若要开启請确保emotion檔案夹下包含官网提供的images表情檔案夹

        //粘贴只保留標签，去除標签所有屬性
        //,retainOnlyLabelPasted: false

        //,pasteplain:false  //是否默认為纯文本粘贴。false為不使用纯文本粘贴，true為使用纯文本粘贴
        //纯文本粘贴模式下的過滤规則
        //'filterTxtRules' : function(){
        //    function transP(node){
        //        node.tagName = 'p';
        //        node.setStyle();
        //    }
        //    return {
        //        //直接删除及其字節点内容
        //        '-' : 'script style object iframe embed input select',
        //        'p': {$:{}},
        //        'br':{$:{}},
        //        'div':{'$':{}},
        //        'li':{'$':{}},
        //        'caption':transP,
        //        'th':transP,
        //        'tr':transP,
        //        'h1':transP,'h2':transP,'h3':transP,'h4':transP,'h5':transP,'h6':transP,
        //        'td':function(node){
        //            //没有内容的td直接删掉
        //            var txt = !!node.innerText();
        //            if(txt){
        //                node.parentNode.insertAfter(UE.uNode.createText(' &nbsp; &nbsp;'),node);
        //            }
        //            node.parentNode.removeChild(node,node.innerText())
        //        }
        //    }
        //}()

        //,allHtmlEnabled:false //提交到後台的資料是否包含整個html字符串

        //insertorderedlist
        //有序列表的下拉配置,值留空時支持多语言自動识别，若配置值，則以此值為准
        //,'insertorderedlist':{
        //      //自定的样式
        //        'num':'1,2,3...',
        //        'num1':'1),2),3)...',
        //        'num2':'(1),(2),(3)...',
        //        'cn':'一,二,三....',
        //        'cn1':'一),二),三)....',
        //        'cn2':'(一),(二),(三)....',
        //     //系统自带
        //     'decimal' : '' ,         //'1,2,3...'
        //     'lower-alpha' : '' ,    // 'a,b,c...'
        //     'lower-roman' : '' ,    //'i,ii,iii...'
        //     'upper-alpha' : '' , lang   //'A,B,C'
        //     'upper-roman' : ''      //'I,II,III...'
        //}

        //insertunorderedlist
        //無序列表的下拉配置，值留空時支持多语言自動识别，若配置值，則以此值為准
        //,insertunorderedlist : { //自定的样式
        //    'dash' :'— 破折号', //-破折号
        //    'dot':' 。 小圆圈', //系统自带
        //    'circle' : '',  // '○ 小圆圈'
        //    'disc' : '',    // '● 小圆点'
        //    'square' : ''   //'■ 小方块'
        //}
        //,listDefaultPaddingLeft : '30'//默认的左边縮进的基數倍
        //,listiconpath : 'http://bs.baidu.com/listicon/'//自定义標号的路径
        //,maxListLevel : 3 //限制可以tab的级數, 设置-1為不限制

        //,autoTransWordToList:false  //禁止word中粘贴进來的列表自動变成列表標签

        //fontfamily
        //字體设置 label留空支持多语言自動切换，若配置，則以配置值為准
        //,'fontfamily':[
        //    { label:'',name:'songti',val:'宋體,SimSun'},
        //    { label:'',name:'kaiti',val:'楷體,楷體_GB2312, SimKai'},
        //    { label:'',name:'yahei',val:'微软雅黑,Microsoft YaHei'},
        //    { label:'',name:'heiti',val:'黑體, SimHei'},
        //    { label:'',name:'lishu',val:'隶书, SimLi'},
        //    { label:'',name:'andaleMono',val:'andale mono'},
        //    { label:'',name:'arial',val:'arial, helvetica,sans-serif'},
        //    { label:'',name:'arialBlack',val:'arial black,avant garde'},
        //    { label:'',name:'comicSansMs',val:'comic sans ms'},
        //    { label:'',name:'impact',val:'impact,chicago'},
        //    { label:'',name:'timesNewRoman',val:'times new roman'}
        //]

        //fontsize
        //字号
        //,'fontsize':[10, 11, 12, 14, 16, 18, 20, 24, 36]

        //paragraph
        //段落格式 值留空時支持多语言自動识别，若配置，則以配置值為准
        //,'paragraph':{'p':'', 'h1':'', 'h2':'', 'h3':'', 'h4':'', 'h5':'', 'h6':''}

        //rowspacingtop
        //段间距 值和顯示的名字相同
        //,'rowspacingtop':['5', '10', '15', '20', '25']

        //rowspacingBottom
        //段间距 值和顯示的名字相同
        //,'rowspacingbottom':['5', '10', '15', '20', '25']

        //lineheight
        //行内间距 值和顯示的名字相同
        //,'lineheight':['1', '1.5','1.75','2', '3', '4', '5']

        //customstyle
        //自定义样式，不支持国际化，此處配置值即可最後顯示值
        //block的元素是依据设置段落的逻辑设置的，inline的元素依据BIU的逻辑设置
        //尽量使用一些常用的標签
        //参數说明
        //tag 使用的標签名字
        //label 顯示的名字也是用來標识不同類型的標识符，注意这個值每個要不同，
        //style 添加的样式
        //每一個物件就是一個自定义的样式
        //,'customstyle':[
        //    {tag:'h1', name:'tc', label:'', style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;'},
        //    {tag:'h1', name:'tl',label:'', style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;margin:0 0 10px 0;'},
        //    {tag:'span',name:'im', label:'', style:'font-style:italic;font-weight:bold'},
        //    {tag:'span',name:'hi', label:'', style:'font-style:italic;font-weight:bold;color:rgb(51, 153, 204)'}
        //]

        //打开右键菜单功能
        //,enableContextMenu: true
        //右键菜单的内容，可以参考plugins/contextmenu.js里边的默认菜单的例子，label留空支持国际化，否則以此配置為准
        //,contextMenu:[
        //    {
        //        label:'',       //顯示的名称
        //        cmdName:'selectall',//执行的command命令，当点击这個右键菜单時
        //        //exec可选，有了exec就會在点击時执行这個function，优先级高于cmdName
        //        exec:function () {
        //            //this是当前编辑器的實例
        //            //this.ui._dialogs['inserttableDialog'].open();
        //        }
        //    }
        //]

        //快捷菜单
        //,shortcutMenu:["fontfamily", "fontsize", "bold", "italic", "underline", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist"]

        //elementPathEnabled
        //是否启用元素路径，默认是顯示
        //,elementPathEnabled : true

        //wordCount
        //,wordCount:true          //是否开启字數统计
        //,maximumWords:10000       //允许的最大字符數
        //字數统计提示，{#count}代表当前字數，{#leave}代表還可以输入多少字符數,留空支持多语言自動切换，否則按此配置顯示
        //,wordCountMsg:''   //当前已输入 {#count} 個字符，您還可以输入{#leave} 個字符
        //超出字數限制提示  留空支持多语言自動切换，否則按此配置顯示
        //,wordOverFlowMsg:''    //<span style="color:red;">你输入的字符個數已经超出最大允许值，服务器可能會拒绝保存！</span>

        //tab
        //点击tab键時移動的距离,tabSize倍數，tabNode什麼字符做為单位
        //,tabSize:4
        //,tabNode:'&nbsp;'

        //removeFormat
        //清除格式時可以删除的標签和屬性
        //removeForamtTags標签
        //,removeFormatTags:'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var'
        //removeFormatAttributes屬性
        //,removeFormatAttributes:'class,style,lang,width,height,align,hspace,valign'

        //undo
        //可以最多回退的次數,默认20
        //,maxUndoCount:20
        //当输入的字符數超過该值時，保存一次现场
        //,maxInputCount:1

        //autoHeightEnabled
        // 是否自動长高,默认true
        //,autoHeightEnabled:true

        //scaleEnabled
        //是否可以拉伸长高,默认true(当开启時，自動长高失效)
        //,scaleEnabled:false
        //,minFrameWidth:800    //编辑器拖動時最小宽度,默认800
        //,minFrameHeight:220  //编辑器拖動時最小高度,默认220

        //autoFloatEnabled
        //是否保持toolbar的位置不動,默认true
        //,autoFloatEnabled:true
        //浮動時工具栏距离瀏覽器顶部的高度，用于某些具有固定头部的页面
        //,topOffset:30
        //编辑器底部距离工具栏高度(如果参數大于等于编辑器高度，則设置無效)
        //,toolbarTopOffset:400

        //设置远程圖片是否抓取到本地保存
        //,catchRemoteImageEnable: true //设置是否抓取远程圖片

        //pageBreakTag
        //分页標识符,默认是_ueditor_page_break_tag_
        //,pageBreakTag:'_ueditor_page_break_tag_'

        //autotypeset
        //自動排版参數
        //,autotypeset: {
        //    mergeEmptyline: true,           //合并空行
        //    removeClass: true,              //去掉冗余的class
        //    removeEmptyline: false,         //去掉空行
        //    textAlign:"left",               //段落的排版方式，可以是 left,right,center,justify 去掉这個屬性表示不执行排版
        //    imageBlockLine: 'center',       //圖片的浮動方式，独占一行剧中,左右浮動，默认: center,left,right,none 去掉这個屬性表示不执行排版
        //    pasteFilter: false,             //根据规則過滤没事粘贴进來的内容
        //    clearFontSize: false,           //去掉所有的内嵌字号，使用编辑器默认的字号
        //    clearFontFamily: false,         //去掉所有的内嵌字體，使用编辑器默认的字體
        //    removeEmptyNode: false,         // 去掉空節点
        //    //可以去掉的標签
        //    removeTagNames: {標签名字:1},
        //    indent: false,                  // 行首縮进
        //    indentValue : '2em',            //行首縮进的大小
        //    bdc2sb: false,
        //    tobdc: false
        //}

        //tableDragable
        //表格是否可以拖拽
        //,tableDragable: true



        //sourceEditor
        //源码的查看方式,codemirror 是代码高亮，textarea是文本框,默认是codemirror
        //注意默认codemirror只能在ie8+和非ie中使用
        //,sourceEditor:"codemirror"
        //如果sourceEditor是codemirror，還用配置一下兩個参數
        //codeMirrorJsUrl js加载的路径，默认是 URL + "third-party/codemirror/codemirror.js"
        //,codeMirrorJsUrl:URL + "third-party/codemirror/codemirror.js"
        //codeMirrorCssUrl css加载的路径，默认是 URL + "third-party/codemirror/codemirror.css"
        //,codeMirrorCssUrl:URL + "third-party/codemirror/codemirror.css"
        //编辑器初始化完成後是否进入源码模式，默认為否。
        //,sourceEditorFirst:false

        //iframeUrlMap
        //dialog内容的路径 ～會被替换成URL,垓屬性一旦打开，將覆盖所有的dialog的默认路径
        //,iframeUrlMap:{
        //    'anchor':'~/dialogs/anchor/anchor.html',
        //}

        //allowLinkProtocol 允许的链接地址，有这些前缀的链接地址不會自動添加http
        //, allowLinkProtocols: ['http:', 'https:', '#', '/', 'ftp:', 'mailto:', 'tel:', 'git:', 'svn:']

        //webAppKey 百度應用的APIkey，每個站长必须首先去百度官网注册一個key後方能正常使用app功能，注册介绍，http://app.baidu.com/static/cms/getapikey.html
        //, webAppKey: ""

        //默认過滤规則相關配置项目
        //,disabledTableInTable:true  //禁止表格嵌套
        //,allowDivTransToP:true      //允许进入编辑器的div標签自動变成p標签
        //,rgb2Hex:true               //默认产出的資料中的color自動从rgb格式变成16进制格式

        // xss 過滤是否开启,inserthtml等操作
        , xssFilterRules: true
        //input xss過滤
        , inputXssFilter: true
        //output xss過滤
        , outputXssFilter: true
        // xss過滤白名单 名单來源: https://raw.githubusercontent.com/leizongmin/js-xss/master/lib/default.js
        , whitList: {
            a: ['target', 'href', 'title', 'class', 'style'],
            abbr: ['title', 'class', 'style'],
            address: ['class', 'style'],
            area: ['shape', 'coords', 'href', 'alt'],
            article: [],
            aside: [],
            audio: ['autoplay', 'controls', 'loop', 'preload', 'src', 'class', 'style'],
            b: ['class', 'style'],
            bdi: ['dir'],
            bdo: ['dir'],
            big: [],
            blockquote: ['cite', 'class', 'style'],
            br: [],
            caption: ['class', 'style'],
            center: [],
            cite: [],
            code: ['class', 'style'],
            col: ['align', 'valign', 'span', 'width', 'class', 'style'],
            colgroup: ['align', 'valign', 'span', 'width', 'class', 'style'],
            dd: ['class', 'style'],
            del: ['datetime'],
            details: ['open'],
            div: ['class', 'style'],
            dl: ['class', 'style'],
            dt: ['class', 'style'],
            em: ['class', 'style'],
            font: ['color', 'size', 'face'],
            footer: [],
            h1: ['class', 'style'],
            h2: ['class', 'style'],
            h3: ['class', 'style'],
            h4: ['class', 'style'],
            h5: ['class', 'style'],
            h6: ['class', 'style'],
            header: [],
            hr: [],
            i: ['class', 'style'],
            img: ['src', 'alt', 'title', 'width', 'height', 'id', '_src', 'loadingclass', 'class', 'data-latex'],
            ins: ['datetime'],
            li: ['class', 'style'],
            mark: [],
            nav: [],
            ol: ['class', 'style'],
            p: ['class', 'style'],
            pre: ['class', 'style'],
            s: [],
            section: [],
            small: [],
            span: ['class', 'style'],
            sub: ['class', 'style'],
            sup: ['class', 'style'],
            strong: ['class', 'style'],
            table: ['width', 'border', 'align', 'valign', 'class', 'style'],
            tbody: ['align', 'valign', 'class', 'style'],
            td: ['width', 'rowspan', 'colspan', 'align', 'valign', 'class', 'style'],
            tfoot: ['align', 'valign', 'class', 'style'],
            th: ['width', 'rowspan', 'colspan', 'align', 'valign', 'class', 'style'],
            thead: ['align', 'valign', 'class', 'style'],
            tr: ['rowspan', 'align', 'valign', 'class', 'style'],
            tt: [],
            u: [],
            ul: ['class', 'style'],
            video: ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width', 'class', 'style']
        }
    };

    function getUEBasePath(docUrl, confUrl) {

        return getBasePath(docUrl || self.document.URL || self.location.href, confUrl || getConfigFilePath());

    }

    function getConfigFilePath() {

        var configPath = document.getElementsByTagName('script');

        return configPath[configPath.length - 1].src;

    }

    function getBasePath(docUrl, confUrl) {

        var basePath = confUrl;


        if (/^(\/|\\\\)/.test(confUrl)) {

            basePath = /^.+?\w(\/|\\\\)/.exec(docUrl)[0] + confUrl.replace(/^(\/|\\\\)/, '');

        } else if (!/^[a-z]+:/i.test(confUrl)) {

            docUrl = docUrl.split("#")[0].split("?")[0].replace(/[^\\\/]+$/, '');

            basePath = docUrl + "" + confUrl;

        }

        return optimizationPath(basePath);

    }

    function optimizationPath(path) {

        var protocol = /^[a-z]+:\/\//.exec(path)[0],
            tmp = null,
            res = [];

        path = path.replace(protocol, "").split("?")[0].split("#")[0];

        path = path.replace(/\\/g, '/').split(/\//);

        path[path.length - 1] = "";

        while (path.length) {

            if ((tmp = path.shift()) === "..") {
                res.pop();
            } else if (tmp !== ".") {
                res.push(tmp);
            }

        }

        return protocol + res.join("/");

    }

    window.UE = {
        getUEBasePath: getUEBasePath
    };

})();
