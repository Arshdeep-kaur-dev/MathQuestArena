import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LearningHub from './pages/LearningHub'
import ChapterDetail from './pages/ChapterDetail'
import VideoLesson from './pages/VideoLesson'
import ReadingLesson from './pages/ReadingLesson'
import QuizSelection from './pages/QuizSelection'
import QuizPage from './pages/QuizPage'
import QuizResult from './pages/QuizResult'
import Leaderboard from './pages/LeaderboardPage'
import Notes from './pages/Notes'
import Profile from './pages/Profiles'
import AITutor from './pages/AITutor'
import VerifyEmail from './pages/VerifyEmail'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) return <div>Loading...</div>
    return user ? children : <Navigate to="/login" />
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/learning" element={
                        <ProtectedRoute><LearningHub /></ProtectedRoute>
                    } />
                    <Route path="/learning/:chapterId" element={
                        <ProtectedRoute><ChapterDetail /></ProtectedRoute>
                    } />
                    <Route path="/learning/:chapterId/video" element={
                        <ProtectedRoute><VideoLesson /></ProtectedRoute>
                    } />
                    <Route path="/learning/:chapterId/reading" element={
                        <ProtectedRoute><ReadingLesson /></ProtectedRoute>
                    } />
                    <Route path="/quiz" element={
                        <ProtectedRoute><QuizSelection /></ProtectedRoute>
                    } />
                    <Route path="/quiz/:chapterId/:difficulty" element={
                        <ProtectedRoute><QuizPage /></ProtectedRoute>
                    } />
                    <Route path="/quiz/result" element={
                        <ProtectedRoute><QuizResult /></ProtectedRoute>
                    } />
                    <Route path="/leaderboard" element={
                        <ProtectedRoute><Leaderboard /></ProtectedRoute>
                    } />
                    <Route path="/notes" element={
                        <ProtectedRoute><Notes /></ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute><Profile /></ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/verify-email/:uidb64/:token" element={<VerifyEmail />} />

                    {/* <Route path="/ai-tutor" element={<PrivateRoute><AITutor /></PrivateRoute>} /> */}
                    <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App