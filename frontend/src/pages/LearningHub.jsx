import { useState, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function LearningHub() {
  const [chapters, setChapters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false); // New state for focus effect
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const res = await API.get("/chapters/");
      setChapters(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredChapters = chapters.filter(
    (chapter) =>
      chapter.title.toLowerCase().includes(search.toLowerCase()) ||
      chapter.order_number.toString().includes(search),
  );

  const getAccentColor = (index) => {
    const colors = [
      "#6366f1",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
    ];
    return colors[index % colors.length];
  };

  const getChapterIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("number")) return "🔢";
    if (t.includes("algebra")) return "🔣";
    if (t.includes("geometry") || t.includes("shape") || t.includes("line"))
      return "📐";
    if (t.includes("fraction") || t.includes("decimal")) return "🔢";
    if (t.includes("data") || t.includes("graph")) return "📊";
    if (t.includes("ratio") || t.includes("proportion")) return "⚖️";
    if (t.includes("integer")) return "±";
    if (t.includes("symmetry")) return "🔲";
    if (t.includes("mensuration")) return "📏";
    return "🧮";
  };

  return (
    // navbar==================================================

    <div style={styles.container}>
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
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
      </nav>

      <div style={styles.main}>
        {/* Hero Banner with Blur Effect */}

        <div
          style={{
            ...styles.heroBanner,
            height: isMobile ? "auto" : "260px",
            flexDirection: isMobile ? "column" : "row",
            display: isMobile ? "flex" : "block",
            padding: isMobile ? "24px 16px" : "0",
          }}
        >
          <div style={styles.heroOverlay}></div>

          {/* Content */}
          {!isMobile && (
            <div
              style={{
                ...styles.heroContent,
                filter: isSearchFocused ? "blur(4px)" : "none",
                opacity: isSearchFocused ? 0.6 : 1,
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={styles.heroTitle}>Master Your Curriculum</h3>
              <p style={styles.heroText}>
                Detailed notes, video lectures, and interactive quizzes.
              </p>
              <button style={styles.heroBtn} onClick={() => navigate("/quiz")}>
                Take a Quiz →
              </button>
            </div>
          )}

          <div
            style={{
              ...styles.bannerSearchContainer,
              position: isMobile ? "relative" : "absolute",
              top: isMobile ? "auto" : "50%",
              right: isMobile ? "auto" : "55px",
              transform: isMobile ? "none" : "translateY(-50%)",
              width: isMobile ? "100%" : "320px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                ...styles.searchWrapper,
                boxShadow: isSearchFocused
                  ? "0 0 25px rgba(99,102,241,0.4)"
                  : "0 8px 20px rgba(0,0,0,0.1)",
                transform: isSearchFocused ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
            >
              <span style={styles.searchIcon}>🔍</span>
              <input
                style={styles.searchInput}
                type="text"
                placeholder="Search chapters..."
                value={search}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button style={styles.clearBtn} onClick={() => setSearch("")}>
                  ✕
                </button>
              )}
            </div>
            {search && (
              <p style={styles.resultsText}>
                {filteredChapters.length} chapter(s) found for "{search}"
              </p>
            )}
          </div>
        </div>

        <div style={styles.titleRow}>
          <h2 style={styles.pageTitle}>📚 All Chapters</h2>
          <span style={styles.chapterCount}>
            {filteredChapters.length} chapters
          </span>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading your curriculum...</div>
        ) : (
          <div
            style={{
              ...styles.chaptersGrid,
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(340px, 1fr))",
            }}
          >
            {filteredChapters.map((chapter, index) => {
              const color = getAccentColor(index);
              return (
                <div
                  key={chapter.id}
                  style={{
                    ...styles.chapterCard,
                    borderTop: `5px solid ${color}`,
                  }}
                  onClick={() => navigate(`/learning/${chapter.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    // Added NEON GLOW effect here
                    e.currentTarget.style.boxShadow = `0 15px 35px ${color}33`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={styles.cardMainContent}>
                    <div
                      style={{
                        ...styles.iconBox,
                        backgroundColor: `${color}18`,
                      }}
                    >
                      <span style={{ ...styles.chapterIcon, color: color }}>
                        {getChapterIcon(chapter.title)}
                      </span>
                    </div>
                    <div style={styles.textContainer}>
                      <span style={{ ...styles.chapterNumber, color: color }}>
                        Chapter {chapter.order_number}
                      </span>
                      <h3 style={styles.chapterTitle}>{chapter.title}</h3>
                      <p style={styles.chapterDesc}>{chapter.description}</p>
                    </div>
                  </div>

                  <div style={styles.chapterFooter}>
                    <div style={styles.badgeGroup}>
                      <span style={styles.lessonBadge}>📹 Video</span>
                      <span style={styles.lessonBadge}>📖 Notes</span>
                    </div>
                    <span style={{ ...styles.startBtn, color: color }}>
                      Start Learning →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #e0f2fe 0%, #ffffff 500px)",
    backgroundColor: "#ffffff",
  },
  navbar: {
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    padding: "0 40px",
    height: "82px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "22px",
  },
  navLogo: { color: "white", fontSize: "22px", fontWeight: "700", margin: 0 },
  backBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "500",
  },

  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "110px 16px 40px",
  },

  heroBanner: {
    position: "relative",
    width: "100%",
    height: "260px",
    borderRadius: "24px",
    overflow: "hidden",
    marginBottom: "36px",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    zIndex: 5,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(90deg, rgba(99,102,241,0.85) 0%, rgba(168,85,247,0.4) 100%)",
    zIndex: 1,
  },
  heroContent: {
    position: "absolute",
    top: "50%",
    left: "50px",
    transform: "translateY(-50%)",
    zIndex: 2,
    color: "white",
    maxWidth: "450px",
  },
  heroTitle: {
    fontSize: "28px",
    fontWeight: "800",
    margin: "0 0 8px 0",
    color: "white",
  },
  heroText: {
    fontSize: "15px",
    opacity: 0.9,
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  heroBtn: {
    backgroundColor: "white",
    color: "#6366f1",
    border: "none",
    padding: "10px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },

  bannerSearchContainer: {
    position: "absolute",
    top: "50%",
    right: "55px",
    transform: "translateY(-50%)",
    zIndex: 10,
    width: "320px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: "12px",
    padding: "12px 16px",
    gap: "8px",
  },
  searchIcon: { fontSize: "14px", opacity: 0.5 },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#334155",
    background: "transparent",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: "13px",
  },
  resultsText: {
    color: "white",
    fontSize: "12px",
    margin: "8px 0 0 4px",
    fontWeight: "500",
  },

  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  pageTitle: {
    fontSize: "22px",
    color: "#1e293b",
    fontWeight: "700",
    margin: 0,
  },
  chapterCount: {
    backgroundColor: "rgba(99,102,241,0.1)",
    color: "#6366f1",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  chaptersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "24px",
  },
  chapterCard: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "30px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardMainContent: { display: "flex", gap: "16px", marginBottom: "18px" },
  iconBox: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chapterIcon: { fontSize: "28px" },
  textContainer: { flex: 1 },
  chapterNumber: {
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  chapterTitle: {
    fontSize: "17px",
    color: "#1e293b",
    fontWeight: "700",
    margin: "6px 0 12px 0",
  },
  chapterDesc: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.5",
    margin: 0,
  },
  chapterFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "12px",
  },
  badgeGroup: { display: "flex", gap: "8px" },
  lessonBadge: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "600",
  },
  startBtn: { fontWeight: "700", fontSize: "13px" },
  loading: { textAlign: "center", padding: "80px", color: "#666" },
};

export default LearningHub;
