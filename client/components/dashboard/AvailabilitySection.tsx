import { useState } from "react";
import { useScheduler } from "../../contexts/SchedulerContext";
import { Plus, Trash2 } from "lucide-react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TIMEZONES = [
  "UTC",
  "EST",
  "CST",
  "MST",
  "PST",
  "GMT",
  "CET",
  "IST",
  "JST",
  "AEST",
];

export default function AvailabilitySection() {
  const { availability, timezone, setAvailability, setTimezone } =
    useScheduler();

  const [timeSlots, setTimeSlots] = useState(availability.timeSlots);
  const [selectedTimezone, setSelectedTimezone] = useState(timezone);

  const handleAddTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      {
        day: 1,
        startTime: "09:00",
        endTime: "17:00",
      },
    ]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleTimeSlotChange = (
    index: number,
    field: "day" | "startTime" | "endTime",
    value: string | number
  ) => {
    const updated = [...timeSlots];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setTimeSlots(updated);
  };

  const handleSave = () => {
    setAvailability({
      timeSlots,
      timezone: selectedTimezone,
    });
    setTimezone(selectedTimezone);
    alert("Availability updated successfully!");
  };

  const getAvailableDays = () => {
    const usedDays = new Set(timeSlots.map((slot) => slot.day));
    return DAYS.map((day, index) => ({
      label: day,
      value: index,
      isUsed: usedDays.has(index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Timezone Selection */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Timezone</h3>
        <select
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground mt-2">
          All times will be displayed in this timezone
        </p>
      </div>

      {/* Time Slots */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Working Hours
          </h3>
          <button
            onClick={handleAddTimeSlot}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Time Slot
          </button>
        </div>

        {timeSlots.length > 0 ? (
          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <select
                  value={slot.day}
                  onChange={(e) =>
                    handleTimeSlotChange(index, "day", parseInt(e.target.value))
                  }
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DAYS.map((day, dayIndex) => (
                    <option key={dayIndex} value={dayIndex}>
                      {day}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      handleTimeSlotChange(index, "startTime", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleTimeSlotChange(index, "endTime", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  onClick={() => handleRemoveTimeSlot(index)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/5 transition-colors font-medium text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No time slots configured</p>
            <p className="text-sm mt-1">
              Add a time slot to enable bookings
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-secondary/5 rounded-lg border border-secondary/20 p-6">
        <h3 className="font-semibold text-foreground mb-3">Your Availability</h3>
        <div className="space-y-2 text-sm">
          {getAvailableDays().map((day) => {
            const slots = timeSlots.filter((s) => s.day === day.value);
            if (slots.length === 0) return null;

            return (
              <div key={day.value} className="text-muted-foreground">
                <span className="font-medium text-foreground">{day.label}:</span>{" "}
                {slots.map((s) => `${s.startTime} - ${s.endTime}`).join(", ")}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow font-semibold"
      >
        Save Availability
      </button>
    </div>
  );
}
