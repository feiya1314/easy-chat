<template>
    <scroll-view :show-scrollbar="showScrollbar" class="message-group-box" scroll-with-animation="true" :scroll-top="scrollEnd" scroll-y=true>
        <div ref="refInner">
            <!-- <el-icon v-show="loading"> -->
            <!--   <el-icon class="is-loading">
                <Loading />
            </el-icon> -->
            <!-- <span class="tips" v-show="!loading && list.length >= page.total">暂无更多</span> -->
            <!-- 对话气泡列表 -->
            <message v-for="(item, index) in list" :key="index" :loading="item.loading" :from="item.from" :createTime="item.createTime"
                :content="item.content" class="margin-20-n" />
        </div>
    </scroll-view>
</template>
<script setup lang="ts">
    import Message from './Message'
    import { Chat } from '../store/chat'
    import { ref, reactive, computed, defineExpose } from "vue"
    // import { ElIcon, ElScrollbar } from 'element-plus'
    // import {  ElScrollbar } from 'element-plus'
    //  import { Loading } from '@element-plus/icons-vue'
    //  import 'element-plus/es/components/icon/style/css  

    const props = defineProps({
        chat: {
            type: Chat,
            required: true,
        }
    });

    const scrollHeight = ref("800px")
    const scrollEnd = ref(999999)
    const scrollToEnd = (listHight : number, delay : boolean = false) => {
        console.log('scrollToEnd listHight' + listHight)
        // if (scrollEnd.value == 9999999999) {
        //     scrollEnd.value = 9999999998
        //     return
        // }
        // scrollEnd.value = 9999999999
        scrollHeight.value = "" + listHight + "px"
        if (delay) {
            setTimeout(() => {
                scrollEnd.value = scrollEnd.value + 1
            }, 50)
        } else {
            scrollEnd.value = scrollEnd.value + 1
        }
    }
    const kbChange = () => {
        console.log('kbChange height')

    }

    defineExpose({
        scrollToEnd, kbChange
    })

    const loading = ref(false)
    const showScrollbar = ref(false)
    const page = reactive({
        current: 1,
        size: 10,
        total: 0,
        pages: 19
    })

    const chat = ref(props.chat)
    const list = chat.value.messages
    page.total = list.length
  //  console.log('pagetotal' + page.total)
</script>
<style lang="scss" scoped>
    @import '@/assets/scss/_variable.scss';

    .message-group-box {
        width: 100%;
        // min-height: 200px;
        height: v-bind(scrollHeight);
        padding: 0 0;
    }

    // 加上这段 没有scoped标签可以不加deep
    // ::v-deep .uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
    //     display: none;
    // }
    .tips {
        font-size: 12px;
        color: $darkColor-6;
    }
</style>