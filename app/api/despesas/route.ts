import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Buscar todas as despesas
export async function GET() {
  try {
    const despesas = await prisma.despesa.findMany({
      orderBy: { data: 'desc' },
    });
    return NextResponse.json(despesas);
  } catch (error) {
    console.error('Error fetching despesas:', error);
    return NextResponse.json({ error: 'Erro ao buscar despesas' }, { status: 500 });
  }
}

// POST - Criar nova despesa
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body?.data || !body?.descricao || typeof body.valor !== 'number') {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const despesa = await prisma.despesa.create({
      data: {
        data: new Date(body.data),
        descricao: body.descricao,
        valor: body.valor,
        tipo: body.tipo ?? 'variavel',
      },
    });

    return NextResponse.json(despesa);
  } catch (error) {
    console.error('Error creating despesa:', error);
    return NextResponse.json({ error: 'Erro ao criar despesa' }, { status: 500 });
  }
}

// PUT - Atualizar despesa
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body?.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const despesa = await prisma.despesa.update({
      where: { id: body.id },
      data: {
        data: new Date(body.data),
        descricao: body.descricao,
        valor: body.valor,
        tipo: body.tipo,
      },
    });

    return NextResponse.json(despesa);
  } catch (error) {
    console.error('Error updating despesa:', error);
    return NextResponse.json({ error: 'Erro ao atualizar despesa' }, { status: 500 });
  }
}

// DELETE - Excluir despesa
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') ?? '0');

    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await prisma.despesa.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting despesa:', error);
    return NextResponse.json({ error: 'Erro ao excluir despesa' }, { status: 500 });
  }
}
