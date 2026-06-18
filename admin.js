// // seed.js - Run this to create default users
// import mongoose from 'mongoose'
// import bcrypt from './bcryptjs';
// import User from './Models/User.js';

// async function seedUsers() {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/Ecommerce-Store');
        
//         // Default admin user
//         const adminExists = await User.findOne({ email: 'admin@gmail.com' });
//         if (!adminExists) {
//             const adminPassword = await bcrypt.hash('admin123', 10);
//             const admin = new User({
//                 fullName: 'Admin User',
//                 email: 'admin@gmail.com',
//                 password: adminPassword,
//                 isAdmin: true
//             });
//             await admin.save();
//             console.log('✅ Admin user created');
//         }

//         // Default demo user
//         const demoExists = await User.findOne({ email: 'demo@gmail.com' });
//         if (!demoExists) {
//             const demoPassword = await bcrypt.hash('demo123', 10);
//             const demo = new User({
//                 fullName: 'Demo User',
//                 email: 'demo@gmail.com',
//                 password: demoPassword,
//                 isAdmin: false
//             });
//             await demo.save();
//             console.log('✅ Demo user created');
//         }

//         console.log('✅ Seeding completed');
//         process.exit();
//     } catch (error) {
//         console.error('❌ Seeding error:', error);
//         process.exit(1);
//     }
// }

// seedUsers();






// seed.js (Enhanced version)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/User.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function seedUsers() {
    try {
        console.log('\n🚀 Starting database seeding...\n');
        
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Ecommerce-Store';
        console.log(`📡 Connecting to: ${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Ask if user wants to clear existing data
        const clearExisting = await question('Do you want to clear existing users? (y/N): ');
        
        if (clearExisting.toLowerCase() === 'y') {
            await User.deleteMany({});
            console.log('🗑️  Cleared all existing users\n');
        }

        const users = [];

        // Default admin user
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });
        if (!adminExists) {
            const admin = new User({
                fullName: 'Administrator',
                email: 'admin@gmail.com',
                password: 'admin123',
                isAdmin: true,
                isActive: true
            });
            await admin.save();
            users.push({ role: 'Admin', email: 'admin@gmail.com', password: 'admin123' });
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️ Admin user already exists');
        }

        // Default demo user
        const demoExists = await User.findOne({ email: 'demo@gmail.com' });
        if (!demoExists) {
            const demo = new User({
                fullName: 'Demo User',
                email: 'demo@gmail.com',
                password: 'demo123',
                isAdmin: false,
                isActive: true
            });
            await demo.save();
            users.push({ role: 'Demo', email: 'demo@gmail.com', password: 'demo123' });
            console.log('✅ Demo user created');
        } else {
            console.log('ℹ️ Demo user already exists');
        }

        // Create additional test users
        const testUsers = [
            {
                fullName: 'John Doe',
                email: 'john@example.com',
                password: 'john123',
                isAdmin: false
            },
            {
                fullName: 'Jane Smith',
                email: 'jane@example.com',
                password: 'jane123',
                isAdmin: false
            },
            {
                fullName: 'Test User',
                email: 'test@example.com',
                password: 'test123',
                isAdmin: false
            }
        ];

        for (const testUser of testUsers) {
            const userExists = await User.findOne({ email: testUser.email });
            if (!userExists) {
                const user = new User(testUser);
                await user.save();
                users.push({ role: 'Test', email: testUser.email, password: testUser.password });
                console.log(`✅ Test user created: ${testUser.email}`);
            }
        }

        // Get total user count
        const totalUsers = await User.countDocuments();
        
        
        users.forEach(user => {
        });
        
        
        rl.close();
        process.exit(0);
        
    } catch (error) {
        console.error(error.stack);
        rl.close();
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Seeding interrupted');
    rl.close();
    process.exit(0);
});

// Run the seed function
seedUsers();