import { type ReactNode } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  label?: string;
  showValue?: boolean;
}

export function ProgressBar({ value, color, label, showValue }: ProgressBarProps) {
  const pct = Math.min(Math.max(value, 0), 100);
  const barColor = color ?? 'bg-teal-500';
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-slate-600">{label}</span>
          {showValue && <span className="text-sm font-semibold text-slate-700">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValue && !label && (
        <div className="text-right text-sm font-semibold text-slate-700 mt-1">{Math.round(pct)}%</div>
      )}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  color?: 'teal' | 'amber' | 'rose' | 'slate' | 'blue' | 'green';
}

export function Badge({ children, color = 'slate' }: BadgeProps) {
  const colors: Record<string, string> = {
    teal: 'bg-teal-100 text-teal-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
    slate: 'bg-slate-100 text-slate-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function SectionTitle({ title, subtitle, icon }: SectionTitleProps) {
  return (
    <div className="flex items-start gap-3 mb-6">
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

interface SkillLevelDotsProps {
  level: number; // 0-5
  max?: number;
}

export function SkillLevelDots({ level, max = 5 }: SkillLevelDotsProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i < level ? 'bg-teal-500' : 'bg-slate-200'}`}
        />
      ))}
    </div>
  );
}