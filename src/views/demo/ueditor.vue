<template>
  <div class="mod-demo-ueditor">
    <el-alert title="提示：" type="warning" :closable="false">
      <div slot-scope="description">
        <p
          class="el-alert__description"
        >1. 此Demo只提供UEditor官方使用檔案，入門部署和體驗功能。具體使用請参考：http://fex.baidu.com/ueditor/</p>
        <p
          class="el-alert__description"
        >2. 瀏覽器控制台報錯“請求後台設定項http錯誤，上傳功能將不能正常使用！”，此錯需要後台提供上傳接口方法（賦值給serverUrl屬性）</p>
      </div>
    </el-alert>

    <script :id="ueId" class="ueditor-box" type="text/plain" style="width: 100%; height: 260px;">
  hello world!
    </script>

    <!-- 取得内容 -->
    <p>
      <el-button @click="getContent()">取得内容</el-button>
    </p>
    <el-dialog title="内容" :visible.sync="dialogVisible" :append-to-body="true">
      {{ ueContent }}
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ueditor from "ueditor";
export default {
  data() {
    return {
      ue: null,
      ueId: `J_ueditorBox_${new Date().getTime()}`,
      ueContent: "",
      dialogVisible: false,
    };
  },
  mounted() {
    this.ue = ueditor.getEditor(this.ueId, {
      // serverUrl: '', // 服務器统一請求接口路徑
      zIndex: 3000,
    });
  },
  methods: {
    getContent() {
      this.dialogVisible = true;
      this.ue.ready(() => {
        this.ueContent = this.ue.getContent();
      });
    },
  },
};
</script>

<style lang="scss">
.mod-demo-ueditor {
  position: relative;
  z-index: 510;
  > .el-alert {
    margin-bottom: 10px;
  }
}
</style>
