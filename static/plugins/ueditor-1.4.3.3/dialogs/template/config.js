/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 12-8-8
 * Time: 下午2:00
 * To change this template use File | Settings | File Templates.
 */
var templates = [
  {
    "pre": "pre0.png",
    'title': lang.blank,
    'preHtml': '<p class="ue_t">&nbsp;歡迎使用UEditor！</p>',
    "html": '<p class="ue_t">歡迎使用UEditor！</p>'

  },
  {
    "pre": "pre1.png",
    'title': lang.blog,
    'preHtml': '<h1 label="Title center" name="tc" style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;text-align:center;margin:0px 0px 20px;"><span style="color:#c0504d;">深入理解Range</span></h1><p style="text-align:center;"><strong class=" ">UEditor二次開發</strong></p><h3><span class=" " style="font-family:幼圆">什么是Range</span></h3><p style="text-indent:2em;">對於“插入”選項卡上的庫，在設計時都充分考虑了其中的項與文件整體外观的协調性。 </p><br /><h3><span class=" " style="font-family:幼圆">Range能干什么</span></h3><p style="text-indent:2em;">在“開始”選項卡上，通過從快速樣式庫中為所選文本選擇一種外观，您可以方便地更改文件中所選文本的格式。</p>',
    "html": '<h1 class="ue_t" label="Title center" name="tc" style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;text-align:center;margin:0px 0px 20px;"><span style="color:#c0504d;">[键入文件標題]</span></h1><p style="text-align:center;"><strong class="ue_t">[键入文件副標題]</strong></p><h3><span class="ue_t" style="font-family:幼圆">[標題 1]</span></h3><p class="ue_t"  style="text-indent:2em;">對於“插入”選項卡上的庫，在設計時都充分考虑了其中的項與文件整體外观的协調性。 您可以使用這些庫來插入表格、頁眉、頁脚、列表、封面以及其他文件構建基塊。 您創建的圖片、圖表或關系圖也將與當前的文件外观协調一致。</p><h3><span class="ue_t" style="font-family:幼圆">[標題 2]</span></h3><p class="ue_t"  style="text-indent:2em;">在“開始”選項卡上，通過從快速樣式庫中為所選文本選擇一種外观，您可以方便地更改文件中所選文本的格式。 您還可以使用“開始”選項卡上的其他控件來直接設定文本格式。大多數控件都允許您選擇是使用當前主題外观，還是使用某種直接指定的格式。 </p><h3><span class="ue_t" style="font-family:幼圆">[標題 3]</span></h3><p class="ue_t">對於“插入”選項卡上的庫，在設計時都充分考虑了其中的項與文件整體外观的协調性。 您可以使用這些庫來插入表格、頁眉、頁脚、列表、封面以及其他文件構建基塊。 您創建的圖片、圖表或關系圖也將與當前的文件外观协調一致。</p><p class="ue_t"><br /></p>'

  },
  {
    "pre": "pre2.png",
    'title': lang.resume,
    'preHtml': '<h1 label="Title left" name="tl" style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;margin:0px 0px 10px;"><span style="color:#e36c09;" class=" ">WEB前端開發簡厲</span></h1><table width="100%" border="1" bordercolor="#95B3D7" style="border-collapse:collapse;"><tbody><tr><td width="100" style="text-align:center;"><p><span style="background-color:transparent;">插</span><br /></p><p>入</p><p>照</p><p>片</p></td><td><p><span style="background-color:transparent;"> 聯系電話：</span><span class="ue_t" style="background-color:transparent;">[键入您的電話]</span><br /></p><p><span style="background-color:transparent;"> 電子郵件：</span><span class="ue_t" style="background-color:transparent;">[键入您的電子郵件地址]</span><br /></p><p><span style="background-color:transparent;"> 家庭住址：</span><span class="ue_t" style="background-color:transparent;">[键入您的地址]</span><br /></p></td></tr></tbody></table><h3><span style="color:#E36C09;font-size:20px;">目標職位</span></h3><p style="text-indent:2em;" class=" ">WEB前端研發工程师</p><h3><span style="color:#e36c09;font-size:20px;">學厲</span></h3><p><span style="display:none;line-height:0px;" id="_baidu_bookmark_start_26">﻿</span></p><ol style="list-style-type:decimal;"><li><p><span class="ue_t">[起止時間]</span> <span class="ue_t">[學校名稱] </span> <span class="ue_t">[所學專業]</span> <span class="ue_t">[所獲學位]</span></p></li></ol><h3><span style="color:#e36c09;font-size:20px;" class="ue_t">工作經驗</span></h3><p><br /></p>',
    "html": '<h1 label="Title left" name="tl" style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;margin:0px 0px 10px;"><span style="color:#e36c09;" class="ue_t">[此處键入簡厲標題]</span></h1><p><span style="color:#e36c09;"><br /></span></p><table width="100%" border="1" bordercolor="#95B3D7" style="border-collapse:collapse;"><tbody><tr><td width="200" style="text-align:center;" class="ue_t">【此處插入照片】</td><td><p><br /></p><p> 聯系電話：<span class="ue_t">[键入您的電話]</span></p><p><br /></p><p> 電子郵件：<span class="ue_t">[键入您的電子郵件地址]</span></p><p><br /></p><p> 家庭住址：<span class="ue_t">[键入您的地址]</span></p><p><br /></p></td></tr></tbody></table><h3><span style="color:#e36c09;font-size:20px;">目標職位</span></h3><p style="text-indent:2em;" class="ue_t">[此處键入您的期望職位]</p><h3><span style="color:#e36c09;font-size:20px;">學厲</span></h3><p><span style="display:none;line-height:0px;" id="_baidu_bookmark_start_26">﻿</span></p><ol style="list-style-type:decimal;"><li><p><span class="ue_t">[键入起止時間]</span> <span class="ue_t">[键入學校名稱] </span> <span class="ue_t">[键入所學專業]</span> <span class="ue_t">[键入所獲學位]</span></p></li><li><p><span class="ue_t">[键入起止時間]</span> <span class="ue_t">[键入學校名稱]</span> <span class="ue_t">[键入所學專業]</span> <span class="ue_t">[键入所獲學位]</span></p></li></ol><h3><span style="color:#e36c09;font-size:20px;" class="ue_t">工作經驗</span></h3><ol style="list-style-type:decimal;"><li><p><span class="ue_t">[键入起止時間]</span> <span class="ue_t">[键入公司名稱]</span> <span class="ue_t">[键入職位名稱]</span> </p></li><ol style="list-style-type:lower-alpha;"><li><p><span class="ue_t">[键入負責專案]</span> <span class="ue_t">[键入專案簡介]</span></p></li><li><p><span class="ue_t">[键入負責專案]</span> <span class="ue_t">[键入專案簡介]</span></p></li></ol><li><p><span class="ue_t">[键入起止時間]</span> <span class="ue_t">[键入公司名稱]</span> <span class="ue_t">[键入職位名稱]</span> </p></li><ol style="list-style-type:lower-alpha;"><li><p><span class="ue_t">[键入負責專案]</span> <span class="ue_t">[键入專案簡介]</span></p></li></ol></ol><p><span style="color:#e36c09;font-size:20px;">掌握技能</span></p><p style="text-indent:2em;"> &nbsp;<span class="ue_t">[這裡可以键入您所掌握的技能]</span><br /></p>'

  },
  {
    "pre": "pre3.png",
    'title': lang.richText,
    'preHtml': '<h1 label="Title center" name="tc" style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;text-align:center;margin:0px 0px 20px;" class="ue_t">[此處键入文章標題]</h1><p><img src="http://img.baidu.com/hi/youa/y_0034.gif" width="150" height="100" border="0" hspace="0" vspace="0" style="width:150px;height:100px;float:left;" />圖文混排方法</p><p>圖片居左，文字圍繞圖片排版</p><p>方法：在文字前面插入圖片，設定居左對齊，然後即可在右邊输入多行文</p><p><br /></p><p><img src="http://img.baidu.com/hi/youa/y_0040.gif" width="100" height="100" border="0" hspace="0" vspace="0" style="width:100px;height:100px;float:right;" /></p><p>還有没有什么其他的環绕方式呢？這裡是居右環绕</p><p><br /></p><p>歡迎大家多多嘗試，為UEditor提供更多高質量模板！</p>',
    "html": '<p><br /></p><h1 label="Title center" name="tc" style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;text-align:center;margin:0px 0px 20px;" class="ue_t">[此處键入文章標題]</h1><p><img src="http://img.baidu.com/hi/youa/y_0034.gif" width="300" height="200" border="0" hspace="0" vspace="0" style="width:300px;height:200px;float:left;" />圖文混排方法</p><p>1. 圖片居左，文字圍繞圖片排版</p><p>方法：在文字前面插入圖片，設定居左對齊，然後即可在右邊输入多行文本</p><p><br /></p><p>2. 圖片居右，文字圍繞圖片排版</p><p>方法：在文字前面插入圖片，設定居右對齊，然後即可在左邊输入多行文本</p><p><br /></p><p>3. 圖片居中環绕排版</p><p>方法：亲，這個真心没有办法。。。</p><p><br /></p><p><br /></p><p><img src="http://img.baidu.com/hi/youa/y_0040.gif" width="300" height="300" border="0" hspace="0" vspace="0" style="width:300px;height:300px;float:right;" /></p><p>還有没有什么其他的環绕方式呢？這裡是居右環绕</p><p><br /></p><p>歡迎大家多多嘗試，為UEditor提供更多高質量模板！</p><p><br /></p><p>占位</p><p><br /></p><p>占位</p><p><br /></p><p>占位</p><p><br /></p><p>占位</p><p><br /></p><p>占位</p><p><br /></p><p><br /></p>'
  },
  {
    "pre": "pre4.png",
    'title': lang.sciPapers,
    'preHtml': '<h2 style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;margin:0px 0px 10px;text-align:center;" class="ue_t">[键入文章標題]</h2><p><strong><span style="font-size:12px;">摘要</span></strong><span style="font-size:12px;" class="ue_t">：這裡可以输入很長很長很長很長很長很長很長很長很差的摘要</span></p><p style="line-height:1.5em;"><strong>標題 1</strong></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">這裡可以输入很多内容，可以圖文混排，可以有列表等。</span></p><p style="line-height:1.5em;"><strong>標題 2</strong></p><ol style="list-style-type:lower-alpha;"><li><p class="ue_t">列表 1</p></li><li><p class="ue_t">列表 2</p></li><ol style="list-style-type:lower-roman;"><li><p class="ue_t">多級列表 1</p></li><li><p class="ue_t">多級列表 2</p></li></ol><li><p class="ue_t">列表 3<br /></p></li></ol><p style="line-height:1.5em;"><strong>標題 3</strong></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">來個文字圖文混排的</span></p><p style="text-indent:2em;"><br /></p>',
    'html': '<h2 style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;margin:0px 0px 10px;text-align:center;" class="ue_t">[键入文章標題]</h2><p><strong><span style="font-size:12px;">摘要</span></strong><span style="font-size:12px;" class="ue_t">：這裡可以输入很長很長很長很長很長很長很長很長很差的摘要</span></p><p style="line-height:1.5em;"><strong>標題 1</strong></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">這裡可以输入很多内容，可以圖文混排，可以有列表等。</span></p><p style="line-height:1.5em;"><strong>標題 2</strong></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">來個列表瞅瞅：</span></p><ol style="list-style-type:lower-alpha;"><li><p class="ue_t">列表 1</p></li><li><p class="ue_t">列表 2</p></li><ol style="list-style-type:lower-roman;"><li><p class="ue_t">多級列表 1</p></li><li><p class="ue_t">多級列表 2</p></li></ol><li><p class="ue_t">列表 3<br /></p></li></ol><p style="line-height:1.5em;"><strong>標題 3</strong></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">來個文字圖文混排的</span></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">這裡可以多行</span></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">右邊是圖片</span></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">绝對没有問題的，不信你也可以試試看</span></p><p><br /></p>'
  }
];
