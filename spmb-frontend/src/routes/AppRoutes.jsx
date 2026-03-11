import { Routes, Route, Navigate } from 'react-router-dom'
import Home              from '../pages/Home'
import Login             from '../pages/Login'
import Register          from '../pages/Register'
import Pendaftaran       from '../pages/Pendaftaran'
import StatusPendaftaran from '../pages/StatusPendaftaran'
import AdminDashboard    from '../pages/AdminDashboard'
import Navbar            from '../components/Navbar'
import Footer            from '../components/Footer'

const getUser = () => {
  try { return JSON.parse(localStorage.getItem('spmb_user')) } catch { return null }
}

function PrivateRoute({ children, adminOnly = false }) {
  const user = getUser()
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function GuestRoute({ children }) {
  const user = getUser()
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  return children
}

export default function AppRoutes() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/login"   element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/daftar"  element={<PrivateRoute><Pendaftaran /></PrivateRoute>} />
          <Route path="/status"  element={<PrivateRoute><StatusPendaftaran /></PrivateRoute>} />
          <Route path="/admin"   element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
          <Route path="*"        element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div style={{ fontSize: '5rem' }}>🏫</div>
      <h2 style={{ marginTop: '1rem', color: 'var(--primary)' }}>404 – Halaman Tidak Ditemukan</h2>
      <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
        Halaman yang Anda cari tidak tersedia.
      </p>
      <a href="/" className="btn btn-primary">Kembali ke Beranda</a>
    </div>
  )
}