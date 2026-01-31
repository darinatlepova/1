import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Auth
export async function register(email, password) {
  const { data } = await api.post('/auth/register', { email, password })
  return data
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

// Tasks
export async function getTasks(token) {
  setAuthToken(token)
  const { data } = await api.get('/tasks')
  return data
}

export async function getTask(id, token) {
  setAuthToken(token)
  const { data } = await api.get(`/tasks/${id}`)
  return data
}

export async function createTask(task, token) {
  setAuthToken(token)
  const { data } = await api.post('/tasks', task)
  return data
}

export async function updateTask(id, task, token) {
  setAuthToken(token)
  const { data } = await api.put(`/tasks/${id}`, task)
  return data
}

export async function deleteTask(id, token) {
  setAuthToken(token)
  await api.delete(`/tasks/${id}`)
}

export async function getTaskHistory(id, token) {
  setAuthToken(token)
  const { data } = await api.get(`/tasks/${id}/history`)
  return data
}

export default api
