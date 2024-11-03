const mongoose = require('mongoose');
const User = require('./user'); // Adjust the path if necessary

// MongoDB connection string
const mongoURI = "mongodb+srv://sagniks:12345@hacknc2024.coa7s.mongodb.net/user_login_data?retryWrites=true&w=majority&appName=HackNC2024"; // Replace with your MongoDB connection string
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    const testUser = new User({
      password: 'pass123',
      username: 'anotherexample@gmail.com',
    });

    await testUser.save();
    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('MongoDB connection error:', err);
});