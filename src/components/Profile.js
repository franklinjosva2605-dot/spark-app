import React, { useState } from 'react';
import EditProfile from './EditProfile';

const Profile = ({ likedUsers, posts, session, profile, onLogout }) => {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      {/* Cover / Banner */}
      <div style={{ height: 190, background: 'linear-gradient(135deg, #ff4d6d44, #ff8c3222)', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0 20px 16px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, #ff4d6d22, transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, #ff8c3211, transparent 50%)' }} />
        <div style={{ background: 'linear-gradient(135deg,#ff4d6d,#ff8c32)', padding: 3, borderRadius: '50%', position: 'relative', zIndex: 1 }}>
          <img
            src={profile?.avatar_url || 'https://i.pravatar.cc/100?img=12'}
            alt="profile"
            style={{ width: 82, height: 82, borderRadius: '50%', border: '3px solid #0a0a0f', display: 'block', objectFit: 'cover' }}
          />
        </div>
        <div style={{ marginLeft: 14, position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800 }}>
            {profile?.display_name || 'You'}
          </div>
          <div style={{ fontSize: 13, color: '#ff4d6d', fontWeight: 600 }}>
            @{profile?.username || 'username'}
          </div>
          <div style={{ fontSize: 13, color: '#aaa', marginTop: 2 }}>
            {profile?.bio || 'Just joined Spark ✨'}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Stats */}
        <div style={{ display: 'flex', background: '#111118', borderRadius: 14, padding: '14px 0', marginBottom: 18, textAlign: 'center' }}>
          {[['Posts', posts.length], ['Followers', 0], ['Matches', likedUsers.length]].map(([k, v], idx, arr) => (
            <div key={k} style={{ flex: 1, borderRight: idx < arr.length - 1 ? '1px solid #1a1a2e' : 'none' }}>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{v}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{k}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <button
          onClick={() => setEditing(true)}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(90deg, #ff4d6d, #ff8c32)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 600, borderRadius: 50, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
          ✦ Edit Profile
        </button>
        <button style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid #ff4d6d', color: '#ff4d6d', fontSize: 15, fontWeight: 600, borderRadius: 50, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          + Upload Video
        </button>

        {/* Matches Section */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Your Matches ✦</div>
          {likedUsers.length === 0 ? (
            <div style={{ color: '#444', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔥</div>
              Start swiping to find your matches!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {likedUsers.map((u, i) => (
                <div key={i} style={{ background: '#111118', borderRadius: 14, padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={u.avatar} alt={u.name} style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid #ff4d6d' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name?.split(' ')[0]}</div>
                    <div style={{ fontSize: 11, color: '#666' }}>{u.location}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Settings</div>
          {['Notifications', 'Privacy & Safety', 'Account Settings', 'Help & Support'].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #111118', cursor: 'pointer' }}>
              <span style={{ fontSize: 14, color: '#ccc' }}>{item}</span>
              <span style={{ color: '#444' }}>›</span>
            </div>
          ))}
          <div onClick={onLogout} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', cursor: 'pointer' }}>
            <span style={{ fontSize: 14, color: '#ff4d6d' }}>Log Out</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Overlay */}
      {editing && (
        <EditProfile
          profile={profile}
          session={session}
          onSave={() => { setEditing(false); window.location.reload(); }}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
};

export default Profile;