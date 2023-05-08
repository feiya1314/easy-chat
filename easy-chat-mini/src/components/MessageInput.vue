<template>
    <view class="msg-input-view">
        <view @click="template()" class="temp-view">
            <circle-btn :size="imgSize" src="/static/template.png"></circle-btn>
        </view>
        <view @click="download()" class="download-view">
            <circle-btn :size="imgSize" src="/static/download.png"></circle-btn>
        </view>
        <view class="input-view">
            <textarea hold-keyboard=true class="input-box" :adjust-position="adjustPos" fixed=true @linechange="changInputLines"
                :auto-height=autoHeight trim=true maxlength=-1 v-model="input" @keyboardheightchange="kbChange" :show-confirm-bar=confirmBar
                placeholder="请输入问题" @focus="inputFocus" @blur="inputBlur" />
        </view>
        <view class="send-btn-view">
            <button class="send-btn" @click="sendMsg()" type="default" size="mini">发送</button>
        </view>
    </view>
</template>
<script setup lang="ts">
    import CircleBtn from '@/components/CircleBtn'
    import { ref, computed, defineEmits } from 'vue'
    import { store } from '../store/store'
    import { MessageEntity } from '../store/message-entity'

    const input = ref('')
    const imgSize = ref(28)
    const autoHeight = ref(true)
    const confirmBar = ref(false)
    const adjustPos = ref(false)
    const cursorSpacing = ref(12)

    const curChat = computed(() => store.state.curChat)
    const currentUser = computed(() => store.state.curUser)
    const ai = computed(() => store.state.chatAI)

    // 注册父组件监听的事件
    const emit = defineEmits(['kb-height', 'new-msg']);

    const sendMsg = () => {
        // console.log("send msg input :" + input.value)
        let ran = Math.floor(Math.random() * 2)
        let fr = ran < 1 ? "ai" : "user1"
        //  console.log(fr)

        let inputMsg = input.value
        if (inputMsg == '') {
            return
        }
        let question : MessageEntity = new MessageEntity(currentUser.value.id, "2023-02-02 23:23:25", inputMsg, false, 1);
        curChat.value.messages.push(question)
        emit('new-msg', 1)
        input.value = ''

        let answer : MessageEntity = new MessageEntity(ai.value.id, "2023-02-02 23:23:25", "answer for question : " + inputMsg, false, 1);
        // console.log("receiving msg back")
        curChat.value.messages.push(answer)
        emit('new-msg', 1)
    }

    const template = () => {
        console.log("message input icon ,show template")
    }

    const download = () => {
        console.log("message input icon ,download")
    }

    //输入框行数变化时调用，event.detail = {height: 0, heightRpx: 0, lineCount: 0}
    const changInputLines = (e : Event) => {
        //  console.log("input line changes e" + e.detail.lineCount)
        if (e.detail.lineCount > 4) {
            console.log("stop auto hegiht")
            autoHeight.value = false
            cursorSpacing.value = 12
        } else {
            autoHeight.value = true
            cursorSpacing.value = 12
        }
    }

    let kbHeight = 0

    // const inputFocus = (e) => {
    //     console.log("input focus " + e.detail.height)
    //     if (kbHeight > 0) {
    //         console.log("键盘高度缓存 " + kbHeight)
    //         emit('kb-height', kbHeight)
    //         return
    //     }
    // }
    // const inputBlur = (e) => {
    //     console.log("input blur " + e.detail.height)
    //     emit('kb-height', 0)
    // }

    //键盘高度发生变化的时候触发此事件，event.detail = {height: height, duration: duration}
    // todo 键盘高度变化时，msg list 执行padding调整位置
    const kbChange = (e : Event) => {
        console.log("键盘高度发生变化 " + e.detail.height)
        if (e.detail.height == 0) {
            console.log("键盘隐藏 " + e.detail.height)
            emit('kb-height', 0)
            return
        }

        if (kbHeight > 0) {
            console.log("键盘高度缓存 " + kbHeight)
            emit('kb-height', kbHeight)
            return
        }
        let sysInfo = uni.getSystemInfoSync()
        // #ifdef MP-WEIXIN
        // 获取微信胶囊的位置信息 width,height,top,right,left,bottom
        const custom = uni.getMenuButtonBoundingClientRect()

        console.log("custom.top " + custom.top)
        console.log("custom.height " + custom.height)
        // 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
        let navigationBarHeight = custom.height + (custom.top - sysInfo.statusBarHeight) * 2

        // 总体高度 = 状态栏高度 + 导航栏高度
        let navHeight = navigationBarHeight + sysInfo.statusBarHeight
        // #endif

        console.log("navHeight " + navHeight)
        console.log("screenHeight " + sysInfo.screenHeight)
        console.log("windowHeight " + sysInfo.windowHeight)
        console.log("statusBarHeight " + sysInfo.statusBarHeight)

        let heightDiff = sysInfo.screenHeight - sysInfo.windowHeight
        kbHeight = e.detail.height == 0 ? 0 : (e.detail.height - heightDiff + navHeight)

        console.log("键盘高度真实 " + kbHeight)
        //  kbHeight.value = e.detail.height
        emit('kb-height', kbHeight)
    }
</script>
<style lang="scss" scoped>
    @import '@/assets/scss/_variable.scss';

    .msg-input-view {
        background-color: $lightColor-0 ;
        display: flex;
        min-height: 2.8em;
        max-height: 12em;
        width: 100%;
        border-top: 0.5px solid $darkColor-10
    }

    .temp-view {
        margin-left: 5px;
        margin-right: 5px;
        display: flex !important;
        align-items: center !important;
    }

    .download-view {
        margin-right: 5px;
        display: flex !important;
        align-items: center !important;
    }

    .input-view {
        width: 100%;
        margin-right: 5px;
        display: flex !important;
        align-items: center !important;

        .input-box {
            width: 100%;
            word-break: break-all;
        }
    }

    .send-btn-view {
        display: flex !important;
        align-items: center !important;
    }

    .send-btn {
        padding: 0 1.34em;
        padding-left: 0;
        padding-right: 0;
        height: 2.6em;
        width: 3.8em;
        background-color: #57BF6A;
        text-align: center;
        line-height: 2.6;
        margin-right: 5px;
    }
</style>