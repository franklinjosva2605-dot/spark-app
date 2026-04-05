import React, { useState, useRef } from 'react';
import { supabase } from '../supabase';

const EditProfile = ({ profile, session, onSave, onClose }) => {
  const [name, setName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatar, setAvatar] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoLoading(true);
    setError('');
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${session.user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      const newUrl = data.publicUrl + '?t=' + Date.now();
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', session.user.id);
      setAvatar(newUrl);
    } catch (e) { setError(e.message); }
    setPhotoLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.from('profiles').update({
        display_name: name,
        bio,
      }).eq('id', session.user.id);
      if (error) throw error;
      onSave();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const inp = {
    width: '100%', background: '#1a1a2e', border: '1.5px solid #2a2a3e',
    color: '#fff', padding: '14px 16px', borderRadius: 12,
    fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 200, display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #1a1a2e' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 22, cursor: 'pointer' }}>←</button>
        <span style={{ fontWeight: 700, fontSize: 17 }}>Edit Profile</span>
        <div style={{ flex: 1 }} />
        <button onClick={handleSave} disabled={loading} style={{ background: 'linear-gradient(90deg,#ff4d6d,#ff8c32)', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 20, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        {/* Photo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <div style={{ background: 'linear-gradient(135deg,#ff4d6d,#ff8c32)', padding: 3, borderRadius: '50%' }}>
              <img
                src={avatar || 'https://i.pravatar.cc/100?img=12'}
                alt=""
                style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #0a0a0f', display: 'block' }}
              />
            </div>
            {photoLoading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}>
                ...
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current.click()} style={{ background: 'none', border: 'none', color: '#ff4d6d', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            {photoLoading ? 'Uploading...' : '📷 Change Photo'}
          </button>
        </div>

        {error && <div style={{ background: '#ff4d6d22', border: '1px solid #ff4d6d', borderRadius: 10, padding: '10px 14px', color: '#ff4d6d', fontSize: 13 }}>{error}</div>}

        <div>
          <div style={{ color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Display Name</div>
          <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>

        <div>
          <div style={{ color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Bio</div>
          <textarea style={{ ...inp, minHeight: 100, resize: 'none' }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell people about yourself ✨" />
        </div>

        <div style={{ background: '#111118', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ color: '#888', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Username</div>
          <div style={{ color: '#ff4d6d', fontWeight: 600 }}>@{profile?.username}</div>
          <div style={{ color: '#444', fontSize: 11, marginTop: 4 }}>Username cannot be changed</div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;