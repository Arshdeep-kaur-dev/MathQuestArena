import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/login/", { username, password });
      login(res.data.user, res.data.tokens.access, res.data.tokens.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError("");

        // Google se user info lo
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const userData = await userInfoRes.json();

        // Backend ko bhejo
        const res = await API.post("/auth/google/", {
          credential: tokenResponse.access_token,
          email: userData.email,
          name: userData.name,
        });

        login(res.data.user, res.data.tokens.access, res.data.tokens.refresh);
        navigate("/dashboard");
      } catch (err) {
        setError("Google login failed! Try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google login failed!");
    },
  });
  return (
    <div style={styles.container}>
      {/* Background Wave Effect */}
      {!isMobile && <div style={styles.waveBackground}></div>}

      <div
        style={{
          ...styles.card,
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "92%" : "90%",
          minHeight: isMobile ? "auto" : "500px",
        }}
      >
        {/* Left Side: Login Form */}
        <div
          style={{
            ...styles.leftSide,
            padding: isMobile ? "30px 24px" : "50px",
          }}
        >
          {/* Mobile Pe Top Purple Banner */}
          {isMobile && (
            <div
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                margin: "-30px -24px 24px -24px",
                padding: "24px",
                textAlign: "center",
                color: "white",
                borderRadius: "35px 35px 0 0",
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
                Welcome Back!
              </h2>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
                Login to continue your journey!
              </p>
            </div>
          )}
          <div style={styles.logo}>🧮</div>
          <h1 style={styles.title}>Hello!</h1>
          <p style={styles.subtitle}>Login to your account</p>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                style={styles.input}
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div style={styles.divider}>
            <span
              style={{
                backgroundColor: "white",
                padding: "0 10px",
                color: "#aaa",
                fontSize: "13px",
              }}
            >
              OR
            </span>
          </div>

          <button style={styles.googleBtn} onClick={() => handleGoogleLogin()}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ marginRight: "10px" }}
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p style={styles.linkText}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>
              SIGN UP
            </Link>
          </p>
        </div>

        {/* Right Side: Welcome Text with Gradient Background */}
        {/* Right Side: Hide on Mobile */}
        {!isMobile && (
          <div style={styles.rightSide}>
            <h2 style={styles.welcomeTitle}>Welcome Back!</h2>
            <p style={styles.welcomeText}>
              Ready to level up your Math skills? Log in to continue your
              journey!
            </p>
          </div>
        )}
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
  // Creating the split wave background effect
  waveBackground: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 50%)", // Rough wave shape
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    backgroundColor: "#ffffff",
    borderRadius: "35px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    width: "90%",
    maxWidth: "900px",
    minHeight: "500px",
    overflow: "hidden",
  },
  leftSide: {
    flex: 1,
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  rightSide: {
    flex: 1,
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", // Same as sample photo
    paddingLeft: "80px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    textAlign: "center",
    // Creating the inner wave curve
    clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 50%)",
  },
  rightContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  featuresList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
    fontSize: "15px",
    opacity: "0.9",
  },
  logo: { fontSize: "40px", marginBottom: "10px" },
  title: { fontSize: "32px", color: "#1e293b", margin: "0", fontWeight: "800" },
  subtitle: { fontSize: "14px", color: "#64748b", marginBottom: "30px" },
  welcomeTitle: { fontSize: "36px", fontWeight: "700", marginBottom: "20px" },
  welcomeText: { fontSize: "16px", lineHeight: "1.6", opacity: "0.9" },

  label: {
    display: "block",
    textAlign: "left",
    marginBottom: "8px",
    fontSize: "13px",
    color: "#4f46e5", // Tuhadi theme wala purple color
    fontWeight: "700",
    marginLeft: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  inputGroup: { marginBottom: "20px" },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: "15px",
    padding: "5px 15px",
    border: "1px solid #e2e8f0",
  },
  inputIcon: { marginRight: "10px", opacity: "0.5" },
  input: {
    width: "100%",
    padding: "12px 5px",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "15px",
  },
  passwordInput: {
    width: "100%",
    padding: "12px 5px",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "15px",
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
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    color: "white",
    border: "none",
    borderRadius: "15px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(99, 102, 241, 0.2)",
    marginTop: "10px",
  },
  btnDisabled: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#cbd5e1",
    color: "white",
    border: "none",
    borderRadius: "15px",
    marginTop: "10px",
    cursor: "not-allowed",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "16px 0",
    borderTop: "1px solid #e2e8f0",
    textAlign: "center",
  },
  googleBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "white",
    border: "1.5px solid #e2e8f0",
    borderRadius: "15px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
    marginTop: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    marginBottom: "15px",
    fontWeight: "600",
  },
  linkText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#64748b",
    textAlign: "center",
  },
  link: { color: "#6366f1", fontWeight: "700", textDecoration: "none" },
};

export default Login;
