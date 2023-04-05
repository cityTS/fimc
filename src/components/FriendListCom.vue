<template>
  <div class="friend-list-com-search">
    <el-input
        v-model="searchInfo"
        placeholder="搜索"
        :prefix-icon="Search"
    />
  </div>
  <div class="friend-list-com-list" v-if="shudder">
    <div class="friend-list-com-initial-list" v-for="(item, idx) in myMap">
      <p class="friend-list-com-initial-title">{{item[0]}}</p>
      <div class="friend-list-com-initial-item" v-for="(fri, index) in item[1]">
        <friend-message-box :friend="fri"/>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import {nextTick, ref, watch} from "vue";
import {Search} from "@element-plus/icons";
import {useStore} from "vuex";
import FriendMessageBox from "./FriendMessageBox.vue";
import pinyin from "js-pinyin"
const store = useStore();
const searchInfo = ref('');
const shudder = ref(true);
let allFriendList: any[];
let showFriendList: any[];
let myMap = new Map<string, any[]>();
const shudderDom = async () => {
  shudder.value = false;
  await nextTick();
  shudder.value = true;
}
const pigeonhole = () => {
  myMap.clear();
  showFriendList.forEach((item, index) => {
    let ini = pinyin.getCamelChars(item.friendNickname).substring(0, 1).toUpperCase();
    let tmp = myMap.get(ini);
    if(tmp !== undefined) {
      tmp.push(item);
      myMap.set(ini, tmp);
    } else {
      myMap.set(ini, [item]);
    }
  })
  shudderDom();
}

watch(() => store.state.friendList, (val, old) => {
  allFriendList = val;
  showFriendList = allFriendList.filter((item: { friendNickname: string; }) => (searchInfo.value === '' || item.friendNickname.includes(searchInfo.value)));
  console.log(showFriendList)
  pigeonhole();
}, {immediate: true, deep: true})

</script>

<style>
.friend-list-com-search {
  padding: 20px 10px 15px 10px;
  background-color: #f7f7f7;
}
.friend-list-com-list {
  height: calc(100% - 67px);
  background-color: #e5e5e5;
}
.friend-list-com-initial-title {
  font-size: 12px;
  padding-left: 10px;
}
</style>