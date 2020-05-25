<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="dataForm">
          <el-form-item label="分類">
            <category-cascader :catelogPath.sync="catelogPath"></category-cascader>
          </el-form-item>
          <el-form-item label="品牌">
            <brand-select style="width:160px"></brand-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select style="width:160px" v-model="dataForm.status" clearable>
              <el-option label="新建" :value="0"></el-option>
              <el-option label="上架" :value="1"></el-option>
              <el-option label="下架" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检索">
            <el-input style="width:160px" v-model="dataForm.key" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSpuInfo">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <spuinfo :catId="catId"></spuinfo>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：組件，工具js，第三方插件js，json文件，圖片文件等等）
//例如：import 《組件名稱》 from '《組件路径》';
import CategoryCascader from "../common/category-cascader";
import BrandSelect from "../common/brand-select";
import Spuinfo from "./spuinfo";
export default {
  //import引入的組件需要注入到對象中才能使用
  components: { CategoryCascader, Spuinfo, BrandSelect },
  props: {},
  data() {
    //这里存放数据
    return {
      catId: 0,
      catelogPath: [],
      dataForm: {
        status: "",
        key: "",
        brandId: 0,
        catelogId: 0
      },
      catPathSub: null,
      brandIdSub: null
    };
  },
  //计算屬性 類似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    searchSpuInfo() {
      console.log("搜索条件", this.dataForm);
      this.PubSub.publish("dataForm", this.dataForm);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.catPathSub = PubSub.subscribe("catPath", (msg, val) => {
      this.dataForm.catelogId = val[val.length - 1];
    });
    this.brandIdSub = PubSub.subscribe("brandId", (msg, val) => {
      this.dataForm.brandId = val;
    });
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {
    PubSub.unsubscribe(this.catPathSub);
    PubSub.unsubscribe(this.brandIdSub);
  }, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这個函数會触发
};
</script>
<style scoped>
</style>
