<template>

  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/img/logo.png"
             alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info"
                 @click="logout">退出按钮</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button"
             @click="toggleCollapse">|||</div>
        <el-menu background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#479afb"
                 :unique-opened="true"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router='true'
                 :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- 注意index只接受字符串 -->
          <el-submenu :index="item.id+''"
                      v-for="item in menuList"
                      :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单选项 -->
            <el-menu-item :index="'/'+childItem.path"
                          v-for="childItem in item.children"
                          :key="childItem.id"
                          @click="saveNavState('/'+childItem.path)">
              <i class="el-icon-menu"></i>
              <span>{{childItem.authName}}</span>
            </el-menu-item>

          </el-submenu>

        </el-menu>

      </el-aside>
      <!-- 右侧区域  -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getMenuList();
    //获取激活的导航路径
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  data () {

    return {
      //左侧菜单数据
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-morentouxiang',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      //折叠数据
      isCollapse: false,
      //激活的链接地址
      activePath: '',
    }
  },
  methods: {
    //退出方法
    logout () {
      //清空token
      window.sessionStorage.clear();
      //跳转到登录页
      this.$router.push('/login')
    },
    //获取菜单信息
    async getMenuList () {
      const { data: res } = await this.$http.get('menus');
      if (res.meta.status != 200) {
        this.$message.error(res.meta.msg);
      } else {
        this.menuList = res.data;
      }
      console.log(res);
    },
    //水平折叠菜单
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    //保存导航激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      //解决点击导航在不重新创建组件情况下不对活跃路径重新赋值
      this.activePath = activePath;
    },
  }
}

</script>
<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header img {
  width: 50px;
  margin-right: 15px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: 0;
}
.toggle-button {
  background-color: #475163;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 15px;
  color: #ffff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>