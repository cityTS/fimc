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
      <span class="iconfont iconfont-liebiao"></span>
    </div>
  </div>
</template>


<script lang="ts" setup>

import {reactive} from "vue";
import {useRouter} from "vue-router";
import {shell} from "electron";
const router = useRouter();
const user = reactive({
  avatarUrl: sessionStorage.getItem('avatarUrl')
});

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
</style>