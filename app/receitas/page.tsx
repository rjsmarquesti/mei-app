import { prisma } from '@/lib/db';
import { ReceitasClient } from '@/components/receitas-client';
import { DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getReceitas() {
  const receitas = await prisma.receita.findMany({
    orderBy: { data: 'desc' },
  });
  return receitas;
}

export default async function ReceitasPage() {
  const receitas = await getReceitas();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-green-100 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receitas</h1>
          <p className="text-gray-500">Gerencie suas receitas e faturamento</p>
        </div>
      </div>

      <ReceitasClient initialReceitas={receitas} />
    </div>
  );
}
