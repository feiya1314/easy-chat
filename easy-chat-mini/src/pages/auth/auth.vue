<template>
    <view class="w-screen h-screen flex flex-col">
        <view class="flex items-center pt-8 pl-4">
            <image class="h-6 w-6 p-2" src="/static/logo.png" />
            <text class="font-bold text-lg"> 易识</text>
            <text v-if="uid == ''" class="p-2 text-base font-bold"> 申请使用</text>
            <text v-if="uid != ''" class="p-2 text-base font-bold"> 登录成功, uid: {{uid}}</text>
        </view>
        <!--   <view class="pt-4 pl-4">
            <text class="p-2 font-bold text-xl"> 获取您的昵称、头像</text>
        </view> -->
        <view class="pt-4 pl-4">
            <text class="p-2 font-bold text-xl"> 使用微信登录</text>
        </view>
        <!-- <view class=" mt-4 ml-4 mr-4 h-12 flex border border-slate-100 rounded-lg items-center">
            <view class="pl-2">
                <button type="balanced" class="h-10 w-10 relative" open-type="chooseAvatar" @chooseavatar="onChooseavatar">
                    <image :src="avatarUrl" class="h-10 w-10 absolute left-0"></image>
                </button>
            </view>
            <input type="nickname" class="weui-input pl-4" :value="nickName" @blur="bindblur" placeholder="请输入昵称" @input="bindinput" />
        </view> -->
        <view class="pt-40 pl-4 pr-4">
            <button v-if="authStatus == 'scaned'" class="p-2 text-xl" type="primary" @click="login">允许使用</button>
            <button v-if="authStatus == 'notScan'" class="p-2 text-xl" type="primary" @click="scanQr">扫码登录</button>
        </view>
    </view>
</template>
<script setup lang="ts">
    import { onLoad } from '@dcloudio/uni-app';
    import { logger } from '../../store/log-manager'
    import { ref } from 'vue'
    const authStatus = ref("notScan")
    const avatarUrl = ref('')
    const nickName = ref('昵称')
    const loginKey = ref('')
    const uid = ref('')
    const token = ref('')
    let reqPrefix = 'https://test.easyocr.cn/chat/auth/v1/wx'

    // 扫码进入时，获取scene
    onLoad((options : any) => {
        console.log("onload : " + options)
        logger.info("onload : ", options)
        if (options.scene) {
            var scene = decodeURIComponent(options.scene)
            console.log("scene : " + scene)
            logger.info("scene : ", scene)

            if (scene.indexOf("tempKey") >= 0) {
                let subScene = scene.substring(8)
                logger.info("subScene :", subScene)

                let splitKeyStrs = scene.split('=')
                if (splitKeyStrs.length < 2) {
                    logger.error("splitKeyStrs len error")
                    loginKey.value = subScene
                } else {
                    logger.info("splitKeyStrs ", splitKeyStrs[0], splitKeyStrs[1])
                    loginKey.value = splitKeyStrs[1]
                }
            } else {
                logger.info("scene no start tempKey")
                loginKey.value = scene
            }

            authStatus.value = 'scaned'

            console.log("scaned")
            logger.info("scaned tempKey : ", loginKey.value)

            updateLoginStatus("SCAN_QR")
            return
        }
        console.log("notScan")
        logger.info("notScan")
        authStatus.value = 'notScan'
    })

    const scanQr = () => {
        uni.scanCode({
            // scanType: ['qrCode'],
            success: function (res) {
                console.log('扫码结果：' + res);
                logger.info("scanQr扫码结果", res)
                logger.info("scanQr扫码path", res.path)

                // let path = 'pages/auth/auth?scene=tempKey=ffcffab9'
                let path = decodeURIComponent(res.path)
                let tempKeyStrs = path.split('=')
                if (path.indexOf("scene=tempKey") >= 0) {
                    if (tempKeyStrs.length < 3 || tempKeyStrs[2] != 'tempKey') {
                        uni.showToast({
                            title: '二维码不正确',
                            icon: 'error'
                        })
                        return
                    }
                    loginKey.value = tempKeyStrs[2]
                } else {
                    if (tempKeyStrs.length < 2 || tempKeyStrs[1] != 'scene') {
                        uni.showToast({
                            title: '二维码不正确',
                            icon: 'error'
                        })
                        return
                    }
                    loginKey.value = tempKeyStrs[1]
                }

                logger.info("scanQr扫码 tempKey", loginKey.value)
                authStatus.value = 'scaned'

                updateLoginStatus("SCAN_QR")
            },
            fail: function (e) {
                logger.error("scanQr扫码 error ", e)
            }
        });
    }

    const login = () => {
        console.log("start login")
        logger.info("start login ", loginKey.value)
        let sessionStatus = uni.checkSession()

        console.log(sessionStatus)
        logger.info("sessionStatus", sessionStatus, loginKey.value)

        updateLoginStatus("LOGINING");

        uni.login({
            provider: 'weixin', //使用微信登录
            onlyAuthorize: true,
            //timeout: 5000,
            success: function (loginRes) {
                console.log(loginRes.authResult);
                logger.info("loginRes", loginRes.authResult, loginKey.value)

                console.log('code:' + loginRes.code)
                logger.info("login code ", loginRes.code, loginKey.value)

                callCodeToSession(loginRes.code)
            },
            fail: function (failRes) {
                console.log('login fail:' + failRes)
                logger.info("login fail ", failRes, loginKey.value)

                updateLoginStatus("EXCEPTION");
            },
            complete: function () {

            }
        });
    }

    // 调用后端登录接口,更新登录状态
    const updateLoginStatus = (callbackStatus : string) => {
        let callbackUrl = reqPrefix + '/loginCallback'
        console.log('status:' + callbackStatus)
        logger.info("callbackStatus ", callbackStatus, loginKey.value)
        uni.request({
            url: callbackUrl,
            method: 'POST',
            timeout: 3000,
            data: {
                tempKey: loginKey.value,
                status: callbackStatus
            },
            //自定义请求头信息
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                console.log('callback data :' + res.data);
                logger.info("callbackStatus data", res.data, loginKey.value)
            },
            fail: (failRes) => {
                console.log('callback fail :' + failRes);
                logger.info("callbackStatus fail", failRes, loginKey.value)
            }
        })
    }

    // 携带code和tempKey，调用后端登录接口,这里拿到登录后的后端 token，以后请求时需要带上token
    const callCodeToSession = (wxCode : string) => {
        console.log('code:' + wxCode)
        logger.info("callCodeToSession wxCode", wxCode, loginKey.value)
        uni.request({
            url: reqPrefix + '/code2Session',
            method: 'GET',
            dataType: 'json',
            data: {
                code: wxCode,
                tempKey: loginKey.value
            },
            success: (res) => {
                // 登录成功，服务端返回用户id和登录token信息
                console.log(res)
                logger.info("callCodeToSession res", res, loginKey.value)
                if (res.statusCode != 200) {
                    uni.showToast({
                        title: '登录失败:' + res.data,
                        icon: 'error'
                    })
                    return
                }

                if (res.data.errorCode) {
                    uni.showToast({
                        title: '登录失败:' + res.data.errorMsg,
                        icon: 'error'
                    })
                    return
                }

                uid.value = res.data.userId
                token.value = res.data.token
            },
            fail: (e) => {
                console.log(e)
                logger.info("callCodeToSession fail", e, loginKey.value)
            },
            complete: () => {
                console.log('callCodeToSession complete')
                logger.info("callCodeToSession complete", loginKey.value)
            }
        })
    }

    const onChooseavatar = (e) => {
        let avatar = e.detail.avatarUrl
        avatarUrl.value = avatar
        console.log(avatar)
        // uni.showLoading({
        //     title: '加载中'
        // });
        // uni.uploadFile({
        //     url: '后台uploadFile接口',
        //     filePath: avatarUrl,
        //     name: 'file',
        //     header: {
        //         token: '自己的token',
        //     },
        //     success: uploadFileRes => {
        //         // 注意：这里返回的uploadFileRes.data 为JSON 需要自己去转换
        //         let data = JSON.parse(uploadFileRes.data);
        //         if (data.code === 0) {
        //             this.avatarUrl = data.data;
        //         }
        //     },
        //     fail: (error) => {
        //         uni.showToast({
        //             title: error,
        //             duration: 2000
        //         });
        //     },
        //     complete: () => {
        //         uni.hideLoading();
        //     }
        // });
    }

    const bindblur = (e) => {
        console.log(e)
        nickName.value = e.detail.value
    }

    const bindinput = (e) => {
        console.log(e)
        nickName.value = e.detail.value
    }
</script>
<style lang="scss">
    /*每个页面公共css */
    @import "tailwindcss/base";
    @import "tailwindcss/utilities";
</style>