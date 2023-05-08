<template>
    <view class="circle-btn-view" >
        <image class="circle-btn" mode="aspectFill" :src="imgSrc" @error="imageError">
        </image>
    </view>
</template>
<script setup lang="ts">
    import { ref, reactive, computed } from "vue"
    const props = defineProps({
        size: {
            // 消息类型
            type: Number,
            required: false,
            default: 32,
        },
        src: {
            // 头像地址
            type: String,
            required: true,
        },
    });
    const imgSrc = ref(props.src);
    console.log("imgSrc " + imgSrc.value)
    const btnSize = ref(props.size);
    const btnSizePx = btnSize.value + 'px';
    console.log("btnSize " + btnSizePx)
    const imageError = () => {
        console.log("imageError focus")
    }
    // 注册父组件监听的事件
    // const emit = defineEmits(['click-btn', 'value-change']);

    const clickBtn = (param1 : string) => {
        console.log("message 222 input test " + param1)
        //(父组件中触发的事件名，要传的变量名)
        // emit('click-btn', param1)
    }
</script>
<style lang="scss" scoped>
    @import '@/assets/scss/_variable.scss';

    .hover-class {
        background-color: #eeeeee;
    }

    .circle-btn-view {
        .circle-btn {
            border-radius: 100%;
            background-color: $lightColor-0;
            height: v-bind(btnSizePx);
            width: v-bind(btnSizePx);
        }
    }
</style>