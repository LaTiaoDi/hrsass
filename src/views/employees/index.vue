<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small"
                     type="warning"
                     @click="$router.push('/import')">导入</el-button>
          <el-button size="small"
                     type="danger"
                     @click="exportData">导出</el-button>
          <el-button size="small"
                     type="primary"
                     @click='showDialog = true'>新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border
                  :data="list">
          <el-table-column label="序号"
                           sortable=""
                           type="index" />
          <el-table-column label="姓名"
                           sortable=""
                           prop="username" />
          <el-table-column label="头像"
                           sortable=""
                           prop="username">
            <template v-slot='{row}'>
              <img v-imageerror="require('@/assets/common/bigUserHeader.png')"
                   class="touxiang"
                   :src="row.staffPhoto"
                   alt="">
            </template>
          </el-table-column>
          <el-table-column label="工号"
                           sortable=""
                           prop="workNumber" />
          <el-table-column label="聘用形式"
                           sortable=""
                           prop="formOfEmployment"
                           :formatter="romatterEmployeeEnum" />
          <el-table-column label="部门"
                           sortable=""
                           prop="departmentName" />
          <el-table-column label="入职时间"
                           sortable=""
                           prop="timeOfEntry">
            <template v-slot='{row}'>{{row.timeOfEntry | formatDate}}</template>
          </el-table-column>
          <el-table-column label="账户状态"
                           sortable=""
                           prop="enableState">
            <template v-slot='{row}'>
              <!-- <div>{{row.enableState}}</div> -->
              <el-switch :value="row.enableState === 1"
                         active-color="#13ce66"
                         inactive-color="#ff4949">
              </el-switch>

            </template>
          </el-table-column>
          <el-table-column label="操作"
                           sortable=""
                           fixed="right"
                           width="280">
            <template v-slot='{row}'>
              <el-button type="text"
                         size="small"
                         @click="$router.push('employees/detail/'+row.id)">查看</el-button>
              <el-button type="text"
                         size="small">转正</el-button>
              <el-button type="text"
                         size="small">调岗</el-button>
              <el-button type="text"
                         size="small">离职</el-button>
              <el-button type="text"
                         size="small">角色</el-button>
              <el-button type="text"
                         size="small"
                         @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex"
                justify="center"
                align="middle"
                style="height: 60px">
          <el-pagination layout="prev, pager, next"
                         :page-size="page.size"
                         :current-page="page.page"
                         :total="page.total"
                         @current-change="changePage" />
        </el-row>
      </el-card>
    </div>
    <!-- 添加框弹出层 -->
    <add-employee :showDialog.sync='showDialog'></add-employee>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employess'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee'
export default {
  components: { addEmployee },
  data() {
    return {
      showDialog: false, //添加框弹出层
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList() //直接重新获取列表多简单
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    romatterEmployeeEnum(row, column, cellValue, index) {
      //处理聘用形式
      const obj = EmployeeEnum.hireType.find((item) => {
        return item.id === cellValue
      })
      return obj ? obj.value : '未知'
    },
    exportData() {
      import('@/vendor/Export2Excel').then((excel) => {
        excel.export_json_to_excel({
          header: ['姓名', '工资'], //表头 必填
          data: [['嘎达赵', '1000']], //具体数据 必填
          filename: 'excel-list', //非必填
          autoWidth: true, //非必填
          bookType: 'xlsx' //非必填
        })
      })
    }
  }
}
</script>

<style>
.touxiang {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  padding: 10px;
}
</style>

