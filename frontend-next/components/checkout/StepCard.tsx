'use client';

import { ReactNode } from 'react';

interface StepCardProps {
  step: number;
  title: string;
  children: ReactNode;
}

export default function StepCard({ step, title, children }: StepCardProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border-warm p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-8 h-8 shrink-0 rounded-full bg-ink text-white flex items-center justify-center font-bold text-sm">
          {step}
        </div>
        <h2 className="text-xl font-serif text-ink m-0">{title}</h2>
      </div>
      {children}
    </div>
  );
}
