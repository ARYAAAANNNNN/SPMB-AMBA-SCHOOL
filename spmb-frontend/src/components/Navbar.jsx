import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [user, setUser]       = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem('spmb_user'))) } catch {}
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const logout = () => {
    localStorage.removeItem('spmb_token')
    localStorage.removeItem('spmb_user')
    setUser(null)
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 'var(--navbar-h)',
      background: scrolled ? 'rgba(0,36,100,.97)' : 'var(--primary)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,.25)' : 'none',
      transition: 'all .3s',
      borderBottom: '3px solid var(--accent)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '1rem' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '.65rem', textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38, background: '#fff', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', flexShrink: 0,
          }}>🏫</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '.95rem', lineHeight: 1.1 }}>SPMB</div>
            <div style={{ color: 'rgba(255,255,255,.7)', fontSize: '.65rem', letterSpacing: '.04em' }}>
              SISTEM PENERIMAAN MURID BARU
            </div>
          </div>
        </Link>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }} className="desktop-nav">
          <NavLink to="/"       label="Beranda"     active={isActive('/')} />
          {user?.role === 'siswa' && <>
            <NavLink to="/daftar"  label="Pendaftaran"  active={isActive('/daftar')} />
            <NavLink to="/status"  label="Status"       active={isActive('/status')} />
          </>}
          {user?.role === 'admin' && (
            <NavLink to="/admin" label="Dashboard Admin" active={isActive('/admin')} />
          )}
        </div>

        {/* Auth area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm"
                style={{ color: 'rgba(255,255,255,.85)' }}>
                Masuk
              </Link>
              <Link to="/register" className="btn btn-accent btn-sm">
                Daftar
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <div style={{ textAlign: 'right', display: 'none' }} className="user-info-desktop">
                <div style={{ color: '#fff', fontSize: '.82rem', fontWeight: 600 }}>{user.nama}</div>
                <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '.7rem', textTransform: 'capitalize' }}>
                  {user.role}
                </div>
              </div>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--accent)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '.85rem', flexShrink: 0,
              }}>
                {user.nama?.charAt(0).toUpperCase()}
              </div>
              <button onClick={logout} className="btn btn-outline btn-sm"
                style={{ borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}>
                Keluar
              </button>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media(max-width:768px){
          .desktop-nav { display: none !important; }
          .user-info-desktop { display: none !important; }
        }
        @media(min-width:769px){
          .user-info-desktop { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} style={{
      color: active ? '#fff' : 'rgba(255,255,255,.75)',
      fontWeight: active ? 700 : 500,
      fontSize: '.88rem',
      padding: '.4rem .8rem',
      borderRadius: 'var(--radius-sm)',
      background: active ? 'rgba(255,255,255,.15)' : 'transparent',
      textDecoration: 'none',
      transition: 'all .15s',
      borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,.1)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {label}
    </Link>
  )
}