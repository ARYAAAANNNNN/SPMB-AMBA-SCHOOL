const express = require('express');
const router  = express.Router();
const {
  getAllStudents, getStudentById, createStudent, updateStatus, deleteStudent, getStats,
} = require('../controllers/studentController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// All student routes require authentication
router.use(authMiddleware);

router.get('/stats',     adminMiddleware, getStats);          // admin
router.get('/',          getAllStudents);                      // admin: all | siswa: own
router.get('/:id',       getStudentById);                     // admin + owner
router.post('/',         createStudent);                      // siswa
router.put('/:id/status', adminMiddleware, updateStatus);     // admin
router.delete('/:id',    adminMiddleware, deleteStudent);     // admin

module.exports = router;