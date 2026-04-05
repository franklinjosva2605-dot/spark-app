import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../supabase";

// Keep MOCK_USERS for swipe/discover until real user discovery is built
const MOCK_USERS = [
  {
    id: "mock_1",
    name: "Ava Williams",
    age: 24,
    bio: "Coffee lover ☕ | Hiking enthusiast 🏔️ | Dog mom 🐶",
    avatar: "https://i.pravatar.cc/400?img=47",
  },
  {
    id: "mock_2",
    name: "Sophia Chen",
    age: 26,
    bio: "Foodie 🍜 | Travel addict ✈️ | Always down for brunch",
    avatar: "https://i.pravatar.cc/400?img=45",
  },
  {
    id: "mock_3",
    name: "Isabella Martinez",
    age: 22,
    bio: "Yoga 🧘 | Art 🎨 | Spontaneous adventures",
    avatar: "https://i.pravatar.cc/400?img=44",
  },
  {
    id: "mock_4",
    name: "Emily Johnson",
    age: 25,
    bio: "Bookworm 📚 | Netflix binger | Aspiring chef 🍳",
    avatar: "https://i.pravatar.cc/400?img=41",
  },
  {
    id: "mock_5",
    name: "Mia Thompson",
    age: 23,
    bio: "Music 🎵 | Sunsets 🌅 | Good vibes only",
    avatar: "https://i.pravatar.cc/400?img=40",
  },
];

const Discover = ({ session }) => {
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);
  const [showMatch, setShowMatch] = useState(false);

  // Drag state
  const dragStartX = useRef(null);
  const dragCurrentX = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);

  const currentUser = MOCK_USERS[swipeIndex];

  // Load existing matches from Supabase on mount
  useEffect(() => {
    if (!session) return;
    const fetchMatches = async () => {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .eq("user_id", session.user.id);
      if (data) {
        setLikedUsers(
          data.map((m) => ({
            id: m.matched_user_id,
            name: m.matched_user_name,
            avatar: m.matched_user_avatar,
          }))
        );
      }
    };
    fetchMatches();
  }, [session]);

  const handleSwipe = async (dir) => {
    setSwipeDir(dir);

    if (dir === "right" && currentUser) {
      setMatchedUser(currentUser);
      setLikedUsers((prev) => [...prev, currentUser]);

      // Persist match to Supabase
      if (session) {
        await supabase.from("matches").insert({
          user_id: session.user.id,
          matched_user_id: currentUser.id,
          matched_user_name: currentUser.name,
          matched_user_avatar: currentUser.avatar,
        });
      }

      setTimeout(() => {
        setShowMatch(true);
      }, 300);
    }

    setTimeout(() => {
      setSwipeIndex((i) => i + 1);
      setSwipeDir(null);
      setDragOffset(0);
    }, 380);
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    dragCurrentX.current = e.clientX;
    const offset = e.clientX - dragStartX.current;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const offset = dragCurrentX.current - dragStartX.current;
    if (offset > 80) {
      handleSwipe("right");
    } else if (offset < -80) {
      handleSwipe("left");
    } else {
      setDragOffset(0);
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const offset = e.touches[0].clientX - dragStartX.current;
    dragCurrentX.current = e.touches[0].clientX;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const offset = (dragCurrentX.current || 0) - (dragStartX.current || 0);
    if (offset > 80) {
      handleSwipe("right");
    } else if (offset < -80) {
      handleSwipe("left");
    } else {
      setDragOffset(0);
    }
  };

  const cardRotation = dragOffset * 0.08;
  const likeOpacity = Math.min(dragOffset / 80, 1);
  const nopeOpacity = Math.min(-dragOffset / 80, 1);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "100vh",
      background: "#0f0f0f",
      paddingTop: "20px",
      fontFamily: "'Segoe UI', sans-serif",
    },
    header: {
      color: "#fff",
      fontSize: "22px",
      fontWeight: "700",
      marginBottom: "20px",
      letterSpacing: "2px",
    },
    cardWrapper: {
      position: "relative",
      width: "340px",
      height: "480px",
      marginBottom: "24px",
    },
    card: {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "20px",
      overflow: "hidden",
      cursor: "grab",
      userSelect: "none",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      transform: translateX(${dragOffset}px) rotate(${cardRotation}deg),
      transition: swipeDir
        ? transform 0.38s ease, opacity 0.38s ease
        : dragOffset !== 0
        ? "none"
        : "transform 0.2s ease",
      opacity:
        swipeDir === "left"
          ? 0
          : swipeDir === "right"
          ? 0
          : 1,
      ...(swipeDir === "left" && {
        transform: "translateX(-120%) rotate(-20deg)",
      }),
      ...(swipeDir === "right" && {
        transform: "translateX(120%) rotate(20deg)",
      }),
    },
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      pointerEvents: "none",
    },
    cardOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
      padding: "20px",
      color: "#fff",
    },
    cardName: {
      fontSize: "24px",
      fontWeight: "700",
      margin: 0,
    },
    cardBio: {
      fontSize: "14px",
      opacity: 0.85,
      margin: "6px 0 0",
    },
    likeStamp: {
      position: "absolute",
      top: "30px",
      left: "20px",
      border: "4px solid #4ade80",
      color: "#4ade80",
      padding: "6px 14px",
      borderRadius: "8px",
      fontSize: "28px",
      fontWeight: "900",
      transform: "rotate(-15deg)",
      opacity: likeOpacity,
      transition: "opacity 0.1s",
      pointerEvents: "none",
    },
    nopeStamp: {
      position: "absolute",
      top: "30px",
      right: "20px",
      border: "4px solid #f87171",
      color: "#f87171",
      padding: "6px 14px",
      borderRadius: "8px",
      fontSize: "28px",
      fontWeight: "900",
      transform: "rotate(15deg)",
      opacity: nopeOpacity,
      transition: "opacity 0.1s",
      pointerEvents: "none",
    },
    // Background card peek
    cardBehind: {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "20px",
      overflow: "hidden",
      transform: "scale(0.95) translateY(10px)",
      zIndex: 0,
    },
    buttons: {
      display: "flex",
      gap: "24px",
    },
    btnNope: {
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      border: "2px solid #f87171",
      background: "transparent",
      color: "#f87171",
      fontSize: "28px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.2s",
    },
    btnLike: {
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      border: "2px solid #4ade80",
      background: "transparent",
      color: "#4ade80",
      fontSize: "28px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.2s",
    },
    emptyState: {
      color: "#888",
      fontSize: "18px",
      textAlign: "center",
      marginTop: "80px",
    },
    // Match overlay
    matchOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.92)",
      zIndex: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      animation: "fadeIn 0.3s ease",
    },
    matchTitle: {
      fontSize: "42px",
      fontWeight: "900",
      background: "linear-gradient(135deg, #f472b6, #fb923c)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "10px",
    },
    matchSub: {
      color: "#ccc",
      fontSize: "16px",
      marginBottom: "30px",
    },
    matchAvatar: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #f472b6",
      marginBottom: "20px",
    },
    matchName: {
      color: "#fff",
      fontSize: "22px",
      fontWeight: "700",
      marginBottom: "30px",
    },
    matchBtn: {
      background: "linear-gradient(135deg, #f472b6, #fb923c)",
      border: "none",
      color: "#fff",
      padding: "14px 40px",
      borderRadius: "30px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      marginBottom: "12px",
    },
    matchBtnSecondary: {
      background: "transparent",
      border: "1px solid #555",
      color: "#aaa",
      padding: "12px 40px",
      borderRadius: "30px",
      fontSize: "14px",
      cursor: "pointer",
    },
  };

  const nextUser = MOCK_USERS[swipeIndex + 1];

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes heartPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>

      <h1 style={styles.header}>✦ DISCOVER</h1>

      {currentUser ? (
        <>
          <div style={styles.cardWrapper}>
            {/* Background card peek */}
            {nextUser && (
              <div style={{ ...styles.cardBehind, zIndex: 0 }}>
                <img
                  src={nextUser.avatar}
                  alt={nextUser.name}
                  style={styles.cardImage}
                />
              </div>
            )}

            {/* Main swipe card */}
            <div
              style={{ ...styles.card, zIndex: 1 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={styles.cardImage}
                draggable={false}
              />
              <div style={styles.likeStamp}>LIKE</div>
              <div style={styles.nopeStamp}>NOPE</div>
              <div style={styles.cardOverlay}>
                <p style={styles.cardName}>
                  {currentUser.name}, {currentUser.age}
                </p>
                <p style={styles.cardBio}>{currentUser.bio}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttons}>
            <button
              style={styles.btnNope}
              onClick={() => handleSwipe("left")}
              aria-label="Pass"
            >
              ✕
            </button>
            <button
              style={styles.btnLike}
              onClick={() => handleSwipe("right")}
              aria-label="Like"
            >
              ♥
            </button>
          </div>
        </>
      ) : (
        <div style={styles.emptyState}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
          <p>You've seen everyone!</p>
          <p style={{ fontSize: "14px", color: "#555", marginTop: "8px" }}>
            Check back later for new people
          </p>
        </div>
      )}

      {/* Match Animation Overlay */}
      {showMatch && matchedUser && (
        <div style={styles.matchOverlay}>
          <div style={{ fontSize: "48px", animation: "heartPop 0.5s ease" }}>
            💫
          </div>
          <h2 style={styles.matchTitle}>It's a Match!</h2>
          <p style={styles.matchSub}>You and {matchedUser.name} liked each other</p>
          <img
            src={matchedUser.avatar}
            alt={matchedUser.name}
            style={styles.matchAvatar}
          />
          <p style={styles.matchName}>{matchedUser.name}</p>
          <button
            style={styles.matchBtn}
            onClick={() => setShowMatch(false)}
          >
            Send a Message
          </button>
          <button
            style={styles.matchBtnSecondary}
            onClick={() => setShowMatch(false)}
          >
            Keep Swiping
          </button>
        </div>
      )}
    </div>
  );
};

export default Discover;