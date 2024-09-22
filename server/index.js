const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');
const authMiddleware = require('./middlewares/authMiddleware');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db_name = "record-manager";

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI + "/record-manager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Register route
app.post('/register', async (req, res) => {
    const { name, email, username, password, services } = req.body; // Destructure services from request body

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // If services is not provided, assign an empty array
        const userServices = Array.isArray(services) ? services : [];

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
            services: userServices, // Use userServices instead of services
        });
        
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Current user route
app.get('/currentUser', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected route example
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'You have access to this protected route', user: req.user });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
