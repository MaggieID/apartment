<template>
  <div>
    <el-dialog title="换宿" append-to-body :visible.sync="value" width="90%" :before-close="cancel">
      <el-row :gutter="10">
        <el-col :span="12">
          <selectInfo></selectInfo>
        </el-col>
        <el-col :span="12">
          <selectInfo :show-contract="false" :show-user="false"></selectInfo>
        </el-col>
      </el-row>
      <el-card style="height: 440px;margin-top: 10px;">
        <div slot="header" class="top-title">
          <span style="padding-right: 50px;">重新修订合同</span>
          <el-checkbox v-model="UseOldConstracts">应用历史合同</el-checkbox>
        </div>
        <div style="height:calc(100% - 50px)">
          <el-scrollbar style="height:100%">
            <el-row>
              <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-col :span="8">
                  <el-form-item label="开始日期：" prop="EstimatedStartTime">
                    <el-date-picker v-model="form.EstimatedStartTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结束日期：" prop="EstimatedEndTime">
                    <el-date-picker v-model="form.EstimatedEndTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="床位价格：" prop="Price">
                    <el-input v-model.number="form.Price" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注：" prop="Remark">
                    <el-input v-model="form.Remark" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col v-for="(element,i) in templateExtCols" :key="element.TypeId" :span="8">
                  <form-render :index="i" :show-del="false" :ele="element" :data="form">
                  </form-render>
                </el-col>
              </el-form>
            </el-row>
          </el-scrollbar>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="cancel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import FormRender from '@/components/FormRender'
import { GetTemplateInfo } from '@/api/Construct'
// import { HuanShu, GetContract } from '@/api/LiveOperation'
// import { QueryUserDetails } from '@/api/UserInfo'
// import { GetBeds } from '@/api/Construct'
import selectInfo from './selectInfo'
export default {
  components: {
    selectInfo,
    FormRender
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
      form: {
        EstimatedStartTime: '',
        EstimatedEndTime: '',
        Price: 0,
        Remark: ''
      },
      formData: {},
      templateInfo: {},
      templateExtCols: [],
      bedInfo: {},
      userInfo: {},
      BedId: null,
      CheckInUserId: null,
      rules: {
        EstimatedStartTime: [
          { required: true, message: '请选择合同开始时间', trigger: 'change' }
        ],
        EstimatedEndTime: [
          { required: true, message: '请选择合同结束时间', trigger: 'change' }
        ]
      },
      newBedInfo: {},
      newBedId: null,
      UseOldConstracts: false,
      contractInfo: {}
    }
  },
  watch: {
    value(val) {
      // if (val) {
      // }
    }
  },
  mounted() {
    this.GetTemplateInfo()
  },
  methods: {
    cancel() {
      this.$emit('input', false)
    },
    GetTemplateInfo() {
      GetTemplateInfo({
        TypeName: 'CheckIn'
      }).then(res => {
        this.templateInfo = res.Data
        this.templateExtCols = res.Data.TemplateExtCols
        this.templateExtCols.map(val => {
          val.TypeId = val.Id.toString()
          this.$set(
            this.formData,
            val.Id.toString(),
            val.DefaultValue != null ? JSON.parse(val.DefaultValue) : ''
          )
          this.$set(
            this.form,
            val.Id.toString(),
            val.DefaultValue != null ? JSON.parse(val.DefaultValue) : ''
          )
          if (val.Items == null) {
            if (
              val.ControlType == 2 ||
              val.ControlType == 4 ||
              val.ControlType == 1
            ) {
              val.Items = []
            }
          }
        })
        // console.log(this.formData)
      })
    }
  }
}
</script>