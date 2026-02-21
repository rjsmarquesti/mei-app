"use client";

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Despesa {
  id: number;
  data: Date | string;
  descricao: string;
  valor: number;
  tipo: string;
}

export function DespesasClient({ initialDespesas }: { initialDespesas: Despesa[] }) {
  const router = useRouter();
  const [despesas, setDespesas] = useState(initialDespesas ?? []);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    data: new Date()?.toISOString?.()?.split?.('T')?.[0] ?? '',
    descricao: '',
    valor: '',
    tipo: 'variavel',
  });

  const total = despesas?.reduce?.((sum, d) => sum + (d?.valor ?? 0), 0) ?? 0;

  const resetForm = () => {
    setFormData({
      data: new Date()?.toISOString?.()?.split?.('T')?.[0] ?? '',
      descricao: '',
      valor: '',
      tipo: 'variavel',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (despesa: Despesa) => {
    const dataStr = typeof despesa?.data === 'string' 
      ? despesa?.data?.split?.('T')?.[0] 
      : new Date(despesa?.data)?.toISOString?.()?.split?.('T')?.[0];
    setFormData({
      data: dataStr ?? '',
      descricao: despesa?.descricao ?? '',
      valor: String(despesa?.valor ?? ''),
      tipo: despesa?.tipo ?? 'variavel',
    });
    setEditingId(despesa?.id ?? null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch('/api/despesas', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          data: formData?.data,
          descricao: formData?.descricao,
          valor: parseFloat(formData?.valor ?? '0'),
          tipo: formData?.tipo,
        }),
      });

      if (!response?.ok) throw new Error('Erro ao salvar');

      toast?.success?.(editingId ? 'Despesa atualizada!' : 'Despesa adicionada!');
      resetForm();
      router?.refresh?.();
      const updated = await fetch('/api/despesas')?.then?.((r) => r?.json?.());
      setDespesas(updated ?? []);
    } catch {
      toast?.error?.('Erro ao salvar despesa');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir esta despesa?')) return;

    try {
      const response = await fetch(`/api/despesas?id=${id}`, { method: 'DELETE' });
      if (!response?.ok) throw new Error('Erro ao excluir');

      toast?.success?.('Despesa excluída!');
      setDespesas((prev) => prev?.filter?.((d) => d?.id !== id) ?? []);
      router?.refresh?.();
    } catch {
      toast?.error?.('Erro ao excluir despesa');
    }
  };

  return (
    <div className="space-y-6">
      {/* Total Card */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
        <p className="text-red-100 text-sm">Total de Despesas</p>
        <p className="text-3xl font-bold">
          {total?.toLocaleString?.('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00'}
        </p>
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5" /> Nova Despesa
      </button>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingId ? 'Editar Despesa' : 'Nova Despesa'}
                </h3>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={formData?.data ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...(p ?? {}), data: e?.target?.value ?? '' }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={formData?.descricao ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...(p ?? {}), descricao: e?.target?.value ?? '' }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData?.valor ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...(p ?? {}), valor: e?.target?.value ?? '' }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={formData?.tipo ?? 'variavel'}
                    onChange={(e) => setFormData((p) => ({ ...(p ?? {}), tipo: e?.target?.value ?? 'variavel' }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fixa">Fixa</option>
                    <option value="variavel">Variável</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Salvar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(despesas?.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma despesa cadastrada
                  </td>
                </tr>
              ) : (
                despesas?.map?.((despesa) => (
                  <motion.tr
                    key={despesa?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(despesa?.data)?.toLocaleDateString?.('pt-BR') ?? '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{despesa?.descricao ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          despesa?.tipo === 'fixa'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {despesa?.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                      {(despesa?.valor ?? 0)?.toLocaleString?.('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(despesa)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(despesa?.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
