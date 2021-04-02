<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList"
                border
                stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名"
                         prop="username"></el-table-column>
        <el-table-column label="邮箱"
                         prop="email"></el-table-column>
        <el-table-column label="电话"
                         prop="mobile"></el-table-column>
        <el-table-column label="角色"
                         prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="changeUserState(scope.row)">
            </el-switch>
          </template>

        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deleteUserById(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark"
                        content="分配角色"
                        placement="top"
                        :enterable="false">

              <el-button type="warning"
                         icon="el-icon-share"
                         size="mini"
                         @click="showRoleDialog(scope.row)"></el-button>

            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1,2,5,10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户的对话框  -->
    <el-dialog title="添加用户"
               :visible.sync="dialogVisible"
               width="50%"
               @close="addDialogClosed">
      <!-- 内容区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="70px"
               class="demo-ruleForm">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click=" addUser ">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户"
               :visible.sync="editDialogVisible"
               width="50%"
               @closed="editDialogClosed">
      <!-- 内容区域 -->
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="setRoleDialogVisible"
               width="50%"
               @close="setRoleDialogClosed">
      <div>
        <p>当前的用户： {{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配角色：
          <el-select v-model="selectedRoleId"
                     placeholder="请选择">
            <el-option v-for="item in rolesList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList();
  },
  data () {

    //自定义 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        cb()
      } else { cb(new Error('手机号码格式不正确')) }
    };

    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        //当前页码
        pagenum: 1,
        //每页条数
        pagesize: 2
      },
      userList: [],
      total: 0,
      //控制添加对话框的显示与隐藏
      dialogVisible: false,
      // 添加的用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
      //编辑用户对话框的显示隐藏
      editDialogVisible: false,
      // 编辑表单数据对象
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
      //分配角色对话框的显示隐藏
      setRoleDialogVisible: false,
      //当前需要被分配角色的用户信息
      userInfo: {},
      //所有角色列表数据
      rolesList: [],
      //被选中的角色id
      selectedRoleId: '',
    }

  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) {
        this.$message.error('获取用户列表失败！')
      } else {
        this.userList = res.data.users;
        this.total = res.data.total;
      }
      console.log(res);
    },
    //每页条数pagesize改变调用的方法
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //当前页码改变调用的方法
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听用户状态改变
    async changeUserState (userinfo) {
      //
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_sate}`);
      if (res.meta.status != 200) {
        this.$message.error('更新用户状态失败！');
        //让页面状态恢复
        userinfo.mg_sate = !userinfo.mg_sate
      } else {
        this.$message.success('更新用户状态成功！');
      }
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    //确定按钮，添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败！');
          } else {
            this.$message.success('添加用户成功！');
            this.dialogVisible = false;
            this.getUserList();
          }

        }

      })
    },
    //展示 编辑用户对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败！')
      }
      else {
        // 把获取到的用户信息对象，保存到 编辑表单数据对象中   
        this.editForm = res.data
        this.editDialogVisible = true
      }

    },
    //监听编辑用户对话框的关闭事件 
    editDialogClosed () {
      this.$refs.editFormRef.resetFields();
    },
    //确定按钮，发送请求修改用户
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        } else {
          // 发起修改的请求    
          const { data: res } = await this.$http.put
            ('users/' + this.editForm.id,
              {
                email: this.editForm.email,
                mobile: this.editForm.mobile
              })
          if (res.meta.status !== 200) {
            this.$message.error('编辑用户信息失败！')
          } else {
            this.$message.success('编辑用户信息成功！')
            //关闭对话框
            this.editDialogVisible = false
            //刷新数据列表
            this.getUserList()

          }
        };


      })
    },
    // 根据id删除用户信息
    deleteUserById (id) {
      //弹框询问删除
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('users/' + id).then((res) => {

          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            //刷新数据列表
            this.getUserList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //展示 分配角色对话框
    async showRoleDialog (userInfo) {
      //获取当前用户信息
      this.userInfo = userInfo;
      //发送请求，获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败！')
      } else {
        this.rolesList = res.data;
      }
      this.setRoleDialogVisible = true;
    },
    //点击确定，保存分配的角色
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        this.$message.error('请选择要分配的角色！')
      } else {

        const { data: res } = await this.$http.put(
          `users/${this.userInfo.id}/role`,
          {
            rid: this.selectedRoleId
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('更新角色失败！')
        } else {
          this.$message.success('更新角色成功！')
          this.getUserList()
          this.setRoleDialogVisible = false
        }


      }


    },
    //分配角色对话框关闭回调的方法
    setRoleDialogClosed () {
      this.selectedRoleId = '';
    }

  }
}

</script>
<style scoped>
</style>