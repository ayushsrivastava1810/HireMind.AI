import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { createOrder, verifyPayment } from '../services/api'

const PLANS = [
  { id:'free', name:'Free', price:'₹0', credits:100, tag:'Default', tagStyle:{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.55)'}, cardStyle:{border:'1px solid rgba(255,255,255,0.09)'}, desc:'Perfect for beginners starting interview preparation.', features:['100 AI Interview Credits','Basic Performance Report','Voice Interview Access','Limited History Tracking'], btn:null },
  { id:'starter', name:'Starter Pack', price:'₹100', credits:150, cardStyle:{border:'1px solid rgba(255,255,255,0.09)'}, desc:'Great for focused practice and skill improvement.', features:['150 AI Interview Credits','Detailed AI Feedback','Performance Analytics','Full Interview History'], btn:'outline' },
  { id:'pro', name:'Pro Pack', price:'₹500', credits:650, tag:'Best Value', tagStyle:{background:'#10b981',color:'#fff'}, cardStyle:{border:'2px solid #10b981',background:'rgba(16,185,129,0.04)'}, desc:'Best value for serious job preparation.', features:['650 AI Interview Credits','Advanced AI Feedback','Skill Trend Analysis','Priority AI Processing'], btn:'filled' },
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
        amount, currency, name: 'HireMind.AI',
        description: `${plan.name} — ${plan.credits} Credits`,
        order_id: orderId,
        handler: async (response) => {
          try { await verifyPayment({ ...response, plan: plan.id }); await refreshUser(); alert(`✅ Payment successful! ${plan.credits} credits added.`); navigate('/dashboard') }
          catch { alert('Payment verification failed.') }
        },
        prefill: { email: user?.email },
        theme: { color: '#10b981' },
      }
      const rzp = new window.Razorpay(options); rzp.open()
    } catch (err) { alert(err.response?.data?.message || 'Payment failed.') }
  }

  return (
    <div className="stars" style={{ minHeight: '100vh', background: '#080b14', paddingBottom: 48 }}>
      <Navbar />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 28px', position: 'relative', zIndex: 1 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 15, cursor: 'pointer', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6 }}>← Back</button>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 8 }}>Choose Your Plan</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.42)', textAlign: 'center', marginBottom: 40 }}>Flexible pricing to match your interview preparation goals.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 36 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: 28, position: 'relative', ...plan.cardStyle }}>
              {plan.tag && <span style={{ position: 'absolute', top: 16, right: 16, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, ...plan.tagStyle }}>{plan.tag}</span>}
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{plan.name}</h2>
              <p style={{ fontSize: 34, fontWeight: 800, color: '#10b981', marginBottom: 4 }}>{plan.price}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.42)', marginBottom: 12 }}>{plan.credits} Credits</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 22, lineHeight: 1.6 }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                    <span style={{ color: '#10b981', fontSize: 16, fontWeight: 700 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              {plan.btn === 'filled' && <button className="btn-green" style={{ width: '100%', padding: '13px 0', fontSize: 15 }} onClick={() => handlePurchase(plan)}>Select Plan</button>}
              {plan.btn === 'outline' && <button className="btn-dark" style={{ width: '100%', padding: '13px 0', fontSize: 15 }} onClick={() => handlePurchase(plan)}>Select Plan</button>}
              {!plan.btn && <div style={{ padding: '13px 0', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.28)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>Current Plan</div>}
            </div>
          ))}
        </div>

        {/* Credit guide */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '22px 26px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Credit Usage Guide</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['Generate Interview Plan','10 credits'],['Download ATS Resume PDF','5 credits'],['Start AI Interview Session','5 credits'],['Download Session PDF Report','Free']].map(([action, cost]) => (
              <div key={action} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(255,255,255,0.5)', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                <span>{action}</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>{cost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
