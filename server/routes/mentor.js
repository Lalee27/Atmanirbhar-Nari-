const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const geminiService = require('../services/geminiService');
const MentorApplication = require('../models/MentorApplication');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/i;
    const ext = allowed.test(path.extname(file.originalname));
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});
const CATEGORY_INSIGHTS = {
  'Tiffin Services': {
    setupCost: '₹15,000–₹40,000 (kitchen basics, packaging, initial ingredients)',
    licensing: 'FSSAI basic registration (Form A) if turnover under ₹12 lakh; Shop & Establishment; local municipal health clearance.',
    pricing: 'Price per meal at 2.5–3× ingredient cost. Example: ₹80 ingredients → charge ₹200–₹240 per tiffin.',
  },
  'Tailoring & Fashion': {
    setupCost: '₹25,000–₹60,000 (sewing machine, iron, mannequin, fabric stock)',
    licensing: 'Udyam MSME registration; GST if turnover exceeds threshold; no special license for home tailoring in most states.',
    pricing: 'Blouse: ₹300–₹800; alterations: ₹100–₹250; bridal: cost + 40–60% margin for custom work.',
  },
  'Beauty & Wellness': {
    setupCost: '₹30,000–₹1,00,000 (products, tools, sanitization, branding)',
    licensing: 'State cosmetology/beauty parlour rules vary; GST; hygiene compliance for home salons.',
    pricing: 'Facial: ₹400–₹900; threading: ₹30–₹80; bridal packages: bundle 3–4 services at 15% discount.',
  },
  Handicrafts: {
    setupCost: '₹10,000–₹35,000 (raw materials, tools, display, shipping supplies)',
    licensing: 'Udyam MSME; GeM registration optional; GST when scaling online sales.',
    pricing: 'Material cost + 50–100% margin for handmade; wholesale at 30% off retail for bulk orders.',
  },
  'Tuition & Coaching': {
    setupCost: '₹5,000–₹20,000 (books, whiteboard, online tools, marketing)',
    licensing: 'Generally no trade license for home tuition; register on Udyam; income tax as applicable.',
    pricing: '₹300–₹800 per hour for school subjects; group batches reduce per-student rate by 20–30%.',
  },
};

const buildAdvice = ({ category, topic, message }) => {
  const insights = CATEGORY_INSIGHTS[category] || CATEGORY_INSIGHTS['Handicrafts'];
  const lines = [];

  lines.push(`**Personalized guidance for ${category}**\n`);

  if (topic === 'setup-costs' || topic === 'all') {
    lines.push(`**Estimated setup cost:** ${insights.setupCost}`);
  }
  if (topic === 'licensing' || topic === 'all') {
    lines.push(`**Licensing basics:** ${insights.licensing}`);
  }
  if (topic === 'pricing' || topic === 'all') {
    lines.push(`**Pricing strategy:** ${insights.pricing}`);
  }

  lines.push('\n**Next steps:**');
  lines.push('1. Register on [Udyam](https://udyamregistration.gov.in) for MSME benefits.');
  lines.push('2. Track monthly revenue vs. costs in a simple notebook or spreadsheet.');
  lines.push('3. List 3 competitor prices in your locality before finalizing your rates.');

  if (message && message.trim()) {
    lines.push(`\n**Regarding your question:** "${message.trim()}"`);
    lines.push(
      'Start with a pilot offering to 5–10 customers, gather feedback, then adjust price and hours. Consistency builds trust faster than discounts.'
    );
  }

  return lines.join('\n\n');
};

// @desc    Get mentor topics
// @route   GET /api/mentor/topics
router.get('/topics', (req, res) => {
  res.json([
    { id: 'setup-costs', label: 'Setup & Cost Estimation', icon: 'account_balance_wallet' },
    { id: 'licensing', label: 'Licensing & Compliance', icon: 'gavel' },
    { id: 'pricing', label: 'Pricing Strategy', icon: 'sell' },
    { id: 'all', label: 'Full Business Plan', icon: 'lightbulb' },
  ]);
});

// @desc    Get personalized business advice
// @route   POST /api/mentor/advise
router.post('/advise', async (req, res) => {
  const { category, topic = 'all', message } = req.body;

  if (!category) {
    return res.status(400).json({ message: 'Business category is required' });
  }

  try {
    const advice = await geminiService.generateMentorAdviceText(category, topic, message);
    res.json({
      category,
      topic,
      advice,
      disclaimer:
        'This guidance is educational and not legal or tax advice. Consult local authorities and a CA for compliance.',
    });
  } catch (error) {
    // Fail-safe manual fallback if the service encounters an unexpected crash
    const advice = buildAdvice({ category, topic, message });
    res.json({
      category,
      topic,
      advice,
      disclaimer:
        'This guidance is educational and not legal or tax advice. Consult local authorities and a CA for compliance.',
    });
  }
});

// @desc    Apply to be a mentor
// @route   POST /api/mentor/apply
router.post('/apply', upload.single('image'), async (req, res) => {
  try {
    const { fullName, email, phone, linkedin, expertise, experience, whyJoin } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const application = new MentorApplication({
      fullName,
      email,
      phone,
      linkedin,
      expertise,
      experience: Number(experience) || 0,
      whyJoin,
      image: imageUrl,
    });

    await application.save();

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
