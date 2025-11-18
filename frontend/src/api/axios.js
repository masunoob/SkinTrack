import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// TODO:リクエストインターセプターを追加

export const recordAPI = {
  // 記録一覧取得
  getRecords: () => apiClient.get('/records/'),

  // 記録詳細取得
  getRecord: (id) => apiClient.get(`/records/${id}/`),

  // 記録作成
  createRecord: (record) => {
    const formData = new FormData()
    formData.append('image', record.image)
    formData.append('memo', record.memo)
    formData.append('date', record.date)
    return apiClient.post('/records/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 記事削除
  deleteRecord: (id) => apiClient.delete(`/records/${id}/`),
}

export default apiClient