import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getTask,
  updateTask,
  deleteTask,
  getTaskHistory,
} from '../services/api'
import styles from './TaskDetail.module.css'

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Не начато' },
  { value: 'in_progress', label: 'В процессе' },
  { value: 'done', label: 'Готово' },
]

const CHANGE_TYPE_LABELS = {
  status: 'Статус',
  progress: 'Прогресс',
}

function formatDate(d) {
  return new Date(d).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [task, setTask] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('not_started')
  const [progress, setProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [taskData, historyData] = await Promise.all([
        getTask(id, token),
        getTaskHistory(id, token),
      ])
      setTask(taskData)
      setHistory(historyData)
      setTitle(taskData.title)
      setDescription(taskData.description ?? '')
      setStatus(taskData.status)
      setProgress(taskData.progress)
    } catch (err) {
      setError(err.response?.status === 404 ? 'Задача не найдена' : err.response?.data?.detail ?? 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id, token])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const updated = await updateTask(
        id,
        { title, description: description || null, status, progress },
        token,
      )
      setTask(updated)
      setEditing(false)
      const historyData = await getTaskHistory(id, token)
      setHistory(historyData)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Не удалось сохранить')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Удалить задачу?')) return
    setDeleting(true)
    setError('')
    try {
      await deleteTask(id, token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Не удалось удалить')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <p className={styles.loading}>Загрузка...</p>
  if (error && !task) return <div className={styles.error}>{error} <Link to="/">К списку</Link></div>
  if (!task) return null

  return (
    <div className={styles.wrap}>
      <Link to="/" className={styles.back}>← К списку задач</Link>

      {!editing ? (
        <div className={styles.view}>
          <div className={styles.head}>
            <h1 className={styles.title}>{task.title}</h1>
            <button type="button" className={styles.editBtn} onClick={() => setEditing(true)}>
              Редактировать
            </button>
          </div>
          {task.description && <p className={styles.desc}>{task.description}</p>}
          <div className={styles.meta}>
            <span className={styles.status}>
              {STATUS_OPTIONS.find(o => o.value === task.status)?.label ?? task.status}
            </span>
            <span className={styles.progress}>{task.progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${task.progress}%` }} />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <label className={styles.label}>
            Название
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Описание
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={styles.textarea}
              rows={3}
            />
          </label>
          <label className={styles.label}>
            Статус
            <select value={status} onChange={e => setStatus(e.target.value)} className={styles.select}>
              {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            Прогресс (0–100%)
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className={styles.range}
            />
            <span className={styles.rangeValue}>{progress}%</span>
          </label>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => setEditing(false)}>
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className={styles.danger}>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Удаление...' : 'Удалить задачу'}
        </button>
      </div>

      <section className={styles.history}>
        <h2 className={styles.historyTitle}>История изменений</h2>
        {history.length === 0 ? (
          <p className={styles.noHistory}>Изменений пока нет.</p>
        ) : (
          <ul className={styles.historyList}>
            {history.map(h => (
              <li key={h.id} className={styles.historyItem}>
                <span className={styles.historyType}>{CHANGE_TYPE_LABELS[h.change_type] ?? h.change_type}</span>
                <span className={styles.historyValues}>
                  {h.old_value != null ? `${h.old_value} → ` : ''}{h.new_value}
                </span>
                <span className={styles.historyDate}>{formatDate(h.changed_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
