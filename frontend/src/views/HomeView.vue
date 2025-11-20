<template>
  <main class="main-container">
    <h1 class="mb-4 text-2xl font-bold">肌管理アプリ</h1>

    <!-- 記録作成フォーム -->
    <div class="flex justify-center">
      <el-button type="primary" icon="Plus" @click="isCreateModalVisible = true">新規登録</el-button>
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

    <!-- 記録作成モーダル -->
    <el-dialog v-model="isCreateModalVisible" title="肌記録登録" width="500px">
      <el-form :model="createForm" label-width="auto">
        <el-form-item label="記録日">
          <el-date-picker v-model="createForm.date" type="date" placeholder="記録日を選択" />
        </el-form-item>
        <el-form-item label="画像">
          <el-upload 
            v-model:file-list="createForm.images"
            drag
            :auto-upload="false"
            multiple
            :on-change="handleImageChange"
            style="width:100%;"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="メモ">
          <el-input v-model="createForm.memo" type="textarea" placeholder="メモを入力" style="width:100%;"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isCreateModalVisible = false">キャンセル</el-button>
        <el-button type="primary" @click="handleCreateButtonClick">作成</el-button>
      </template>
    </el-dialog>

  </main>
</template>

<script setup>
import { useSkinRecordsStore } from '@/stores/skinRecords'
import { onMounted, ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

const skinRecordsStore = useSkinRecordsStore()
const isCreateModalVisible = ref(false)
const createForm = ref({
  date: new Date(),
  memo: '',
  images: [],
})

onMounted(() => {
  skinRecordsStore.setSampleRecords()
})

const handleCreateButtonClick = () => {

  console.log(createForm.value)

  isCreateModalVisible.value = false

  // TODO: 登録処理を追加
  // skinRecordsStore.createRecord(createForm.value)
  
  createForm.value = {
    date: new Date(),
    memo: '',
    images: [],
  }
}

const handleImageChange = (file, fileList) => {
  createForm.value.images = fileList
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
</style>