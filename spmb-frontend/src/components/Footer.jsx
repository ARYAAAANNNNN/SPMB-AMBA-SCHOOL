export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{
      background: 'var(--primary-dark)',
      color: 'rgba(255,255,255,.75)',
      marginTop: 'auto',
    }}>
      {/* Top ribbon */}
      <div style={{ background: 'var(--accent)', height: 4 }} />

      <div className="container" style={{ padding: '2.5rem 1.5rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem', marginBottom: '2rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.8rem' }}>
              <span style={{ fontSize: '1.6rem' }}>🏫</span>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>SPMB</div>
                <div style={{ fontSize: '.7rem', letterSpacing: '.05em', opacity: .7 }}>
                  SISTEM PENERIMAAN MURID BARU
                </div>
              </div>
            </div>
            <p style={{ fontSize: '.82rem', lineHeight: 1.7, maxWidth: 260 }}>
              Portal resmi pendaftaran peserta didik baru untuk jenjang
              SMP, SMA, dan SMK secara online.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '.8rem', fontSize: '.9rem' }}>Tautan Cepat</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              {[['/', 'Beranda'], ['/daftar', 'Pendaftaran'], ['/status', 'Cek Status'], ['/login', 'Login']].map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ color: 'rgba(255,255,255,.7)', fontSize: '.82rem', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.7)'}>
                    › {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '.8rem', fontSize: '.9rem' }}>Informasi</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem', fontSize: '.82rem' }}>
              <li>📍 Jl. Pendidikan No. 1, Kota</li>
              <li>📞 (022) 123-4567</li>
              <li>✉️ info@spmb.sch.id</li>
              <li>🕒 Senin – Jumat, 08.00 – 16.00</li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,.12)',
          paddingTop: '1.25rem',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          gap: '.5rem', fontSize: '.78rem', color: 'rgba(255,255,255,.5)',
        }}>
          <span>© {year} SPMB – Sistem Penerimaan Murid Baru. Hak cipta dilindungi.</span>
          <span>Dibuat untuk keperluan pendidikan.</span>
        </div>
      </div>
    </footer>
  )
}