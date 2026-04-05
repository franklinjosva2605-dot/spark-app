import React, { useState } from 'react';
import { supabase } from '../supabase';

const ProfileSetup = ({ session, onComplete }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(session?.user?.user_metadata?.full_name || '');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.from('profiles').insert({
        id: session.user.id,
        username: username.toLowerCase().replace(/\s/g, ''),
        display_name: displayName,
        bio,
        age: parseInt(age),
        avatar_url: session?.user?.user_metadata?.avatar_url || '',
      });
      if (error) throw error;
      onComplete();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const inp = {
    width: '100%', background: '#1a1a2e', border: '1.5px solid #2a2a3e',
    color: '#fff', padding: '16px 18px', borderRadius: 14,
    fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 400, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 4, background: s <= step ? 'linear-gradient(90deg,#ff4d6d,#ff8c32)' : '#1a1a2e', margin: '0 4px', transition: 'all 0.3s' }} />
          ))}
        </div>
        <div style={{ color: '#555', fontSize: 12, textAlign: 'center' }}>Step {step} of 3</div>
      </div>

      <div style={{ width: '100%', maxWidth: 400, background: '#111118', borderRadius: 24, padding: 28 }}>

        {/* Step 1 - Username */}
        {step === 1 && (
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create your username</div>
            <div style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>This is how people will find you on Spark</div>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#ff4d6d', fontSize: 16, fontWeight: 700 }}>@</span>
              <input style={{ ...inp, paddingLeft: 36 }} placeholder="yourname" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))} />
            </div>
            <div style={{ color: '#444', fontSize: 12, marginBottom: 20 }}>Only letters, numbers, dots and underscores</div>
            {error && <div style={{ color: '#ff4d6d', fontSize: 13, marginBottom: 12 }}>{error}</div>}
            <button onClick={() => { if (username.length < 3) { setError('Username must be at least 3 characters'); return; } setError(''); setStep(2); }}
              style={{ width: '100%', padding: 16, background: 'linear-gradient(135deg,#ff4d6d,#ff8c32)', border: 'none', borderRadius: 50, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 - Name & Bio */}
        {step === 2 && (
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Tell us about you</div>
            <div style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Your name and bio appear on your profile</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <input style={inp} placeholder="Display name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
              <textarea style={{ ...inp, minHeight: 100, resize: 'none' }} placeholder="Bio — Tell people about yourself ✨" value={bio} onChange={e => setBio(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: 16, background: '#1a1a2e', border: 'none', borderRadius: 50, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
              <button onClick={() => { if (!displayName) { setError('Please enter your name'); return; } setError(''); setStep(3); }}
                style={{ flex: 2, padding: 16, background: 'linear-gradient(135deg,#ff4d6d,#ff8c32)', border: 'none', borderRadius: 50, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Age */}
        {step === 3 && (
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>How old are you?</div>
            <div style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>You must be 18+ to use Spark</div>
            <input style={{ ...inp, fontSize: 32, textAlign: 'center', fontWeight: 700, marginBottom: 12 }} placeholder="18" type="number" min="18" max="100" value={age} onChange={e => setAge(e.target.value)} />
            {error && <div style={{ color: '#ff4d6d', fontSize: 13, marginBottom: 12 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: 16, background: '#1a1a2e', border: 'none', borderRadius: 50, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
              <button onClick={() => { if (!age || parseInt(age) < 18) { setError('You must be 18 or older'); return; } handleComplete(); }} disabled={loading}
                style={{ flex: 2, padding: 16, background: 'linear-gradient(135deg,#ff4d6d,#ff8c32)', border: 'none', borderRadius: 50, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                {loading ? 'Setting up...' : '🚀 Launch My Profile!'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;