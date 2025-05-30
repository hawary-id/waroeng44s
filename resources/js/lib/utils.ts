import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatedDate(date: string | Date, formatStr: string = "dd-MMM-yyyy"): string {
    if (typeof date === "string") {
        date = new Date(date);
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return "Invalid Date";
    }

    return format(date, formatStr, { locale: id });
}
