<template>
 <el-card>
        <div>
         <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            @clear="getList()"
            clearable
            placeholder="请输入内容"
            v-model="search"
            class="input-with-select"
          >
            <!--搜索直接调用渲染的方法  -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      </div>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="#"
      type="index"
      width="50">
    </el-table-column>

       <el-table-column
          label="商品名称"
          prop="goods_name"
          width="610">
        </el-table-column>

       <el-table-column
          label="商品价格"
          prop="goods_price"
          width="100">
        </el-table-column>

       <el-table-column
          label="商品重量"
          prop="goods_number"
          width="80">
        </el-table-column>

       <el-table-column
          label="创建时间"
          prop="upd_time"
          width="140">
        </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="open(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
      <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
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
      tableData: [],
        total:40,
        search:'',
        pagenum:1,
        pagesize:10,
   }
  },
  // 计算属性
  computed: {},
  mounted(){
     this.getList()
  },
  // 侦听器
  watch: {},
  // 组件方法
  methods: {

        // 获取数据
       async getList(){
         let {data} = await this.$http.get('goods',{
           params:{
              query:this.search,
              pagenum:this.pagenum,
              pagesize:this.pagesize
           }
         })
         console.log(data.data.goods)
         this.tableData = data.data.goods
        this.total = data.data.total
        
       },



       handleEdit(index, row) {
        console.log(index, row);
      },
        //删除功能
      open(index,row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row.goods_id)
        this.handleDelete(row)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
     async handleDelete(row) {
        let {data} = await this.$http.delete(`goods/${row.goods_id}`)
      },
          //=================分页==============
        handleSizeChange(val) {
          this.pagesize = val;
          console.log(`每页 ${val} 条`);
          this.getList();
        },
        handleCurrentChange(val) {
          this.pagenum = val;
          console.log(`当前页: ${val}`);
          this.getList();
        },
  },
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style scoped>
.el-table{
  font-size: 12px;
}
</style>
