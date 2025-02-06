<template>
  <div class="chat-container">
    <div ref="chatBoxRef" class="chat-box">
      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message-wrapper"
          :class="message.role === 'user' ? 'user-message' : 'ai-message'"
        >
          <div class="head-icon" :style="{ order: message.role === 'user' ? 1 : -1 }">
            <svg-icon :name="message.role === 'user' ? 'me' : 'ai-robot'" class="text-[18px]" />
          </div>
          <div class="message" v-html="renderMessageContent(message.content)" />
        </div>
      </div>
    </div>
    <div class="input-box">
      <textarea
        v-model="userInput"
        class="text"
        placeholder="请输入您的问题..."
        @focus="scrollToBottom"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">发送</button>
    </div>
    <!-- <van-floating-bubble
      v-model:offset="offset"
      :style="{
        opacity: isClickDeleteButton ? 1 : 0.2,
        backgroundColor: isClickDeleteButton ? '#f40' : '#000',
        transition: 'background-color 0.3s linear, opacity 0.4s ease-in-out'
      }"
      axis="xy"
      magnetic="x"
      icon="delete-o"
      @click="cleanMessages"
    /> -->
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, onActivated } from 'vue'
import { io } from 'socket.io-client'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 引入代码高亮样式

let isStreaming = false // 是否正在流式接收数据
let streamingMessage = '' // 当前正在接收的消息
const reconnectAttempts = ref(0) // 记录重连次数
const maxReconnectAttempts = 5 // 最大重连次数
const reconnectInterval = 3000 // 重连间隔时间（毫秒）
let reconnectTimeout = null // 用于存储重连定时器

// const getClientInfo = () => {
//   const width = document.body.getBoundingClientRect().width;
//   return width > 375 ? 375 + 20 : width + 20;
// };

// const isClickDeleteButton = ref(false)
// const offset = ref({ y: 500 })
const chatBoxRef = ref(null)
const isConnected = ref(false)

// 初始化 Markdown-it，并配置代码高亮
const md = new MarkdownIt({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return '' // 如果未指定语言，则返回原始代码
  },
})

const getInitMessages = () => {
  let msg = []
  try {
    const _msg = JSON.parse(localStorage.getItem('__CHAT_MESSAGE__'))
    if (_msg) {
      msg = _msg
    }
  } catch (e) {
    console.log('e', e)
    msg = []
  }
  return msg
}

const setCacheMessages = () => {
  localStorage.setItem('__CHAT_MESSAGE__', JSON.stringify(messages.value))
}

// const cleanMessages = () => {
//   if (isClickDeleteButton.value) {
//     messages.value = []
//     localStorage.setItem('__CHAT_MESSAGE__', JSON.stringify([]))
//   } else {
//     isClickDeleteButton.value = true
//   }

//   setTimeout(() => {
//     isClickDeleteButton.value = false
//   }, 2000)
// }

// WebSocket 初始化
const socket = ref(null)

// 建立连接
const connect = () => {
  if (reconnectAttempts.value > maxReconnectAttempts) {
    console.error('达到最大重连次数，停止重连')
    return
  }

  console.log('尝试连接 WebSocket...')
  // 创建 WebSocket 连接
  socket.value = io('http://localhost:3000/chat') // 请替换为您的 WebSocket 服务地址

  socket.value.on('connect', () => {
    console.log('Socket connected:', socket.value.id)
    reconnectAttempts.value = 0 // 重置重连次数
    isConnected.value = true
  })

  //断开连接
  socket.value.on('disconnect', () => {
    console.log('Socket disconnected')
    isConnected.value = false
  })

  //连接出错
  socket.value.on('error', () => {
    attemptReconnect() // 尝试重连
  })
  socket.value.on('message', (event) => {
    console.log('event', event)
    console.log('Socket messgae')
    // const _data = event.message;
    // const data = JSON.parse(_data)

    // if (data.isStreaming) {
    //   isStreaming = true
    //   streamingMessage = ''
    //   messages.value.push({ role: 'assistant', content: '' })
    // } else if (isStreaming && data.reply) {
    //   streamingMessage += data.reply
    //   messages.value[messages.value.length - 1].content = streamingMessage
    // } else {
    //   isStreaming = false
    // }
  })

  // WebSocket 打开时的回调
}

function attemptReconnect() {
  isConnected.value = false
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
  }
  reconnectAttempts.value += 1
  reconnectTimeout = setTimeout(() => {
    console.log(`第 ${reconnectAttempts.value} 次尝试重连`)
    connect()
  }, reconnectInterval)
}
// 断开连接
function disconnect() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout) // 清除重连定时器
  }
  if (socket.value) {
    socket.value.disconnect()
    socket.value = null // 重置 socket 对象
  }
}
const messages = ref(getInitMessages()) // 聊天记录
const userInput = ref('') // 用户输入内容

watch(
  messages,
  () => {
    if (chatBoxRef.value) {
      chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
    }
    nextTick(setCacheMessages)
  },
  { deep: true, immediate: true },
)

const scrollToBottom = () => {
  if (chatBoxRef.value) {
    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
  }
}

onActivated(() => {
  if (!socket.value) {
    connect()
  }
  scrollToBottom()
})

onMounted(() => {
  connect()
  scrollToBottom()
})

onBeforeUnmount(() => {
  console.log('disconnected')
  disconnect()
})

// 渲染消息内容（支持 Markdown 和普通文本）
const renderMessageContent = (content) => {
  return md.render(content)
}

// 发送消息给后端
const sendMessage = () => {
  if (!userInput.value.trim()) return
  messages.value.push({ role: 'user', content: userInput.value })

  if (socket.value && isConnected.value) {
    console.log('socket.value', socket.value)

    socket.value.emit('message', {
      message: userInput.value,
      sessionId: 'ahd23213',
      userId: 2,
    })
  }

  userInput.value = ''
}
</script>

<style scoped lang="scss">
.chat-container {
  //   height: 100vh;
  height: 100%;
  background-color: #f6f7f9;
  overflow: hidden;

  .chat-box {
    height: calc(100% - 60px);
    box-sizing: border-box;
    padding: 16px;
    overflow-y: auto;
    background-color: #ffffff;
    scroll-behavior: smooth; /* 平滑滚动 */

    .messages {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message-wrapper {
      display: flex;
      gap: 4px;
      .head-icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .message {
        max-width: calc(100% - 40px);
        padding: 5px 16px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.5;
        white-space: pre-wrap;
        word-wrap: break-word;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        overflow: auto;
      }
    }

    .user-message {
      justify-content: flex-end;

      .message {
        background-color: #0084ff;
        color: #ffffff;
        text-align: right;
        border-bottom-right-radius: 4px;
      }
    }

    .ai-message {
      justify-content: flex-start;

      .message {
        background-color: #f1f0f0;
        color: #333333;
        text-align: left;
        border-bottom-left-radius: 4px;

        pre {
          background-color: #f6f8fa;
          padding: 10px;
          border-radius: 6px;
          overflow-x: auto;
        }
      }
    }
  }

  .input-box {
    height: 60px;
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #e5e5e5;
    border-top: 1px solid #e5e5e5;
    padding: 0 10px;
    .text {
      height: 40px;
    }
    button {
      padding: 5px 20px;
      background-color: #0084ff;
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 132, 255, 0.3);
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #006bbf;
    }

    button:active {
      background-color: #0056a3;
    }

    textarea {
      flex: 1;
      padding: 10px;
      border: 1px solid #d5d5d5;
      border-radius: 15px;
      resize: none;
      font-size: 14px;
      background-color: #ffffff;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
      outline: none;
      height: 20px;
    }

    textarea:focus {
      border-color: #0084ff;
      box-shadow: inset 0 1px 4px rgba(0, 132, 255, 0.2);
    }
  }
}
</style>
