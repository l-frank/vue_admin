import Vue from 'vue'
import Router from 'vue-router'



Vue.use(Router)

const router = new Router({
        routes: [{
                path: '/login',
                component: () =>
                    import ('views/Login.vue')
            }, {
                path: '',
                redirect: '/login'
            }, {
                path: '/home',
                component: () =>
                    import ('views/Home.vue'),
                children: [{
                        path: '',
                        redirect: '/welcome'
                    },

                    {
                        path: '/welcome',
                        component: () =>
                            import ('views/Welcome.vue')
                    },
                    {
                        path: '/users',
                        component: () =>
                            import ('views/user/Users.vue')
                    },
                    {
                        path: '/rights',
                        component: () =>
                            import ('views/power/Rights.vue')

                    },
                    {
                        path: '/roles',
                        component: () =>
                            import ('views/power/Roles.vue')

                    }

                ]
            },

        ],

    })
    //挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        //放行
        next();
    } else {
        const tokenStr = window.sessionStorage.getItem('token');
        if (!tokenStr) {
            //没有token,强制跳转
            next('/login')
        } else {
            next()
        }
    }

})
export default router;