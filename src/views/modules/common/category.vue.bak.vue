<!--  -->
<template>
  <el-tree
    :data="menus"
    :props="defaultProps"
    node-key="catId"
    ref="menuTree"
    @node-click="nodeClick"
  ></el-tree>
</template>

<script>
//这里可以导入其他文件（比如：組件，工具js，第三方插件js，json文件，圖片文件等等）
//例如：import 《組件名稱》 from '《組件路径》';

export default {
  //import引入的組件需要注入到對象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      menus: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  //监听屬性 類似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    getMenus() {
      this.$http({
        url: this.$http.adornUrl("/product/category/list/tree"),
        method: "get"
      }).then(({ data }) => {
        this.menus = data.data;
      });
    },
    nodeClick(data, node, component) {
      // console.log(data, node, component)
      this.$emit("tree-node-click", data, node, component);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getMenus();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这個函数會触发
};
</script>
<style scoped>
</style>
