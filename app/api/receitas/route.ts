import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const receitas = await prisma.receita.findMany({
      orderBy: { data: 'desc' },
    });
    return NextResponse.json(receitas ?? []);
  } catch (error) {
    console.error('Error fetching receitas:', error);
    return NextResponse.json({ error: 'Erro ao buscar receitas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request?.json?.();
    const receita = await prisma.receita.create({
      data: {
        data: new Date(body?.data ?? new Date()),
        descricao: body?.descricao ?? '',
        valor: body?.valor ?? 0,
      },
    });
    return NextResponse.json(receita);
  } catch (error) {
    console.error('Error creating receita:', error);
    return NextResponse.json({ error: 'Erro ao criar receita' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request?.json?.();
    const receita = await prisma.receita.update({
      where: { id: body?.id },
      data: {
        data: new Date(body?.data ?? new Date()),
        descricao: body?.descricao ?? '',
        valor: body?.valor ?? 0,
      },
    });
    return NextResponse.json(receita);
  } catch (error) {
    console.error('Error updating receita:', error);
    return NextResponse.json({ error: 'Erro ao atualizar receita' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request?.url ?? '');
    const id = parseInt(searchParams?.get?.('id') ?? '0');
    await prisma.receita.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting receita:', error);
    return NextResponse.json({ error: 'Erro ao excluir receita' }, { status: 500 });
  }
}
