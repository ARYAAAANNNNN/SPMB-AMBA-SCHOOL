import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import FormInput from '../components/FormInput'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.login(form)
      const { token, user } = res.data.data
      localStorage.setItem('spmb_token', token)
      localStorage.setItem('spmb_user', JSON.stringify(user))
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa koneksi Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--navbar-h))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'linear-gradient(160deg, #f0f5ff 0%, #e8eeff 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }} className="fade-in">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, background: 'var(--primary)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', margin: '0 auto 1rem',
            boxShadow: '0 4px 16px rgba(0,56,147,.3)',
          }}>🏫</div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
            Masuk ke SPMB
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '.3rem', fontSize: '.9rem' }}>
            Gunakan akun yang sudah terdaftar
          </p>
        </div>

        {/* Card */}
        <div className="card card-padded" style={{ boxShadow: 'var(--shadow)' }}>
          {error && <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Alamat Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              required
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '.5rem' }}
              disabled={loading}
            >
              {loading ? <><span className="spinner" />Memproses…</> : 'Masuk'}
            </button>
          </form>

          <div style={{
            marginTop: '1.25rem', textAlign: 'center', paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)', fontSize: '.87rem', color: 'var(--text-muted)',
          }}>
            Belum punya akun?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Daftar sekarang
            </Link>
          </div>

          {/* Demo credentials */}
          <div style={{
            marginTop: '1rem', background: '#fffbeb', borderRadius: 'var(--radius-sm)',
            padding: '.75rem 1rem', fontSize: '.78rem', color: '#92400e',
            border: '1px solid #fde68a',
          }}>
            <strong>Demo Admin:</strong> admin@spmb.sch.id / password
          </div>
        </div>

      </div>
    </div>
  )
}