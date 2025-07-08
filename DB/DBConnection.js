const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');

        // Verify connection status
        const state = mongoose.connection.readyState;
        console.log('MongoDB connection state:',
            state === 0 ? 'disconnected' :
            state === 1 ? 'connected' :
            state === 2 ? 'connecting' :
            state === 3 ? 'disconnecting' : 'unknown');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Don't exit process in case of error to allow retries
    }
};

module.exports = connectDB;
