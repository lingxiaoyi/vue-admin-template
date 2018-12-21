<template>
  <div class="east_main_home">
    <!-- 搜索 -->
    <div class="east_h5_ht">
      <el-select v-model="searVal" filterable placeholder="请选择渠道号" name="search" :default-first-option="true" >
        <el-option v-for="item in qidList" :key="item.id" :label="item.qid" :value="item.qid">
        </el-option>
      </el-select>
      <el-button @click.stop="searchData" type="success" icon="el-icon-search">搜索</el-button>
      <el-button type="success" @click.stop="dialogFormVisible=true">广告位添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
      <el-table-column prop="des" label="广告位描述" width="">
        <template slot-scope="scope">
          <el-input v-model="scope.row.des" placeholder="请输入内容" v-if="scope.row.idEdit"></el-input>
          <span v-else>{{scope.row.des}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ggType" label="来源" width="">
        <template slot-scope="scope">
          <!-- scope.$index, scope.row -->
          <el-select v-model="scope.row.qidId" placeholder="请选择" v-if="scope.row.idEdit">
            <el-option v-for="item in source" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <span v-else>{{dataFilter(scope.row.qidId,true)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ggId" label="广告id" width="">
        <!-- scope.$index, scope.row -->
        <template slot-scope="scope">
          <el-input v-model="scope.row.ggId" placeholder="请输入内容" v-if="scope.row.idEdit"></el-input>
          <span v-else>{{scope.row.ggId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="是否空">
        <template slot-scope="scope">
          <!-- scope.$index, scope.row -->
          <el-select v-model="scope.row.hidden" placeholder="请选择" v-if="scope.row.idEdit">
            <el-option v-for="item in isEmpty" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <span v-else>{{dataFilter(scope.row.hidden,false)}}</span>
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
    <el-dialog title="广告位添加" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="广告位名称" :label-width="formLabelWidth">
          <el-input v-model="form.des" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="广告位代码(唯一的)" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off"></el-input>
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
      searVal: "null", //搜索框val 默认null
      source: [
        //广告来源
        {
          value: 0,
          label: "ssp"
        },
        {
          value: 1,
          label: "afp"
        },
        {
          value: 2,
          label: "afp防屏蔽"
        },
        {
          value: 3,
          label: "ssp异步"
        },
        {
          value: 4,
          label: "sspu"
        },
        {
          value: 5,
          label: "360"
        }
      ],
      isEmpty: [
        //是否为空
        {
          value: 0,
          label: "空"
        },
        {
          value: 1,
          label: "非空"
        }
      ],
      tableData: [], // 表格渲染
      oldTableData: [], //老表格
      dialogFormVisible: false, //广告添加弹窗
      form: {
        des: "",
        isEnable: "0",
        id: ""
      },
      formLabelWidth: "180px", //弹窗的宽度
      loading: true
    };
  },
  watch: {
    '$route' (to, from) {
      this.getQidList();
      this.searchData();
    },
    searVal:function(value){
      this.searchData();
    }
  },
  computed: {
    ...mapState(["activeParameter"])
  },
  created() {
    this.getQidList();
    this.searchData();
  },
  mounted() {
    /*this.$nextTick(_ => {
      let dom = document.querySelector("input[name=search]");
      dom.addEventListener("input", this.searDataChange(dom));
    });*/
  },
  methods: {
    dataFilter(info, type) {
      let text = null;
      if (type) {
        switch (info) {
          case 0:
            text = "ssp";
            break;
          case 1:
            text = "afp";
            break;
          case 2:
            text = "afp防屏蔽";
            break;
          case 3:
            text = "ssp异步";
            break;
          case 4:
            text = "sspu";
            break;
          case 5:
            text = "360";
            break;
          default:
            text = "未知";
            break;
        }
      } else {
        if (info == 0) {
          text = "空";
        } else {
          text = "非空";
        }
      }
      return text;
    },
    handleEdit(index, row) {
      let id = row.id
      let data = {
        ggId : row.ggId,
        des : row.des,
      }
      request(`${API_URL.ad}/${id}`, "put", data).then(() => {
        row.idEdit = false;
        this.tableData[index] = row
        this.oldTableData = this.deepCopy(this.tableData)
        this.loading = false
        this.$message({
          type: 'success',
          message: '修改qid成功!'
        });
      })
      .catch(() => {
        this.loading = false
        this.tableData = this.deepCopy(this.oldTableData)
      });
    },
    handleDelete(index, row, tableData) {
      this.$confirm('此操作将永久删除该广告id, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = row.id
        this.loading = true
        request(`${API_URL.ad}/${id}`, "delete", {}).then(() => {
          this.loading = false
          tableData.splice(index, 1);
          row.idEdit = false;
          this.oldTableData = this.deepCopy(this.tableData)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(err => {
          this.loading = false
          this.$message.error("删除失败,请重试");
        });
      }).catch((err) => {
        console.log(err)
      });
    },
    handleEditCancel(index, row) {
      row.idEdit = false;
      this.tableData = this.deepCopy(this.oldTableData)
    },
    addAdvertisement() {
      if (!this.form.id) {
        this.$message({
          message: "请输入广告位代码",
          type: "warning"
        });
        return;
      }
      let params = {
        qidId: this.activeParameter.qidId,
        projectId: this.activeParameter.projectId,
        pageId: this.activeParameter.id,
        ggId: this.form.id,
        des: this.form.des,
      };
      this.loading = true
      request(API_URL.ad, 'post', params).then(res => {
        res.idEdit = false
        this.tableData.push(res)
        this.oldTableData = this.deepCopy(this.tableData)
        this.dialogFormVisible = false
        this.form.id = ''
        this.loading = false
        this.$message({
          type: 'success',
          message: '添加ad成功!'
        });
      }).catch(() => {
        this.loading = false
        this.form.id = ''
      })
    },
    async searchData() {
      if (this.searVal === '') {
        this.$message.error("qid不能为空");
        return;
      }
      try {
        this.loading = true
        let data = {
          projectId: this.activeParameter.projectId,
          qid: this.searVal
        }
        let qid = await request(API_URL.qid, 'get', data)
        if(!qid.length){
          this.$message.error("查询失败,无此qid存在");
          this.loading = false
          return;
        } else {
          this.activeParameter.qidId = qid[0].id
        }
        let params = {
          projectId: this.activeParameter.projectId,
          qidId: this.activeParameter.qidId,
          pageId: this.activeParameter.id
        }
        let dataList = await request(API_URL.ad, 'get', params)
        this.$message({
          type: 'success',
          message: '查询ad列表成功!'
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
          this.qidList = dataList
        } else {
          this.qidList = []
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        this.$message.error("查询qid失败,请重试");
        this.qidList = [];
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
