# CityVibe - Hyperlocal City Discovery Platform

CityVibe is a web-first hyperlocal discovery platform tailored for Tier 2 and Tier 3 cities in India. It focuses on community-driven recommendations, short-form media, and localized discovery for food, events, and hangouts.

## 🚀 Quick Start (Localhost MVP)

This is the localhost-running MVP implementation of CityVibe. Follow these steps to get it running on your local machine.

### Prerequisites

- Node.js 18+ installed
- npm installed

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ashish73653/CityVibe.git
   cd CityVibe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   The `.env` file should contain:
   ```
   DATABASE_URL="file:./dev.db"
   SESSION_SECRET="your-secure-random-string-here"
   ADMIN_SEED_EMAIL="admin@cityvibe.com"
   ADMIN_SEED_PASSWORD="admin123"
   ```

4. **Run database migrations and seed**
   ```bash
   npx prisma migrate dev
   ```

   This will:
   - Create the SQLite database
   - Run migrations to set up tables
   - Seed the database with sample data (cities, categories, places, users, posts)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Test Credentials

After seeding, you can log in with these test accounts:

**Admin Account:**
- Email: `admin@cityvibe.com`
- Password: `admin123`

**Regular User Accounts:**
- Email: `rahul@example.com` | Password: `user123`
- Email: `priya@example.com` | Password: `user123`
- Email: `amit@example.com` | Password: `user123`

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (dev) with Prisma ORM
- **Authentication**: Secure session cookies with bcrypt password hashing
- **File Upload**: Local filesystem (public/uploads)

## 📁 Project Structure

```
CityVibe/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── user/            # User operations
│   │   ├── feed/            # Post feed
│   │   ├── posts/           # Post operations
│   │   ├── places/          # Place operations
│   │   ├── cities/          # Cities list
│   │   ├── categories/      # Categories list
│   │   └── admin/           # Admin operations
│   ├── auth/                # Auth pages (login, signup)
│   ├── home/                # Home feed page
│   ├── upload/              # Upload post page
│   ├── saved/               # Saved places page
│   ├── places/[id]/         # Place details page
│   ├── admin/               # Admin dashboard
│   └── select-city/         # City selection page
├── components/              # React components
├── lib/                     # Utility functions
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # Authentication utilities
│   └── upload.ts           # File upload utilities
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma       # Prisma schema
│   └── seed.ts             # Database seed script
└── public/                  # Static files
    └── uploads/            # Uploaded media files
```

## 🎯 Features Implemented (MVP)

### ✅ Authentication
- Email + password signup
- Secure login/logout
- Session-based authentication
- Password hashing with bcrypt

### ✅ City Selection
- User selects their city
- City-based content filtering
- Easy city switching

### ✅ Discovery Feed
- Home feed showing posts for selected city
- Category filtering
- Latest posts first
- Like/unlike posts
- Comment on posts

### ✅ Content Upload
- Upload image or video recommendations
- Add caption and tags
- Set budget estimate
- Associate with place and category

### ✅ Place Details
- View place information
- See all recommendations for a place
- Save/unsave places
- Add comments to posts

### ✅ Saved Places
- Save places for later
- View all saved places
- Quick access to saved content

### ✅ Admin Dashboard
- View all posts
- Hide/delete posts
- View reports
- Moderate content

## 🗄️ Database Schema

The application uses the following main models:

- **User**: User accounts with roles (USER, ADMIN)
- **City**: Cities in the platform
- **Category**: Place categories (cafes, food spots, etc.)
- **Place**: Physical places/venues
- **RecommendationPost**: User-generated posts
- **Like**: Post likes
- **Comment**: Post comments
- **SavedPlace**: User's saved places
- **Report**: Content reports

## 📝 API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### User
- `GET /api/user/me` - Get current user
- `POST /api/user/select-city` - Select user's city
- `GET /api/user/saved` - Get saved places

### Content
- `GET /api/feed` - Get posts feed
- `POST /api/posts` - Create new post
- `POST /api/posts/[id]/like` - Like/unlike post
- `POST /api/posts/[id]/comment` - Comment on post
- `GET /api/posts/[id]/comment` - Get post comments
- `POST /api/posts/[id]/report` - Report post

### Places
- `GET /api/places/[id]` - Get place details
- `POST /api/places/[id]/save` - Save/unsave place

### Admin (Admin only)
- `GET /api/admin/posts` - Get all posts
- `GET /api/admin/reports` - Get all reports
- `POST /api/admin/posts/[id]/hide` - Hide post
- `DELETE /api/admin/posts/[id]/delete` - Delete post

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run database migration
npx prisma migrate dev

# Seed database
npx prisma db seed

# View database in Prisma Studio
npx prisma studio

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Production Deployment Checklist

When deploying to production, consider these upgrades:

1. **Database**: Migrate from SQLite to PostgreSQL
2. **File Storage**: Move from local filesystem to S3/R2
3. **Authentication**: Add Google OAuth
4. **Session Storage**: Use Redis for session management
5. **Environment Variables**: Update SESSION_SECRET to a secure random string
6. **Image Optimization**: Add image compression and thumbnail generation
7. **Video Processing**: Implement video transcoding
8. **CDN**: Serve static assets via CDN

## 📄 License

This project is part of the CityVibe platform development.

## 🤝 Contributing

For development setup and contributions, please follow the installation steps above.

---

For full Software Requirements Specification, see [SRS.md](./SRS.md)
