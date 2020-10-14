<template>
  <el-card class="box-card">
    <div>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            @clear="getList()"
            clearable
            placeholder="请输入内容"
            v-model="seach"
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
    <el-table stripe border="" :data="list" style="width: 100%">
      <el-table-column label="#" type="index" width="50"> </el-table-column>

      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>

      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>

      <el-table-column prop="mobile" label="电话" width="180">
      </el-table-column>

      <el-table-column prop="role_name" label="角色" width="180">
      </el-table-column>

      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#409EFF"
            @change="state(scope.row.id,scope.row.mg_state)"
            inactive-color="#DCDFE6"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            circle
            @click="edit(scope.$index, scope.row)"
          ></el-button>
          <!-- <el-button type="primary" icon="el-icon-edit" circle></el-button> -->
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.$index, scope.row)"
          ></el-button>
          <el-tooltip content="分配角色" placement="top" :enterable="false">
             <el-button
            icon="el-icon-share"
            circle
            size="mini"
            type="success"
            @click="fen(scope.row)"
          ></el-button>
          </el-tooltip>
         
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加弹框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
    >   
        <el-form :model="addUser" :rules="rules" ref="addUser" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUser.username"></el-input>
          </el-form-item>

            <el-form-item label="密码" prop="password">
            <el-input v-model="addUser.password"></el-input>
          </el-form-item>

            <el-form-item label="电话" prop="mobile">
            <el-input v-model="addUser.mobile"></el-input>
          </el-form-item>

            <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUser.email"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="resetForm('addUser')">取消</el-button>
            <el-button type="primary" @click="add('addUser')">确定</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 修改弹框 -->

    <el-dialog
      title="修改用户"
      :visible.sync="dialogVisibleEdit"
      width="30%"
    >
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="*用户名">
          <el-input v-model="Edit.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="*邮箱">
          <el-input v-model="Edit.email"></el-input>
        </el-form-item>
        <el-form-item label="*电话">
          <el-input v-model="Edit.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quxiao">取 消</el-button>
        <el-button type="primary" @click="editOk()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹框 -->
        <el-dialog title="分配角色" :visible.sync="dialogOK">
            
           <el-row>
            <el-col :span="10">当前的用户：<span>{{quanxian.username}}</span></el-col>
          </el-row>  
          <el-row>
            <el-col :span="10">当前的角色：<span>{{quanxian.role_name}}</span></el-col>    
          </el-row>            
          <el-form label-position="left">
          <el-row>
            <el-col>
              分配新角色：
               <el-select v-model="selectRoleId" placeholder="请选择">
                    <el-option
                      v-for="item in rolesList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
          </el-row>  
          
          </el-form>  
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogOK = false">取 消</el-button>
                <el-button type="primary" @click="fenOk()">确 定</el-button>
              </span>
        </el-dialog>
  </el-card>
</template>


<script>
import { users } from "../utils/api";
import axios from "axios";
export default {
  // 组件名称
  name: "demo",
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      list: [],
      // delivery: false,   //分配权限弹框 控制属性
      pagenum: 1,
      pagesize: 5,
      total: 40,
      vlaue: true,
      seach: "",
      dialogVisible: false,    //添加弹框 控制属性
      dialogVisibleEdit: false,      //修改弹框 控制属性
      dialogOK:false,            //分配权限  控制属性
      addUser: {
        username: "",
        password: "",
        mobile: "",
        email: "",
      },
      Edit: {
        username: "",
        mobile: "",
        email: "",
      },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
               { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          mobile: [
               { required: true, message: '请输入电话', trigger: 'blur' },
          ],
          email: [
              { required: true, message: '请输入邮箱', trigger: 'blur' },
          ],
          },
        formLabelWidth: '120px',
        //需要被分配角色的用户信息
        quanxian:{},
        //所有角色的数据列表
        rolesList:[],
        //已选的角色Id值
        selectRoleId:''
        }
  },
  // 计算属性
  computed: {},
  mounted() {
    this.getList();
  },
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    async getList() {
      let { data } = await users({
        query: this.seach,
        pagenum: this.pagenum,
        pagesize: this.pagesize,
      });
      this.list = data.data.users;
      console.log(data.data);
      this.total = data.data.total;
    },

    //========添加用户=========

    add(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$http.post("users", this.addUser).then(({data})=>{
                console.log(data);
                this.$message({
                message: data.meta.msg,
                duration: 1000,
                type: "success",
              });
              })
              
             this.dialogVisible = false           
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false
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
    // =============删除功能===============
    async handleDelete(index, row) {
      console.log(index, row.id);
      let { data } = await this.$http.delete(`users/${row.id}`);
      this.getList()
      this.$message({
        message: data.meta.msg,
        duration: 1000,
        type: "success",
      });
    },
    //===========修改功能===================
    edit(index, row) {
      this.dialogVisibleEdit = true;
      console.log(index, row);
      this.Edit = row;
      console.log(this.Edit);
    },
    //修改点击确定功能===============
    async editOk() {
      this.dialogVisibleEdit = false;
      let { data } = await this.$http.put(`users/${this.Edit.id}`, {
        mobile: this.Edit.mobile,
        email: this.Edit.email,
      });
      this.$message({
        message: data.meta.msg,
        duration: 1000,
        type: "success",
      });
      this.getList()
    },
    //========取消修改========
    quxiao(){
     this.dialogVisibleEdit = false
     this.getList()
    },
    //========开关功能=========
    async state(uId,bool) {
      let { data } = await this.$http.put(`users/${uId}/state/${bool}`)
        console.log(data)
      this.$message({
        message: data.meta.msg,
        duration: 1000,
        type: "success",
      });
    },
    // ======分配权限弹框============
    async fen(row){
      this.quanxian = row
      //在打开列表前  先获取值
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
        return this.$message.error('获取角色列表失败！')
      }
      console.log(this.quanxian)    
      this.rolesList = res.data 
      console.log(this.rolesList)
        this.dialogOK = true
      },

   async fenOk(){
      if(!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色')
      }

    let { data:res } = await this.$http.put(`users/${this.quanxian.id}/role`,{rid:this.selectRoleId})
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.getList()
      this.dialogOK = false
      return this.$message.success(res.meta.msg)
      

    }
  },
};
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style scoped lang="scss">
.el-table {
  font-size: 12px;
}
.el-card {
  margin-top: 15px;
}
.el-dialog {
  width: 50%;
}
.el-row {
  margin: 10px 0 10px 10px;
}
// .el-select{
//   width:150px;
// }
.el-col{
  font-size: 12px;
  text-align: left;
}
</style>
