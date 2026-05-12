"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button, buttonVariants } from "./button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  numberOfMonths,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()
  const resolvedMonths = numberOfMonths ?? (props.mode === "range" ? 2 : 1)

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      numberOfMonths={resolvedMonths}
      className={cn(
        "group/calendar bg-[var(--color-bg-raised)] rounded-[var(--radius-card)] p-3 [--cell-size:--spacing(9)]",
        className
      )}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root:              cn("w-fit", defaultClassNames.root),
        months:            cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month:             cn("flex w-full flex-col gap-4", defaultClassNames.month),

        // ── Nav ─────────────────────────────────────────────────────────────
        nav:               cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous:   cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-(--cell-size) select-none aria-disabled:opacity-40",
          defaultClassNames.button_previous
        ),
        button_next:       cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-(--cell-size) select-none aria-disabled:opacity-40",
          defaultClassNames.button_next
        ),

        // ── Caption ──────────────────────────────────────────────────────────
        month_caption:     cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        caption_label:     cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-body-sm"
            : "flex h-8 items-center gap-1 [border-radius:var(--radius-input)] pr-1 pl-2 text-body-sm hover:bg-[var(--color-action-ghost-hover)] transition-colors [&>svg]:size-3.5 [&>svg]:text-[var(--color-text-muted)]",
          defaultClassNames.caption_label
        ),

        // ── Dropdowns ────────────────────────────────────────────────────────
        dropdowns:         cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root:     cn(
          "relative [border-radius:var(--radius-button)] hover:bg-[var(--color-action-ghost-hover)] transition-colors",
          defaultClassNames.dropdown_root
        ),
        dropdown:          cn(
          "absolute inset-0 opacity-0 cursor-pointer",
          defaultClassNames.dropdown
        ),

        // ── Grid ─────────────────────────────────────────────────────────────
        month_grid:        "w-full border-collapse",
        weekdays:          cn("flex", defaultClassNames.weekdays),
        weekday:           cn(
          "flex-1 text-caption text-[var(--color-text-muted)] text-center select-none",
          defaultClassNames.weekday
        ),
        week:              cn("mt-2 flex w-full", defaultClassNames.week),

        // ── Day cells ────────────────────────────────────────────────────────
        day:               cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none",
          "[&:last-child[data-selected=true]_button]:rounded-r-[var(--radius-input)]",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-[var(--radius-input)]"
            : "[&:first-child[data-selected=true]_button]:rounded-l-[var(--radius-input)]",
          defaultClassNames.day
        ),
        range_start:       cn("rounded-l-[var(--radius-input)] bg-[var(--color-action-ghost-hover)]", defaultClassNames.range_start),
        range_middle:      cn("rounded-none", defaultClassNames.range_middle),
        range_end:         cn("rounded-r-[var(--radius-input)] bg-[var(--color-action-ghost-hover)]", defaultClassNames.range_end),
        today:             cn(
          "rounded-[var(--radius-input)] bg-[var(--color-action-ghost-hover)] text-[var(--color-text-default)] data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside:           cn("text-[var(--color-text-hint)] aria-selected:text-[var(--color-text-hint)]", defaultClassNames.outside),
        disabled:          cn("text-[var(--color-text-disabled)] opacity-50", defaultClassNames.disabled),
        hidden:            cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left")  return <ChevronLeftIcon  className={cn("size-4", className)} {...props} />
          if (orientation === "right") return <ChevronRightIcon className={cn("size-4", className)} {...props} />
          return <ChevronDownIcon className={cn("size-4", className)} {...props} />
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none",
        modifiers.selected || modifiers.today ? "text-body-sm" : "text-body-sm-light",
        modifiers.outside && "text-[var(--color-text-hint)] hover:text-[var(--color-text-hint)]",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
        "group-data-[focused=true]/day:border-[var(--color-border-focus)] group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-[var(--color-border-focus)]/50",
        "data-[selected-single=true]:bg-[var(--color-action-primary-default)] data-[selected-single=true]:text-[var(--color-action-primary-foreground)]",
        "data-[range-start=true]:rounded-l-[var(--radius-input)] data-[range-start=true]:bg-[var(--color-action-primary-default)] data-[range-start=true]:text-[var(--color-action-primary-foreground)]",
        "data-[range-end=true]:rounded-r-[var(--radius-input)] data-[range-end=true]:bg-[var(--color-action-primary-default)] data-[range-end=true]:text-[var(--color-action-primary-foreground)]",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-[var(--color-action-ghost-hover)] data-[range-middle=true]:text-[var(--color-text-default)]",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
