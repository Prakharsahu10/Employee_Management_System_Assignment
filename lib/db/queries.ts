import prisma from '@/lib/prisma'
import { AttendanceStatus, LeaveStatus, EmploymentStatus } from '@prisma/client'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'

/**
 * Employee Queries
 */
export async function getEmployeeById(id: string) {
  return prisma.employee.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          email: true,
          role: true,
          isActive: true,
        },
      },
      department: true,
      manager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeCode: true,
        },
      },
    },
  })
}

export async function getEmployeeByUserId(userId: string) {
  return prisma.employee.findUnique({
    where: { userId },
    include: {
      user: true,
      department: true,
      manager: true,
    },
  })
}

export async function getAllActiveEmployees() {
  return prisma.employee.findMany({
    where: {
      employmentStatus: EmploymentStatus.ACTIVE,
    },
    include: {
      department: true,
      manager: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      firstName: 'asc',
    },
  })
}

export async function getEmployeesByDepartment(departmentId: string) {
  return prisma.employee.findMany({
    where: {
      departmentId,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
    include: {
      user: {
        select: {
          email: true,
          role: true,
        },
      },
    },
  })
}

export async function getSubordinates(managerId: string) {
  return prisma.employee.findMany({
    where: {
      managerId,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
    include: {
      department: true,
    },
  })
}

/**
 * Attendance Queries
 */
export async function getTodayAttendance(employeeId: string) {
  const today = new Date()
  return prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId,
        date: startOfDay(today),
      },
    },
  })
}

export async function getAttendanceByDateRange(
  employeeId: string,
  startDate: Date,
  endDate: Date
) {
  return prisma.attendance.findMany({
    where: {
      employeeId,
      date: {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      },
    },
    orderBy: {
      date: 'desc',
    },
  })
}

export async function getMonthlyAttendance(employeeId: string, date: Date) {
  return prisma.attendance.findMany({
    where: {
      employeeId,
      date: {
        gte: startOfMonth(date),
        lte: endOfMonth(date),
      },
    },
    orderBy: {
      date: 'asc',
    },
  })
}

export async function getTodayAttendanceSummary() {
  const today = startOfDay(new Date())
  
  const summary = await prisma.attendance.groupBy({
    by: ['status'],
    where: {
      date: today,
    },
    _count: true,
  })

  return summary.reduce((acc, curr) => {
    acc[curr.status] = curr._count
    return acc
  }, {} as Record<AttendanceStatus, number>)
}

/**
 * Leave Queries
 */
export async function getLeaveBalance(employeeId: string) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: {
      sickLeaveBalance: true,
      casualLeaveBalance: true,
      annualLeaveBalance: true,
    },
  })

  return employee
}

export async function getPendingLeaves(managerId?: string) {
  const where = managerId
    ? {
        status: LeaveStatus.PENDING,
        employee: {
          managerId,
        },
      }
    : {
        status: LeaveStatus.PENDING,
      }

  return prisma.leave.findMany({
    where,
    include: {
      employee: {
        select: {
          firstName: true,
          lastName: true,
          employeeCode: true,
          department: true,
        },
      },
    },
    orderBy: {
      appliedAt: 'desc',
    },
  })
}

export async function getEmployeeLeaves(employeeId: string, limit = 10) {
  return prisma.leave.findMany({
    where: {
      employeeId,
    },
    orderBy: {
      startDate: 'desc',
    },
    take: limit,
  })
}

/**
 * Task Queries
 */
export async function getEmployeeTasks(employeeId: string) {
  return prisma.task.findMany({
    where: {
      assignedToId: employeeId,
    },
    include: {
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: [
      { status: 'asc' },
      { priority: 'desc' },
      { dueDate: 'asc' },
    ],
  })
}

export async function getPendingTasks(employeeId: string) {
  return prisma.task.findMany({
    where: {
      assignedToId: employeeId,
      status: {
        in: ['TODO', 'IN_PROGRESS'],
      },
    },
    orderBy: [
      { priority: 'desc' },
      { dueDate: 'asc' },
    ],
  })
}

/**
 * Document Queries
 */
export async function getEmployeeDocuments(employeeId: string) {
  return prisma.document.findMany({
    where: {
      employeeId,
    },
    orderBy: {
      uploadedAt: 'desc',
    },
  })
}

export async function getUnverifiedDocuments() {
  return prisma.document.findMany({
    where: {
      isVerified: false,
    },
    include: {
      employee: {
        select: {
          firstName: true,
          lastName: true,
          employeeCode: true,
        },
      },
    },
    orderBy: {
      uploadedAt: 'asc',
    },
  })
}

/**
 * Announcement Queries
 */
export async function getActiveAnnouncements(userRole?: string) {
  const now = new Date()
  
  return prisma.announcement.findMany({
    where: {
      isPublished: true,
      publishedAt: {
        lte: now,
      },
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: now } },
      ],
      ...(userRole && {
        OR: [
          { targetRoles: { isEmpty: true } },
          { targetRoles: { has: userRole } },
        ],
      }),
    },
    orderBy: [
      { priority: 'desc' },
      { publishedAt: 'desc' },
    ],
  })
}

/**
 * Notification Queries
 */
export async function getUnreadNotifications(userId: string) {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  })
}

/**
 * Dashboard Statistics
 */
export async function getDashboardStats() {
  const today = startOfDay(new Date())

  const [
    totalEmployees,
    activeEmployees,
    todayAttendance,
    pendingLeaves,
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({
      where: {
        employmentStatus: EmploymentStatus.ACTIVE,
      },
    }),
    prisma.attendance.findMany({
      where: {
        date: today,
      },
      select: {
        status: true,
      },
    }),
    prisma.leave.count({
      where: {
        status: LeaveStatus.PENDING,
      },
    }),
  ])

  const presentToday = todayAttendance.filter(
    (a) => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE
  ).length

  const absentToday = todayAttendance.filter(
    (a) => a.status === AttendanceStatus.ABSENT
  ).length

  return {
    totalEmployees,
    activeEmployees,
    todayPresent: presentToday,
    todayAbsent: absentToday,
    pendingLeaves,
  }
}

/**
 * Department Queries
 */
export async function getAllDepartments() {
  return prisma.department.findMany({
    where: {
      isActive: true,
    },
    include: {
      _count: {
        select: {
          employees: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}

/**
 * Holiday Queries
 */
export async function getUpcomingHolidays(limit = 5) {
  const today = new Date()
  
  return prisma.holiday.findMany({
    where: {
      date: {
        gte: today,
      },
    },
    orderBy: {
      date: 'asc',
    },
    take: limit,
  })
}
