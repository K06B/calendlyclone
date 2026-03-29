import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useScheduler } from "../contexts/SchedulerContext";
import Layout from "../components/Layout";
import BookingCalendar from "../components/booking/BookingCalendar";
import TimeSlotSelector from "../components/booking/TimeSlotSelector";
import BookingForm from "../components/booking/BookingForm";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import { ChevronLeft } from "lucide-react";

type BookingStep = "calendar" | "time" | "form" | "confirmation";

interface BookingData {
  eventTypeId: string;
  eventTypeName: string;
  date: Date | null;
  time: string | null;
  name: string;
  email: string;
}

export default function PublicBooking() {
  const { eventTypeSlug } = useParams<{ eventTypeSlug: string }>();
  const navigate = useNavigate();
  const { eventTypes, availability } = useScheduler();

  const eventType = eventTypes.find((et) => et.slug === eventTypeSlug);

  const [step, setStep] = useState<BookingStep>("calendar");
  const [bookingData, setBookingData] = useState<BookingData>({
    eventTypeId: eventType?.id || "",
    eventTypeName: eventType?.name || "",
    date: null,
    time: null,
    name: "",
    email: "",
  });

  if (!eventType) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 to-background">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Event Type Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              This event type doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleDateSelect = (date: Date) => {
    setBookingData({ ...bookingData, date });
    setStep("time");
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
    setStep("form");
  };

  const handleFormSubmit = (name: string, email: string) => {
    setBookingData({ ...bookingData, name, email });
    setStep("confirmation");
  };

  const handleBack = () => {
    if (step === "time") {
      setStep("calendar");
    } else if (step === "form") {
      setStep("time");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {eventType.name}
            </h1>
            {eventType.description && (
              <p className="text-muted-foreground">{eventType.description}</p>
            )}
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <span>⏱️ {eventType.duration} minutes</span>
              <span className="capitalize">📞 {eventType.meetingType}</span>
            </div>
          </div>

          {/* Steps Progress */}
          <div className="flex gap-2 mb-8">
            <div
              className={`flex-1 h-1 rounded-full transition-colors ${
                ["calendar", "time", "form", "confirmation"].indexOf(step) >= 0
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
            <div
              className={`flex-1 h-1 rounded-full transition-colors ${
                ["time", "form", "confirmation"].indexOf(step) >= 0
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
            <div
              className={`flex-1 h-1 rounded-full transition-colors ${
                ["form", "confirmation"].indexOf(step) >= 0
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
            <div
              className={`flex-1 h-1 rounded-full transition-colors ${
                step === "confirmation" ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-border p-8">
            {step === "calendar" && (
              <BookingCalendar
                eventType={eventType}
                availability={availability}
                onDateSelect={handleDateSelect}
              />
            )}

            {step === "time" && (
              <>
                {handleBack && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <TimeSlotSelector
                  eventType={eventType}
                  date={bookingData.date!}
                  availability={availability}
                  onTimeSelect={handleTimeSelect}
                />
              </>
            )}

            {step === "form" && (
              <>
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <BookingForm
                  eventType={eventType}
                  date={bookingData.date!}
                  time={bookingData.time!}
                  onSubmit={handleFormSubmit}
                />
              </>
            )}

            {step === "confirmation" && (
              <BookingConfirmation
                eventType={eventType}
                bookingData={bookingData}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
