import { prisma } from '@/lib/db';
import { DashboardCards } from '@/components/dashboard-cards';
import { LayoutDashboard } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [receitasMes, receitasAno, despesasAno] = await Promise.all([
    prisma.receita.aggregate({
      _sum: { valor: true },
      where: { data: { gte: startOfMonth } },
    }),
    prisma.receita.aggregate({
      _sum: { valor: true },
      where: { data: { gte: startOfYear } },
    }),
    prisma.despesa.aggregate({
      _sum: { valor: true },
      where: { data: { gte: startOfYear } },
    }),
  ]);

  const faturamentoMes = receitasMes?._sum?.valor ?? 0;
  const faturamentoAno = receitasAno?._sum?.valor ?? 0;
  const despesasTotais = despesasAno?._sum?.valor ?? 0;
  const lucroLiquido = faturamentoAno - despesasTotais;

  return { faturamentoMes, faturamentoAno, despesasTotais, lucroLiquido };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Visão geral das suas finanças</p>
        </div>
      </div>

      <DashboardCards data={data} />
    </div>
  );
}
