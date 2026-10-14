'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Rental {
  id: string;
  scooter_id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  status: 'active' | 'completed' | 'cancelled';
  cost: number;
  scooters?: { model: string; license_plate: string };
  user?: { email: string };
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/rentals');
      const data = await res.json();
      setRentals(data);
    } catch (err) {
      setError('Error al cargar rentas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completeRental = async (id: string) => {
    try {
      const res = await fetch(`/api/rentals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          end_time: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setRentals(rentals.map(r =>
          r.id === id
            ? { ...r, status: 'completed', end_time: new Date().toISOString() }
            : r
        ));
      }
    } catch (err) {
      console.error('Error completing rental:', err);
    }
  };

  const cancelRental = async (id: string) => {
    if (!confirm('¿Cancelar esta renta?')) return;

    try {
      const res = await fetch(`/api/rentals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (res.ok) {
        setRentals(rentals.map(r =>
          r.id === id ? { ...r, status: 'cancelled' } : r
        ));
      }
    } catch (err) {
      console.error('Error cancelling rental:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Rentas</h2>
          <p className="text-blue-100">Gestiona todas las rentas de tu flota</p>
        </div>
        <Link
          href="/dashboard/rentals/new"
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition"
        >
          + Nueva Renta
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-blue-100">Cargando rentas...</p>
        </div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-12 bg-white/10 backdrop-filter backdrop-blur-md rounded-2xl border border-white/20">
          <p className="text-blue-100 mb-4">No hay rentas registradas</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-4 text-white font-semibold">Scooter</th>
                <th className="text-left py-4 px-4 text-white font-semibold">Usuario</th>
                <th className="text-left py-4 px-4 text-white font-semibold">Inicio</th>
                <th className="text-left py-4 px-4 text-white font-semibold">Fin</th>
                <th className="text-left py-4 px-4 text-white font-semibold">Estado</th>
                <th className="text-left py-4 px-4 text-white font-semibold">Costo</th>
                <th className="text-left py-4 px-4 text-white font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map(rental => (
                <tr
                  key={rental.id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="py-4 px-4 text-blue-100">
                    {rental.scooters?.model} ({rental.scooters?.license_plate})
                  </td>
                  <td className="py-4 px-4 text-blue-100">{rental.user?.email}</td>
                  <td className="py-4 px-4 text-blue-100">
                    {new Date(rental.start_time).toLocaleString('es-MX')}
                  </td>
                  <td className="py-4 px-4 text-blue-100">
                    {rental.end_time
                      ? new Date(rental.end_time).toLocaleString('es-MX')
                      : '-'}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        rental.status === 'active'
                          ? 'bg-green-500/30 text-green-200'
                          : rental.status === 'completed'
                          ? 'bg-blue-500/30 text-blue-200'
                          : 'bg-red-500/30 text-red-200'
                      }`}
                    >
                      {rental.status === 'active'
                        ? 'Activa'
                        : rental.status === 'completed'
                        ? 'Completada'
                        : 'Cancelada'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-blue-100">${rental.cost.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    {rental.status === 'active' && (
                      <>
                        <button
                          onClick={() => completeRental(rental.id)}
                          className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded text-sm mr-2 transition"
                        >
                          Completar
                        </button>
                        <button
                          onClick={() => cancelRental(rental.id)}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded text-sm transition"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
