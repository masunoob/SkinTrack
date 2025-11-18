import { ref } from 'vue'
import { defineStore } from 'pinia'
import { recordAPI } from '@/api/axios'

export const useSkinRecordsStore = defineStore('skinRecords', () => {
  // 状態
  const records = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // 記録一覧を取得
  async function fetchRecords() {
    isLoading.value = true
    error.value = null
    try {
      const response = await recordAPI.getRecords()
      records.value = response.data
    } catch (err) {
      error.value = err.message || '記録の取得に失敗しました'
      console.error('Failed to fetch records:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 記録詳細を取得
  async function fetchRecord(id) {
    isLoading.value = true
    error.value = null
    try {
      const response = await recordAPI.getRecord(id)
      records.value = response.data
    } catch (err) {
      error.value = err.message || '記録の取得に失敗しました'
      console.error('Failed to fetch record:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 記録を作成
  async function createRecord(record) {
    isLoading.value = true
    error.value = null
    try {
      const response = await recordAPI.createRecord(record)
      records.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message || '記録の作成に失敗しました'
      console.error('Failed to create record:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 記録を削除
  async function deleteRecord(id) {
    isLoading.value = true
    error.value = null
    try {
      await recordAPI.deleteRecord(id)
      records.value = records.value.filter(record => record.id !== id)
    } catch (err) {
      error.value = err.message || '記録の削除に失敗しました'
      console.error('Failed to delete record:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // サンプル記録を設定
  function setSampleRecords() {
    records.value = [
      {
        id: 1,
        date: '2025-01-01',
        memo: 'テスト記録',
        image: 'https://placehold.jp/150x150.png',
      },
      {
        id: 2,
        date: '2025-01-02',
        memo: 'テスト記録2',
        image: 'https://via.placeholder.com/150',
      },
      {
        id: 3,
        date: '2025-01-03',
        memo: 'テスト記録3',
        image: 'https://via.placeholder.com/150',
      },
    ]
  }

  return {
    records,
    isLoading,
    error,
    fetchRecords,
    fetchRecord,
    createRecord,
    deleteRecord,
    setSampleRecords,
  }
})