'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Scooter {
  id: string;
  model: string;
  license_plate: string;
  status: string;
  battery: number;
}

export default function NewRentalPage() {
  const router = useRouter();
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    scooter_id: '',
    cost: '100',
  });

  useEffect(() => {
    fetchScooters();
  }, []);

  const fetchScooters = async () => {
    try {
      const res = await fetch('/api/scooters');
      const data = await res.json();
      setScooters(data.filter((s: Scooter) => s.status === 'available'));
    } catch (err) {
      console.error('Error fetching scooters:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.scooter_id) {
        setError('Debe seleccionar un scooter');
        setLoading(false);
        return;
      }

      // Get current user ID from auth context
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();

      if (!userData.user?.id) {
        setError('No se pudo obtener información del usuario');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scooter_id: formData.scooter_id,
          user_id: userData.user.id,
          cost: parseFloat(formData.cost),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear renta');
      }

      router.push('/dashboard/rentals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear renta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/rentals" className="text-blue-300 hover:text-blue-100 mb-4 inline-block">
          ← Volver a Rentas
        </Link>
        <h2 className="text-3xl font-bold text-white mb-2">Nueva Renta</h2>
        <p className="text-blue-100">Crea una nueva renta de scooter</p>
      </div>

      <div className="max-w-2xl bg-white/10 backdrop-filter backdrop-blur-md rounded-2xl p-8 border border-white/20">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Scooter Disponible
            </label>
            <select
              name="scooter_id"
              value={formData.scooter_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Seleccionar scooter...</option>
              {scooters.map(scooter => (
                <option key={scooter.id} value={scooter.id}>
                  {scooter.model} ({scooter.license_plate}) - Batería: {scooter.battery}%
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Costo Estimado (MXN)
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              step="10"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear Renta'}
            </button>
            <Link
              href="/dashboard/rentals"
              className="flex-1 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
