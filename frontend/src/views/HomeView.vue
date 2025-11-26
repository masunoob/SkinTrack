<template>
  <main class="main-container">
    <h1 class="mb-4 text-2xl font-bold">肌管理アプリ</h1>

    <!-- 記録作成フォーム -->
    <div class="flex justify-center">
      <el-button type="primary" icon="Plus" @click="goToCreateRecord">新規登録</el-button>
    </div>

    <!-- 記録一覧 -->
    <div class="cards-container">
      <SkinRecordCard 
        v-for="record in skinRecordsStore.records" 
        :key="record.id" 
        :record="record"
      />
    </div>

    <!-- 記録が空の場合 -->
    <div v-if="skinRecordsStore.records.length === 0" class="empty-state">
      <el-icon :size="80" class="empty-icon"><DocumentCopy /></el-icon>
      <p class="empty-text">記録がありません</p>
      <p class="empty-subtext">「新規登録」から肌の記録を始めましょう</p>
    </div>

  </main>
</template>

<script setup>
import { useSkinRecordsStore } from '@/stores/skinRecords'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { DocumentCopy } from '@element-plus/icons-vue'
import SkinRecordCard from '@/components/SkinRecordCard.vue'

const skinRecordsStore = useSkinRecordsStore()
const router = useRouter()

const goToCreateRecord = () => {
  router.push('/create')
}

onMounted(() => {
  skinRecordsStore.fetchRecords()
})
</script>

<style scoped>
.cards-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 4rem);
  padding: 2rem 0;
  gap: 1.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  color: #dcdfe6;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #909399;
  margin: 0.5rem 0;
}

.empty-subtext {
  font-size: 0.9375rem;
  color: #c0c4cc;
  margin: 0;
}
</style>