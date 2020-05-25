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
      <el-form-item label="仓库名" prop="name">
        <el-input v-model="dataForm.name" placeholder="仓库名"></el-input>
      </el-form-item>
      <el-form-item label="仓库地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="仓库地址"></el-input>
      </el-form-item>
      <el-form-item label="区域编码" prop="areaCode">
        <el-input v-model="dataForm.areaCode" placeholder="区域编码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
        areaCode: ""
      },
      dataRule: {
        name: [{ required: true, message: "仓库名不能為空", trigger: "blur" }],
        address: [
          { required: true, message: "仓库地址不能為空", trigger: "blur" }
        ],
        areaCode: [
          { required: true, message: "区域编码不能為空", trigger: "blur" }
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
            if (data && data.code === 0) {
              this.dataForm.name = data.wareInfo.name;
              this.dataForm.address = data.wareInfo.address;
              this.dataForm.areaCode = data.wareInfo.areaCode;
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
              areaCode: this.dataForm.areaCode
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
