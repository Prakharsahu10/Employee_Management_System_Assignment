# Employee Management System - Prisma Schema Guide

## 📚 Table of Contents
- [Overview](#overview)
- [Database Models](#database-models)
- [Setup Instructions](#setup-instructions)
- [Available Scripts](#available-scripts)
- [Schema Details](#schema-details)

## 🎯 Overview

This Employee Management System uses Prisma ORM with PostgreSQL to manage all aspects of employee data, attendance, leave management, tasks, and more.

### Key Features
- ✅ User authentication with role-based access control (RBAC)
- ✅ Complete employee profile management
- ✅ Attendance tracking with check-in/check-out
- ✅ Leave management system with approvals
- ✅ Task assignment and tracking
- ✅ Document management
- ✅ Performance reviews
- ✅ Company announcements
- ✅ Holiday management
- ✅ Notifications system

## 🗄️ Database Models

### Core Models

#### 1. **User**
Authentication and access control.
- Credentials (email, username, password)
- Role (EMPLOYEE, MANAGER, HR, ADMIN)
- Two-factor authentication support
- Password reset functionality

#### 2. **Employee**
Complete employee information.
- Personal details (name, DOB, contact info, address)
- Employment details (position, department, manager)
- Compensation (salary, bank details, tax info)
- Leave balance tracking
- Profile settings

#### 3. **Department**
Organizational structure.
- Department name, code, and description
- Location and head information
- Active status tracking

#### 4. **Attendance**
Daily attendance tracking.
- Check-in and check-out times
- Status (PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE, HOLIDAY)
- Work hours calculation
- Late tracking with minutes
- Location and IP tracking for remote work

#### 5. **Leave**
Leave request management.
- Leave types (SICK, CASUAL, ANNUAL, MATERNITY, PATERNITY, UNPAID, COMPENSATORY)
- Date range and total days
- Status (PENDING, APPROVED, REJECTED, CANCELLED)
- Approval workflow
- Supporting documents

#### 6. **Task**
Task assignment and tracking.
- Task details and description
- Assignee and creator tracking
- Status (TODO, IN_PROGRESS, COMPLETED, CANCELLED)
- Priority levels (LOW, MEDIUM, HIGH, URGENT)
- Due dates and time tracking
- Tags and attachments

#### 7. **Document**
Employee document management.
- Document types (ID_PROOF, ADDRESS_PROOF, CERTIFICATE, CONTRACT, etc.)
- File metadata (URL, name, size, MIME type)
- Verification status
- Expiry date tracking

#### 8. **Announcement**
Company-wide announcements.
- Title, content, and priority
- Publication status and dates
- Role-based targeting
- View tracking
- Attachments support

#### 9. **PerformanceReview**
Employee performance evaluations.
- Review period tracking
- Multiple rating criteria (technical skills, communication, teamwork, etc.)
- Strengths and improvement areas
- Goals and comments

#### 10. **Notification**
User notification system.
- Title and message
- Type (info, success, warning, error)
- Read status tracking
- Optional links

#### 11. **Holiday**
Company holiday calendar.
- Holiday name, date, and description
- Optional holiday flag

#### 12. **SystemSettings**
Application configuration.
- Key-value pairs for system settings
- Description field for documentation

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update the database URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/employee_management_db?schema=public"
```

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Create Database & Run Migrations
```bash
# For development (creates migration files)
npm run db:migrate

# For production (applies existing migrations)
npm run db:migrate:deploy

# Or push schema without migrations (for rapid prototyping)
npm run db:push
```

### 5. Seed Database (Optional)
```bash
npm run db:seed
```

This will create:
- 4 departments (Engineering, HR, Finance, Marketing)
- 3 sample users (Admin, Manager, Employee)
- Sample holidays
- Welcome announcement
- System settings

**Sample Credentials:**
- Admin: `admin@company.com` / `admin123`
- Manager: `manager@company.com` / `manager123`
- Employee: `employee@company.com` / `employee123`

### 6. Open Prisma Studio
```bash
npm run db:studio
```

Visit `http://localhost:5555` to view and edit your data visually.

## 📜 Available Scripts

```json
{
  "db:generate": "Generate Prisma Client",
  "db:push": "Push schema to database (no migrations)",
  "db:migrate": "Create and apply migrations",
  "db:migrate:deploy": "Apply migrations in production",
  "db:studio": "Open Prisma Studio GUI",
  "db:seed": "Seed database with sample data"
}
```

## 📋 Schema Details

### Enums

```typescript
enum Role {
  EMPLOYEE, MANAGER, HR, ADMIN
}

enum EmploymentStatus {
  ACTIVE, INACTIVE, ON_LEAVE, TERMINATED
}

enum LeaveType {
  SICK, CASUAL, ANNUAL, MATERNITY, PATERNITY, UNPAID, COMPENSATORY
}

enum LeaveStatus {
  PENDING, APPROVED, REJECTED, CANCELLED
}

enum AttendanceStatus {
  PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE, HOLIDAY
}

enum TaskStatus {
  TODO, IN_PROGRESS, COMPLETED, CANCELLED
}

enum TaskPriority {
  LOW, MEDIUM, HIGH, URGENT
}

enum DocumentType {
  ID_PROOF, ADDRESS_PROOF, CERTIFICATE, CONTRACT, OFFER_LETTER, RESUME, OTHER
}
```

### Relationships

```
User (1) ─── (1) Employee
                    │
                    ├─── (many) Attendance
                    ├─── (many) Leave
                    ├─── (many) Task (as assignee)
                    ├─── (many) Task (as creator)
                    ├─── (many) Document
                    └─── (many) PerformanceReview

Department (1) ─── (many) Employee

Employee (1) ─── (many) Employee (manager-subordinate)

User (1) ─── (many) Notification
```

## 🔐 Security Features

1. **Password Hashing**: Use bcrypt/argon2 for password hashing
2. **Role-Based Access Control**: Four levels of access (EMPLOYEE, MANAGER, HR, ADMIN)
3. **Two-Factor Authentication**: Optional 2FA support
4. **Password Reset**: Secure password reset with expiry tokens
5. **Cascade Deletes**: Proper cleanup of related data

## 💡 Usage Examples

### Import Prisma Client
```typescript
import prisma from '@/lib/prisma'
```

### Create Employee
```typescript
const employee = await prisma.employee.create({
  data: {
    userId: user.id,
    employeeCode: 'EMP004',
    firstName: 'John',
    lastName: 'Doe',
    // ... other fields
    department: {
      connect: { id: departmentId }
    }
  }
})
```

### Track Attendance
```typescript
const attendance = await prisma.attendance.create({
  data: {
    employeeId: employee.id,
    date: new Date(),
    checkIn: new Date(),
    status: 'PRESENT',
    location: 'Office'
  }
})
```

### Apply for Leave
```typescript
const leave = await prisma.leave.create({
  data: {
    employeeId: employee.id,
    leaveType: 'CASUAL',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-01-17'),
    totalDays: 3,
    reason: 'Personal work',
    status: 'PENDING'
  }
})
```

### Get Employee with Relations
```typescript
const employee = await prisma.employee.findUnique({
  where: { id: employeeId },
  include: {
    user: true,
    department: true,
    manager: true,
    attendances: {
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    },
    leaves: {
      where: { status: 'APPROVED' }
    }
  }
})
```

## 🎨 Best Practices

1. **Always use transactions** for operations that modify multiple tables
2. **Index frequently queried fields** (already configured in schema)
3. **Use soft deletes** where appropriate (via `isActive` flags)
4. **Validate data** before database operations
5. **Use Prisma's type safety** to prevent runtime errors
6. **Implement proper error handling** for database operations
7. **Use connection pooling** in production environments

## 📊 Database Indexes

Indexes are already configured for optimal performance:
- User: email, username
- Employee: userId, employeeCode, departmentId, managerId
- Attendance: employeeId, date, status
- Leave: employeeId, status, startDate
- Task: assignedToId, createdById, status, dueDate
- Document: employeeId, documentType
- Notification: userId, isRead, createdAt
- And more...

## 🔄 Migration Workflow

### Development
```bash
# Make schema changes
# Run migration
npm run db:migrate

# Name your migration descriptively
# Example: "add_employee_bio_field"
```

### Production
```bash
# Deploy migrations
npm run db:migrate:deploy
```

## 🆘 Troubleshooting

### Connection Issues
- Verify DATABASE_URL in `.env`
- Check if PostgreSQL is running
- Ensure database exists

### Migration Conflicts
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or resolve conflicts manually
npx prisma migrate resolve --applied <migration_name>
```

### Type Generation Issues
```bash
# Regenerate Prisma Client
npm run db:generate
```

## 📝 Notes

- The schema uses **PostgreSQL** by default. To use MySQL or SQLite, update the `provider` in `prisma/schema.prisma`
- Leave balances are stored directly on the Employee model for quick access
- All timestamps use `DateTime` with automatic updates via `@updatedAt`
- File uploads (documents, attachments) store URLs; implement file storage separately (S3, local, etc.)
- The seed file uses bcryptjs; install it: `npm install bcryptjs` and `npm install -D @types/bcryptjs`

## 🤝 Contributing

When adding new models or fields:
1. Update `schema.prisma`
2. Run `npm run db:migrate`
3. Update this documentation
4. Update seed file if needed
5. Add TypeScript types if using custom queries

---

**Need Help?** Check the [Prisma Documentation](https://www.prisma.io/docs) for detailed guides.
