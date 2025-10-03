export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <p className="text-muted-foreground">
            General application settings will be displayed here
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">User Preferences</h2>
          <p className="text-muted-foreground">
            User preference controls will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
}
