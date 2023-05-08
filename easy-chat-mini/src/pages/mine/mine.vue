<template>
    <view class="content">
        <image class="logo" src="/static/logo.png" />
        <view class="text-area">
            <text class="title">{{ title }}</text>
        </view>
        <!-- <el-button> test el</el-button> -->
        <button @click="test22()" :src="srcImg">click</button>
        <!-- <el-avatar size="small" src="static/logo.png" /> -->
        <!-- <el-avatar size="small" src="static/mine-sel.png" /> -->
        <!--  <message
                v-for="(item, index) in list"
                :loading="item.loading"
                :key="index"
                :from="item.from"
                :createTime="item.createTime"
                :content="item.content"
                class="margin-20-n" /> -->
        <MessageList class="msg-list" :chat="curChat" />
    </view>
</template>
<script setup lang="ts">
    import { ref, computed, reactive } from 'vue'
    import { store } from '../../store/store.js'
    import { MessageEntity } from '../../store/message-entity.js'
    import Message from '@/components/Message'
    import Avatar from '@/components/Avatar'
    import MessageList from '@/components/MessageList'

    import logo from '@/static/logo.png'

    const title = ref('我的')
    const currentUser = computed(() => store.state.curUser)
    const curChat = computed(() => store.state.curChat)
    const list = computed(() => {
        return store.state.curChat.messages || []
    })
    const ai = computed(() => store.state.chatAI)
    const srcImg = '/static/logo.png'
    // const srcImg = "https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg"
    let count = 0
    const test22 = () => {
        let ran = Math.floor(Math.random() * 2)
        let fr = ran < 1 ? "ai" : "user1"
        console.log(fr)
        count++;
        let newMsg : MessageEntity = new MessageEntity(fr, "2023-02-02 23:23:25", "newmsg" + count, false, 1);
        curChat.value.messages.push(newMsg)
    }
</script>
<style>
    .msg-list{
        width: 100%;
    }
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .logo {
        height: 200rpx;
        width: 200rpx;
        margin-top: 200rpx;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 50rpx;
    }

    .text-area {
        display: flex;
        justify-content: center;
    }

    .title {
        font-size: 36rpx;
        color: #8f8f94;
    }
</style>