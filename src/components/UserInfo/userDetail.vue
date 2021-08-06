<template>
  <div>
    <el-tabs v-model="active" :type="type" class="rightForm">
      <el-tab-pane label="基本信息" name="psn" style="height:430px">
        <el-form style="padding-right: 120px;">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名：">{{ userDetails.Name }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编号：">{{ userDetails.Number }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别：">{{ userDetails.Sex_CN }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话：">{{ userDetails.Phone }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份："> {{ userDetails.Identity_CN }}</el-form-item>
            </el-col>
            <el-col v-if="userDetails.Identity==0" :span="12">
              <el-form-item label="入学时间："> {{ userDetails.StartSchoolTime |parseTime }}</el-form-item>
            </el-col>
            <el-col v-if="userDetails.Identity==0" :span="12">
              <el-form-item label="学制："> {{ userDetails.StudyingYear_CN }}</el-form-item>
            </el-col>
            <!-- <el-col :span="12" v-if="data.Identity==0">
                <el-form-item label="毕业时间："> {{ userDetails.BedName }}</el-form-item>
              </el-col> -->
            <el-col :span="12">
              <el-form-item label="证件类型："> {{ userDetails.IdentificationType_CN }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码："> {{ userDetails.IdentificationNumber }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生日："> {{ userDetails.Birthday }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="民族："> {{ userDetails.Race_CN }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="国籍："> {{ userDetails.Nationality_CN }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="籍贯："> {{ userDetails.NativePlace_CN }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="婚姻："> {{ userDetails.Marriage_CN }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱："> {{ userDetails.Email }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="住址："> {{ userDetails.Addr }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生地："> {{ userDetails.BirthAddr }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否已入住："> <span v-if="userDetails.IsCheckIn!=undefined">{{ userDetails.IsCheckIn==0?'未入住':'已入住' }}</span> </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="学院：">
                <div v-for="item in userDetails.UserColleges" :key="item.CollegeId">{{ item.CollegePath }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="部门：">
                <div v-for="item in userDetails.UserDeps" :key="item.DepartmentId">{{ item.DepPath }}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-image class="imageBox" :src="userDetails.PhotoPath" :preview-src-list="[userDetails.PhotoPath]">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
      </el-tab-pane>
      <el-tab-pane label="床位信息" name="1" style="height:430px">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label="床号："> {{ bed.BedName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="价格："> {{ bed.BedPrice }} </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="床位性别："> {{ bed.BedSex_CN }} </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态："> {{ bed.LiveState }} </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型："> {{ bed.LiveType }} </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="床位用途："> {{ bed.LivePurpose_CN }} </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="床位标签：">
                <el-tag v-for="tag in bed.Labels" :key="tag.LabelId" :style="{ background: tag.BackgroundColor,color: tag.FontColor}" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="床位路径："> {{ bed.ConstructFullPath }} </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="showContract" label="合同信息" name="2" style="height:430px">
        <el-form>
          <el-row>
            <el-scrollbar style="height:430px">
              <el-col :span="8">
                <el-form-item label="开始入住："> {{ contract.EstimatedStartTime|parseTime }} </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结束入住：">{{ contract.EstimatedEndTime|parseTime }} </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="床位价格：">{{ contract.Price }} </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备注：">{{ contract.Remark }} </el-form-item>
              </el-col>
              <el-col v-for="(item,index) in contract.Exts" :key="index" :span="8">
                <el-form-item :label="item.FieldName+'：'">{{ item.FieldValue |tojson }} </el-form-item>
              </el-col>
            </el-scrollbar>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
export default {
  filters: {
    tojson(val) {
      if (!val) return
      var show = JSON.parse(val)
      if (typeof JSON.parse(val) == 'object') {
        show = show.join(',')
      }
      return show
    },
    parseTime(val) {
      return parseTime(val, '{y}-{m}-{d}')
    }
  },
  props: {
    type: {
      type: String,
      default: 'border-card'
    },
    activeName: {
      type: String,
      default: 'psn'
    },
    userDetails: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bed: {
      type: Object,
      default: () => {
        return {}
      }
    },
    contract: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showContract: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      active: 'psn'
    }
  },
  watch: {
    userDetails: {
      deep: true,
      handler(val) {
        this.active = this.activeName
      }
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.imageBox {
  position: absolute;
  top: 20px;
  right: 0px;
}
::v-deep .el-tabs--border-card {
  border: 1px solid #dcdfe6;
}
</style>