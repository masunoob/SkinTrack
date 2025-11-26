<template>
  <div class="create-view">
    <!-- ヘッダー -->
    <header class="header">
      <el-button text @click="handleBack" class="back-button">
        <el-icon :size="20"><ArrowLeft /></el-icon>
      </el-button>
      <h1 class="header-title">肌記録登録</h1>
      <el-button 
        type="primary" 
        text 
        @click="handleSubmit"
        :disabled="!canSubmit"
        class="submit-button"
      >
        完了
      </el-button>
    </header>

    <!-- カメラ/画像プレビューエリア -->
    <div class="image-section" @click="handleImageAreaClick">
      <div v-if="previewImage" class="preview-container">
        <img :src="previewImage" alt="プレビュー" class="preview-image" />
        <div class="image-overlay">
          <el-button circle size="large" @click.stop="removeImage">
            <el-icon :size="24"><Close /></el-icon>
          </el-button>
        </div>
      </div>
      <div v-else class="camera-placeholder">
        <el-icon :size="80" class="camera-icon"><Camera /></el-icon>
        <p class="placeholder-text">写真を追加</p>
        <p class="placeholder-subtext">タップして写真を選択</p>
      </div>
    </div>

    <!-- 隠しファイル入力 -->
    <input 
      ref="fileInputRef" 
      type="file" 
      accept="image/*" 
      style="display: none" 
      @change="handleFileSelect"
      capture="environment"
    />

    <!-- アクションボタン -->
    <div class="action-buttons">
      <el-button size="large" class="action-btn" @click="openCamera">
        <el-icon><Camera /></el-icon>
        <span>カメラで撮影</span>
      </el-button>
      <el-button size="large" class="action-btn" @click="selectFile">
        <el-icon><Folder /></el-icon>
        <span>ファイル選択</span>
      </el-button>
    </div>

    <!-- 日付選択 -->
    <div class="form-section date-section">
      <div class="section-label">
        <el-icon><Calendar /></el-icon>
        <span>記録日</span>
      </div>
      <el-date-picker 
        v-model="form.date" 
        type="date" 
        placeholder="日付を選択"
        format="YYYY年MM月DD日"
        value-format="YYYY-MM-DD"
        style="width: 100%"
      />
    </div>

    <!-- メモ入力 -->
    <div class="form-section memo-section">
      <div class="section-label">
        <el-icon><EditPen /></el-icon>
        <span>メモ</span>
      </div>
      <el-input 
        v-model="form.memo" 
        type="textarea" 
        :rows="5"
        placeholder="今日の肌の状態を記録..."
        maxlength="500"
        show-word-limit
        resize="none"
      />
    </div>

    <!-- ローディングオーバーレイ -->
    <el-overlay v-model="isLoading" class="loading-overlay">
      <div class="loading-content">
        <el-icon class="is-loading" :size="40"><Loading /></el-icon>
        <p>登録中...</p>
      </div>
    </el-overlay>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSkinRecordsStore } from '@/stores/skinRecords'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Camera, 
  Folder, 
  Calendar, 
  EditPen, 
  Close,
  Loading
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const skinRecordsStore = useSkinRecordsStore()
const router = useRouter()

// フォームデータ
const form = ref({
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD形式
  memo: '',
})

// 画像関連
const previewImage = ref('')
const selectedFile = ref(null)
const fileInputRef = ref(null)
const isLoading = ref(false)

// 送信可能かどうか
const canSubmit = computed(() => {
  return form.value.date && selectedFile.value
})

// 戻るボタン
const handleBack = () => {
  if (selectedFile.value || form.value.memo) {
    ElMessageBox.confirm(
      '入力した内容が失われますが、よろしいですか？',
      '確認',
      {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }
    ).then(() => {
      router.back()
    }).catch(() => {
      // キャンセル時は何もしない
    })
  } else {
    router.back()
  }
}

// 画像エリアクリック
const handleImageAreaClick = () => {
  if (!previewImage.value) {
    selectFile()
  }
}

// カメラを開く（モバイルの場合はカメラが起動）
const openCamera = () => {
  if (fileInputRef.value) {
    fileInputRef.value.setAttribute('capture', 'environment')
    fileInputRef.value.click()
  }
}

// ファイル選択
const selectFile = () => {
  if (fileInputRef.value) {
    fileInputRef.value.removeAttribute('capture')
    fileInputRef.value.click()
  }
}

// ファイル選択時の処理
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 画像ファイルかチェック
  if (!file.type.startsWith('image/')) {
    ElMessage.error('画像ファイルを選択してください')
    return
  }

  // ファイルサイズチェック（10MB以下）
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('ファイルサイズは10MB以下にしてください')
    return
  }

  selectedFile.value = file

  // プレビュー画像を生成
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)

  // input要素をリセット（同じファイルを再選択できるように）
  event.target.value = ''
}

// 画像を削除
const removeImage = () => {
  previewImage.value = ''
  selectedFile.value = null
}

// フォーム送信
const handleSubmit = async () => {
  if (!canSubmit.value) {
    ElMessage.warning('画像を選択してください')
    return
  }

  isLoading.value = true

  try {
    // FormDataを作成
    const formData = new FormData()
    formData.append('date', form.value.date)
    formData.append('memo', form.value.memo)
    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    // API呼び出し
    await skinRecordsStore.createRecord({
      date: form.value.date,
      memo: form.value.memo,
      images: [{ raw: selectedFile.value }]
    })

    ElMessage.success('記録を登録しました')
    
    // 一覧を再取得
    await skinRecordsStore.fetchRecords()
    
    // ホームに戻る
    router.push('/')
  } catch (error) {
    console.error('Failed to create record:', error)
    ElMessage.error('登録に失敗しました: ' + (error.response?.data?.detail || error.message))
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.create-view {
  min-height: 100vh;
  background: #fafafa;
  padding-bottom: 2rem;
}

/* ヘッダー */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
}

.back-button, .submit-button {
  font-size: 1rem;
  font-weight: 500;
}

.submit-button {
  color: #409eff;
}

.submit-button:disabled {
  color: #c0c4cc;
}

/* 画像セクション */
.image-section {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.preview-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
}

.image-overlay .el-button {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
}

.image-overlay .el-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.camera-placeholder {
  text-align: center;
  color: #909399;
  padding: 2rem;
}

.camera-icon {
  margin-bottom: 1rem;
  color: #c0c4cc;
}

.placeholder-text {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0.5rem 0;
  color: #606266;
}

.placeholder-subtext {
  font-size: 0.875rem;
  color: #909399;
  margin: 0;
}

/* アクションボタン */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  margin-top: 0.5rem;
}

.action-btn {
  flex: 1;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  border-radius: 8px;
}

/* フォームセクション */
.form-section {
  padding: 1rem;
  background: white;
  margin-top: 0.5rem;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #606266;
}

.section-label .el-icon {
  color: #909399;
}

/* ローディング */
.loading-overlay {
  backdrop-filter: blur(4px);
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-content p {
  margin-top: 1rem;
  font-size: 1rem;
}

/* レスポンシブ対応 */
@media (min-width: 768px) {
  .create-view {
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
}
</style>