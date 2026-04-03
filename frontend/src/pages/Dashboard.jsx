import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { getAllPlans, getAllSessions } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans]       = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading]   = useState(true)

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

  const completedSessions = sessions.filter(s => s.status === 'completed')
  const bestScore = completedSessions.length ? Math.max(...completedSessions.map(s => s.overallScore || 0)).toFixed(1) : '—'

  return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14', paddingBottom: 48 }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 28px', position: 'relative', zIndex: 1 }}>

        {/* Greeting */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Good to see you,</p>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: '#fff' }}>{user?.username} 👋</h1>
        </div>

        {/* Main action cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
          <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid #10b981', borderRadius: 18, padding: 28, cursor: 'pointer' }} onClick={() => navigate('/plan')}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>📋</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Interview Plan</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 22, lineHeight: 1.6 }}>
              Upload your resume, paste a job description, get tailored questions, skill gap analysis and an ATS-optimized resume.
            </p>
            <button className="btn-green" style={{ width: '100%', padding: '12px 0', fontSize: 15 }}>
              Create Plan →
            </button>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: 28, cursor: 'pointer' }} onClick={() => navigate('/interview')}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>🎙️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>AI Interview Session</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 22, lineHeight: 1.6 }}>
              Live voice interview with a 60s timer per question, real-time AI scoring, and detailed feedback report.
            </p>
            <button className="btn-dark" style={{ width: '100%', padding: '12px 0', fontSize: 15 }}>
              Start Session →
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'Plans Generated', value: plans.length },
            { label: 'Sessions Done',   value: completedSessions.length },
            { label: 'Best Score',      value: bestScore, green: true },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 30, fontWeight: 800, color: s.green ? '#10b981' : '#fff', marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          <button className="btn-dark" style={{ fontSize: 14, padding: '10px 22px' }} onClick={() => navigate('/history')}>📜 View History</button>
          <button className="btn-dark" style={{ fontSize: 14, padding: '10px 22px' }} onClick={() => navigate('/pricing')}>💰 Buy Credits</button>
        </div>

        {/* Recent activity */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 26 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Recent Activity</p>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div>
          ) : allActivity.length === 0 ? (
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '24px 0' }}>No activity yet. Create your first interview plan!</p>
          ) : (
            allActivity.map((item, i) => (
              <div key={i}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < allActivity.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', cursor: 'pointer' }}
                onClick={() => navigate(item.kind === 'plan' ? `/plan/${item._id}` : `/report/${item._id}`)}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{item.title || item.role}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                    {item.kind === 'plan' ? 'Interview Plan' : `AI Session · ${item.mode?.toUpperCase()}`} · {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {item.kind === 'plan' && <span className="pill pill-pink">{item.matchScore}% match</span>}
                  {item.kind === 'session' && (
                    <span className={`pill ${item.status === 'completed' ? 'pill-green' : 'pill-amber'}`}>
                      {item.status === 'completed' ? `${item.overallScore}/10` : 'Incomplete'}
                    </span>
                  )}
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>›</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
