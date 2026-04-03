import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getSession, downloadSessionPdf } from '../services/api'

export default function SessionReport() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dlLoading, setDlLoading] = useState(false)

  useEffect(() => {
    getSession(id)
      .then(r => setSession(r.data.session))
      .catch(() => navigate('/history'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDownload = async () => {
    setDlLoading(true)
    try {
      const res = await downloadSessionPdf(id)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a'); a.href = url; a.download = `hiremind_report_${id}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch { alert('Download failed') }
    finally { setDlLoading(false) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ borderTopColor: '#10b981', borderColor: '#e5e7eb' }} />
    </div>
  )

  const { overallScore, confidence, communication, correctness, performanceTrend = [], answers = [], role, mode } = session

  const scoreColor = s => s >= 8 ? '#10b981' : s >= 6 ? '#f59e0b' : '#ef4444'
  const circumference = 2 * Math.PI * 32
  const verdict = overallScore >= 8 ? 'Excellent performance! You are ready.' : overallScore >= 6 ? 'Needs minor improvement before interviews.' : 'Needs significant practice before interviews.'
  const hint = overallScore >= 8 ? 'Outstanding! Polish the details.' : overallScore >= 6 ? 'Good foundation, refine articulation.' : 'Focus on technical depth and clarity.'

  // Trend chart points
  const trendH = 80
  const trendW = 280
  const pts = performanceTrend.length > 1
    ? performanceTrend.map((v, i) => {
        const x = (i / (performanceTrend.length - 1)) * trendW
        const y = trendH - (v / 10) * trendH
        return `${x},${y}`
      }).join(' ')
    : null

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 20 }}>←</button>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>Interview Analytics Dashboard</h1>
            <p style={{ fontSize: 11, color: '#9ca3af' }}>AI-powered performance insights · {role} · {mode?.toUpperCase()}</p>
          </div>
        </div>
        <button onClick={handleDownload} disabled={dlLoading}
          style={{ background: '#10b981', border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {dlLoading ? 'Generating...' : '⬇ Download PDF'}
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>

        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 16, marginBottom: 18 }}>

          {/* Overall performance */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginBottom: 14 }}>Overall Performance</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{ position: 'relative', width: 80, height: 80 }}>
                <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#f3f4f6" strokeWidth="7" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor(overallScore)} strokeWidth="7"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={`${circumference * (1 - overallScore / 10)}`}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>{overallScore.toFixed(1)}</span>
                  <span style={{ fontSize: 9, color: '#9ca3af' }}>Out of 10</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: 3 }}>{verdict}</p>
            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginBottom: 18 }}>{hint}</p>

            {/* Skill bars */}
            {[['Confidence', confidence], ['Communication', communication], ['Correctness', correctness]].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: '#6b7280' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{val.toFixed(1)}</span>
                </div>
                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${val * 10}%`, background: scoreColor(val), borderRadius: 3, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Trend chart */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Performance Trend</p>
            {pts ? (
              <svg viewBox={`0 0 ${trendW} ${trendH + 20}`} style={{ width: '100%' }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 25, 50, 75, 100].map(p => (
                  <line key={p} x1="0" y1={trendH - (p / 100) * trendH} x2={trendW} y2={trendH - (p / 100) * trendH}
                    stroke="#f3f4f6" strokeWidth="1" />
                ))}
                <polyline points={pts + ` ${trendW},${trendH} 0,${trendH}`} fill="url(#trendGrad)" stroke="none" />
                <polyline points={pts} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
                {performanceTrend.map((v, i) => {
                  const x = (i / (performanceTrend.length - 1)) * trendW
                  const y = trendH - (v / 10) * trendH
                  return <circle key={i} cx={x} cy={y} r="4" fill="#10b981" />
                })}
                {performanceTrend.map((_, i) => (
                  <text key={i} x={(i / (performanceTrend.length - 1)) * trendW} y={trendH + 16} fontSize="9" fill="#9ca3af" textAnchor="middle">Q{i + 1}</text>
                ))}
              </svg>
            ) : (
              <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '30px 0' }}>Not enough data for trend</p>
            )}
          </div>
        </div>

        {/* Question breakdown */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginBottom: 16 }}>Question Breakdown</h2>
          {answers.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>No answers recorded.</p>
          ) : (
            answers.map((a, i) => (
              <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>Question {i + 1}</span>
                  <span style={{ background: scoreColor(a.score) === '#10b981' ? '#d1fae5' : scoreColor(a.score) === '#f59e0b' ? '#fef3c7' : '#fee2e2', color: scoreColor(a.score) === '#10b981' ? '#065f46' : scoreColor(a.score) === '#f59e0b' ? '#92400e' : '#991b1b', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                    {a.score}/10
                  </span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10, lineHeight: 1.5 }}>{a.question}</p>
                {a.userAnswer && (
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 10, lineHeight: 1.5, background: '#f9fafb', padding: '8px 12px', borderRadius: 8 }}>
                    <strong style={{ color: '#374151' }}>Your answer: </strong>{a.userAnswer}
                  </p>
                )}
                <div style={{ background: '#f0fdf4', borderRadius: 9, padding: '10px 13px' }}>
                  <p style={{ fontSize: 10, color: '#10b981', fontWeight: 700, marginBottom: 4 }}>AI Feedback</p>
                  <p style={{ fontSize: 12, color: '#374151' }}>{a.feedback}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
