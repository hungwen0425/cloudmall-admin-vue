<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <el-form-item label="bean名稱" prop="beanName">
        <el-input v-model="dataForm.beanName" placeholder="spring bean名稱, 如: testTask"></el-input>
      </el-form-item>
      <el-form-item label="参數" prop="params">
        <el-input v-model="dataForm.params" placeholder="参數"></el-input>
      </el-form-item>
      <el-form-item label="cron表達式" prop="cronExpression">
        <el-input v-model="dataForm.cronExpression" placeholder="如: 0 0 12 * * ?"></el-input>
      </el-form-item>
      <el-form-item label="備註" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="備註"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">確定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        beanName: "",
        params: "",
        cronExpression: "",
        remark: "",
        status: 0
      },
      dataRule: {
        beanName: [
          { required: true, message: "使用者名稱不能為空", trigger: "blur" }
        ],
        cronExpression: [
          { required: true, message: "cron表達式不能為空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/schedule/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.beanName = data.schedule.beanName;
              this.dataForm.params = data.schedule.params;
              this.dataForm.cronExpression = data.schedule.cronExpression;
              this.dataForm.remark = data.schedule.remark;
              this.dataForm.status = data.schedule.status;
            }
          });
        }
      });
    },
    // 表單提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/schedule/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              jobId: this.dataForm.id || undefined,
              beanName: this.dataForm.beanName,
              params: this.dataForm.params,
              cronExpression: this.dataForm.cronExpression,
              remark: this.dataForm.remark,
              status: !this.dataForm.id ? undefined : this.dataForm.status
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
