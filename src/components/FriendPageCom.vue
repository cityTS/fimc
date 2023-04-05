<template>
  <div class="friend-page-com">
    <div class="friend-page-com-friend-list">
      <friend-list-com/>
    </div>
    <div class="friend-page-com-friend-body">
      <friend-body-com/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FriendListCom from "./FriendListCom.vue";
import FriendBodyCom from "./FriendBodyCom.vue";
</script>

<style>
.friend-page-com {
  height: 100%;
  width: 100%;
  display: flex;
}
.friend-page-com-friend-list {
  height: 100%;
  width: 250px;

}
.friend-page-com-friend-body {
  height: 100%;
  flex: 1;
  background-color: #f5f5f5;
}
</style>