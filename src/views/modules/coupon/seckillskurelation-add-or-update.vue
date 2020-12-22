<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="活動場次id" prop="promotionSessionId">
        <el-input
          v-model="sessionId"
          placeholder="活動場次id"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品id" prop="skuId">
        <el-input v-model="dataForm.skuId" placeholder="商品id"></el-input>
      </el-form-item>
      <el-form-item label="限時搶購價格" prop="seckillPrice">
        <el-input-number
          v-model="dataForm.seckillPrice"
          :min="0"
          :precision="2"
          :step="0.1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="限時搶購總量" prop="seckillCount">
        <el-input-number
          v-model="dataForm.seckillCount"
          :min="1"
          label="限時搶購總量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="每人限購數量" prop="seckillLimit">
        <el-input-number
          v-model="dataForm.seckillLimit"
          :min="1"
          label="每人限購數量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="排序" prop="seckillSort">
        <el-input v-model="dataForm.seckillSort" placeholder="排序"></el-input>
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
        promotionId: "",
        promotionSessionId: "",
        skuId: "",
        seckillPrice: "",
        seckillCount: "",
        seckillLimit: 1,
        seckillSort: 0,
      },
      dataRule: {
        sessionId: [
          { required: true, message: "活動場次id不能為空", trigger: "blur" },
        ],
        skuId: [{ required: true, message: "商品id不能為空", trigger: "blur" }],
        seckillPrice: [
          { required: true, message: "限時搶購價格不能為空", trigger: "blur" },
        ],
        seckillCount: [
          { required: true, message: "限時搶購總量不能為空", trigger: "blur" },
        ],
        seckillLimit: [
          { required: true, message: "每人限購數量不能為空", trigger: "blur" },
        ],
        seckillSort: [
          { required: true, message: "排序不能為空", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    sessionId: {
      type: Number,
      default: 0,
    },
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
              `/coupon/seckillskurelation/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.promotionId = data.seckillSkuRelation.promotionId;
              this.dataForm.promotionSessionId =
                data.seckillSkuRelation.promotionSessionId;
              this.dataForm.skuId = data.seckillSkuRelation.skuId;
              this.dataForm.seckillPrice = data.seckillSkuRelation.seckillPrice;
              this.dataForm.seckillCount = data.seckillSkuRelation.seckillCount;
              this.dataForm.seckillLimit = data.seckillSkuRelation.seckillLimit;
              this.dataForm.seckillSort = data.seckillSkuRelation.seckillSort;
            }
          });
        }
      });
    },
    // 表單提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/coupon/seckillskurelation/${
                !this.dataForm.id ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              promotionId: this.dataForm.promotionId,
              promotionSessionId: this.sessionId,
              skuId: this.dataForm.skuId,
              seckillPrice: this.dataForm.seckillPrice,
              seckillCount: this.dataForm.seckillCount,
              seckillLimit: this.dataForm.seckillLimit,
              seckillSort: this.dataForm.seckillSort,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
  },
};
</script>
