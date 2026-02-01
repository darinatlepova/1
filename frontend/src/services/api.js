import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// ---------- AUTH ----------
export async function register(email, password) {
  const { data } = await api.post('/auth/register', { email, password })
  return data
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

// ---------- TASKS ----------
export async function getTasks() {
  const { data } = await api.get('/tasks')
  return data
}

export async function getTask(id) {
  const { data } = await api.get(`/tasks/${id}`)
  return data
}

export async function createTask(task) {
  const { data } = await api.post('/tasks', task)
  return data
}

export async function updateTask(id, task) {
  const { data } = await api.put(`/tasks/${id}`, task)
  return data
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`)
}

export async function getTaskHistory(id) {
  const { data } = await api.get(`/tasks/${id}/history`)
  return data
}

export default api
