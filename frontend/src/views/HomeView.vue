<template>
  <main class="main-container">
    <h1 class="mb-4 text-2xl font-bold">肌管理アプリ</h1>

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
              src="https://placehold.jp/500x500.png" 
              alt="記録画像" 
              class="card-image"
            />
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
import { onMounted } from 'vue'

const skinRecordsStore = useSkinRecordsStore()

onMounted(() => {
  skinRecordsStore.setSampleRecords()
})
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
</style>