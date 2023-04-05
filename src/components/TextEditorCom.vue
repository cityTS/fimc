<template>
  <div class="chat-page-dialog-editor-text-button">
    <hr class="hr"/>
    <v3-emoji style="width: 40px;font-size: 26px;" class="chat-page-dialog-editor-text-button-emoji" :recent="true" @click-emoji="addEmoji"/>
    <el-upload
        ref="upload"
        class="chat-page-dialog-editor-text-button-upload"
        action="http://175.178.114.64:12121"
        :limit="1"
        :on-error="onError"
        :auto-upload="true"
        :show-file-list="false"
    >
      <template #trigger>
        <el-button :icon="Upload" circle/>
      </template>
    </el-upload>
  </div>
  <div class="chat-page-dialog-editor-text-input">
    <el-input
        v-model="textarea"
        type="textarea"
        id="editor-text-textarea"
        resize="none"
        rows="7"
        @keyup.enter.native="submitMessage"
    />
  </div>
  <div class="chat-page-dialog-editor-text-input-button">
    <el-button type="success" @click="submitMessage">发送</el-button>
  </div>
</template>
<script lang="ts" setup>
import V3Emoji from 'vue3-emoji'
import {nextTick, ref} from "vue";
import {Upload} from "@element-plus/icons";
import type {genFileId, UploadInstance, UploadProps, UploadRawFile} from "element-plus";
const textarea = ref('');
// 根据光标插入emoji表情
const addEmoji = async (emoji: any) => {
  const myText = document.querySelector('#editor-text-textarea');
  if(!myText) return;
  if(myText.selectionStart || myText.selectionStart === 0) {
    let startPos = myText.selectionStart;
    let endPos = myText.selectionEnd;
    textarea.value = myText.value.substring(0, startPos) + emoji + myText.value.substring(endPos, myText.value.length);
    await nextTick();
    myText.focus();
    myText.setSelectionRange(endPos + emoji.length, endPos + emoji.length);
  } else {
    textarea.value += emoji;
  }
}
const onError = (e, u1, u2) => {
  console.log(e)
  console.log(u1)
  console.log(u2)
}
// TODO 发送请求的接口
const submitMessage = () => {
  console.log(textarea);
  textarea.value = '';
}
</script>


<style>
.el-textarea__inner {
  background-color: #f5f5f5;
  border-radius: initial;
  border: 0;
  box-shadow: 0 0 0 0;
}
.el-textarea {
  --el-input-hover-border-color: none;
  --el-input-focus-border-color: none;
  background-color: #f5f5f5;
}
.emoji-item {
  width: 30px;
}
.chat-page-dialog-editor-text-button-emoji {
  padding-left: 10px;
  display: inline-block;
}
.chat-page-dialog-editor-text-button-upload {
  display: inline-block;
}
.el-button.is-circle {
  background-color: #f5f5f5;
}
.hr {
  margin: 0;
  background-color: #ececec;
}
.chat-page-dialog-editor-text-input-button {
  text-align: right;
}
</style>