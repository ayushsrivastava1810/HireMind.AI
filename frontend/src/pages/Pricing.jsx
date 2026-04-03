import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { createOrder, verifyPayment } from '../services/api'

const PLANS = [
  {
    id: 'free', name: 'Free', price: '₹0', credits: 100, tag: 'Default',
    tagStyle: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' },
    cardStyle: { border: '1px solid rgba(255,255,255,0.08)' },
    desc: 'Perfect for beginners starting interview preparation.',
    features: ['100 AI Interview Credits','Basic Performance Report','Voice Interview Access','Limited History Tracking'],
    btn: null,
  },
  {
    id: 'starter', name: 'Starter Pack', price: '₹100', credits: 150,
    cardStyle: { border: '1px solid rgba(255,255,255,0.09)' },
    desc: 'Great for focused practice and skill improvement.',
    features: ['150 AI Interview Credits','Detailed AI Feedback','Performance Analytics','Full Interview History'],
    btn: 'outline',
  },
  {
    id: 'pro', name: 'Pro Pack', price: '₹500', credits: 650, tag: 'Best Value',
    tagStyle: { background: '#10b981', color: '#fff' },
    cardStyle: { border: '2px solid #10b981', background: 'rgba(16,185,129,0.04)' },
    desc: 'Best value for serious job preparation.',
    features: ['650 AI Interview Credits','Advanced AI Feedback','Skill Trend Analysis','Priority AI Processing'],
    btn: 'filled',
  },
]

export default function Pricing() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()

  const handlePurchase = async (plan) => {
    if (!user) { navigate('/login'); return }
    try {
      const orderRes = await createOrder(plan.id)
      const { orderId, amount, currency } = orderRes.data
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount, currency,
        name: 'HireMind.AI',
        description: `${plan.name} — ${plan.credits} Credits`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await verifyPayment({ ...response, plan: plan.id })
            await refreshUser()
            alert(`✅ Payment successful! ${plan.credits} credits added to your account.`)
            navigate('/dashboard')
          } catch {
            alert('Payment verification failed. Contact support.')
          }
        },
        prefill: { email: user?.email },
        theme: { color: '#10b981' },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed. Try again.')
    }
  }

  return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14', paddingBottom: 40 }}>
      <Navbar />
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '36px 20px', position: 'relative', zIndex: 1 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back
        </button>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 6 }}>Choose Your Plan</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 36 }}>
          Flexible pricing to match your interview preparation goals.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 18, padding: 24, position: 'relative', ...plan.cardStyle }}>
              {plan.tag && (
                <span style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, ...plan.tagStyle }}>
                  {plan.tag}
                </span>
              )}
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{plan.name}</h2>
              <p style={{ fontSize: 30, fontWeight: 800, color: '#10b981', marginBottom: 2 }}>{plan.price}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{plan.credits} Credits</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 18, lineHeight: 1.55 }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                    <span style={{ color: '#10b981', fontSize: 14, fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.btn === 'filled' && (
                <button className="btn-green" style={{ width: '100%', padding: '11px 0', fontSize: 13 }} onClick={() => handlePurchase(plan)}>
                  Select Plan
                </button>
              )}
              {plan.btn === 'outline' && (
                <button className="btn-dark" style={{ width: '100%', padding: '11px 0', fontSize: 13 }} onClick={() => handlePurchase(plan)}>
                  Select Plan
                </button>
              )}
              {!plan.btn && (
                <div style={{ padding: '11px 0', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  Current Plan {user?.plan === 'free' ? '(Active)' : ''}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 22px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Credit Usage Guide</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['Generate Interview Plan', '10 credits'],
              ['Download ATS Resume PDF', '5 credits'],
              ['Start AI Interview Session', '5 credits'],
              ['Download Session PDF Report', 'Free'],
            ].map(([action, cost]) => (
              <div key={action} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.5)', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span>{action}</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{cost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
