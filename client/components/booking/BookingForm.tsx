import { useState } from "react";
import { EventType } from "../../contexts/SchedulerContext";

interface BookingFormProps {
  eventType: EventType;
  date: Date;
  time: string;
  onSubmit: (name: string, email: string) => void;
}

export default function BookingForm({
  eventType,
  date,
  time,
  onSubmit,
}: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(name, email);
    }
  };

  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formatTime = (timeStr: string) => {
    const [hour, min] = timeStr.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${String(min).padStart(2, "0")} ${period}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Your Information
      </h2>

      {/* Summary */}
      <div className="mb-8 p-4 bg-muted/50 rounded-lg space-y-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{eventType.name}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          📅 {dateStr} at {formatTime(time)}
        </p>
        <p className="text-sm text-muted-foreground">
          ⏱️ {eventType.duration} minutes
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Your Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow font-semibold"
        >
          Schedule Meeting
        </button>
      </form>
    </div>
  );
}
