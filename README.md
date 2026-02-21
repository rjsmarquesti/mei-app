# MEI Control - Sistema de Gestão para Microempreendedor Individual

Sistema web completo para gestão financeira de MEI (Microempreendedor Individual), com controle de receitas, despesas e geração de relatórios para declaração de Imposto de Renda (IRPF).

## 📋 Funcionalidades

- **Dashboard**: Visão geral com métricas de faturamento, despesas e lucro
- **Perfil MEI**: Cadastro e edição dos dados do microempreendedor
- **Receitas**: CRUD completo para gerenciar receitas/faturamento
- **Despesas**: CRUD completo para gerenciar despesas fixas e variáveis
- **Relatório IRPF**: Visualização e geração de PDF para declaração de imposto de renda

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Prisma ORM** - Banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Framer Motion** - Animações
- **Sonner** - Notificações toast

## 📦 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Yarn ou npm

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd mei_saas_system/nextjs_space
```

### 2. Instale as dependências

```bash
yarn install
# ou
npm install
```

### 3. Configure o banco de dados

Crie um arquivo `.env` na pasta `nextjs_space` com a URL do PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/mei_database"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Execute as migrações do Prisma

```bash
yarn prisma generate
yarn prisma db push
```

### 5. Inicie o servidor de desenvolvimento

```bash
yarn dev
```

Acesse: http://localhost:3000

## 📁 Estrutura do Projeto

```
nextjs_space/
├── app/
│   ├── api/
│   │   ├── perfil/route.ts      # API do perfil MEI
│   │   ├── receitas/route.ts    # API de receitas
│   │   ├── despesas/route.ts    # API de despesas
│   │   └── irpf/pdf/route.ts    # API geração de PDF
│   ├── despesas/page.tsx        # Página de despesas
│   ├── irpf/page.tsx            # Página do relatório IRPF
│   ├── perfil/page.tsx          # Página de perfil
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Dashboard
│   └── globals.css              # Estilos globais
├── components/
│   ├── dashboard-cards.tsx      # Cards do dashboard
│   ├── despesas-client.tsx      # Componente de despesas
│   ├── irpf-client.tsx          # Componente do IRPF
│   ├── perfil-form.tsx          # Formulário de perfil
│   ├── receitas-client.tsx      # Componente de receitas
│   └── sidebar.tsx              # Menu lateral
├── lib/
│   ├── db.ts                    # Cliente Prisma
│   └── utils.ts                 # Utilitários
├── prisma/
│   └── schema.prisma            # Schema do banco
└── public/
    ├── favicon.svg              # Ícone do site
    └── og-image.png             # Imagem Open Graph
```

## 💰 Cálculo do IRPF para MEI

O sistema calcula automaticamente as parcelas isenta e tributável:

### Percentuais de Presunção por Atividade:

| Tipo de Atividade | Percentual |
|-------------------|------------|
| Comércio | 8% |
| Indústria | 8% |
| Serviços | 32% |
| Transporte de Passageiros | 16% |
| Transporte de Cargas | 8% |

### Fórmulas:

- **Parcela Isenta** = Faturamento Bruto × Percentual de Presunção
- **Lucro Líquido** = Faturamento Bruto - Despesas
- **Parcela Tributável** = Lucro Líquido - Parcela Isenta

## 📝 Guia de Uso

### 1. Cadastrar Perfil MEI

Acesse "Perfil MEI" no menu e preencha:
- Dados pessoais (nome, CPF, CNPJ)
- Tipo de atividade (determina o percentual de presunção)
- Endereço completo

### 2. Registrar Receitas

Acesse "Receitas" e adicione suas entradas:
- Data da receita
- Descrição do serviço/produto
- Valor recebido

### 3. Registrar Despesas

Acesse "Despesas" e adicione seus gastos:
- Data da despesa
- Descrição
- Valor
- Tipo (Fixa ou Variável)

### 4. Gerar Relatório IRPF

Acesse "Relatório IRPF" para:
- Visualizar resumo anual
- Verificar parcelas isenta e tributável
- Gerar PDF profissional para declaração

## 🔒 Segurança

- Sistema single-user (sem autenticação)
- Dados armazenados localmente no PostgreSQL
- Não transmite dados para servidores externos (exceto geração de PDF)

## 📄 Licença

MIT License - Livre para uso pessoal e comercial.

---

Desenvolvido com ❤️ para o empreendedor brasileiro.
