'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Scooter {
  id: string;
  model: string;
  license_plate: string;
  status: 'available' | 'rented' | 'maintenance';
  battery: number;
  location: string;
  price_per_hour: number;
  created_at: string;
}

export default function ScootersPage() {
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScooters();
  }, []);

  const fetchScooters = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/scooters');
      const data = await res.json();
      setScooters(data);
    } catch (err) {
      setError('Error al cargar scooters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteScooter = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este scooter?')) return;

    try {
      const res = await fetch(`/api/scooters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setScooters(scooters.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('Error deleting scooter:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Scooters</h2>
          <p className="text-blue-100">Gestiona tu flota de scooters</p>
        </div>
        <Link
          href="/dashboard/scooters/new"
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition"
        >
          + Agregar Scooter
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-blue-100">Cargando scooters...</p>
        </div>
      ) : scooters.length === 0 ? (
        <div className="text-center py-12 bg-white/10 backdrop-filter backdrop-blur-md rounded-2xl border border-white/20">
          <p className="text-blue-100 mb-4">No hay scooters registrados aún</p>
          <Link
            href="/dashboard/scooters/new"
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
          >
            Crear primer scooter
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scooters.map(scooter => (
            <div
              key={scooter.id}
              className="bg-white/10 backdrop-filter backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-orange-400/50 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{scooter.model}</h3>
                  <p className="text-blue-200 text-sm">{scooter.license_plate}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    scooter.status === 'available'
                      ? 'bg-green-500/30 text-green-200'
                      : scooter.status === 'rented'
                      ? 'bg-blue-500/30 text-blue-200'
                      : 'bg-yellow-500/30 text-yellow-200'
                  }`}
                >
                  {scooter.status === 'available'
                    ? 'Disponible'
                    : scooter.status === 'rented'
                    ? 'Rentado'
                    : 'Mantenimiento'}
                </span>
              </div>

              <div className="space-y-2 mb-6 text-blue-100 text-sm">
                <div className="flex justify-between">
                  <span>Batería:</span>
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${scooter.battery}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Ubicación:</span>
                  <span>{scooter.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarifa:</span>
                  <span>${scooter.price_per_hour}/hora</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/scooters/${scooter.id}/edit`}
                  className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-center text-sm font-semibold"
                >
                  Editar
                </Link>
                <button
                  onClick={() => deleteScooter(scooter.id)}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition text-sm font-semibold"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
