/**
 * ueditor完整設定項
 * 可以在這裡設定整個編輯器的特性
 */
/**************************提示********************************
 * 所有被註釋的設定項均為UEditor默認值。
 * 修改默認設定請首先確保已經完全明確該参數的真實用途。
 * 主要有两種修改方案，一種是取消此處註釋，然後修改成對應参數；另一種是在實例化編輯器時傳入對應参數。
 * 當升級編輯器時，可直接使用舊版設定文件替換新版設定文件,不用担心舊版設定文件中因缺少新功能所需的参數而導致脚本報錯。
 **************************提示********************************/

(function () {

  /**
   * 編輯器資源文件根路徑。它所表示的含義是：以編輯器實例化頁面為當前路徑，指向編輯器資源文件（即dialog等文件夾）的路徑。
   * 鑑於很多同學在使用編輯器的時候出現的種種路徑問題，此處强烈建議大家使用"相對於網站根目錄的相對路徑"進行設定。
   * "相對於網站根目錄的相對路徑"也就是以斜杠開頭的形如"/myProject/ueditor/"這樣的路徑。
   * 如果站點中有多個不在同一層級的頁面需要實例化編輯器，且引用了同一UEditor的時候，此處的URL可能不適用於每個頁面的編輯器。
   * 因此，UEditor提供了針對不同頁面的編輯器可單獨設定的根路徑，具體來說，在需要實例化編輯器的頁面最顶部寫上如下程式碼即可。當然，需要令此處的URL等於對應的設定。
   * window.UEDITOR_HOME_URL = "/xxxx/xxxx/";
   */
  var URL = window.UEDITOR_HOME_URL || getUEBasePath();

  /**
   * 設定項主體。注意，此處所有涉及到路徑的設定别遗漏URL變量。
   */
  window.UEDITOR_CONFIG = {

    //為編輯器實例添加一個路徑，這個不能被註釋
    UEDITOR_HOME_URL: URL

    // 服務器统一請求接口路徑
    , serverUrl: URL + "jsp/controller.jsp"

    //工具欄上的所有的功能按鈕和下拉框，可以在new編輯器的實例時選擇自己需要的重新定義
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
    //當鼠標放在工具欄上時顯示的tooltip提示,留空支持自動多語言設定，否則以設定值為準
    //,labelMap:{
    //    'anchor':'', 'undo':''
    //}

    //語言設定項,默認是zh-cn。有需要的話也可以使用如下這樣的方式來自動多語言切換，當然，前提條件是lang文件夾下存在對應的語言文件：
    //lang值也可以通過自動取得 (navigator.language||navigator.browserLanguage ||navigator.userLanguage).toLowerCase()
    //,lang:"zh-cn"
    //,langPath:URL +"lang/"

    //主題設定項,默認是default。有需要的話也可以使用如下這樣的方式來自動多主題切換，當然，前提條件是themes文件夾下存在對應的主題文件：
    //現有如下皮膚:default
    //,theme:'default'
    //,themePath:URL +"themes/"

    //,zIndex : 900     //編輯器層級的基數,默認是900

    //針對getAllHtml方法，會在對應的head標簽中增加該編碼設定。
    //,charset:"utf-8"

    //若實例化編輯器的頁面手動修改的domain，此處需要設定為true
    //,customDomain:false

    //常用設定專案
    //,isShow : true    //默認顯示編輯器

    //,textarea:'editorValue' // 提交表單時，服務器取得編輯器提交内容的所用的参數，多實例時可以給容器name屬性，會將name給定的值最為每個實例的键值，不用每次實例化的時候都設定這個值

    //,initialContent:'歡迎使用ueditor!'    //初始化編輯器的内容,也可以通過textarea/script給值，看官網例子

    //,autoClearinitialContent:true //是否自動清除編輯器初始内容，注意：如果focus屬性設定為true,這個也為真，那么編輯器一上來就會觸發導致初始化的内容看不到了

    //,focus:false //初始化時，是否让編輯器取得焦點true或false

    //如果自定義，最好給p標簽如下的行高，要不输入中文時，會有跳動感
    //,initialStyle:'p{line-height:1em}'//編輯器層級的基數,可以用來改變字體等

    //,iframeCssUrl: URL + '/themes/iframe.css' //給編輯區域的iframe引入一個css文件

    //indentValue
    //首行縮進距離,默認是2em
    //,indentValue:'2em'

    //,initialFrameWidth:1000  //初始化編輯器寬度,默認1000
    //,initialFrameHeight:320  //初始化編輯器高度,默認320

    //,readonly : false //編輯器初始化結束後,編輯區域是否是只讀的，默認是false

    //,autoClearEmptyNode : true //getContent時，是否删除空的inlineElement節點（包括嵌套的情况）

    //啟用自動保存
    //,enableAutoSave: true
    //自動保存間隔時間， 單位ms
    //,saveInterval: 500

    //,fullscreen : false //是否開啟初始化時即全屏，默認關閉

    //,imagePopup:true      //圖片操作的浮層開關，默認打開

    //,autoSyncData:true //自動同步編輯器要提交的資料
    //,emotionLocalization:false //是否開啟表情本地化，默認關閉。若要開啟請確保emotion文件夾下包含官網提供的images表情文件夾

    //粘贴只保留標簽，去除標簽所有屬性
    //,retainOnlyLabelPasted: false

    //,pasteplain:false  //是否默認為纯文本粘贴。false為不使用纯文本粘贴，true為使用纯文本粘贴
    //纯文本粘贴模式下的過滤规則
    //'filterTxtRules' : function(){
    //    function transP(node){
    //        node.tagName = 'p';
    //        node.setStyle();
    //    }
    //    return {
    //        //直接删除及其字節點内容
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
    //有序列表的下拉設定,值留空時支持多語言自動识别，若設定值，則以此值為準
    //,'insertorderedlist':{
    //      //自定的樣式
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
    //無序列表的下拉設定，值留空時支持多語言自動识别，若設定值，則以此值為準
    //,insertunorderedlist : { //自定的樣式
    //    'dash' :'— 破折號', //-破折號
    //    'dot':' 。 小圆圈', //系统自带
    //    'circle' : '',  // '○ 小圆圈'
    //    'disc' : '',    // '● 小圆點'
    //    'square' : ''   //'■ 小方塊'
    //}
    //,listDefaultPaddingLeft : '30'//默認的左邊縮進的基數倍
    //,listiconpath : 'http://bs.baidu.com/listicon/'//自定義標號的路徑
    //,maxListLevel : 3 //限製可以tab的級數, 設定-1為不限製

    //,autoTransWordToList:false  //禁止word中粘贴進來的列表自動變成列表標簽

    //fontfamily
    //字體設定 label留空支持多語言自動切換，若設定，則以設定值為準
    //,'fontfamily':[
    //    { label:'',name:'songti',val:'宋體,SimSun'},
    //    { label:'',name:'kaiti',val:'楷體,楷體_GB2312, SimKai'},
    //    { label:'',name:'yahei',val:'微軟雅黑,Microsoft YaHei'},
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
    //字號
    //,'fontsize':[10, 11, 12, 14, 16, 18, 20, 24, 36]

    //paragraph
    //段落格式 值留空時支持多語言自動识别，若設定，則以設定值為準
    //,'paragraph':{'p':'', 'h1':'', 'h2':'', 'h3':'', 'h4':'', 'h5':'', 'h6':''}

    //rowspacingtop
    //段間距 值和顯示的名稱相同
    //,'rowspacingtop':['5', '10', '15', '20', '25']

    //rowspacingBottom
    //段間距 值和顯示的名稱相同
    //,'rowspacingbottom':['5', '10', '15', '20', '25']

    //lineheight
    //行内間距 值和顯示的名稱相同
    //,'lineheight':['1', '1.5','1.75','2', '3', '4', '5']

    //customstyle
    //自定義樣式，不支持國际化，此處設定值即可最後顯示值
    //block的元素是依據設定段落的邏輯設定的，inline的元素依據BIU的邏輯設定
    //尽量使用一些常用的標簽
    //参數說明
    //tag 使用的標簽名稱
    //label 顯示的名稱也是用來標识不同類型的標识符，注意這個值每個要不同，
    //style 添加的樣式
    //每一個物件就是一個自定義的樣式
    //,'customstyle':[
    //    {tag:'h1', name:'tc', label:'', style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;'},
    //    {tag:'h1', name:'tl',label:'', style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;margin:0 0 10px 0;'},
    //    {tag:'span',name:'im', label:'', style:'font-style:italic;font-weight:bold'},
    //    {tag:'span',name:'hi', label:'', style:'font-style:italic;font-weight:bold;color:rgb(51, 153, 204)'}
    //]

    //打開右键選單功能
    //,enableContextMenu: true
    //右键選單的内容，可以参考plugins/contextmenu.js里邊的默認選單的例子，label留空支持國际化，否則以此設定為準
    //,contextMenu:[
    //    {
    //        label:'',       //顯示的名稱
    //        cmdName:'selectall',//執行的command命令，當點擊這個右键選單時
    //        //exec可選，有了exec就會在點擊時執行這個function，優先級高于cmdName
    //        exec:function () {
    //            //this是當前編輯器的實例
    //            //this.ui._dialogs['inserttableDialog'].open();
    //        }
    //    }
    //]

    //快捷選單
    //,shortcutMenu:["fontfamily", "fontsize", "bold", "italic", "underline", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist"]

    //elementPathEnabled
    //是否啟用元素路徑，默認是顯示
    //,elementPathEnabled : true

    //wordCount
    //,wordCount:true          //是否開啟字數统計
    //,maximumWords:10000       //允許的最大字符數
    //字數统計提示，{#count}代表當前字數，{#leave}代表還可以输入多少字符數,留空支持多語言自動切換，否則按此設定顯示
    //,wordCountMsg:''   //當前已输入 {#count} 個字符，您還可以输入{#leave} 個字符
    //超出字數限製提示  留空支持多語言自動切換，否則按此設定顯示
    //,wordOverFlowMsg:''    //<span style="color:red;">你输入的字符個數已經超出最大允許值，服務器可能會拒绝保存！</span>

    //tab
    //點擊tab键時移動的距離,tabSize倍數，tabNode什么字符做為單位
    //,tabSize:4
    //,tabNode:'&nbsp;'

    //removeFormat
    //清除格式時可以删除的標簽和屬性
    //removeForamtTags標簽
    //,removeFormatTags:'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var'
    //removeFormatAttributes屬性
    //,removeFormatAttributes:'class,style,lang,width,height,align,hspace,valign'

    //undo
    //可以最多回退的次數,默認20
    //,maxUndoCount:20
    //當输入的字符數超過該值時，保存一次現場
    //,maxInputCount:1

    //autoHeightEnabled
    // 是否自動長高,默認true
    //,autoHeightEnabled:true

    //scaleEnabled
    //是否可以拉伸長高,默認true(當開啟時，自動長高失效)
    //,scaleEnabled:false
    //,minFrameWidth:800    //編輯器拖動時最小寬度,默認800
    //,minFrameHeight:220  //編輯器拖動時最小高度,默認220

    //autoFloatEnabled
    //是否保持toolbar的位置不動,默認true
    //,autoFloatEnabled:true
    //浮動時工具欄距離瀏覽器顶部的高度，用於某些具有固定頭部的頁面
    //,topOffset:30
    //編輯器底部距離工具欄高度(如果参數大於等於編輯器高度，則設定無效)
    //,toolbarTopOffset:400

    //設定远程圖片是否抓取到本地保存
    //,catchRemoteImageEnable: true //設定是否抓取远程圖片

    //pageBreakTag
    //分頁標识符,默認是_ueditor_page_break_tag_
    //,pageBreakTag:'_ueditor_page_break_tag_'

    //autotypeset
    //自動排版参數
    //,autotypeset: {
    //    mergeEmptyline: true,           //合併空行
    //    removeClass: true,              //去掉冗余的class
    //    removeEmptyline: false,         //去掉空行
    //    textAlign:"left",               //段落的排版方式，可以是 left,right,center,justify 去掉這個屬性表示不執行排版
    //    imageBlockLine: 'center',       //圖片的浮動方式，獨占一行剧中,左右浮動，默認: center,left,right,none 去掉這個屬性表示不執行排版
    //    pasteFilter: false,             //根據规則過滤没事粘贴進來的内容
    //    clearFontSize: false,           //去掉所有的内嵌字號，使用編輯器默認的字號
    //    clearFontFamily: false,         //去掉所有的内嵌字體，使用編輯器默認的字體
    //    removeEmptyNode: false,         // 去掉空節點
    //    //可以去掉的標簽
    //    removeTagNames: {標簽名稱:1},
    //    indent: false,                  // 行首縮進
    //    indentValue : '2em',            //行首縮進的大小
    //    bdc2sb: false,
    //    tobdc: false
    //}

    //tableDragable
    //表格是否可以托拽
    //,tableDragable: true



    //sourceEditor
    //源碼的查看方式,codemirror 是程式碼高亮，textarea是文本框,默認是codemirror
    //注意默認codemirror只能在ie8+和非ie中使用
    //,sourceEditor:"codemirror"
    //如果sourceEditor是codemirror，還用設定一下两個参數
    //codeMirrorJsUrl js加載的路徑，默認是 URL + "third-party/codemirror/codemirror.js"
    //,codeMirrorJsUrl:URL + "third-party/codemirror/codemirror.js"
    //codeMirrorCssUrl css加載的路徑，默認是 URL + "third-party/codemirror/codemirror.css"
    //,codeMirrorCssUrl:URL + "third-party/codemirror/codemirror.css"
    //編輯器初始化完成後是否進入源碼模式，默認為否。
    //,sourceEditorFirst:false

    //iframeUrlMap
    //dialog内容的路徑 ～會被替換成URL,垓屬性一旦打開，將覆盖所有的dialog的默認路徑
    //,iframeUrlMap:{
    //    'anchor':'~/dialogs/anchor/anchor.html',
    //}

    //allowLinkProtocol 允許的链接地址，有這些前缀的链接地址不會自動添加http
    //, allowLinkProtocols: ['http:', 'https:', '#', '/', 'ftp:', 'mailto:', 'tel:', 'git:', 'svn:']

    //webAppKey 百度應用的APIkey，每個站長必須首先去百度官網註冊一個key後方能正常使用app功能，註冊介绍，http://app.baidu.com/static/cms/getapikey.html
    //, webAppKey: ""

    //默認過滤规則相關設定專案
    //,disabledTableInTable:true  //禁止表格嵌套
    //,allowDivTransToP:true      //允許進入編輯器的div標簽自動變成p標簽
    //,rgb2Hex:true               //默認產出的資料中的color自動從rgb格式變成16進製格式

    // xss 過滤是否開啟,inserthtml等操作
    , xssFilterRules: true
    //input xss過滤
    , inputXssFilter: true
    //output xss過滤
    , outputXssFilter: true
    // xss過滤白名單 名單來源: https://raw.githubusercontent.com/leizongmin/js-xss/master/lib/default.js
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
