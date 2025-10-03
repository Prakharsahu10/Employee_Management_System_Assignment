import { PrismaClient, Role, EmploymentStatus, AttendanceStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Engineering',
        code: 'ENG',
        description: 'Engineering and Development Department',
        location: 'Building A, Floor 3',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Human Resources',
        code: 'HR',
        description: 'Human Resources Department',
        location: 'Building B, Floor 1',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Finance',
        code: 'FIN',
        description: 'Finance and Accounting Department',
        location: 'Building B, Floor 2',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Marketing',
        code: 'MKT',
        description: 'Marketing and Sales Department',
        location: 'Building A, Floor 2',
      },
    }),
  ])

  console.log('✅ Departments created')

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@company.com',
      username: 'admin',
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  })

  const adminEmployee = await prisma.employee.create({
    data: {
      userId: adminUser.id,
      employeeCode: 'EMP001',
      firstName: 'Admin',
      lastName: 'User',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Other',
      phone: '+1234567890',
      personalEmail: 'admin.personal@email.com',
      address: '123 Admin Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '+1234567891',
      emergencyContactRelation: 'Family',
      position: 'System Administrator',
      departmentId: departments[1].id, // HR Department
      joiningDate: new Date('2020-01-01'),
      employmentStatus: EmploymentStatus.ACTIVE,
      employmentType: 'Full-time',
      noticePeriod: 30,
      salary: 100000,
    },
  })

  console.log('✅ Admin user created')

  // Create Manager User
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@company.com',
      username: 'manager',
      password: await bcrypt.hash('manager123', 10),
      role: Role.MANAGER,
      isActive: true,
    },
  })

  const managerEmployee = await prisma.employee.create({
    data: {
      userId: managerUser.id,
      employeeCode: 'EMP002',
      firstName: 'John',
      lastName: 'Manager',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'Male',
      phone: '+1234567892',
      personalEmail: 'john.manager@email.com',
      address: '456 Manager Avenue',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10002',
      emergencyContactName: 'Jane Manager',
      emergencyContactPhone: '+1234567893',
      emergencyContactRelation: 'Spouse',
      position: 'Engineering Manager',
      departmentId: departments[0].id, // Engineering Department
      joiningDate: new Date('2021-03-15'),
      employmentStatus: EmploymentStatus.ACTIVE,
      employmentType: 'Full-time',
      noticePeriod: 60,
      salary: 120000,
    },
  })

  console.log('✅ Manager user created')

  // Create Sample Employee
  const employeeUser = await prisma.user.create({
    data: {
      email: 'employee@company.com',
      username: 'employee',
      password: await bcrypt.hash('employee123', 10),
      role: Role.EMPLOYEE,
      isActive: true,
    },
  })

  const employee = await prisma.employee.create({
    data: {
      userId: employeeUser.id,
      employeeCode: 'EMP003',
      firstName: 'Sarah',
      lastName: 'Employee',
      dateOfBirth: new Date('1995-08-20'),
      gender: 'Female',
      phone: '+1234567894',
      personalEmail: 'sarah.employee@email.com',
      address: '789 Employee Road',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10003',
      emergencyContactName: 'Tom Employee',
      emergencyContactPhone: '+1234567895',
      emergencyContactRelation: 'Father',
      position: 'Software Developer',
      departmentId: departments[0].id, // Engineering Department
      managerId: managerEmployee.id,
      joiningDate: new Date('2023-01-10'),
      employmentStatus: EmploymentStatus.ACTIVE,
      employmentType: 'Full-time',
      probationPeriod: 3,
      noticePeriod: 30,
      salary: 80000,
    },
  })

  console.log('✅ Employee user created')

  // Create some holidays
  await prisma.holiday.createMany({
    data: [
      {
        name: 'New Year',
        date: new Date('2025-01-01'),
        description: 'New Year Day',
        isOptional: false,
      },
      {
        name: 'Independence Day',
        date: new Date('2025-07-04'),
        description: 'Independence Day',
        isOptional: false,
      },
      {
        name: 'Christmas',
        date: new Date('2025-12-25'),
        description: 'Christmas Day',
        isOptional: false,
      },
    ],
  })

  console.log('✅ Holidays created')

  // Create a sample announcement
  await prisma.announcement.create({
    data: {
      title: 'Welcome to the Employee Management System',
      content: 'Welcome to our new employee management system. This platform will help you manage your attendance, leaves, tasks, and much more. Please explore and familiarize yourself with the features.',
      priority: 'HIGH',
      isPublished: true,
      publishedAt: new Date(),
      createdBy: adminEmployee.id,
      targetRoles: [],
    },
  })

  console.log('✅ Announcement created')

  // Create sample system settings
  await prisma.systemSettings.createMany({
    data: [
      {
        key: 'work_hours_per_day',
        value: '8',
        description: 'Standard work hours per day',
      },
      {
        key: 'late_threshold_minutes',
        value: '15',
        description: 'Minutes after which employee is marked as late',
      },
      {
        key: 'company_name',
        value: 'Your Company Name',
        description: 'Company name displayed in the system',
      },
    ],
  })

  console.log('✅ System settings created')

  console.log('🎉 Seeding completed successfully!')
  console.log('\n📋 Sample Credentials:')
  console.log('Admin: admin@company.com / admin123')
  console.log('Manager: manager@company.com / manager123')
  console.log('Employee: employee@company.com / employee123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
