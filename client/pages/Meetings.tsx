import { useState } from "react";
import Layout from "../components/Layout";
import { useScheduler } from "../contexts/SchedulerContext";
import { Calendar, Clock, Users, Trash2, Copy, ExternalLink } from "lucide-react";

export default function Meetings() {
  const { bookings, cancelBooking } = useScheduler();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const now = new Date();
  const upcomingMeetings = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.scheduledFor) > now
  );
  const pastMeetings = bookings.filter(
    (b) => new Date(b.scheduledFor) <= now || b.status === "cancelled"
  );

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this meeting?")) {
      cancelBooking(id);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const hour = d.getHours();
    const min = d.getMinutes();
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${String(min).padStart(2, "0")} ${period}`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Meetings
            </h1>
            <p className="text-muted-foreground">
              View and manage all your scheduled meetings
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setTab("upcoming")}
              className={`flex items-center gap-2 pb-4 px-2 font-semibold transition-colors ${
                tab === "upcoming"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Upcoming ({upcomingMeetings.length})
            </button>
            <button
              onClick={() => setTab("past")}
              className={`flex items-center gap-2 pb-4 px-2 font-semibold transition-colors ${
                tab === "past"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="w-4 h-4" />
              Past ({pastMeetings.length})
            </button>
          </div>

          {/* Content */}
          <div>
            {tab === "upcoming" && (
              <div>
                {upcomingMeetings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {upcomingMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-3">
                              {meeting.eventTypeName}
                            </h3>

                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(meeting.scheduledFor)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {formatTime(meeting.scheduledFor)} (
                                {meeting.duration} minutes)
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {meeting.bookerName} ({meeting.bookerEmail})
                              </div>
                              {meeting.meetingUrl && (
                                <div className="flex items-center gap-2">
                                  <ExternalLink className="w-4 h-4" />
                                  <span className="capitalize">
                                    {meeting.meetingType}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {meeting.meetingUrl && (
                              <button
                                onClick={() =>
                                  handleCopyLink(meeting.meetingUrl!)
                                }
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium text-sm"
                              >
                                <Copy className="w-4 h-4" />
                                Copy Link
                              </button>
                            )}
                            <button
                              onClick={() => handleCancel(meeting.id)}
                              className="flex items-center justify-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/5 transition-colors font-medium text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-dashed border-border p-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No upcoming meetings
                    </h3>
                    <p className="text-muted-foreground">
                      Share your booking link to schedule meetings
                    </p>
                  </div>
                )}
              </div>
            )}

            {tab === "past" && (
              <div>
                {pastMeetings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {pastMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="bg-white rounded-lg border border-border p-6 opacity-75 hover:opacity-100 transition-opacity"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                {meeting.eventTypeName}
                              </h3>
                              {meeting.status === "cancelled" && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                                  Cancelled
                                </span>
                              )}
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(meeting.scheduledFor)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {formatTime(meeting.scheduledFor)} (
                                {meeting.duration} minutes)
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {meeting.bookerName} ({meeting.bookerEmail})
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-dashed border-border p-12 text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No past meetings
                    </h3>
                    <p className="text-muted-foreground">
                      Your past meetings will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
