<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tools :tree-node="gada"
                    :isgada="true"
                    @add="setAdd"
                    @delDepts="getDepartments" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="list"
                 :props="defaultProps"
                 default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools slot-scope="{ data }"
                      :tree-node="data"
                      @add="setAdd"
                      @delDepts="getDepartments"
                      @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <add-dept ref="addDept"
              :showgada="add"
              :tree-node="node"
              :add.sync="add"
              @delDepts="getDepartments" />
  </div>
</template>

<script>
import AddDept from './components/add-dept'
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      list: [],
      gada: {
        name: '江苏传智播客教育科技股份有限公司',
        manager: '负责人'
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      add: false, //添加弹出框
      node: {} //当前添加节点信息
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const data = await getDepartments()

      this.gada = { name: data.companyName, manager: '负责人', id: '' }
      this.list = tranListToTreeData(data.depts, '')
    },
    setAdd(node) {
      this.add = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    editDepts(node) {
      // 首先打开弹层
      this.add = true
      this.node = node // 赋值操作的节点
      console.log(node)
      console.log(this.$refs.addDept)
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style .tree-card {
  padding: 30px 140px;
  font-size: 14px;
}lang="scss" scoped>
</style>

