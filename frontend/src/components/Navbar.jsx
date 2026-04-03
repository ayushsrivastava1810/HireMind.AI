import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ pinkAccent = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const accent = pinkAccent ? '#e91e8c' : '#10b981'
  const iconBg = pinkAccent ? 'rgba(233,30,140,0.15)' : 'rgba(16,185,129,0.15)'
  const iconBorder = pinkAccent ? 'rgba(233,30,140,0.3)' : 'rgba(16,185,129,0.3)'

  return (
    <nav className="navbar">
      <div className="nav-logo" style={{ cursor: 'pointer' }} onClick={() => navigate(user ? '/dashboard' : '/')}>
        <div className="nav-logo-icon" style={{ background: iconBg, borderColor: iconBorder }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
          </svg>
        </div>
        <span className="nav-logo-text">
          HireMind<span style={{ color: accent }}>.AI</span>
        </span>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <div className="credits-pill">
              <div className="credits-dot" />
              {user.credits ?? 0} credits
            </div>
            <div className="nav-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</div>
            <button className="btn-dark" style={{ padding: '8px 18px', fontSize: '14px' }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', textDecoration: 'none' }}>Login</Link>
            <button className="btn-green" style={{ padding: '9px 22px', fontSize: '14px' }} onClick={() => navigate('/register')}>
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
