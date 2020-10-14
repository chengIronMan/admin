<template>
 <el-card>
   <el-row :gutter="4">
  <el-col :span="1"><el-button type="primary" @click="addCategories">添加分类</el-button></el-col>
  </el-row>
 <div>
   <!-- 数据表格 -->
  <el-table
    :data="tableData"
    style="width: 100%;margin-bottom: 20px;"
    row-key="cat_id"
    border
    lazy
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
      type="index"
      label="#"
      
      >
    </el-table-column>
    <el-table-column
      prop="cat_name"
      label="分类名称"

      >
    </el-table-column>
    <el-table-column
      prop="cat_deleted"
      label="是否有效"

      >
      <!-- <i el-icon-success></i> -->
      <i class="el-icon-success"></i>
    </el-table-column>
    <el-table-column
      prop="cat_level"
      label="排序">
       <template slot-scope="scope">
      <el-tag size="mini" v-show="scope.row.cat_level == 0">一级</el-tag>
            <el-tag size="mini" v-show="scope.row.cat_level==1" type='success'>二级</el-tag>
      <el-tag size="mini" v-show="scope.row.cat_level==2" type="warning">三级</el-tag>
       </template>

    </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="edit(scope.$index, scope.row)"
          ></el-button>
          <!-- <el-button type="primary" icon="el-icon-edit" circle></el-button> -->
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          ></el-button>
       
        </template>
      </el-table-column>
  </el-table>
    <!-- 添加弹框 -->
<el-dialog title="添加商品分类" :visible.sync="dialogFormVisible">
  <el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="分类名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-form>
            <el-form-item label="父级分类" :label-width="formLabelWidth">
                <el-cascader
                    :options="options"
                    :props="cascaderProps"
                    clearable
                    v-model="selectKeys"
                    @change="parentChanged" 
                    change-on-select
                    >
                    </el-cascader>
            </el-form-item>
        </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </div>
</el-dialog>

</div>

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
        dialogFormVisible:false,
        tableData: [],
        total:40,
        pagenum:1,
        pagesize:10,
        type:0,
        formLabelWidth: '120px',
        value:[],
          ruleForm: {
          name: '',
        },
         rules: {
          name: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' },
          ],
         },
        //父级分类列表
        options:[],
        //指定级联选择器的配置对象
        cascaderProps:{
          value:"cat_id",
          label:'cat_name',
          children:'children'
        },
        selectKeys:[],
        addCateForm:{
          car_name:'',
          car_id:0,
          car_level:0
        }
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
    async getList(){
      let {data} = await this.$http.get('categories',{
        params:{
        pagenum:1,
        pagesize:10,
        }
      })
      console.log(data.data)
      this.total = data.data.total
      this.tableData = data.data.result

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

        //===============添加分类============
       async addCategories(){
            this.dialogFormVisible = true
          let {data} = await this.$http.get('categories',{
              params:{type:2}
            })
            console.log(data)
            this.options = data.data
        } ,
        //选择项发生变化触发这个函数
        parentChanged(){
            console.log(this.selectKeys)
            //父级分类的ID
            if(this.selectKeys.length>0){
              //父级分类的ID
             this.cascaderProps.cat_id = this.selectKeys[this.selectKeys.length-1]
             //为当前分类的等级赋值
             this.cascaderProps.cat_level = this.selectKeys[this.selectKeys.length-1]
              return
            }else{
            this.cascaderProps.cat_id = 0
             //为当前分类的等级赋值
             this.cascaderProps.cat_level = 0
            }
        },
        addCate(){
          console.log(this.cascaderProps)
        },
        //打开编辑弹框
        edit(){

        }
      
  },
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style scoped>
.el-icon-success{
  color: goldenrod;
}
</style>
