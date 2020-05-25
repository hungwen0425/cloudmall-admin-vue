<template>
  <!--
使用说明：
1）、引入category-cascader.vue
2）、语法：<category-cascader :catelogPath.sync="catelogPath"></category-cascader>
    解释：
      catelogPath：指定的值是cascader初始化需要显示的值，应该和父組件的catelogPath绑定;
          由於有sync修饰符，所以cascader路徑變化以後自動會修改父的catelogPath，這是結合子組件this.$emit("update:catelogPath",v);做的
  -->
  <div>
    <el-cascader
      filterable
      clearable
      placeholder="试试搜索：手机"
      v-model="paths"
      :options="categorys"
      :props="setting"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  //import引入的組件需要注入到物件中才能使用
  components: {},
  //接受父組件傳来的值
  props: {
    catelogPath: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    //這裡存放資料
    return {
      setting: {
        value: "catId",
        label: "name",
        children: "children"
      },
      categorys: [],
      paths: this.catelogPath
    };
  },
  watch: {
    catelogPath(v) {
      this.paths = this.catelogPath;
    },
    paths(v) {
      this.$emit("update:catelogPath", v);
      //還可以使用pubsub-js進行傳值
      this.PubSub.publish("catPath", v);
    }
  },
  //方法集合
  methods: {
    getCategorys() {
      this.$http({
        url: this.$http.adornUrl("/product/category/list/tree"),
        method: "get"
      }).then(({ data }) => {
        this.categorys = data.data;
      });
    }
  },
  //生命週期 - 創建完成（可以訪問當前this實例）
  created() {
    this.getCategorys();
  }
};
</script>
<style scoped>
</style>
