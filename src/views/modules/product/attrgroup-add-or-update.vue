<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="dialogClose">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px">
      <el-form-item label="組名" prop="attrGroupName">
        <el-input v-model="dataForm.attrGroupName" placeholder="組名"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="descript">
        <el-input v-model="dataForm.descript" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="組圖標" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="組圖標"></el-input>
      </el-form-item>
      <el-form-item label="所屬分類" prop="catelogId">
        <!-- <el-input v-model="dataForm.catelogId" placeholder="所屬分類id"></el-input> @change="handleChange" -->
        <!-- <el-cascader filterable placeholder="試試搜索：手機" v-model="catelogPath" :options="categorys"  :props="props"></el-cascader> -->
        <!-- :catelogPath="catelogPath"自定義绑定的屬性，可以给子組件傳值 -->
        <category-cascader :catelogPath.sync="catelogPath"></category-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">確定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 這裡可以導入其他文件（比如：組件，工具js，第三方插件js，json文件，圖片文件等等）
// 例如：import 《组件名稱》 from '《組件路径》';
import CategoryCascader from "../common/category-cascader";
export default {
  //import引入的組件需要注入到物件中才能使用
  components: { CategoryCascader },
  data() {
    // 這裡存放資料
    return {
      props: {
        value: "catId",
        label: "name",
        children: "children"
      },
      visible: false,
      // 宣告商品選單陣列變數
      categorys: [],
      catelogPath: [],
      dataForm: {
        attrGroupId: 0,
        attrGroupName: "",
        sort: "",
        descript: "",
        icon: "",
        catelogId: 0
      },
      dataRule: {
        attrGroupName: [
          { required: true, message: "組名不能為空", trigger: "blur" }
        ],
        sort: [{ required: true, message: "排序不能為空", trigger: "blur" }],
        descript: [
          { required: true, message: "描述不能為空", trigger: "blur" }
        ],
        icon: [{ required: true, message: "組圖標不能為空", trigger: "blur" }],
        catelogId: [
          { required: true, message: "所屬分類 id 不能為空", trigger: "blur" }
        ]
      }
    };
  },
  //監聽屬性 類似於data概念
  computed: {},
  //監控data中的資料變化
  watch: {},
  //方法集合
  methods: {
    dialogClose() {
      this.catelogPath = [];
    },
    getCategorys() {
      this.$http({
        url: this.$http.adornUrl("/product/category/list/tree"),
        method: "get"
      }).then(({ data }) => {
        this.categorys = data.data;
      });
    },
    init(id) {
      this.dataForm.attrGroupId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.attrGroupId) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/attrgroup/info/${this.dataForm.attrGroupId}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.attrGroupName = data.attrGroup.attrGroupName;
              this.dataForm.sort = data.attrGroup.sort;
              this.dataForm.descript = data.attrGroup.descript;
              this.dataForm.icon = data.attrGroup.icon;
              this.dataForm.catelogId = data.attrGroup.catelogId;
              //查出catelogId的完整路徑
              this.catelogPath = data.attrGroup.catelogPath;
            }
          });
        }
      });
    },
    // 表單提交 - 新增、修改
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/attrgroup/${!this.dataForm.attrGroupId ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              attrGroupId: this.dataForm.attrGroupId || undefined,
              attrGroupName: this.dataForm.attrGroupName,
              sort: this.dataForm.sort,
              descript: this.dataForm.descript,
              icon: this.dataForm.icon,
              catelogId: this.catelogPath[this.catelogPath.length - 1]
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
  },
  created() {
    this.getCategorys();
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css類

</style>
