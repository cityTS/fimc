<template>
  <div class="button-page-body">
    <div class="button-page-item">
      <el-avatar shape="square" :size="40" :src="user.avatarUrl" @click="openUserInfo"></el-avatar>
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
      <div class="foot-item" @click="showApplyDialog">申请列表</div>
    </div>
  </div>
  <div class="dialog-add-user">
    <el-dialog v-model="addUserDialogTableVisible" title="添加好友">
      <el-input placeholder="请输入好友的账号、手机号、邮箱等信息搜索" v-model="userBasicInfo">
        <template #append>
          <el-button :icon="Search" @click="searchUserInfo"/>
        </template>
      </el-input>
      <el-table :data="seekUserInfo" :key="certinfoKey">
        <el-table-column property="user.avatarUrl" width="50">
          <template #default="scope">
            <el-image :src="scope.row.user.avatarUrl" style="width: 40px" :fit="'fill'"></el-image>
          </template>
        </el-table-column>
        <el-table-column property="user.username" label="用户名"/>
        <el-table-column property="user.userAccount" label="FIM号" width="100"/>
        <el-table-column property="status" width="100">
          <template #default="scope">
            <el-button type="primary" v-if="scope.row.status === 0" @click="addUser">加为好友</el-button>
            <el-button type="warning" v-if="scope.row.status === 1" disabled>申请中</el-button>
            <el-button type="success" v-if="scope.row.status === 2" disabled>已是好友</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
  <div class="dialog-apply-user">
    <el-dialog v-model="applyDialogTableVisible" title="申请列表">
      <el-table :data="applyUserList" :key="applyKey">
          <el-table-column property="avatarUrl" width="50">
            <template #default="scope">
              <el-image :src="scope.row.avatarUrl" style="width: 40px" :fit="'fill'"></el-image>
            </template>
          </el-table-column>
        <el-table-column property="username" label="用户名"/>
        <el-table-column property="userAccount" label="FIM号" width="100"/>
        <el-table-column width="120">
          <template #default="scope">
            <el-button type="danger" @click="refuse(scope.row.userAccount)">拒绝</el-button>
            <el-button type="success" @click="agree(scope.row.userAccount)">同意</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
  <div class="dialog-user-info">
    <el-dialog v-model="userInfoDialogTableVisible" title="修改个人信息">
      <div class="user-info-avatar">
        <el-avatar shape="square" :size="80" :src="user.avatarUrl"></el-avatar>
        <el-upload
            class="avatar-uoloader"
            action="http://43.139.136.169:10025/api/post_file/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <el-button type="primary">更新头像</el-button>
        </el-upload>
      </div>
      <div class="user-info-information">
        <el-input v-model="user.username">
          <template #prepend>
            昵&emsp;称:
          </template>
        </el-input>
        <el-input v-model="user.password">
          <template #prepend>
            新密码:
          </template>
        </el-input>
      </div>
      <div class="save-info">
        <el-button type="success" @click="saveUserInfo">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script lang="ts" setup>

import {reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {shell} from "electron";
import {ElMessage} from "element-plus";
import {Check, Delete, Search} from "@element-plus/icons";
import {addFriend, agreeApply, queryApplyList, queryUserBasicInfo, saveUser} from "../api/apis.js";
const certinfoKey = ref(false)
const applyKey = ref(false)
const router = useRouter();
const user = reactive({
  avatarUrl: sessionStorage.getItem('avatarUrl'),
  username: sessionStorage.getItem('username'),
  password: '',
  userAccount: sessionStorage.getItem('userAccount')
});
const applyDialogTableVisible = ref(false)
// 选项内容可视
const footerItemsShow = ref(false)
const addUserDialogTableVisible = ref(false)
let seekUserInfo: any[] = []
let applyUserList: any[] = []
const userBasicInfo = ref('')
const userInfoDialogTableVisible = ref(false)
const changeRouter = (path: string) => {

  router.push({path: path})
}

const saveUserInfo = async () => {
  let data = await saveUser(user)
  if(data.code === 0) {
    sessionStorage.setItem('avatarUrl', user.avatarUrl)
    sessionStorage.setItem('username', user.username)
    userInfoDialogTableVisible.value = false
  } else {
    ElMessage.warn(data.msg)
  }
}

watch(() => userInfoDialogTableVisible.value, (val, old) => {
  if(val === false) {
    user.username = sessionStorage.getItem('username')
    user.avatarUrl = sessionStorage.getItem('avatarUrl')
    user.password = ''
  }
})

const handleAvatarSuccess = (response: any, uploadFile: { raw: Blob | MediaSource; }) => {
  console.log('----response-----')
  console.log(response)
  user.avatarUrl = "http://43.139.136.169:10025/api/get_file/?path=" + response
}

const beforeAvatarUpload = (rawFile: { type: string; size: number; }) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Avatar picture must be JPG/PNG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const openUserInfo = () => {
  userInfoDialogTableVisible.value = !userInfoDialogTableVisible.value
}

const showApplyDialog = async () => {
  let data = await queryApplyList({userId: sessionStorage.getItem('userAccount')})
  if(data.code === 0) {
    applyUserList = data.data
    applyKey.value = !applyKey.value
    applyDialogTableVisible.value = !applyDialogTableVisible.value
  }
}

const searchUserInfo = async () => {
  let query = {
    str: userBasicInfo.value,
    userId: sessionStorage.getItem('userAccount')
  }
  let data = await queryUserBasicInfo(query)
  if(seekUserInfo.length !== 0) {
    seekUserInfo = []
  }
  if(data.code === 0) seekUserInfo.push(data.data);
  else alert(data.msg)
  console.log(seekUserInfo)
  certinfoKey.value = !certinfoKey.value
}

const addUser = async () => {
  let data = await addFriend({
    friendId: seekUserInfo[0].user.userAccount,
    userId: sessionStorage.getItem('userAccount')
  })
  if (data.code === 0) {
    seekUserInfo[0].status = 1;
    certinfoKey.value = ! certinfoKey.value
  } else {
    alert(data.msg)
  }
}
const agree = async (id: any) => {
  let data = await agreeApply({sponsorId: id, recipientId: sessionStorage.getItem('userAccount')})
  if(data.code === 0) {
    alert('成功添加好友')
  }
  data = await queryApplyList({userId: sessionStorage.getItem('userAccount')})
  if(data.code === 0) {
    applyUserList = data.data
    applyKey.value = !applyKey.value
  }
}

const refuse = async (id: any) => {
  let data = await agreeApply({sponsorId: id, recipientId: sessionStorage.getItem('userAccount')})
  if(data.code === 0) {
    alert('删除好友成功')
  }
  data = await queryApplyList({userId: sessionStorage.getItem('userAccount')})
  if(data.code === 0) {
    applyUserList = data.data
    applyKey.value = !applyKey.value
  }
}
watch(
    () => addUserDialogTableVisible.value,
    (val, preVal) => {
      if(!val) {
        userBasicInfo.value = ''
        seekUserInfo = []
      }
    }
)

const openPYQ = () => {
  const url = "http://43.139.136.169:10025"
  shell.openExternal(url)
}

</script>

<style>
.avatar-uoloader {
  display: inline-block;
}
.save-info {
  width: 100%;
  text-align: right;
}

.user-info-information {
  width: 100%;
}
.user-info-avatar {
  width: 100%;
}

.el-button {
  padding: 0 5px;
}

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