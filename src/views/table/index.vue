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
          <el-input v-model="scope.row.des" placeholder="请输入内容" v-if="scope.row.idEdit"></el-input>
          <span v-else>{{scope.row.des}}</span>
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
            <el-button size="mini" @click="handleEditCancel(scope.$index, scope.row)">取消</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">完成</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 广告添加 -->
    <el-dialog title="渠道位添加" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="渠道位描述" :label-width="formLabelWidth">
          <el-input v-model="form.des" auto-complete="off"></el-input>
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
        oldTableData: [], //老表格
        dialogFormVisible: false, //渠道添加弹窗
        form: {
          des: "",
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
        let data = {
          qid : row.qid,
          projectId : row.projectId,
          des: row.des
        }
        this.loading = true
        request(`${API_URL.qid}/${id}`, "put", data).then(() => {
          row.idEdit = false;
          this.tableData[index] = row
          this.oldTableData = this.deepCopy(this.tableData)
          this.loading = false
          this.$message({
            type: 'success',
            message: '修改qid成功!'
          });
        }).catch(() => {
          this.loading = false
          this.tableData = this.deepCopy(this.oldTableData)
        });
      },
      handleDelete(index, row, tableData) {
        this.$confirm('此操作将永久删除该渠道qid, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = row.id
          this.loading = true
          request(`${API_URL.qid}/${id}`, "delete", {}).then(res => {
            this.loading = false
            tableData.splice(index, 1);
            row.idEdit = false;
            this.oldTableData = this.deepCopy(this.tableData)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.loading = false
            this.$message.error("删除失败,请重试");
          });
        }).catch((err) => {
          console.log(err)
        });
      },
      handleEditCancel(index, row) {
        row.idEdit = !row.idEdit;
        this.tableData = this.deepCopy(this.oldTableData)
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
          projectId: this.activeParameter.projectId,
          des: this.form.des,
        };
        this.loading = true
        request(API_URL.qid, 'post', params).then(res => {
          res.idEdit = false
          this.tableData.push(res)
          this.oldTableData = this.deepCopy(this.tableData)
          this.dialogFormVisible = false
          this.loading = false
          this.form.qid = ''
          this.$message({
            type: 'success',
            message: '添加渠道成功!'
          });
        }).catch(() => {
          this.loading = false
          this.form.qid = ''
        })
      },
      async getQidList() {
        try {
          this.loading = true
          let dataList = await request(API_URL.qid_list, "get", {
            projectId: this.activeParameter.projectId
          });
          this.$message({
            type: 'success',
            message: '查询qid列表成功!'
          });
          if (dataList && dataList.length > 0) {
            this.tableData = dataList.map(item => {
              item.idEdit = false  //对应的行是否正在编辑
              return item
            })
            this.oldTableData = this.deepCopy(this.tableData)
          } else {
            this.tableData = []
          }
          this.loading = false
        } catch (err) {
          this.loading = false
          this.$message.error("查询失败,请重试");
          this.tableData = [];
        }
      },
      deepCopy(target){
        let copyed_objs = [];//此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象
        function _deepCopy(target){
          if((typeof target !== 'object')||!target){return target;}
          for(let i= 0 ;i<copyed_objs.length;i++){
            if(copyed_objs[i].target === target){
              return copyed_objs[i].copyTarget;
            }
          }
          let obj = {};
          if(Array.isArray(target)){
            obj = [];//处理target是数组的情况
          }
          copyed_objs.push({target:target,copyTarget:obj})
          Object.keys(target).forEach(key=>{
            if(obj[key]){ return;}
            obj[key] = _deepCopy(target[key]);
          });
          return obj;
        }
        return _deepCopy(target);
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
