<template>
<div class="big">
<el-container>
  <el-header>
    <div class="top">
      <img src="../assets/logo.png" alt="">
      <h3>后台电商管理系统</h3>
    </div>
    <el-button type="info" size="mini" @click="goOut()">退出</el-button>
  </el-header>
  <el-container>
    <el-aside width=''>
          <div @click="listShow()" class="listShow">|||</div>
<el-menu 
    background-color="#373D41"
    :default-active='activePath' 
    class="el-menu-vertical-demo" 
    :collapse="isCollapse" 
    text-color="#fff" 
    router
    unique-opened>
  <el-submenu v-for="(item,index) in nav" :key="index" :index="item.id+''">
    <template slot="title">
      <i :class="iconList[item.id]"></i>
      <span slot="title" style="font-size:12px">{{ item.authName}}</span>
    </template>
       <el-menu-item v-for="(t,i) in item.children" :key="i" :index="`/${t.path}`" @click="bar(t.authName,item.authName,'/'+t.path)" style="font-size:12px">
      <i class="el-icon-menu"></i>       
       {{ t.authName }}
       </el-menu-item>
  </el-submenu>
</el-menu>
    </el-aside>
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right" >
        <el-breadcrumb-item :to="{ path: '/home/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.fu}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.zi}}</el-breadcrumb-item>
        <!-- <el-breadcrumb-item>活动详情</el-breadcrumb-item> -->
      </el-breadcrumb>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</div>
</template>

<script>
import axios from 'axios';
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
      isCollapse: false,                  //默认菜单不折叠
      nav:[],
      fu:'',
      zi:'',
      iconList:{                          //字体图标集合
        "125":"el-icon-user-solid",
        "103":"el-icon-star-on",
        "101":"el-icon-s-goods",
        "102":"el-icon-s-order",
        "145":"el-icon-s-platform",
        },   
        activePath:''     //默认激活的路由
   }
  },
  // 计算属性
  computed: {},
  mounted(){
    this.axiosGet()
  },
  created(){
    let path = sessionStorage.getItem('activePath')
    this.activePath = path
    console.log(path)
  },
  // 侦听器
  watch: {
      $route(to,from){
        this.activePath = to.path
        sessionStorage.setItem('activePath',this.activePath)
      }
  },
  // 组件方法
  methods: {

     async axiosGet(){
        let { data } = await this.$http.get('/menus')
        // console.log(data)
        // console.log(data.data[0].children)
        this.nav = data.data
      },
        // go(i){
        //   this.$router.push('/'+i)
        // },
        listShow(){
          this.isCollapse = !this.isCollapse
        },
        bar(i,t,path){
          this.fu = i
          this.zi = t
          console.log(path)
          sessionStorage.setItem("activePath",path)
          this.activePath = path
          console.log(this.activePath)
        },
        // goOut(){
        //   sessionStorage.removeItem('token')
        //   this.$router.back()
        // },
        goOut() {
        this.$confirm('你确认退出登录么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sessionStorage.removeItem('token')
          this.$router.go('/')
          this.$message({
            type: 'success',
            message: '退出登录成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      }
  },

}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style scoped lang="scss">
 .el-header{
    background-color: #373D41;
    color: #fff;
    font-weight: bold;
    // text-align: center;
    // line-height: 60px;
    display: flex;
    justify-content: space-between;
      align-items: center;

    .top{
      display: flex;
      align-items: center;
      img{
        width: 50px;
        height: 40px;
        margin-right: 15px;
      }
    }
  }
  .el-breadcrumb{
    margin-bottom: 15px;
  }
  .big{
    height: 100%;
    
    .el-container{
        height: 100%;
      }
  }
  .el-aside {
    background-color: #333744;
    // text-align: center;
    height: 100%;

    .listShow{
             background-color: #4a5064;
            color: #fff;
            font-size: 12px;
            text-align: center;
            line-height: 22px;
            cursor: pointer;
            letter-spacing: .12em;
            margin: 0;
        }
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    // line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    background-color: #333744;
    // min-height: 400px;
  }
  .el-radio-button{
    background-color: #333744;
  }
  .el-submenu{
    background-color: #333744;
    border-color: #333744;
    // padding: 0;
    
  }
  .el-menu{
    background-color: black;
    border: none;
  }

</style>
