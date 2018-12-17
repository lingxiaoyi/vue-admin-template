<template>
  <div class="east_main_home">
    <!-- 搜索 -->
    <div class="east_h5_ht">
      <el-button type="success" @click.stop="dialogFormVisible=true">渠道位添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
      <el-table-column prop="ggType" label="渠道位描述" width="">
        <template slot-scope="scope">
          <el-input v-model="scope.row.ggType" placeholder="请输入内容" v-if="scope.row.idEdit"></el-input>
          <span v-else>{{scope.row.ggType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qid" label="渠道id" width="">
        <!-- scope.$index, scope.row -->
        <template slot-scope="scope">
          <el-input v-model="scope.row.qid" placeholder="请输入内容" v-if="scope.row.idEdit"></el-input>
          <span v-else>{{scope.row.qid}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div v-if="!scope.row.idEdit">
            <el-button size="mini" @click="scope.row.idEdit = !scope.row.idEdit">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row, tableData)">删除</el-button>
          </div>
          <div v-else>
            <el-button size="mini" @click="scope.row.idEdit = !scope.row.idEdit">取消</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">完成</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 广告添加 -->
    <el-dialog title="渠道位添加" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="渠道位名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="渠道位代码(唯一的)" :label-width="formLabelWidth">
          <el-input v-model="form.qid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-select v-model="form.isEnable">
            <el-option label="启用" value="0"></el-option>
            <el-option label="不启用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdvertisement">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from "@/utils/request";
  import { API_URL } from "../../utils/common.config.js";
  import { mapState } from "vuex";

  export default {
    name: "QidTable",
    data() {
      return {
        qidList: [], //渠道号列表
        tableData: [], // 表格渲染
        dialogFormVisible: false, //渠道添加弹窗
        form: {
          name: "",
          isEnable: "0",
          qid: ""
        },
        formLabelWidth: "180px", //弹窗的宽度
        loading: true
      };
    },
    watch: {
      $route: {
        handler: function(route) {},
        immediate: true
      }
    },
    computed: {
      ...mapState(["activeParameter"])
    },
    created() {
      this.getQidList();
    },
    mounted() {},
    methods: {
      handleEdit(index, row) {
        let id = row.id
        let oldRow = row
        let data = {
          qid : row.qid
        }
        request(`${API_URL.qid}/${id}`, "put", data).then(res => {
          row.idEdit = false;
          this.tableData[index] = row
        })
        .catch(err => {
          this.$message.error("修改信息失败");
          this.tableData[index] = oldRow
        });
      },
      handleDelete(index, row, tableData) {
        this.$confirm('此操作将永久删除该渠道qid, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = row.id
          let data = {
            qid : row.qid
          }
          this.loading = true
          request(`${API_URL.ad}/${id}`, "delete", data).then(res => {
            this.loading = false
            tableData.splice(index, 1);
            row.idEdit = false;
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(err => {
            this.loading = false
            this.$message.error("删除失败,请重试");
          });
        })
      },
      addAdvertisement() {
        if (!this.form.qid) {
          this.$message({
            message: "请输入渠道qid",
            type: "warning"
          });
          return;
        }
        let params = {
          qid: this.form.qid,
          projectId: this.activeParameter.projectId
        };
        request(API_URL.qid, 'post', params).then(res => {
          this.tableData.push(res)
          this.dialogFormVisible = false
          this.form.qid = ''
        }).catch(err => {
          this.form.qid = ''
          this.$message.error('添加失败 请重新添加')
        })
      },
      async getQidList() {
        try {
          this.loading = true
          let dataList = await request(API_URL.qid_list, "get", {
            projectId: this.activeParameter.projectId
          });
          if (dataList && dataList.length > 0) {
            this.tableData = dataList.map(item => {
              item.idEdit = false  //对应的行是否正在编辑
              return item
            })
          } else {
            this.tableData = []
          }
          this.loading = false
        } catch (err) {
          this.loading = false
          this.$message.error("查询失败,请重试");
          this.tableData = [];
          console.log(err)
        }
      },
      handleSelect(item) {
        console.log(item);
      }
    }
  };
</script>

<style>
  .east_main_home tbody .el-table_1_column_3 .el-input__inner {
    width: 70% !important;
  }
</style>

<style lang='scss' scoped>
  .clear:after {
    content: "";
    display: block;
    clear: both;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
  .clear {
    zoom: 1;
  }
  .east_main_home {
    padding: 20px;
  }
  .east_main_home .east_h5_ht {
    .el-button + .el-button {
      margin-left: 0px;
    }
  }
  .east_h5_ht{
    margin-bottom:20px;
  }
  .east_h5_seatip {
    margin: 20px 0 20px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;

    li {
      float: left;
      width: 25%;
      list-style: none;
      color: #67c23a;
      font-size: 12px;
    }
  }

  .sub_btn {
    display: inline-block;
    margin-top: 10px;
  }
</style>
