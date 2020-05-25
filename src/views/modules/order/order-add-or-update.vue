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
      <el-form-item label="member_id" prop="memberId">
        <el-input v-model="dataForm.memberId" placeholder="member_id"></el-input>
      </el-form-item>
      <el-form-item label="订單号" prop="orderSn">
        <el-input v-model="dataForm.orderSn" placeholder="订單号"></el-input>
      </el-form-item>
      <el-form-item label="使用的優惠券" prop="couponId">
        <el-input v-model="dataForm.couponId" placeholder="使用的優惠券"></el-input>
      </el-form-item>
      <el-form-item label="create_time" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="create_time"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="memberUsername">
        <el-input v-model="dataForm.memberUsername" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="订單总额" prop="totalAmount">
        <el-input v-model="dataForm.totalAmount" placeholder="订單总额"></el-input>
      </el-form-item>
      <el-form-item label="应付总额" prop="payAmount">
        <el-input v-model="dataForm.payAmount" placeholder="应付总额"></el-input>
      </el-form-item>
      <el-form-item label="运费金额" prop="freightAmount">
        <el-input v-model="dataForm.freightAmount" placeholder="运费金额"></el-input>
      </el-form-item>
      <el-form-item label="促销優化金额（促销價、滿減、阶梯價）" prop="promotionAmount">
        <el-input v-model="dataForm.promotionAmount" placeholder="促销優化金额（促销價、滿減、阶梯價）"></el-input>
      </el-form-item>
      <el-form-item label="積分抵扣金额" prop="integrationAmount">
        <el-input v-model="dataForm.integrationAmount" placeholder="積分抵扣金额"></el-input>
      </el-form-item>
      <el-form-item label="優惠券抵扣金额" prop="couponAmount">
        <el-input v-model="dataForm.couponAmount" placeholder="優惠券抵扣金额"></el-input>
      </el-form-item>
      <el-form-item label="后台调整订單使用的折扣金额" prop="discountAmount">
        <el-input v-model="dataForm.discountAmount" placeholder="后台调整订單使用的折扣金额"></el-input>
      </el-form-item>
      <el-form-item label="支付方式【1->支付宝；2->微信；3->银联； 4->货到付款；】" prop="payType">
        <el-input v-model="dataForm.payType" placeholder="支付方式【1->支付宝；2->微信；3->银联； 4->货到付款；】"></el-input>
      </el-form-item>
      <el-form-item label="订單来源[0->PC订單；1->app订單]" prop="sourceType">
        <el-input v-model="dataForm.sourceType" placeholder="订單来源[0->PC订單；1->app订單]"></el-input>
      </el-form-item>
      <el-form-item label="订單状态【0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订單】" prop="status">
        <el-input
          v-model="dataForm.status"
          placeholder="订單状态【0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订單】"
        ></el-input>
      </el-form-item>
      <el-form-item label="物流公司(配送方式)" prop="deliveryCompany">
        <el-input v-model="dataForm.deliveryCompany" placeholder="物流公司(配送方式)"></el-input>
      </el-form-item>
      <el-form-item label="物流單号" prop="deliverySn">
        <el-input v-model="dataForm.deliverySn" placeholder="物流單号"></el-input>
      </el-form-item>
      <el-form-item label="自动确認时间（天）" prop="autoConfirmDay">
        <el-input v-model="dataForm.autoConfirmDay" placeholder="自动确認时间（天）"></el-input>
      </el-form-item>
      <el-form-item label="可以获得的積分" prop="integration">
        <el-input v-model="dataForm.integration" placeholder="可以获得的積分"></el-input>
      </el-form-item>
      <el-form-item label="可以获得的成長值" prop="growth">
        <el-input v-model="dataForm.growth" placeholder="可以获得的成長值"></el-input>
      </el-form-item>
      <el-form-item label="发票類型[0->不开发票；1->电子发票；2->纸质发票]" prop="billType">
        <el-input v-model="dataForm.billType" placeholder="发票類型[0->不开发票；1->电子发票；2->纸质发票]"></el-input>
      </el-form-item>
      <el-form-item label="发票抬头" prop="billHeader">
        <el-input v-model="dataForm.billHeader" placeholder="发票抬头"></el-input>
      </el-form-item>
      <el-form-item label="发票内容" prop="billContent">
        <el-input v-model="dataForm.billContent" placeholder="发票内容"></el-input>
      </el-form-item>
      <el-form-item label="收票人电话" prop="billReceiverPhone">
        <el-input v-model="dataForm.billReceiverPhone" placeholder="收票人电话"></el-input>
      </el-form-item>
      <el-form-item label="收票人邮箱" prop="billReceiverEmail">
        <el-input v-model="dataForm.billReceiverEmail" placeholder="收票人邮箱"></el-input>
      </el-form-item>
      <el-form-item label="收货人姓名" prop="receiverName">
        <el-input v-model="dataForm.receiverName" placeholder="收货人姓名"></el-input>
      </el-form-item>
      <el-form-item label="收货人电话" prop="receiverPhone">
        <el-input v-model="dataForm.receiverPhone" placeholder="收货人电话"></el-input>
      </el-form-item>
      <el-form-item label="收货人邮编" prop="receiverPostCode">
        <el-input v-model="dataForm.receiverPostCode" placeholder="收货人邮编"></el-input>
      </el-form-item>
      <el-form-item label="省份/直辖市" prop="receiverProvince">
        <el-input v-model="dataForm.receiverProvince" placeholder="省份/直辖市"></el-input>
      </el-form-item>
      <el-form-item label="城市" prop="receiverCity">
        <el-input v-model="dataForm.receiverCity" placeholder="城市"></el-input>
      </el-form-item>
      <el-form-item label="区" prop="receiverRegion">
        <el-input v-model="dataForm.receiverRegion" placeholder="区"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="receiverDetailAddress">
        <el-input v-model="dataForm.receiverDetailAddress" placeholder="详细地址"></el-input>
      </el-form-item>
      <el-form-item label="订單备注" prop="note">
        <el-input v-model="dataForm.note" placeholder="订單备注"></el-input>
      </el-form-item>
      <el-form-item label="确認收货状态[0->未确認；1->已确認]" prop="confirmStatus">
        <el-input v-model="dataForm.confirmStatus" placeholder="确認收货状态[0->未确認；1->已确認]"></el-input>
      </el-form-item>
      <el-form-item label="删除状态【0->未删除；1->已删除】" prop="deleteStatus">
        <el-input v-model="dataForm.deleteStatus" placeholder="删除状态【0->未删除；1->已删除】"></el-input>
      </el-form-item>
      <el-form-item label="下單时使用的積分" prop="useIntegration">
        <el-input v-model="dataForm.useIntegration" placeholder="下單时使用的積分"></el-input>
      </el-form-item>
      <el-form-item label="支付时间" prop="paymentTime">
        <el-input v-model="dataForm.paymentTime" placeholder="支付时间"></el-input>
      </el-form-item>
      <el-form-item label="发货时间" prop="deliveryTime">
        <el-input v-model="dataForm.deliveryTime" placeholder="发货时间"></el-input>
      </el-form-item>
      <el-form-item label="确認收货时间" prop="receiveTime">
        <el-input v-model="dataForm.receiveTime" placeholder="确認收货时间"></el-input>
      </el-form-item>
      <el-form-item label="评價时间" prop="commentTime">
        <el-input v-model="dataForm.commentTime" placeholder="评價时间"></el-input>
      </el-form-item>
      <el-form-item label="修改时间" prop="modifyTime">
        <el-input v-model="dataForm.modifyTime" placeholder="修改时间"></el-input>
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
        memberId: "",
        orderSn: "",
        couponId: "",
        createTime: "",
        memberUsername: "",
        totalAmount: "",
        payAmount: "",
        freightAmount: "",
        promotionAmount: "",
        integrationAmount: "",
        couponAmount: "",
        discountAmount: "",
        payType: "",
        sourceType: "",
        status: "",
        deliveryCompany: "",
        deliverySn: "",
        autoConfirmDay: "",
        integration: "",
        growth: "",
        billType: "",
        billHeader: "",
        billContent: "",
        billReceiverPhone: "",
        billReceiverEmail: "",
        receiverName: "",
        receiverPhone: "",
        receiverPostCode: "",
        receiverProvince: "",
        receiverCity: "",
        receiverRegion: "",
        receiverDetailAddress: "",
        note: "",
        confirmStatus: "",
        deleteStatus: "",
        useIntegration: "",
        paymentTime: "",
        deliveryTime: "",
        receiveTime: "",
        commentTime: "",
        modifyTime: ""
      },
      dataRule: {
        memberId: [
          { required: true, message: "member_id不能為空", trigger: "blur" }
        ],
        orderSn: [
          { required: true, message: "订單号不能為空", trigger: "blur" }
        ],
        couponId: [
          { required: true, message: "使用的優惠券不能為空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "create_time不能為空", trigger: "blur" }
        ],
        memberUsername: [
          { required: true, message: "用户名不能為空", trigger: "blur" }
        ],
        totalAmount: [
          { required: true, message: "订單总额不能為空", trigger: "blur" }
        ],
        payAmount: [
          { required: true, message: "应付总额不能為空", trigger: "blur" }
        ],
        freightAmount: [
          { required: true, message: "运费金额不能為空", trigger: "blur" }
        ],
        promotionAmount: [
          {
            required: true,
            message: "促销優化金额（促销價、滿減、阶梯價）不能為空",
            trigger: "blur"
          }
        ],
        integrationAmount: [
          { required: true, message: "積分抵扣金额不能為空", trigger: "blur" }
        ],
        couponAmount: [
          { required: true, message: "優惠券抵扣金额不能為空", trigger: "blur" }
        ],
        discountAmount: [
          {
            required: true,
            message: "后台调整订單使用的折扣金额不能為空",
            trigger: "blur"
          }
        ],
        payType: [
          {
            required: true,
            message:
              "支付方式【1->支付宝；2->微信；3->银联； 4->货到付款；】不能為空",
            trigger: "blur"
          }
        ],
        sourceType: [
          {
            required: true,
            message: "订單来源[0->PC订單；1->app订單]不能為空",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message:
              "订單状态【0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订單】不能為空",
            trigger: "blur"
          }
        ],
        deliveryCompany: [
          {
            required: true,
            message: "物流公司(配送方式)不能為空",
            trigger: "blur"
          }
        ],
        deliverySn: [
          { required: true, message: "物流單号不能為空", trigger: "blur" }
        ],
        autoConfirmDay: [
          {
            required: true,
            message: "自动确認时间（天）不能為空",
            trigger: "blur"
          }
        ],
        integration: [
          { required: true, message: "可以获得的積分不能為空", trigger: "blur" }
        ],
        growth: [
          {
            required: true,
            message: "可以获得的成長值不能為空",
            trigger: "blur"
          }
        ],
        billType: [
          {
            required: true,
            message: "发票類型[0->不开发票；1->电子发票；2->纸质发票]不能為空",
            trigger: "blur"
          }
        ],
        billHeader: [
          { required: true, message: "发票抬头不能為空", trigger: "blur" }
        ],
        billContent: [
          { required: true, message: "发票内容不能為空", trigger: "blur" }
        ],
        billReceiverPhone: [
          { required: true, message: "收票人电话不能為空", trigger: "blur" }
        ],
        billReceiverEmail: [
          { required: true, message: "收票人邮箱不能為空", trigger: "blur" }
        ],
        receiverName: [
          { required: true, message: "收货人姓名不能為空", trigger: "blur" }
        ],
        receiverPhone: [
          { required: true, message: "收货人电话不能為空", trigger: "blur" }
        ],
        receiverPostCode: [
          { required: true, message: "收货人邮编不能為空", trigger: "blur" }
        ],
        receiverProvince: [
          { required: true, message: "省份/直辖市不能為空", trigger: "blur" }
        ],
        receiverCity: [
          { required: true, message: "城市不能為空", trigger: "blur" }
        ],
        receiverRegion: [
          { required: true, message: "区不能為空", trigger: "blur" }
        ],
        receiverDetailAddress: [
          { required: true, message: "详细地址不能為空", trigger: "blur" }
        ],
        note: [
          { required: true, message: "订單备注不能為空", trigger: "blur" }
        ],
        confirmStatus: [
          {
            required: true,
            message: "确認收货状态[0->未确認；1->已确認]不能為空",
            trigger: "blur"
          }
        ],
        deleteStatus: [
          {
            required: true,
            message: "删除状态【0->未删除；1->已删除】不能為空",
            trigger: "blur"
          }
        ],
        useIntegration: [
          {
            required: true,
            message: "下單时使用的積分不能為空",
            trigger: "blur"
          }
        ],
        paymentTime: [
          { required: true, message: "支付时间不能為空", trigger: "blur" }
        ],
        deliveryTime: [
          { required: true, message: "发货时间不能為空", trigger: "blur" }
        ],
        receiveTime: [
          { required: true, message: "确認收货时间不能為空", trigger: "blur" }
        ],
        commentTime: [
          { required: true, message: "评價时间不能為空", trigger: "blur" }
        ],
        modifyTime: [
          { required: true, message: "修改时间不能為空", trigger: "blur" }
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
            url: this.$http.adornUrl(`/order/order/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.memberId = data.order.memberId;
              this.dataForm.orderSn = data.order.orderSn;
              this.dataForm.couponId = data.order.couponId;
              this.dataForm.createTime = data.order.createTime;
              this.dataForm.memberUsername = data.order.memberUsername;
              this.dataForm.totalAmount = data.order.totalAmount;
              this.dataForm.payAmount = data.order.payAmount;
              this.dataForm.freightAmount = data.order.freightAmount;
              this.dataForm.promotionAmount = data.order.promotionAmount;
              this.dataForm.integrationAmount = data.order.integrationAmount;
              this.dataForm.couponAmount = data.order.couponAmount;
              this.dataForm.discountAmount = data.order.discountAmount;
              this.dataForm.payType = data.order.payType;
              this.dataForm.sourceType = data.order.sourceType;
              this.dataForm.status = data.order.status;
              this.dataForm.deliveryCompany = data.order.deliveryCompany;
              this.dataForm.deliverySn = data.order.deliverySn;
              this.dataForm.autoConfirmDay = data.order.autoConfirmDay;
              this.dataForm.integration = data.order.integration;
              this.dataForm.growth = data.order.growth;
              this.dataForm.billType = data.order.billType;
              this.dataForm.billHeader = data.order.billHeader;
              this.dataForm.billContent = data.order.billContent;
              this.dataForm.billReceiverPhone = data.order.billReceiverPhone;
              this.dataForm.billReceiverEmail = data.order.billReceiverEmail;
              this.dataForm.receiverName = data.order.receiverName;
              this.dataForm.receiverPhone = data.order.receiverPhone;
              this.dataForm.receiverPostCode = data.order.receiverPostCode;
              this.dataForm.receiverProvince = data.order.receiverProvince;
              this.dataForm.receiverCity = data.order.receiverCity;
              this.dataForm.receiverRegion = data.order.receiverRegion;
              this.dataForm.receiverDetailAddress =
                data.order.receiverDetailAddress;
              this.dataForm.note = data.order.note;
              this.dataForm.confirmStatus = data.order.confirmStatus;
              this.dataForm.deleteStatus = data.order.deleteStatus;
              this.dataForm.useIntegration = data.order.useIntegration;
              this.dataForm.paymentTime = data.order.paymentTime;
              this.dataForm.deliveryTime = data.order.deliveryTime;
              this.dataForm.receiveTime = data.order.receiveTime;
              this.dataForm.commentTime = data.order.commentTime;
              this.dataForm.modifyTime = data.order.modifyTime;
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
              `/order/order/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              memberId: this.dataForm.memberId,
              orderSn: this.dataForm.orderSn,
              couponId: this.dataForm.couponId,
              createTime: this.dataForm.createTime,
              memberUsername: this.dataForm.memberUsername,
              totalAmount: this.dataForm.totalAmount,
              payAmount: this.dataForm.payAmount,
              freightAmount: this.dataForm.freightAmount,
              promotionAmount: this.dataForm.promotionAmount,
              integrationAmount: this.dataForm.integrationAmount,
              couponAmount: this.dataForm.couponAmount,
              discountAmount: this.dataForm.discountAmount,
              payType: this.dataForm.payType,
              sourceType: this.dataForm.sourceType,
              status: this.dataForm.status,
              deliveryCompany: this.dataForm.deliveryCompany,
              deliverySn: this.dataForm.deliverySn,
              autoConfirmDay: this.dataForm.autoConfirmDay,
              integration: this.dataForm.integration,
              growth: this.dataForm.growth,
              billType: this.dataForm.billType,
              billHeader: this.dataForm.billHeader,
              billContent: this.dataForm.billContent,
              billReceiverPhone: this.dataForm.billReceiverPhone,
              billReceiverEmail: this.dataForm.billReceiverEmail,
              receiverName: this.dataForm.receiverName,
              receiverPhone: this.dataForm.receiverPhone,
              receiverPostCode: this.dataForm.receiverPostCode,
              receiverProvince: this.dataForm.receiverProvince,
              receiverCity: this.dataForm.receiverCity,
              receiverRegion: this.dataForm.receiverRegion,
              receiverDetailAddress: this.dataForm.receiverDetailAddress,
              note: this.dataForm.note,
              confirmStatus: this.dataForm.confirmStatus,
              deleteStatus: this.dataForm.deleteStatus,
              useIntegration: this.dataForm.useIntegration,
              paymentTime: this.dataForm.paymentTime,
              deliveryTime: this.dataForm.deliveryTime,
              receiveTime: this.dataForm.receiveTime,
              commentTime: this.dataForm.commentTime,
              modifyTime: this.dataForm.modifyTime
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
