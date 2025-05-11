const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const User = require('../models/User');
const Content = require('../models/Content');
const Order = require('../models/Order');
const Bid = require('../models/Bid');
const CustomRequest = require('../models/CustomRequest');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const CmsPage = require('../models/CmsPage');
const Setting = require('../models/Setting');
const Review = require('../models/Review');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8')
);

const content = JSON.parse(
  fs.readFileSync(`${__dirname}/data/content.json`, 'utf-8')
);

const settings = JSON.parse(
  fs.readFileSync(`${__dirname}/data/settings.json`, 'utf-8')
);

const cmsPages = JSON.parse(
  fs.readFileSync(`${__dirname}/data/cmsPages.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Content.create(content);
    await Setting.create(settings);
    await CmsPage.create(cmsPages);
    
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Content.deleteMany();
    await Order.deleteMany();
    await Bid.deleteMany();
    await CustomRequest.deleteMany();
    await Notification.deleteMany();
    await Payment.deleteMany();
    await CmsPage.deleteMany();
    await Setting.deleteMany();
    await Review.deleteMany();
    
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please add proper flag: -i (import) or -d (delete)');
  process.exit();
}
