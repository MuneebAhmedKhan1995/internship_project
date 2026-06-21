// controllers/authController.js
import User from '../Models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// @desc    Register User
// @route   POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        // Check all fields are provided
        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all fields'
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        // Create new user
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password
        });

        // Generate token
        const token = generateToken(user);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user,
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// @desc    Login User
// @route   POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if fields are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Generate token
        const token = generateToken(user);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: user,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// @desc    Admin Login (Default Admin)
// @route   POST /api/auth/admin-login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Default admin credentials
        const defaultAdminEmail = 'admin@ecommerce.com';
        const defaultAdminPassword = 'Admin123!';

        // Check if trying to login with default admin
        if (email === defaultAdminEmail && password === defaultAdminPassword) {
            // Check if admin already exists in database
            let admin = await User.findOne({ email: defaultAdminEmail });
            
            if (!admin) {
                // Create default admin
                admin = await User.create({
                    fullName: 'Administrator',
                    email: defaultAdminEmail,
                    password: defaultAdminPassword,
                    isAdmin: true
                });
            } else if (!admin.isAdmin) {
                // Update existing user to admin
                admin.isAdmin = true;
                await admin.save();
            }

            // Generate token
            const token = generateToken(admin);

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                success: true,
                message: 'Admin login successful',
                data: admin,
                token
            });
        }

        // Regular admin login check
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user || !user.isAdmin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Generate token
        const token = generateToken(user);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: user,
            token
        });

    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// @desc    Logout User
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
    try {
        // Clear cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// @desc    Get Current User
// @route   GET /api/auth/me
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// @desc    Get All Users (Admin only)
// @route   GET /api/auth/users
export const getAllUsers = async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        const users = await User.find().select('-password');
        res.status(200).json(users);
        
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update user status (block/unblock) - Admin only
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from blocking themselves
    if (user.isAdmin && req.user._id.toString() === id) {
      return res.status(400).json({ message: 'You cannot change your own status' });
    }
    
    user.isActive = isActive;
    await user.save();
    
    res.status(200).json({ 
      message: `User ${isActive ? 'activated' : 'blocked'} successfully`,
      user: { _id: user._id, isActive: user.isActive }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};