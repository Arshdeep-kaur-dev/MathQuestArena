import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import API from "../api/axios";
import useWindowSize from "../hooks/useWindowSize";
function QuizPage() {
  const { chapterId, difficulty } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from") || "quiz";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  // Timer
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!loading) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const fetchQuestions = async () => {
    try {
      const res = await API.get(`/quiz/${chapterId}/${difficulty}/`);
      setQuestions(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load questions!");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (option) => {
    if (isAnswered || checking) return;
    setSelectedAnswer(option);
    setChecking(true);

    const currentQuestion = questions[currentIndex];

    if (!answers[currentQuestion.id]) {
      const newAnswers = { ...answers, [currentQuestion.id]: option };
      setAnswers(newAnswers);
    }

    try {
      const res = await API.post("/quiz/submit/", {
        chapter_id: parseInt(chapterId),
        difficulty: difficulty,
        answers: { [currentQuestion.id]: option },
      });
      const result = res.data.results[0];
      setIsCorrect(result.is_correct);
      setExplanation(result.explanation);
      setIsAnswered(true);
    } catch (err) {
      console.error("Error checking answer:", err);
    } finally {
      setChecking(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      submitFullQuiz();
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setExplanation("");
      setChecking(false);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setExplanation("");
    setChecking(false);
  };

  const submitFullQuiz = async () => {
    clearInterval(timerRef.current);
    try {
      const res = await API.post("/quiz/submit/", {
        chapter_id: parseInt(chapterId),
        difficulty: difficulty,
        answers: answers,
      });
      navigate("/quiz/result", {
        state: {
          result: res.data,
          chapterId,
          difficulty,
          from,
          timeTaken: formatTime(seconds),
        },
      });
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const getOptionStyle = (option) => {
    if (checking) return styles.optionChecking;
    if (!isAnswered) return styles.option;
    if (option === selectedAnswer && isCorrect) return styles.optionCorrect;
    if (option === selectedAnswer && !isCorrect) return styles.optionWrong;
    return styles.option;
  };

  if (loading) return <div style={styles.loading}>Loading questions...</div>;
  if (error) return <div style={styles.loading}>{error}</div>;

  const currentQuestion = questions[currentIndex];
  const options = [
    { key: "A", text: currentQuestion.option_a },
    { key: "B", text: currentQuestion.option_b },
    { key: "C", text: currentQuestion.option_c },
    { key: "D", text: currentQuestion.option_d },
  ];

  return (
    <div style={styles.container}>
      <nav
        style={{
          ...styles.navbar,
          padding: isMobile ? "0 16px" : "0px 40px",
        }}
      >
        {!isMobile && <h1 style={styles.navLogo}>🎮 MathQuest Arena</h1>}
        <div style={styles.navRight}>
          <div style={styles.timer}>⏱️ {formatTime(seconds)}</div>
          <button
            style={styles.backBtn}
            onClick={() => {
              clearInterval(timerRef.current);
              if (from === "video") navigate(`/learning/${chapterId}/video`);
              else if (from === "reading")
                navigate(`/learning/${chapterId}/reading`);
              else if (from === "chapter") navigate(`/learning/${chapterId}`);
              else navigate("/quiz");
            }}
          >
            ← Exit Quiz
          </button>
        </div>
      </nav>

      <div style={styles.main}>
        <div style={styles.progressContainer}>
          <div style={styles.progressInfo}>
            <span style={styles.progressText}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span style={styles.difficultyBadge(difficulty)}>
              {difficulty === "easy" ? "🟢 Easy" : "🔴 Hard"}
            </span>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            ...styles.questionCard,
            padding: isMobile ? "20px" : "32px",
          }}
        >
          <div style={styles.questionNumber}>Q{currentIndex + 1}.</div>
          <p
            style={{
              ...styles.questionText,
              fontSize: isMobile ? "16px" : "18px",
            }}
          >
            {currentQuestion.question_text}
          </p>
        </div>

        <div style={styles.optionsContainer}>
          {options.map((opt) => (
            <div
              key={opt.key}
              style={getOptionStyle(opt.key)}
              onClick={() => handleAnswer(opt.key)}
            >
              <span style={styles.optionKey}>{opt.key}</span>
              <span style={styles.optionText}>{opt.text}</span>
            </div>
          ))}
        </div>

        {checking && (
          <div style={styles.checkingCard}>⏳ Checking answer...</div>
        )}

        {isAnswered && !isCorrect && (
          <div style={styles.explanationCard}>
            <div style={styles.wrongMsg}>❌ Wrong Answer!</div>
            <p style={styles.explanationText}>💡 {explanation}</p>
            <div
              style={{
                ...styles.actionButtons,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <button style={styles.tryAgainBtn} onClick={handleTryAgain}>
                🔄 Try Again
              </button>
              <button style={styles.nextBtn} onClick={handleNext}>
                {currentIndex + 1 >= questions.length
                  ? "Finish Quiz 🏁"
                  : "Next Question →"}{" "}
              </button>
            </div>
          </div>
        )}

        {isAnswered && isCorrect && (
          <div style={styles.correctCard}>
            <div style={styles.correctMsg}>✅ Correct!</div>
            <button style={styles.nextBtn} onClick={handleNext}>
              {currentIndex + 1 >= questions.length
                ? "🏁 Finish Quiz"
                : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    // backgroundColor: '#f8fafc',
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
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  timer: {
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "6px 14px",
    borderRadius: "20px",
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    padding: "8px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.3s",
  },
  loading: {
    textAlign: "center",
    padding: "100px",
    color: "#6366f1",
  },
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "120px 16px 32px",
  },
  progressContainer: {
    marginBottom: "32px",
  },
  progressInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  progressText: {
    // marginTop: '100px',
    fontSize: "14px",
    color: "#666",
  },
  difficultyBadge: (difficulty) => ({
    backgroundColor: difficulty === "easy" ? "#dcfce7" : "#fee2e2",
    color: difficulty === "easy" ? "#166534" : "#991b1b",
    padding: "4px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  }),
  progressBar: {
    backgroundColor: "#e2e8f0",
    borderRadius: "20px",
    height: "12px",
    width: "100%",
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: "#4f46e5",
    height: "100%",
    borderRadius: "20px",
    transition: "width 0.3s ease",
  },
  questionCard: {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "14px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    border: "1px solid #eef2ff",
  },
  questionNumber: {
    fontSize: "16px",
    color: "#4f46e5",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  questionText: {
    fontSize: "18px",
    color: "#333",
    lineHeight: "1.6",
    margin: 0,
    fontWeight: "500",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "24px",
  },
  option: {
    backgroundColor: "white",
    padding: "18px 22px",
    borderRadius: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "2px solid transparent",
    transition: "all 0.2s",
  },
  optionChecking: {
    backgroundColor: "#f8fafc",
    padding: "16px 20px",
    borderRadius: "12px",
    cursor: "wait",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "2px solid transparent",
    opacity: 0.7,
  },
  optionCorrect: {
    backgroundColor: "#f0fdf4",
    padding: "16px 20px",
    borderRadius: "12px",
    cursor: "default",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    border: "2px solid #86efac",
  },
  optionWrong: {
    backgroundColor: "#fff1f2",
    padding: "16px 20px",
    borderRadius: "12px",
    cursor: "default",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    border: "2px solid #fecdd3",
  },
  optionKey: {
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },
  optionText: {
    fontSize: "16px",
    color: "#333",
  },
  checkingCard: {
    backgroundColor: "#eef2ff",
    border: "2px solid #c7d2fe",
    padding: "16px 20px",
    borderRadius: "16px",
    textAlign: "center",
    color: "#4f46e5",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  explanationCard: {
    backgroundColor: "#fff1f2",
    border: "2px solid #fecdd3",
    padding: "20px",
    borderRadius: "16px",
  },
  wrongMsg: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#9f1239",
    marginBottom: "8px",
  },
  explanationText: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "16px",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
  },
  tryAgainBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "white",
    border: "2px solid #fecdd3",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#9f1239",
  },
  nextBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#4f46e5",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
    color: "white",
  },
  correctCard: {
    backgroundColor: "#f0fdf4",
    border: "2px solid #86efac",
    padding: "20px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  correctMsg: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#166534",
  },
};

export default QuizPage;
