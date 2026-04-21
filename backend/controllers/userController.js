import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        const { name, username, email, password, bio, isAnonymous } = req.body;
        
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: "Name, username, email, and password are required.",
                success: false
            });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }]  });

         if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({
                message: `A user with this ${field} already exists.`,
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            username, 
            email,
            bio,
            isAnonymous,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });

    } catch (error) {
        next(error); 
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '30d' });

        const userData = {
            _id: user._id,
            name: user.name,
            username: user.username, 
            email: user.email,
            bio: user.bio,
            isAnonymous: user.isAnonymous,
        };

        return res.status(200).cookie("token", token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back, ${user.username}`,
            user: userData,
            success: true
        });

    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                isAnonymous: user.isAnonymous
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { name, username, email, bio, isAnonymous } = req.body;
        const userId = req.userId; 
        
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        if (username && username !== user.username) {
            const usernameTaken = await User.findOne({ username });
            if (usernameTaken) {
                return res.status(400).json({
                    message: "This username is already taken.",
                    success: false
                });
            }
            user.username = username;
        }

        if (email && email !== user.email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                return res.status(400).json({
                    message: "This email is already in use by another account.",
                    success: false
                });
            }
            user.email = email;
        }

        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (isAnonymous !== undefined) user.isAnonymous = isAnonymous;

        await user.save();

        const updatedUser = {
            _id: user._id,
            name: user.name,
            username: user.username, 
            email: user.email,
            bio: user.bio,
            isAnonymous: user.isAnonymous
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
            success: true
        });

    } catch (error) {
        next(error); 
    }
};