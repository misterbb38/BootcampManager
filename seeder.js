const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Load the Bootcamp model (make sure you have defined the model in your application)
const Bootcamp = require('./models/bootcamp');

// Read the content of the JSON file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
    dbName: "devcmp"
});

// Import data into the database
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit with an error code
  }
};

// Delete data from the database
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data deleted...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit with an error code
  }
};

// Check command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
