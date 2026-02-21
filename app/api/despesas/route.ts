import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const despesas = await prisma.despesa.findMany({
      orderBy: { data: 'desc' },
    });
    return NextResponse.json(despesas ?? []);
  } catch (error) {
    console.error('Error fetching despesas:', error);
    return NextResponse.json({ error: 'Erro ao buscar despesas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request?.json?.();
    const despesa = await prisma.despesa.create({
      data: {
        data: new Date(body?.data ?? new Date()),
        descricao: body?.descricao ?? '',
        valor: body?.valor ?? 0,
        tipo: body?.tipo ?? 'variavel',
      },
    });
    return NextResponse.json(despesa);
  } catch (error) {
    console.error('Error creating despesa:', error);
    return NextResponse.json({ error: 'Erro ao criar despesa' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request?.json?.();
    const despesa = await prisma.despesa.update({
      where: { id: body?.id },
      data: {
        data: new Date(body?.data ?? new Date()),
        descricao: body?.descricao ?? '',
        valor: body?.valor ?? 0,
        tipo: body?.tipo ?? 'variavel',
      },
    });
    return NextResponse.json(despesa);
  } catch (error) {
    console.error('Error updating despesa:', error);
    return NextResponse.json({ error: 'Erro ao atualizar despesa' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request?.url ?? '');
    const id = parseInt(searchParams?.get?.('id') ?? '0');
    await prisma.despesa.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting despesa:', error);
    return NextResponse.json({ error: 'Erro ao excluir despesa' }, { status: 500 });
  }
}
