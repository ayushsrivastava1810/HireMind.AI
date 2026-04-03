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
      .then(([p, s]) => {
        setPlans(p.data.interviewReports || [])
        setSessions(s.data.sessions || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px', cursor: 'pointer', transition: 'border-color 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

  return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14', paddingBottom: 40 }}>
      <Navbar />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 22, cursor: 'pointer' }}>←</button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>Interview History</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>Track your past interviews and performance reports</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {[['sessions', '🎙️ AI Sessions'], ['plans', '📋 Interview Plans']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: '8px 20px', borderRadius: 20, border: tab === key ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', background: tab === key ? 'rgba(16,185,129,0.12)' : 'transparent', color: tab === key ? '#10b981' : 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: tab === key ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : tab === 'sessions' ? (
          sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>🎙️</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No AI sessions yet.</p>
              <button className="btn-green" style={{ marginTop: 16 }} onClick={() => navigate('/interview')}>Start Your First Session</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sessions.map(s => (
                <div key={s._id} style={card}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  onClick={() => s.status === 'completed' && navigate(`/report/${s._id}`)}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{s.role}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>
                      {s.experience} · {s.mode?.toUpperCase()} Mode · {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                    <span className={`pill ${s.status === 'completed' ? 'pill-green' : 'pill-amber'}`} style={{ fontSize: 11 }}>
                      {s.status === 'completed' ? 'Completed' : 'Incomplete'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 80 }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: s.overallScore >= 7 ? '#10b981' : s.overallScore >= 5 ? '#f59e0b' : '#ef4444' }}>
                      {s.status === 'completed' ? `${s.overallScore.toFixed(1)}/10` : '—'}
                    </p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Overall Score</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          plans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>📋</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No interview plans yet.</p>
              <button className="btn-pink" style={{ marginTop: 16 }} onClick={() => navigate('/plan')}>Create Your First Plan</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plans.map(p => (
                <div key={p._id} style={card}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(233,30,140,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  onClick={() => navigate(`/plan/${p._id}`)}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{p.title}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                    <span className="pill pill-pink" style={{ fontSize: 11 }}>Match Score: {p.matchScore}%</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>›</span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
