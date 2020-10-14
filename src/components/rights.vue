<template>
  <el-card class="box-card">

    <el-table stripe border="" :data="list" style="width: 100%">
      <el-table-column label="#" type="index" width="65"> </el-table-column>

      <el-table-column prop="authName" label="权限名称" width="396">
      </el-table-column>

      <el-table-column prop="path" label="路径" width="396"> </el-table-column>

      <el-table-column prop="level" label="权限等级" width="396">
         <template slot-scope="scope">
          <el-button type="primary" v-show="scope.row.level==0" plain size="mini" disabled>一级</el-button>
          <el-button type="success" v-show="scope.row.level==1" plain size="mini" disabled>二级</el-button>
          <el-button type="info" v-show="scope.row.level==2" plain size="mini" disabled>三级</el-button>
         </template>
      </el-table-column>

    </el-table>
  </el-card>

</template>

<script>
export default {
  // 组件名称
  name: 'demo',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
   return {
     list:[]
   }
  },
  mounted(){
      this.getRights()
  },
  // 计算属性
  computed: {
  },
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    getRights(){
      this.$http.get('rights/list').then(({data})=>{
        this.list = data.data
      })
      }


  },
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style scoped>
.el-button{
  padding: 2px 5px;
  /* font-size: 10px; */
  margin-left: 11px;
}
.el-table{
  font-size: 12px;
}
</style>
