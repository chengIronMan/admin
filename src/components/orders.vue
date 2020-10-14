<template>
<el-card>
        <div>
         <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="search"
            class="input-with-select"
          >
            <!--搜索直接调用渲染的方法  -->
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>

      </el-row>
      </div>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      label="#"
      type="index"
      width="">
    </el-table-column>

       <el-table-column
          label="订单编号"
          prop="order_number"
          width="">
        </el-table-column>

       <el-table-column
          label="订单价格"
          prop="order_price"
          width="">
        </el-table-column>

       <el-table-column
          label="是否付款"
          prop="is_send"
          width="">
        </el-table-column>

       <el-table-column
          label="是否发货"
          prop="is_send"
          width="">
          <el-tag type="danger" size="mini" color="#f56c6c" effect="dark">未付款</el-tag>
          <!-- <el-tag type="danger">标签五</el-tag> -->
        </el-table-column>

       <el-table-column
          label="下单时间"
          prop="update_time"
          width="">
        </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改订单地址" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="openEdit(scope.$index, scope.row)">
              </el-button>
            </el-tooltip>
           <el-tooltip class="item" effect="dark" content="查看物流信息" placement="top" :enterable="false">
             <el-button type="success" icon="el-icon-location-outline" size="mini" @click="openWL"></el-button>
          </el-tooltip>
          <!-- 修改地址信息弹框 -->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisibleEdit"
          width="50%"
          >
          <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="省市区/县">
            <el-cascader
                :options="cityOptions"
                :value="city"
                @change="changeProvince"
                change-on-select
              >
              </el-cascader>
            </el-form-item>
          </el-form>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="详细地址" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button>取 消</el-button>
            <el-button type="primary">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 物流信息弹框 -->
        <el-dialog
          title="物流信息"
          :visible.sync="dialogVisibleWL"
          width="50%"
          >
          <el-timeline :reverse="reverse">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp">
                {{activity.content}}
              </el-timeline-item>
            </el-timeline>
        </el-dialog>

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
import cityOptions  from '../assets/city_data2017_element'
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
        //修改信息弹框控制属性===========
        dialogVisibleEdit:false,
        //修改信息弹框数据===========
        cityOptions: cityOptions,
        city:'',
          ruleForm: {
          name: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
        },
        //物流信息 控制属性
        dialogVisibleWL:false,
        reverse: true,
         activities: [{
          content: '活动按期开始',
          timestamp: '2018-04-15'
        }, {
          content: '通过审核',
          timestamp: '2018-04-13'
        }, {
          content: '创建成功',
          timestamp: '2018-04-11'
        }]
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
          let {data} = await this.$http.get('orders',{
             params:{
              query:this.search,
              pagenum:this.pagenum,
              pagesize:this.pagesize
           }
          })
          // console.log(data)
        this.tableData = data.data.goods
        this.total = data.data.total
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
        //打开修改弹框
        openEdit(index,row){
          // console.log(row)
          this.dialogVisibleEdit = true
          // this.$http.get(`/kuaidi/${row.order_id}`).then(({data})=>{
          //   console.log(data)
          // })

        },
        changeProvince(){

        },
       async openWL(){
        // let {data:res} = await this.$http.get('/kuaidi/804909574412544580')
          this.dialogVisibleWL = true
          // console.log(res)
        }
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
