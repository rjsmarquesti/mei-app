import { prisma } from '@/lib/db';
import { PerfilForm } from '@/components/perfil-form';
import { User } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getMeiProfile() {
  const profile = await prisma.meiProfile.findFirst();
  return profile;
}

export default async function PerfilPage() {
  const profile = await getMeiProfile();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perfil MEI</h1>
          <p className="text-gray-500">Cadastre ou atualize os dados do seu MEI</p>
        </div>
      </div>

      <PerfilForm initialData={profile} />
    </div>
  );
}
