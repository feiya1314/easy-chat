<template>
    <MessageList class="msg-list" :chat="curChat" />
    <MessageInput class="msg-input"></MessageInput>
</template>
<script setup lang="ts">
    import { ref, computed, reactive } from 'vue'
    import { store } from '../store/store'
    // import { MessageEntity } from '../../store/message-entity.js'
    // import Message from '@/components/Message'
    // import Avatar from '@/components/Avatar'
    import MessageList from '@/components/MessageList'
    import MessageInput from '@/components/MessageInput'

    const curChat = computed(() => store.state.curChat)
    
</script>
<style lang="scss" scoped>
    @import '@/assets/scss/_variable.scss';

    .msg-list {
        width: 100%;
        height: 100%;
    }

    .msg-input {
        width: 100%;
        position: absolute;
        bottom: 0;
    }
</style>