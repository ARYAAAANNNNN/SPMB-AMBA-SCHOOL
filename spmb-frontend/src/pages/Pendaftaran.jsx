import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentAPI, uploadAPI } from '../services/api'
import FormInput from '../components/FormInput'

const STEPS = ['Data Diri', 'Dokumen', 'Konfirmasi']

const JALUR_OPTIONS = [
  { value: 'zonasi',   label: 'Zonasi (Jarak)' },
  { value: 'prestasi', label: 'Prestasi Akademik/Non-Akademik' },
  { value: 'afirmasi', label: 'Afirmasi (KIP/PKH)' },
  { value: 'mutasi',   label: 'Mutasi / Anak Guru' },
]

const JENIS_KELAMIN = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
]

export default function Pendaftaran() {
  const navigate   = useNavigate()
  const [step, setStep] = useState(0)   // 0 = data diri, 1 = dokumen, 2 = sukses
  const [loading, setLoading]   = useState(false)
  const [checking, setChecking] = useState(true)
  const [alert, setAlert]       = useState({ type: '', msg: '' })
  const [studentId, setStudentId] = useState(null)

  const [formData, setFormData] = useState({
    nama_lengkap: '', nisn: '', asal_sekolah: '', tanggal_lahir: '',
    tempat_lahir: '', alamat: '', no_hp: '', jenis_kelamin: 'L',
    jalur_pendaftaran: 'zonasi', pilihan_sekolah: '',
  })
  const [errors, setErrors] = useState({})

  const [docs, setDocs] = useState({
    ijazah: null, kk: null, akta_kelahiran: null, foto: null, rapor: null,
  })

  useEffect(() => {
    // Check if already registered
    studentAPI.getAll().then(res => {
      if (res.data.data.length > 0) {
        setStudentId(res.data.data[0].id)
        setStep(1) // Go to document upload
      }
    }).catch(() => {}).finally(() => setChecking(false))
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0]
    if (file) setDocs(prev => ({ ...prev, [field]: file }))
  }

  const validateStep0 = () => {
    const errs = {}
    if (!formData.nama_lengkap.trim()) errs.nama_lengkap = 'Nama lengkap wajib diisi.'
    if (!formData.nisn.trim())         errs.nisn         = 'NISN wajib diisi.'
    if (formData.nisn.trim().length !== 10) errs.nisn    = 'NISN harus 10 digit.'
    if (!formData.asal_sekolah.trim()) errs.asal_sekolah = 'Asal sekolah wajib diisi.'
    if (!formData.tanggal_lahir)       errs.tanggal_lahir = 'Tanggal lahir wajib diisi.'
    if (!formData.tempat_lahir.trim()) errs.tempat_lahir  = 'Tempat lahir wajib diisi.'
    if (!formData.alamat.trim())       errs.alamat        = 'Alamat wajib diisi.'
    if (!formData.no_hp.trim())        errs.no_hp         = 'Nomor HP wajib diisi.'
    return errs
  }

  const submitData = async () => {
    const errs = validateStep0()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true); setAlert({ type: '', msg: '' })
    try {
      const res = await studentAPI.create(formData)
      setStudentId(res.data.data.id)
      setStep(1)
      setAlert({ type: 'success', msg: 'Data diri berhasil disimpan! Silakan upload dokumen.' })
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Gagal menyimpan data.' })
    } finally {
      setLoading(false)
    }
  }

  const submitDocs = async () => {
    const hasDoc = Object.values(docs).some(Boolean)
    if (!hasDoc) { setAlert({ type: 'warning', msg: 'Upload minimal satu dokumen.' }); return }

    setLoading(true); setAlert({ type: '', msg: '' })
    const fd = new FormData()
    fd.append('student_id', studentId)
    Object.entries(docs).forEach(([key, file]) => { if (file) fd.append(key, file) })

    try {
      await uploadAPI.uploadDocs(fd)
      setStep(2)
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Upload gagal.' })
    } finally {
      setLoading(false)
    }
  }

  if (checking) return (
    <div style={{ textAlign:'center', padding:'5rem', color:'var(--text-muted)' }}>
      <div className="spinner spinner-dark" style={{ margin:'0 auto 1rem', width:36, height:36 }} />
      Memuat data…
    </div>
  )

  return (
    <div style={{ padding: '2.5rem 0' }} className="fade-in">
      <div className="container" style={{ maxWidth: 760 }}>

        {/* Page title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--primary)' }}>
            Formulir Pendaftaran
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '.4rem' }}>
            Isi data dengan lengkap dan benar sesuai dokumen resmi.
          </p>
        </div>

        {/* Step indicator */}
        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              <div className="step-dot">{i < step ? '✓' : i + 1}</div>
              <div className="step-label">{s}</div>
            </div>
          ))}
        </div>

        {/* Alert */}
        {alert.msg && (
          <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
            {alert.msg}
          </div>
        )}

        {/* ── Step 0: Data Diri ── */}
        {step === 0 && (
          <div className="card card-padded">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '1.1rem' }}>
              📋 Data Diri Calon Peserta Didik
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <FormInput label="Nama Lengkap" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required error={errors.nama_lengkap} placeholder="Sesuai akta kelahiran" />
              </div>
              <FormInput label="NISN" name="nisn" value={formData.nisn} onChange={handleChange} required error={errors.nisn} placeholder="10 digit NISN" hint="Cek di nisn.data.kemdikbud.go.id" />
              <FormInput label="Asal Sekolah" name="asal_sekolah" value={formData.asal_sekolah} onChange={handleChange} required error={errors.asal_sekolah} placeholder="Nama SD/SMP asal" />
              <FormInput label="Tempat Lahir" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} required error={errors.tempat_lahir} placeholder="Kota/kabupaten" />
              <FormInput label="Tanggal Lahir" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} required error={errors.tanggal_lahir} type="date" />
              <FormInput label="Jenis Kelamin" name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} type="select" options={JENIS_KELAMIN} required />
              <FormInput label="Nomor HP/WA" name="no_hp" value={formData.no_hp} onChange={handleChange} required error={errors.no_hp} type="tel" placeholder="08xxxxxxxxxx" />
              <FormInput label="Jalur Pendaftaran" name="jalur_pendaftaran" value={formData.jalur_pendaftaran} onChange={handleChange} type="select" options={JALUR_OPTIONS} required />
              <div style={{ gridColumn: '1/-1' }}>
                <FormInput label="Pilihan Sekolah Tujuan" name="pilihan_sekolah" value={formData.pilihan_sekolah} onChange={handleChange} placeholder="SMAN / SMPN …" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <FormInput label="Alamat Lengkap" name="alamat" value={formData.alamat} onChange={handleChange} required error={errors.alamat} type="textarea" rows={3} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kab." />
              </div>
            </div>
            <button onClick={submitData} className="btn btn-primary btn-lg" style={{ marginTop: '1rem' }} disabled={loading}>
              {loading ? <><span className="spinner" />Menyimpan…</> : 'Simpan & Lanjutkan →'}
            </button>
          </div>
        )}

        {/* ── Step 1: Upload Docs ── */}
        {step === 1 && (
          <div className="card card-padded">
            <h2 style={{ marginBottom: '.5rem', color: 'var(--primary)', fontSize: '1.1rem' }}>
              📎 Upload Berkas Dokumen
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '.88rem' }}>
              Format: JPG, PNG, atau PDF. Maksimal 5 MB per file.
            </p>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {[
                { key: 'ijazah',         label: '🎓 Ijazah / SKL',     required: true  },
                { key: 'kk',             label: '👨‍👩‍👧 Kartu Keluarga',  required: true  },
                { key: 'akta_kelahiran', label: '📜 Akta Kelahiran',    required: true  },
                { key: 'foto',           label: '🖼️ Pas Foto 3×4',      required: true  },
                { key: 'rapor',          label: '📊 Rapor Terakhir',    required: false },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <div style={{ fontWeight: 600, fontSize: '.88rem', marginBottom: '.5rem' }}>
                    {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
                  </div>
                  <label
                    htmlFor={`file_${key}`}
                    className={`upload-area ${docs[key] ? 'has-file' : ''}`}
                    style={{ display: 'block', cursor: 'pointer' }}
                  >
                    <div className="upload-icon">{docs[key] ? '✅' : '☁️'}</div>
                    {docs[key]
                      ? <div className="upload-name">{docs[key].name}</div>
                      : <div style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>
                          Klik atau seret file ke sini
                        </div>
                    }
                    <input
                      id={`file_${key}`} type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange(key)}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
              <button onClick={submitDocs} className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? <><span className="spinner" />Mengunggah…</> : '⬆ Upload & Selesai'}
              </button>
              <button onClick={() => navigate('/status')} className="btn btn-ghost btn-lg">
                Lewati, nanti upload
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Success ── */}
        {step === 2 && (
          <div className="card card-padded" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ color: 'var(--success)', marginBottom: '.75rem', fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>
              Pendaftaran Berhasil!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem' }}>
              Data dan dokumen Anda telah diterima. Tim kami akan memverifikasi berkas Anda.
              Pantau status pendaftaran secara berkala.
            </p>
            <button onClick={() => navigate('/status')} className="btn btn-primary btn-lg">
              🔍 Lihat Status Pendaftaran
            </button>
          </div>
        )}

        <style>{`
          @media(max-width:640px){
            .card-padded > div[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
            .card-padded > div[style*="grid-template-columns: 1fr 1fr"] > div[style*="grid-column: 1/-1"] {
              grid-column: 1 !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}