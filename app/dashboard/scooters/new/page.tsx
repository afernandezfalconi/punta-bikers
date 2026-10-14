'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewScooterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    model: '',
    licensePlate: '',
    location: 'Puerto Escondido',
    pricePerHour: '100',
    battery: '100',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.model || !formData.licensePlate) {
        setError('El modelo y placa son requeridos');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/scooters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: formData.model,
          licensePlate: formData.licensePlate,
          location: formData.location,
          pricePerHour: parseFloat(formData.pricePerHour),
          battery: parseFloat(formData.battery),
          status: 'available',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear scooter');
      }

      router.push('/dashboard/scooters');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear scooter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/scooters" className="text-blue-300 hover:text-blue-100 mb-4 inline-block">
          ← Volver a Scooters
        </Link>
        <h2 className="text-3xl font-bold text-white mb-2">Nuevo Scooter</h2>
        <p className="text-blue-100">Agrega un nuevo scooter a tu flota</p>
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
              Modelo
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="ej: Xiaomi Mi 3"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Placa
            </label>
            <input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              placeholder="ej: PB-001"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Precio/Hora (MXN)
              </label>
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                min="0"
                step="10"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Batería (%)
              </label>
              <input
                type="number"
                name="battery"
                value={formData.battery}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear Scooter'}
            </button>
            <Link
              href="/dashboard/scooters"
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
