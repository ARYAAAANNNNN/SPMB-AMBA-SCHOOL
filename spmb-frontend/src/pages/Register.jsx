import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import FormInput from '../components/FormInput'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ nama: '', email: '', password: '', konfirmasi: '', no_hp: '' })
  const [errors, setErrors] = useState({})
  const [alert, setAlert]   = useState({ type: '', msg: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.nama.trim())       errs.nama       = 'Nama wajib diisi.'
    if (!form.email.trim())      errs.email      = 'Email wajib diisi.'
    if (form.password.length < 6) errs.password  = 'Password minimal 6 karakter.'
    if (form.password !== form.konfirmasi) errs.konfirmasi = 'Password tidak cocok.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setAlert({ type: '', msg: '' })
    try {
      const { nama, email, password, no_hp } = form
      const res = await authAPI.register({ nama, email, password, no_hp })
      const { token, user } = res.data.data
      localStorage.setItem('spmb_token', token)
      localStorage.setItem('spmb_user', JSON.stringify(user))
      navigate('/', { replace: true })
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Registrasi gagal.' })
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
      <div style={{ width: '100%', maxWidth: 480 }} className="fade-in">

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, background: 'var(--accent)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', margin: '0 auto 1rem',
            boxShadow: '0 4px 16px rgba(230,51,41,.3)',
          }}>✏️</div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
            Buat Akun Baru
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '.3rem', fontSize: '.9rem' }}>
            Daftarkan diri Anda untuk memulai pendaftaran
          </p>
        </div>

        <div className="card card-padded" style={{ boxShadow: 'var(--shadow)' }}>
          {alert.msg && (
            <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.25rem' }}>
              {alert.msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormInput label="Nama Lengkap"   name="nama"       value={form.nama}       onChange={handleChange} required error={errors.nama}       placeholder="Masukkan nama lengkap" />
            <FormInput label="Alamat Email"   name="email"      value={form.email}      onChange={handleChange} required error={errors.email}      type="email" placeholder="contoh@email.com" />
            <FormInput label="Nomor HP/WA"    name="no_hp"      value={form.no_hp}      onChange={handleChange} type="tel"  placeholder="08xxxxxxxxxx" hint="Gunakan nomor aktif yang bisa dihubungi" />
            <FormInput label="Password"       name="password"   value={form.password}   onChange={handleChange} required error={errors.password}   type="password" placeholder="Min. 6 karakter" />
            <FormInput label="Konfirmasi Password" name="konfirmasi" value={form.konfirmasi} onChange={handleChange} required error={errors.konfirmasi} type="password" placeholder="Ketik ulang password" />

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '.5rem' }} disabled={loading}>
              {loading ? <><span className="spinner" />Mendaftarkan…</> : 'Buat Akun'}
            </button>
          </form>

          <div style={{
            marginTop: '1.25rem', textAlign: 'center', paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)', fontSize: '.87rem', color: 'var(--text-muted)',
          }}>
            Sudah punya akun?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Masuk</Link>
          </div>
        </div>

      </div>
    </div>
  )
}