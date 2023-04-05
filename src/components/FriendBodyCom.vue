<template>
  <chat-page-body-empty v-if="showFlag"/>
  <friend-page-info v-else/>
</template>

<script lang="ts" setup>
import ChatPageBodyEmpty from "./ChatPageBodyEmpty.vue";
import FriendPageInfo from "./FriendPageInfo.vue";
import {ref, watch} from "vue";
import {useRouter} from "vue-router";
const router = useRouter();

const showFlag = ref(true);
watch(() => router.currentRoute.value.params.userAccount, (val, old) => {
  if(!val) {
    showFlag.value = true;
  } else {
    showFlag.value = false;
  }
}, {immediate: true})
</script>