import { useState, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields!");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.post("/register/", formData);
      alert(
        "Registration successful! Please check your email to verify your account.",
      );
      navigate("/login");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const firstError = Object.values(errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError("Registration failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Wave Effect */}
      {!isMobile && <div style={styles.waveBackground}></div>}

      <div
        style={{
          ...styles.card,
          width: isMobile ? "94%" : "95%",
          minHeight: isMobile ? "auto" : "300px",
        }}
      >
        {/* LEFT SIDE — Hide on Mobile */}
        {!isMobile && (
          <div style={styles.leftSide}>
            <div style={styles.overlay}>
              <div style={styles.leftContent}>
                <div style={styles.leftLogo}>🧮</div>
                <h1 style={styles.leftTitle}>MathQuest Arena</h1>
                <p style={styles.leftSubtitle}>
                  Learn Mathematics the fun way!
                </p>

                <div style={styles.featuresBox}>
                  <div style={styles.featureItem}>📚 14 NCERT Chapters</div>
                  <div style={styles.featureItem}>🎯 Easy & Hard Quizzes</div>
                  <div style={styles.featureItem}>🪙 Earn Coins & Badges</div>
                  <div style={styles.featureItem}>
                    🏆 Compete on Leaderboard
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div
          style={{
            ...styles.rightSide,
            padding: isMobile ? "0" : "40px 50px 40px 70px",
            clipPath: isMobile
              ? "none"
              : "polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%, 12% 50%)",
          }}
        >
          <div
            style={{
              ...styles.formWrapper,
              paddingLeft: isMobile ? "0" : "20px",
            }}
          >
            {/* Mobile Top Banner */}
            {isMobile && (
              <div
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  margin: "0 0 24px 0",
                  padding: "24px",
                  textAlign: "center",
                  color: "white",
                  borderRadius: "30px 30px 0 0",
                }}
              >
                <div style={{ fontSize: "32px" }}>🧮</div>
                <h2
                  style={{
                    margin: "8px 0 4px",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  MathQuest Arena
                </h2>
                <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
                  Learn Mathematics the fun way!
                </p>
              </div>
            )}

            <h2
              style={{
                ...styles.title,
                padding: isMobile ? "0 24px" : "0",
              }}
            >
              Create Account
            </h2>
            <p
              style={{
                ...styles.subtitle,
                padding: isMobile ? "0 24px" : "0",
              }}
            >
              Join MathQuest Arena today!
            </p>

            {error && (
              <div
                style={{
                  ...styles.error,
                  margin: isMobile ? "0 24px 15px" : "0 0 15px 0",
                }}
              >
                {error}
              </div>
            )}
            <div>
              <div style={styles.inputGroup}>
                <div style={{ padding: isMobile ? "0 24px" : "0" }}></div>
                <label style={styles.label}>Username</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    style={styles.input}
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    style={styles.input}
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    style={styles.passwordInput}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    style={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>✅</span>
                  <input
                    style={styles.passwordInput}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Repeat password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                  <button
                    style={styles.eyeBtn}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                style={loading ? styles.btnDisabled : styles.btn}
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Registering..." : "Create Account"}
              </button>

              <p
                style={{
                  ...styles.linkText,
                  marginBottom: isMobile ? "24px" : "0",
                }}
              >
                Already have an account?{" "}
                <Link to="/login" style={styles.link}>
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  waveBackground: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 50%)",
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    backgroundColor: "#ffffff",
    borderRadius: "30px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    width: "95%",
    maxWidth: "900px",
    minHeight: "300px",
    overflow: "hidden",
  },
  leftSide: {
    flex: 1.1,
    backgroundImage:
      "url(https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1173&auto=format&fit=crop)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(30, 27, 75, 0.6)", // Deep blue-tinted overlay
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },
  leftContent: { textAlign: "center", color: "white" },
  leftLogo: { fontSize: "60px", marginBottom: "10px" },
  leftTitle: { fontSize: "32px", fontWeight: "800", margin: "0 0 10px 0" },
  leftSubtitle: { fontSize: "16px", opacity: "0.9", marginBottom: "35px" },
  featuresBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    textAlign: "left",
  },
  featureItem: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: "12px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  rightSide: {
    flex: 1,
    padding: "40px 50px 40px 70px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%, 12% 50%)", // Curve matching sample
  },
  formWrapper: { width: "100%", paddingLeft: "20px" },
  title: {
    fontSize: "28px",
    color: "#1e1b4b",
    margin: "0 0 5px 0",
    fontWeight: "800",
  },
  subtitle: { fontSize: "14px", color: "#666", marginBottom: "25px" },
  error: {
    backgroundColor: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#9f1239",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "13px",
  },
  inputGroup: { marginBottom: "15px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "12px",
    color: "#6366f1",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "0 15px",
    border: "1px solid #e2e8f0",
  },
  inputIcon: { marginRight: "10px", opacity: "0.4" },
  input: {
    width: "100%",
    padding: "12px 0",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "14px",
    color: "#333",
  },
  passwordInput: {
    width: "100%",
    padding: "12px 0",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "14px",
    color: "#333",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
  },
  btn: {
    width: "100%",
    padding: "14px",
    marginTop: "10px",
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(99, 102, 241, 0.2)",
  },
  btnDisabled: {
    width: "100%",
    padding: "14px",
    marginTop: "10px",
    backgroundColor: "#cbd5e1",
    color: "white",
    border: "none",
    borderRadius: "12px",
  },
  linkText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
  },
  link: { color: "#6366f1", fontWeight: "700", textDecoration: "none" },
};

export default Register;
