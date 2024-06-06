import { ComponentProps } from 'react';

export type ChipParams = ComponentProps<'div'>;

function Chip({ className, children, ...rest }: ChipParams) {
  const newClassName = getCombinedClassNames(className);

  return (
    <div className={newClassName} {...rest}>
      {children}
    </div>
  );
}

export type ChipButtonParams = ComponentProps<'button'>;

function ChipButton({ className, children, ...rest }: ChipButtonParams) {
  const newClassName = getCombinedClassNames(className);

  return (
    <button className={newClassName} {...rest}>
      {children}
    </button>
  );
}

function getCombinedClassNames(className?: string) {
  const classSet = new Set<string>();
  className?.split(' ').forEach((s) => classSet.add(s));

  // Add my styling
  classSet.add('bg-teal-500');
  classSet.add('text-white');
  classSet.add('p-1');
  classSet.add('rounded');

  return Array.from(classSet.values()).join(' ');
}

export { Chip, ChipButton };
