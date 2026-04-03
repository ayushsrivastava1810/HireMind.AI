import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getAllPlans, getAllSessions } from '../services/api'

export default function History() {
  const navigate = useNavigate()
  const [tab, setTab]         = useState('sessions')
  const [plans, setPlans]     = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllPlans(), getAllSessions()])
      .then(([p, s]) => { setPlans(p.data.interviewReports || []); setSessions(s.data.sessions || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const rowStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.15s', marginBottom: 12 }

  return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14', paddingBottom: 48 }}>
      <Navbar />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 28px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 24, cursor: 'pointer' }}>←</button>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>Interview History</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>Track your past interviews and performance reports</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          {[['sessions','🎙️ AI Sessions'],['plans','📋 Interview Plans']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: '10px 24px', borderRadius: 24, border: tab === key ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', background: tab === key ? 'rgba(16,185,129,0.12)' : 'transparent', color: tab === key ? '#10b981' : 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: tab === key ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
        ) : tab === 'sessions' ? (
          sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>🎙️</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>No AI sessions yet.</p>
              <button className="btn-green" style={{ marginTop: 20 }} onClick={() => navigate('/interview')}>Start Your First Session</button>
            </div>
          ) : sessions.map(s => (
            <div key={s._id} style={rowStyle}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              onClick={() => s.status === 'completed' && navigate(`/report/${s._id}`)}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 5 }}>{s.role}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 8 }}>{s.experience} · {s.mode?.toUpperCase()} Mode · {new Date(s.createdAt).toLocaleDateString()}</p>
                <span className={`pill ${s.status === 'completed' ? 'pill-green' : 'pill-amber'}`}>{s.status === 'completed' ? 'Completed' : 'Incomplete'}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: s.overallScore >= 7 ? '#10b981' : s.overallScore >= 5 ? '#f59e0b' : '#ef4444' }}>
                  {s.status === 'completed' ? `${s.overallScore.toFixed(1)}/10` : '—'}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Overall Score</p>
              </div>
            </div>
          ))
        ) : (
          plans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>📋</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>No interview plans yet.</p>
              <button className="btn-pink" style={{ marginTop: 20 }} onClick={() => navigate('/plan')}>Create Your First Plan</button>
            </div>
          ) : plans.map(p => (
            <div key={p._id} style={rowStyle}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(233,30,140,0.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              onClick={() => navigate(`/plan/${p._id}`)}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 5 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 8 }}>{new Date(p.createdAt).toLocaleDateString()}</p>
                <span className="pill pill-pink">Match Score: {p.matchScore}%</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 24 }}>›</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
