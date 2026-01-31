import { Link } from 'react-router-dom'
import styles from './TaskCard.module.css'

export default function TaskCard({ task, statusLabel, onDeleted }) {
  return (
    <article className={styles.card}>
      <Link to={`/task/${task.id}`} className={styles.link}>
        <h3 className={styles.title}>{task.title}</h3>
        {task.description && <p className={styles.desc}>{task.description}</p>}
        <div className={styles.meta}>
          <span className={styles.status}>{statusLabel}</span>
          <span className={styles.progress}>{task.progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${task.progress}%` }} />
        </div>
      </Link>
    </article>
  )
}
