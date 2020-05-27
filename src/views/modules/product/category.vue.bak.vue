<template>
  <div>
    <el-switch v-model="draggable" active-text="開啟托拽" inactive-text="關閉托拽"></el-switch>
    <el-button v-if="draggable" type="success" @click="batchSave">批量保存</el-button>
    <el-button type="danger" @click="batchDelete">批量删除</el-button>
    <el-tree
      :data="menus"
      :props="defaultProps"
      :expand-on-click-node="false"
      show-checkbox
      node-key="catId"
      :default-expanded-keys="expandedKey"
      :draggable="draggable"
      :allow-drop="allowDrop"
      @node-drop="handleDrop"
      ref="menuTree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button v-if="node.level <= 2" type="text" size="mini" @click="() => append(data)">新增</el-button>
          <el-button type="text" size="mini" @click="() => edit(data)">编辑</el-button>
          <el-button
            v-if="node.childNodes.length == 0"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >删除</el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="category" label-width="80px">
        <el-form-item label="分類名稱">
          <el-input v-model="category.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="圖標">
          <el-input v-model="category.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="計量單位">
          <el-input v-model="category.productUnit" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">確 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//這裡可以導入其他文件（比如：組件，工具js，第三方插件js，json文件，圖片文件等等）
//例如：import 《組件名稱》 from '《組件路徑》';

export default {
  //import引入的組件需要注入到物件中才能使用
  components: {},
  data() {
    //這裡存放資料
    return {
      pCid: [],
      draggable: false,
      updateNodes: [],
      maxLevel: 0,
      title: "新增分類",
      dialogType: "", //edit,add
      category: {
        name: "",
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        productUnit: "",
        icon: "",
        catId: null
      },
      dialogVisible: false,
      menus: [],
      expandedKey: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  //監听屬性 類似於data概念
  computed: {},
  //監控data中的資料變化
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
    batchDelete() {
      let deleteNodes = this.$refs.menuTree.getCheckedNodes();
      let { catIds, catNames } = (() => {
        let tmpName = "";
        let catIds = [];
        for (let i = 0; i < deleteNodes.length; i++) {
          //catIds += (i > 0 ? "," : "") + deleteNodes[i].catId;
          catIds.push(deleteNodes[i].catId);
          if (tmpName.length > 10) {
            tmpName += "...";
            if (tmpName.indexOf("...") > -1) {
              continue;
            }
          }
          tmpName += (i > 0 ? "、" : "") + deleteNodes[i].name;
        }
        catNames = tmpName;
        return { catIds, catNames };
      })();

      this.$confirm(`確定删除[${catNames}]選單嗎?`, "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/product/category/delete"),
            method: "post",
            data: this.$http.adornData(catIds, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除選單成功",
                type: "success"
              });
              //定義成功事件
              this.getMenus();
              this.expandedKey = [deleteNodes[0].parentCid];
            } else {
              //顯示失败資料
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    batchSave() {
      this.$http({
        url: this.$http.adornUrl("/product/category/update/sort"),
        method: "post",
        data: this.$http.adornData(this.updateNodes, false)
      }).then(({ data }) => {
        this.$message({
          message: "選單顺序等修改成功",
          type: "success"
        });
        //刷新出新的選單
        this.getMenus();
        //設定需要默認展開的選單
        this.expandedKey = this.pCid;
        this.updateNodes = [];
        this.maxLevel = 0;
        // this.pCid = 0;
      });
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("handleDrop: ", draggingNode, dropNode, dropType);
      //1、當前节點最新的父节點id
      let pCid = 0;
      let siblings = null;
      if (dropType == "before" || dropType == "after") {
        pCid =
          dropNode.parent.data.catId == undefined
            ? 0
            : dropNode.parent.data.catId;
        siblings = dropNode.parent.childNodes;
      } else {
        pCid = dropNode.data.catId;
        siblings = dropNode.childNodes;
      }
      this.pCid.push(pCid);

      //2、當前托拽节點的最新顺序，
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].data.catId == draggingNode.data.catId) {
          //如果遍歷的是當前正在托拽的节點
          let catLevel = draggingNode.level;
          if (siblings[i].level != draggingNode.level) {
            //當前节點的层級發生變化
            catLevel = siblings[i].level;
            //修改他子节點的层級
            this.updateChildNodeLevel(siblings[i]);
          }
          this.updateNodes.push({
            catId: siblings[i].data.catId,
            sort: i,
            parentCid: pCid,
            catLevel: catLevel
          });
        } else {
          this.updateNodes.push({ catId: siblings[i].data.catId, sort: i });
        }
      }

      //3、當前托拽节點的最新层級
      console.log("updateNodes", this.updateNodes);
    },
    updateChildNodeLevel(node) {
      if (node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          var cNode = node.childNodes[i].data;
          this.updateNodes.push({
            catId: cNode.catId,
            catLevel: node.childNodes[i].level
          });
          this.updateChildNodeLevel(node.childNodes[i]);
        }
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      //1、被拖動的當前节點以及所在的父节點總层數不能大於3

      //1）、被拖動的當前节點總层數
      console.log(
        "allowDrop:",
        draggingNode.data.name,
        dropNode.data.name,
        type
      );
      //
      this.countNodeLevel(draggingNode);
      console.log(this.maxLevel);
      //當前正在拖動的节點+父节點所在的深度不大於3即可
      let deep =
        this.maxLevel == 0
          ? 1
          : Math.abs(this.maxLevel - draggingNode.level) + 1;
      console.log("深度：", deep);

      //   this.maxLevel
      if (type == "inner") {
        // console.log(
        //   `this.maxLevel：${this.maxLevel}；draggingNode.data.catLevel：${draggingNode.data.catLevel}；dropNode.level：${dropNode.level}`
        // );
        return deep + dropNode.level <= 3;
      } else {
        return deep + dropNode.parent.level <= 3;
      }
    },
    countNodeLevel(node) {
      //找到所有子节點，求出最大深度
      if (node.childNodes != null && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (node.childNodes[i].level > this.maxLevel) {
            this.maxLevel = node.childNodes[i].level;
          }
          this.countNodeLevel(node.childNodes[i]);
        }
      }
    },
    submitData() {
      if (this.dialogType == "edit") {
        this.editCategory();
      } else {
        this.addCategory();
      }
    },
    edit(data) {
      this.dialogVisible = true;
      this.dialogType = "edit";
      this.title = "编辑分類";

      //為了严谨从資料庫取得值(有可能是 10 分钟前的頁面,其他人已经更改了)
      this.$http({
        url: this.$http.adornUrl(`/product/category/info/${data.catId}`),
        method: "get"
      }).then(({ data }) => {
        //處理 data 資料
        this.category.name = data.data.name;
        this.category.catId = data.data.catId;
        this.category.icon = data.data.icon;
        this.category.productUnit = data.data.productUnit;
        this.category.parentCid = data.data.parentCid;
        this.category.catLevel = data.data.catLevel;
        this.category.sort = data.data.sort;
        this.category.showStatus = data.data.showStatus;
      });
    },
    editCategory() {
      var { catId, name, icon, productUnit } = this.category;
      this.$http({
        url: this.$http.adornUrl("/product/category/update"),
        method: "post",
        data: this.$http.adornData({ catId, name, icon, productUnit }, false)
      }).then(({ data }) => {
        this.$message({
          message: "選單修改成功",
          type: "success"
        });
        //關閉對話框
        this.dialogVisible = false;
        //刷新出新的選單
        this.getMenus();
        //設定需要默認展開的選單
        this.expandedKey = [this.category.parentCid];
      });
    },
    append(data) {
      this.dialogVisible = true;
      this.dialogType = "add";
      this.title = "新增分類";

      //賦值
      this.category.parentCid = data.catId;
      this.category.catLevel = data.catLevel * 1 + 1;
      this.category.catId = null;
      this.category.name = "";
      this.category.icon = "";
      this.category.productUnit = "";
      this.category.sort = 0;
      this.category.showStatus = 1;
    },
    addCategory() {
      let param = this.category;
      this.$http({
        url: this.$http.adornUrl("/product/category/save"),
        method: "post",
        data: this.$http.adornData(param, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "新增成功",
            type: "success"
          });
          //定義成功事件
          this.dialogVisible = false;
          this.getMenus();
          this.expandedKey = [this.category.parentCid];
        } else {
          //顯示失败資料
          this.$message.error(data.msg);
        }
      });
    },
    remove(node, data) {
      this.$confirm(`確定删除[${data.name}]選單嗎?`, "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = [data.catId];
          this.$http({
            url: this.$http.adornUrl("/product/category/delete"),
            method: "post",
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getMenus();
              this.expandedKey = [node.parent.data.catId];
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  //生命週期 - 創建完成（可以訪問當前this實例）
  created() {
    this.getMenus();
  },
  //生命週期 - 掛載完成（可以訪問DOM元素）
  mounted() {},
  beforeCreate() {}, //生命週期 - 創建之前
  beforeMount() {}, //生命週期 - 掛載之前
  beforeUpdate() {}, //生命週期 - 更新之前
  updated() {}, //生命週期 - 更新之後
  beforeDestroy() {}, //生命週期 - 銷毁之前
  destroyed() {}, //生命週期 - 銷毁完成
  activated() {} //如果頁面有keep-alive緩存功能，這個函數會觸發
};
</script>
<style scoped>
</style>
