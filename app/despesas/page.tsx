import { prisma } from '@/lib/db';
import { DespesasClient } from '@/components/despesas-client';
import { Receipt } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDespesas() {
  const despesas = await prisma.despesa.findMany({
    orderBy: { data: 'desc' },
  });
  return despesas;
}

export default async function DespesasPage() {
  const despesas = await getDespesas();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 rounded-lg">
          <Receipt className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Despesas</h1>
          <p className="text-gray-500">Gerencie suas despesas e custos operacionais</p>
        </div>
      </div>

      <DespesasClient initialDespesas={despesas} />
    </div>
  );
}
