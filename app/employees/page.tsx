export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your employee database
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Add Employee
        </button>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <p className="text-muted-foreground">
          Employee list will be displayed here
        </p>
      </div>
    </div>
  );
}
