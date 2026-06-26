import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import useWindowSize from "../hooks/useWindowSize";

function QuizSelection() {
  const [chapters, setChapters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
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

  return (
    <div style={styles.container}>
      <nav
        style={{
          ...styles.navbar,
          padding: isMobile ? "0 16px" : "0px 40px",
        }}
      >
        {!isMobile && <h1 style={styles.navLogo}>🎮 MathQuest Arena</h1>}

        {/* Search Bar in Navbar */}
        <div
          style={{
            ...styles.searchWrapper,
            width: isMobile ? "100%" : "280px",
          }}
        >
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </nav>

      <div
        style={{
          ...styles.headerCard,
          padding: isMobile ? "24px 16px" : "50px 20px 40px",
          marginTop: isMobile ? "82px" : "60px",
        }}
      >
        <h2 style={styles.pageTitle}>🧠 Quizzes</h2>
        <p style={styles.pageSubtitle}>
          Choose a chapter and difficulty to start your quiz!
        </p>
      </div>
      <div style={styles.main}>
        {/* Results count */}
        {search && (
          <p style={styles.resultsText}>
            {filteredChapters.length} chapter(s) found for "{search}"
          </p>
        )}

        {loading ? (
          <div style={styles.loading}>Loading chapters...</div>
        ) : filteredChapters.length === 0 ? (
          <div style={styles.noResults}>
            😕 No chapters found for "{search}"
          </div>
        ) : (
          <div style={styles.chaptersList}>
            {filteredChapters.map((chapter) => (
              <div
                key={chapter.id}
                style={{
                  ...styles.chapterCard,
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(79,70,229,0.15)";
                  e.currentTarget.style.borderColor = "#4f46e5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.06)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <div style={styles.chapterInfo}>
                  <div style={styles.chapterNumber}>
                    Chapter {chapter.order_number}
                  </div>
                  <h3 style={styles.chapterTitle}>{chapter.title}</h3>
                  <p style={styles.chapterDesc}>{chapter.description}</p>
                </div>
                <div
                  style={{
                    ...styles.quizButtons,
                    flexDirection: isMobile ? "row" : "column",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  <button
                    style={{
                      ...styles.easyBtn,
                      flex: isMobile ? 1 : "none",
                      minWidth: isMobile ? "auto" : "150px",
                    }}
                    onClick={() => navigate(`/quiz/${chapter.id}/easy`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#dcfce7";
                      e.currentTarget.style.borderColor = "#22c55e";
                      e.currentTarget.style.transform = "scale(1.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f0fdf4";
                      e.currentTarget.style.borderColor = "#86efac";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    🟢 Easy Quiz
                    <span style={styles.coinsBadge}>+5 🪙</span>
                  </button>
                  <button
                    style={{
                      ...styles.hardBtn,
                      flex: isMobile ? 1 : "none",
                      minWidth: isMobile ? "auto" : "150px",
                    }}
                    onClick={() => navigate(`/quiz/${chapter.id}/hard`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffe4e6";
                      e.currentTarget.style.borderColor = "#f43f5e";
                      e.currentTarget.style.transform = "scale(1.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff1f2";
                      e.currentTarget.style.borderColor = "#fecdd3";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    🔴 Hard Quiz
                    <span style={styles.coinsBadge}>+10 🪙</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
    padding: "0px 40px",
    height: "82px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: "0 4px 15px rgba(99,102,241,0.2)",
  },
  navLogo: { color: "white", fontSize: "22px", margin: 0, fontWeight: "700" },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: "18px",
    padding: "6px 14px",
    border: "1px solid rgba(255,255,255,0.3)",
    gap: "8px",
    width: "280px",
  },
  searchIcon: {
    fontSize: "16px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "13px",
    color: "#334155",
    // backgroundColor: 'transparent',
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: "rgba(255,255,255,0.8)",
    padding: "0",
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
  loading: {
    textAlign: "center",
    padding: "100px",
    color: "#6366f1",
  },
  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "32px 16px",
  },
  headerCard: {
    marginTop: "60px", // Navbar height ke barabar margin
    background: "linear-gradient(180deg, #aad9f9 0%, #ffffff 100%)",
    padding: "50px 20px 40px",
    textAlign: "center",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: "28px",
    color: "#333",
    margin: "0 0 8px 0",
  },
  pageSubtitle: {
    color: "#666",
    fontSize: "16px",
    margin: 0,
  },
  resultsText: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "16px",
  },
  noResults: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
    backgroundColor: "white",
    borderRadius: "16px",
    fontSize: "16px",
  },
  chaptersList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "16px",
  },
  chapterCard: {
    // backgroundColor: 'white',
    background: "linear-gradient(180deg, #e3f4f4 0%, #ffffff 100%)",

    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    border: "2px solid transparent",
    transition: "box-shadow 0.2s, border-color 0.2s",
  },
  chapterInfo: {
    flex: 1,
  },
  chapterNumber: {
    fontSize: "14px",
    color: "#4f46e5",
    fontWeight: "600",
    marginBottom: "4px",
    textTransform: "uppercase",
  },
  chapterTitle: {
    fontSize: "16px",
    color: "#333",
    margin: "0 0 4px 0",
  },
  chapterDesc: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },
  quizButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flexShrink: 0,
  },
  easyBtn: {
    padding: "10px 20px",
    backgroundColor: "#f0fdf4",
    border: "2px solid #86efac",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#166534",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "space-between",
    minWidth: "150px",
  },
  hardBtn: {
    padding: "10px 20px",
    backgroundColor: "#fff1f2",
    border: "2px solid #fecdd3",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#9f1239",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "space-between",
    minWidth: "150px",
  },
  coinsBadge: {
    backgroundColor: "white",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "12px",
  },
  easyBtn: {
    padding: "10px 20px",
    backgroundColor: "#f0fdf4",
    border: "2px solid #86efac",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#166534",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "space-between",
    minWidth: "150px",
    transition: "background-color 0.2s, border-color 0.2s, transform 0.2s",
  },
  hardBtn: {
    padding: "10px 20px",
    backgroundColor: "#fff1f2",
    border: "2px solid #fecdd3",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#9f1239",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "space-between",
    minWidth: "150px",
    transition: "background-color 0.2s, border-color 0.2s, transform 0.2s",
  },
};

export default QuizSelection;
