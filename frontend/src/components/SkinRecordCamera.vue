<template>
  <el-dialog
    v-model="visible"
    title="カメラで撮影"
    :width="isMobile ? '100%' : '600px'"
    :fullscreen="isMobile"
    :close-on-click-modal="false"
    @closed="handleClose"
    class="camera-dialog"
  >
    <div class="camera-container">
      <!-- カメラプレビュー -->
      <div v-if="!capturedImage" class="camera-preview">
        <video
          ref="videoRef"
          autoplay
          playsinline
          class="video-preview"
        ></video>
        
        <!-- カメラエラー -->
        <div v-if="cameraError" class="camera-error">
          <el-icon :size="60"><Warning /></el-icon>
          <p>{{ cameraError }}</p>
          <el-button type="primary" @click="retryCamera">再試行</el-button>
        </div>
      </div>

      <!-- 撮影済み画像プレビュー -->
      <div v-else class="captured-preview">
        <img :src="capturedImage" alt="撮影画像" class="captured-image" />
      </div>

      <!-- 隠しキャンバス（撮影用） -->
      <canvas ref="canvasRef" style="display: none;"></canvas>
    </div>

    <template #footer>
      <div class="camera-footer">
        <div v-if="!capturedImage" class="capture-controls">
          <el-button @click="handleCancel" size="large">キャンセル</el-button>
          <el-button
            type="primary"
            @click="capturePhoto"
            size="large"
            circle
            class="capture-button"
            :disabled="!isCameraReady"
          >
            <el-icon :size="32"><Camera /></el-icon>
          </el-button>
          <div style="width: 88px;"></div> <!-- スペーサー -->
        </div>

        <div v-else class="confirm-controls">
          <el-button @click="retakePhoto" size="large">再撮影</el-button>
          <el-button type="primary" @click="confirmPhoto" size="large">この写真を使う</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import { Camera, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'capture'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Refs
const videoRef = ref(null)
const canvasRef = ref(null)
const stream = ref(null)
const capturedImage = ref(null)
const cameraError = ref(null)
const isCameraReady = ref(false)

// モバイル判定
const isMobile = ref(window.innerWidth < 768)

// カメラを開始
const startCamera = async () => {
  cameraError.value = null
  isCameraReady.value = false

  try {
    // カメラへのアクセスをリクエスト
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user', // 'user' はフロントカメラ、'environment' はバックカメラ
        width: { ideal: 640, max: 1280 },
        height: { ideal: 640, max: 1280 },
      },
      audio: false,
    })

    stream.value = mediaStream

    // video要素にストリームを設定
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
      
      // ビデオが再生準備完了したら
      videoRef.value.onloadedmetadata = () => {
        isCameraReady.value = true
      }
    }
  } catch (error) {
    console.error('Camera access error:', error)
    
    // エラーメッセージを設定
    if (error.name === 'NotAllowedError') {
      cameraError.value = 'カメラへのアクセスが拒否されました。ブラウザの設定でカメラを許可してください。'
    } else if (error.name === 'NotFoundError') {
      cameraError.value = 'カメラが見つかりません。デバイスにカメラが接続されているか確認してください。'
    } else if (error.name === 'NotReadableError') {
      cameraError.value = 'カメラが他のアプリケーションで使用中です。'
    } else {
      cameraError.value = 'カメラの起動に失敗しました。'
    }
  }
}

// カメラを停止
const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => {
      track.stop()
    })
    stream.value = null
  }
  
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
  
  isCameraReady.value = false
}

// 写真を撮影
const capturePhoto = () => {
  if (!videoRef.value || !canvasRef.value) return

  const video = videoRef.value
  const canvas = canvasRef.value

  // キャンバスのサイズをビデオに合わせる（正方形にトリミング）
  const size = Math.min(video.videoWidth, video.videoHeight)
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')

  // ビデオの中心部分を正方形に切り取る
  const sx = (video.videoWidth - size) / 2
  const sy = (video.videoHeight - size) / 2

  ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size)

  // キャンバスを画像に変換
  capturedImage.value = canvas.toDataURL('image/jpeg', 0.9)

  // カメラを停止
  stopCamera()
}

// 再撮影
const retakePhoto = () => {
  capturedImage.value = null
  startCamera()
}

// 写真を確定
const confirmPhoto = () => {
  if (!capturedImage.value) return

  // Base64をBlobに変換
  fetch(capturedImage.value)
    .then((res) => res.blob())
    .then((blob) => {
      // BlobをFileに変換
      const file = new File([blob], `camera_${Date.now()}.jpg`, {
        type: 'image/jpeg',
      })

      emit('capture', file)
      visible.value = false
    })
    .catch((error) => {
      console.error('Failed to convert image:', error)
      ElMessage.error('画像の変換に失敗しました')
    })
}

// キャンセル
const handleCancel = () => {
  visible.value = false
}

// ダイアログを閉じた時
const handleClose = () => {
  stopCamera()
  capturedImage.value = null
  cameraError.value = null
}

// カメラ再試行
const retryCamera = () => {
  startCamera()
}

// ダイアログが開いた時にカメラを開始
watch(visible, (newValue) => {
  if (newValue) {
    startCamera()
  }
})

// コンポーネント破棄時にカメラを停止
onBeforeUnmount(() => {
  stopCamera()
})
</script>

<style scoped>
.camera-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 70vh; /* 画面の高さの70%まで */
  background: #000;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin: 0 auto;
}

.camera-preview,
.captured-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-preview {
  width: 100%;
  height: 100%;
  object-fit: contain; /* coverからcontainに変更して全体を表示 */
}

.captured-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 撮影した画像も全体を表示 */
}

.camera-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  width: 80%;
  max-width: 400px;
}

.camera-error p {
  margin: 1rem 0;
  font-size: 1rem;
  line-height: 1.5;
}

.camera-footer {
  width: 100%;
}

.capture-controls,
.confirm-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.capture-controls {
  justify-content: center;
}

.capture-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #409eff;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.capture-button:hover {
  transform: scale(1.05);
}

.capture-button:active {
  transform: scale(0.95);
}

.confirm-controls {
  justify-content: space-between;
}

.confirm-controls .el-button {
  flex: 1;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .camera-container {
    border-radius: 0;
    max-height: none; /* モバイルは高さ制限なし */
  }
  
  .capture-button {
    width: 70px;
    height: 70px;
  }
}

/* PC対応 */
@media (min-width: 769px) {
  .camera-container {
    /* PCでは高さを優先して、幅を調整 */
    width: auto;
    max-width: 100%;
  }
}
</style>

