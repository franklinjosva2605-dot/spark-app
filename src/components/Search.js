import React, { useState } from 'react';
import { supabase } from '../supabase';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length < 2) { setResults([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${text}%,display_name.ilike.%${text}%`)
      .limit(20);
    setResults(data || []);
    setLoading(false);
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Search</div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
        <input
          placeholder="Search people..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: '100%', background: '#1a1a2e', border: '1.5px solid #2a2a3e', color: '#fff', padding: '14px 14px 14px 42px', borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Results */}
      {loading && <div style={{ color: '#666', textAlign: 'center', padding: 20 }}>Searching...</div>}

      {!loading && query.length >= 2 && results.length === 0 && (
        <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>😕</div>
          No users found for "{query}"
        </div>
      )}

      {results.map(user => (
        <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 12px', background: '#111118', borderRadius: 14, marginBottom: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d6d, #ff8c32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, overflow: 'hidden' }}>
            {user.avatar_url ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.display_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{user.display_name}</div>
            <div style={{ color: '#ff4d6d', fontSize: 13 }}>@{user.username}</div>
            {user.bio && <div style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{user.bio}</div>}
          </div>
          <button style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #ff4d6d, #ff8c32)', border: 'none', borderRadius: 20, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Follow
          </button>
        </div>
      ))}

      {!query && (
        <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Find People</div>
          <div style={{ fontSize: 13 }}>Search by name or username</div>
        </div>
      )}
    </div>
  );
};

export default Search;