<template>
  <div>
    <el-dialog title="个人信息" append-to-body :visible.sync="value" width="900px" :before-close="close">
      <userDetail :active-name="activeName" :user-details="userDetails" :bed="bed" :contract="contract"></userDetail>
    </el-dialog>
  </div>
</template>
<script>
import { QueryUserDetails } from '@/api/UserInfo'
import { GetBeds } from '@/api/Construct'
import { GetContract } from '@/api/LiveOperation'
import userDetail from '@/components/UserInfo/userDetail'
export default {
  components: {
    userDetail
  },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    treeId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: 'psn',
      userDetails: {},
      bed: {},
      contract: {}
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.activeName = 'psn'
        this.radio = this.data.UserId
        this.QueryUserDetails()
        this.GetBeds()
        this.GetContract()
      }
    }
  },
  methods: {
    QueryUserDetails() {
      QueryUserDetails({
        UserId: this.radio
      }).then(res => {
        this.userDetails = res.Data
      })
    },
    GetBeds() {
      GetBeds({
        Id: this.data.BedId,
        Page: null
      }).then(res => {
        this.bed = res.Data[0]
      })
    },
    GetContract() {
      GetContract({
        UserId: this.radio,
        BedId: this.data.BedId
      }).then(res => {
        this.contract = res.Data[0]
      })
    },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
