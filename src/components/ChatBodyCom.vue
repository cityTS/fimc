<template>
  <chat-page-body-empty v-if="showFlag"/>
  <chat-page-dialog-editor v-else/>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import ChatPageDialogEditor from "./ChatPageDialogEditor.vue";
import {useRouter} from "vue-router";
import ChatPageBodyEmpty from "./ChatPageBodyEmpty.vue";

const router = useRouter();
const showFlag = ref(true);
watch(() => router.currentRoute.value.params.userAccount, (val, old) => {
  if (!val) {
    showFlag.value = true;
  } else {
    showFlag.value = false;
  }
}, {immediate: true})
</script>z