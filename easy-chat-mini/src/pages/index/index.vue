<template>
    <view class="content">
        <!--       <image class="logo" src="/static/logo.png" />
        <view class="text-area">
            <text class="title">{{ title }}</text>
        </view> -->
        <!-- <el-button> test el</el-button> -->
        <!-- <button @click="test22()" :src="srcImg">click</button> -->
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
        <MessageList class="msg-list" :chat="curChat" ref="msgListRef" />
        <MessageInput :class="`msg-input ${inputMove}`" @kb-height="kbHeightChange" @new-msg="hasNewMsg"></MessageInput>
        <!-- <ContentMessage class="content-msg"></ContentMessage> -->
    </view>
</template>
<script setup lang="ts">
    import { ref, computed, reactive } from 'vue'
    import { store } from '../../store/store'
    import { MessageEntity } from '../../store/message-entity.js'
    import Message from '@/components/Message'
    import Avatar from '@/components/Avatar'
    import MessageList from '@/components/MessageList'
    import MessageInput from '@/components/MessageInput'
    // import ContentMessage from '@/components/ContentMessage'

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

    const listPaddingTop = ref("0em")
    const inputPaddingEnd = ref("0px")
    const inputMove = ref("")
    const kbHeightForMove = ref("0px")

    const msgListRef = ref<any>();

    const hasNewMsg = () => {
        console.log("hasNewMsg income")
        msgListRef.value.scrollToEnd()
    }
    const kbHeightChange = (kbHeight : number) => {
        console.log("kbHeightChange kbHeight " + kbHeight)
        if (kbHeight > 0) {
            kbHeightForMove.value = "" + kbHeight + "px"
        }

        inputMove.value = kbHeight > 0 ? "" : "input-down"
        inputPaddingEnd.value = "" + kbHeight + "px"
    }
</script>
<style>
    .msg-list {
        width: 100%;
        height: 100%;
        /* bottom: var(--window-top); */
        padding-bottom: 3.2em;
        /* padding-top: v-bind(listPaddingTop); */
        margin-top: v-bind(listPaddingTop);
    }

    .msg-input {
        width: 100%;
        /* height: 100%; */
        position: fixed;
        bottom: var(--window-bottom);
        -webkit-animation-duration: 0.1s;
        animation-duration: 0.1s;
        /* margin-bottom: 5px; */
        padding-bottom: v-bind(inputPaddingEnd);
    }

    .input-down {
        animation-name: kbDown;
        -webkit-animation-name: kbDown;
    }

    @keyframes kbDown {
        from {
            padding-bottom: v-bind(kbHeightForMove);
        }

        to {
            padding-bottom: 0px;
        }
    }

    /* Safari 与 Chrome */
    @-webkit-keyframes kbDown {
        from {
            padding-bottom: v-bind(kbHeightForMove);
        }

        to {
            padding-bottom: 0px;
        }
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