import { useEffect } from "react";
import { useScheduler, EventType } from "../../contexts/SchedulerContext";
import { CheckCircle, Copy, Calendar, Clock, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingConfirmationProps {
  eventType: EventType;
  bookingData: {
    eventTypeId: string;
    eventTypeName: string;
    date: Date | null;
    time: string | null;
    name: string;
    email: string;
  };
}

export default function BookingConfirmation({
  eventType,
  bookingData,
}: BookingConfirmationProps) {
  const { addBooking } = useScheduler();
  const navigate = useNavigate();

  useEffect(() => {
    // Add booking to the system
    if (bookingData.date && bookingData.time) {
      const [hour, min] = bookingData.time.split(":").map(Number);
      const scheduledFor = new Date(bookingData.date);
      scheduledFor.setHours(hour, min, 0, 0);

      addBooking({
        eventTypeId: bookingData.eventTypeId,
        eventTypeName: bookingData.eventTypeName,
        bookerName: bookingData.name,
        bookerEmail: bookingData.email,
        bookedAt: new Date(),
        scheduledFor,
        duration: eventType.duration,
        meetingType: eventType.meetingType,
        meetingUrl: eventType.meetingUrl,
        status: "confirmed",
      });
    }
  }, [bookingData, eventType, addBooking]);

  if (!bookingData.date || !bookingData.time) {
    return <div>Loading...</div>;
  }

  const dateStr = bookingData.date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formatTime = (timeStr: string) => {
    const [hour, min] = timeStr.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${String(min).padStart(2, "0")} ${period}`;
  };

  const handleCopyMeetingLink = () => {
    if (eventType.meetingUrl) {
      navigator.clipboard.writeText(eventType.meetingUrl);
      alert("Meeting link copied to clipboard!");
    }
  };

  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 rounded-full p-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      {/* Confirmation Title */}
      <h2 className="text-3xl font-bold text-foreground mb-2">
        Booking Confirmed!
      </h2>
      <p className="text-muted-foreground mb-8">
        A confirmation email has been sent to {bookingData.email}
      </p>

      {/* Booking Details */}
      <div className="bg-muted/50 rounded-lg border border-border p-8 text-left mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Meeting Details
        </h3>

        <div className="space-y-4">
          {/* Event Type */}
          <div className="flex items-start gap-4">
            <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Event Type</p>
              <p className="font-semibold text-foreground">
                {eventType.name}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-4">
            <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-semibold text-foreground">{dateStr}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-semibold text-foreground">
                {formatTime(bookingData.time)} ({eventType.duration} minutes)
              </p>
            </div>
          </div>

          {/* Meeting Type */}
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Meeting Type</p>
              <p className="font-semibold text-foreground capitalize">
                {eventType.meetingType}
              </p>
            </div>
          </div>

          {/* Meeting Link (if applicable) */}
          {eventType.meetingUrl && eventType.meetingType !== "in-person" && (
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 text-primary mt-1 flex-shrink-0">🔗</div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {eventType.meetingType === "zoom"
                    ? "Zoom Link"
                    : eventType.meetingType === "teams"
                    ? "Teams Link"
                    : "Meeting Link"}
                </p>
                <button
                  onClick={handleCopyMeetingLink}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold mt-1"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          )}

          {/* Attendee */}
          <div className="flex items-start gap-4">
            <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Attendee</p>
              <p className="font-semibold text-foreground">
                {bookingData.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {bookingData.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow font-semibold"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-semibold"
        >
          Copy Booking Link
        </button>
      </div>
    </div>
  );
}
