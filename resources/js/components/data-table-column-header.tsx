import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
    align?: 'left' | 'center' | 'right';
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className, align = 'left' }: DataTableColumnHeaderProps<TData, TValue>) {
    const alignmentClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';
    if (!column.getCanSort()) {
        <div className={cn('flex', alignmentClass, className)}>{title}</div>;
    }

    return (
        <div className={cn('flex items-center space-x-2', alignmentClass, className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="data-[state=open]:bg-accent -ml-3 h-8">
                        <span>{title}</span>
                        {column.getIsSorted() === 'desc' ? <ArrowDown /> : column.getIsSorted() === 'asc' ? <ArrowUp /> : <ChevronsUpDown />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <ArrowUp className="text-muted-foreground/70 h-3.5 w-3.5" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <ArrowDown className="text-muted-foreground/70 h-3.5 w-3.5" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeOff className="text-muted-foreground/70 h-3.5 w-3.5" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
