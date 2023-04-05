<template>
  <div class="chat-page-com">
    <div class="chat-page-com-chat-list">
      <chat-list-com/>
    </div>
    <div class="chat-page-com-chat-body">
      <chat-body-com/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChatListCom from "./ChatListCom.vue";
import ChatBodyCom from "./ChatBodyCom.vue";
</script>

<style>
/*css 参考https://blog.csdn.net/qq_33237207/article/details/100102757*/
.chat-page-com {
  height: 100%;
  width: 100%;
  display: flex;
}
.chat-page-com-chat-list {
  height: 100%;
  width: 250px;
}

.chat-page-com-chat-body {
  height: 100%;
  flex: 1;
}
</style>