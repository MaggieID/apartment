<template>
  <div>
    <div class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-transition el-table--medium" style="overflow-x: auto;">
      <div class="el-table__body-wrapper is-scrolling-left">
        <table border="0" cellspacing="0" cellpadding="0" :width="getWidht()">
          <thead>
            <th class="is-leaf is-center" width="55">
              <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
            </th>
            <template v-for="(item,index) in tableColumn">
              <th :key="index" class="is-leaf is-center " :width="(item.ColumnName=='UserColleges'||item.ColumnName=='UserDeps'||item.ColumnName=='UserLabels')?'180':'120'">{{ item.ColumnCnName }}</th>
            </template>
            <th class="is-leaf is-center" width="120">床位号</th>
            <th class="is-leaf is-center" width="120">床位性别</th>
            <th class="is-leaf is-center" width="180">楼栋路径</th>
            <th class="is-leaf is-center" width="120">床位价格</th>
            <th class="is-leaf is-center" width="120">合同价格</th>
            <th class="is-leaf is-center" width="120">操作</th>
          </thead>
          <tbody>
            <template v-for="(row,i) in tableList">
              <template v-for="(data,j) in row.StudentLiveInfos">
                <tr v-if="row.StudentLiveInfos.length > 0" :key="row.Id+j">
                  <td v-if="j==0" class="is-center" :rowspan="row.StudentLiveInfos.length">
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                      <el-checkbox :label="row"></el-checkbox>
                    </el-checkbox-group>
                  </td>
                  <template v-for="(item,index) in tableColumn">
                    <td v-if="j==0" :key="'c'+index" :rowspan="row.StudentLiveInfos.length" class="is-center ">
                      <div class="cell">
                        <div v-if="item.ColumnName=='PhotoPath'">
                          <el-image v-if="row.PhotoPath" style="width: 50px; height: 50px" :src="row.PhotoPath" :preview-src-list="[row.PhotoPath]" />
                        </div>
                        <div v-else-if="item.ColumnName=='UserColleges'">
                          <el-tag v-for="tag in row.UserColleges" :key="tag.CollegeId" style="margin-right:5px">{{ tag.CollegeName }}</el-tag>
                        </div>
                        <div v-else-if="item.ColumnName=='UserDeps'">
                          <el-tag v-for="tag in row.UserDeps" :key="tag.DepartmentId" style="margin-right:5px">{{ tag.DepName }}</el-tag>
                        </div>
                        <div v-else-if="item.ColumnName=='UserLabels'">
                          <el-tag v-for="tag in row.UserLabels" :key="tag.LabelId" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                        </div>
                        <div v-else-if="item.ColumnName=='IsCheckIn'||item.ColumnName=='IsOutside'">
                          <el-tag v-if="row[item.ColumnName]==1" type="success">是</el-tag>
                          <el-tag v-if="row[item.ColumnName]==0" type="danger">否</el-tag>
                        </div>
                        <span v-else>{{ row[item.ColumnName] }}</span>
                      </div>
                    </td>
                  </template>
                  <td class="is-center ">{{ data.BedName }}</td>
                  <td class="is-center ">{{ data.BedSex_CN }}</td>
                  <td class="is-center ">
                    <div class="cell">{{ data.BedFullPath }}</div>
                  </td>
                  <td class="is-center ">{{ data.BedPrice }}</td>
                  <td class="is-center ">{{ data.ContractPrice }}</td>
                  <td v-if="j==0" class="is-center" :rowspan="row.StudentLiveInfos.length">
                    <div class="cell">
                      <el-button type="text" icon="el-icon-view" title="查看详情" class="btn-detail" @click="seeDetail(row)"></el-button>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="row.StudentLiveInfos.length==0" :key="'a'+i">
                <td class="is-center">
                  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox :label="row"></el-checkbox>
                  </el-checkbox-group>
                </td>
                <template v-for="(item,index) in tableColumn">
                  <td :key="index" class="is-center">
                    <div class="cell">
                      <div v-if="item.ColumnName=='PhotoPath'">
                        <el-image v-if="row.PhotoPath" style="width: 50px; height: 50px" :src="row.PhotoPath" :preview-src-list="[row.PhotoPath]" />
                      </div>
                      <div v-else-if="item.ColumnName=='UserColleges'">
                        <el-tag v-for="tag in row.UserColleges" :key="tag.CollegeId" style="margin-right:5px">{{ tag.CollegeName }}</el-tag>
                      </div>
                      <div v-else-if="item.ColumnName=='UserDeps'">
                        <el-tag v-for="tag in row.UserDeps" :key="tag.DepartmentId" style="margin-right:5px">{{ tag.DepName }}</el-tag>
                      </div>
                      <div v-else-if="item.ColumnName=='UserLabels'">
                        <el-tag v-for="tag in row.UserLabels" :key="tag.LabelId" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                      </div>
                      <div v-else-if="item.ColumnName=='IsCheckIn'||item.ColumnName=='IsOutside'">
                        <el-tag v-if="row[item.ColumnName]==1" type="success">是</el-tag>
                        <el-tag v-if="row[item.ColumnName]==0" type="danger">否</el-tag>
                      </div>
                      <span v-else>{{ row[item.ColumnName] }}</span>
                    </div>
                  </td>
                </template>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <div class="cell">
                    <el-button type="text" icon="el-icon-view" title="查看详情" class="btn-detail" @click="seeDetail(row)"></el-button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <userDetails v-model="showDetails" :data="userInfo"></userDetails>
  </div>
</template>
<script>
import userDetails from '@/components/UserInfo/detailsDialog'
export default {
  components: {
    userDetails
  },
  props: {
    tableList: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableColumn: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      isIndeterminate: false,
      userInfo: null,
      showDetails: false
    }
  },
  methods: {
    seeDetail(row) {
      this.userInfo = row
      this.userInfo.UserId = row.Id
      this.showDetails = true
    },
    getWidht() {
      var width = 55
      this.tableColumn.forEach(item => {
        if (
          item.ColumnName == 'UserColleges' ||
          item.ColumnName == 'UserDeps' ||
          item.ColumnName == 'UserLabels'
        ) {
          width = width + 180
        } else {
          width = width + 120
        }
      })
      return width + 120 * 5 + 180
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.tableList : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.tableList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableList.length
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-checkbox__label {
  display: none;
}
</style>