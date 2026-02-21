import { prisma } from '@/lib/db';
import { IrpfClient } from '@/components/irpf-client';
import { FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getIrpfData() {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

  const [profile, receitas, despesas] = await Promise.all([
    prisma.meiProfile.findFirst(),
    prisma.receita.aggregate({
      _sum: { valor: true },
      where: { data: { gte: startOfYear, lte: endOfYear } },
    }),
    prisma.despesa.aggregate({
      _sum: { valor: true },
      where: { data: { gte: startOfYear, lte: endOfYear } },
    }),
  ]);

  const faturamentoBruto = receitas?._sum?.valor ?? 0;
  const despesasTotais = despesas?._sum?.valor ?? 0;
  const percentualPresuncao = profile?.percentualPresuncao ?? 32;
  
  const parcelaIsenta = faturamentoBruto * (percentualPresuncao / 100);
  const lucroLiquido = faturamentoBruto - despesasTotais;
  const parcelaTributavel = Math.max(0, lucroLiquido - parcelaIsenta);

  return {
    ano: currentYear,
    profile,
    faturamentoBruto,
    despesasTotais,
    lucroLiquido,
    percentualPresuncao,
    parcelaIsenta,
    parcelaTributavel,
  };
}

export default async function IrpfPage() {
  const data = await getIrpfData();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 rounded-lg">
          <FileText className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatório IRPF</h1>
          <p className="text-gray-500">Visualize e gere o relatório para declaração de imposto de renda</p>
        </div>
      </div>

      <IrpfClient data={data} />
    </div>
  );
}
