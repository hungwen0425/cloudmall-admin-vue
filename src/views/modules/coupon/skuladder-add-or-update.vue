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
      <el-form-item label="spu_id" prop="skuId">
        <el-input v-model="dataForm.skuId" placeholder="spu_id"></el-input>
      </el-form-item>
      <el-form-item label="滿幾件" prop="fullCount">
        <el-input v-model="dataForm.fullCount" placeholder="滿幾件"></el-input>
      </el-form-item>
      <el-form-item label="打幾折" prop="discount">
        <el-input v-model="dataForm.discount" placeholder="打幾折"></el-input>
      </el-form-item>
      <el-form-item label="折後價" prop="price">
        <el-input v-model="dataForm.price" placeholder="折後價"></el-input>
      </el-form-item>
      <el-form-item label="是否疊加其他優惠" prop="addOther">
        <el-select v-model="dataForm.addOther" placeholder="請選擇">
          <el-option label="不可疊加" :value="0"></el-option>
          <el-option label="不可疊加" :value="1"></el-option>
        </el-select>
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
        skuId: "",
        fullCount: "",
        discount: "",
        price: "",
        addOther: ""
      },
      dataRule: {
        skuId: [{ required: true, message: "spu_id不能為空", trigger: "blur" }],
        fullCount: [
          { required: true, message: "滿幾件不能為空", trigger: "blur" }
        ],
        discount: [
          { required: true, message: "打幾折不能為空", trigger: "blur" }
        ],
        price: [{ required: true, message: "折後價不能為空", trigger: "blur" }],
        addOther: [
          {
            required: true,
            message: "是否疊加其他優惠[0-不可疊加，1-可疊加]不能為空",
            trigger: "blur"
          }
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
            url: this.$http.adornUrl(
              `/coupon/skuladder/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.skuId = data.skuLadder.skuId;
              this.dataForm.fullCount = data.skuLadder.fullCount;
              this.dataForm.discount = data.skuLadder.discount;
              this.dataForm.price = data.skuLadder.price;
              this.dataForm.addOther = data.skuLadder.addOther;
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
              `/coupon/skuladder/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              skuId: this.dataForm.skuId,
              fullCount: this.dataForm.fullCount,
              discount: this.dataForm.discount,
              price: this.dataForm.price,
              addOther: this.dataForm.addOther
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
