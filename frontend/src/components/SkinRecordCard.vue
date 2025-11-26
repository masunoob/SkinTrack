<template>
  <div class="card-wrapper">
    <el-card class="skin-record-card">
      <template #header>
        <div class="card-header">
          <span class="date-text">{{ formattedDate }}</span>
        </div>
      </template>
      
      <div class="card-body">
        <img 
          v-if="record.image"
          :src="imageUrl" 
          alt="記録画像" 
          class="card-image"
          @error="handleImageError"
        />
        <div v-else class="card-image-placeholder">
          <el-icon :size="60" class="placeholder-icon"><Picture /></el-icon>
          <span class="placeholder-text">画像なし</span>
        </div>
      </div>
      
      <template #footer>
        <div class="card-footer">
          <p v-if="record.memo" class="memo-text">{{ record.memo }}</p>
          <p v-else class="memo-empty">メモなし</p>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
})

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
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}年${month}月${day}日`
  } catch (error) {
    return props.record.date
  }
})

// エラー画像の参照
const errorImageRef = ref(null)

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
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.skin-record-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-text {
  font-size: 1rem;
  font-weight: 600;
  color: #303133;
}

.card-body {
  width: 100%;
  overflow: hidden;
  padding: 0;
}

.card-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.card-image-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #909399;
  gap: 0.5rem;
}

.placeholder-icon {
  color: #c0c4cc;
}

.placeholder-text {
  font-size: 1rem;
  font-weight: 500;
}

.card-footer {
  padding: 0;
}

.memo-text {
  color: #606266;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}

.memo-empty {
  color: #c0c4cc;
  font-size: 0.875rem;
  margin: 0;
  font-style: italic;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .card-wrapper {
    max-width: 100%;
  }
  
  .skin-record-card {
    border-radius: 8px;
  }
}
</style>

