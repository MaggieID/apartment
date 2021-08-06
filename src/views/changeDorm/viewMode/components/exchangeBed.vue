<template>
  <div>
    <el-dialog title="互调" append-to-body :visible.sync="value" width="90%" :before-close="cancel">
      <el-row :gutter="10">
        <el-col :span="12">
          <selectInfo :show-contract="false"></selectInfo>
        </el-col>
        <el-col :span="12">
          <selectInfo :show-contract="false"></selectInfo>
        </el-col>
      </el-row>
      <div style="display:flex;margin-top: 10px;">
        <el-card style="flex: 1;height: 340px;" shadow="never">
          <div slot="header" class="top-title">
            <span style="padding-right: 50px;">合同信息</span>
          </div>
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="开始日期：" prop="EstimatedStartTime">
              <el-date-picker v-model="form.EstimatedStartTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="结束日期：" prop="EstimatedEndTime">
              <el-date-picker v-model="form.EstimatedEndTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="床位价格：" prop="Price">
              <el-input v-model.number="form.Price" style="max-width:215px" />
            </el-form-item>
            <el-form-item label="备注：" prop="Remark">
              <el-input v-model="form.Remark" placeholder="请输入内容" type="textarea" style="max-width:215px" />
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="flex: 1;height: 340px;" shadow="never">
          <div slot="header" class="top-title">
            <span style="padding-right: 50px;">合同信息</span>
          </div>
          <el-form ref="newForm" :model="newForm" :rules="rules" label-width="120px">
            <el-form-item label="开始日期：" prop="EstimatedStartTime">
              <el-date-picker v-model="newForm.EstimatedStartTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="结束日期：" prop="EstimatedEndTime">
              <el-date-picker v-model="newForm.EstimatedEndTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="床位价格：" prop="Price">
              <el-input v-model.number="newForm.Price" style="max-width:215px" />
            </el-form-item>
            <el-form-item label="备注：" prop="Remark">
              <el-input v-model="newForm.Remark" placeholder="请输入内容" type="textarea" style="max-width:215px" />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="cancel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { HuanShu, GetContract } from '@/api/LiveOperation'
// import { QueryUserDetails } from '@/api/UserInfo'
// import { GetBeds } from '@/api/Construct'
import selectInfo from './selectInfo'
export default {
  components: {
    selectInfo
  },
  props: {
    value: Boolean,
    checkList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {},
      newForm: {},
      formData: {},
      bedInfo: {},
      userInfo: {},
      BedId: null,
      UserId: null,
      newBedInfo: {},
      newUserInfo: {},
      newBedId: null,
      newUserId: null,
      rules: {
        EstimatedStartTime: [
          { required: true, message: '请选择合同开始时间', trigger: 'change' }
        ],
        EstimatedEndTime: [
          { required: true, message: '请选择合同结束时间', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    value(val) {
      // if (val) {
      // }
    }
  },
  methods: {
    cancel() {
      this.$emit('input', false)
    }
  }
}
</script>