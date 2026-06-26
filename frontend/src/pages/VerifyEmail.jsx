import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'

function VerifyEmail() {
    const { uidb64, token } = useParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        verifyEmail()
    }, [])

    const verifyEmail = async () => {
        try {
            const res = await API.get(`/verify-email/${uidb64}/${token}/`)
            setStatus('success')
            setMessage(res.data.message)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err) {
            setStatus('error')
            setMessage(err.response?.data?.error || 'Verification failed!')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {status === 'loading' && (
                    <>
                        <div style={styles.icon}>⏳</div>
                        <h2 style={styles.title}>Verifying your email...</h2>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div style={styles.icon}>✅</div>
                        <h2 style={styles.title}>Email Verified!</h2>
                        <p style={styles.msg}>{message}</p>
                        <p style={styles.redirect}>
                            Redirecting to login in 3 seconds...
                        </p>
                        <button
                            style={styles.btn}
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </button>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div style={styles.icon}>❌</div>
                        <h2 style={styles.title}>Verification Failed!</h2>
                        <p style={styles.msg}>{message}</p>
                        <button
                            style={styles.btn}
                            onClick={() => navigate('/register')}
                        >
                            Register Again
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '48px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '90%',
    },
    icon: { fontSize: '60px', marginBottom: '16px' },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0 0 12px 0',
    },
    msg: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '16px',
    },
    redirect: {
        fontSize: '13px',
        color: '#a855f7',
        marginBottom: '20px',
    },
    btn: {
        padding: '12px 32px',
        background: 'linear-gradient(90deg, #6366f1, #a855f7)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
    },
}

export default VerifyEmail