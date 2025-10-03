import {
  PrismaClient,
  Role,
  EmploymentStatus,
  AttendanceStatus,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create departments using upsert to avoid duplicates
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { name: "Engineering" },
      update: {},
      create: {
        name: "Engineering",
        code: "ENG",
        description: "Engineering and Development Department",
        location: "Building A, Floor 3",
      },
    }),
    prisma.department.upsert({
      where: { name: "Human Resources" },
      update: {},
      create: {
        name: "Human Resources",
        code: "HR",
        description: "Human Resources Department",
        location: "Building B, Floor 1",
      },
    }),
    prisma.department.upsert({
      where: { name: "Finance" },
      update: {},
      create: {
        name: "Finance",
        code: "FIN",
        description: "Finance and Accounting Department",
        location: "Building B, Floor 2",
      },
    }),
    prisma.department.upsert({
      where: { name: "Marketing" },
      update: {},
      create: {
        name: "Marketing",
        code: "MKT",
        description: "Marketing and Sales Department",
        location: "Building A, Floor 2",
      },
    }),
    prisma.department.upsert({
      where: { name: "Operations" },
      update: {},
      create: {
        name: "Operations",
        code: "OPS",
        description: "Operations Department",
        location: "Building C, Floor 1",
      },
    }),
    prisma.department.upsert({
      where: { name: "Sales" },
      update: {},
      create: {
        name: "Sales",
        code: "SAL",
        description: "Sales Department",
        location: "Building A, Floor 1",
      },
    }),
    prisma.department.upsert({
      where: { name: "IT Support" },
      update: {},
      create: {
        name: "IT Support",
        code: "IT",
        description: "IT Support Department",
        location: "Building C, Floor 2",
      },
    }),
    prisma.department.upsert({
      where: { name: "Legal" },
      update: {},
      create: {
        name: "Legal",
        code: "LEG",
        description: "Legal Department",
        location: "Building B, Floor 3",
      },
    }),
  ]);

  console.log("✅ Departments created");

  // Create Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@company.com",
      username: "admin",
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const adminEmployee = await prisma.employee.create({
    data: {
      userId: adminUser.id,
      employeeCode: "EMP001",
      firstName: "Admin",
      lastName: "User",
      dateOfBirth: new Date("1990-01-01"),
      gender: "Other",
      phone: "+1234567890",
      personalEmail: "admin.personal@email.com",
      address: "123 Admin Street",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10001",
      emergencyContactName: "Emergency Contact",
      emergencyContactPhone: "+1234567891",
      emergencyContactRelation: "Family",
      position: "System Administrator",
      departmentId: departments[1].id, // HR Department
      joiningDate: new Date("2020-01-01"),
      employmentStatus: EmploymentStatus.ACTIVE,
      employmentType: "Full-time",
      noticePeriod: 30,
      salary: 100000,
    },
  });

  console.log("✅ Admin user created");

  // Create Manager User
  const managerUser = await prisma.user.create({
    data: {
      email: "manager@company.com",
      username: "manager",
      password: await bcrypt.hash("manager123", 10),
      role: Role.MANAGER,
      isActive: true,
    },
  });

  const managerEmployee = await prisma.employee.create({
    data: {
      userId: managerUser.id,
      employeeCode: "EMP002",
      firstName: "John",
      lastName: "Manager",
      dateOfBirth: new Date("1985-05-15"),
      gender: "Male",
      phone: "+1234567892",
      personalEmail: "john.manager@email.com",
      address: "456 Manager Avenue",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10002",
      emergencyContactName: "Jane Manager",
      emergencyContactPhone: "+1234567893",
      emergencyContactRelation: "Spouse",
      position: "Engineering Manager",
      departmentId: departments[0].id, // Engineering Department
      joiningDate: new Date("2021-03-15"),
      employmentStatus: EmploymentStatus.ACTIVE,
      employmentType: "Full-time",
      noticePeriod: 60,
      salary: 120000,
    },
  });

  console.log("✅ Manager user created");

  // Create Sample Employee
  const employeeUser = await prisma.user.create({
    data: {
      email: "employee@company.com",
      username: "employee",
      password: await bcrypt.hash("employee123", 10),
      role: Role.EMPLOYEE,
      isActive: true,
    },
  });

  const employee = await prisma.employee.create({
    data: {
      userId: employeeUser.id,
      employeeCode: "EMP003",
      firstName: "Sarah",
      lastName: "Employee",
      dateOfBirth: new Date("1995-08-20"),
      gender: "Female",
      phone: "+1234567894",
      personalEmail: "sarah.employee@email.com",
      address: "789 Employee Road",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10003",
      emergencyContactName: "Tom Employee",
      emergencyContactPhone: "+1234567895",
      emergencyContactRelation: "Father",
      position: "Software Developer",
      departmentId: departments[0].id, // Engineering Department
      managerId: managerEmployee.id,
      joiningDate: new Date("2023-01-10"),
      employmentStatus: EmploymentStatus.ACTIVE,
      employmentType: "Full-time",
      probationPeriod: 3,
      noticePeriod: 30,
      salary: 80000,
    },
  });

  console.log("✅ Employee user created");

  // Create 40 additional employees
  const additionalEmployees = [
    // Engineering Department (5 more employees)
    {
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@company.com",
      position: "Frontend Developer",
      department: 0,
      employeeCode: "ENG003",
    },
    {
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah.williams@company.com",
      position: "Backend Developer",
      department: 0,
      employeeCode: "ENG004",
    },
    {
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@company.com",
      position: "DevOps Engineer",
      department: 0,
      employeeCode: "ENG005",
    },
    {
      firstName: "Catherine",
      lastName: "Nelson",
      email: "catherine.nelson@company.com",
      position: "Full Stack Developer",
      department: 0,
      employeeCode: "ENG006",
    },
    {
      firstName: "Timothy",
      lastName: "Carter",
      email: "timothy.carter@company.com",
      position: "QA Engineer",
      department: 0,
      employeeCode: "ENG007",
    },

    // HR Department (3 employees)
    {
      firstName: "Lisa",
      lastName: "Davis",
      email: "lisa.davis@company.com",
      position: "HR Manager",
      department: 1,
      employeeCode: "HR001",
    },
    {
      firstName: "Chris",
      lastName: "Wilson",
      email: "chris.wilson@company.com",
      position: "Recruiter",
      department: 1,
      employeeCode: "HR002",
    },
    {
      firstName: "Emma",
      lastName: "Garcia",
      email: "emma.garcia@company.com",
      position: "HR Business Partner",
      department: 1,
      employeeCode: "HR003",
    },

    // Finance Department (7 employees)
    {
      firstName: "Robert",
      lastName: "Thomas",
      email: "robert.thomas@company.com",
      position: "Finance Manager",
      department: 2,
      employeeCode: "FIN001",
    },
    {
      firstName: "Amanda",
      lastName: "Lee",
      email: "amanda.lee@company.com",
      position: "Accountant",
      department: 2,
      employeeCode: "FIN002",
    },
    {
      firstName: "Daniel",
      lastName: "Rodriguez",
      email: "daniel.rodriguez@company.com",
      position: "Financial Analyst",
      department: 2,
      employeeCode: "FIN003",
    },
    {
      firstName: "Nicole",
      lastName: "Harris",
      email: "nicole.harris@company.com",
      position: "Budget Analyst",
      department: 2,
      employeeCode: "FIN004",
    },
    {
      firstName: "Olivia",
      lastName: "Parker",
      email: "olivia.parker@company.com",
      position: "Tax Specialist",
      department: 2,
      employeeCode: "FIN005",
    },
    {
      firstName: "Nathan",
      lastName: "Torres",
      email: "nathan.torres@company.com",
      position: "Payroll Specialist",
      department: 2,
      employeeCode: "FIN006",
    },
    {
      firstName: "Samantha",
      lastName: "Rivera",
      email: "samantha.rivera@company.com",
      position: "Financial Controller",
      department: 2,
      employeeCode: "FIN007",
    },

    // Marketing Department (4 employees)
    {
      firstName: "Alex",
      lastName: "Martinez",
      email: "alex.martinez@company.com",
      position: "Marketing Manager",
      department: 3,
      employeeCode: "MKT001",
    },
    {
      firstName: "Jessica",
      lastName: "Taylor",
      email: "jessica.taylor@company.com",
      position: "Digital Marketing Specialist",
      department: 3,
      employeeCode: "MKT002",
    },
    {
      firstName: "Ryan",
      lastName: "Anderson",
      email: "ryan.anderson@company.com",
      position: "Content Creator",
      department: 3,
      employeeCode: "MKT003",
    },
    {
      firstName: "Megan",
      lastName: "White",
      email: "megan.white@company.com",
      position: "Brand Manager",
      department: 3,
      employeeCode: "MKT004",
    },

    // Operations Department (4 employees)
    {
      firstName: "Kevin",
      lastName: "Clark",
      email: "kevin.clark@company.com",
      position: "Operations Manager",
      department: 4,
      employeeCode: "OPS001",
    },
    {
      firstName: "Rachel",
      lastName: "Lewis",
      email: "rachel.lewis@company.com",
      position: "Operations Coordinator",
      department: 4,
      employeeCode: "OPS002",
    },
    {
      firstName: "Steven",
      lastName: "Walker",
      email: "steven.walker@company.com",
      position: "Process Improvement Specialist",
      department: 4,
      employeeCode: "OPS003",
    },
    {
      firstName: "Ashley",
      lastName: "Hall",
      email: "ashley.hall@company.com",
      position: "Supply Chain Analyst",
      department: 4,
      employeeCode: "OPS004",
    },

    // Sales Department (5 employees)
    {
      firstName: "Mark",
      lastName: "Allen",
      email: "mark.allen@company.com",
      position: "Sales Manager",
      department: 5,
      employeeCode: "SAL001",
    },
    {
      firstName: "Lauren",
      lastName: "Young",
      email: "lauren.young@company.com",
      position: "Sales Representative",
      department: 5,
      employeeCode: "SAL002",
    },
    {
      firstName: "Brian",
      lastName: "Hernandez",
      email: "brian.hernandez@company.com",
      position: "Account Executive",
      department: 5,
      employeeCode: "SAL003",
    },
    {
      firstName: "Stephanie",
      lastName: "King",
      email: "stephanie.king@company.com",
      position: "Business Development Rep",
      department: 5,
      employeeCode: "SAL004",
    },
    {
      firstName: "Jason",
      lastName: "Wright",
      email: "jason.wright@company.com",
      position: "Sales Analyst",
      department: 5,
      employeeCode: "SAL005",
    },

    // IT Support Department (4 employees)
    {
      firstName: "Anthony",
      lastName: "Lopez",
      email: "anthony.lopez@company.com",
      position: "IT Manager",
      department: 6,
      employeeCode: "IT001",
    },
    {
      firstName: "Jennifer",
      lastName: "Hill",
      email: "jennifer.hill@company.com",
      position: "System Administrator",
      department: 6,
      employeeCode: "IT002",
    },
    {
      firstName: "Tyler",
      lastName: "Scott",
      email: "tyler.scott@company.com",
      position: "Help Desk Technician",
      department: 6,
      employeeCode: "IT003",
    },
    {
      firstName: "Kimberly",
      lastName: "Green",
      email: "kimberly.green@company.com",
      position: "Network Engineer",
      department: 6,
      employeeCode: "IT004",
    },

    // Legal Department (3 employees)
    {
      firstName: "Matthew",
      lastName: "Adams",
      email: "matthew.adams@company.com",
      position: "Legal Counsel",
      department: 7,
      employeeCode: "LEG001",
    },
    {
      firstName: "Patricia",
      lastName: "Baker",
      email: "patricia.baker@company.com",
      position: "Legal Assistant",
      department: 7,
      employeeCode: "LEG002",
    },
    {
      firstName: "Joshua",
      lastName: "Gonzalez",
      email: "joshua.gonzalez@company.com",
      position: "Compliance Officer",
      department: 7,
      employeeCode: "LEG003",
    },

    // Additional Engineering Team Members (5 more)
    {
      firstName: "Rebecca",
      lastName: "Mitchell",
      email: "rebecca.mitchell@company.com",
      position: "UI/UX Designer",
      department: 0,
      employeeCode: "ENG008",
    },
    {
      firstName: "Andrew",
      lastName: "Perez",
      email: "andrew.perez@company.com",
      position: "Data Engineer",
      department: 0,
      employeeCode: "ENG009",
    },
    {
      firstName: "Ethan",
      lastName: "Campbell",
      email: "ethan.campbell@company.com",
      position: "Mobile Developer",
      department: 0,
      employeeCode: "ENG010",
    },
    {
      firstName: "Isabella",
      lastName: "Murphy",
      email: "isabella.murphy@company.com",
      position: "Cloud Architect",
      department: 0,
      employeeCode: "ENG011",
    },
    {
      firstName: "Lucas",
      lastName: "Cooper",
      email: "lucas.cooper@company.com",
      position: "Security Engineer",
      department: 0,
      employeeCode: "ENG012",
    },
  ];

  // Create users and employees for additional employees
  for (const emp of additionalEmployees) {
    try {
      const user = await prisma.user.create({
        data: {
          email: emp.email,
          username: emp.email.split("@")[0],
          password: await bcrypt.hash("password123", 10),
          role: Role.EMPLOYEE,
          isActive: true,
        },
      });

      await prisma.employee.create({
        data: {
          userId: user.id,
          employeeCode: emp.employeeCode,
          firstName: emp.firstName,
          lastName: emp.lastName,
          dateOfBirth: new Date("1990-01-01"),
          gender: "Other",
          phone: `+1555${Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0")}`,
          personalEmail: emp.email,
          address: `${Math.floor(Math.random() * 9999)} Main Street`,
          city: "New York",
          state: "NY",
          country: "USA",
          postalCode: "10001",
          emergencyContactName: "Emergency Contact",
          emergencyContactPhone: "+1234567890",
          emergencyContactRelation: "Family",
          position: emp.position,
          departmentId: departments[emp.department].id,
          joiningDate: new Date("2023-01-01"),
          employmentStatus: EmploymentStatus.ACTIVE,
          employmentType: "Full-time",
          noticePeriod: 30,
          salary: 70000 + Math.floor(Math.random() * 50000),
        },
      });
    } catch (error) {
      console.log(
        `⚠️ Skipped ${emp.firstName} ${emp.lastName} - already exists`
      );
    }
  }

  console.log("✅ Additional employees created");

  console.log("✅ Employee user created");

  // Create some holidays
  await prisma.holiday.createMany({
    data: [
      {
        name: "New Year",
        date: new Date("2025-01-01"),
        description: "New Year Day",
        isOptional: false,
      },
      {
        name: "Independence Day",
        date: new Date("2025-07-04"),
        description: "Independence Day",
        isOptional: false,
      },
      {
        name: "Christmas",
        date: new Date("2025-12-25"),
        description: "Christmas Day",
        isOptional: false,
      },
    ],
  });

  console.log("✅ Holidays created");

  // Create a sample announcement
  await prisma.announcement.create({
    data: {
      title: "Welcome to the Employee Management System",
      content:
        "Welcome to our new employee management system. This platform will help you manage your attendance, leaves, tasks, and much more. Please explore and familiarize yourself with the features.",
      priority: "HIGH",
      isPublished: true,
      publishedAt: new Date(),
      createdBy: adminEmployee.id,
      targetRoles: [],
    },
  });

  console.log("✅ Announcement created");

  // Create sample system settings
  await prisma.systemSettings.createMany({
    data: [
      {
        key: "work_hours_per_day",
        value: "8",
        description: "Standard work hours per day",
      },
      {
        key: "late_threshold_minutes",
        value: "15",
        description: "Minutes after which employee is marked as late",
      },
      {
        key: "company_name",
        value: "Your Company Name",
        description: "Company name displayed in the system",
      },
    ],
  });

  console.log("✅ System settings created");

  console.log("🎉 Seeding completed successfully!");
  console.log("\n📋 Sample Credentials:");
  console.log("Admin: admin@company.com / admin123");
  console.log("Manager: manager@company.com / manager123");
  console.log("Employee: employee@company.com / employee123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
