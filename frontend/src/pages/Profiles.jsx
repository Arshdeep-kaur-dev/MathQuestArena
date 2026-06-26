import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import useWindowSize from "../hooks/useWindowSize";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateData, setUpdateData] = useState({
    username: "",
    new_password: "",
    confirm_password: "",
  });
  const [updateMsg, setUpdateMsg] = useState("");
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile/");
      setProfile(res.data);
      setUpdateData((prev) => ({
        ...prev,
        username: res.data.user.username,
      }));
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdateMsg("");
    setUpdateError("");
    try {
      await API.put("/profile/update/", updateData);
      setShowUpdate(false);
      setUpdateMsg("Profile updated successfully! ✅");
      fetchProfile();
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const firstError = Object.values(errors)[0];
        setUpdateError(Array.isArray(firstError) ? firstError[0] : firstError);
      }
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

  const closeUpdate = () => {
    setShowUpdate(false);
    setUpdateMsg("");
    setUpdateError("");
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav
        style={{
          ...styles.navbar,
          padding: isMobile ? "0 16px" : "0px 40px",
        }}
      >
        {!isMobile && <h1 style={styles.navLogo}>🎮 MathQuest Arena</h1>}
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
      </nav>

      <div style={styles.main}>
        {/* Edit Profile Page */}
        {showUpdate ? (
          <div style={styles.updateCard}>
            {/* Back arrow at top left */}
            <button style={styles.backToProfileBtn} onClick={closeUpdate}>
              ← Back to Profile
            </button>

            <h3 style={styles.updateTitle}>✏️ Update Profile</h3>
            <p style={styles.updateNote}>
              You can only update your username and password.
            </p>

            {updateError && <div style={styles.errorMsg}>{updateError}</div>}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                style={styles.input}
                type="text"
                value={updateData.username}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    username: e.target.value,
                  })
                }
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                New Password (leave empty to keep same)
              </label>
              <input
                style={styles.input}
                type="password"
                placeholder="New password"
                value={updateData.new_password}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    new_password: e.target.value,
                  })
                }
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Confirm password"
                value={updateData.confirm_password}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    confirm_password: e.target.value,
                  })
                }
              />
            </div>
            <div
              style={{
                ...styles.updateButtons,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <button style={styles.saveBtn} onClick={handleUpdate}>
                ✅ Save Changes
              </button>
              <button style={styles.cancelBtn} onClick={closeUpdate}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Success Message */}
            {updateMsg && <div style={styles.successMsg}>{updateMsg}</div>}

            {/* Profile Header */}
            <div
              style={{
                ...styles.profileCard,
                flexDirection: isMobile ? "column" : "row",
                height: isMobile ? "auto" : "150px",
                textAlign: isMobile ? "center" : "left",
                alignItems: isMobile ? "center" : "center",
                marginTop: isMobile ? "100px" : "60px",
              }}
            >
              <div style={styles.avatar}>
                {profile?.user?.username?.[0]?.toUpperCase()}
              </div>
              <div style={styles.profileInfo}>
                <h2 style={styles.profileName}>{profile?.user?.username}</h2>
                <p style={styles.profileEmail}>{profile?.user?.email}</p>
                <p style={styles.joinDate}>
                  Joined:{" "}
                  {new Date(profile?.user?.created_at).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
              <div
                style={{
                  ...styles.profileActions,
                  flexDirection: isMobile ? "row" : "column",
                  width: isMobile ? "100%" : "auto",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <button
                  style={styles.editProfileBtn}
                  onClick={() => {
                    setShowUpdate(true);
                    setUpdateMsg("");
                    setUpdateError("");
                  }}
                >
                  ✏️ Edit Profile
                </button>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>

            {/* Stats */}
            <div
              style={{
                ...styles.statsGrid,
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(4, 1fr)",
              }}
            >
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🪙</div>
                <div style={styles.statValue}>{profile?.user?.total_coins}</div>
                <div style={styles.statLabel}>Total Coins</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🏆</div>
                <div style={styles.statValue}>{profile?.badges?.length}</div>
                <div style={styles.statLabel}>Badges Earned</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📝</div>
                <div style={styles.statValue}>{profile?.total_attempts}</div>
                <div style={styles.statLabel}>Total Attempts</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>
                <div style={styles.statValue}>{profile?.total_passed}</div>
                <div style={styles.statLabel}>Quizzes Passed</div>
              </div>
            </div>

            {/* Badges */}
            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>🏅 My Badges</h3>
              {profile?.badges?.length === 0 ? (
                <p style={styles.emptyText}>
                  No badges yet — start learning to earn badges!
                </p>
              ) : (
                <div
                  style={{
                    ...styles.badgesGrid,
                    gridTemplateColumns: isMobile
                      ? "repeat(2, 1fr)"
                      : "repeat(3, 1fr)",
                  }}
                >
                  {profile?.badges?.map((ub) => (
                    <div key={ub.id} style={styles.badgeCard}>
                      <div style={styles.badgeIcon}>🏅</div>
                      <div style={styles.badgeName}>{ub.badge.name}</div>
                      <div style={styles.badgeDesc}>{ub.badge.description}</div>
                      <div style={styles.badgeDate}>
                        {new Date(ub.earned_at).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f8fafc" },
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
  navLogo: {
    color: "white",
    fontSize: "22px",
    margin: 0,
    fontWeight: "700",
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
  loading: { textAlign: "center", padding: "100px", color: "#6366f1" },
  main: { maxWidth: "900px", margin: "0 auto", padding: "32px 16px" },
  successMsg: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "16px",
    fontSize: "14px",
    color: "#166534",
    fontWeight: "500",
  },
  profileCard: {
    marginTop: "60px",
    background: "linear-gradient(180deg, #bbdff7 0%, #ffffff 100%)",
    height: "150px",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "700",
    flexShrink: 0,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: "25px", color: "#333", margin: "0 0 4px 0" },
  profileEmail: { fontSize: "16px", color: "#666", margin: "0 0 4px 0" },
  joinDate: { fontSize: "14px", color: "#999", margin: 0 },
  profileActions: { display: "flex", flexDirection: "column", gap: "8px" },
  editProfileBtn: {
    padding: "8px 16px",
    backgroundColor: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#4f46e5",
    fontWeight: "500",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#9f1239",
    fontWeight: "500",
  },
  updateCard: {
    marginTop: "110px",
    backgroundColor: "#dbf1ff",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  backToProfileBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#4f46e5",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0 0 16px 0",
    display: "block",
  },
  updateTitle: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "4px",
    marginTop: 0,
  },
  updateNote: { fontSize: "14px", color: "#605f5f", marginBottom: "20px" },
  errorMsg: {
    backgroundColor: "#fff1f2",
    border: "1px solid #fecdd3",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "16px",
    color: "#9f1239",
  },
  inputGroup: { marginBottom: "16px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "16px",
    color: "#141313",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  updateButtons: { display: "flex", gap: "12px" },
  saveBtn: {
    padding: "10px 24px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelBtn: {
    padding: "10px 24px",
    backgroundColor: "#dedfe1",
    color: "#342f2f",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  statIcon: { fontSize: "30px", marginBottom: "8px" },
  statValue: { fontSize: "30px", fontWeight: "bold", color: "#4f46e5" },
  statLabel: { fontSize: "14px", color: "#888", marginTop: "4px" },
  sectionCard: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  sectionTitle: { fontSize: "20px", color: "#333", marginBottom: "16px" },
  emptyText: { color: "#888", fontSize: "16px" },
  badgesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  badgeCard: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fcd34d",
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
  },
  badgeIcon: { fontSize: "32px", marginBottom: "8px" },
  badgeName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "4px",
  },
  badgeDesc: { fontSize: "14px", color: "#666", marginBottom: "8px" },
  badgeDate: { fontSize: "13px", color: "#999" },
};

export default Profile;
