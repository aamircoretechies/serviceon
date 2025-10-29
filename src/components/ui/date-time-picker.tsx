import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
  className
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value)
  const [selectedTime, setSelectedTime] = React.useState<string>(
    value ? format(value, "HH:mm") : ""
  )

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setSelectedTime(format(value, "HH:mm"))
    }
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number)
      const newDateTime = new Date(date)
      newDateTime.setHours(hours, minutes)
      onChange?.(newDateTime)
    } else {
      onChange?.(date)
    }
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    if (selectedDate && time) {
      const [hours, minutes] = time.split(":").map(Number)
      const newDateTime = new Date(selectedDate)
      newDateTime.setHours(hours, minutes)
      onChange?.(newDateTime)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {selectedDate && (
        <div className="flex items-center space-x-2">
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      )}
    </div>
  )
}

