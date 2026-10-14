export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
      <nav className="bg-white/10 backdrop-filter backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">PUNTA BIKERS Admin</h1>
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="text-blue-100 hover:text-white transition"
            >
              Dashboard
            </a>
            <a
              href="/dashboard/scooters"
              className="text-blue-100 hover:text-white transition"
            >
              Scooters
            </a>
            <a
              href="/api/auth/logout"
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition"
            >
              Salir
            </a>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
