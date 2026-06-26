import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import useWindowSize from "../hooks/useWindowSize";

function AITutor() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  // ✅ Load saved chat from localStorage on page open
  useEffect(() => {
    const chatKey = `mathbot_chat_${user?.username}`;
    const saved = localStorage.getItem(chatKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          type: "bot",
          text: "Hello! I'm MathBot 🤖 Your personal Class 6 Math tutor!",
          formatted: false,
        },
      ]);
    }
  }, [user?.username]);

  // ✅ Save chat to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0 && user?.username) {
      const chatKey = `mathbot_chat_${user?.username}`;
      localStorage.setItem(chatKey, JSON.stringify(messages));
    }
  }, [messages, user?.username]);

  const suggestions = [
    "What is LCM and HCF?",
    "Explain fractions simply",
    "What are integers?",
    "How to find area of rectangle?",
    "What is ratio and proportion?",
    "Explain symmetry with example",
  ];

  // ✅ Format answer into bullet points
  const formatAnswer = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line, i) => {
      line = line.trim();
      // Already has bullet
      if (
        line.startsWith("•") ||
        line.startsWith("-") ||
        line.startsWith("*")
      ) {
        return (
          <div key={i} style={styles.bulletPoint}>
            • {line.replace(/^[•\-*]\s*/, "")}
          </div>
        );
      }
      // Numbered list
      if (/^\d+[\.\)]/.test(line)) {
        return (
          <div key={i} style={styles.bulletPoint}>
            {line}
          </div>
        );
      }
      // Bold headers like **text**
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <div key={i} style={styles.boldLine}>
            {line.replace(/\*\*/g, "")}
          </div>
        );
      }
      // Normal paragraph
      return (
        <div key={i} style={styles.normalLine}>
          {line.replace(/\*\*/g, "")}
        </div>
      );
    });
  };

  const askQuestion = async (q = null) => {
    const userQ = q || question;
    if (!userQ.trim()) return;

    const newMessages = [...messages, { type: "user", text: userQ }];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const res = await API.post("/ai-tutor/", { question: userQ });
      setMessages([
        ...newMessages,
        {
          type: "bot",
          text: res.data.answer,
          formatted: true,
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          type: "bot",
          text: "Sorry! I am having trouble answering right now. Please try again!",
          formatted: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const initial = [
      {
        type: "bot",
        text: "Hello! I'm MathBot 🤖 Ask me anything!",
        formatted: false,
      },
    ];
    setMessages(initial);
    const chatKey = `mathbot_chat_${user?.username}`;
    localStorage.removeItem(chatKey);
  };

  return (
    <div style={styles.container}>
      <style>{`
                @keyframes dotBounce {
                    0%, 100% { transform: translateY(0); opacity: 0.4; }
                    50% { transform: translateY(-6px); opacity: 1; }
                }
            `}</style>

      {/* Navbar */}
      <nav
        style={{
          ...styles.navbar,
          padding: isMobile ? "0 16px" : "0 32px",
        }}
      >
        {!isMobile && <h1 style={styles.navLogo}>🧮 MathQuest Arena</h1>}
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
      </nav>

      <div style={styles.main}>
        {/* Header */}
        <div
          style={{
            ...styles.header,
            height: isMobile ? "auto" : "120px",
            flexWrap: isMobile ? "wrap" : "nowrap",
            padding: isMobile ? "16px" : "20px 28px",
          }}
        >
          <div style={styles.botAvatar}>🤖</div>
          <div>
            <h2 style={styles.headerTitle}>MathBot — AI Tutor</h2>
            <p style={styles.headerSubtitle}>
              Powered by AI • Class 6 NCERT Math Expert
            </p>
          </div>
          {!isMobile && <div style={styles.onlineBadge}>● Online</div>}
          {/* ✅ Clear Chat Button */}
          <button
            style={styles.clearBtn}
            onClick={clearChat}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#fee2e2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#fff1f2")
            }
          >
            🗑️ Clear Chat
          </button>
        </div>

        {/* Suggestions */}
        <div style={styles.suggestionsRow}>
          <p style={styles.suggestLabel}>Quick Questions:</p>
          <div style={styles.suggestions}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                style={styles.suggestionBtn}
                onClick={() => askQuestion(s)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#6366f1";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#6366f1";
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        <div
          style={{
            ...styles.chatBox,
            minHeight: isMobile ? "300px" : "400px",
            maxHeight: isMobile ? "400px" : "500px",
            padding: isMobile ? "16px" : "24px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.messageRow,
                justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.type === "bot" && <div style={styles.botIcon}>🤖</div>}
              <div
                style={{
                  ...styles.messageBubble,
                  ...(msg.type === "user"
                    ? styles.userBubble
                    : styles.botBubble),
                  maxWidth: isMobile ? "85%" : "75%",
                  fontSize: isMobile ? "14px" : "15px",
                }}
              >
                {/* ✅ Formatted or plain text */}
                {msg.formatted ? formatAnswer(msg.text) : msg.text}
              </div>
              {msg.type === "user" && <div style={styles.userIcon}>👤</div>}
            </div>
          ))}

          {loading && (
            <div style={styles.messageRow}>
              <div style={styles.botIcon}>🤖</div>
              <div style={styles.typingBubble}>
                <span style={{ ...styles.dot, animationDelay: "0s" }}>●</span>
                <span style={{ ...styles.dot, animationDelay: "0.2s" }}>●</span>
                <span style={{ ...styles.dot, animationDelay: "0.4s" }}>●</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={styles.inputArea}>
          <input
            style={styles.input}
            type="text"
            placeholder="Ask any math question... (e.g. What is LCM?)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            disabled={loading}
          />
          <button
            style={loading ? styles.sendBtnDisabled : styles.sendBtn}
            onClick={() => askQuestion()}
            disabled={loading}
          >
            {loading ? "..." : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
  },
  navbar: {
    height: "82px",
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
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
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    padding: "8px 18px",
    borderRadius: "12px",
    transition: "0.3s",
  },
  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "100px 16px 32px",
  },
  header: {
    background: "linear-gradient(180deg, #bbdff7 0%, #ffffff 100%)",
    borderRadius: "20px",
    height: "120px",
    padding: "20px 28px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  botAvatar: {
    fontSize: "36px",
    backgroundColor: "#eef2ff",
    borderRadius: "50%",
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  headerSubtitle: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },
  onlineBadge: {
    marginLeft: "auto",
    color: "#10b981",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#f0fdf4",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  clearBtn: {
    backgroundColor: "#fff1f2",
    color: "#ef4444",
    border: "1px solid #fecdd3",
    padding: "6px 14px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  suggestionsRow: {
    backgroundColor: "#faebf8",
    borderRadius: "16px",
    padding: "16px 20px",
    marginBottom: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  suggestLabel: {
    fontSize: "13px",
    // color: '#888',
    color: "#7355f7",
    fontWeight: "600",
    margin: "0 0 10px 0",
    textTransform: "uppercase",
  },
  suggestions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  suggestionBtn: {
    padding: "6px 14px",
    backgroundColor: "white",
    color: "#6366f1",
    border: "1.5px solid #6366f1",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  chatBox: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "16px",
    minHeight: "400px",
    maxHeight: "500px",
    overflowY: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  botIcon: { fontSize: "24px", flexShrink: 0 },
  userIcon: { fontSize: "24px", flexShrink: 0 },
  messageBubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "18px",
    fontSize: "15px",
    lineHeight: "1.7",
  },
  botBubble: {
    backgroundColor: "#eef2ff",
    color: "#1e293b",
    borderBottomLeftRadius: "4px",
  },
  userBubble: {
    background: "linear-gradient(90deg, #6366f1, #a855f7)",
    color: "white",
    borderBottomRightRadius: "4px",
  },
  // ✅ Formatting styles
  bulletPoint: {
    paddingLeft: "8px",
    marginBottom: "6px",
    borderLeft: "3px solid #6366f1",
    paddingLeft: "10px",
  },
  boldLine: {
    fontWeight: "700",
    marginBottom: "6px",
    marginTop: "8px",
    color: "#1e1b4b",
    fontSize: "15px",
  },
  normalLine: {
    marginBottom: "6px",
  },
  typingBubble: {
    backgroundColor: "#eef2ff",
    padding: "12px 20px",
    borderRadius: "18px",
    borderBottomLeftRadius: "4px",
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
  dot: {
    fontSize: "10px",
    color: "#6366f1",
    animation: "dotBounce 1s ease infinite",
    display: "inline-block",
  },
  inputArea: {
    display: "flex",
    gap: "12px",
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "12px 16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    border: "2px solid #eef2ff",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: "#333",
    backgroundColor: "transparent",
  },
  sendBtn: {
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "700",
  },
  sendBtnDisabled: {
    backgroundColor: "#a5b4fc",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "not-allowed",
  },
};

export default AITutor;
