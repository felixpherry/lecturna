import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        'filter-badge':
          'border-transparent bg-secondary text-secondary-foreground hover:text-primary-blue hover:bg-sky-200/20',
        'filter-badge-active':
          'border-primary-blue text-primary-blue bg-sky-200/20',
        'sky-lighten': 'border-transparent text-primary-blue bg-sky-200/20',
        beginner: 'border-transparent bg-green-500 text-white',
        intermediate: 'border-transparent bg-sky-600 text-white',
        advanced: 'border-transparent bg-red-500 text-white',
        emerald: 'bg-[#D2FBF0] text-emerald-600',
        approved: 'bg-[#D2FBF0] text-emerald-600',
        rejected: 'bg-[#FCD4D4] text-red-600',
        pending: 'bg-slate-200 text-primary',
        student: 'bg-primary-blue text-white',
        admin: 'bg-[#27ae60] text-white',
        instructor: 'bg-[#f39c12] text-white',
        parent: 'bg-[#e74c3c] text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
