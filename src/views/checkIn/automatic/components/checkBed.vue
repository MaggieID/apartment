<template>
  <div>
    <el-dialog title="添加入住床位" append-to-body :visible.sync="value" width="1200px" :before-close="close">
      <div class="btmg">
        <el-form>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="已选房间：">{{ allRooms.length }} </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="混合房间数："> {{ mixRooms.length }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="男生房间数：">{{ boyRooms.length }} </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="女生房间数："> {{ girlRooms.length }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="已选床位：">{{ selectData.length }} </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="混合床位数：">{{ mixBeds.length }} </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="男生床位数：">{{ boyBeds.length }} </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="女生床位数：">{{ girlBeds.length }} </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="已选楼栋范围：">
                <el-tag v-for="(item ,index) in ld" :key="index" style="margin-right:5px;margin-bottom: 5px;">{{ item }}</el-tag>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="display: flex;height: 500px;">
        <el-card shadow="never" style="width: 325px;margin-right: 10px;">
          <el-scrollbar style="height:100%">
            <el-tree ref="build" :props="props" check-strictly show-checkbox class="tree" highlight-current :data="buildTree" />
          </el-scrollbar>
        </el-card>
        <el-card shadow="never" style="flex: 1;">
          <el-form inline>
            <el-form-item>
              <el-select v-model="formInline.Sex" clearable placeholder="请选择床位性别">
                <el-option v-for="item in sexList" :key="item.Id" :label="item.CName" :value="item.Code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.liveState" clearable placeholder="请选择床位状态">
                <el-option label="未入住" value="0"></el-option>
                <el-option label="已入住" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formInline.CName" clearable placeholder="请输入搜索关键字" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="queryList">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="singleTable" :data="tableList" height="340px" stripe @select-all="selectAll" @select="selectbedChange">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column prop="RoomName" align="center" label="房间号" />
            <el-table-column prop="BedName" align="center" label="床位号" />
            <el-table-column prop="BedSex_CN" align="center" label="床位性别" />
            <el-table-column prop="LivePurpose_CN" align="center" label="床位用途" />
            <el-table-column prop="LiveState" align="center" label="床位状态" />
            <el-table-column prop="ConstructFullPath" min-width="220" align="center" label="楼栋途径" />
          </el-table>
          <pagination :total="addQuery.PageTotal" :page.sync="addQuery.PageIndex" :limit.sync="addQuery.PageSize" @pagination="getPagination" />
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetBeds } from '@/api/Construct'
import pagination from '@/components/Pagination'
export default {
  components: { pagination },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      props: {
        label: 'Name',
        children: 'Childs'
      },
      tableList: [],
      addQuery: {
        PageTotal: 0,
        PageIndex: 1,
        PageSize: 10
      },
      formInline: {},
      selectData: [],
      boyBeds: [],
      girlBeds: [],
      mixBeds: [],
      boyRooms: [],
      girlRooms: [],
      mixRooms: [],
      allRooms: [],
      ld: []
    }
  },
  computed: {
    buildTree() {
      return this.$store.getters.buildTree
    },
    sexList() {
      return this.$store.getters.sexList
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.$nextTick(() => {
          this.formInline = {}
          this.selectData = []
          this.getDetail()
          this.queryList()
        })
      }
    }
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    submitAdd() {
      this.$emit('change', {
        selectData: this.selectData,
        boyBeds: this.boyBeds,
        girlBeds: this.girlBeds,
        mixBeds: this.mixBeds,
        boyRooms: this.boyRooms,
        girlRooms: this.girlRooms,
        mixRooms: this.mixRooms,
        allRooms: this.allRooms,
        ld: this.ld
      })
      this.close()
    },
    getDetail() {
      var rooms = []
      var ld = []
      this.boyBeds = []
      this.girlBeds = []
      this.mixBeds = []
      this.boyRooms = []
      this.girlRooms = []
      this.mixRooms = []
      this.allRooms = []
      this.ld = []
      this.selectData.forEach(element => {
        if (element.LDNumber != null && ld.indexOf(element.LDNumber) == -1) {
          ld.push(element.LDNumber)
          this.ld.push(element.LDName)
        }
        if (
          element.RoomNumber != null &&
          rooms.indexOf(element.RoomNumber) == -1
        ) {
          rooms.push(element.RoomNumber)
          this.allRooms.push(element)
          if (element.RoomSex == 1) {
            this.boyRooms.push(element)
          } else if (element.RoomSex == 2) {
            this.girlRooms.push(element)
          } else {
            this.mixRooms.push(element)
          }
        }
        if (element.BedSex == 1) {
          this.boyBeds.push(element)
        } else if (element.BedSex == 2) {
          this.girlBeds.push(element)
        } else {
          this.mixBeds.push(element)
        }
      })
    },
    selectAll(arr) {
      if (arr.length > 0) {
        this.selectData = this.selectData.concat(arr)
      } else {
        for (let i = 0; i < this.selectData.length; i++) {
          for (let j = 0; j < this.tableList.length; j++) {
            if (this.selectData[i].Id === this.tableList[j].Id) {
              this.selectData.splice(i, 1)
            }
          }
        }
      }
      this.getDetail()
    },
    selectbedChange(arr, row) {
      if (this.selectData.length > 0) {
        const arr = this.selectData.filter(item => {
          return item.Id === row.Id
        })
        if (arr.length > 0) {
          for (let i = 0; i < this.selectData.length; i++) {
            if (this.selectData[i].Id === row.Id) {
              this.selectData.splice(i, 1)
            }
          }
        } else {
          this.selectData.push(row)
        }
      } else {
        this.selectData.push(row)
      }
      this.getDetail()
    },
    queryList() {
      this.addQuery.PageIndex = 1
      this.GetBeds()
    },
    getPagination(val) {
      this.addQuery.PageSize = val.limit
      this.addQuery.PageIndex = val.page
      this.GetBeds()
    },
    GetBeds() {
      var that = this
      var getCheckedNodes = this.$refs.build.getCheckedNodes()
      var CNumber = getCheckedNodes.map(item => {
        return item.YL
      })
      GetBeds({
        CName: this.formInline.CName,
        CNumber: CNumber,
        Sex: this.formInline.Sex,
        isLock: 0,
        liveState: this.formInline.liveState,
        Page: {
          Size: this.addQuery.PageSize,
          Index: this.addQuery.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        that.tableList = res.Data
        that.addQuery.pageTotal = res.Totals
        that.selectData.forEach(item => {
          that.tableList.forEach(listitem => {
            if (item.Id === listitem.Id) {
              that.$refs.singleTable.toggleRowSelection(listitem, true)
            }
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btmg {
  background: #ecf5ff;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 15px;
  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }
}
</style>