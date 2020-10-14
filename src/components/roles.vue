<template>
<el-card>
<el-row>
  <el-col :span="4">
      <el-button type="primary" @click="handleAdd">添加角色</el-button>
  </el-col>
</el-row>

   <el-table
    :data="rolesList"
    border
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">

         <el-row v-for="(item,index) in props.row.children" :key="index">

          <el-col :span="5">
            <el-tag size="medium" closable>{{item.authName}}</el-tag>
            
          </el-col>
            <el-col :span="19">

              <el-row v-for="(it,ix) in item.children" :key="ix">
                  <el-col :span="6">
                    <el-tag size="medium" closable>{{it.authName}}</el-tag>
                  </el-col>

                  <el-col :span="18">
                    <el-tag 
                    type="warning" 
                    size="medium" 
                    closable
                    v-for="(t,i) in it.children" :key="i"
                    >{{t.authName}}</el-tag>
                  </el-col>
              </el-row>

            </el-col>
   

        </el-row>
      
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="#"
      type="index">
    </el-table-column>
    <el-table-column
      label="角色名称"
      prop="roleName">
    </el-table-column>
    <el-table-column
      label="角色描述"
      prop="roleDesc">
    </el-table-column>
     <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
           icon="el-icon-edit"
            type="primary"
            circle
          @click="handleEdit(scope.$index, scope.row)"></el-button>

        <el-button
          size="mini"
          type="danger"
           icon="el-icon-delete" 
           circle
          @click="handleDelete(scope.$index, scope.row)"></el-button>
          <el-button icon="el-icon-share" size="mini"  type="success" @click="rights(scope.$index, scope.row)">分配权限</el-button>
      </template>
    </el-table-column>

  </el-table>
   <!-- 添加弹框 -->
            <el-dialog title="修改角色" :visible.sync="dialogFormVisibleAdd">
                    <el-form :model="ruleFormAdd" :rules="rulesAdd" ref="ruleFormAdd" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="角色名称" prop="roleName">
                          <el-input v-model="ruleFormAdd.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="roleDesc">
                          <el-input v-model="ruleFormAdd.roleDesc"></el-input>
                        </el-form-item>
                    </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetFormAdd('ruleFormAdd')">取消</el-button>
            <el-button type="primary" @click="submitFormAdd('ruleFormAdd')">确定</el-button>

          </div>
        </el-dialog>

          <!-- 编辑弹框 -->
            <el-dialog title="修改角色" :visible.sync="dialogFormVisible">
                    <el-form :model="ruleFormEdit" :rules="rulesEdit" ref="ruleFormEdit" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="角色名称" prop="roleName">
                          <el-input v-model="ruleFormEdit.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="roleDesc">
                          <el-input v-model="ruleFormEdit.roleDesc"></el-input>
                        </el-form-item>
                    </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('ruleFormEdit')">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleFormEdit')">确定</el-button>

          </div>
        </el-dialog>
   <!-- 分配权限弹框 -->
          <el-dialog 
          title="分配权限" 
          :visible.sync="dialogFormVisibleRights" 
          width="50%" 
          @close="rolesRights">
                  <el-tree
                    :data="rightsList"
                    :props="rightsProps"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :default-checked-keys="defKeys"
                    ref="treeRef"
                    >
                  </el-tree>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRights = false">取 消</el-button>
            <el-button type="primary" @click="rightsOk">确 定</el-button>
          </div>
        </el-dialog>
</el-card>
</template>

<script>
import axios from 'axios'

export default {
  // 组件名称
  name: 'demo',
  // 组件参数 接收来自父组件的数据
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
   return {
     //所有角色列表数据================
     rolesList:[],
     //所有权限的列表数据==============
     rightsList:[],
     value:'',
          //编辑弹框的属性 ============
        dialogFormVisible: false,
          //添加弹框的属性 ============
        dialogFormVisibleAdd: false,
        //分配权限弹框属性
        dialogFormVisibleRights:false,
          //编辑弹框的属性 ============
        ruleFormEdit: {
          roleName: '',
          roleDesc: ''
          },
           rulesEdit: {
              roleName: [
                { required: true, message: '请输入角色名称', trigger: 'blur' },
              ],
                roleDesc: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
              ]
           },
          //添加弹框的属性 =============
          ruleFormAdd: {
          roleName: '',
          roleDesc: ''
          },
           rulesAdd: {
              roleName: [
                { required: true, message: '请输入角色名称', trigger: 'blur' },
              ],
                roleDesc: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
              ]
           },
        formLabelWidth: '120px',
        //树形控件的属性绑定对象=========
         rightsProps: {
          label: 'authName',
          children: 'children'
        },
        //默认选中的树形节点值的数组=======
        defKeys:[],
        //当前即将分配权限的角色ID
        roleId:''


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
        let {data} = await this.$http.get('roles')
        console.log(data.data)
        this.rolesList = data.data
        // console.log(this.rolesList)
        
    },
    //点击弹出添加弹框=============================
    handleAdd(){
      this.dialogFormVisibleAdd = true
    },
    //点击确定添加用户============================
      submitFormAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('roles',{
              roleName:this.ruleFormAdd.roleName,
              roleDesc:this.ruleFormAdd.roleDesc
            }).then(({data})=>{
              console.log(data)
              this.$refs[formName].resetFields();
               this.$message({
                            message:data.meta.msg,
                            duration: 1000,
                            type: "success",
                          });
              this.getList()
            })
        this.dialogFormVisibleAdd = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetFormAdd(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisibleAdd = false
      },
    //点击弹出修改弹框===============================
    handleEdit(index,row){
      this.dialogFormVisible = true
      console.log(row)
      this.ruleFormEdit = row
    },

    //编辑功能 取消  确定=============================
     submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.put(`roles/${this.ruleFormEdit.id}`,{
              roleName:this.ruleFormEdit.roleName,
              roleDesc:this.ruleFormEdit.roleDesc
            }).then(({data})=>{
              console.log(data)
              this.dialogFormVisible = false
              this.$message({
                            message:'更新角色成功',
                            duration: 1000,
                            type: "success",
                          });
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false
      },

      //删除功能==================================
     async handleDelete(index,row){
       let { data } = await this.$http.delete(`roles/${row.id}`)
       console.log(data)
       this.$message({
                    message:data.meta.msg,
                    duration: 1000,
                    type: "success",
       })
       this.getList()
      },
     
     
     //分配权限  点击事件
   async rights(index,row){
     this.roleId = row.id
      //过去所有权限的数据
    let { data:res } = await this.$http.get('rights/tree')

        this.rightsList = res.data
        console.log(this.rightsList)

      if(res.meta.status !== 200){
        return this.$message.error('获取数据失败')
      }

      //递归获取三级节点的Id
      this.getLeafKeys(row,this.defKeys)
      this.dialogFormVisibleRights = true

      },
      //监听分配权限对话框的关闭事件========
      rolesRights(){
        this.defKeys = []
      },
    //通过递归的形式，获取角色下所有三级权限的id
    getLeafKeys(node,arr){
      //如果当前 node 节点不包含children属性，则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      })
    },
    //点击确定分配权限的事件
    async rightsOk(){

      const keys = [
      ...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !==200){
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功')
      this.getList()
      this.dialogFormVisibleRights = false

    },




       handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
       handleNodeClick(data) {
        console.log(data);
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }]);
        }
        if (node.level > 3) return resolve([]);

        var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }

        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              name: 'zone' + this.count++
            }, {
              name: 'zone' + this.count++
            }];
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
      }
  },
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style scoped>
.el-row{
  display: flex;
  align-items: center;
}
.el-select{
  width: 100%;
}
.el-table{
  font-size: 12px;
}
</style>
