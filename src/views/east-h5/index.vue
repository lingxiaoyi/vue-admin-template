<template>
  <div class="east_main_home">
    <!-- 搜索 -->
    <div class="east_h5_ht">
      <el-select v-model="searVal" filterable placeholder="请选择渠道号" name="search" :default-first-option="true">
        <el-option v-for="item in qidList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button @click.stop="searchData" type="success" icon="el-icon-search">搜索</el-button>
      <el-button type="success" @click.stop="dialogFormVisible=true">广告位管理</el-button>
    </div>
    <!-- 状态 -->
    <div class="east_h5_seatip">
      <ul class="clear">
        <li>状态：<span>{{ searchStatus }}</span></li>
        <li>名称：<span>首页</span></li>
        <li>页面：<span>首页</span></li>
        <li>描述：<span>描述</span></li>
      </ul>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="ggType" label="广告位描述" width="">
        <template slot-scope="scope">
          <el-input v-model="scope.row.ggType" placeholder="请输入内容" v-if="scope.row.isShow"></el-input>
          <span v-else>{{scope.row.ggType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ggType" label="来源" width="">
        <template slot-scope="scope">
          <!-- scope.$index, scope.row -->
          <el-select v-model="scope.row.qidId" placeholder="请选择" v-if="scope.row.isShow">
            <el-option v-for="item in source" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <span v-else>{{dataFilter(scope.row.qidId,true)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ggId" label="广告id" width="">
        <!-- scope.$index, scope.row -->
        <template slot-scope="scope">
          <el-input v-model="scope.row.ggId" placeholder="请输入内容" v-if="scope.row.isShow"></el-input>
          <span v-else>{{scope.row.ggId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="是否空">
        <template slot-scope="scope">
          <!-- scope.$index, scope.row -->
          <el-select v-model="scope.row.hidden" placeholder="请选择" v-if="scope.row.isShow">
            <el-option v-for="item in isEmpty" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <span v-else>{{dataFilter(scope.row.hidden,false)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div v-if="!scope.row.isShow">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row, true)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row, true)">删除</el-button>
          </div>
          <div v-else>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row, false)">取消</el-button>
            <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row, false)">完成</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 广告添加 -->
    <el-dialog title="广告位添加" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="广告位名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="广告位代码(唯一的)" :label-width="formLabelWidth">
          <el-input v-model="form.id" autocomplete="off"></el-input>
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
    <div class="sub_btn" @click="dataSubmit">
      <el-button type="primary">提交</el-button>
    </div>
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
      searchStatus: "查询成功",
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
      dialogFormVisible: false, //广告添加弹窗
      form: {
        name: "",
        isEnable: "0",
        id: ""
      },
      formLabelWidth: "180px", //弹窗的宽度
      saveEditData: [] //修改失败时 数据恢复
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        console.log(route)
      },
      immediate: true
    }
  },
  computed: {
    ...mapState(["parameter"])
  },
  created() {
    /*this.getQidList();
    this.searchData();*/
  },
  mounted() {
    this.$nextTick(_ => {
      let dom = document.querySelector("input[name=search]");
      dom.addEventListener("input", this.searDataChange(dom));
    });
  },
  methods: {
    dataFill(params, index) {
      this.tableData[index].ggId = params.ggId;
      this.tableData[index].ggType = params.ggType;
      this.tableData[index].hidden = params.hidden;
      this.tableData[index].id = params.id;
      this.tableData[index].isShow = false;
      this.tableData[index].pageId = params.pageId;
      this.tableData[index].projectId = params.projectId;
      this.tableData[index].qidId = params.qidId;
    },
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
    handleEdit(index, row, flag) {
      if (flag) {
        row.isShow = true;
        let JsonRow = JSON.stringify(row);
        this.saveEditData[index] = JSON.parse(JsonRow);
      } else {
        let params = this.saveEditData[index];
        this.dataFill(params, index);
      }
    },
    handleDelete(index, row, flag) {
      if (flag) {
        console.log("删除");
      } else {
        request(API_URL.update_ggid, "post", row)
          .then(res => {
            row.isShow = false;
          })
          .catch(err => {
            let params = this.saveEditData[index];
            this.dataFill(params, index);
            this.$message.error("修改信息失败");
          });
      }
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
        qidId: this.tableData[0].qidId,
        projectId: this.parameter.projectId,
        pageId: this.parameter.id,
        ggId: this.form.id
      };
      request(API_URL.add_ggid, "post", params)
        .then(res => {
          this.searchData();
          this.dialogFormVisible = false;
          this.form.id = '';
        })
        .catch(err => {
          this.$message.error("添加失败 请重新添加");
        });
    },
    async searchData() {
      if (this.searVal == "") {
        return;
      }
      let params = {
        projectId: this.parameter.projectId,
        qid: this.searVal,
        pageId: this.parameter.id
      };
      try {
        let dataList = await request(API_URL.get_ggid_list, "get", params);
        if (dataList.data && dataList.data.length > 0) {
          this.tableData = dataList.data.map(item => {
            item.isShow = false;
            return item;
          });
          this.searchStatus = "查询成功";
          this.saveEditData = [];
        }
      } catch (err) {
        this.searchStatus = "查询失败";
        this.tableData = [];
        return err;
      }
    },
    async getQidList() {
      let qidList = await request(API_URL.get_qid_list, "get", {
        projectId: this.parameter.projectId
      });
      if (qidList.data && qidList.data.length > 0) {
        qidList.data.forEach(item => {
          var qidObj = {
            value: item.qid,
            lable: item.qid
          };
          this.qidList.push(qidObj);
        });
      }
    },
    dataSubmit() {
      console.log("提交");
    },
    searDataChange(dom, time = 300) {
      let clear = null;
      return () => {
        if (clear) {
          clearTimeout(clear);
        }
        clear = setTimeout(_ => {
          this.searVal = dom.value;
        }, time);
      };
    },
    querySearchAsync(queryString, cb) {
      const restaurants = this.restaurants;
      console.log(queryString);
      const results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
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
