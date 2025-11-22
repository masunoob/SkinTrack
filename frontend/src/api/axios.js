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
    
    // 画像ファイルを追加（配列の最初の画像を使用）
    if (record.images && record.images.length > 0) {
      const uploadFile = record.images[0]

      // el-uploadのファイル構造: raw プロパティに実際のFileオブジェクトがある
      const imageFile = uploadFile.raw || uploadFile
      
      if (imageFile instanceof File) {
        formData.append('image', imageFile)
      } else {
        console.error('Image is not a File object!')
      }
    }
    
    formData.append('memo', record.memo || '')
    
    // 日付をYYYY-MM-DD形式に変換（より確実な方法）
    let dateStr
    if (record.date instanceof Date) {
      const year = record.date.getFullYear()
      const month = String(record.date.getMonth() + 1).padStart(2, '0')
      const day = String(record.date.getDate()).padStart(2, '0')
      dateStr = `${year}-${month}-${day}`
    } else if (typeof record.date === 'string') {
      dateStr = record.date
    } else {
      dateStr = new Date(record.date).toISOString().split('T')[0]
    }

    formData.append('date', dateStr)
    
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