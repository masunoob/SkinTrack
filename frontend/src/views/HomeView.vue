<template>
  <main class="main-container">
    <h1 class="mb-4 text-2xl font-bold">肌管理アプリ</h1>

    <!-- 記録作成フォーム -->
    <div class="flex justify-center">
      <el-button type="primary" icon="Plus" @click="goToCreateRecord">新規登録</el-button>
    </div>

    <!-- 記録一覧 -->
    <div class="cards-container">
      <div v-for="record in skinRecordsStore.records" :key="record.id" class="card-wrapper w-full">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ record.date }}</span>
            </div>
          </template>
          <div class="card-body">
            <img 
              v-if="record.image"
              :src="getImageUrl(record.image)" 
              alt="記録画像" 
              class="card-image"
              @error="handleImageError"
            />
            <div v-else class="card-image-placeholder">
              <span>画像なし</span>
            </div>
          </div>
          <template #footer>
            <div>
              <p class="text-gray-500 text-sm">{{ record.memo }}</p>
            </div>
          </template>
        </el-card>
      </div>
    </div>

  </main>
</template>

<script setup>
import { useSkinRecordsStore } from '@/stores/skinRecords'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const skinRecordsStore = useSkinRecordsStore()

const router = useRouter()

const goToCreateRecord = () => {
  router.push('/create')
}

onMounted(() => {
  skinRecordsStore.fetchRecords()
})

// 画像URLを絶対URLに変換
const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  
  // すでに完全なURLの場合はそのまま返す
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // 相対パスの場合はバックエンドのベースURLを追加
  return `http://localhost:8000${imagePath}`
}

// 画像読み込みエラー時の処理
const handleImageError = (event) => {
  console.error('Image load error:', event.target.src)
  event.target.src = 'https://placehold.jp/500x500.png?text=画像エラー'
}

</script>

<style scoped>
.cards-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 4rem);
  padding: 2rem 0;
  gap: 1rem;
}

.card-wrapper {
  width: 100%;
  max-width: 600px; /* カードの最大幅を統一 */
}

.card-body {
  width: 100%;
  overflow: hidden; /* 画像がはみ出さないように */
}

.card-image {
  width: 100%;
  aspect-ratio: 1 / 1; /* 正方形に統一（必要に応じて変更可能） */
  object-fit: cover; /* 画像をトリミングしてフィット */
  display: block;
}

.card-image-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #999;
  font-size: 1.2rem;
}
</style>