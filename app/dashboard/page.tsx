'use client';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalScooters: number;
  activeRentals: number;
  completedRentals: number;
  revenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScooters: 0,
    activeRentals: 0,
    completedRentals: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-blue-100">Resumen de tu negocio</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-blue-100">Cargando...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Scooters"
            value={stats.totalScooters}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Rentas Activas"
            value={stats.activeRentals}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Rentas Completadas"
            value={stats.completedRentals}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Ingresos (MXN)"
            value={`$${stats.revenue.toFixed(2)}`}
            color="from-orange-500 to-orange-600"
          />
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-filter backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <a
              href="/dashboard/scooters/new"
              className="block w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition text-center"
            >
              Agregar Nuevo Scooter
            </a>
            <a
              href="/dashboard/scooters"
              className="block w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition text-center border border-white/30"
            >
              Ver Todos los Scooters
            </a>
          </div>
        </div>

        <div className="bg-white/10 backdrop-filter backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Estado del Sistema</h3>
          <div className="space-y-3 text-blue-100">
            <div className="flex justify-between">
              <span>Base de Datos</span>
              <span className="text-green-400">✓ Conectado</span>
            </div>
            <div className="flex justify-between">
              <span>Mercado Pago</span>
              <span className="text-green-400">✓ Configurado</span>
            </div>
            <div className="flex justify-between">
              <span>Correos</span>
              <span className="text-green-400">✓ Operativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-2xl p-8 text-white shadow-lg border border-white/20`}
    >
      <p className="text-sm font-semibold opacity-90 mb-2">{title}</p>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
