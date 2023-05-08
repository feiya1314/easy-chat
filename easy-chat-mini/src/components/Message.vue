<!-- 一条展示的message气泡 -->
<template>
    <view class="message-container">
        <view :class="`message-wrap ${isSender ? 'message-wrap_sender' : 'message-wrap_recipient'}`">
            <!-- <el-avatar class="avatar width-50" :size="50" :src="from === currentUser.id ? currentUser.avatar : ai.avatar" /> -->
            <avatar @click="test22()" :size="imgSize" :src="avatarImg" />
            <view class="message-box">
                <view class="details">
                    <text class="time">{{createTime}}</text>
                </view>
                <view class="content margin_t-10">
                    <text v-if="type === 1">{{content}}</text>
                    <!--   <view class="loading-icon-box" v-show="loading">
                        <el-icon class="loading-icon">
                            <loading />
                        </el-icon>
                    </view> -->
                </view>
            </view>
        </view>
    </view>
</template>
<script setup lang="ts">
    // import { ElAvatar } from 'element-plus'
    // import { ElIcon } from 'element-plus'
    import { toRefs, ref, computed } from "vue";
    import { store } from '../store/store.js'
    import Avatar from '@/components/Avatar'
    // import { MessageEntity } from '../store/MessageEntity'
    // 组件属性，外部传入 
    const props = defineProps({
        from: {
            // 消息来源，当前用户或者其他用户发过来的
            type: String,
            required: true,
        },
        loading: {
            // 消息是否正在加载
            type: Boolean,
            required: false,
            default: false
        },
        type: {
            // 消息类型
            type: Number,
            required: false,
            default: 1,
        },
        createTime: {
            // 消息创建时间
            type: String,
            required: true,
        },
        content: {
            // 头像地址
            type: String,
            required: true,
        },
    });
    // 或者使用toRefs，否则将失去响应式
    const { from, loading, type, createTime, content } = toRefs(props);
    console.log("loading " + loading)
    const imgSize = ref(32)
    const currentUser = computed(() => store.state.curUser)
    const ai = computed(() => store.state.chatAI)
    const isSender = props.from === currentUser.value.id;
    const avatarImg = isSender ? currentUser.value.avatar : ai.value.avatar
    // const from = ref(props.from)
    // const loading = ref(props.loading)
    const test22 = () => {
        console.log("message test")
    }
</script>
<style lang="scss" scoped>
    @import '@/assets/scss/_variable.scss';

    .message-container {
        .message-wrap {
            display: flex;
            padding-top: 5px;

            &_recipient {
                flex-direction: row;
                padding-left: 10px;

                .message-box {
                    margin-left: 5px;

                    .details {
                        flex-direction: row;

                        .nickname {
                            margin-right: 10px;
                        }
                    }

                    .content {
                        flex-direction: row;
                        position: relative;
                        padding-right: 10px;
                        // span::before {
                        //     content: '';
                        //     position: absolute;
                        //     left: -10px;
                        //     // border-right: 5px solid $activeColor;
                        //     border-right: 5px solid $receiverMsgColor;
                        //     border-top: 5px solid transparent;
                        //     border-left: 5px solid transparent;
                        //     border-bottom: 5px solid transparent;
                        // }
                        text {
                            background-color: $receiverMsgColor;
                        }
                    }
                }
            }

            &_sender {
                flex-direction: row-reverse;
                padding-right: 10px;

                .message-box {
                    margin-right: 5px;

                    .details {
                        flex-direction: row-reverse;

                        .nickname {
                            margin-left: 10px;
                        }
                    }

                    .content {
                        flex-direction: row-reverse;
                        padding-left: 10px;
                        // span::before {
                        //     content: '';
                        //     position: absolute;
                        //     right: -10px;
                        //     // border-left: 5px solid $activeColor;
                        //     border-left: 5px solid $senderMsgColor;
                        //     border-top: 5px solid transparent;
                        //     border-right: 5px solid transparent;
                        //     border-bottom: 5px solid transparent;
                        // }
                        text {
                            background-color: $senderMsgColor;
                        }

                        .loading-icon-box {
                            position: relative;

                            .loading-icon {
                                position: absolute;
                                top: 50%;
                                right: 5px;
                                transform: translateY(-50%);
                            }
                        }
                    }
                }
            }

            .message-box {
                flex: 1;

                .details {
                    display: flex;
                    font-size: 12px;

                    .nickname {
                        color: $darkColor-9;
                    }

                    .time {
                        color: $darkColor-6;
                    }
                }

                .content {
                    display: flex;
                    justify-content: normal;

                    text {
                        position: relative;
                        word-break: break-all;
                        padding: 10px;
                        font-size: 14px;
                        // color: $lightColor-0;
                        color: $darkColor-0;
                        text-align: left;
                        // background-color: $activeColor;
                        // background-color: $senderMsgColor;
                        // background-color: $receiverMsgColor;
                        border-radius: 4px;
                        max-width: 100%;
                    }
                }
            }
        }
    }
</style>