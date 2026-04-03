import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const FEATURES = [
  { icon: '🤖', color: 'rgba(99,102,241,0.15)', title: 'AI Answer Evaluation', desc: 'Scores confidence, communication & technical accuracy in real-time.' },
  { icon: '📄', color: 'rgba(16,185,129,0.12)', title: 'Resume Based Interview', desc: 'Project-specific questions generated from your uploaded resume.' },
  { icon: '📊', color: 'rgba(245,158,11,0.12)', title: 'Downloadable PDF Report', desc: 'Detailed strengths, weaknesses and improvement insights.' },
  { icon: '📈', color: 'rgba(239,68,68,0.1)',   title: 'History & Analytics', desc: 'Track your progress with performance graphs and topic analysis.' },
  { icon: '🔍', color: 'rgba(16,185,129,0.12)', title: 'Skill Gap Detection', desc: 'Instant analysis of missing skills vs job requirements.' },
  { icon: '✍️', color: 'rgba(167,139,250,0.12)',title: 'ATS Resume Generator', desc: 'Download an AI-optimized ATS-friendly resume PDF instantly.' },
]

const STEPS = [
  { step: 'STEP 1', emoji: '🎯', title: 'Role & Experience Selection', desc: 'AI adjusts difficulty based on selected job role.' },
  { step: 'STEP 2', emoji: '🎙️', title: 'Smart Voice Interview', desc: 'Dynamic follow-up questions based on your answers.', active: true },
  { step: 'STEP 3', emoji: '⏱️', title: 'Timer Based Simulation', desc: 'Real interview pressure with time tracking.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14', paddingBottom: 60 }}>
      <Navbar />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '70px 24px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '7px 22px', fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 28 }}>
          <span style={{ color: '#10b981', fontSize: 16 }}>✦</span>
          AI Powered Smart Interview Platform
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, color: '#fff', marginBottom: 20, letterSpacing: -1 }}>
          Practice Interviews with<br />
          <span style={{ color: '#10b981' }}>AI Intelligence</span>
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Role-based mock interviews with smart follow-ups, adaptive difficulty,
          real-time performance evaluation, ATS resume generation and skill gap detection.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-dark" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate(user ? '/interview' : '/register')}>
            Start Interview
          </button>
          <button className="btn-dark" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate(user ? '/plan' : '/register')}>
            Create Interview Plan
          </button>
          {user && (
            <button className="btn-green" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate('/dashboard')}>
              Go to Dashboard →
            </button>
          )}
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, maxWidth: 860, margin: '0 auto 56px', padding: '0 28px', position: 'relative', zIndex: 1 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ background: s.active ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.04)', border: s.active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '28px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', letterSpacing: '0.1em', marginBottom: 16 }}>{s.step}</div>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: s.active ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.07)', border: s.active ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>
              {s.emoji}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ padding: '0 28px 56px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: 'center', color: '#fff', marginBottom: 8 }}>
          Advanced AI <span style={{ color: '#10b981' }}>Capabilities</span>
        </h2>
        <p style={{ textAlign: 'center', fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 30 }}>Everything you need to land your dream job</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '22px 20px', display: 'flex', gap: 18, alignItems: 'flex-start', transition: 'border-color 0.15s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer card */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 28px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3" /></svg>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>HireMind.AI</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>AI-powered interview preparation platform</div>
          </div>
        </div>
      </div>
    </div>
  )
}
