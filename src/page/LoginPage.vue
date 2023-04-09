<template>
  <!-- 提供手机+验证码、邮箱+密码登录 -->
  <!-- 只提供邮箱注册 -->
  <!-- 手机登录自动注册 -->

  <!-- 登录界面 -->
  <!-- 手机&验证码登录 -->
  <div class="login-page-phone" v-if="loginStatus === 0">
    <p class="login-page-title">手机登录</p>
    <el-form ref="loginPhoneForm" :model="loginPhoneTable" :rules="loginPhoneRules">
      <div class="login-phone-form-item-phone" v-if="loginPhoneStep === 0">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="loginPhoneTable.phone"/>
        </el-form-item>
        <el-button type="success" @click="getVerificationCode">获取验证码</el-button>
      </div>
      <div class="login-phone-form-item-v-code" v-else>
        <el-form-item label="验证码"
                      prop="verificationCode" :inline="true">
          <el-input v-model="loginPhoneTable.verificationCode"></el-input>
        </el-form-item>
        <el-button type="info" @click="loginPhonePreviousStep">上一步</el-button>
        <el-button type="success" @click="loginPhone">登录</el-button>
      </div>
    </el-form>
  </div>

  <!-- 邮箱&密码登录 -->
  <div class="login-page-email" v-if="loginStatus === 1">
    <p class="login-page-title">邮箱登录</p>
    <el-form ref="loginEmailForm" :model="loginEmailTable" :rules="loginEmailRules">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="loginEmailTable.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" type="password" prop="password">
        <el-input v-model="loginEmailTable.password" show-password></el-input>
      </el-form-item>
      <el-button type="success" @click="loginEmail">登录</el-button>
    </el-form>
  </div>

  <!-- 页脚 -->
  <div class="login-page-ending">
    <el-tooltip
        class="box-item"
        effect="dark"
        content="手机登录"
        placement="bottom-start"
    >
      <span class="iconfont iconfont-phone" @click="changePage(0)"></span>
    </el-tooltip>
    &nbsp &nbsp &nbsp &nbsp &nbsp
    <el-tooltip
        class="box-item"
        effect="dark"
        content="邮箱登录"
        placement="bottom"
    >
      <span class="iconfont iconfont-email" @click="changePage(1)"></span>
    </el-tooltip>
    &nbsp &nbsp &nbsp &nbsp &nbsp
    <el-tooltip
        class="box-item"
        effect="dark"
        content="新用户注册"
        placement="bottom-end"
    >
      <span class="iconfont iconfont-zhucetianjiahaoyou" @click="openSignHTML"></span>
    </el-tooltip>
  </div>


</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {shell} from "electron";
import {ackPhone, signInEmail, signInPhone} from '../api/apis.js';
import {useRouter} from "vue-router";
const router = useRouter()

/**
 * 标记当前属于哪种登录或注册
 * 0:手机登录
 * 1:邮箱登录
 */
const loginStatus = ref(0)

const loginPhoneForm = ref('');
const loginPhoneStep = ref(0);
const loginPhoneTable = reactive({
  phone: '',
  verificationCode: ''
});
const loginPhoneRules = reactive({
  phone: [
    {required: true, message: '请输入手机号', trigger: 'blur'},
    {pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'change'}
  ],
  verificationCode: [
    {required: true, message: '请输入验证码', trigger: 'blur'}
  ]
});

const loginEmailForm = ref('');
const loginEmailTable = reactive({
  email: '',
  password: ''
});
const loginEmailRules = reactive({
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式不正确', trigger: 'change'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'}
  ]
});

const getVerificationCode = async () => {
  let phone = /^1[3456789]\d{9}$/;
  if (!phone.test(loginPhoneTable.phone)) {
    return
  }
  const data = await ackPhone({phone: loginPhoneTable.phone})
  if(data.code === 0)  loginPhoneStep.value = 1
  else alert(data.msg)
};
const loginPhonePreviousStep = () => {
  loginPhoneStep.value = 0
  loginPhoneTable.verificationCode = ''
}

/**
 * 页面切换函数
 */
const changePage = (status: number) => {
  if (status === loginStatus.value) return;
  loginStatus.value = status;
  clearForm();
}

const clearForm = () => {
  // 清空手机登录表单
  loginPhoneTable.phone = '';
  loginPhoneTable.verificationCode = '';
  loginPhoneStep.value = 0;

  // 清空邮箱登录表单
  loginEmailTable.email = '';
  loginEmailTable.password = '';

}

const openSignHTML = () => {
  const url = 'http://sign.fim.cn'
  // 浏览器打开注册页面
  shell.openExternal(url);
}
const {ipcRenderer} = require('electron')
const loginPhone = async () => {
  if (loginPhoneTable.verificationCode === '') return;
  const data = await signInPhone({phone: loginPhoneTable.phone, code: loginPhoneTable.verificationCode})
  if(data.code === 0) {
    sessionStorage.setItem('userAccount', data.data.userAccount)
    sessionStorage.setItem('username', data.data.username)
    sessionStorage.setItem('avatarUrl', data.data.avatarUrl)
    ipcRenderer.send('change-window-size', 900, 650)
    router.replace('/chat')
  } else {
    alert(data.msg)
  }
}

const loginEmail = async () => {
  let data = await signInEmail({email: loginEmailTable.email, password: loginEmailTable.password})
  if(data.code === 0) {
    sessionStorage.setItem('userAccount', data.data.userAccount)
    sessionStorage.setItem('username', data.data.username)
    sessionStorage.setItem('avatarUrl', data.data.avatarUrl)
    ipcRenderer.send('change-window-size', 900, 650)
    router.replace('/chat')
  } else {
    alert(data.msg)
  }
}
</script>

<style>
.login-page-title {
  color: #07c160;
}

.login-page-ending {
  position: fixed;
  left: 0;
  top: 310px;
  width: 100%;
}
</style>