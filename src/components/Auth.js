import React, { useState } from 'react';
import { supabase } from '../supabase';

const Auth = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email to confirm your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin();
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handlePhoneSend = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setStep('otp');
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handlePhoneVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
      if (error) throw error;
      onLogin();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const inp = { background: '#1a1a2e', border: '1px solid #333', color: '#fff', padding: '14px 16px', borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none', width: '100%' };
  const btn = { width: '100%', padding: '14px', border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: 10 };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, maxWidth: 430, margin: '0 auto' }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, background: 'linear-gradient(90deg, #ff4d6d, #ff8c32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>✦ Spark</div>
      <div style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>Dating meets Social Media</div>

      <div style={{ width: '100%', background: '#111118', borderRadius: 20, padding: 24 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['login', 'signup', 'phone'].map(m => (
            <button key={m} onClick={() => { setMode(m); setStep('input'); setError(''); setMessage(''); }}
              style={{ ...btn, marginBottom: 0, flex: 1, background: mode === m ? 'linear-gradient(90deg,#ff4d6d,#ff8c32)' : '#1a1a2e', color: '#fff', fontSize: 12, padding: '10px 4px' }}>
              {m === 'login' ? '📧 Login' : m === 'signup' ? '✨ Sign Up' : '📱 Phone'}
            </button>
          ))}
        </div>

        {error && <div style={{ background: '#ff4d6d22', border: '1px solid #ff4d6d', borderRadius: 10, padding: '10px 14px', color: '#ff4d6d', fontSize: 13, marginBottom: 14 }}>{error}</div>}
        {message && <div style={{ background: '#4ecdc422', border: '1px solid #4ecdc4', borderRadius: 10, padding: '10px 14px', color: '#4ecdc4', fontSize: 13, marginBottom: 14 }}>{message}</div>}

        {(mode === 'login' || mode === 'signup') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input style={inp} placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} type="email" />
            <input style={inp} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
            <button style={{ ...btn, background: 'linear-gradient(90deg,#ff4d6d,#ff8c32)', color: '#fff' }} onClick={handleEmailAuth} disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
            <div style={{ textAlign: 'center', color: '#444', fontSize: 12, margin: '4px 0' }}>— or —</div>
            <button style={{ ...btn, background: '#fff', color: '#333' }} onClick={handleGoogle}>🔵 Continue with Google</button>
          </div>
        )}

        {mode === 'phone' && step === 'input' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input style={inp} placeholder="+1234567890 (with country code)" value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
            <button style={{ ...btn, background: 'linear-gradient(90deg,#ff4d6d,#ff8c32)', color: '#fff' }} onClick={handlePhoneSend} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {mode === 'phone' && step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ color: '#aaa', fontSize: 13, textAlign: 'center' }}>Enter the OTP sent to {phone}</div>
            <input style={inp} placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} type="number" />
            <button style={{ ...btn, background: 'linear-gradient(90deg,#ff4d6d,#ff8c32)', color: '#fff' }} onClick={handlePhoneVerify} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;