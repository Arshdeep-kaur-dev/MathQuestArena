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

// import { useState, useEffect } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import API from '../api/axios'

// function Login() {
//     const navigate = useNavigate()
//     const { login } = useAuth()
//     const [username, setUsername] = useState('')
//     const [password, setPassword] = useState('')
//     const [showPassword, setShowPassword] = useState(false)
//     const [error, setError] = useState('')
//     const [loading, setLoading] = useState(false)

//     // Animation States
//     const [step, setStep] = useState('student-walking')

//     useEffect(() => {
//         // 1. Student walks slowly for 4 seconds
//         const timer1 = setTimeout(() => setStep('student-stop'), 4000);
//         // 2. After a small pause at center, the form pops out
//         const timer2 = setTimeout(() => setStep('form-pop'), 4800);

//         return () => {
//             clearTimeout(timer1);
//             clearTimeout(timer2);
//         }
//     }, [])

//     const handleLogin = async () => {
//         if (!username || !password) {
//             setError('Please fill in all fields!')
//             return
//         }
//         setLoading(true)
//         try {
//             const res = await API.post('/login/', { username, password })
//             login(res.data.user, res.data.tokens.access, res.data.tokens.refresh)
//             navigate('/dashboard')
//         } catch (err) {
//             setError(err.response?.data?.error || 'Login failed!')
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <div style={styles.container}>
//             {/* 1. Slow Walking Student & Bag */}
//             {step !== 'form-pop' && (
//                 <div style={{
//                     ...styles.studentWrapper,
//                     animation: step === 'student-walking'
//                         ? 'slowWalk 4s linear forwards'
//                         : 'shrinkAndFade 0.5s ease-in forwards'
//                 }}>
//                     <div style={styles.characterContainer}>
//                         <span style={styles.studentEmoji}>🏃‍♂️</span>
//                         <span style={styles.bagEmoji}>🎒</span>
//                     </div>
//                     <p style={styles.walkingText}>Going to MathQuest...</p>
//                 </div>
//             )}

//             {/* 2. Your Original Login Design */}
//             {step === 'form-pop' && (
//                 <div style={styles.formEntranceWrapper}>
//                     <div style={styles.waveBackground}></div>
//                     <div style={styles.card}>
//                         <div style={styles.leftSide}>
//                             <div style={styles.logo}>🧮</div>
//                             <h1 style={styles.title}>Hello!</h1>
//                             <p style={styles.subtitle}>Login to your account</p>

//                             {error && <div style={styles.error}>{error}</div>}

//                             <div style={styles.inputGroup}>
//                                 <label style={styles.label}>Username</label>
//                                 <div style={styles.inputWrapper}>
//                                     <span style={styles.inputIcon}>👤</span>
//                                     <input
//                                         style={styles.input}
//                                         type="text"
//                                         placeholder="Username"
//                                         value={username}
//                                         onChange={(e) => setUsername(e.target.value)}
//                                     />
//                                 </div>
//                             </div>

//                             <div style={styles.inputGroup}>
//                                 <label style={styles.label}>Password</label>
//                                 <div style={styles.inputWrapper}>
//                                     <span style={styles.inputIcon}>🔒</span>
//                                     <input
//                                         style={styles.passwordInput}
//                                         type={showPassword ? 'text' : 'password'}
//                                         placeholder="Password"
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                     />
//                                     <button style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
//                                         {showPassword ? '🙈' : '👁️'}
//                                     </button>
//                                 </div>
//                             </div>

//                             <button style={loading ? styles.btnDisabled : styles.btn} onClick={handleLogin} disabled={loading}>
//                                 {loading ? 'Logging in...' : 'Login'}
//                             </button>

//                             <p style={styles.linkText}>
//                                 Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
//                             </p>
//                         </div>

//                         <div style={styles.rightSide}>
//                             <h2 style={styles.welcomeTitle}>Welcome Back!</h2>
//                             <p style={styles.welcomeText}>
//                                 Ready to level up your Math skills? Log in to continue your journey!
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <style>{`
//                 @keyframes slowWalk {
//                     0% { left: -100px; transform: rotate(0deg); }
//                     10% { transform: rotate(-5deg) translateY(-5px); }
//                     20% { transform: rotate(5deg) translateY(0px); }
//                     30% { transform: rotate(-5deg) translateY(-5px); }
//                     40% { transform: rotate(5deg) translateY(0px); }
//                     50% { transform: rotate(-5deg) translateY(-5px); }
//                     60% { transform: rotate(5deg) translateY(0px); }
//                     70% { transform: rotate(-5deg) translateY(-5px); }
//                     80% { transform: rotate(5deg) translateY(0px); }
//                     90% { transform: rotate(-5deg) translateY(-5px); }
//                     100% { left: 50%; transform: translateX(-50%) rotate(0deg); }
//                 }
//                 @keyframes shrinkAndFade {
//                     0% { transform: translateX(-50%) scale(1); opacity: 1; }
//                     100% { transform: translateX(-50%) scale(0); opacity: 0; }
//                 }
//                 @keyframes formPopUp {
//                     0% { transform: scale(0.3); opacity: 0; filter: blur(10px); }
//                     70% { transform: scale(1.05); }
//                     100% { transform: scale(1); opacity: 1; filter: blur(0); }
//                 }
//             `}</style>
//         </div>
//     )
// }

// const styles = {
//     container: {
//         minHeight: '100vh',
//         backgroundColor: '#f0f2f5',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontFamily: "'Poppins', sans-serif",
//         position: 'relative',
//         overflow: 'hidden',
//     },
//     studentWrapper: {
//         position: 'absolute',
//         textAlign: 'center',
//         width: '200px'
//     },
//     characterContainer: {
//         position: 'relative',
//         fontSize: '60px',
//         display: 'inline-block'
//     },
//     studentEmoji: {
//         display: 'inline-block', transform: 'scaleX(-1)', // Is naal emoji da face Right side vall ho jayega
//         fontSize: '60px'
//     },
//     bagEmoji: {
//         position: 'absolute',
//         fontSize: '30px',
//         bottom: '5px',
//         right: '-10px'
//     },
//     walkingText: {
//         marginTop: '10px',
//         fontWeight: '600',
//         color: '#6366f1',
//         fontSize: '16px',
//         letterSpacing: '1px'
//     },
//     formEntranceWrapper: {
//         width: '100%',
//         height: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         animation: 'formPopUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
//     },
//     // --- Original UI Styles (Untouched) ---
//     waveBackground: {
//         position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
//         background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
//         clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 50%)', zIndex: 0,
//     },
//     card: {
//         position: 'relative', zIndex: 1, display: 'flex', backgroundColor: '#ffffff',
//         borderRadius: '35px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', width: '90%', maxWidth: '900px', overflow: 'hidden',
//     },
//     leftSide: { flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
//     rightSide: {
//         flex: 1, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', paddingLeft: '80px',
//         display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
//         color: '#ffffff', textAlign: 'center', clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 50%)',
//     },
//     logo: { fontSize: '40px', marginBottom: '10px' },
//     title: { fontSize: '32px', color: '#1e293b', margin: '0', fontWeight: '800' },
//     subtitle: { fontSize: '14px', color: '#64748b', marginBottom: '30px' },
//     welcomeTitle: { fontSize: '36px', fontWeight: '700', marginBottom: '20px' },
//     welcomeText: { fontSize: '16px', lineHeight: '1.6', opacity: '0.9', paddingRight: '20px' },
//     label: { display: 'block', marginBottom: '8px', fontSize: '13px', color: '#4f46e5', fontWeight: '700' },
//     inputGroup: { marginBottom: '20px' },
//     inputWrapper: { display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '15px', padding: '5px 15px', border: '1px solid #e2e8f0' },
//     inputIcon: { marginRight: '10px', opacity: '0.5' },
//     input: { width: '100%', padding: '12px 5px', border: 'none', outline: 'none', backgroundColor: 'transparent' },
//     passwordInput: { width: '100%', padding: '12px 5px', border: 'none', outline: 'none', backgroundColor: 'transparent' },
//     eyeBtn: { background: 'none', border: 'none', cursor: 'pointer' },
//     btn: { width: '100%', padding: '14px', background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },
//     btnDisabled: { width: '100%', padding: '14px', backgroundColor: '#cbd5e1', color: 'white', border: 'none', borderRadius: '15px', marginTop: '10px' },
//     error: { color: '#ef4444', fontSize: '13px', marginBottom: '15px' },
//     linkText: { marginTop: '20px', fontSize: '14px', textAlign: 'center' },
//     link: { color: '#6366f1', fontWeight: '700', textDecoration: 'none' },
// }

// export default Login
