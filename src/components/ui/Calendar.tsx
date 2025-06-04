import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Composant Calendar standardisé
 * Basé sur react-day-picker avec un style Tailwind
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={fr}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-75 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-dark-800/50 dark:[&:has([aria-selected])]:bg-dark-800",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary-600 text-white hover:bg-primary-600 hover:text-white focus:bg-primary-600 focus:text-white dark:bg-primary-600 dark:text-gray-50 dark:hover:bg-primary-600 dark:hover:text-gray-50 dark:focus:bg-primary-600 dark:focus:text-gray-50",
        day_today: "bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-gray-50",
        day_outside:
          "day-outside text-gray-400 opacity-50 dark:text-gray-500",
        day_disabled: "text-gray-300 dark:text-gray-600",
        day_range_middle:
          "aria-selected:bg-gray-100 aria-selected:text-gray-700 dark:aria-selected:bg-dark-800 dark:aria-selected:text-gray-300",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
} 