import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ pinkAccent = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-logo" style={{ cursor: 'pointer' }} onClick={() => navigate(user ? '/dashboard' : '/')}>
        <div className="nav-logo-icon" style={pinkAccent ? { background: 'rgba(233,30,140,0.15)', borderColor: 'rgba(233,30,140,0.3)' } : {}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={pinkAccent ? '#e91e8c' : '#10b981'} strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
          </svg>
        </div>
        <span className="nav-logo-text">HireMind<span style={{ color: pinkAccent ? '#e91e8c' : '#10b981' }}>.AI</span></span>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <div className="credits-pill">
              <div className="credits-dot" />
              {user.credits ?? 0} credits
            </div>
            <div className="nav-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</div>
            <button className="btn-dark" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }}>Login</Link>
            <button className="btn-green" style={{ padding: '7px 18px', fontSize: '12px' }} onClick={() => navigate('/register')}>
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
