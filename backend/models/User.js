import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters']
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    bio: {
        type: String,
        default: '',
        maxlength: [200, 'Bio cannot exceed 200 characters']
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    refreshTokens: [{
        type: String,
        default: null
    }]
}, { timestamps: true });


userSchema.pre('save', async function() {
    if (!this.password || !this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);