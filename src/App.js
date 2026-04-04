import React, { useState } from 'react';
import Header from './components/Header';
import Feed from './components/Feed';
import Discover from './components/Discover';
import Messages from './components/Messages';
import Profile from './components/Profile';
import CommentsOverlay from './components/CommentsOverlay';
import MatchOverlay from './components/MatchOverlay';
import { INITIAL_POSTS, INITIAL_COMMENTS } from './data/mockData';

function App() {
  const [tab, setTab] = useState('feed');
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [openPost, setOpenPost] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);

  const handleMatchMessage = () => {
    setMatchedUser(null);
    setTab('messages');
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#fff', maxWidth: 430, margin: '0 auto', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <Header tab={tab} setTab={setTab} />

      <div style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        {tab === 'feed' && (
          <Feed
            posts={posts}
            setPosts={setPosts}
            comments={comments}
            setComments={setComments}
            setOpenPost={setOpenPost}
          />
        )}
        {tab === 'discover' && (
          <Discover
            likedUsers={likedUsers}
            setLikedUsers={setLikedUsers}
            setMatchedUser={setMatchedUser}
          />
        )}
        {tab === 'messages' && (
          <Messages likedUsers={likedUsers} />
        )}
        {tab === 'profile' && (
          <Profile likedUsers={likedUsers} posts={posts} />
        )}
      </div>

      {/* Overlays */}
      {openPost && (
        <CommentsOverlay
          post={posts.find(p => p.id === openPost.id) || openPost}
          comments={comments}
          setComments={setComments}
          setPosts={setPosts}
          onClose={() => setOpenPost(null)}
        />
      )}
      {matchedUser && (
        <MatchOverlay
          matchedUser={matchedUser}
          onClose={() => setMatchedUser(null)}
          onMessage={handleMatchMessage}
        />
      )}
    </div>
  );
}

export default App;
