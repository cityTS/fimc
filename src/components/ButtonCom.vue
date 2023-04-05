<template>
  <div class="button-page-body">
    <div class="button-page-item">
      <el-avatar shape="square" :size="40" :src="user.avatarUrl"></el-avatar>
    </div>
    <div class="button-page-item">
      <el-badge class="button-page-item-badge" :is-dot="true">
        <span class="iconfont iconfont-qipao" @click="changeRouter('/chat')"></span>
      </el-badge>
    </div>
    <div class="button-page-item">
      <el-badge class="button-page-item-badge" :is-dot="true">
        <span class="iconfont iconfont-tongxunlu" @click="changeRouter('/chat/friend')"></span>
      </el-badge>
    </div>
    <div class="button-page-item">
      <el-badge class="button-page-item-badge" :is-dot="true">
        <span class="iconfont iconfont-pengyouquan" @click="openPYQ"></span>
      </el-badge>
    </div>
    <div class="button-page-footer">
      <span class="iconfont iconfont-liebiao" @click="footerItemsShow = !footerItemsShow"></span>
    </div>
    <div class="button-page-footer-items" v-if="footerItemsShow">
      <div class="foot-item" @click="addUserDialogTableVisible = !addUserDialogTableVisible">添加好友</div>
    </div>
  </div>
  <div class="dialog-add-user">
    <el-dialog v-model="addUserDialogTableVisible" title="添加好友">
      <el-input placeholder="请输入好友的账号、手机号、邮箱等信息搜索">
        <template #append>
          <el-button :icon="Search"/>
        </template>
      </el-input>
      <el-table :data="seekUserInfo">
        <el-table-column property="avatarUrl" width="50">
          <template #default="scope">
            <el-image :src="scope.row.avatarUrl" style="width: 40px" :fit="'fill'"></el-image>
          </template>
        </el-table-column>
        <el-table-column property="username" label="用户名"/>
        <el-table-column property="userAccount" label="FIM号" width="100"/>
        <el-table-column property="status" width="100">
          <template #default="scope">
            <el-button type="primary" v-if="scope.row.status === 0">加为好友</el-button>
            <el-button type="warning" v-if="scope.row.status === 1">申请中</el-button>
            <el-button type="success" v-if="scope.row.status === 2">已是好友</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>


<script lang="ts" setup>

import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {shell} from "electron";
import {Search} from "@element-plus/icons";

const router = useRouter();
const user = reactive({
  avatarUrl: sessionStorage.getItem('avatarUrl')
});
// 选项内容可视
const footerItemsShow = ref(false)
const addUserDialogTableVisible = ref(false)
const seekUserInfo = [{
  avatarUrl: 'https://picx.zhimg.com/80/v2-2e1641a8fb38884c8b185ee293d5ae12_720w.webp?source=1940ef5c',
  username: '快乐大男孩',
  userAccount: 10053,
  status: 0 // 0 未申请 1 申请中 2 好友
}]

const changeRouter = (path: string) => {

  router.push({path: path})
}

const openPYQ = () => {
  const url = "http://qq.com"
  shell.openExternal(url)
}

</script>

<style>

.button-page-body {
  background-color: #2e2e2e;
  height: 100%;
  width: 100%;
}

.button-page-item {
  text-align: center;
  padding-top: 15px;
}

.button-page-item span {
  font-size: 20px;
  color: #c3c3c3;
}

.button-page-footer {
  text-align: center;
  position: fixed;
  width: 55px;
  bottom: 15px;
}

.button-page-footer span {
  font-size: 20px;
  color: #c3c3c3;
}

.el-avatar--square {
  border-radius: 0;
}

.button-page-footer-items {
  background-color: #2e2e2e;
  position: fixed;
  width: 140px;
  height: 80px;
  bottom: 20px;
  left: 55px;
}

.button-page-footer-items .foot-item {
  color: #6e6e6f;
  text-align: left;
  font-size: 14px;
  padding: 10px;
}
</style>