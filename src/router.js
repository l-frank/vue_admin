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

                    }, {
                        path: '/categories',
                        component: () =>
                            import ('views/goods/Cate.vue')

                    }, {
                        path: '/params',
                        component: () =>
                            import ('views/goods/Params.vue')
                    }, {
                        path: '/goods',
                        component: () =>
                            import ('views/goods/List.vue')
                    }, {
                        path: '/goods/add',
                        component: () =>
                            import ('views/goods/Add.vue')
                    }, {
                        path: '/orders',
                        component: () => {
                            return import ('views/order/Order.vue')
                        }

                    },
                    {
                        path: '/reports',
                        component: () =>
                            import ('views/report/Report.vue')
                    },

                ]
            },

        ],

    })
    //????????????????????????
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        //??????
        next();
    } else {
        const tokenStr = window.sessionStorage.getItem('token');
        if (!tokenStr) {
            //??????token,????????????
            next('/login')
        } else {
            next()
        }
    }

})
export default router;