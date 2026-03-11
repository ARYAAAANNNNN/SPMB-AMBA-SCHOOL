const express  = require('express');
const router   = express.Router();
const upload   = require('../middleware/uploadMiddleware');
const { uploadDocuments, getDocuments } = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Accept up to 5 document fields (each single file)
const docFields = upload.fields([
  { name: 'ijazah',         maxCount: 1 },
  { name: 'kk',             maxCount: 1 },
  { name: 'akta_kelahiran', maxCount: 1 },
  { name: 'foto',           maxCount: 1 },
  { name: 'rapor',          maxCount: 1 },
]);

router.post('/',            docFields, uploadDocuments);
router.get('/:student_id',  getDocuments);

module.exports = router;