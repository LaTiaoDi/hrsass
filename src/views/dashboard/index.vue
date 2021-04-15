<template>
  <div class="dashboard-container">
    <page-tools :show-before="true">
      <span slot="before">共166条记录</span>
      <template slot="after">
        <el-button size="small"
                   type="warning">导入</el-button>
        <el-button size="small"
                   type="danger">导出</el-button>
        <el-button size="small"
                   type="primary">新增员工</el-button>
      </template>
    </page-tools>
    <div class="dashboard-text">
      name: {{ name }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    console.log(this.$router)
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
