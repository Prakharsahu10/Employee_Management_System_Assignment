// Generated Prisma types for frontend use
// Import from @prisma/client when using server-side code

export type {
  User,
  Employee,
  Department,
  Attendance,
  Leave,
  Task,
  Document,
  Announcement,
  PerformanceReview,
  Notification,
  Holiday,
  SystemSettings,
} from '@prisma/client'

export {
  Role,
  EmploymentStatus,
  LeaveType,
  LeaveStatus,
  AttendanceStatus,
  TaskStatus,
  TaskPriority,
  DocumentType,
} from '@prisma/client'

// Extended types with relations
export type EmployeeWithRelations = {
  id: string
  userId: string
  employeeCode: string
  firstName: string
  lastName: string
  email?: string
  position: string
  department?: {
    id: string
    name: string
    code: string
  }
  manager?: {
    id: string
    firstName: string
    lastName: string
  }
  user?: {
    email: string
    role: string
  }
}

export type AttendanceWithEmployee = {
  id: string
  date: Date
  checkIn?: Date
  checkOut?: Date
  status: string
  workHours?: number
  employee: {
    id: string
    firstName: string
    lastName: string
    employeeCode: string
  }
}

export type LeaveWithEmployee = {
  id: string
  leaveType: string
  startDate: Date
  endDate: Date
  totalDays: number
  reason: string
  status: string
  employee: {
    id: string
    firstName: string
    lastName: string
    employeeCode: string
  }
}

export type TaskWithRelations = {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: Date
  assignedTo: {
    id: string
    firstName: string
    lastName: string
  }
  createdBy: {
    id: string
    firstName: string
    lastName: string
  }
}

// Dashboard statistics types
export type DashboardStats = {
  totalEmployees: number
  activeEmployees: number
  todayPresent: number
  todayAbsent: number
  pendingLeaves: number
  pendingTasks: number
}

export type AttendanceSummary = {
  present: number
  absent: number
  late: number
  onLeave: number
  total: number
}

export type LeaveBalance = {
  sick: number
  casual: number
  annual: number
  total: number
}
