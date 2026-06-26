import { useLocation, useNavigate } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";

function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, chapterId, difficulty, from, timeTaken } =
    location.state || {};

  if (!result) {
    navigate("/dashboard");
    return null;
  }

  const percentage = (result.score / result.total) * 100;

  const getGrade = () => {
    if (percentage === 100) return { grade: "Perfect! 🌟", color: "#166534" };
    if (percentage >= 80) return { grade: "Excellent! 🎉", color: "#1d4ed8" };
    if (percentage >= 60) return { grade: "Passed! ✅", color: "#166534" };
    return { grade: "Failed ❌", color: "#9f1239" };
  };

  const { grade, color } = getGrade();
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav
        style={{
          ...styles.navbar,
          padding: isMobile ? "0 16px" : "0px 40px",
        }}
      >
        <h1
          style={{
            ...styles.navLogo,
            fontSize: isMobile ? "16px" : "22px",
          }}
        >
          🎮 MathQuest Arena
        </h1>
      </nav>

      <div style={styles.main}>
        {/* Result Card */}
        <div
          style={{
            ...styles.resultCard,
            padding: isMobile ? "24px 16px" : "40px",
          }}
        >
          {/* Score Circle */}
          <div style={styles.scoreCircle}>
            <div style={styles.scoreNumber}>
              {result.score}/{result.total}
            </div>
            <div style={styles.scoreLabel}>Score</div>
          </div>

          {/* Grade */}
          <h2 style={{ ...styles.grade, color }}>{grade}</h2>

          {/* Stats */}
          <div
            style={{
              ...styles.statsRow,
              flexWrap: isMobile ? "wrap" : "nowrap",
              gap: isMobile ? "12px" : "24px",
            }}
          >
            <div style={styles.statItem}>
              <div style={styles.statValue}>{percentage}%</div>
              <div style={styles.statLabel}>Percentage</div>
            </div>

            <div style={styles.statDivider} />

            <div style={styles.statItem}>
              <div
                style={{
                  ...styles.statValue,
                  color: result.passed ? "#166534" : "#9f1239",
                }}
              >
                {result.passed ? "Passed ✅" : "Failed ❌"}
              </div>
              <div style={styles.statLabel}>Result</div>
            </div>

            <div style={styles.statDivider} />

            <div style={styles.statItem}>
              <div
                style={{
                  ...styles.statValue,
                  color: "#b45309",
                }}
              >
                +{result.coins_earned} 🪙
              </div>
              <div style={styles.statLabel}>Coins Earned</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statValue}>⏱️ {timeTaken || "N/A"}</div>
              <div style={styles.statLabel}>Time Taken</div>
            </div>
          </div>

          {/* Pass/Fail message */}
          {result.passed ? (
            <div style={styles.passMsg}>
              🎉 Congratulations! You passed the {difficulty} quiz and earned{" "}
              {result.coins_earned} coins!
            </div>
          ) : (
            <div style={styles.failMsg}>
              😔 You need 6/10 to pass. Keep practicing and try again!
            </div>
          )}
        </div>

        {/* Question Results */}
        <h3 style={styles.sectionTitle}>📋 Question Review</h3>
        <div style={styles.reviewList}>
          {result.results.map((r, index) => (
            <div
              key={r.question_id}
              style={r.is_correct ? styles.reviewCorrect : styles.reviewWrong}
            >
              <div style={styles.reviewHeader}>
                <span style={styles.reviewQ}>
                  Q{index + 1}. {r.question_text}
                </span>
                <span style={styles.reviewIcon}>
                  {r.is_correct ? "✅" : "❌"}
                </span>
              </div>
              <div
                style={{
                  ...styles.reviewAnswers,
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "4px" : "16px",
                }}
              >
                <span style={styles.yourAnswer}>
                  Your answer: <strong>{r.your_answer}</strong>
                </span>
                {!r.is_correct && (
                  <span style={styles.correctAnswer}>
                    Correct: <strong>{r.correct_answer}</strong>
                  </span>
                )}
              </div>
              {!r.is_correct && (
                <div style={styles.reviewExplanation}>💡 {r.explanation}</div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            ...styles.actionButtons,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <button
            style={styles.retryBtn}
            onClick={() =>
              navigate(`/quiz/${chapterId}/${difficulty}?from=${from}`)
            }
          >
            🔄 Try Again
          </button>
          <button
            style={styles.dashboardBtn}
            onClick={() => navigate("/dashboard")}
          >
            🏠 Go to Dashboard
          </button>
          <button
            style={styles.leaderboardBtn}
            onClick={() =>
              navigate("/leaderboard", {
                state: {
                  from: "quiz-result",
                  result: result,
                  chapterId: chapterId,
                  difficulty: difficulty,
                  quizFrom: from,
                },
              })
            }
          >
            🏆 View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    // backgroundColor: '#f0f4ff',
    background: "linear-gradient(180deg, #e0f2fe 0%, #ffffff 500px)",
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

  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "120px 16px 32px",
  },
  resultCard: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    marginBottom: "32px",
  },
  scoreCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#eef2ff",
    border: "4px solid #4f46e5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  scoreNumber: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#4f46e5",
  },
  scoreLabel: {
    fontSize: "12px",
    color: "#666",
  },
  grade: {
    fontSize: "24px",
    margin: "0 0 24px 0",
  },
  statsRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    marginBottom: "24px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
  },
  statItem: {
    textAlign: "center",
  },
  statValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#333",
  },
  statLabel: {
    fontSize: "12px",
    color: "#888",
    marginTop: "4px",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    backgroundColor: "#e2e8f0",
  },
  passMsg: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#166534",
  },
  failMsg: {
    backgroundColor: "#fff1f2",
    border: "1px solid #fecdd3",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#9f1239",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "16px",
  },
  reviewList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "32px",
  },
  reviewCorrect: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    padding: "16px",
    borderRadius: "12px",
  },
  reviewWrong: {
    backgroundColor: "#fff1f2",
    border: "1px solid #fecdd3",
    padding: "16px",
    borderRadius: "12px",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  reviewQ: {
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
    flex: 1,
    paddingRight: "12px",
  },
  reviewIcon: {
    fontSize: "18px",
  },
  reviewAnswers: {
    display: "flex",
    gap: "16px",
    fontSize: "14px",
    marginBottom: "6px",
  },
  yourAnswer: {
    color: "#666",
  },
  correctAnswer: {
    color: "#166534",
  },
  reviewExplanation: {
    fontSize: "14px",
    color: "#555",
    backgroundColor: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    marginTop: "8px",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
  },
  retryBtn: {
    flex: 1,
    padding: "14px",
    backgroundColor: "#fff1f2",
    border: "2px solid #fecdd3",
    borderRadius: "12px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#9f1239",
  },
  dashboardBtn: {
    flex: 1,
    padding: "14px",
    backgroundColor: "#4f46e5",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
    color: "white",
  },
  leaderboardBtn: {
    flex: 1,
    padding: "14px",
    backgroundColor: "#fff7ed",
    border: "2px solid #fed7aa",
    borderRadius: "12px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#9a3412",
  },
};

export default QuizResult;
