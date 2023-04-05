import { createRouter,createWebHistory } from "vue-router";
import LoginPage from "../page/LoginPage.vue";
import MainPage from "../page/MainPage.vue";
import ChatPageCom from "../components/ChatPageCom.vue";
import FriendPageCom from "../components/FriendPageCom.vue";
const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path: '/',
            component: LoginPage
        },
        {
            path:'/chat',
            component:MainPage,
            children:[
                {
                    path: '',
                    component: ChatPageCom
                },
                {
                    path: ':userAccount',
                    component: ChatPageCom
                },
                {
                    path: 'friend',
                    component: FriendPageCom
                },
                {
                    path: 'friend/:userAccount',
                    component: FriendPageCom
                }
            ]
        }
    ]
})
export default router;
