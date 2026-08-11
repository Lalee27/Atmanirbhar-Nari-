const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'your-gemini-api-key-here' && apiKey.trim() !== '') {
    return new GoogleGenerativeAI(apiKey);
  }
  return null;
};

// Generate advice for business mentor
const generateMentorAdviceText = async (category, topic, question) => {
  const genAI = getGenAI();
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are an expert business mentor and advisor for the Aatmanirbhar Nari application, empowering women entrepreneurs in India.
Your goal is to provide highly accurate, efficient, and exceptionally practical advice for a business in the category "${category}".
Focus on the topic: "${topic}" (topics are setup-costs, licensing, pricing, or all (full plan)).

User's specific question or context: "${question || 'Provide a brief summary.'}"

CRITICAL RULES FOR ACCURACY AND EFFICIENCY:
1. STRICT BOUNDARY: ONLY answer questions related to business mentoring, entrepreneurship, or the Aatmanirbhar Nari platform.
2. ULTRA-CONCISE (CRITICAL): Limit your ENTIRE response to a MAXIMUM of 150 words. Do not write long paragraphs. Get straight to the point immediately.
3. REAL-WORLD ACCURACY: Provide realistic estimates (in INR ₹), name specific Indian licenses, and give practical profit margins.
4. CLEAN STRUCTURE: Use 2-3 short bullet points max.
5. ACTIONABLE: Always end with a 2-step concrete action checklist.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('[Gemini Service Error] API call failed, falling back to mock advice:', error);
      // Fall through to mock logic
    }
  }

  // Fallback advice generator
  return getMockMentorAdvice(category, topic, question);
};

// Generate advice for general business inquiries (Assistant chat)
const generateGeneralBusinessAdviceText = async (chatHistory, userMessage) => {
  const genAI = getGenAI();
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Build conversation context
      const formattedHistory = chatHistory
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
      
      const prompt = `
You are "Nari Shakti AI", a friendly and professional AI Business Assistant built to help women entrepreneurs in India grow their businesses on the Aatmanirbhar Nari platform.
You help them write product descriptions, draft professional emails or WhatsApp replies to customer inquiries, brainstorm ideas, manage pricing, and optimize their business operations.

CRITICAL RULES:
1. ONLY answer questions related to business, entrepreneurship, platform usage, marketing, operations, or the Aatmanirbhar Nari application.
2. If the user asks a question completely unrelated to business or the application (e.g., programming, politics, unrelated general knowledge), politely decline and remind them that you are an AI Business Assistant specifically for Aatmanirbhar Nari.
3. Respond in a helpful, conversational, and highly professional manner.
4. Keep responses concise (under 250 words) and easy to read. Use bullet points and bold styling where appropriate.

Here is the conversation history:
${formattedHistory}

User's message: "${userMessage}"
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('[Gemini Service Error] Chat API failed, falling back to mock reply:', error);
    }
  }

  return getMockChatReply(userMessage);
};

// Mock mentor advice helper
function getMockMentorAdvice(category, topic, question) {
  const insights = {
    'Tiffin Services': {
      setupCost: '₹15,000–₹40,000 (kitchen tools, high-quality packaging container bundles, and initial bulk ingredients)',
      licensing: 'FSSAI Basic Registration (Form A) is mandatory; Shop & Establishment Act registration; Local health department clearance.',
      pricing: 'Set prices at 2.5–3× the ingredient cost. For example, if raw materials cost ₹80 per tiffin, charge ₹200–₹240.',
      nextSteps: [
        'Apply for FSSAI registration on the FoSCoS portal.',
        'Design a weekly menu showing high-margin specialties.',
        'Run a trial batch with 5 neighbors to test packaging and feedback.'
      ]
    },
    'Tailoring & Fashion': {
      setupCost: '₹25,000–₹60,000 (commercial sewing machine, steam iron, mannequins, fabrics, threads)',
      licensing: 'MSME Udyam Registration (free and online); GST registration if annual revenue crosses limit; local trade licenses depending on state.',
      pricing: 'Charge flat rates for alterations (₹100-250) and cost-plus-margin (40-60%) for custom boutique pieces.',
      nextSteps: [
        'Register your business name on the Udyam portal.',
        'Set up a workspace with bright natural or artificial lighting.',
        'List your tailoring shop on WhatsApp Business and show designs.'
      ]
    },
    'Beauty & Wellness': {
      setupCost: '₹30,000–₹1,00,000 (cosmetic supplies, chairs, styling mirrors, sterilizers, signage)',
      licensing: 'Trade license from local municipality; hygiene and safety checks; GST registration when scaling.',
      pricing: 'Determine local hourly rates, then bundle standard services (e.g. threading, facial, hair spa) into attractive packages at a 15% discount.',
      nextSteps: [
        'Obtain certifications or display existing qualifications clearly.',
        'Implement strict sanitization protocols after every client.',
        'Promote bridal packages 3 months in advance on social media.'
      ]
    },
    'Handicrafts': {
      setupCost: '₹10,000–₹35,000 (clays, beads, canvas, raw paints, brushes, packing materials)',
      licensing: 'Udyam MSME certificate; GST is necessary for e-commerce platforms like Etsy/Amazon; Handloom/Handicraft card from govt.',
      pricing: 'Materials cost + hours worked × hourly rate + 30% brand margin. Wholesale orders should offer a 30% discount on retail.',
      nextSteps: [
        'Apply for Udyam MSME certification to unlock interest-free micro-loans.',
        'Create a professional catalog with high-quality photos of your art.',
        'Register for local flea markets and exhibitions to test offline sales.'
      ]
    },
    'Tuition & Coaching': {
      setupCost: '₹5,000–₹20,000 (whiteboard, chairs, textbooks, digital camera/stand for online teaching)',
      licensing: 'No formal trade licenses required for home tuition; Udyam registration is helpful to show legitimacy.',
      pricing: 'Charge ₹300–₹800/hour depending on standard/class level. Bundle monthly packages with a 10% discount for upfront payment.',
      nextSteps: [
        'Prepare a structured syllabus or course outline for the semester.',
        'Distribute pamphlets in your residential complex or school areas.',
        'Set up a quiet, well-ventilated study corner at home.'
      ]
    }
  };

  const selectedInsights = insights[category] || insights['Handicrafts'];
  let advice = `### **AI Business Mentor — Guidance for ${category}**\n\n`;

  if (topic === 'setup-costs' || topic === 'all') {
    advice += `* **Setup Costs Breakdown**: ${selectedInsights.setupCost}\n\n`;
  }
  if (topic === 'licensing' || topic === 'all') {
    advice += `* **Licensing & Regulatory Compliance**: ${selectedInsights.licensing}\n\n`;
  }
  if (topic === 'pricing' || topic === 'all') {
    advice += `* **Pricing & Revenue Strategy**: ${selectedInsights.pricing}\n\n`;
  }

  advice += `### **Recommended Next Steps**\n`;
  selectedInsights.nextSteps.forEach((step, idx) => {
    advice += `${idx + 1}. ${step}\n`;
  });

  if (question && question.trim()) {
    advice += `\n**Regarding your specific question ("${question}")**:\nWe highly recommend launching a micro-pilot (testing with 5-10 trusted community members) before investing heavily. Collect continuous feedback, refine your service quality, and gradually adjust prices. Consistency and active customer engagement build trust and ensure sustainable long-term success.`;
  }

  advice += `\n\n*(Note: This is a simulated response. Configure a GEMINI_API_KEY in your .env file to enable dynamic AI mentoring.)*`;
  return advice;
}

// Mock chat replies
function getMockChatReply(userMessage) {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `Hello! I am **Nari Shakti AI**, your business assistant. How can I help you today? I can help you:
- Write **product descriptions**
- Draft **customer reply messages**
- Brainstorm **marketing ideas**
- Plan **pricing and costs**
Let me know what business you run or what you're working on!`;
  }

  if (msg.includes('description') || msg.includes('product') || msg.includes('sell') || msg.includes('write')) {
    return `Here is a professional description template you can use:

"**[Product/Service Name]** — Handmade with love and care by local women artisans. Experience the perfect blend of traditional quality and modern craftsmanship. Ideal for everyday use or gifting. Support local enterprises today! 🌸"

*Tip: Add specific ingredients, materials, or custom details to make it stand out!*`;
  }

  if (msg.includes('customer') || msg.includes('reply') || msg.includes('message') || msg.includes('inquiry')) {
    return `Here is a professional template to reply to inquiries:

"Hello **[Customer Name]**, thank you so much for reaching out to **[Your Business Name]**! We would be delighted to serve you. Regarding your inquiry, [insert answer here, e.g., our pricing starts from ₹X]. You can also reach us directly at [Phone Number]. Looking forward to speaking with you!"`;
  }

  if (msg.includes('marketing') || msg.includes('grow') || msg.includes('customer') || msg.includes('advertise')) {
    return `Here are **3 easy ways** to market your business locally:
1. **WhatsApp Status Updates**: Post high-quality photos of your products or daily preparation (for kitchens) regularly.
2. **Offer Referral Discounts**: Tell your current customers: "Get 10% off your next order if you refer a friend!"
3. **Google Business Listing**: Register your business on Google Maps for free so local clients can search and find you directly.`;
  }

  return `Thank you for your message! That sounds like an excellent goal. Here is a quick business guideline:
- Focus on consistent **quality** first.
- Keep a simple notebook tracking your **daily expenses and income**.
- Use **WhatsApp Business** to interact with customers professionally.

*(Note: Set up a GEMINI_API_KEY in your server's .env file to get fully customized AI answers tailored to your specific queries!)*`;
}

module.exports = {
  generateMentorAdviceText,
  generateGeneralBusinessAdviceText,
};
