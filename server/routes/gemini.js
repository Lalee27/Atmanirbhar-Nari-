const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const geminiService = require('../services/geminiService');

// @desc    Chat with Gemini AI Business Assistant
// @route   POST /api/gemini/chat
// @access  Public
router.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const reply = await geminiService.generateGeneralBusinessAdviceText(history, message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate response from AI.' });
  }
});

module.exports = router;
