import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { getAllPlans, getAllSessions } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
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

  const allActivity = [
    ...plans.map(p => ({ ...p, kind: 'plan' })),
    ...sessions.map(s => ({ ...s, kind: 'session' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)

  const bestScore = sessions.length
    ? Math.max(...sessions.map(s => s.overallScore || 0)).toFixed(1)
    : '—'

  const card = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 22,
  }

  return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14', paddingBottom: 40 }}>
      <Navbar />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px', position: 'relative', zIndex: 1 }}>

        {/* Greeting */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Good to see you,</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
            {user?.username} 👋
          </h1>
        </div>

        {/* Main action cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          <div style={{ ...card, border: '1px solid #10b981', background: 'rgba(16,185,129,0.05)', cursor: 'pointer' }}
            onClick={() => navigate('/plan')}>
            <div style={{ fontSize: 26, marginBottom: 12 }}>📋</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Interview Plan</h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', marginBottom: 18, lineHeight: 1.6 }}>
              Upload your resume, paste a job description, get tailored questions, skill gap analysis and an ATS-optimized resume.
            </p>
            <button className="btn-green" style={{ width: '100%', padding: '10px 0', fontSize: 13 }}>
              Create Plan →
            </button>
          </div>

          <div style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/interview')}>
            <div style={{ fontSize: 26, marginBottom: 12 }}>🎙️</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>AI Interview Session</h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', marginBottom: 18, lineHeight: 1.6 }}>
              Live voice interview with a 60s timer per question, real-time AI scoring, confidence and feedback report.
            </p>
            <button className="btn-dark" style={{ width: '100%', padding: '10px 0', fontSize: 13 }}>
              Start Session →
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Plans Generated', value: plans.length },
            { label: 'Sessions Done',   value: sessions.filter(s => s.status === 'completed').length },
            { label: 'Best Score',      value: bestScore, green: true },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px' }}>
              <p style={{ fontSize: 26, fontWeight: 800, color: s.green ? '#10b981' : '#fff', marginBottom: 3 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {[
            { label: '📜 View History',  path: '/history' },
            { label: '💰 Buy Credits',   path: '/pricing' },
          ].map((b, i) => (
            <button key={i} className="btn-dark" style={{ fontSize: 12, padding: '8px 18px' }} onClick={() => navigate(b.path)}>
              {b.label}
            </button>
          ))}
        </div>

        {/* Recent activity */}
        <div style={{ ...card }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Recent Activity</p>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><div className="spinner" /></div>
          ) : allActivity.length === 0 ? (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '20px 0' }}>
              No activity yet. Create your first interview plan!
            </p>
          ) : (
            allActivity.map((item, i) => (
              <div key={i}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < allActivity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer' }}
                onClick={() => navigate(item.kind === 'plan' ? `/plan/${item._id}` : `/report/${item._id}`)}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>
                    {item.title || item.role}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                    {item.kind === 'plan' ? 'Interview Plan' : `AI Session · ${item.mode?.toUpperCase()}`} · {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {item.kind === 'plan' && (
                    <span className="pill pill-pink">{item.matchScore}% match</span>
                  )}
                  {item.kind === 'session' && (
                    <span className={`pill ${item.status === 'completed' ? 'pill-green' : 'pill-amber'}`}>
                      {item.status === 'completed' ? `${item.overallScore}/10` : 'Incomplete'}
                    </span>
                  )}
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>›</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
