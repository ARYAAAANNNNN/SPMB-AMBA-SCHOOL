const db = require('../config/database');

// ─── GET /api/students  (admin: all | siswa: own) ────────────────────────────
const getAllStudents = async (req, res) => {
  try {
    let query, params;

    if (req.user.role === 'admin') {
      query = `
        SELECT s.*, d.ijazah, d.kk, d.akta_kelahiran, d.foto, d.rapor,
               u.email AS user_email
        FROM students s
        LEFT JOIN documents d ON d.student_id = s.id
        LEFT JOIN users u ON u.id = s.user_id
        ORDER BY s.created_at DESC`;
      params = [];
    } else {
      query = `
        SELECT s.*, d.ijazah, d.kk, d.akta_kelahiran, d.foto, d.rapor
        FROM students s
        LEFT JOIN documents d ON d.student_id = s.id
        WHERE s.user_id = ?
        ORDER BY s.created_at DESC`;
      params = [req.user.id];
    }

    const [rows] = await db.query(query, params);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getAllStudents error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── GET /api/students/:id ────────────────────────────────────────────────────
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT s.*, d.ijazah, d.kk, d.akta_kelahiran, d.foto, d.rapor, u.email AS user_email
       FROM students s
       LEFT JOIN documents d ON d.student_id = s.id
       LEFT JOIN users u ON u.id = s.user_id
       WHERE s.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data siswa tidak ditemukan.' });
    }

    // Non-admin can only see own data
    if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getStudentById error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── POST /api/students ───────────────────────────────────────────────────────
const createStudent = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const {
      nama_lengkap, nisn, asal_sekolah, tanggal_lahir, tempat_lahir,
      alamat, no_hp, jenis_kelamin, jalur_pendaftaran, pilihan_sekolah,
    } = req.body;

    // Basic validation
    if (!nama_lengkap || !nisn || !asal_sekolah || !tanggal_lahir || !tempat_lahir || !alamat || !no_hp) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    // Check if user already registered
    const [existing] = await conn.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Anda sudah melakukan pendaftaran sebelumnya.' });
    }

    // Check NISN uniqueness
    const [nisnCheck] = await conn.query('SELECT id FROM students WHERE nisn = ?', [nisn]);
    if (nisnCheck.length > 0) {
      return res.status(409).json({ success: false, message: 'NISN sudah terdaftar dalam sistem.' });
    }

    await conn.beginTransaction();

    const [studentResult] = await conn.query(
      `INSERT INTO students
         (user_id, nama_lengkap, nisn, asal_sekolah, tanggal_lahir, tempat_lahir,
          alamat, no_hp, jenis_kelamin, jalur_pendaftaran, pilihan_sekolah, status_pendaftaran)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'menunggu')`,
      [req.user.id, nama_lengkap, nisn, asal_sekolah, tanggal_lahir, tempat_lahir,
       alamat, no_hp, jenis_kelamin || 'L', jalur_pendaftaran || 'zonasi', pilihan_sekolah || '']
    );

    // Create empty documents row
    await conn.query('INSERT INTO documents (student_id) VALUES (?)', [studentResult.insertId]);

    await conn.commit();

    return res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil disimpan.',
      data: { id: studentResult.insertId },
    });
  } catch (err) {
    await conn.rollback();
    console.error('createStudent error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  } finally {
    conn.release();
  }
};

// ─── PUT /api/students/:id/status  (admin only) ───────────────────────────────
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_pendaftaran, catatan_admin } = req.body;

    const allowed = ['menunggu', 'verifikasi', 'diterima', 'ditolak'];
    if (!allowed.includes(status_pendaftaran)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    const [result] = await db.query(
      'UPDATE students SET status_pendaftaran = ?, catatan_admin = ? WHERE id = ?',
      [status_pendaftaran, catatan_admin || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data siswa tidak ditemukan.' });
    }

    return res.json({ success: true, message: 'Status berhasil diperbarui.' });
  } catch (err) {
    console.error('updateStatus error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── DELETE /api/students/:id  (admin only) ───────────────────────────────────
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM students WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data siswa tidak ditemukan.' });
    }

    return res.json({ success: true, message: 'Data siswa berhasil dihapus.' });
  } catch (err) {
    console.error('deleteStudent error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── GET /api/students/stats  (admin) ────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const [total]      = await db.query('SELECT COUNT(*) AS total FROM students');
    const [diterima]   = await db.query("SELECT COUNT(*) AS total FROM students WHERE status_pendaftaran='diterima'");
    const [ditolak]    = await db.query("SELECT COUNT(*) AS total FROM students WHERE status_pendaftaran='ditolak'");
    const [menunggu]   = await db.query("SELECT COUNT(*) AS total FROM students WHERE status_pendaftaran='menunggu'");
    const [verifikasi] = await db.query("SELECT COUNT(*) AS total FROM students WHERE status_pendaftaran='verifikasi'");

    return res.json({
      success: true,
      data: {
        total:      total[0].total,
        diterima:   diterima[0].total,
        ditolak:    ditolak[0].total,
        menunggu:   menunggu[0].total,
        verifikasi: verifikasi[0].total,
      },
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStatus, deleteStudent, getStats };