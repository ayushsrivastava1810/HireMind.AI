import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getPlanById, downloadResumePdf } from '../services/api'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { id: 'technical',  label: 'Technical Questions',  icon: '</>' },
  { id: 'behavioral', label: 'Behavioral Questions',  icon: '💬' },
  { id: 'roadmap',    label: 'Road Map',               icon: '🗺️' },
]

function QuestionCard({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: 10, fontWeight: 800, color: '#818cf8', minWidth: 24, paddingTop: 1 }}>Q{index + 1}</span>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, flex: 1 }}>{item.question}</p>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </div>
      {open && (
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 9, padding: '10px 13px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#818cf8', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Intention</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{item.intention}</p>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 9, padding: '10px 13px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#10b981', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Model Answer</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function RoadMapDay({ day }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: '#10b981' }}>Day {day.day}</span>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{day.focus}</h3>
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {day.tasks.map((task, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0, marginTop: 5 }} />
            {task}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PlanReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [report, setReport]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [activeNav, setActiveNav] = useState('technical')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    getPlanById(id)
      .then(r => setReport(r.data.interviewReport))
      .catch(() => navigate('/plan'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDownloadResume = async () => {
    setDownloading(true)
    try {
      const res = await downloadResumePdf(id)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `hiremind_resume_${id}.pdf`; a.click()
      URL.revokeObjectURL(url)
      await refreshUser()
    } catch (err) {
      alert(err.response?.data?.message || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14' }}>
      <Navbar pinkAccent />
      <div className="loading-screen"><div className="spinner" /><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading your interview plan...</p></div>
    </div>
  )

  const scoreColor = report.matchScore >= 80 ? '#10b981' : report.matchScore >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14' }}>
      <Navbar pinkAccent />
      <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 62px)' }}>

        {/* Sidebar nav */}
        <div style={{ width: 220, flexShrink: 0, padding: '24px 0', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', padding: '0 18px', marginBottom: 10 }}>Sections</p>
            {NAV.map(n => (
              <button key={n.id}
                onClick={() => setActiveNav(n.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', background: activeNav === n.id ? 'rgba(129,140,248,0.12)' : 'transparent', borderRight: activeNav === n.id ? '2px solid #818cf8' : '2px solid transparent', border: 'none', color: activeNav === n.id ? '#818cf8' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: activeNav === n.id ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}>
                <span style={{ fontSize: 14 }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>
          <div style={{ padding: '0 14px 20px' }}>
            <button
              onClick={handleDownloadResume}
              disabled={downloading}
              style={{ width: '100%', background: '#e91e8c', border: 'none', color: '#fff', borderRadius: 10, padding: '11px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              {downloading ? '⏳ Generating...' : '★ Download Resume'}
            </button>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 5 }}>Costs 5 credits</p>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
          {activeNav === 'technical' && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Technical Questions</h2>
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 12px', borderRadius: 20, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{report.technicalQuestions.length} questions</span>
              </div>
              {report.technicalQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
            </section>
          )}
          {activeNav === 'behavioral' && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Behavioral Questions</h2>
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 12px', borderRadius: 20, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{report.behavioralQuestions.length} questions</span>
              </div>
              {report.behavioralQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
            </section>
          )}
          {activeNav === 'roadmap' && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Preparation Road Map</h2>
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 12px', borderRadius: 20, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{report.preparationPlan.length}-day plan</span>
              </div>
              {report.preparationPlan.map(day => <RoadMapDay key={day.day} day={day} />)}
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ width: 210, flexShrink: 0, padding: '24px 16px', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Match score */}
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: 12 }}>Match Score</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <div style={{ position: 'relative', width: 90, height: 90 }}>
              <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
                <circle cx="45" cy="45" r="36" fill="none" stroke={scoreColor} strokeWidth="7"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - report.matchScore / 100)}`}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{report.matchScore}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>%</span>
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: scoreColor, marginBottom: 18, fontWeight: 600 }}>
            {report.matchScore >= 80 ? 'Excellent match!' : report.matchScore >= 60 ? 'Strong match for this role' : 'Needs improvement'}
          </p>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />

          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>Skill Gaps</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {report.skillGaps.map((g, i) => (
              <span key={i} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 8, fontWeight: 500,
                background: g.severity === 'high' ? 'rgba(239,68,68,0.12)' : g.severity === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.12)',
                color:      g.severity === 'high' ? '#f87171'              : g.severity === 'medium' ? '#fbbf24'              : '#a5b4fc',
                border:     `1px solid ${g.severity === 'high' ? 'rgba(239,68,68,0.25)' : g.severity === 'medium' ? 'rgba(245,158,11,0.25)' : 'rgba(99,102,241,0.25)'}`,
              }}>{g.skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
