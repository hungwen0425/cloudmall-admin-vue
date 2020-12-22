<template>
  <el-dialog title="日誌列表" :close-on-click-modal="false" :visible.sync="visible" width="75%">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="任務ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查詢</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" height="460" style="width: 100%;">
      <el-table-column prop="logId" header-align="center" align="center" width="80" label="日誌ID"></el-table-column>
      <el-table-column prop="jobId" header-align="center" align="center" width="80" label="任務ID"></el-table-column>
      <el-table-column prop="beanName" header-align="center" align="center" label="bean名稱"></el-table-column>
      <el-table-column prop="params" header-align="center" align="center" label="参數"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="狀態">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">成功</el-tag>
          <el-tag
            v-else
            @click.native="showErrorInfo(scope.row.logId)"
            size="small"
            type="danger"
            style="cursor: pointer;"
          >失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="times" header-align="center" align="center" label="耗時(單位: 毫秒)"></el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="執行時間"
      ></el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: "",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
    };
  },
  methods: {
    init() {
      this.visible = true;
      this.getDataList();
    },
    // 取得資料列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/scheduleLog/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          jobId: this.dataForm.id,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每頁數
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 當前頁
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 失败資料
    showErrorInfo(id) {
      this.$http({
        url: this.$http.adornUrl(`/sys/scheduleLog/info/${id}`),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$alert(data.log.error);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>
