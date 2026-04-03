import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await register({ username, email, password }); navigate('/dashboard') }
    catch (err) { setError(err.response?.data?.message || 'Registration failed.') }
    finally { setLoading(false) }
  }

  return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3" /></svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>Join <span style={{ color: '#10b981' }}>HireMind.AI</span></h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>Start with 100 free credits — no card needed</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: 32 }}>
          {error && <div className="form-error" style={{ marginBottom: 18 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Username</label>
              <input type="text" className="dark-input" placeholder="cooldev123" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Email</label>
              <input type="email" className="dark-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Password</label>
              <input type="password" className="dark-input" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button className="btn-green" type="submit" disabled={loading} style={{ width: '100%', padding: '15px 0', fontSize: 16, marginTop: 4 }}>
              {loading ? 'Creating account...' : 'Create Account — Free'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            Already have an account? <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
