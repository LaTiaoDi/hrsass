<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="userForm"
                     label-width="120px"
                     :rules="rules"
                     :model="userInfo"
                     style="margin-left: 120px; margin-top:30px">
              <el-form-item label="用户名:"
                            prop="username">
                <el-input v-model="userInfo.username"
                          style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:"
                            prop="password2">
                <el-input style="width:300px"
                          v-model="userInfo.password2"
                          type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <component :is="userComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="jobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employess'
import userInfo from '../components/user-info.vue'
import JobInfo from '../components/job-info.vue'
export default {
  components: { userInfo, JobInfo },
  name: 'dital',
  data() {
    return {
      userComponent: 'userInfo',
      jobComponent: 'JobInfo',
      userInfo: {
        id: this.$route.params.id,
        username: '',
        password: '',
        password2: '' //读取的是密文，无法通过校验
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userInfo.id)
    },
    async saveUser() {
      try {
        await this.$refs.userForm.validate()
        this.userInfo.password = this.userInfo.password2
        await saveUserDetailById(this.userInfo)
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  },
  created() {
    this.getUserDetailById()
  }
}
</script>

<style>
</style>