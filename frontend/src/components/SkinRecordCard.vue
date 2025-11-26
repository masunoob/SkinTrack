<template>
  <div class="card-wrapper">
    <div class="skin-record-card">
      <!-- 画像セクション -->
      <div class="card-image-section">
        <img 
          v-if="record.image"
          :src="imageUrl" 
          alt="記録画像" 
          class="card-image"
          @error="handleImageError"
        />
        <div v-else class="card-image-placeholder">
          <div class="placeholder-content">
            <el-icon :size="80" class="placeholder-icon"><Picture /></el-icon>
            <span class="placeholder-text">画像なし</span>
          </div>
        </div>
        
        <!-- 日付バッジ -->
        <div class="date-badge">
          <el-icon class="date-icon"><Calendar /></el-icon>
          <span>{{ formattedDate }}</span>
        </div>
      </div>
      
      <!-- コンテンツセクション -->
      <div class="card-content">
        <!-- メモセクション -->
        <div v-if="record.memo" class="memo-section">
          <div class="memo-header">
            <el-icon class="memo-icon"><EditPen /></el-icon>
            <span class="memo-label">メモ</span>
          </div>
          <p class="memo-text">{{ truncatedMemo }}</p>
          <button v-if="isLongMemo" class="read-more" @click="toggleMemo">
            {{ isExpanded ? '折りたたむ' : 'もっと見る' }}
          </button>
        </div>
        <div v-else class="memo-section empty">
          <el-icon class="empty-memo-icon"><Document /></el-icon>
          <span class="empty-memo-text">メモなし</span>
        </div>
        
        <!-- メタ情報 -->
        <div class="card-meta">
          <div class="meta-item">
            <el-icon class="meta-icon"><Clock /></el-icon>
            <span class="meta-text">{{ formattedTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Picture, Calendar, EditPen, Document, Clock } from '@element-plus/icons-vue'

const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
})

// メモの展開状態
const isExpanded = ref(false)
const MEMO_MAX_LENGTH = 100

// 画像URLを計算
const imageUrl = computed(() => {
  if (!props.record.image) return ''
  
  const imagePath = props.record.image
  
  // すでに完全なURLの場合はそのまま返す
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // 相対パスの場合はバックエンドのベースURLを追加
  return `http://localhost:8000${imagePath}`
})

// 日付をフォーマット
const formattedDate = computed(() => {
  if (!props.record.date) return ''
  
  try {
    const date = new Date(props.record.date)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${month}/${day}`
  } catch (error) {
    return props.record.date
  }
})

// 時刻をフォーマット
const formattedTime = computed(() => {
  if (!props.record.created_at) return '登録済み'
  
  try {
    const date = new Date(props.record.created_at)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return '今日'
    } else if (diffDays === 1) {
      return '昨日'
    } else if (diffDays < 7) {
      return `${diffDays}日前`
    } else {
      return `${Math.floor(diffDays / 7)}週間前`
    }
  } catch (error) {
    return '登録済み'
  }
})

// メモが長いかどうか
const isLongMemo = computed(() => {
  return props.record.memo && props.record.memo.length > MEMO_MAX_LENGTH
})

// 表示するメモ
const truncatedMemo = computed(() => {
  if (!props.record.memo) return ''
  
  if (isExpanded.value || !isLongMemo.value) {
    return props.record.memo
  }
  
  return props.record.memo.slice(0, MEMO_MAX_LENGTH) + '...'
})

// メモの展開/折りたたみ
const toggleMemo = () => {
  isExpanded.value = !isExpanded.value
}

// 画像読み込みエラー時の処理
const handleImageError = (event) => {
  console.error('Image load error:', event.target.src)
  event.target.src = 'https://placehold.jp/500x500.png?text=画像エラー'
}
</script>

<style scoped>
.card-wrapper {
  width: 100%;
  max-width: 600px;
}

.skin-record-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.skin-record-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 画像セクション */
.card-image-section {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  background: #f8f9fa;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.skin-record-card:hover .card-image {
  transform: scale(1.05);
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e3e9f0 100%);
  position: relative;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.placeholder-icon {
  color: #d1d5db;
  opacity: 0.6;
}

.placeholder-text {
  font-size: 1rem;
  font-weight: 500;
  color: #9ca3af;
  letter-spacing: 0.5px;
}

/* 日付バッジ */
.date-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.date-icon {
  font-size: 1rem;
  color: #6366f1;
}

/* コンテンツセクション */
.card-content {
  padding: 1.5rem;
}

/* メモセクション */
.memo-section {
  margin-bottom: 1rem;
}

.memo-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.memo-icon {
  font-size: 1rem;
  color: #8b5cf6;
}

.memo-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.memo-text {
  color: #374151;
  font-size: 0.9375rem;
  line-height: 1.7;
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}

.read-more {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0;
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.read-more:hover {
  color: #4f46e5;
  text-decoration: underline;
}

.memo-section.empty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #e5e7eb;
}

.empty-memo-icon {
  font-size: 1.25rem;
  color: #d1d5db;
}

.empty-memo-text {
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
}

/* メタ情報 */
.card-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.meta-icon {
  font-size: 0.875rem;
  color: #9ca3af;
}

.meta-text {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
}

/* アニメーション */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skin-record-card {
  animation: fadeIn 0.4s ease-out;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .card-wrapper {
    max-width: 100%;
  }
  
  .skin-record-card {
    border-radius: 16px;
  }
  
  .date-badge {
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
  
  .card-content {
    padding: 1.25rem;
  }
}

/* ダークモード対応（オプション） */
@media (prefers-color-scheme: dark) {
  .skin-record-card {
    background: #1f2937;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .date-badge {
    background: rgba(31, 41, 55, 0.95);
    color: #f9fafb;
  }
  
  .memo-text {
    color: #e5e7eb;
  }
  
  .memo-section.empty {
    background: #374151;
    border-color: #4b5563;
  }
  
  .card-meta {
    border-top-color: #374151;
  }
}
</style>

