import { Calendar } from "@/components/ui/calendar";
import { EventType, Availability } from "../../contexts/SchedulerContext";

interface BookingCalendarProps {
  eventType: EventType;
  availability: Availability;
  onDateSelect: (date: Date) => void;
}

export default function BookingCalendar({
  eventType,
  availability,
  onDateSelect,
}: BookingCalendarProps) {

  const isDateDisabled = (date: Date) => {
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Check if day of week has availability
    const dayOfWeek = date.getDay();
    const hasTimeSlot = availability.timeSlots.some((slot) => slot.day === dayOfWeek);

    return !hasTimeSlot;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Select a Date
      </h2>

      <div className="flex justify-center border border-border rounded-lg p-4 bg-white shadow-sm">
        <Calendar
          mode="single"
          selected={undefined}
          onSelect={(date) => {
            if (date) {
              onDateSelect(date);
            }
          }}
          disabled={isDateDisabled}
          className="rounded-md mx-auto"
        />
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-primary rounded mr-2"></span>
          Available dates | 
          <span className="inline-block w-3 h-3 bg-muted rounded mr-2 ml-2"></span>
          Unavailable dates
        </p>
      </div>
    </div>
  );
}
