import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const TIMELINE = [
  { date: '1 Juni 2024',   label: 'Pembukaan Pendaftaran',  icon: '📋', done: true  },
  { date: '15 Juni 2024',  label: 'Batas Upload Dokumen',   icon: '📎', done: true  },
  { date: '20 Juni 2024',  label: 'Verifikasi Berkas',      icon: '🔍', done: false },
  { date: '25 Juni 2024',  label: 'Pengumuman Hasil',       icon: '📣', done: false },
  { date: '1 Juli 2024',   label: 'Daftar Ulang',           icon: '✅', done: false },
]

const JALUR = [
  { icon: '🗺️', title: 'Jalur Zonasi',    desc: 'Berdasarkan jarak domisili calon peserta didik ke sekolah tujuan.', quota: '50%' },
  { icon: '🏆', title: 'Jalur Prestasi',  desc: 'Nilai akademik & non-akademik terbaik dari sekolah asal.', quota: '30%' },
  { icon: '🤝', title: 'Jalur Afirmasi',  desc: 'Diperuntukkan bagi keluarga tidak mampu dengan PKH/KIP.', quota: '15%' },
  { icon: '🚚', title: 'Jalur Mutasi',    desc: 'Anak guru/tenaga kependidikan & perpindahan tugas orang tua.', quota: '5%'  },
]

const DOCS = [
  { icon: '🎓', label: 'Ijazah / SKL' },
  { icon: '👨‍👩‍👧', label: 'Kartu Keluarga' },
  { icon: '📜', label: 'Akta Kelahiran' },
  { icon: '🖼️', label: 'Foto 3×4' },
  { icon: '📊', label: 'Rapor' },
]

export default function Home() {
  const user = (() => { try { return JSON.parse(localStorage.getItem('spmb_user')) } catch { return null } })()
  const [count, setCount] = useState({ total: 0, diterima: 0 })

  useEffect(() => {
    // Animate counters
    const target = { total: 1247, diterima: 348 }
    let frame
    const step = () => {
      setCount(prev => ({
        total:    prev.total    < target.total    ? Math.min(prev.total    + 17, target.total)    : prev.total,
        diterima: prev.diterima < target.diterima ? Math.min(prev.diterima + 5,  target.diterima) : prev.diterima,
      }))
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    const stop = setTimeout(() => cancelAnimationFrame(frame), 2000)
    return () => { cancelAnimationFrame(frame); clearTimeout(stop) }
  }, [])

  return (
    <div className="fade-in">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 55%, var(--primary-light) 100%)',
        padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        {['80px','160px','260px'].map((s,i) => (
          <div key={i} style={{
            position:'absolute', right: `${i*6-2}%`, top: `${i*15-10}%`,
            width: s, height: s, borderRadius:'50%',
            border:'2px solid rgba(255,255,255,.08)',
          }} />
        ))}

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'3rem', alignItems:'center' }}>
            <div>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:'.5rem',
                background:'rgba(255,255,255,.12)', color:'#fff',
                padding:'.3rem .9rem', borderRadius:'100px', fontSize:'.78rem',
                fontWeight:700, letterSpacing:'.05em', marginBottom:'1.25rem',
              }}>
                🏫 TAHUN AJARAN 2024 / 2025
              </div>
              <h1 style={{
                fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.4rem)',
                color:'#fff', lineHeight:1.15, marginBottom:'1.1rem',
              }}>
                Sistem Penerimaan<br />
                <span style={{ color:'var(--gold)' }}>Murid Baru</span> Online
              </h1>
              <p style={{ color:'rgba(255,255,255,.8)', maxWidth:500, lineHeight:1.8, marginBottom:'2rem' }}>
                Daftar sekolah impianmu secara online — mudah, cepat, dan transparan.
                Tersedia untuk jenjang SMP, SMA, dan SMK se-wilayah.
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.75rem' }}>
                <Link to={user ? '/daftar' : '/register'} className="btn btn-accent btn-lg">
                  🎯 Daftar Sekarang
                </Link>
                <Link to="/status" className="btn btn-outline btn-lg"
                  style={{ borderColor:'rgba(255,255,255,.5)', color:'#fff' }}>
                  🔍 Cek Status
                </Link>
              </div>
            </div>

            {/* Stats box */}
            <div style={{
              background:'rgba(255,255,255,.1)', backdropFilter:'blur(10px)',
              borderRadius:'var(--radius-lg)', padding:'2rem',
              border:'1px solid rgba(255,255,255,.2)', minWidth:200,
              display: 'none',
            }} className="hero-stats">
              {[
                { label:'Total Pendaftar', value: count.total.toLocaleString() },
                { label:'Diterima',        value: count.diterima.toLocaleString() },
                { label:'Jalur Tersedia',  value: '4' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center', padding:'.75rem 0', borderBottom:'1px solid rgba(255,255,255,.1)' }}>
                  <div style={{ color:'#fff', fontWeight:800, fontSize:'1.8rem' }}>{s.value}</div>
                  <div style={{ color:'rgba(255,255,255,.65)', fontSize:'.78rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`@media(min-width:768px){.hero-stats{display:block !important}}`}</style>
      </section>

      {/* ── Quick info bar ────────────────────────────────────────────────── */}
      <div style={{
        background:'var(--accent)', padding:'.65rem 0',
      }}>
        <div className="container" style={{
          display:'flex', flexWrap:'wrap', gap:'1.5rem',
          justifyContent:'center', color:'#fff', fontSize:'.82rem', fontWeight:600,
        }}>
          <span>📅 Pendaftaran: 1 – 20 Juni 2024</span>
          <span>🕐 Pukul 08.00 – 16.00 WIB</span>
          <span>📞 Hotline: (022) 123-4567</span>
        </div>
      </div>

      {/* ── Jalur Pendaftaran ────────────────────────────────────────────── */}
      <section style={{ padding:'4rem 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <h2 className="section-title">Jalur Pendaftaran</h2>
            <p className="section-sub">Pilih jalur yang sesuai dengan kondisi dan prestasi Anda.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:'1.25rem' }}>
            {JALUR.map(j => (
              <div key={j.title} className="card card-padded card-hover" style={{ cursor:'default' }}>
                <div style={{ fontSize:'2.2rem', marginBottom:'.75rem' }}>{j.icon}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.5rem' }}>
                  <h3 style={{ fontSize:'1rem', color:'var(--primary)' }}>{j.title}</h3>
                  <span style={{
                    background:'var(--primary)', color:'#fff',
                    padding:'.15rem .55rem', borderRadius:'100px', fontSize:'.72rem', fontWeight:700,
                  }}>{j.quota}</span>
                </div>
                <p style={{ fontSize:'.85rem', color:'var(--text-muted)', lineHeight:1.65 }}>{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ────────────────────────────────────────────────────── */}
      <section style={{ background:'var(--primary)', padding:'4rem 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'#fff' }}>
              Jadwal Penerimaan
            </h2>
            <p style={{ color:'rgba(255,255,255,.7)', marginTop:'.4rem' }}>Tahun Ajaran 2024/2025</p>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'1rem' }}>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'.5rem',
                minWidth:130, textAlign:'center',
              }}>
                <div style={{
                  width:52, height:52, borderRadius:'50%',
                  background: t.done ? 'var(--gold)' : 'rgba(255,255,255,.15)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.4rem', border:'2px solid',
                  borderColor: t.done ? 'var(--gold)' : 'rgba(255,255,255,.3)',
                }}>{t.icon}</div>
                <div style={{ color:'#fff', fontWeight:700, fontSize:'.85rem' }}>{t.label}</div>
                <div style={{ color:'rgba(255,255,255,.6)', fontSize:'.75rem' }}>{t.date}</div>
                {t.done && <span style={{
                  background:'rgba(245,166,35,.25)', color:'var(--gold)',
                  fontSize:'.7rem', padding:'.1rem .5rem', borderRadius:'100px', fontWeight:700,
                }}>✓ Selesai</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Documents required ───────────────────────────────────────────── */}
      <section style={{ padding:'4rem 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'center' }}>
            <div>
              <h2 className="section-title">Dokumen yang Diperlukan</h2>
              <p className="section-sub" style={{ marginBottom:'1.5rem' }}>
                Siapkan semua dokumen berikut dalam format JPG, PNG, atau PDF (maks. 5 MB per file).
              </p>
              <ul style={{ display:'flex', flexDirection:'column', gap:'.75rem', listStyle:'none' }}>
                {DOCS.map(d => (
                  <li key={d.label} style={{ display:'flex', alignItems:'center', gap:'.8rem' }}>
                    <span style={{
                      width:38, height:38, background:'var(--surface)', borderRadius:'var(--radius-sm)',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem',
                      border:'1px solid var(--border)', flexShrink:0,
                    }}>{d.icon}</span>
                    <span style={{ fontWeight:600, fontSize:'.9rem' }}>{d.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* CTA card */}
            <div style={{
              background:'linear-gradient(135deg,var(--primary),var(--primary-light))',
              borderRadius:'var(--radius-lg)', padding:'2.5rem', textAlign:'center',
            }}>
              <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🎓</div>
              <h3 style={{ color:'#fff', fontSize:'1.4rem', marginBottom:'.75rem' }}>
                Siap Mendaftar?
              </h3>
              <p style={{ color:'rgba(255,255,255,.8)', marginBottom:'1.5rem', fontSize:'.9rem' }}>
                Buat akun terlebih dahulu, kemudian isi formulir pendaftaran secara lengkap.
              </p>
              <Link to={user ? '/daftar' : '/register'} className="btn btn-accent btn-lg btn-full">
                Mulai Pendaftaran →
              </Link>
              {!user && (
                <p style={{ color:'rgba(255,255,255,.65)', fontSize:'.8rem', marginTop:'.75rem' }}>
                  Sudah punya akun?{' '}
                  <Link to="/login" style={{ color:'var(--gold)', fontWeight:700 }}>Masuk di sini</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){
          section > .container > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}