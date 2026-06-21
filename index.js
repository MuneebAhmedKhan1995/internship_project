// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
// import connectDB from './dbConfig.js';
// import authRoutes from './Routes/authRoutes.js';
// import productRoutes from './Routes/productRoute.js';  // Add this
// import categoryRoutes from './Routes/categoryRoutes.js';  // Add this
// import orderRoutes from './Routes/orderRoutes.js';

// // Load environment variables
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors({
//     origin: ['https://mern-project-e-commerce-store.vercel.app'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);  // Add this line
// app.use('/api/categories', categoryRoutes);  // Add this line
// app.use('/api/orders', orderRoutes);

// // Test route
// app.get('/', (req, res) => {
//     res.json({
//         success: true,
//         message: 'E-commerce API is running',
//         version: '1.0.0',
//         endpoints: {
//             auth: {
//                 register: 'POST /api/auth/register',
//                 login: 'POST /api/auth/login',
//                 adminLogin: 'POST /api/auth/admin-login',
//                 logout: 'POST /api/auth/logout',
//                 me: 'GET /api/auth/me',
//                 users: 'GET /api/auth/users (Admin only)'
//             },
//             products: {
//                 getAll: 'GET /api/products',
//                 getById: 'GET /api/products/:id',
//                 create: 'POST /api/products (Admin only)',
//                 update: 'PUT /api/products/:id (Admin only)',
//                 delete: 'DELETE /api/products/:id (Admin only)'
//             },
//             categories: {
//                 getAll: 'GET /api/categories',
//                 getById: 'GET /api/categories/:id',
//                 create: 'POST /api/categories (Admin only)',
//                 update: 'PUT /api/categories/:id (Admin only)',
//                 delete: 'DELETE /api/categories/:id (Admin only)'
//             }
//         }
//     });
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: `Route not found: ${req.method} ${req.url}`
//     });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//         error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });




import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './dbConfig.js';
import authRoutes from './Routes/authRoutes.js';
import productRoutes from './Routes/productRoute.js';
import categoryRoutes from './Routes/categoryRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ FIXED: Remove trailing slash from origin
app.use(cors({
    origin: [
        'https://mern-project-e-commerce-store.vercel.app',  // ✅ NO trailing slash
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ✅ Add explicit CORS middleware for all routes
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://mern-project-e-commerce-store.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5000'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'E-commerce API is running',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                adminLogin: 'POST /api/auth/admin-login',
                logout: 'POST /api/auth/logout',
                me: 'GET /api/auth/me',
                users: 'GET /api/auth/users (Admin only)'
            },
            products: {
                getAll: 'GET /api/products',
                getById: 'GET /api/products/:id',
                create: 'POST /api/products (Admin only)',
                update: 'PUT /api/products/:id (Admin only)',
                delete: 'DELETE /api/products/:id (Admin only)'
            },
            categories: {
                getAll: 'GET /api/categories',
                getById: 'GET /api/categories/:id',
                create: 'POST /api/categories (Admin only)',
                update: 'PUT /api/categories/:id (Admin only)',
                delete: 'DELETE /api/categories/:id (Admin only)'
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});