"use client";

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardData {
  faturamentoMes: number;
  faturamentoAno: number;
  despesasTotais: number;
  lucroLiquido: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, value);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {displayValue?.toLocaleString?.('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }) ?? 'R$ 0,00'}
    </span>
  );
}

export function DashboardCards({ data }: { data: DashboardData }) {
  const cards = [
    {
      title: 'Faturamento Mês',
      value: data?.faturamentoMes ?? 0,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      iconBg: 'bg-green-500',
    },
    {
      title: 'Faturamento Ano',
      value: data?.faturamentoAno ?? 0,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Despesas Totais',
      value: data?.despesasTotais ?? 0,
      icon: TrendingDown,
      color: 'bg-red-100 text-red-600',
      iconBg: 'bg-red-500',
    },
    {
      title: 'Lucro Líquido',
      value: data?.lucroLiquido ?? 0,
      icon: Wallet,
      color: (data?.lucroLiquido ?? 0) >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600',
      iconBg: (data?.lucroLiquido ?? 0) >= 0 ? 'bg-emerald-500' : 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards?.map((card, index) => {
        const Icon = card?.icon;
        return (
          <motion.div
            key={card?.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">{card?.title}</span>
              <div className={`p-2 rounded-lg ${card?.iconBg}`}>
                {Icon && <Icon className="w-5 h-5 text-white" />}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              <AnimatedNumber value={card?.value ?? 0} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
