# Product Project

Full-stack React + Node.js application with PostgreSQL, JWT authentication, and SSR.

## 🚀 Demo & Production
<!-- Deployment in progress — live demo will be available soon -->
- **Demo**: https://product-project-g47t.onrender.com
- **API Documentation**: https://product-project-g47t.onrender.com/api/docs/
<!-- - **Demo Server**: https://product-project-g47t.onrender.com -->

## 👥 Access Credentials

### Admin
*Contact administrator to create admin account*

### User / Register
*Contact administrator to create user account*

## 🧱 Architecture
- **Backend**: layered (routes → controllers → services → models)
- **Frontend**: feature-sliced with Redux Toolkit
- **Auth flow**: access + refresh tokens (httpOnly) with role-based guards

## 🔮 Roadmap
- [ ] Pagination + filtering on SSR pages
- [ ] Image CDN + caching headers
- [ ] Email notifications
- [ ] Upload to S3/Cloudinary

## ✨ Features

- 🔐 JWT authentication with refresh tokens
- 👤 Role-based access control (Admin, Moderator, User)
- 📦 Product management with image uploads
- 🍺 Alcohol products listing
- ⚡ SSR + partial SSG for better SEO and faster first paint
- 📱 Responsive UI with Tailwind CSS
- 🧪 API testing with Vitest & Supertest
- 📚 OpenAPI/Swagger documentation
- 🐳 Docker & Docker Compose support
- 🔄 CI/CD with GitHub Actions

## 🛠️ Tech Stack

- **Frontend**: React 18, Redux Toolkit, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL 16
- **Testing**: Vitest, Supertest
- **Documentation**: Swagger/OpenAPI 3.0
- **Deployment**: Docker, Docker Compose

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/your-username/react-nodejs-project.git
cd react-nodejs-project

# Start services
docker-compose up -d

# Application will be available at http://localhost:5174
```

### Manual Setup

```bash
# Install dependencies
npm ci
cd frontend && npm ci && cd ..

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start database
docker-compose up -d db

# Build application
npm run build

# Run server
npm run serve
```

## 📋 Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=mvp_database
DB_DIALECT=postgres
DB_PORT=5432

JWT_SECRET=your-secret-key-here
JWT_REFRESH_EXPIRATION=86400
JWT_EXPIRATION=3600

PORT=5174
NODE_ENV=production
```

## 🧪 Running Tests

```bash
# Run all tests
npm run test

# Run API tests only
npm run test:api
```

## 📚 API Documentation

Access Swagger UI at: http://localhost:5174/api/docs

Available endpoints:
- `POST /api/auth/signin` - User authentication
- `GET /api/products/common` - List common products
- `GET /api/products/alcohol` - List alcohol products

## 🏗️ Build & Deploy

```bash
# Build for production
npm run build

# Run production server
npm run serve
```

## 📝 Development

```bash
# Run frontend dev server
npm run dev:client

# Run backend (in another terminal)
npm run serve
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## 📄 License

ISC

## 👨‍💻 Author

bondalex-maker
