<template>
    <view class="avatar-view">
        <image class="avatar-btn" mode="aspectFill" :src="imgSrc" @error="imageError">
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
</script>
<style lang="scss" scoped>
    @import '@/assets/scss/_variable.scss';

    .avatar-view {
        .avatar-btn {
            border-radius: 100%;
            background-color: #eeeeee;
            height: v-bind(btnSizePx);
            width: v-bind(btnSizePx);
        }
    }
</style>