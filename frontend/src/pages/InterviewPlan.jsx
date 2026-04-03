import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { generatePlan, getAllPlans } from '../services/api'
import { useEffect } from 'react'

export default function InterviewPlan() {
  const navigate  = useNavigate()
  const { user, refreshUser } = useAuth()
  const fileRef   = useRef()
  const [jd, setJd]           = useState('')
  const [self, setSelf]       = useState('')
  const [file, setFile]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [recent, setRecent]   = useState([])
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    getAllPlans().then(r => setRecent(r.data.interviewReports || [])).catch(() => {})
  }, [])

  const handleGenerate = async () => {
    if (!jd.trim()) { setError('Job description is required'); return }
    if (!file && !self.trim()) { setError('Please upload a resume or enter a self description'); return }
    setError('')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('jobDescription', jd)
      if (self) fd.append('selfDescription', self)
      if (file) fd.append('resume', file)
      const res = await generatePlan(fd)
      await refreshUser()
      navigate(`/plan/${res.data.interviewReport._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate plan. Try again.')
      setLoading(false)
    }
  }

  const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: 20 }

  return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14', paddingBottom: 40 }}>
      <Navbar pinkAccent />
      <div style={{ textAlign: 'center', padding: '36px 24px 24px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          Create Your Custom <span style={{ color: '#e91e8c' }}>Interview Plan</span>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 20, position: 'relative', zIndex: 1 }}>
          <div className="spinner" style={{ width: 48, height: 48, borderTopColor: '#e91e8c' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>✦ Generating your personalized interview strategy... ~30s</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 800, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
            {/* Left — JD */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 16 }}>💼</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Target Job Description</span>
                <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>REQUIRED</span>
              </div>
              <textarea
                className="dark-input"
                rows={10}
                placeholder={"Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"}
                value={jd}
                onChange={e => { setJd(e.target.value); setCharCount(e.target.value.length) }}
                maxLength={5000}
                style={{ borderColor: jd ? 'rgba(233,30,140,0.4)' : undefined }}
              />
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'right', marginTop: 6 }}>{charCount} / 5000 chars</p>
            </div>

            {/* Right — Profile */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 16 }}>👤</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Your Profile</span>
              </div>

              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                Upload Resume
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}>BEST RESULTS</span>
              </div>

              <label style={{ display: 'block', border: `1.5px dashed ${file ? '#e91e8c' : 'rgba(233,30,140,0.35)'}`, borderRadius: 10, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', marginBottom: 14, transition: 'border-color 0.15s', background: file ? 'rgba(233,30,140,0.05)' : 'transparent' }}>
                <input type="file" accept=".pdf" hidden ref={fileRef} onChange={e => setFile(e.target.files[0])} />
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(233,30,140,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#e91e8c', fontSize: 16 }}>↑</div>
                <p style={{ fontSize: 12, color: file ? '#e91e8c' : 'rgba(255,255,255,0.55)', fontWeight: file ? 600 : 400 }}>
                  {file ? `✓ ${file.name}` : 'Click to upload or drag & drop'}
                </p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>PDF only · Max 5MB</p>
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 7 }}>Quick Self-Description</p>
              <textarea
                className="dark-input"
                rows={4}
                placeholder="Briefly describe your experience, key skills, years of experience..."
                value={self}
                onChange={e => setSelf(e.target.value)}
              />

              <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, padding: '9px 12px', fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                Either a <span style={{ color: '#e91e8c', fontWeight: 600 }}>Resume</span> or a <span style={{ color: '#e91e8c', fontWeight: 600 }}>Self Description</span> is required to generate a personalized plan.
              </div>
            </div>
          </div>

          {error && (
            <div style={{ maxWidth: 800, margin: '12px auto 0', padding: '0 20px', position: 'relative', zIndex: 1 }}>
              <div className="form-error">{error}</div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 800, margin: '14px auto 0', padding: '0 20px', position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
              ✦ AI-Powered · Approx 30s · Costs 10 credits
            </span>
            <button className="btn-pink" onClick={handleGenerate} disabled={loading}>
              ★ Generate My Interview Strategy
            </button>
          </div>

          {/* Recent plans */}
          {recent.length > 0 && (
            <div style={{ maxWidth: 800, margin: '28px auto 0', padding: '0 20px', position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>My Recent Interview Plans</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recent.slice(0, 4).map(r => (
                  <div key={r._id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => navigate(`/plan/${r._id}`)}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{r.title}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Generated on {new Date(r.createdAt).toLocaleDateString()}</p>
                      <p style={{ fontSize: 12, color: '#e91e8c', marginTop: 3, fontWeight: 600 }}>Match Score: {r.matchScore}%</p>
                    </div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '5px 12px' }}>View →</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
