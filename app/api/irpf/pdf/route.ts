import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

function generateHtml(data: {
  ano: number;
  profile: {
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
  } | null;
  faturamentoBruto: number;
  despesasTotais: number;
  lucroLiquido: number;
  percentualPresuncao: number;
  parcelaIsenta: number;
  parcelaTributavel: number;
}) {
  const profile = data?.profile ?? {};
  const enderecoCompleto = [
    profile?.rua,
    profile?.numero ? `nº ${profile?.numero}` : null,
    profile?.complemento,
    profile?.bairro,
    profile?.cidade,
    profile?.estado,
    profile?.cep ? `CEP: ${profile?.cep}` : null,
  ]?.filter?.(Boolean)?.join?.(', ') ?? 'Não informado';

  const dataGeracao = new Date()?.toLocaleDateString?.('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) ?? '';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório IRPF MEI ${data?.ano ?? ''}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #333;
      padding: 40px;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 3px solid #7c3aed;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #7c3aed;
      font-size: 24px;
      margin-bottom: 5px;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      background-color: #f3e8ff;
      color: #7c3aed;
      padding: 8px 15px;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 15px;
      border-left: 4px solid #7c3aed;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 30px;
    }
    .info-item {
      margin-bottom: 8px;
    }
    .info-item label {
      color: #666;
      font-size: 11px;
      display: block;
    }
    .info-item span {
      font-weight: 600;
      color: #333;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .financial-table {
      width: 100%;
      border-collapse: collapse;
    }
    .financial-table tr {
      border-bottom: 1px solid #e5e7eb;
    }
    .financial-table td {
      padding: 12px 0;
    }
    .financial-table td:last-child {
      text-align: right;
      font-weight: 600;
    }
    .financial-table .positive {
      color: #16a34a;
    }
    .financial-table .negative {
      color: #dc2626;
    }
    .financial-table .highlight {
      background-color: #f3e8ff;
      padding: 12px;
      margin: 0 -15px;
    }
    .financial-table .highlight td {
      font-size: 14px;
    }
    .financial-table .highlight td:last-child {
      color: #7c3aed;
      font-size: 16px;
    }
    .note-box {
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 15px;
      margin-top: 20px;
    }
    .note-box h4 {
      color: #1e40af;
      margin-bottom: 8px;
    }
    .note-box p {
      color: #1e40af;
      font-size: 11px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Relatório IRPF - MEI ${data?.ano ?? ''}</h1>
    <p>Demonstrativo para Declaração de Imposto de Renda Pessoa Física</p>
  </div>

  <div class="section">
    <div class="section-title">Dados do Microempreendedor Individual</div>
    <div class="info-grid">
      <div class="info-item">
        <label>Nome Completo</label>
        <span>${profile?.nome ?? 'Não informado'}</span>
      </div>
      <div class="info-item">
        <label>Nome Fantasia</label>
        <span>${profile?.nomeFantasia ?? 'Não informado'}</span>
      </div>
      <div class="info-item">
        <label>CPF</label>
        <span>${profile?.cpf ?? 'Não informado'}</span>
      </div>
      <div class="info-item">
        <label>CNPJ</label>
        <span>${profile?.cnpj ?? 'Não informado'}</span>
      </div>
      <div class="info-item">
        <label>Tipo de Atividade</label>
        <span>${tiposAtividadeLabels?.[profile?.tipoAtividade ?? ''] ?? 'Não informado'}</span>
      </div>
      <div class="info-item">
        <label>Percentual de Presunção</label>
        <span>${data?.percentualPresuncao ?? 0}%</span>
      </div>
      <div class="info-item full-width">
        <label>Endereço</label>
        <span>${enderecoCompleto}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Demonstrativo Financeiro Anual</div>
    <table class="financial-table">
      <tr>
        <td>Faturamento Bruto Anual</td>
        <td class="positive">${formatCurrency(data?.faturamentoBruto ?? 0)}</td>
      </tr>
      <tr>
        <td>Despesas Dedutíveis</td>
        <td class="negative">${formatCurrency(data?.despesasTotais ?? 0)}</td>
      </tr>
      <tr>
        <td>Lucro Líquido (Faturamento - Despesas)</td>
        <td>${formatCurrency(data?.lucroLiquido ?? 0)}</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Cálculo para IRPF</div>
    <table class="financial-table">
      <tr>
        <td>
          <strong>Parcela Isenta</strong><br>
          <small style="color: #666;">Faturamento Bruto × ${data?.percentualPresuncao ?? 0}% (percentual de presunção)</small>
        </td>
        <td class="positive">${formatCurrency(data?.parcelaIsenta ?? 0)}</td>
      </tr>
      <tr class="highlight">
        <td>
          <strong>Parcela Tributável</strong><br>
          <small style="color: #666;">Lucro Líquido - Parcela Isenta</small>
        </td>
        <td>${formatCurrency(data?.parcelaTributavel ?? 0)}</td>
      </tr>
    </table>
  </div>

  <div class="note-box">
    <h4>Instruções para Declaração</h4>
    <p>
      <strong>Parcela Isenta (${formatCurrency(data?.parcelaIsenta ?? 0)}):</strong> 
      Declarar na ficha "Rendimentos Isentos e Não Tributáveis", código 13 - "Rendimento de sócio ou titular de microempresa ou empresa de pequeno porte optante pelo Simples Nacional".
    </p>
    <p style="margin-top: 8px;">
      <strong>Parcela Tributável (${formatCurrency(data?.parcelaTributavel ?? 0)}):</strong> 
      Declarar na ficha "Rendimentos Tributáveis Recebidos de Pessoa Jurídica", informando o CNPJ do próprio MEI.
    </p>
  </div>

  <div class="footer">
    <p>Documento gerado em ${dataGeracao}</p>
    <p>MEI Control - Sistema de Gestão para Microempreendedor Individual</p>
  </div>
</body>
</html>
  `;
}

export async function POST(request: Request) {
  try {
    const data = await request?.json?.();
    const htmlContent = generateHtml(data);

    // Step 1: Create the PDF generation request
    const createResponse = await fetch('https://apps.abacus.ai/api/createConvertHtmlToPdfRequest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        html_content: htmlContent,
        pdf_options: { format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } },
        base_url: process.env.NEXTAUTH_URL || '',
      }),
    });

    if (!createResponse?.ok) {
      const error = await createResponse?.json?.()?.catch?.(() => ({ error: 'Failed to create PDF request' }));
      return NextResponse.json({ success: false, error: error?.error }, { status: 500 });
    }

    const { request_id } = await createResponse?.json?.();
    if (!request_id) {
      return NextResponse.json({ success: false, error: 'No request ID returned' }, { status: 500 });
    }

    // Step 2: Poll for status until completion
    const maxAttempts = 300;
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const statusResponse = await fetch('https://apps.abacus.ai/api/getConvertHtmlToPdfStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id, deployment_token: process.env.ABACUSAI_API_KEY }),
      });

      const statusResult = await statusResponse?.json?.();
      const status = statusResult?.status || 'FAILED';
      const result = statusResult?.result || null;

      if (status === 'SUCCESS') {
        if (result?.result) {
          const pdfBuffer = Buffer.from(result?.result, 'base64');
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="relatorio-irpf-mei-${data?.ano ?? 'ano'}.pdf"`,
            },
          });
        } else {
          return NextResponse.json({ success: false, error: 'PDF generation completed but no result data' }, { status: 500 });
        }
      } else if (status === 'FAILED') {
        const errorMsg = result?.error || 'PDF generation failed';
        return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
      }

      attempts++;
    }

    return NextResponse.json({ success: false, error: 'PDF generation timed out' }, { status: 500 });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate PDF' }, { status: 500 });
  }
}
