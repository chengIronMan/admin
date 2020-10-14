<template>

<!-- <el-container class="box">
    <div class="box-img"><img src="../assets/logo.png" alt=""></div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm box">
                <el-form-item prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入用户名"></el-input>
                </el-form-item>  
                <el-form-item prop="psd">
                    <el-input placeholder="请输入密码" v-model="ruleForm.psd" show-password></el-input>
                </el-form-item>
                <div class="btn">
                <el-button type="primary" @click="login()">登录</el-button>
                <el-button >重置</el-button>
                </div>
     </el-form>
</el-container> -->

<div class="login-container">
    <div class="login-box">
        <div class="avatar-box">
            <img src="../assets/logo.png" alt="">
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item prop="name">
                <el-input v-model="ruleForm.username" prefix-icon="el-icon-s-custom"></el-input>
            </el-form-item>
            <el-form-item prop="psd">
                <el-input v-model="ruleForm.password" prefix-icon="el-icon-lock"></el-input>
            </el-form-item>
            <el-form-item class="btn-box">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
import axios from 'axios'
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
        ruleForm: {
          username: 'admin',
          password: '123456',
        },
        rules: {
          username: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
          ],

         
         }
   }    
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
       submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ajaxLogin()
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        // console.log(1111)
      },
    async ajaxLogin(){
        console.log(this.ruleForm)
       let { data } = await this.$http.post('/login',this.ruleForm)
       console.log(data)
       if(data.meta.status == 200){
                sessionStorage.setItem('token',data.data.token)
                this.$router.push('/home')
                this.$message({
                    message:data.meta.msg,
                    duration:1000,
                    type:"success"
                }) 
       }else{
            this.$message({
                    message:data.meta.msg,
                    duration:1000,
                    type:"error"
                }) 
       }

    }


  },
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style scoped lang="scss">
.login-container{
    background-color: #2b4b6b;
    height: 100%;
}
.login-box{
    background-color: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 10px #ddd;
    width: 450px;
    height: 304px;
    border-radius: 3px;
    top: 50%;
}
.avatar-box{
    width: 130px;
    height: 130px;
    padding: 10px;
    border: 1px solid #efefef;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 10px #ddd;
    img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #efefef;
    }
}
.el-form{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.el-input{
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
}
.btn-box{
    display: flex;
    justify-content: flex-end;
}
</style>
