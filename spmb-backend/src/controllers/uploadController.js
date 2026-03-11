const db   = require('../config/database');
const path = require('path');

/**
 * POST /api/upload
 * Accepts multipart/form-data with fields:
 *   ijazah | kk | akta_kelahiran | foto | rapor
 * Also requires `student_id` in body.
 */
const uploadDocuments = async (req, res) => {
  try {
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ success: false, message: 'student_id wajib diisi.' });
    }

    // Verify the student belongs to this user (or requester is admin)
    const [rows] = await db.query('SELECT user_id FROM students WHERE id = ?', [student_id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data siswa tidak ditemukan.' });
    }
    if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    // Build update fields from uploaded files
    const fields = ['ijazah', 'kk', 'akta_kelahiran', 'foto', 'rapor'];
    const updates = {};

    if (req.files) {
      for (const field of fields) {
        if (req.files[field]) {
          updates[field] = req.files[field][0].filename;
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });
    }

    // Upsert documents row
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values     = [...Object.values(updates), student_id];

    await db.query(
      `UPDATE documents SET ${setClauses}, updated_at = NOW() WHERE student_id = ?`,
      values
    );

    return res.json({
      success: true,
      message: 'Dokumen berhasil diunggah.',
      data: updates,
    });
  } catch (err) {
    console.error('uploadDocuments error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

/**
 * GET /api/upload/:student_id
 * Returns document filenames for a given student.
 */
const getDocuments = async (req, res) => {
  try {
    const { student_id } = req.params;
    const [rows] = await db.query('SELECT * FROM documents WHERE student_id = ?', [student_id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan.' });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getDocuments error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { uploadDocuments, getDocuments };