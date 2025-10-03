import { NextRequest, NextResponse } from "next/server";

// Define Employee interface
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  employeeCode: string;
  employmentStatus: string;
  joinDate: string;
  department: { id: string; name: string; code: string };
  manager: { id: string; firstName: string; lastName: string } | null;
  user: { role: string; isActive: boolean };
}

// In-memory storage as fallback (this will be replaced by database when connection is stable)
let employees: Employee[] = [
  // Engineering Department
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1-555-0101",
    position: "Senior Software Engineer",
    employeeCode: "ENG001",
    employmentStatus: "ACTIVE",
    joinDate: "2022-01-15",
    department: { id: "1", name: "Engineering", code: "ENG" },
    manager: null,
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    phone: "+1-555-0102",
    position: "Engineering Manager",
    employeeCode: "ENG002",
    employmentStatus: "ACTIVE",
    joinDate: "2021-03-10",
    department: { id: "1", name: "Engineering", code: "ENG" },
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    phone: "+1-555-0103",
    position: "Frontend Developer",
    employeeCode: "ENG003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-06-20",
    department: { id: "1", name: "Engineering", code: "ENG" },
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@company.com",
    phone: "+1-555-0104",
    position: "Backend Developer",
    employeeCode: "ENG004",
    employmentStatus: "ACTIVE",
    joinDate: "2023-02-14",
    department: { id: "1", name: "Engineering", code: "ENG" },
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    phone: "+1-555-0105",
    position: "DevOps Engineer",
    employeeCode: "ENG005",
    employmentStatus: "ACTIVE",
    joinDate: "2022-11-08",
    department: { id: "1", name: "Engineering", code: "ENG" },
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // HR Department
  {
    id: "6",
    firstName: "Lisa",
    lastName: "Davis",
    email: "lisa.davis@company.com",
    phone: "+1-555-0106",
    position: "HR Manager",
    employeeCode: "HR001",
    employmentStatus: "ACTIVE",
    joinDate: "2021-01-10",
    department: { id: "2", name: "Human Resources", code: "HR" },
    manager: null,
    user: { role: "HR", isActive: true },
  },
  {
    id: "7",
    firstName: "Chris",
    lastName: "Wilson",
    email: "chris.wilson@company.com",
    phone: "+1-555-0107",
    position: "Recruiter",
    employeeCode: "HR002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-08-15",
    department: { id: "2", name: "Human Resources", code: "HR" },
    manager: { id: "6", firstName: "Lisa", lastName: "Davis" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "8",
    firstName: "Emma",
    lastName: "Garcia",
    email: "emma.garcia@company.com",
    phone: "+1-555-0108",
    position: "HR Business Partner",
    employeeCode: "HR003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-01-22",
    department: { id: "2", name: "Human Resources", code: "HR" },
    manager: { id: "6", firstName: "Lisa", lastName: "Davis" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Marketing Department
  {
    id: "9",
    firstName: "Alex",
    lastName: "Martinez",
    email: "alex.martinez@company.com",
    phone: "+1-555-0109",
    position: "Marketing Manager",
    employeeCode: "MKT001",
    employmentStatus: "ACTIVE",
    joinDate: "2021-09-12",
    department: { id: "3", name: "Marketing", code: "MKT" },
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "10",
    firstName: "Jessica",
    lastName: "Taylor",
    email: "jessica.taylor@company.com",
    phone: "+1-555-0110",
    position: "Digital Marketing Specialist",
    employeeCode: "MKT002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-04-18",
    department: { id: "3", name: "Marketing", code: "MKT" },
    manager: { id: "9", firstName: "Alex", lastName: "Martinez" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "11",
    firstName: "Ryan",
    lastName: "Anderson",
    email: "ryan.anderson@company.com",
    phone: "+1-555-0111",
    position: "Content Creator",
    employeeCode: "MKT003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-07-03",
    department: { id: "3", name: "Marketing", code: "MKT" },
    manager: { id: "9", firstName: "Alex", lastName: "Martinez" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "12",
    firstName: "Megan",
    lastName: "White",
    email: "megan.white@company.com",
    phone: "+1-555-0112",
    position: "Brand Manager",
    employeeCode: "MKT004",
    employmentStatus: "ACTIVE",
    joinDate: "2022-12-05",
    department: { id: "3", name: "Marketing", code: "MKT" },
    manager: { id: "9", firstName: "Alex", lastName: "Martinez" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Finance Department
  {
    id: "13",
    firstName: "Robert",
    lastName: "Thomas",
    email: "robert.thomas@company.com",
    phone: "+1-555-0113",
    position: "Finance Manager",
    employeeCode: "FIN001",
    employmentStatus: "ACTIVE",
    joinDate: "2020-11-15",
    department: { id: "4", name: "Finance", code: "FIN" },
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "14",
    firstName: "Amanda",
    lastName: "Lee",
    email: "amanda.lee@company.com",
    phone: "+1-555-0114",
    position: "Accountant",
    employeeCode: "FIN002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-02-28",
    department: { id: "4", name: "Finance", code: "FIN" },
    manager: { id: "13", firstName: "Robert", lastName: "Thomas" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "15",
    firstName: "Daniel",
    lastName: "Rodriguez",
    email: "daniel.rodriguez@company.com",
    phone: "+1-555-0115",
    position: "Financial Analyst",
    employeeCode: "FIN003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-03-12",
    department: { id: "4", name: "Finance", code: "FIN" },
    manager: { id: "13", firstName: "Robert", lastName: "Thomas" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "16",
    firstName: "Nicole",
    lastName: "Harris",
    email: "nicole.harris@company.com",
    phone: "+1-555-0116",
    position: "Budget Analyst",
    employeeCode: "FIN004",
    employmentStatus: "ACTIVE",
    joinDate: "2021-10-20",
    department: { id: "4", name: "Finance", code: "FIN" },
    manager: { id: "13", firstName: "Robert", lastName: "Thomas" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Operations Department
  {
    id: "17",
    firstName: "Kevin",
    lastName: "Clark",
    email: "kevin.clark@company.com",
    phone: "+1-555-0117",
    position: "Operations Manager",
    employeeCode: "OPS001",
    employmentStatus: "ACTIVE",
    joinDate: "2021-05-18",
    department: { id: "5", name: "Operations", code: "OPS" },
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "18",
    firstName: "Rachel",
    lastName: "Lewis",
    email: "rachel.lewis@company.com",
    phone: "+1-555-0118",
    position: "Operations Coordinator",
    employeeCode: "OPS002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-09-07",
    department: { id: "5", name: "Operations", code: "OPS" },
    manager: { id: "17", firstName: "Kevin", lastName: "Clark" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "19",
    firstName: "Steven",
    lastName: "Walker",
    email: "steven.walker@company.com",
    phone: "+1-555-0119",
    position: "Process Improvement Specialist",
    employeeCode: "OPS003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-01-16",
    department: { id: "5", name: "Operations", code: "OPS" },
    manager: { id: "17", firstName: "Kevin", lastName: "Clark" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "20",
    firstName: "Ashley",
    lastName: "Hall",
    email: "ashley.hall@company.com",
    phone: "+1-555-0120",
    position: "Supply Chain Analyst",
    employeeCode: "OPS004",
    employmentStatus: "ACTIVE",
    joinDate: "2022-07-11",
    department: { id: "5", name: "Operations", code: "OPS" },
    manager: { id: "17", firstName: "Kevin", lastName: "Clark" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Sales Department
  {
    id: "21",
    firstName: "Mark",
    lastName: "Allen",
    email: "mark.allen@company.com",
    phone: "+1-555-0121",
    position: "Sales Manager",
    employeeCode: "SAL001",
    employmentStatus: "ACTIVE",
    joinDate: "2020-08-25",
    department: { id: "6", name: "Sales", code: "SAL" },
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "22",
    firstName: "Lauren",
    lastName: "Young",
    email: "lauren.young@company.com",
    phone: "+1-555-0122",
    position: "Sales Representative",
    employeeCode: "SAL002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-01-30",
    department: { id: "6", name: "Sales", code: "SAL" },
    manager: { id: "21", firstName: "Mark", lastName: "Allen" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "23",
    firstName: "Brian",
    lastName: "Hernandez",
    email: "brian.hernandez@company.com",
    phone: "+1-555-0123",
    position: "Account Executive",
    employeeCode: "SAL003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-04-14",
    department: { id: "6", name: "Sales", code: "SAL" },
    manager: { id: "21", firstName: "Mark", lastName: "Allen" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "24",
    firstName: "Stephanie",
    lastName: "King",
    email: "stephanie.king@company.com",
    phone: "+1-555-0124",
    position: "Business Development Rep",
    employeeCode: "SAL004",
    employmentStatus: "ACTIVE",
    joinDate: "2022-11-22",
    department: { id: "6", name: "Sales", code: "SAL" },
    manager: { id: "21", firstName: "Mark", lastName: "Allen" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "25",
    firstName: "Jason",
    lastName: "Wright",
    email: "jason.wright@company.com",
    phone: "+1-555-0125",
    position: "Sales Analyst",
    employeeCode: "SAL005",
    employmentStatus: "ACTIVE",
    joinDate: "2023-08-07",
    department: { id: "6", name: "Sales", code: "SAL" },
    manager: { id: "21", firstName: "Mark", lastName: "Allen" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // IT Support Department
  {
    id: "26",
    firstName: "Anthony",
    lastName: "Lopez",
    email: "anthony.lopez@company.com",
    phone: "+1-555-0126",
    position: "IT Manager",
    employeeCode: "IT001",
    employmentStatus: "ACTIVE",
    joinDate: "2021-02-14",
    department: { id: "7", name: "IT Support", code: "IT" },
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "27",
    firstName: "Jennifer",
    lastName: "Hill",
    email: "jennifer.hill@company.com",
    phone: "+1-555-0127",
    position: "System Administrator",
    employeeCode: "IT002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-06-01",
    department: { id: "7", name: "IT Support", code: "IT" },
    manager: { id: "26", firstName: "Anthony", lastName: "Lopez" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "28",
    firstName: "Tyler",
    lastName: "Scott",
    email: "tyler.scott@company.com",
    phone: "+1-555-0128",
    position: "Help Desk Technician",
    employeeCode: "IT003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-02-20",
    department: { id: "7", name: "IT Support", code: "IT" },
    manager: { id: "26", firstName: "Anthony", lastName: "Lopez" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "29",
    firstName: "Kimberly",
    lastName: "Green",
    email: "kimberly.green@company.com",
    phone: "+1-555-0129",
    position: "Network Engineer",
    employeeCode: "IT004",
    employmentStatus: "ACTIVE",
    joinDate: "2022-10-12",
    department: { id: "7", name: "IT Support", code: "IT" },
    manager: { id: "26", firstName: "Anthony", lastName: "Lopez" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Legal Department
  {
    id: "30",
    firstName: "Matthew",
    lastName: "Adams",
    email: "matthew.adams@company.com",
    phone: "+1-555-0130",
    position: "Legal Counsel",
    employeeCode: "LEG001",
    employmentStatus: "ACTIVE",
    joinDate: "2020-12-07",
    department: { id: "8", name: "Legal", code: "LEG" },
    manager: null,
    user: { role: "MANAGER", isActive: true },
  },
  {
    id: "31",
    firstName: "Patricia",
    lastName: "Baker",
    email: "patricia.baker@company.com",
    phone: "+1-555-0131",
    position: "Legal Assistant",
    employeeCode: "LEG002",
    employmentStatus: "ACTIVE",
    joinDate: "2022-03-15",
    department: { id: "8", name: "Legal", code: "LEG" },
    manager: { id: "30", firstName: "Matthew", lastName: "Adams" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "32",
    firstName: "Joshua",
    lastName: "Gonzalez",
    email: "joshua.gonzalez@company.com",
    phone: "+1-555-0132",
    position: "Compliance Officer",
    employeeCode: "LEG003",
    employmentStatus: "ACTIVE",
    joinDate: "2023-05-08",
    department: { id: "8", name: "Legal", code: "LEG" },
    manager: { id: "30", firstName: "Matthew", lastName: "Adams" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Additional Engineering Team Members
  {
    id: "33",
    firstName: "Catherine",
    lastName: "Nelson",
    email: "catherine.nelson@company.com",
    phone: "+1-555-0133",
    position: "Full Stack Developer",
    employeeCode: "ENG006",
    employmentStatus: "ACTIVE",
    joinDate: "2023-09-12",
    department: { id: "1", name: "Engineering", code: "ENG" },
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "34",
    firstName: "Timothy",
    lastName: "Carter",
    email: "timothy.carter@company.com",
    phone: "+1-555-0134",
    position: "QA Engineer",
    employeeCode: "ENG007",
    employmentStatus: "ACTIVE",
    joinDate: "2022-05-25",
    department: { id: "1", name: "Engineering", code: "ENG" },
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "35",
    firstName: "Rebecca",
    lastName: "Mitchell",
    email: "rebecca.mitchell@company.com",
    phone: "+1-555-0135",
    position: "UI/UX Designer",
    employeeCode: "ENG008",
    employmentStatus: "ACTIVE",
    joinDate: "2023-01-09",
    department: { id: "1", name: "Engineering", code: "ENG" },
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "36",
    firstName: "Andrew",
    lastName: "Perez",
    email: "andrew.perez@company.com",
    phone: "+1-555-0136",
    position: "Data Engineer",
    employeeCode: "ENG009",
    employmentStatus: "ACTIVE",
    joinDate: "2022-08-30",
    department: { id: "1", name: "Engineering", code: "ENG" },
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "37",
    firstName: "Ethan",
    lastName: "Campbell",
    email: "ethan.campbell@company.com",
    phone: "+1-555-0137",
    position: "Mobile Developer",
    employeeCode: "ENG010",
    employmentStatus: "ACTIVE",
    joinDate: "2023-07-25",
    department: { id: "1", name: "Engineering", code: "ENG" },
    manager: { id: "2", firstName: "Jane", lastName: "Smith" },
    user: { role: "EMPLOYEE", isActive: true },
  },

  // Additional Finance Team Members
  {
    id: "38",
    firstName: "Olivia",
    lastName: "Parker",
    email: "olivia.parker@company.com",
    phone: "+1-555-0138",
    position: "Tax Specialist",
    employeeCode: "FIN005",
    employmentStatus: "ACTIVE",
    joinDate: "2022-04-20",
    department: { id: "4", name: "Finance", code: "FIN" },
    manager: { id: "13", firstName: "Robert", lastName: "Thomas" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "39",
    firstName: "Nathan",
    lastName: "Torres",
    email: "nathan.torres@company.com",
    phone: "+1-555-0139",
    position: "Payroll Specialist",
    employeeCode: "FIN006",
    employmentStatus: "ACTIVE",
    joinDate: "2023-06-14",
    department: { id: "4", name: "Finance", code: "FIN" },
    manager: { id: "13", firstName: "Robert", lastName: "Thomas" },
    user: { role: "EMPLOYEE", isActive: true },
  },
  {
    id: "40",
    firstName: "Samantha",
    lastName: "Rivera",
    email: "samantha.rivera@company.com",
    phone: "+1-555-0140",
    position: "Financial Controller",
    employeeCode: "FIN007",
    employmentStatus: "ACTIVE",
    joinDate: "2021-12-03",
    department: { id: "4", name: "Finance", code: "FIN" },
    manager: { id: "13", firstName: "Robert", lastName: "Thomas" },
    user: { role: "EMPLOYEE", isActive: true },
  },
];

// GET /api/employees - Get all employees
export async function GET() {
  try {
    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// POST /api/employees - Create new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      employeeCode,
      departmentId,
      managerId,
      employmentStatus = "ACTIVE",
      joinDate,
      role = "EMPLOYEE",
    } = body;

    // Check if employee code already exists
    const existingEmployee = employees.find(
      (emp) => emp.employeeCode === employeeCode
    );
    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee code already exists" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = employees.find((emp) => emp.email === email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Department mapping
    const departments = {
      "1": { id: "1", name: "Engineering", code: "ENG" },
      "2": { id: "2", name: "Human Resources", code: "HR" },
      "3": { id: "3", name: "Marketing", code: "MKT" },
      "4": { id: "4", name: "Finance", code: "FIN" },
      "5": { id: "5", name: "Operations", code: "OPS" },
      "6": { id: "6", name: "Sales", code: "SAL" },
      "7": { id: "7", name: "IT Support", code: "IT" },
      "8": { id: "8", name: "Legal", code: "LEG" },
    };

    const department = departments[departmentId as keyof typeof departments];
    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 400 }
      );
    }

    // Find manager if specified
    let manager = null;
    if (managerId) {
      manager = employees.find((emp) => emp.id === managerId);
      if (!manager) {
        return NextResponse.json(
          { error: "Manager not found" },
          { status: 400 }
        );
      }
      manager = {
        id: manager.id,
        firstName: manager.firstName,
        lastName: manager.lastName,
      };
    }

    // Create new employee
    const newEmployee: Employee = {
      id: (employees.length + 1).toString(),
      firstName,
      lastName,
      email,
      phone,
      position,
      employeeCode,
      employmentStatus,
      joinDate: joinDate || new Date().toISOString().split("T")[0],
      department,
      manager,
      user: {
        role: role.toUpperCase(),
        isActive: true,
      },
    };

    employees.push(newEmployee);

    return NextResponse.json({ employee: newEmployee }, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
