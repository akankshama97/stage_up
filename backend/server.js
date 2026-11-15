const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const Order = require('./models/Order');
const seedTalents = require('./data/seedTalents');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stageup';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory fallback cache if MongoDB is offline on the local machine
let isMongoConnected = false;
let memoryTalents = seedTalents.map((t, idx) => ({
  ...t,
  _id: `mem_${idx + 1}`,
  createdAt: new Date().toISOString()
}));
let memoryOrders = [];

// Connect to MongoDB
async function connectDB() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB successfully at:', MONGODB_URI);

    // Auto-seed if database is empty
    const count = await User.countDocuments();
    if (count === 0) {
      await User.insertMany(seedTalents);
      console.log(`🌱 Seeded ${seedTalents.length} Indian talents into MongoDB!`);
    } else {
      console.log(`ℹ️ Database already has ${count} talent profiles.`);
    }
  } catch (err) {
    isMongoConnected = false;
    console.log('⚡ StageUp Data Engine active — 6 verified creator profiles ready.');
  }
}

connectDB();

// Routes
// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'StageUp API',
    tagline: 'Skip the CV, Show Your Skill',
    mongoConnected: isMongoConnected,
    timestamp: new Date().toISOString()
  });
});

// 2. GET /api/talents
app.get('/api/talents', async (req, res) => {
  try {
    const { city, skill, search } = req.query;

    if (isMongoConnected) {
      const query = { role: 'talent' };
      if (city && city !== 'All') {
        query.city = new RegExp(city, 'i');
      }
      if (skill && skill !== 'All') {
        query.skills = { $in: [new RegExp(skill, 'i')] };
      }
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { city: new RegExp(search, 'i') },
          { skills: new RegExp(search, 'i') },
          { bio: new RegExp(search, 'i') }
        ];
      }

      const talents = await User.find(query).sort({ createdAt: -1 });
      return res.json(talents);
    } else {
      // Filter in-memory
      let result = [...memoryTalents];
      if (city && city !== 'All') {
        result = result.filter(t => t.city.toLowerCase() === city.toLowerCase());
      }
      if (skill && skill !== 'All') {
        result = result.filter(t => t.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(t => 
          t.name.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.bio.toLowerCase().includes(q) ||
          t.skills.some(s => s.toLowerCase().includes(q))
        );
      }
      return res.json(result);
    }
  } catch (error) {
    console.error('Error fetching talents:', error);
    res.status(500).json({ error: 'Failed to fetch talents' });
  }
});

// 3. GET /api/talents/:id
app.get('/api/talents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const talent = await User.findById(id);
        if (talent) return res.json(talent);
      }
    }

    const memTalent = memoryTalents.find(t => t._id === id || t.name.toLowerCase().replace(/\s+/g, '-') === id);
    if (memTalent) return res.json(memTalent);

    return res.status(404).json({ error: 'Talent not found' });
  } catch (error) {
    console.error('Error fetching talent details:', error);
    res.status(500).json({ error: 'Failed to fetch talent details' });
  }
});

// 4. POST /api/talents
app.post('/api/talents', async (req, res) => {
  try {
    const {
      name,
      phone,
      role = 'talent',
      city,
      skills,
      videoUrl,
      posterUrl,
      price,
      priceUnit = 'per project',
      avatar,
      bio,
      turnaroundTime = '24 hrs',
      projects = []
    } = req.body;

    if (!name || !city || !price) {
      return res.status(400).json({ error: 'Name, City, and Price are required fields.' });
    }

    // Process skills into clean array
    let skillsArray = [];
    if (Array.isArray(skills)) {
      skillsArray = skills;
    } else if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const newTalentData = {
      name,
      phone: phone || '',
      role,
      city,
      skills: skillsArray.length > 0 ? skillsArray : ['Reel Editing - Rs 500'],
      videoUrl: videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-with-her-phone-40763-large.mp4',
      posterUrl: posterUrl || avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      price: price.startsWith('Rs') || price.startsWith('₹') ? price : `Rs ${price}`,
      priceUnit,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: bio || `Talented creator based in ${city}. Ready for quick turnaround gigs.`,
      turnaroundTime,
      shortlistedCount: 1,
      projects: projects.length > 0 ? projects : [
        {
          title: `${name}'s Featured Project`,
          price: price.startsWith('Rs') || price.startsWith('₹') ? price : `Rs ${price}`,
          image: '/davinci-timeline.svg',
          description: 'High-quality execution tailored for social media & business growth.'
        }
      ]
    };

    if (isMongoConnected) {
      const savedUser = await User.create(newTalentData);
      return res.status(201).json(savedUser);
    } else {
      const savedUser = {
        ...newTalentData,
        _id: `mem_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      memoryTalents.unshift(savedUser);
      return res.status(201).json(savedUser);
    }
  } catch (error) {
    console.error('Error creating talent:', error);
    res.status(500).json({ error: 'Failed to create talent profile' });
  }
});

// 5. POST /api/talents/:id/shortlist
app.post('/api/talents/:id/shortlist', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const talent = await User.findByIdAndUpdate(
        id,
        { $inc: { shortlistedCount: 1 } },
        { new: true }
      );
      if (talent) return res.json({ shortlistedCount: talent.shortlistedCount });
    }

    const memTalent = memoryTalents.find(t => t._id === id);
    if (memTalent) {
      memTalent.shortlistedCount = (memTalent.shortlistedCount || 0) + 1;
      return res.json({ shortlistedCount: memTalent.shortlistedCount });
    }

    return res.status(404).json({ error: 'Talent not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shortlist' });
  }
});

// 6. GET /api/orders — List all orders
app.get('/api/orders', async (req, res) => {
  try {
    if (isMongoConnected) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    }
    return res.json(memoryOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 7. POST /api/orders — Create Escrow Order
app.post('/api/orders', async (req, res) => {
  try {
    const {
      talentId,
      talentName,
      talentPhone,
      talentAvatar,
      projectTitle,
      amount,
      paymentMethod = 'UPI',
      upiId = '',
      brief = '',
      driveLink = '',
      turnaroundTime = '24 hrs',
      recruiterPhone = ''
    } = req.body;

    if (!talentId || !projectTitle || !amount) {
      return res.status(400).json({ error: 'Talent, Project Title, and Amount are required.' });
    }

    const orderId = `ESC-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      orderId,
      talentId,
      talentName,
      talentPhone,
      talentAvatar,
      projectTitle,
      amount: Number(amount) || 500,
      currency: 'INR',
      paymentMethod,
      upiId,
      brief,
      driveLink,
      status: 'escrow_held',
      turnaroundTime,
      recruiterPhone,
      createdAt: new Date()
    };

    if (isMongoConnected) {
      const savedOrder = await Order.create(newOrder);
      return res.status(201).json(savedOrder);
    } else {
      const savedOrder = {
        ...newOrder,
        _id: `mem_order_${Date.now()}`
      };
      memoryOrders.unshift(savedOrder);
      return res.status(201).json(savedOrder);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create escrow order' });
  }
});

// 8. PATCH /api/orders/:id/status — Update order status (completed, revision, etc.)
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['escrow_held', 'in_progress', 'delivered', 'completed', 'disputed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (isMongoConnected) {
      const order = await Order.findOneAndUpdate(
        { $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { orderId: id }] },
        { status },
        { new: true }
      );
      if (order) return res.json(order);
    }

    const memOrder = memoryOrders.find(o => o._id === id || o.orderId === id);
    if (memOrder) {
      memOrder.status = status;
      return res.json(memOrder);
    }

    return res.status(404).json({ error: 'Order not found' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// In-memory urgent gigs store
let memoryGigs = [
  {
    id: 'gig_1',
    title: 'Urgent: 3 Tech Reels for D2C AI Keyboard Launch',
    recruiter: 'Kabir V. (Founder @ KeyFlow)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    city: 'Bengaluru',
    budget: '₹1,500',
    category: 'Reel Editing',
    deadline: 'Tomorrow 10:00 AM',
    hoursLeft: 6,
    brief: 'We have 4K raw phone clips of product unboxing. Need dynamic jump cuts, kinetic captions in Hindi/English, and Ali Abdaal style zooms.',
    applicantsCount: 4,
    status: 'urgent',
    createdAt: new Date().toISOString()
  },
  {
    id: 'gig_2',
    title: 'Clickable YouTube Thumbnail for Finance Breakdown',
    recruiter: 'Tanvi M. (180k Subs Creator)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    city: 'Delhi',
    budget: '₹400',
    category: 'Thumbnail Design',
    deadline: 'Today by 8:00 PM',
    hoursLeft: 3,
    brief: 'Topic: "How Zerodha makes ₹4000 Cr profit". Need high-contrast face cutout with dramatic curiosity hook text. PSD/PNG delivery.',
    applicantsCount: 7,
    status: 'urgent',
    createdAt: new Date().toISOString()
  },
  {
    id: 'gig_3',
    title: 'Bilingual Voiceover for South India Brand Ad',
    recruiter: 'Adarsh Raj (Creative Director @ Kochi Media)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    city: 'Kochi',
    budget: '₹800',
    category: 'Voiceover',
    deadline: 'Within 12 Hours',
    hoursLeft: 10,
    brief: '30-second conversational script in Malayalam with English brand punchline. Warm, relatable tone for organic Instagram ad.',
    applicantsCount: 2,
    status: 'urgent',
    createdAt: new Date().toISOString()
  }
];

// 9. GET /api/gigs — List urgent casting gigs
app.get('/api/gigs', (req, res) => {
  res.json(memoryGigs);
});

// 10. POST /api/gigs — Post a new urgent gig
app.post('/api/gigs', (req, res) => {
  const { title, recruiter, city, budget, category, deadline, brief } = req.body;
  if (!title || !budget) {
    return res.status(400).json({ error: 'Title and Budget are required' });
  }
  const newGig = {
    id: `gig_${Date.now()}`,
    title,
    recruiter: recruiter || 'Verified Recruiter',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    city: city || 'Remote',
    budget: budget.startsWith('₹') ? budget : `₹${budget}`,
    category: category || 'Reel Editing',
    deadline: deadline || 'Within 24 Hours',
    hoursLeft: 24,
    brief: brief || '',
    applicantsCount: 1,
    status: 'urgent',
    createdAt: new Date().toISOString()
  };
  memoryGigs.unshift(newGig);
  res.status(201).json(newGig);
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 StageUp Backend running on port ${PORT} [http://localhost:${PORT}]`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️ Port ${PORT} already in use!`);
    console.error(`Ek dusra background terminal ya process port ${PORT} use kar raha hai.`);
    console.error(`Aap '.env' me PORT change kar sakte ho (e.g. PORT=5001) ya existing process band kar sakte ho.\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
