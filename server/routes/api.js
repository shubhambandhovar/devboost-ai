const express = require('express');
const router = express.Router();
const { auth, requireAuth } = require('../middleware/auth');
const checkUsageLimit = require('../middleware/checkUsageLimit');
const { register, login, getMe, googleLogin } = require('../controllers/authController');
const { getHistory } = require('../controllers/historyController');
const { createOrder, verifyPayment } = require('../controllers/razorpayController');
const {
  explainCode,
  generateReadme,
  generateCommit,
  debugBug,
  refactorCode,
  translateCode,
  generateRegex,
  generateReadmeFromGithub,
  generateUnitTest,
  scanSecurity,
  generateDatabase,
  planArchitecture,
  aiChat
} = require('../controllers/aiController');

// Auth Routes
router.post('/auth/google', googleLogin);
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', auth, requireAuth, getMe);

// History Routes
router.get('/history', auth, requireAuth, getHistory);

// Razorpay Routes
router.post('/create-razorpay-order', auth, requireAuth, createOrder);
router.post('/verify-razorpay-payment', auth, requireAuth, verifyPayment);

// AI Routes (auth optional to allow guest usage, but tracks history if logged in)
router.post('/explain-code', auth, checkUsageLimit, explainCode);
router.post('/generate-readme', auth, checkUsageLimit, generateReadme);
router.post('/generate-readme-github', auth, checkUsageLimit, generateReadmeFromGithub);
router.post('/generate-commit', auth, checkUsageLimit, generateCommit);
router.post('/debug-bug', auth, checkUsageLimit, debugBug);
router.post('/refactor-code', auth, checkUsageLimit, refactorCode);
router.post('/translate-code', auth, checkUsageLimit, translateCode);
router.post('/generate-regex', auth, checkUsageLimit, generateRegex);
router.post('/generate-unit-test', auth, checkUsageLimit, generateUnitTest);
router.post('/scan-security', auth, checkUsageLimit, scanSecurity);
router.post('/generate-database', auth, checkUsageLimit, generateDatabase);
router.post('/plan-architecture', auth, checkUsageLimit, planArchitecture);
router.post('/ai-chat', auth, checkUsageLimit, aiChat);

module.exports = router;
