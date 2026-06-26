import { useState, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

function VideoLesson() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [loading, setLoading] = useState(true);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    fetchLesson();
  }, [chapterId]);

  const fetchLesson = async () => {
    try {
      const res = await API.get(`/chapters/${chapterId}/`);
      setChapter(res.data.chapter);
      if (res.data.videos && res.data.videos.length > 0) {
        setVideos(res.data.videos);
        setCurrentVideo(res.data.videos[0].video_url);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) return url;
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const chapterNotes = {
    Symmetry:
      "Note: Some videos may refer to this as Chapter 9 (different book), but in NCERT it is Chapter 13.",
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* 1. NAVBAR - Solid Purple  */}
      <nav
        style={{
          ...styles.navbar,
          padding: isMobile ? "0 16px" : "0 40px",
        }}
      >
        {!isMobile && <h1 style={styles.navLogo}>MathQuest Arena</h1>}
        <button
          style={styles.backBtn}
          onClick={() => navigate(`/learning/${chapterId}`)}
        >
          ← Back
        </button>
      </nav>

      {/* 2. HEADER SECTION - Sky Blue Gradient + Centered Text */}
      <div
        style={{
          ...styles.headerSection,
          padding: isMobile ? "24px 16px" : "50px 20px 40px",
          marginTop: isMobile ? "82px" : "60px",
        }}
      >
        <div style={styles.chapterBadge}>📹 Video Lesson</div>
        <h2
          style={{
            ...styles.chapterTitle,
            fontSize: isMobile ? "22px" : "30px",
          }}
        >
          {chapter?.title}
        </h2>
        <p style={styles.chapterDesc}>
          Understanding the concepts through engaging video lectures
        </p>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div
        style={{
          ...styles.main,
          padding: isMobile ? "0 16px 20px" : "0 40px 20px",
        }}
      >
        {/* Chapter Note */}
        {chapterNotes[chapter?.title] && (
          <div style={styles.chapterNote}>
            ℹ️ {chapterNotes[chapter?.title]}
          </div>
        )}

        {videos.length > 0 ? (
          <div
            style={{
              ...styles.videoSection,
              gridTemplateColumns: isMobile ? "1fr" : "2.1fr 1fr",
              gap: isMobile ? "16px" : "24px",
            }}
          >
            {/* LEFT — Video Player Card */}
            <div
              style={{
                ...styles.videoPlayerCard,
                height: isMobile ? "220px" : "500px",
              }}
            >
              <iframe
                style={styles.videoFrame}
                src={getEmbedUrl(currentVideo)}
                title="Chapter Video"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* RIGHT — Playlist Card */}
            <div
              style={{
                ...styles.playlistCard,
                height: isMobile ? "300px" : "500px",
              }}
            >
              <div style={styles.playlistHeader}>
                📋 Playlist ({videos.length} videos)
              </div>
              <div style={styles.playlistList}>
                {videos.map((vid, index) => (
                  <div
                    key={vid.id}
                    style={{
                      ...styles.playlistItem,
                      ...(currentVideo === vid.video_url
                        ? styles.playlistItemActive
                        : {}),
                    }}
                    onClick={() => setCurrentVideo(vid.video_url)}
                  >
                    <div style={styles.playlistIndex}>
                      {currentVideo === vid.video_url ? "▶" : index + 1}
                    </div>
                    <div style={styles.playlistTitle}>{vid.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.noVideo}>
            Video not available for this chapter yet!
          </div>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <div
          style={{
            ...styles.bottomButtons,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <button
            style={styles.readBtn}
            onClick={() => navigate(`/learning/${chapterId}/reading`)}
          >
            📖 Switch to Reading Mode
          </button>
          <button
            style={styles.quizBtn}
            onClick={() => navigate(`/quiz/${chapterId}/easy?from=video`)}
          >
            🧠 Take Quiz Now
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  navbar: {
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    padding: "0 40px",
    height: "82px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed", // ← ADD KARO
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: "0 4px 15px rgba(99,102,241,0.2)",
  },
  navLogo: {
    color: "white",
    fontSize: "22px",
    fontWeight: "700",
    margin: 0,
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    padding: "8px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    transition: "0.3s",
  },

  // Gradient Header Section
  headerSection: {
    marginTop: "60px", // Navbar height ke barabar margin
    background: "linear-gradient(180deg, #bbdff7 0%, #ffffff 100%)",
    padding: "50px 20px 40px",
    textAlign: "center",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  chapterBadge: {
    backgroundColor: "#e0e7ff",
    color: "#4f46e5",
    padding: "4px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "800",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  chapterTitle: {
    fontSize: "30px",
    color: "#1e293b",
    fontWeight: "800",
    margin: "0 0 8px 0",
  },
  chapterDesc: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
    margin: 0,
  },

  main: {
    maxWidth: "1350px",
    margin: "0 auto",
    padding: "0 40px 20px",
  },
  videoSection: {
    display: "grid",
    gridTemplateColumns: "2.1fr 1fr",
    // gridTemplateColumns: '1.8fr 1fr',
    gap: "24px",
    marginTop: "30px",
    alignItems: "stretch",
  },
  videoPlayerCard: {
    backgroundColor: "black",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    // aspectRatio: '16/9',
    width: "100%",
    height: "500px",
    flex: 1.8,
  },
  videoFrame: {
    width: "100%",
    height: "100%",
    border: "none",
    // display: 'block',
  },
  playlistCard: {
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    height: "500px",
    display: "flex",
    flexDirection: "column",
  },
  playlistHeader: {
    fontSize: "15px",
    fontWeight: "800",
    color: "#1e293b",
    paddingBottom: "15px",
    borderBottom: "1px solid #f1f5f9",
    marginBottom: "15px",
    textAlign: "center",
  },
  playlistList: {
    overflowY: "auto",
    flex: 1,
  },
  playlistItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "8px",
    backgroundColor: "#f8fafc",
    transition: "0.2s",
  },
  playlistItemActive: {
    backgroundColor: "#eef2ff",
    border: "1px solid #c7d2fe",
  },
  playlistIndex: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#6366f1",
    minWidth: "20px",
  },
  playlistTitle: {
    fontSize: "13px",
    color: "#334155",
    fontWeight: "500",
    lineHeight: "1.4",
  },
  bottomButtons: {
    display: "flex",
    gap: "16px",
    marginTop: "32px",
  },
  readBtn: {
    flex: 1,
    padding: "16px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: "15px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "700",
    color: "#053a19",
  },
  quizBtn: {
    flex: 1,
    padding: "16px",
    backgroundColor: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: "15px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "700",
    color: "#211d68",
  },
  chapterNote: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "20px",
    fontSize: "13px",
    color: "#92400e",
  },
  noVideo: {
    textAlign: "center",
    padding: "60px",
    backgroundColor: "#f8fafc",
    borderRadius: "24px",
    color: "#64748b",
  },
  loading: {
    textAlign: "center",
    padding: "100px",
    color: "#6366f1",
    fontWeight: "600",
  },
};

export default VideoLesson;
