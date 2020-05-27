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
      label-width="120px"
    >
      <el-form-item label="倉庫名稱" prop="name">
        <el-input v-model="dataForm.name" placeholder="倉庫名稱"></el-input>
      </el-form-item>
      <el-form-item label="倉庫地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="倉庫地址"></el-input>
      </el-form-item>
      <el-form-item label="郵遞區號" prop="areacode">
        <el-input v-model="dataForm.areacode" placeholder="郵遞區號"></el-input>
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
        name: "",
        address: "",
        areacode: ""
      },
      dataRule: {
        name: [
          { required: true, message: "倉庫名稱不能為空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "倉庫地址不能為空", trigger: "blur" }
        ],
        areacode: [
          { required: true, message: "郵遞區號不能為空", trigger: "blur" }
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
            url: this.$http.adornUrl(`/ware/wareinfo/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            console.log("data: ", data)
            if (data && data.code === 0) {
              this.dataForm.name = data.wareInfo.name;
              this.dataForm.address = data.wareInfo.address;
              this.dataForm.areacode = data.wareInfo.areacode;
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
              `/ware/wareinfo/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              address: this.dataForm.address,
              areacode: this.dataForm.areacode
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
