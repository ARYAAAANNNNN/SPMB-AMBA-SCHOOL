import { useState, useEffect, useCallback } from 'react'
import { studentAPI } from '../services/api'

const STATUS_OPTIONS = ['menunggu', 'verifikasi', 'diterima', 'ditolak']

const BADGE = {
  menunggu:   { label: '⏳ Menunggu',   cls: 'badge badge-menunggu'   },
  verifikasi: { label: '🔍 Verifikasi', cls: 'badge badge-verifikasi' },
  diterima:   { label: '✅ Diterima',   cls: 'badge badge-diterima'   },
  ditolak:    { label: '❌ Ditolak',    cls: 'badge badge-ditolak'    },
}

const API_BASE = '/uploads'

export default function AdminDashboard() {
  const [students, setStudents] = useState([])
  const [stats, setStats]       = useState({})
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState(null)  // detail modal student
  const [editStatus, setEditStatus]   = useState({ id: null, status: '', catatan: '' })
  const [actionMsg, setActionMsg]     = useState({ type: '', msg: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [tab, setTab] = useState('list')  // 'list' | 'detail'

  const load = useCallback(async () => {
    try {
      const [sRes, stRes] = await Promise.all([studentAPI.getAll(), studentAPI.getStats()])
      setStudents(sRes.data.data)
      setStats(stRes.data.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.nama_lengkap?.toLowerCase().includes(q) || s.nisn?.includes(q) || s.user_email?.toLowerCase().includes(q)
    const matchStatus = !filterStatus || s.status_pendaftaran === filterStatus
    return matchSearch && matchStatus
  })

  const handleStatusUpdate = async () => {
    if (!editStatus.id) return
    try {
      await studentAPI.updateStatus(editStatus.id, {
        status_pendaftaran: editStatus.status,
        catatan_admin: editStatus.catatan,
      })
      setActionMsg({ type: 'success', msg: 'Status berhasil diperbarui.' })
      setEditStatus({ id: null, status: '', catatan: '' })
      if (selected) setSelected(prev => ({ ...prev, status_pendaftaran: editStatus.status, catatan_admin: editStatus.catatan }))
      load()
    } catch (e) {
      setActionMsg({ type: 'danger', msg: 'Gagal memperbarui status.' })
    }
    setTimeout(() => setActionMsg({ type: '', msg: '' }), 3000)
  }

  const handleDelete = async (id) => {
    try {
      await studentAPI.delete(id)
      setConfirmDelete(null)
      setSelected(null)
      setActionMsg({ type: 'success', msg: 'Data siswa berhasil dihapus.' })
      load()
    } catch {
      setActionMsg({ type: 'danger', msg: 'Gagal menghapus data.' })
    }
    setTimeout(() => setActionMsg({ type: '', msg: '' }), 3000)
  }

  const STAT_CARDS = [
    { label: 'Total Pendaftar', value: stats.total     || 0, icon: '👥', bg: '#dbeafe', iconBg: '#3b82f6' },
    { label: 'Menunggu',        value: stats.menunggu  || 0, icon: '⏳', bg: '#fef9c3', iconBg: '#f59e0b' },
    { label: 'Verifikasi',      value: stats.verifikasi|| 0, icon: '🔍', bg: '#e0f2fe', iconBg: '#0ea5e9' },
    { label: 'Diterima',        value: stats.diterima  || 0, icon: '✅', bg: '#dcfce7', iconBg: '#22c55e' },
    { label: 'Ditolak',         value: stats.ditolak   || 0, icon: '❌', bg: '#fee2e2', iconBg: '#ef4444' },
  ]

  return (
    <div style={{ padding: '2rem 0' }} className="fade-in">
      <div className="container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--primary)' }}>
              Dashboard Admin
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '.25rem' }}>
              Kelola data dan status pendaftaran peserta didik baru.
            </p>
          </div>
          <button onClick={load} className="btn btn-outline btn-sm">🔄 Refresh</button>
        </div>

        {/* Action message */}
        {actionMsg.msg && (
          <div className={`alert alert-${actionMsg.type}`} style={{ marginBottom: '1.5rem' }}>
            {actionMsg.msg}
          </div>
        )}

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {STAT_CARDS.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg, color: s.iconBg }}>
                {s.icon}
              </div>
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ color: s.iconBg }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', marginBottom: '1.25rem' }}>
          <input
            type="search" placeholder="🔍  Cari nama, NISN, atau email…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="form-control" style={{ maxWidth: 320 }}
          />
          <select
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="form-control" style={{ maxWidth: 200 }}
          >
            <option value="">Semua Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          {(search || filterStatus) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterStatus('') }}>
              ✕ Reset Filter
            </button>
          )}
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '.85rem', alignSelf: 'center' }}>
            {filtered.length} dari {students.length} data
          </span>
        </div>

        {/* ── Table ── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama Lengkap</th>
                  <th>NISN</th>
                  <th>Asal Sekolah</th>
                  <th>Jalur</th>
                  <th>Dokumen</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    Memuat data…
                  </td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    Tidak ada data pendaftar.
                  </td></tr>
                )}
                {filtered.map((s, i) => {
                  const docCount = ['ijazah','kk','akta_kelahiran','foto','rapor'].filter(k => s[k]).length
                  return (
                    <tr key={s.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>{i + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.nama_lengkap}</div>
                        <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{s.user_email}</div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '.88rem' }}>{s.nisn}</td>
                      <td style={{ fontSize: '.88rem' }}>{s.asal_sekolah}</td>
                      <td>
                        <span style={{
                          background: 'var(--surface)', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)', padding: '.2rem .6rem',
                          fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase',
                        }}>{s.jalur_pendaftaran}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 3 }}>
                          {['ijazah','kk','akta_kelahiran','foto','rapor'].map(k => (
                            <span key={k} style={{
                              width: 10, height: 10, borderRadius: '50%', display: 'block',
                              background: s[k] ? 'var(--success)' : 'var(--border)',
                            }} title={k} />
                          ))}
                        </div>
                        <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {docCount}/5 file
                        </div>
                      </td>
                      <td>
                        <span className={BADGE[s.status_pendaftaran]?.cls || 'badge'}>
                          {BADGE[s.status_pendaftaran]?.label || s.status_pendaftaran}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '.35rem' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setSelected(s)}
                            title="Lihat detail"
                          >👁</button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setEditStatus({ id: s.id, status: s.status_pendaftaran, catatan: s.catatan_admin || '' })}
                            title="Ubah status"
                          >✏️</button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setConfirmDelete(s)}
                            title="Hapus"
                          >🗑</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <Modal onClose={() => setSelected(null)} title={`Detail: ${selected.nama_lengkap}`}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem 1.5rem', marginBottom: '1.25rem' }}>
            {[
              ['NISN',              selected.nisn],
              ['Asal Sekolah',      selected.asal_sekolah],
              ['Tempat/Tgl Lahir',  `${selected.tempat_lahir}, ${new Date(selected.tanggal_lahir).toLocaleDateString('id-ID')}`],
              ['Jenis Kelamin',     selected.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'],
              ['No. HP',            selected.no_hp],
              ['Jalur',             selected.jalur_pendaftaran?.toUpperCase()],
              ['Pilihan Sekolah',   selected.pilihan_sekolah || '-'],
              ['Status',            selected.status_pendaftaran],
            ].map(([label, val]) => (
              <div key={label} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '.5rem' }}>
                <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontWeight: 600, marginTop: '.15rem' }}>{val || '-'}</div>
              </div>
            ))}
            <div style={{ gridColumn: '1/-1', borderBottom: '1px solid var(--border)', paddingBottom: '.5rem' }}>
              <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Alamat</div>
              <div style={{ fontWeight: 500, marginTop: '.15rem' }}>{selected.alamat}</div>
            </div>
          </div>

          <h4 style={{ marginBottom: '.75rem', color: 'var(--primary)' }}>Dokumen Terupload</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem', marginBottom: '1rem' }}>
            {[
              { key: 'ijazah', label: 'Ijazah' }, { key: 'kk', label: 'KK' },
              { key: 'akta_kelahiran', label: 'Akta' }, { key: 'foto', label: 'Foto' },
              { key: 'rapor', label: 'Rapor' },
            ].map(({ key, label }) => (
              selected[key]
                ? <a key={key} href={`${API_BASE}/${selected[key]}`} target="_blank" rel="noreferrer"
                    className="btn btn-outline btn-sm">
                    📄 {label}
                  </a>
                : <span key={key} className="btn btn-ghost btn-sm" style={{ opacity: .45, cursor: 'default' }}>
                    — {label}
                  </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(selected)}>🗑 Hapus</button>
            <button className="btn btn-primary btn-sm"
              onClick={() => { setEditStatus({ id: selected.id, status: selected.status_pendaftaran, catatan: selected.catatan_admin || '' }); setSelected(null) }}>
              ✏️ Ubah Status
            </button>
          </div>
        </Modal>
      )}

      {/* ── Edit Status Modal ── */}
      {editStatus.id && (
        <Modal onClose={() => setEditStatus({ id: null, status: '', catatan: '' })} title="Ubah Status Pendaftaran">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Status Pendaftaran<span className="req">*</span></label>
            <select className="form-control" value={editStatus.status}
              onChange={e => setEditStatus(prev => ({ ...prev, status: e.target.value }))}>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Catatan untuk Siswa</label>
            <textarea className="form-control" rows={3}
              placeholder="Opsional: alasan penolakan, instruksi daftar ulang, dll."
              value={editStatus.catatan}
              onChange={e => setEditStatus(prev => ({ ...prev, catatan: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn btn-ghost" onClick={() => setEditStatus({ id: null, status: '', catatan: '' })}>
              Batal
            </button>
            <button className="btn btn-primary" onClick={handleStatusUpdate}>✓ Simpan</button>
          </div>
        </Modal>
      )}

      {/* ── Confirm Delete Modal ── */}
      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)} title="Konfirmasi Hapus">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Hapus data <strong>{confirmDelete.nama_lengkap}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Batal</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete.id)}>🗑 Hapus</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({ children, title, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto',
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideDown .2s ease',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, background: '#fff', zIndex: 1,
        }}>
          <h3 style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>{title}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ fontSize: '1.1rem', padding: '.2rem .5rem' }}>
            ✕
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  )
}