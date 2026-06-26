import { useState, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayText, setDisplayText] = useState("");

  const mathFacts = [
    "Did you know? 'googol' is the number 1 followed by 100 zeros! 😮",
    "Mathematics is the queen of sciences. — Carl Friedrich Gauss 👑",
    "The word 'hundred' comes from Old Norse 'hundrath', meaning 120! 🔢",
    "Pi (π) is an irrational number; it never ends and never repeats! 🥧",
    "Zero (0) is the only number that cannot be represented in Roman numerals! 🚫",
    "Every odd number has an 'e' in it (One, Three, Five, Seven, Nine...)! 😲",
    "The equals sign (=) was invented by Robert Recorde in 1557! 🧐",
    "Multiplication was once considered so difficult only experts could do it! 🤯",
  ];
  const [randomFact] = useState(
    mathFacts[Math.floor(Math.random() * mathFacts.length)],
  );
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!user?.username) return;
    const fullText = `Welcome back, ${user.username}! 🎉`;
    let i = 0;
    setDisplayText("");
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, [user?.username]);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile/");
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      await API.post("/logout/", { refresh });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      navigate("/login");
    }
  };

  // ✅ Functions component ke andar — not in styles object
  const handleHover = (e, color) => {
    e.currentTarget.style.transform = "translateY(-5px)";
    e.currentTarget.style.borderBottom = `4px solid ${color}`;
    e.currentTarget.style.borderColor = color;
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
  };
  const handleLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.borderBottom = "4px solid transparent";
    e.currentTarget.style.borderColor = "#d1d5db";
    e.currentTarget.style.boxShadow = "none";
  };
  const handleStatHover = (e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
  };
  const handleStatLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
  };

  const navLinks = [
    { label: "📚 Learning", path: "/learning" },
    { label: "🧠 Quizzes", path: "/quiz" },
    { label: "🏅 Leaderboard", path: "/leaderboard" },
    { label: "📓 Notes", path: "/notes" },
    { label: "🤖 AI Tutor", path: "/ai-tutor" },
  ];

  const quickLinks = [
    {
      icon: "📚",
      title: "Learning Hub",
      desc: "Watch videos & read lessons",
      path: "/learning",
      bg: "#eef2ff",
      color: "#6366f1",
    },
    {
      icon: "🧠",
      title: "Quizzes",
      desc: "Test your knowledge & earn coins",
      path: "/quiz",
      bg: "#f0fdf4",
      color: "#10b981",
    },
    {
      icon: "🏅",
      title: "Leaderboard",
      desc: "Top 10 students ranking",
      path: "/leaderboard",
      bg: "#fffbeb",
      color: "#f59e0b",
    },
    {
      icon: "📓",
      title: "My Notes",
      desc: "Write & save your notes",
      path: "/notes",
      bg: "#faf5ff",
      color: "#8b5cf6",
    },
    {
      icon: "👤",
      title: "My Profile",
      desc: "View stats & badges",
      path: "/profile",
      bg: "#fff1f2",
      color: "#ef4444",
    },
    {
      icon: "🤖",
      title: "AI Tutor",
      desc: "Ask any math question!",
      path: "/ai-tutor",
      bg: "#f0f9ff",
      color: "#0ea5e9",
    },
  ];

  const stats = [
    { icon: "🪙", val: profile?.user?.total_coins || 0, label: "Total Coins" },
    { icon: "🏆", val: profile?.badges?.length || 0, label: "Badges Earned" },
    { icon: "📝", val: profile?.total_attempts || 0, label: "Quiz Attempts" },
    { icon: "✅", val: profile?.total_passed || 0, label: "Quizzes Passed" },
  ];

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navLogo}>🧮 MathQuest Arena</h1>

        {!isMobile && (
          <div style={styles.navLinks}>
            {navLinks.map((link) => (
              <span
                key={link.path}
                style={{
                  ...styles.navLink,
                  ...(location.pathname === link.path
                    ? styles.navLinkActive
                    : {}),
                }}
                onClick={() => navigate(link.path)}
                onMouseEnter={(e) => {
                  if (location.pathname !== link.path) {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.textDecoration = "underline";
                    e.currentTarget.style.textUnderlineOffset = "4px";
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== link.path) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    e.currentTarget.style.textDecoration = "none";
                  }
                }}
              >
                {link.label}
              </span>
            ))}
          </div>
        )}

        <div style={styles.navRight}>
          <div
            style={styles.avatarWrapper}
            onClick={() => navigate("/profile")}
          >
            <div style={styles.avatarCircle}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span style={styles.avatarName}>My Profile</span>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <div
          style={{
            ...styles.welcomeOverlay,
            height: isMobile ? "200px" : "320px",
            padding: isMobile ? "0 24px" : "0 80px",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isMobile ? "center" : "space-between",
          }}
        >
          <div style={styles.welcomeLeft}>
            <h2
              style={{
                ...styles.welcomeText,
                fontSize: isMobile ? "20px" : "32px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              {displayText}
              <span style={styles.cursor}>|</span>
            </h2>
            <p
              style={{
                ...styles.welcomeSubtext,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              Let's solve some equations today.
            </p>
          </div>

          {/* Floating Math Symbols */}
          {/* Floating Math Symbols - Hide on Mobile */}
          {!isMobile && (
            <div style={styles.floatingSymbols}>
              {[
                "π",
                "∑",
                "√",
                "∞",
                "÷",
                "×",
                "=",
                "%",
                "θ",
                "Δ",
                "+",
                "−",
                "&",
                "||",
                "<",
              ].map((sym, i) => (
                <span
                  key={i}
                  style={{
                    ...styles.floatingSym,
                    animationDelay: `${i * 0.3}s`,
                    left: `${10 + (i % 5) * 20}%`,
                    top: `${10 + Math.floor(i / 5) * 40}%`,
                    fontSize:
                      i % 3 === 0 ? "28px" : i % 3 === 1 ? "20px" : "24px",
                    opacity: 0.3 + (i % 3) * 0.15,
                  }}
                >
                  {sym}
                </span>
              ))}
            </div>
          )}

          {!isMobile && (
            <div style={styles.welcomeRight}>
              <div style={styles.mathFactBox}>
                <span style={styles.mathFactLabel}>MATH FACT:</span>
                <p style={styles.mathFactText}>{randomFact}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Progress Bars */}
        {!loading && profile && (
          <div style={styles.progressSection}>
            <div style={styles.progressItem}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>📚 Chapters Completed</span>
                <span style={styles.progressPercent}>
                  {Math.min(profile?.total_passed, 14)}/14
                </span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${(Math.min(profile?.total_passed, 14) / 14) * 100}%`,
                    backgroundColor: "#6366f1",
                  }}
                />
              </div>
            </div>

            <div style={styles.progressItem}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>🪙 Coins Earned</span>
                <span style={styles.progressPercent}>
                  {profile?.user?.total_coins}/140
                </span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${Math.min((profile?.user?.total_coins / 140) * 100, 100)}%`,
                    backgroundColor: "#f59e0b",
                  }}
                />
              </div>
            </div>

            <div style={styles.progressItem}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>🏆 Badges Earned</span>
                <span style={styles.progressPercent}>
                  {profile?.badges?.length}/7
                </span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${(profile?.badges?.length / 7) * 100}%`,
                    backgroundColor: "#10b981",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <h3 style={styles.sectionTitle}>Performance Overview</h3>
        <div
          style={{
            ...styles.statsRow,
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={styles.statCard}
              onMouseEnter={handleStatHover}
              onMouseLeave={handleStatLeave}
            >
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={styles.statValue}>{stat.val}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <h3 style={styles.sectionTitle}>Quick Access</h3>
        <div
          style={{
            ...styles.quickAccessSection,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* Left Cards */}
          <div style={styles.cardsColumn}>
            {quickLinks.map((item, i) => (
              <div
                key={i}
                style={{ ...styles.card, background: item.bg }}
                onClick={() => navigate(item.path)}
                onMouseEnter={(e) => handleHover(e, item.color)}
                onMouseLeave={handleLeave}
              >
                <div style={styles.cardRow}>
                  <div
                    style={{
                      ...styles.cardIcon,
                      fontSize: isMobile ? "28px" : "50px",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={styles.cardTitle}>{item.title}</div>
                    <p style={styles.cardDesc}>{item.desc}</p>
                  </div>
                  <span style={styles.cardArrow}>→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Image */}
          {/* Right Image - Hide on Mobile */}
          {!isMobile && (
            <div style={styles.quickAccessImage}>
              <div style={styles.imageOverlay}></div>
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLeft}>
            <span style={styles.footerLogo}>🧮 MathQuest Arena</span>
            <span style={styles.footerSub}>
              NCERT Class 6 Maths Learning Platform
            </span>
          </div>
          <div
            style={{
              ...styles.footerRight,
              flexWrap: isMobile ? "wrap" : "nowrap",
              gap: isMobile ? "12px" : "20px",
            }}
          >
            <span
              style={styles.footerLink}
              onClick={() => navigate("/learning")}
            >
              Learning
            </span>
            <span style={styles.footerLink} onClick={() => navigate("/quiz")}>
              Quizzes
            </span>
            <span
              style={styles.footerLink}
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </span>
            <span
              style={styles.footerLink}
              onClick={() => navigate("/profile")}
            >
              Profile
            </span>
          </div>
          <div style={styles.footerCopy}>
            © 2026 MathQuest Arena. Made with ❤️ for Class 6 students.
          </div>
        </div>
      </footer>
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
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
  },
  navLinks: {
    display: "flex",
    gap: "8px",
    marginLeft: "auto",
    marginRight: "100px",
  },
  navLink: {
    // color: 'rgba(255,255,255,0.8)',
    color: "rgba(255, 255, 255, 0.99)",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "500",
    transition: "all 0.2s",
    textDecoration: "none",
    display: "inline-block",
  },
  navLinkActive: {
    color: "white",
    fontWeight: "900",
    textDecoration: "underline",
    textUnderlineOffset: "4px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
  },
  avatarWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    gap: "2px",
  },
  avatarCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "white",
    color: "#6366f1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
    fontSize: "16px",
  },
  avatarName: {
    color: "white",
    fontSize: "10px",
  },
  logoutBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.4)",
    color: "rgba(255, 255, 255, 0.99)",
    padding: "6px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
  },
  welcomeCard: {
    marginTop: "82px",
    backgroundImage:
      "url(https://plus.unsplash.com/premium_photo-1677187301443-74dca448fe50?q=80&w=691&auto=format&fit=crop)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    borderRadius: "0 0 90px 90px",
    overflow: "hidden",
  },
  welcomeOverlay: {
    background:
      "linear-gradient(90deg, rgba(99,102,241,0.88) 0%, rgba(168,85,247,0.88) 100%)",
    height: "320px",
    padding: "0 80px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
  },
  welcomeLeft: {},
  welcomeText: {
    color: "white",
    fontSize: "32px",
    fontWeight: "900",
    margin: "0 0 8px 0",
  },
  cursor: {
    color: "#ffca28",
    animation: "blink 1s infinite",
    marginLeft: "2px",
  },
  welcomeSubtext: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "16px",
    margin: 0,
  },
  welcomeRight: {},
  mathFactBox: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "15px",
    color: "white",
    maxWidth: "400px",
    marginTop: "15px",
    // marginRight: '400px',
    borderLeft: "4px solid #ffca28",
    backdropFilter: "blur(5px)",
    alignSelf: "flex-start",
  },

  mathFactLabel: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#ffca28",
  },
  mathFactText: {
    margin: "5px 0 0 0",
    fontSize: "18px",
    lineHeight: "1.5",
  },
  floatingSymbols: {
    position: "relative",
    width: "200px",
    height: "280px",
    flexShrink: 0,
  },
  floatingSym: {
    position: "absolute",
    color: "white",
    fontWeight: "700",
    animation: "floatUpDown 3s ease-in-out infinite alternate",
    userSelect: "none",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 16px",
  },
  sectionTitle: {
    color: "#6366f1",
    marginBottom: "15px",
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 15px 0",
  },
  progressSection: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  progressItem: {
    marginBottom: "16px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  progressLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#444",
  },
  progressPercent: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#6366f1",
  },
  progressBar: {
    background: "#f0f0f0",
    height: "10px",
    borderRadius: "10px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 1s ease-in-out",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    borderBottom: "4px solid #6366f1",
    transition: "all 0.3s ease",
    textAlign: "center",
  },
  statIcon: {
    fontSize: "24px",
    marginBottom: "5px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#6366f1",
  },
  statLabel: {
    fontSize: "15px",
    color: "#666",
  },
  quickAccessSection: {
    display: "flex",
    gap: "30px",
    alignItems: "stretch",
  },
  cardsColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  card: {
    padding: "18px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid #d1d5db",
    borderBottom: "4px solid transparent",
  },
  cardRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  cardIcon: {
    fontSize: "50px",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "2px",
  },
  cardDesc: {
    fontSize: "12px",
    color: "#666",
    margin: 0,
  },
  cardArrow: {
    marginLeft: "auto",
    fontSize: "18px",
    color: "#aaa",
    flexShrink: 0,
  },
  quickAccessImage: {
    width: "500px",
    flexShrink: 0,
    borderRadius: "20px",
    overflow: "hidden",
    backgroundImage:
      "url(https://plus.unsplash.com/premium_photo-1733342496376-79a1ad8c30ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y29uZmlkZW50JTIwNnRoJTIwZ3JhZGUlMjBtYXRocyUyMGdyb3VwJTIwc3R1ZGVudHxlbnwwfHwwfHx8MA%3D%3D)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 15px 35px rgba(99,102,241,0.2)",
  },
  imageOverlay: {
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(135deg, rgba(99,102,241,0.30) 0%, rgba(168,85,247,0.30) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    minHeight: "500px",
    boxSizing: "border-box",
  },
  imageContent: {
    textAlign: "center",
    color: "white",
  },
  imageIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  imageTitle: {
    fontSize: "22px",
    fontWeight: "800",
    margin: "0 0 8px 0",
    color: "white",
  },
  imageSubtitle: {
    fontSize: "13px",
    opacity: "0.9",
    marginBottom: "24px",
    lineHeight: "1.5",
  },
  imageBadges: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  imageBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    border: "1px solid rgba(255,255,255,0.25)",
  },
  footer: {
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    marginTop: "40px",
    padding: "24px 32px",
  },
  footerContent: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  footerLeft: { display: "flex", flexDirection: "column", gap: "4px" },
  footerLogo: { color: "white", fontSize: "16px", fontWeight: "700" },
  footerSub: { color: "rgba(255,255,255,0.7)", fontSize: "12px" },
  footerRight: { display: "flex", gap: "20px" },
  footerLink: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
  },
  footerCopy: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "12px",
    width: "100%",
    textAlign: "center",
    marginTop: "8px",
  },
};

export default Dashboard;
