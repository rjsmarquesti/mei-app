"use client";

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const tiposAtividade = [
  { label: 'Comércio', value: 'comercio', percentual: 8 },
  { label: 'Indústria', value: 'industria', percentual: 8 },
  { label: 'Serviços', value: 'servicos', percentual: 32 },
  { label: 'Transporte de Passageiros', value: 'transporte_passageiros', percentual: 16 },
  { label: 'Transporte de Cargas', value: 'transporte_cargas', percentual: 8 },
];

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

interface MeiProfile {
  id?: number;
  nome?: string;
  nomeFantasia?: string | null;
  cpf?: string;
  cnpj?: string;
  cnae?: string | null;
  tipoAtividade?: string;
  percentualPresuncao?: number;
  rua?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
}

export function PerfilForm({ initialData }: { initialData: MeiProfile | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: initialData?.nome ?? '',
    nomeFantasia: initialData?.nomeFantasia ?? '',
    cpf: initialData?.cpf ?? '',
    cnpj: initialData?.cnpj ?? '',
    cnae: initialData?.cnae ?? '',
    tipoAtividade: initialData?.tipoAtividade ?? 'servicos',
    rua: initialData?.rua ?? '',
    numero: initialData?.numero ?? '',
    complemento: initialData?.complemento ?? '',
    bairro: initialData?.bairro ?? '',
    cidade: initialData?.cidade ?? '',
    estado: initialData?.estado ?? '',
    cep: initialData?.cep ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e?.target ?? {};
    setFormData((prev) => ({ ...(prev ?? {}), [name ?? '']: value ?? '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setLoading(true);

    try {
      const tipo = tiposAtividade?.find((t) => t?.value === formData?.tipoAtividade);
      const response = await fetch('/api/perfil', {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: initialData?.id,
          percentualPresuncao: tipo?.percentual ?? 32,
        }),
      });

      if (!response?.ok) throw new Error('Erro ao salvar');

      toast?.success?.('Perfil salvo com sucesso!');
      router?.refresh?.();
    } catch {
      toast?.error?.('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Dados Pessoais</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
          <input
            type="text"
            name="nome"
            value={formData?.nome ?? ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
          <input
            type="text"
            name="nomeFantasia"
            value={formData?.nomeFantasia ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
          <input
            type="text"
            name="cpf"
            value={formData?.cpf ?? ''}
            onChange={handleChange}
            required
            placeholder="000.000.000-00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ *</label>
          <input
            type="text"
            name="cnpj"
            value={formData?.cnpj ?? ''}
            onChange={handleChange}
            required
            placeholder="00.000.000/0001-00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNAE</label>
          <input
            type="text"
            name="cnae"
            value={formData?.cnae ?? ''}
            onChange={handleChange}
            placeholder="0000-0/00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Atividade *</label>
          <select
            name="tipoAtividade"
            value={formData?.tipoAtividade ?? 'servicos'}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {tiposAtividade?.map((tipo) => (
              <option key={tipo?.value} value={tipo?.value}>
                {tipo?.label} ({tipo?.percentual}%)
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Endereço</h3>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
          <input
            type="text"
            name="rua"
            value={formData?.rua ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <input
              type="text"
              name="numero"
              value={formData?.numero ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
            <input
              type="text"
              name="complemento"
              value={formData?.complemento ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
          <input
            type="text"
            name="bairro"
            value={formData?.bairro ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
          <input
            type="text"
            name="cidade"
            value={formData?.cidade ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            name="estado"
            value={formData?.estado ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Selecione...</option>
            {estados?.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
          <input
            type="text"
            name="cep"
            value={formData?.cep ?? ''}
            onChange={handleChange}
            placeholder="00000-000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Salvar Perfil
        </button>
      </div>
    </form>
  );
}
