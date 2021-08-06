<template>
  <div class="g-container">
    <el-container style="height: 100%;">
      <el-aside width="300px">
        <div class="configuration" style="padding-right: 24px;color:#606266">
          组织结构
        </div>
        <div class="treeBox">
          <el-scrollbar style="height:100%">
            <el-radio-group v-model="constructTag" @change="selectNode">
              <el-radio v-for="(item,Index) in treeData" :key="Index" :label="item.Id" border>{{ item.Name }}</el-radio>
            </el-radio-group>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-main>
        <el-scrollbar style="height:100%">
          <div class="mb15" style="padding-bottom: 0;">
            <el-form inline>
              <el-form-item label="" label-width="80px">
                <el-input v-model="listQuery.keyword" clearable placeholder="请输入名称/编号" />
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" icon="el-icon-search" @click="queryList">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <div class="mb15">
              <el-button icon="el-icon-plus" type="primary" :disabled="constructTag==-1" @click="addConstruct">新增</el-button>
              <el-button icon="el-icon-edit-outline" type="success" :disabled="currentSelect.length!=1" @click="modify">修改</el-button>
              <el-button icon="el-icon-delete" type="danger" :disabled="currentSelect.length==0" @click="bulkDelete">删除</el-button>
              <DisplayFields title="更多表格字段" show-sort :api-name="apiName" left-icon="el-icon-s-operation" @GetUserDisplay="getMoreInfo" />
              <div style="float: right;">
                <importDialog :disabled="constructTag==-1" :download-api="downloadApi[constructTag]" :import-api="importApi[constructTag]" :download-name="ConstructName+'导入模板'" @getData="queryList" />
                <el-button icon="el-icon-download" type="warning" :loading="isDownLoading" :disabled="constructTag==-1" @click="exportConstruct">批量导出</el-button>
              </div>
            </div>
            <div class="warperTable">
              <el-table v-loading="tableLoading" stripe row-key="DepId" :data="listData" style="width: 100%" @selection-change="selectChange">
                <el-table-column align="center" type="selection" width="55" fixed="left" />
                <template v-for="(item,Index) in tableColumn">
                  <el-table-column :key="Index" :width="item.ColumnName=='FullPath'?'180':'150'" :prop="item.ColumnName" :label="item.ColumnCnName" align="center">
                    <template slot-scope="{row}">
                      <div v-if="item.ColumnName=='Photo'">
                        <el-image v-if="row.Photo" style="width: 50px; height: 50px" :src="row.photos[0]" :preview-src-list="row.photos" />
                      </div>
                      <div v-else-if="item.ColumnName=='LabelName'">
                        <el-tag v-for="tag in row.Labels" :key="tag.LabelId" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                      </div>
                      <span v-else>{{ row[item.ColumnName] }}{{ row.Pairs[item.ColumnName]|tojson }}</span>
                    </template>
                  </el-table-column>
                </template>
                <el-table-column v-if="currentItem.StructureEnum!=9" min-width="130px" label="操作" align="center" fixed="right">
                  <template slot-scope="{row}">
                    <el-button size="small" @click="GenerateQRCode(row)">生成门牌</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <pagination :total="pageTotal" :page.sync="listQuery.PageIndex" :limit.sync="listQuery.PageSize" @pagination="handleSizeChange" />
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
    <!-- 编辑 -->
    <editConstruct v-model="editVisible" :form="form" :types="types" :add-sign="addSign" :current-item="currentItem" @getList="getList" />
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import editConstruct from './components/editConstruct'
import DisplayFields from '@/components/DisplayFields'
import importDialog from '@/components/Upload/importDialog'
import {
  DeleteConstruct,
  GetConstructObject,
  GetStructureByType,
  GenerateQRCode
} from '@/api/Construct'
export default {
  Name: 'ApartmentStructure',
  components: {
    pagination,
    editConstruct,
    DisplayFields,
    importDialog
  },
  filters: {
    tojson(val) {
      if (!val) return
      var show = JSON.parse(val)
      if (typeof JSON.parse(val) == 'object') {
        show = show.join(',')
      }
      return show
    }
  },
  data() {
    return {
      apiPath: window.apiPath,
      downloadApi: [],
      importApi: [],
      showBad: false,
      isDownLoading: false,
      listQuery: {
        PageIndex: 1,
        PageSize: 10,
        keyword: ''
      },
      apiName: 'ldzzpz_School',
      pageTotal: 0,
      tableLoading: false,
      currentSelect: [],
      editVisible: false,
      currentItem: {},
      ConstructName: '',
      constructTag: -1,
      treeData: [],
      form: {},
      roomTypes: [],
      tagSchemes: [],
      listData: [],
      tableColumn: [],
      roomId: 0,
      addSign: false,
      types: [
        'School',
        'BranchSchool',
        'Campus',
        'Park',
        'Building',
        'Unit',
        'Floor',
        'Suite',
        'Room',
        'Bed'
      ]
    }
  },
  mounted() {
    this.GetStructureByType()
  },
  methods: {
    GenerateQRCode(row) {
      var that = this
      GenerateQRCode({
        constructNumber: row.Number
      }).then(res => {
        if (res.BS == 1) {
          that.$message({
            message: '生成成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    handleToUser(row) {
      this.showBad = true
      this.roomId = row.Id
    },
    // 上下文
    GetStructureByType() {
      var that = this
      GetStructureByType({
        StructureType: 1,
        IsEnable: 2
      }).then(res => {
        that.treeData = res.Data
      })
    },
    bulkDelete() {
      this.$confirm(
        '此操作将永久删除该文件及其下级文件，是否继续？',
        '删除提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          var ids = []
          this.currentSelect.forEach(element => {
            ids.push(element.Id)
          })
          var that = this
          DeleteConstruct({
            ConstructId: ids
          }).then(res => {
            if (res.BS == 1) {
              that.$message({
                message: '删除成功',
                type: 'success'
              })
              that.currentSelect = []
              that.queryList()
            } else {
              this.$message.error(res.Message)
            }
          })
        })
        .catch(() => {})
    },
    // 表格选择改变
    selectChange(s) {
      this.currentSelect = s
    },
    // 组织增加
    addConstruct() {
      this.editVisible = true
      this.addSign = true
      this.form = {
        ConstructId: 0,
        StructureId: this.constructTag,
        ConstructName: '',
        ConstructSort: 0,
        ConstructDescroption: '',
        ParentId: null,
        Price: 0,
        Count: 0,
        Sex: '',
        LabelIds: [],
        PhotoIds: [],
        Photo: '',
        bedLiveType: 0,
        ProExts: {
          TemplateId: '',
          PropertyValue: {}
        }
      }
    },
    // 批量修改组织结构
    modify() {
      var row = this.currentSelect[0]
      this.form = {
        ConstructId: row.Id,
        StructureId: this.constructTag,
        ConstructName: row.Name,
        ConstructDescroption: row.Descroption,
        ParentId: row.ParentId,
        Price: row.Price,
        Count: row.RoomCapacity,
        Sex: row.Sex,
        LabelIds:
          row.Labels == null
            ? []
            : row.Labels.map(item => {
                return item.LabelId
              }),
        photos: row.photos,
        Pairs: row.Pairs,
        Photo: row.Photo
      }
      this.editVisible = true
      this.addSign = false
    },
    exportConstruct() {},
    export(res, flog) {
      if (res) {
        const blob = new Blob([res]) // 处理文档流
        const elink = document.createElement('a')
        const fileName =
          flog === 1
            ? this.ConstructName + '信息表.xls'
            : this.ConstructName + '导入模板.xls'
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else {
        this.$message.error('下载错误')
      }
      this.isDownLoading = false
    },
    handleSizeChange(val) {
      this.listQuery.PageIndex = val.page
      this.listQuery.PageSize = val.limit
      this.getList()
    },
    queryList() {
      this.listQuery.PageIndex = 1
      this.getList()
    },
    getList() {
      GetConstructObject({
        StructureId: this.constructTag,
        ConstructName: this.listQuery.keyword,
        ConstructNumber: '', // this.listQuery.keyword,
        page: {
          Size: this.listQuery.PageSize,
          Index: this.listQuery.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        this.listData = res.Data
        this.pageTotal = res.Totals
      })
    },
    getMoreInfo(data) {
      this.tableColumn = []
      this.tableColumn = data
    },
    // 选取分层节点
    selectNode(item) {
      console.log(item)
      this.constructTag = item
      var data = {}
      for (let i = 0; i < this.treeData.length; i++) {
        if (item === this.treeData[i].Id) {
          data = this.treeData[i]
          break
        }
      }
      this.currentItem = data
      this.ConstructName = data.Name
      this.apiName = 'ldzzpz_' + this.types[data.StructureEnum]
      this.listQuery = {
        PageIndex: 1,
        PageSize: 10,
        keyword: ''
      }
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.treeBox {
  height: calc(100% - 50px);
}

.el-aside {
  background-color: white;
  padding: 20px;
  line-height: unset;
  margin: 0;
  margin-right: 10px;
}

.el-main {
  background-color: white;
}

.el-radio.is-bordered.is-checked {
  background: #e9f0ff;
}
</style>
<style lang="scss" >
.treeBox {
  .el-radio {
    width: 250px;
    text-align: center;
    margin: 10px 0;
    margin-left: 0 !important;
  }
  .el-radio__input {
    display: none;
  }
  .upload-demo {
    display: inline-block;
  }
  .mytree {
    .el-tree-node {
      &:first-child {
        left: -4px;
      }
      &:before {
        left: 0;
      }
    }
  }
}
</style>
