import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const FEATURES = [
  { icon: '🤖', color: 'rgba(99,102,241,0.15)', stroke: '#818cf8', title: 'AI Answer Evaluation', desc: 'Scores confidence, communication & technical accuracy in real-time.' },
  { icon: '📄', color: 'rgba(16,185,129,0.12)',  stroke: '#10b981', title: 'Resume Based Interview', desc: 'Project-specific questions generated from your uploaded resume.' },
  { icon: '📊', color: 'rgba(245,158,11,0.12)',  stroke: '#f59e0b', title: 'Downloadable PDF Report', desc: 'Detailed strengths, weaknesses and improvement insights.' },
  { icon: '📈', color: 'rgba(239,68,68,0.1)',    stroke: '#f87171', title: 'History & Analytics', desc: 'Track your progress with performance graphs and topic analysis.' },
  { icon: '🔍', color: 'rgba(16,185,129,0.12)',  stroke: '#10b981', title: 'Skill Gap Detection', desc: 'Instant analysis of missing skills vs job requirements.' },
  { icon: '✍️', color: 'rgba(167,139,250,0.12)', stroke: '#a78bfa', title: 'ATS Resume Generator', desc: 'Download an AI-optimized ATS-friendly resume PDF instantly.' },
]

const STEPS = [
  { step: 'STEP 1', title: 'Role & Experience Selection', desc: 'AI adjusts difficulty based on selected job role.' },
  { step: 'STEP 2', title: 'Smart Voice Interview',       desc: 'Dynamic follow-up questions based on your answers.', active: true },
  { step: 'STEP 3', title: 'Timer Based Simulation',      desc: 'Real interview pressure with time tracking.' },
]

const S = {
  page: { minHeight: '100vh', background: '#080b14', paddingBottom: 40 },
  hero: { textAlign: 'center', padding: '52px 24px 36px', position: 'relative', zIndex: 1 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 18px', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 22 },
  h1: { fontSize: 46, fontWeight: 800, lineHeight: 1.15, color: '#fff', marginBottom: 14, letterSpacing: -0.5 },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.48)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 },
  btns: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  stepsWrap: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, maxWidth: 700, margin: '0 auto 40px', padding: '0 24px', position: 'relative', zIndex: 1 },
  step: (active) => ({ background: active ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.04)', border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '22px 18px', textAlign: 'center' }),
  stepLabel: { fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', marginBottom: 12 },
  stepIcon: (active) => ({ width: 46, height: 46, borderRadius: 12, background: active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', border: active ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 20 }),
  stepTitle: { fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 },
  stepDesc: { fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 },
  featWrap: { padding: '0 24px 40px', maxWidth: 740, margin: '0 auto', position: 'relative', zIndex: 1 },
  featTitle: { fontSize: 24, fontWeight: 800, textAlign: 'center', color: '#fff', marginBottom: 6 },
  featGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  featCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'default', transition: 'border-color 0.15s' },
  featIcon: (color) => ({ width: 38, height: 38, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }),
  featName: { fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 },
  featDesc: { fontSize: 11, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 },
  footer: { textAlign: 'center', padding: '16px 0', position: 'relative', zIndex: 1 },
  footerBox: { display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 24px' },
}

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="stars" style={S.page}>
      <Navbar />
      <div style={S.hero}>
        <div style={S.badge}>
          <span style={{ color: '#10b981', fontSize: 14 }}>✦</span>
          AI Powered Smart Interview Platform
        </div>
        <h1 style={S.h1}>
          Practice Interviews with<br />
          <span style={{ color: '#10b981' }}>AI Intelligence</span>
        </h1>
        <p style={S.sub}>
          Role-based mock interviews with smart follow-ups, adaptive difficulty,
          real-time performance evaluation, ATS resume generation and skill gap detection.
        </p>
        <div style={S.btns}>
          <button className="btn-dark" onClick={() => navigate(user ? '/interview' : '/register')}>
            Start Interview
          </button>
          <button className="btn-dark" onClick={() => navigate(user ? '/plan' : '/register')}>
            Create Interview Plan
          </button>
          {user && (
            <button className="btn-green" onClick={() => navigate('/dashboard')}>
              Go to Dashboard →
            </button>
          )}
        </div>
      </div>

      <div style={S.stepsWrap}>
        {STEPS.map((s, i) => (
          <div key={i} style={S.step(s.active)}>
            <div style={S.stepLabel}>{s.step}</div>
            <div style={S.stepIcon(s.active)}>
              {i === 0 ? '🎯' : i === 1 ? '🎙️' : '⏱️'}
            </div>
            <div style={S.stepTitle}>{s.title}</div>
            <div style={S.stepDesc}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={S.featWrap}>
        <h2 style={S.featTitle}>Advanced AI <span style={{ color: '#10b981' }}>Capabilities</span></h2>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 24 }}>Everything you need to land your dream job</p>
        <div style={S.featGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} style={S.featCard} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
              <div style={S.featIcon(f.color)}>{f.icon}</div>
              <div>
                <div style={S.featName}>{f.title}</div>
                <div style={S.featDesc}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.footer}>
        <div style={S.footerBox}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3" /></svg>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>HireMind.AI</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>AI-powered interview preparation platform designed to improve communication skills, technical depth and professional confidence.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
