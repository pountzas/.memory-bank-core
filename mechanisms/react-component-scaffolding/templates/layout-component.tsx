import React from 'react';
import { cn } from '@/lib/utils';
import styles from './{{componentName}}.module.css';

export interface {{componentName}}Props extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  children: React.ReactNode;
}

export const {{componentName}} = React.forwardRef<HTMLDivElement, {{componentName}}Props>(
  ({
    direction = 'row',
    align = 'stretch',
    justify = 'start',
    gap = 'md',
    wrap = false,
    className,
    children,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.{{componentName | camelCase}},
          styles[`{{componentName | camelCase}}--${direction}`],
          styles[`{{componentName | camelCase}}--align-${align}`],
          styles[`{{componentName | camelCase}}--justify-${justify}`],
          styles[`{{componentName | camelCase}}--gap-${gap}`],
          {
            [styles['{{componentName | camelCase}}--wrap']]: wrap,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

{{componentName}}.displayName = '{{componentName}}';
