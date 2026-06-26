import { useState, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

function ChapterDetail() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    fetchChapterDetail();
  }, []);

  const fetchChapterDetail = async () => {
    try {
      const res = await API.get(`/chapters/${chapterId}/`);
      setChapter(res.data.chapter);
      setLessons(res.data.lessons);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div style={styles.loading}>Preparing your lesson...</div>;

  return (
    <div style={styles.container}>
      {/* --- Premium Navbar --- */}
      <nav
        style={{
          ...styles.navbar,
          padding: isMobile ? "0 16px" : "0 40px",
        }}
      >
        <div style={styles.navBrand}>
          <span>🧮</span>
          {!isMobile && <h1 style={styles.navLogo}>MathQuest Arena</h1>}
        </div>
        <button style={styles.backBtn} onClick={() => navigate("/learning")}>
          ← Back
        </button>
      </nav>

      {/* --- Modern Header Section --- */}
      <div
        style={{
          ...styles.heroHeader,
          padding: isMobile ? "30px 16px 24px" : "50px 20px 40px",
        }}
      >
        <div style={styles.chapterBadge}>Chapter {chapter?.order_number}</div>
        <h2
          style={{
            ...styles.chapterTitle,
            fontSize: isMobile ? "24px" : "36px",
          }}
        >
          {chapter?.title}
        </h2>
        <p style={styles.chapterDesc}>{chapter?.description}</p>
      </div>
      <div style={styles.main}>
        <h3 style={styles.sectionTitle}>Choose your learning path:</h3>

        <div
          style={{
            ...styles.optionsGrid,
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(300px, 1fr))",
            gap: isMobile ? "16px" : "30px",
          }}
        >
          {/* --- Video Card with Background Image --- */}
          <div
            style={{
              ...styles.cardWrapper,
              height: isMobile ? "250px" : "350px",
            }}
            onClick={() => navigate(`/learning/${chapterId}/video`)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-10px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{
                ...styles.cardBg,
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80)",
              }}
            ></div>
            <div style={styles.cardOverlayVideo}></div>
            <div style={styles.cardContent}>
              <div style={styles.optionIcon}>📹</div>
              <h3 style={styles.optionTitle}>Watch Video</h3>
              <p style={styles.optionDesc}>
                Understand concepts through engaging video explanation and real
                life examples.
              </p>
              <div style={styles.optionBtn}>Watch Now →</div>
            </div>
          </div>

          {/* --- Reading Card with Background Image --- */}
          <div
            style={{
              ...styles.cardWrapper,
              height: isMobile ? "250px" : "350px",
            }}
            onClick={() => navigate(`/learning/${chapterId}/reading`)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-10px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{
                ...styles.cardBg,
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80)",
              }}
            ></div>
            <div style={styles.cardOverlayRead}></div>
            <div style={styles.cardContent}>
              <div style={styles.optionIcon}>📖</div>
              <h3 style={styles.optionTitle}>Read Lesson</h3>
              <p style={styles.optionDesc}>
                Explore detailed notes, Key formulas and solved examples at your
                own pace.
              </p>
              <div style={styles.optionBtn}>Read Now →</div>
            </div>
          </div>
        </div>

        {/* --- Quiz Section --- */}
        <div style={styles.quizWrapper}>
          <div style={styles.quizHeader}>
            <h3 style={styles.quizSectionTitle}>Ready to test yourself?</h3>
            <p style={styles.quizSubtitle}>
              Earn coins by completing challenges!
            </p>
          </div>
          <div
            style={{
              ...styles.quizButtons,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <button
              style={styles.easyBtn}
              onClick={() => navigate(`/quiz/${chapter?.id}/easy?from=chapter`)}
            >
              🟢 Easy Challenge <span style={styles.coinBadge}>+5 Coins</span>
            </button>
            <button
              style={styles.hardBtn}
              onClick={() => navigate(`/quiz/${chapter?.id}/hard?from=chapter`)}
            >
              🔴 Pro Challenge{" "}
              <span style={styles.coinBadgeHard}>+10 Coins</span>
            </button>
          </div>
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
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "white",
  },
  navLogo: { fontSize: "22px", fontWeight: "700", margin: 0 },
  backBtn: {
    fontSize: "18px",
    // backgroundColor: 'rgba(255,255,255,0.15)',
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    padding: "8px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },

  heroHeader: {
    // Sky Blue to White gradient
    marginTop: "60px", // Navbar height ke barabar margin
    background: "linear-gradient(180deg, #bbdff7 0%, #ffffff 100%)",
    padding: "50px 20px 40px",
    textAlign: "center",
    borderBottom: "1px solid #f1f5f9", // Halka border for clean look
  },

  main: { maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" },

  headerSection: { textAlign: "center", marginBottom: "40px" },
  chapterBadge: {
    display: "inline-block",
    backgroundColor: "#eef2ff",
    color: "#6366f1",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "18px",
    fontWeight: "800",
    marginBottom: "15px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  chapterTitle: {
    fontSize: "36px",
    color: "#1e293b",
    fontWeight: "800",
    margin: "0 0 12px 0",
  },
  chapterDesc: {
    color: "#64748b",
    fontSize: "16px",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  },

  sectionTitle: {
    fontSize: "24px",
    color: "#1e293b",
    fontWeight: "700",
    marginBottom: "24px",
    textAlign: "center",
  },

  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    marginBottom: "50px",
  },

  cardWrapper: {
    position: "relative",
    height: "350px",
    borderRadius: "24px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
  },
  cardBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "0.5s",
  },
  cardOverlayVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(180deg, rgba(130, 132, 242, 0.4) 0%, rgba(117, 112, 200, 0.9) 100%)",
  },
  cardOverlayRead: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(180deg, rgba(65, 164, 181, 0.4) 0%, rgba(45, 207, 236, 0.9) 100%)",
  },
  cardContent: {
    position: "relative",
    zIndex: 10,
    padding: "40px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    color: "white",
    textAlign: "center",
  },

  optionIcon: {
    fontSize: "52px",
    marginBottom: "12px",
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
  },
  optionTitle: { fontSize: "28px", fontWeight: "800", marginBottom: "10px" },
  optionDesc: {
    fontSize: "16px",
    opacity: 0.9,
    marginBottom: "25px",
    lineHeight: "1.4",
  },
  optionBtn: {
    backgroundColor: "white",
    color: "#1e293b",
    padding: "14px 28px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "14px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },

  quizWrapper: {
    background: "linear-gradient(180deg, #f0faff 0%, #ffffff 100%)",
    padding: "40px",
    borderRadius: "30px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  quizHeader: { marginBottom: "30px" },
  quizSectionTitle: {
    fontSize: "22px",
    color: "#1e293b",
    fontWeight: "800",
    margin: "0 0 8px 0",
  },
  quizSubtitle: { color: "#64748b", fontSize: "15px" },
  quizButtons: { display: "flex", gap: "20px", flexWrap: "wrap" },
  easyBtn: {
    flex: 1,
    minWidth: "200px",
    padding: "20px",
    backgroundColor: "#f0fdf4",
    border: "2px solid #bbf7d0",
    borderRadius: "20px",
    color: "#166534",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  hardBtn: {
    flex: 1,
    minWidth: "200px",
    padding: "20px",
    backgroundColor: "#fff1f2",
    border: "2px solid #fecdd3",
    borderRadius: "20px",
    color: "#9f1239",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  coinBadge: {
    fontSize: "12px",
    backgroundColor: "#dcfce7",
    padding: "4px 10px",
    borderRadius: "10px",
  },
  coinBadgeHard: {
    fontSize: "12px",
    backgroundColor: "#ffe4e6",
    padding: "4px 10px",
    borderRadius: "10px",
  },

  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "18px",
    color: "#6366f1",
    fontWeight: "600",
  },
};

export default ChapterDetail;
