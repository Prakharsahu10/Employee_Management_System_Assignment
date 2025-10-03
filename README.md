# 🏢 Employee Management System

A comprehensive Employee Management System built with Next.js 15, Prisma, and PostgreSQL. This system provides complete functionality for managing employees, attendance, leaves, tasks, documents, and more.

## ✨ Features

### 🔐 1. Authentication & Authorization
- Secure login/signup system
- Role-based access control (Employee, Manager, HR, Admin)
- Password reset functionality
- Two-factor authentication support
- User profile management

### 👥 2. Employee Management
- Complete employee records (personal & professional info)
- Department and organizational structure
- Manager-subordinate relationships
- Employee search and filtering
- Document upload and management

### 📅 3. Attendance Tracking
- Daily check-in/check-out
- Attendance status tracking (Present, Absent, Late, Half-day)
- Work hours calculation
- Late arrival tracking
- Monthly attendance reports
- Location and IP tracking for remote work

### 🏖️ 4. Leave Management
- Multiple leave types (Sick, Casual, Annual, Maternity, Paternity, etc.)
- Leave application and approval workflow
- Leave balance tracking
- Manager/HR approval system
- Leave history and reports

### ✅ 5. Task Management
- Task assignment and tracking
- Priority levels (Low, Medium, High, Urgent)
- Status tracking (Todo, In Progress, Completed)
- Due date management
- Time tracking (estimated vs actual hours)

### 📄 6. Document Management
- Upload employee documents (ID proof, certificates, contracts)
- Document verification system
- Expiry date tracking
- Secure document storage

### 📊 7. Dashboard & Reports
- Quick attendance status overview
- Leave balance at a glance
- Task list and deadlines
- Company announcements
- Performance trends and graphs

### 📢 8. Additional Features
- Company announcements with role-based targeting
- Holiday calendar
- Performance review system
- Real-time notifications
- System settings and configuration

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 20+ installed
- PostgreSQL installed and running
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd employee_management_system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.example` to `.env` and configure:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/employee_management_db?schema=public"
```

### 4. Set up the database
```bash
# Generate Prisma Client
npm run db:generate

# Create database and run migrations
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 6. (Optional) Open Prisma Studio
View and manage your database visually:
```bash
npm run db:studio
```

## 👤 Sample Credentials (after seeding)

- **Admin**: `admin@company.com` / `admin123`
- **Manager**: `manager@company.com` / `manager123`
- **Employee**: `employee@company.com` / `employee123`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and apply migrations |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed database with sample data |

## 📚 Documentation

- **[Prisma Schema Guide](./PRISMA_SCHEMA_GUIDE.md)** - Detailed database schema documentation
- **[API Documentation](./docs/API.md)** - API routes and usage (coming soon)
- **[Component Guide](./docs/COMPONENTS.md)** - UI component documentation (coming soon)

## 🗄️ Database Schema Overview

The system includes the following models:
- **User** - Authentication and access control
- **Employee** - Employee information and records
- **Department** - Organizational structure
- **Attendance** - Daily attendance tracking
- **Leave** - Leave management
- **Task** - Task assignment and tracking
- **Document** - Document management
- **Announcement** - Company announcements
- **PerformanceReview** - Performance evaluations
- **Notification** - User notifications
- **Holiday** - Holiday calendar
- **SystemSettings** - Application configuration

See [PRISMA_SCHEMA_GUIDE.md](./PRISMA_SCHEMA_GUIDE.md) for detailed schema information.

## 🔧 Configuration

### Database
The application uses PostgreSQL by default. To use a different database:
1. Update the `provider` in `prisma/schema.prisma`
2. Update the `DATABASE_URL` in `.env`
3. Run migrations

### Environment Variables
See `.env.example` for all available configuration options.

## 🏗️ Project Structure

```
employee_management_system/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── shared/           # Shared components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   └── types/            # TypeScript types
├── prisma/               # Prisma configuration
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Database ORM by [Prisma](https://www.prisma.io)
- UI components from [Shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the [Prisma Schema Guide](./PRISMA_SCHEMA_GUIDE.md)
- Review the [Next.js Documentation](https://nextjs.org/docs)

---

**Made with ❤️ for efficient employee management**
