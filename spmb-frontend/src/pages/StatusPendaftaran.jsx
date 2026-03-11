import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentAPI } from '../services/api'

const STATUS_INFO = {
  menunggu: {
    icon: '⏳', color: 'var(--warning)', label: 'Menunggu Verifikasi',
    desc: 'Berkas pendaftaran Anda sedang dalam antrian untuk diverifikasi oleh panitia.',
    bg: '#fffbeb', border: '#fde68a',
  },
  verifikasi: {
    icon: '🔍', color: 'var(--info)', label: 'Sedang Diverifikasi',
    desc: 'Panitia sedang memeriksa kelengkapan dan kebenaran dokumen Anda.',
    bg: '#eff6ff', border: '#bfdbfe',
  },
  diterima: {
    icon: '🎉', color: 'var(--success)', label: 'DITERIMA',
    desc: 'Selamat! Anda dinyatakan diterima. Segera lakukan daftar ulang sesuai jadwal.',
    bg: '#f0fdf4', border: '#bbf7d0',
  },
  ditolak: {
    icon: '❌', color: 'var(--danger)', label: 'Tidak Diterima',
    desc: 'Mohon maaf, pendaftaran Anda tidak dapat diterima. Hubungi panitia untuk informasi lebih lanjut.',
    bg: '#fef2f2', border: '#fecaca',
  },
}

export default function StatusPendaftaran() {
  const [student, setStudent]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    studentAPI.getAll()
      .then(res => {
        if (res.data.data.length > 0) setStudent(res.data.data[0])
        else setStudent(null)
      })
      .catch(() => setError('Gagal memuat data. Coba lagi.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
      <div className="spinner spinner-dark" style={{ margin: '0 auto 1rem', width: 36, height: 36 }} />
      Memuat status pendaftaran…
    </div>
  )

  return (
    <div style={{ padding: '2.5rem 0' }} className="fade-in">
      <div className="container" style={{ maxWidth: 700 }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--primary)' }}>
            Status Pendaftaran
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '.4rem' }}>
            Pantau perkembangan berkas dan status penerimaan Anda.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {!student && !error && (
          <div className="card card-padded" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '.75rem' }}>Belum Ada Pendaftaran</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Anda belum mengisi formulir pendaftaran.
            </p>
            <Link to="/daftar" className="btn btn-primary btn-lg">Mulai Pendaftaran</Link>
          </div>
        )}

        {student && (() => {
          const info = STATUS_INFO[student.status_pendaftaran] || STATUS_INFO.menunggu
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Status Banner */}
              <div style={{
                background: info.bg, border: `1.5px solid ${info.border}`,
                borderRadius: 'var(--radius-lg)', padding: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '.5rem' }}>{info.icon}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: info.color, marginBottom: '.4rem' }}>
                  {info.label}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', maxWidth: 420, margin: '0 auto' }}>
                  {info.desc}
                </p>
                {student.catatan_admin && (
                  <div style={{
                    marginTop: '1rem', background: 'rgba(0,0,0,.05)',
                    borderRadius: 'var(--radius-sm)', padding: '.75rem 1rem',
                    fontSize: '.88rem', color: 'var(--text-main)',
                  }}>
                    <strong>Catatan Panitia:</strong> {student.catatan_admin}
                  </div>
                )}
              </div>

              {/* Detail card */}
              <div className="card card-padded">
                <h3 style={{ marginBottom: '1.25rem', color: 'var(--primary)', fontSize: '1rem' }}>
                  📋 Ringkasan Data Pendaftaran
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem 1.5rem' }}>
                  {[
                    ['Nama Lengkap',   student.nama_lengkap],
                    ['NISN',           student.nisn],
                    ['Asal Sekolah',   student.asal_sekolah],
                    ['Jalur',          student.jalur_pendaftaran?.toUpperCase()],
                    ['Pilihan Sekolah',student.pilihan_sekolah || '-'],
                    ['Tanggal Daftar', new Date(student.created_at).toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' })],
                  ].map(([label, val]) => (
                    <div key={label} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '.6rem' }}>
                      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
                      <div style={{ fontWeight: 600, marginTop: '.2rem' }}>{val || '-'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents status */}
              <div className="card card-padded">
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1rem' }}>
                  📎 Status Dokumen
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '.75rem' }}>
                  {[
                    { key: 'ijazah',         label: 'Ijazah/SKL',     icon: '🎓' },
                    { key: 'kk',             label: 'Kartu Keluarga', icon: '👨‍👩‍👧' },
                    { key: 'akta_kelahiran', label: 'Akta Kelahiran', icon: '📜' },
                    { key: 'foto',           label: 'Pas Foto',       icon: '🖼️' },
                    { key: 'rapor',          label: 'Rapor',          icon: '📊' },
                  ].map(({ key, label, icon }) => (
                    <div key={key} style={{
                      textAlign: 'center', padding: '1rem .75rem',
                      borderRadius: 'var(--radius-sm)', border: '1px solid',
                      borderColor: student[key] ? '#bbf7d0' : 'var(--border)',
                      background: student[key] ? '#f0fdf4' : '#fafafa',
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '.3rem' }}>{icon}</div>
                      <div style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--text-main)' }}>{label}</div>
                      <div style={{ fontSize: '.72rem', marginTop: '.2rem', color: student[key] ? 'var(--success)' : 'var(--text-light)' }}>
                        {student[key] ? '✓ Terupload' : '– Belum upload'}
                      </div>
                    </div>
                  ))}
                </div>
                {!student.foto && (
                  <Link to="/daftar" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
                    + Upload Dokumen yang Kurang
                  </Link>
                )}
              </div>

            </div>
          )
        })()}

      </div>
    </div>
  )
}