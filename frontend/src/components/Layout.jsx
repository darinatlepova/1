import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { setAuthToken } from '../services/api'
import { useEffect } from 'react'
import styles from './Layout.module.css'

export default function Layout() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const handleLogout = () => {
    logout()
    setAuthToken(null)
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>Task Tracker</Link>
        <div className={styles.userRow}>
          <span className={styles.email}>{user?.email}</span>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
