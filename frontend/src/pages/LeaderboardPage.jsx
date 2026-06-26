import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import useWindowSize from "../hooks/useWindowSize";

function LeaderboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/leaderboard/");
      setData(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return styles.rank1;
    if (rank === 2) return styles.rank2;
    if (rank === 3) return styles.rank3;
    return styles.rankNormal;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const handleBack = () => {
    if (state.from === "quiz-result") {
      navigate("/quiz/result", {
        state: {
          result: state.result,
          chapterId: state.chapterId,
          difficulty: state.difficulty,
          from: state.quizFrom,
        },
      });
    } else {
      navigate("/dashboard");
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <nav
        style={{
          ...styles.navbar,
          padding: isMobile ? "0 16px" : "0px 40px",
        }}
      >
        {!isMobile && <h1 style={styles.navLogo}>🎮 MathQuest Arena</h1>}
        <button style={styles.backBtn} onClick={handleBack}>
          {isMobile
            ? "← Back"
            : state.from === "quiz-result"
              ? "← Back to Results"
              : "← Back to Dashboard"}
        </button>
      </nav>

      <div
        style={{
          ...styles.headerCard,
          padding: isMobile ? "24px 16px" : "50px 20px 40px",
          marginTop: isMobile ? "82px" : "60px",
        }}
      >
        <h2 style={styles.pageTitle}>🏆 Leaderboard</h2>
        <p style={styles.pageSubtitle}>
          Top 10 students ranked by total coins!
        </p>
        {data?.my_rank && (
          <div style={styles.myRankBadge}>Your Rank: #{data.my_rank} 🎯</div>
        )}
      </div>
      <div style={styles.main}>
        {data?.leaderboard?.length >= 3 && (
          <div
            style={{
              ...styles.top3Row,
              gap: isMobile ? "8px" : "16px",
            }}
          >
            <div
              style={{
                ...styles.top3Card,
                padding: isMobile ? "12px 8px" : "20px 24px",
              }}
            >
              <div style={styles.top3Icon}>🥈</div>
              <div style={styles.top3Name}>{data.leaderboard[1].username}</div>
              <div style={styles.top3Coins}>
                🪙 {data.leaderboard[1].total_coins}
              </div>
            </div>

            <div
              style={{
                ...styles.top3Card,
                ...styles.top1Card,
                padding: isMobile ? "16px 8px" : "28px 24px",
              }}
            >
              <div style={styles.crown}>👑</div>
              <div style={styles.top3Icon}>🥇</div>
              <div style={styles.top3Name}>{data.leaderboard[0].username}</div>
              <div style={styles.top3Coins}>
                🪙 {data.leaderboard[0].total_coins}
              </div>
            </div>

            <div
              style={{
                ...styles.top3Card,
                padding: isMobile ? "12px 8px" : "20px 24px",
              }}
            >
              <div style={styles.top3Icon}>🥉</div>
              <div
                style={{
                  ...styles.top3Name,
                  fontSize: isMobile ? "13px" : "18px",
                }}
              >
                {data.leaderboard[2]?.username}
              </div>
              <div style={styles.top3Coins}>
                🪙 {data.leaderboard[2]?.total_coins}
              </div>
            </div>
          </div>
        )}

        <div style={styles.tableCard}>
          {data?.leaderboard?.map((entry) => (
            <div
              key={entry.rank}
              style={{
                ...(entry.is_me ? styles.myRow : styles.row),
                padding: isMobile ? "12px 16px" : "16px 24px",
              }}
            >
              <div style={getRankStyle(entry.rank)}>
                {getRankIcon(entry.rank)}
              </div>
              <div style={styles.username}>
                {entry.username}
                {entry.is_me && <span style={styles.youBadge}>You</span>}
              </div>
              <div style={styles.coins}>🪙 {entry.total_coins} coins</div>
            </div>
          ))}
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
  loading: { textAlign: "center", padding: "100px", color: "#6366f1" },
  headerCard: {
    marginTop: "60px", // Navbar height ke barabar margin
    background: "linear-gradient(180deg, #bbdff7 0%, #ffffff 100%)",
    padding: "50px 20px 40px",
    textAlign: "center",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  pageTitle: { fontSize: "30px", color: "#333", margin: "0 0 8px 0" },
  pageSubtitle: { color: "#666", fontSize: "18px", margin: "0 0 16px 0" },
  myRankBadge: {
    display: "inline-block",
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "16px",
    fontWeight: "600",
  },
  main: { maxWidth: "900px", margin: "0 auto", padding: "32px 16px" },
  top3Row: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: "16px",
    marginBottom: "24px",
  },
  top3Card: {
    backgroundColor: "white",
    padding: "20px 24px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    flex: 1,
  },
  top1Card: {
    backgroundColor: "#fffbeb",
    border: "2px solid #fcd34d",
    padding: "28px 24px",
    transform: "translateY(-10px)",
  },
  crown: {
    fontSize: "24px",
    position: "absolute",
    top: "-25px",
    left: "50%",
    transform: "translateX(-50%)",
  },
  top3Icon: { fontSize: "36px", marginBottom: "8px" },
  top3Name: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "4px",
  },
  top3Coins: { fontSize: "14px", color: "#888" },
  tableCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
    gap: "16px",
  },
  myRow: {
    display: "flex",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
    gap: "16px",
    backgroundColor: "#eef2ff",
    border: "2px solid #c7d2fe",
  },
  rank1: { fontSize: "24px", width: "40px", textAlign: "center" },
  rank2: { fontSize: "24px", width: "40px", textAlign: "center" },
  rank3: { fontSize: "24px", width: "40px", textAlign: "center" },
  rankNormal: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#888",
    width: "40px",
    textAlign: "center",
  },
  username: {
    flex: 1,
    fontSize: "15px",
    fontWeight: "500",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  youBadge: {
    backgroundColor: "#4f46e5",
    color: "white",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "600",
  },
  coins: { fontSize: "14px", color: "#888", fontWeight: "500" },
};

export default LeaderboardPage;
