const mongoose = require('mongoose');
const dotenv = require('dotenv'); 
require('mongodb');

// mongoose.connect('mongodb://localhost:27017/techfixers', {

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  // usecreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(`CONENCTION ERROR IS...  ${err}`);
  process.exit(1);
});

module.exports = mongoose;