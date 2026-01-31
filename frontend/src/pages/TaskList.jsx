import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTasks, createTask } from '../services/api'
import TaskCard from '../components/TaskCard'
import styles from './TaskList.module.css'

const STATUS_LABELS = {
  not_started: 'Не начато',
  in_progress: 'В процессе',
  done: 'Готово',
}

export default function TaskList() {
  const { token } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function loadTasks() {
    setLoading(true)
    setError('')
    try {
      const data = await getTasks(token)
      setTasks(data)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Не удалось загрузить задачи')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [token])

  async function handleCreate(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setSubmitting(true)
    try {
      const task = await createTask({ title: newTitle.trim(), description: newDesc.trim() || null }, token)
      setTasks(prev => [task, ...prev])
      setNewTitle('')
      setNewDesc('')
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Не удалось создать задачу')
    } finally {
      setSubmitting(false)
    }
  }

  function handleDeleted(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h1 className={styles.title}>Мои задачи</h1>
        <button type="button" className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Новая задача'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className={styles.form}>
          <input
            type="text"
            placeholder="Название задачи"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className={styles.input}
            autoFocus
          />
          <textarea
            placeholder="Описание (необязательно)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className={styles.textarea}
            rows={2}
          />
          <button type="submit" className={styles.submit} disabled={submitting || !newTitle.trim()}>
            {submitting ? 'Создание...' : 'Создать'}
          </button>
        </form>
      )}

      {error && <div className={styles.error}>{error}</div>}
      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : tasks.length === 0 ? (
        <p className={styles.empty}>Нет задач. Создайте первую.</p>
      ) : (
        <ul className={styles.list}>
          {tasks.map(task => (
            <li key={task.id}>
              <TaskCard
                task={task}
                statusLabel={STATUS_LABELS[task.status] ?? task.status}
                onDeleted={() => handleDeleted(task.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
