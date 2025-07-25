import * as React from 'react';
import { cn } from '@/lib/utils'; 

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
({ className, ...props }, ref) => (
    <div
    ref={ref}
    className={cn('animate-pulse rounded-md bg-gray-800', className)}
    {...props}
    />
)
);

Skeleton.displayName = 'Skeleton';
