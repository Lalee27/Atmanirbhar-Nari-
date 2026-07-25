require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const LearningResource = require('../models/LearningResource');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aatmanirbhar_nari';

const resources = [
  {
    title: 'How to Start a Tiffin Service Business from Home',
    category: 'Tiffin Services',
    description: 'Learn the basics of starting a tiffin service, including menu planning, packaging, and finding your first customers.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    videoUrl: 'https://www.youtube.com/embed/_50VPq8YpmE',
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['Food Business', 'FSSAI', 'Packaging']
  },
  {
    title: 'Tailoring Business: Pricing Your Stitching Work',
    category: 'Tailoring & Fashion',
    description: 'A complete guide on how to calculate costs and set profitable prices for blouses, suits, and dresses.',
    image: 'https://images.unsplash.com/photo-1520004434532-668416a08753?w=800',
    videoUrl: 'https://www.youtube.com/embed/fUsUwF3OnFY',
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['Pricing', 'Fashion', 'Finance']
  },
  {
    title: 'Selling Indian Handicrafts Online',
    category: 'Handicrafts',
    description: 'Discover how to take beautiful photos of your handmade crafts and list them on e-commerce platforms.',
    image: 'https://images.unsplash.com/photo-1605814571995-201a41e976db?w=800',
    videoUrl: 'https://www.youtube.com/embed/QZjP64MLrHE',
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['Marketing', 'E-commerce', 'Photography']
  },
  {
    title: 'Setting Up a Home Beauty Parlour',
    category: 'Beauty & Wellness',
    description: 'Essential equipment, hygiene standards, and customer service tips for running a successful home salon.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    videoUrl: 'https://www.youtube.com/embed/oxLCwVP5pQQ',
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['Salon', 'Customer Service', 'Hygiene']
  },
  {
    title: 'Starting a Profitable Online Coaching Business',
    category: 'Tuition & Coaching',
    description: 'Learn how to set up Zoom classes, market your courses, and collect payments for online tutoring.',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800', 
    videoUrl: 'https://www.youtube.com/embed/Mmdoc6SLqYw',
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['Online Coaching', 'Zoom', 'EdTech']
  },
  {
    title: 'DIY Home Decor Business Guide',
    category: 'Home Decors',
    description: 'Turn your passion for interior design and crafting into a thriving home decor business.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    videoUrl: 'https://www.youtube.com/embed/fU_WWAKuvSc', 
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['Design', 'Crafts', 'Home Decor']
  },
  {
    title: 'How to Start Online Cooking Classes',
    category: 'Cooking Classes',
    description: 'Learn the best setup for recording your cooking and how to attract students to your online classes.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a872e?w=800',
    videoUrl: 'https://www.youtube.com/embed/w21J0N_66_c', 
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['Cooking', 'Online Class', 'Food']
  },
  {
    title: 'Setting up a Virtual Yoga Studio',
    category: 'Fitness & Yoga',
    description: 'A complete guide to lighting, sound, and platform choices for your online fitness or yoga classes.',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
    videoUrl: 'https://www.youtube.com/embed/KOySmKmp9mc', 
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['Yoga', 'Fitness', 'Wellness']
  },
  {
    title: 'Starting a Plant Nursery from Home',
    category: 'Gardening & Plants',
    description: 'Tips for growing, propagating, and selling plants from your own backyard or balcony.',
    image: 'https://images.unsplash.com/photo-1416879598555-2572ad561113?w=800',
    videoUrl: 'https://www.youtube.com/embed/_cukqsbHQjk', 
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['Gardening', 'Plants', 'Eco-friendly']
  },
  {
    title: 'Event Planning Business Basics',
    category: 'Event Management',
    description: 'Learn how to organize small events, manage vendors, and build a portfolio for your event management business.',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800',
    videoUrl: 'https://www.youtube.com/embed/9P5X_HLLjk8', 
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['Events', 'Planning', 'Management']
  },
  {
    title: 'GST & FSSAI Registration for Small Businesses',
    category: 'Business & Compliance',
    description: 'Step-by-step guide to registering your small business and staying compliant with Indian government rules.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    videoUrl: 'https://www.youtube.com/embed/oI9f5nNaXjQ',
    actionText: 'Watch Video',
    icon: 'play_circle',
    pills: ['GST', 'FSSAI', 'Legal']
  }
];

async function seedLearningResources() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    await LearningResource.deleteMany({});
    console.log('Cleared existing learning resources.');

    await LearningResource.insertMany(resources);
    console.log('Seeded learning resources with service-related videos.');

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (err) {
    console.error('Error seeding learning resources:', err);
    process.exit(1);
  }
}

seedLearningResources();
