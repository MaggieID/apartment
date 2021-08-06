<template>
  <div>
    <div style="display: flex;">
      <div style="flex: 1;">
        <el-row>
          <el-form>
            <el-image v-if="!vertical" class="imageBox" :src="data.PhotoPath" :preview-src-list="[data.PhotoPath]">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <el-col :span="vertical?24:6">
              <el-form-item label="姓名：">{{ data.Name }} </el-form-item>
            </el-col>
            <el-col :span="vertical?24:6">
              <el-form-item label="编号：">{{ data.Number }} </el-form-item>
            </el-col>
            <el-col v-if="data.Identity==0" :span="vertical?24:6">
              <el-form-item label="学制：">{{ data.StudyingYear_CN }} </el-form-item>
            </el-col>
            <el-col :span="vertical?24:6">
              <el-form-item label="性别：">{{ data.Sex_CN }} </el-form-item>
            </el-col>
            <el-col :span="vertical?24:6">
              <el-form-item label="身份：">{{ data.Identity_CN }} </el-form-item>
            </el-col>
            <el-col :span="vertical?24:6">
              <el-form-item label="民族：">{{ data.Race_CN }} </el-form-item>
            </el-col>
            <el-col v-if="data.Identity!=0" :span="vertical?24:6">
              <el-form-item label="婚姻：">{{ data.Marriage_CN }} </el-form-item>
            </el-col>
            <el-col :span="vertical?24:8">
              <el-form-item label="电话：">{{ data.Phone }} </el-form-item>
            </el-col>
            <el-col :span="vertical?24:8">
              <el-form-item label="邮箱：">{{ data.Email }} </el-form-item>
            </el-col>
            <el-col v-if="data.Identity==0" :span="vertical?24:8">
              <el-form-item label="入学时间：">{{ data.StartSchoolTime |parseTime }} </el-form-item>
            </el-col>
            <el-col v-if="vertical" :span="24">
              <el-form-item label="籍贯："> {{ data.NativePlace_CN }}</el-form-item>
            </el-col>
            <el-col v-if="vertical" :span="24">
              <el-form-item label="国籍：">{{ data.Nationality_CN }} </el-form-item>
            </el-col>
            <el-col v-if="vertical" :span="24">
              <el-form-item label="证件类型：">{{ data.IdentificationType_CN }} </el-form-item>
            </el-col>
            <el-col :span="vertical?24:8">
              <el-form-item label="证件号码：">{{ data.IdentificationNumber }} </el-form-item>
            </el-col>
            <el-col :span="vertical?24:8">
              <el-form-item label="是否已入住："> <span v-if="data.IsCheckIn!=undefined">{{ data.IsCheckIn==0?'未入住':'已入住' }}</span> </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="学院：">
                <div v-for="item in data.UserColleges" :key="item.CollegeId">{{ item.CollegePath }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="部门：">
                <div v-for="item in data.UserDeps" :key="item.DepartmentId">{{ item.DepPath }}</div>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
export default {
  filters: {
    parseTime(val) {
      return parseTime(val, '{y}-{m}-{d}')
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    vertical: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  }
}
</script>