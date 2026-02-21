"use client";

import { useState } from 'react';
import { Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface MeiProfile {
  nome?: string;
  nomeFantasia?: string | null;
  cpf?: string;
  cnpj?: string;
  tipoAtividade?: string;
  rua?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
}

interface IrpfData {
  ano: number;
  profile: MeiProfile | null;
  faturamentoBruto: number;
  despesasTotais: number;
  lucroLiquido: number;
  percentualPresuncao: number;
  parcelaIsenta: number;
  parcelaTributavel: number;
}

const tiposAtividadeLabels: Record<string, string> = {
  comercio: 'Comércio',
  industria: 'Indústria',
  servicos: 'Serviços',
  transporte_passageiros: 'Transporte de Passageiros',
  transporte_cargas: 'Transporte de Cargas',
};

function formatCurrency(value: number) {
  return (value ?? 0)?.toLocaleString?.('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00';
}

export function IrpfClient({ data }: { data: IrpfData }) {
  const [loading, setLoading] = useState(false);

  const profile = data?.profile;
  const hasProfile = !!profile?.nome && !!profile?.cpf && !!profile?.cnpj;

  const enderecoCompleto = [
    profile?.rua,
    profile?.numero ? `nº ${profile?.numero}` : null,
    profile?.complemento,
    profile?.bairro,
    profile?.cidade,
    profile?.estado,
    profile?.cep ? `CEP: ${profile?.cep}` : null,
  ]?.filter?.(Boolean)?.join?.(', ') ?? 'Não informado';

  const handleGeneratePdf = async () => {
    if (!hasProfile) {
      toast?.error?.('Cadastre os dados do MEI antes de gerar o relatório');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/irpf/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response?.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const blob = await response?.blob?.();
      const url = window?.URL?.createObjectURL?.(blob);
      const a = document?.createElement?.('a');
      a.href = url ?? '';
      a.download = `relatorio-irpf-mei-${data?.ano ?? 'ano'}?.pdf`;
      document?.body?.appendChild?.(a);
      a?.click?.();
      window?.URL?.revokeObjectURL?.(url ?? '');
      document?.body?.removeChild?.(a);

      toast?.success?.('PDF gerado com sucesso!');
    } catch {
      toast?.error?.('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning if no profile */}
      {!hasProfile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Perfil MEI não cadastrado</p>
            <p className="text-sm text-yellow-700">Cadastre os dados do MEI na página de Perfil para gerar o relatório IRPF.</p>
          </div>
        </motion.div>
      )}

      {/* Year Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <p className="text-purple-100 text-sm">Ano de Referência</p>
        <p className="text-4xl font-bold">{data?.ano ?? new Date().getFullYear()}</p>
      </div>

      {/* MEI Data Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Dados do MEI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Nome:</span>
            <p className="font-medium text-gray-900">{profile?.nome ?? 'Não informado'}</p>
          </div>
          <div>
            <span className="text-gray-500">Nome Fantasia:</span>
            <p className="font-medium text-gray-900">{profile?.nomeFantasia ?? 'Não informado'}</p>
          </div>
          <div>
            <span className="text-gray-500">CPF:</span>
            <p className="font-medium text-gray-900">{profile?.cpf ?? 'Não informado'}</p>
          </div>
          <div>
            <span className="text-gray-500">CNPJ:</span>
            <p className="font-medium text-gray-900">{profile?.cnpj ?? 'Não informado'}</p>
          </div>
          <div>
            <span className="text-gray-500">Tipo de Atividade:</span>
            <p className="font-medium text-gray-900">
              {tiposAtividadeLabels?.[profile?.tipoAtividade ?? ''] ?? 'Não informado'}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Percentual de Presunção:</span>
            <p className="font-medium text-gray-900">{data?.percentualPresuncao ?? 0}%</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-500">Endereço:</span>
            <p className="font-medium text-gray-900">{enderecoCompleto}</p>
          </div>
        </div>
      </motion.div>

      {/* Financial Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Resumo Financeiro</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Faturamento Bruto Anual</span>
            <span className="text-lg font-semibold text-green-600">{formatCurrency(data?.faturamentoBruto ?? 0)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Despesas Dedutíveis</span>
            <span className="text-lg font-semibold text-red-600">{formatCurrency(data?.despesasTotais ?? 0)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Lucro Líquido</span>
            <span className="text-lg font-semibold text-blue-600">{formatCurrency(data?.lucroLiquido ?? 0)}</span>
          </div>
        </div>
      </motion.div>

      {/* Tax Calculation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Cálculo IRPF</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <span className="text-gray-600">Parcela Isenta</span>
              <p className="text-xs text-gray-400">Faturamento × {data?.percentualPresuncao ?? 0}% (presunção)</p>
            </div>
            <span className="text-lg font-semibold text-emerald-600">{formatCurrency(data?.parcelaIsenta ?? 0)}</span>
          </div>
          <div className="flex justify-between items-center py-3 bg-purple-50 -mx-6 px-6 rounded-lg">
            <div>
              <span className="text-gray-800 font-medium">Parcela Tributável</span>
              <p className="text-xs text-gray-500">Lucro Líquido - Parcela Isenta</p>
            </div>
            <span className="text-xl font-bold text-purple-600">{formatCurrency(data?.parcelaTributavel ?? 0)}</span>
          </div>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3"
      >
        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-800">Como declarar no IRPF</p>
          <p className="text-blue-700 mt-1">
            A <strong>Parcela Isenta</strong> deve ser declarada na ficha "Rendimentos Isentos e Não Tributáveis".
            A <strong>Parcela Tributável</strong> deve ser declarada na ficha "Rendimentos Tributáveis Recebidos de Pessoa Jurídica".
          </p>
        </div>
      </motion.div>

      {/* Generate PDF Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleGeneratePdf}
          disabled={loading || !hasProfile}
          className="flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-lg shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Download className="w-6 h-6" />
          )}
          Gerar Relatório PDF
        </button>
      </div>
    </div>
  );
}
