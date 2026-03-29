import React, { createContext, useContext, useState, useEffect } from "react";

export interface EventType {
  id: string;
  name: string;
  duration: number; // in minutes
  slug: string;
  description?: string;
  meetingType: "teams" | "zoom" | "call" | "in-person";
  meetingUrl?: string;
  format?: "one-on-one" | "round-robin" | "one-to-many";
}

export interface TimeSlot {
  day: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface Availability {
  timeSlots: TimeSlot[];
  timezone: string;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  eventTypeName: string;
  bookerName: string;
  bookerEmail: string;
  bookedAt: Date;
  scheduledFor: Date;
  duration: number;
  meetingType: string;
  meetingUrl?: string;
  status: "confirmed" | "cancelled";
}

interface SchedulerContextType {
  eventTypes: EventType[];
  availability: Availability;
  bookings: Booking[];
  timezone: string;
  
  // Event Type methods
  addEventType: (eventType: Omit<EventType, "id">) => void;
  updateEventType: (id: string, eventType: Partial<EventType>) => void;
  deleteEventType: (id: string) => void;
  
  // Availability methods
  setAvailability: (availability: Availability) => void;
  
  // Booking methods
  addBooking: (booking: Omit<Booking, "id">) => void;
  cancelBooking: (id: string) => void;
  
  // Timezone methods
  setTimezone: (timezone: string) => void;
}

const SchedulerContext = createContext<SchedulerContextType | undefined>(undefined);

export function SchedulerProvider({ children }: { children: React.ReactNode }) {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [timezone, setTimezoneName] = useState("UTC");
  const [availability, setAvailabilityState] = useState<Availability>({
    timeSlots: [
      { day: 1, startTime: "09:00", endTime: "17:00" },
      { day: 2, startTime: "09:00", endTime: "17:00" },
      { day: 3, startTime: "09:00", endTime: "17:00" },
      { day: 4, startTime: "09:00", endTime: "17:00" },
      { day: 5, startTime: "09:00", endTime: "17:00" },
    ],
    timezone: "UTC",
  });

  // Load from localStorage and API on mount
  useEffect(() => {
    const savedEventTypes = localStorage.getItem("eventTypes");
    const savedTimezone = localStorage.getItem("timezone");
    const savedAvailability = localStorage.getItem("availability");

    if (savedEventTypes) setEventTypes(JSON.parse(savedEventTypes));
    if (savedTimezone) setTimezoneName(savedTimezone);
    if (savedAvailability) setAvailabilityState(JSON.parse(savedAvailability));

    const fetchBookings = async () => {
      try {
        const resp = await fetch("/api/bookings");
        if (resp.ok) {
          const data = await resp.json();
          setBookings(
            data.map((b: any) => ({
              ...b,
              bookedAt: new Date(b.bookedAt),
              scheduledFor: new Date(b.scheduledFor),
            }))
          );
        }
      } catch (e) {
        console.error("Failed to fetch bookings", e);
      }
    };
    fetchBookings();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("eventTypes", JSON.stringify(eventTypes));
  }, [eventTypes]);

  useEffect(() => {
    localStorage.setItem("timezone", timezone);
  }, [timezone]);

  useEffect(() => {
    localStorage.setItem("availability", JSON.stringify(availability));
  }, [availability]);

  const addEventType = (eventType: Omit<EventType, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setEventTypes([...eventTypes, { ...eventType, id }]);
  };

  const updateEventType = (id: string, updates: Partial<EventType>) => {
    setEventTypes(
      eventTypes.map((et) => (et.id === id ? { ...et, ...updates } : et))
    );
  };

  const deleteEventType = (id: string) => {
    setEventTypes(eventTypes.filter((et) => et.id !== id));
  };

  const setAvailability = (availability: Availability) => {
    setAvailabilityState(availability);
  };

  const addBooking = async (booking: Omit<Booking, "id">) => {
    try {
      const resp = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (resp.ok) {
        const data = await resp.json();
        setBookings(prev => [...prev, {
          ...data.booking,
          bookedAt: new Date(data.booking.bookedAt),
          scheduledFor: new Date(data.booking.scheduledFor)
        }]);
      }
    } catch (e) {
      console.error("Failed to add booking", e);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const resp = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
        );
      }
    } catch (e) {
      console.error("Failed to cancel booking", e);
    }
  };

  const setTimezone = (tz: string) => {
    setTimezoneName(tz);
    setAvailabilityState({ ...availability, timezone: tz });
  };

  return (
    <SchedulerContext.Provider
      value={{
        eventTypes,
        availability,
        bookings,
        timezone,
        addEventType,
        updateEventType,
        deleteEventType,
        setAvailability,
        addBooking,
        cancelBooking,
        setTimezone,
      }}
    >
      {children}
    </SchedulerContext.Provider>
  );
}

export function useScheduler() {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error("useScheduler must be used within a SchedulerProvider");
  }
  return context;
}
