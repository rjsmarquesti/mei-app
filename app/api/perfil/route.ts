import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const profile = await prisma.meiProfile.findFirst();
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Erro ao buscar perfil' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request?.json?.();
    const profile = await prisma.meiProfile.create({
      data: {
        nome: body?.nome ?? '',
        nomeFantasia: body?.nomeFantasia ?? null,
        cpf: body?.cpf ?? '',
        cnpj: body?.cnpj ?? '',
        cnae: body?.cnae ?? null,
        tipoAtividade: body?.tipoAtividade ?? 'servicos',
        percentualPresuncao: body?.percentualPresuncao ?? 32,
        rua: body?.rua ?? null,
        numero: body?.numero ?? null,
        complemento: body?.complemento ?? null,
        bairro: body?.bairro ?? null,
        cidade: body?.cidade ?? null,
        estado: body?.estado ?? null,
        cep: body?.cep ?? null,
      },
    });
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Erro ao criar perfil' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request?.json?.();
    const profile = await prisma.meiProfile.update({
      where: { id: body?.id },
      data: {
        nome: body?.nome ?? '',
        nomeFantasia: body?.nomeFantasia ?? null,
        cpf: body?.cpf ?? '',
        cnpj: body?.cnpj ?? '',
        cnae: body?.cnae ?? null,
        tipoAtividade: body?.tipoAtividade ?? 'servicos',
        percentualPresuncao: body?.percentualPresuncao ?? 32,
        rua: body?.rua ?? null,
        numero: body?.numero ?? null,
        complemento: body?.complemento ?? null,
        bairro: body?.bairro ?? null,
        cidade: body?.cidade ?? null,
        estado: body?.estado ?? null,
        cep: body?.cep ?? null,
      },
    });
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
