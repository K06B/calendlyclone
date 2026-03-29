import { EventType, Availability, useScheduler } from "../../contexts/SchedulerContext";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  eventType: EventType;
  date: Date;
  availability: Availability;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlotSelector({
  eventType,
  date,
  availability,
  onTimeSelect,
}: TimeSelectorProps) {
  const { bookings } = useScheduler();

  const generateTimeSlots = () => {
    const dayOfWeek = date.getDay();
    const timeSlot = availability.timeSlots.find((slot) => slot.day === dayOfWeek);

    if (!timeSlot) return [];

    // Find confirmed bookings for this specific date
    const dateBookings = bookings.filter((b) => {
      const scheduledDate = new Date(b.scheduledFor);
      return (
        b.status !== "cancelled" &&
        scheduledDate.getFullYear() === date.getFullYear() &&
        scheduledDate.getMonth() === date.getMonth() &&
        scheduledDate.getDate() === date.getDate()
      );
    });

    const slots: string[] = [];
    const [startHour, startMin] = timeSlot.startTime.split(":").map(Number);
    const [endHour, endMin] = timeSlot.endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    const endTotalMins = endHour * 60 + endMin;

    while (currentHour * 60 + currentMin + eventType.duration <= endTotalMins) {
      const slotStartMins = currentHour * 60 + currentMin;
      const slotEndMins = slotStartMins + eventType.duration;

      // Check for overlap
      const isOverlapping = dateBookings.some((b) => {
        const scheduledDate = new Date(b.scheduledFor);
        const bStartHour = scheduledDate.getHours();
        const bStartMin = scheduledDate.getMinutes();
        const bStartMins = bStartHour * 60 + bStartMin;
        const bEndMins = bStartMins + b.duration;
        
        return slotStartMins < bEndMins && slotEndMins > bStartMins;
      });

      if (!isOverlapping) {
        const timeStr = `${String(currentHour).padStart(2, "0")}:${String(
          currentMin
        ).padStart(2, "0")}`;
        slots.push(timeStr);
      }

      // Add 30 min increments between available slots
      currentMin += 30;
      if (currentMin >= 60) {
        currentHour += 1;
        currentMin -= 60;
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formatTime = (time: string) => {
    const [hour, min] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${String(min).padStart(2, "0")} ${period}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Select a Time
      </h2>

      <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-muted-foreground">
          <Clock className="w-4 h-4 inline mr-2" />
          <span className="font-semibold text-foreground">{dateStr}</span>
        </p>
      </div>

      {timeSlots.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                className="px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors font-semibold"
              >
                {formatTime(time)}
              </button>
            ))}
          </div>

          <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
            <p className="text-sm text-muted-foreground">
              Meeting duration: <span className="font-semibold">{eventType.duration} minutes</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No time slots available for this date
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please select a different date
          </p>
        </div>
      )}
    </div>
  );
}
