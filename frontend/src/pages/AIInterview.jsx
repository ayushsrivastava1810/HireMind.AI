import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { startSession, submitAnswer, completeSession } from '../services/api'

const ROLES = ['Backend Developer','Frontend Developer','Full Stack Developer','Data Scientist','DevOps Engineer','ML Engineer','Mobile Developer','Cloud Engineer']
const EXP   = ['Fresher (0-1 yr)','Junior (1-2 yrs)','Mid-level (2-4 yrs)','Senior (4+ yrs)']

export default function AIInterview() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const fileRef = useRef()
  const timerRef = useRef()
  const recognitionRef = useRef()

  const [phase, setPhase]         = useState('setup')
  const [mode, setMode]           = useState('technical')
  const [role, setRole]           = useState(ROLES[0])
  const [exp, setExp]             = useState(EXP[0])
  const [resumeFile, setResumeFile] = useState(null)
  const [session, setSession]     = useState(null)
  const [currentQ, setCurrentQ]   = useState(0)
  const [answer, setAnswer]       = useState('')
  const [timer, setTimer]         = useState(60)
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [lastEval, setLastEval]   = useState(null)

  // Timer countdown
  useEffect(() => {
    if (phase !== 'interview') return
    clearInterval(timerRef.current)
    setTimer(60)
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 60 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, currentQ])

  const handleStart = async () => {
    setError('')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('role', role)
      fd.append('experience', exp)
      fd.append('mode', mode)
      if (resumeFile) fd.append('resume', resumeFile)
      const res = await startSession(fd)
      setSession(res.data.session)
      await refreshUser()
      setPhase('interview')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start session.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (autoSubmit = false) => {
    const ans = answer.trim()
    if (!ans && !autoSubmit) return
    clearInterval(timerRef.current)
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false) }
    setSubmitting(true)
    try {
      const res = await submitAnswer(session._id, { questionIndex: currentQ, userAnswer: ans || '(No answer provided)' })
      setLastEval(res.data.evaluation)
      setSession(res.data.session)
      setAnswer('')

      if (currentQ + 1 >= session.questions.length) {
        const done = await completeSession(session._id)
        navigate(`/report/${done.data.session._id}`)
      } else {
        setCurrentQ(q => q + 1)
        setLastEval(null)
      }
    } catch {
      setError('Failed to submit answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Voice input requires Chrome browser.'); return }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return }
    const r = new SR()
    r.continuous = true
    r.interimResults = true
    r.onresult = e => {
      const t = Array.from(e.results).map(x => x[0].transcript).join('')
      setAnswer(t)
    }
    r.onend = () => setIsListening(false)
    r.start()
    recognitionRef.current = r
    setIsListening(true)
  }

  const timerPct = timer / 60
  const circumference = 2 * Math.PI * 28
  const timerColor = timer > 30 ? '#10b981' : timer > 10 ? '#f59e0b' : '#ef4444'

  // ── SETUP ────────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="stars" style={{ minHeight: '100vh', background: '#080b14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              Start <span style={{ color: '#10b981' }}>AI Interview</span>
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)' }}>Configure your session and let AI ask the questions</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Mode */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 9 }}>Interview Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['technical','hr'].map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    style={{ padding: '11px 0', borderRadius: 10, border: mode === m ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)', background: mode === m ? 'rgba(16,185,129,0.1)' : 'transparent', color: mode === m ? '#10b981' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: mode === m ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                    {m === 'hr' ? '🤝 HR Interview' : '⚙️ Technical Mode'}
                  </button>
                ))}
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 7 }}>Job Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="dark-input" style={{ cursor: 'pointer' }}>
                {ROLES.map(r => <option key={r} style={{ background: '#1a1f35' }}>{r}</option>)}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 7 }}>Experience Level</label>
              <select value={exp} onChange={e => setExp(e.target.value)} className="dark-input" style={{ cursor: 'pointer' }}>
                {EXP.map(e => <option key={e} style={{ background: '#1a1f35' }}>{e}</option>)}
              </select>
            </div>

            {/* Resume */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 7 }}>Upload Resume <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional — for personalized questions)</span></label>
              <label style={{ display: 'block', border: `1.5px dashed ${resumeFile ? '#10b981' : 'rgba(255,255,255,0.15)'}`, borderRadius: 10, padding: '14px 16px', textAlign: 'center', cursor: 'pointer', background: resumeFile ? 'rgba(16,185,129,0.05)' : 'transparent', transition: 'all 0.15s' }}>
                <input type="file" accept=".pdf" hidden ref={fileRef} onChange={e => setResumeFile(e.target.files[0])} />
                <p style={{ fontSize: 12, color: resumeFile ? '#10b981' : 'rgba(255,255,255,0.4)', fontWeight: resumeFile ? 600 : 400 }}>
                  {resumeFile ? `✓ ${resumeFile.name}` : '📄 Click to upload PDF resume'}
                </p>
              </label>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button className="btn-green" onClick={handleStart} disabled={loading} style={{ width: '100%', padding: '13px 0', fontSize: 14, marginTop: 4 }}>
              {loading ? '⏳ Setting up your interview...' : '🎙️ Start Interview — 5 credits'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── INTERVIEW ─────────────────────────────────────────────────────────────
  const question = session?.questions?.[currentQ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf9 50%, #f8faff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 18, width: '100%', maxWidth: 720 }}>

        {/* Left — avatar + status */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Avatar */}
          <div style={{ width: '100%', aspectRatio: '1', borderRadius: 14, background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, overflow: 'hidden' }}>
            👩‍💼
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 12 }}>
              <span style={{ color: '#9ca3af' }}>Interview Status</span>
              <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="live-dot" style={{ width: 6, height: 6 }} />
                {isListening ? 'Listening' : 'Ready'}
              </span>
            </div>

            {/* Timer circle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{ position: 'relative', width: 72, height: 72 }}>
                <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                  <circle cx="36" cy="36" r="28" fill="none" stroke={timerColor} strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - timerPct)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: timerColor }}>{timer}s</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>{currentQ + 1}</p>
                <p style={{ fontSize: 10, color: '#9ca3af' }}>Current Question</p>
              </div>
              <div style={{ width: 1, background: '#e5e7eb' }} />
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>{session?.questions?.length}</p>
                <p style={{ fontSize: 10, color: '#9ca3af' }}>Total Questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — question + answer */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 18, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>AI Smart Interview</span>
            <span style={{ fontSize: 11, color: '#9ca3af', background: '#f3f4f6', padding: '3px 10px', borderRadius: 20 }}>
              {mode === 'hr' ? 'HR Mode' : 'Technical Mode'}
            </span>
          </div>

          {/* Question */}
          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 7 }}>Question {currentQ + 1} of {session?.questions?.length}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', lineHeight: 1.55 }}>{question}</p>
          </div>

          {/* Last eval feedback */}
          {lastEval && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>Previous: {lastEval.score}/10 — </span>
              <span style={{ color: '#374151' }}>{lastEval.feedback}</span>
            </div>
          )}

          {/* Answer */}
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Your answer will appear here as you speak, or type directly..."
            style={{ flex: 1, minHeight: 160, border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#374151', resize: 'none', fontFamily: 'inherit', outline: 'none', lineHeight: 1.6, background: '#fff' }}
          />

          {error && <div className="form-error" style={{ fontSize: 12 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={toggleVoice}
              style={{ width: 44, height: 44, borderRadius: '50%', background: isListening ? '#ef4444' : '#111827', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, flexShrink: 0, transition: 'background 0.15s', animation: isListening ? 'pulse 1s infinite' : 'none' }}>
              🎤
            </button>
            <button onClick={() => handleSubmit(false)} disabled={submitting || !answer.trim()}
              style={{ flex: 1, background: '#10b981', border: 'none', color: '#fff', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: submitting || !answer.trim() ? 0.6 : 1, transition: 'opacity 0.15s' }}>
              {submitting ? 'Evaluating answer...' : currentQ + 1 === session?.questions?.length ? 'Submit & Finish' : 'Submit Answer →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
