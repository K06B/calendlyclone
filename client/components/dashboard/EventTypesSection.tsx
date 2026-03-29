import { useState } from "react";
import { useScheduler } from "../../contexts/SchedulerContext";
import { Plus, Edit2, Trash2, Copy, ExternalLink } from "lucide-react";
import EventTypeForm from "./EventTypeForm";

export default function EventTypesSection() {
  const { eventTypes, deleteEventType } = useScheduler();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event type?")) {
      deleteEventType(id);
    }
  };

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(link);
    alert("Booking link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Add New Button */}
      {!showForm && !editingId && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow font-semibold"
        >
          <Plus className="w-5 h-5" />
          Create Event Type
        </button>
      )}

      {/* Form */}
      {(showForm || editingId) && (
        <EventTypeForm
          eventTypeId={editingId || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      )}

      {/* Event Types List */}
      {eventTypes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {eventTypes.map((eventType) => (
            <div
              key={eventType.id}
              className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {eventType.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                    <span>⏱️ {eventType.duration} minutes</span>
                    <span>🔗 /{eventType.slug}</span>
                    <span className="capitalize">📞 {eventType.meetingType}</span>
                    {eventType.format && (
                      <span className="capitalize">👥 {eventType.format.replace(/-/g, ' ')}</span>
                    )}
                  </div>
                  {eventType.description && (
                    <p className="text-sm text-muted-foreground">
                      {eventType.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleCopyLink(eventType.slug)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                  <button
                    onClick={() => setEditingId(eventType.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(eventType.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/5 transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm &&
        !editingId && (
          <div className="bg-white rounded-lg border border-dashed border-border p-12 text-center">
            <div className="bg-muted w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No event types yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first event type to get started with scheduling
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow font-semibold"
            >
              Create Event Type
            </button>
          </div>
        )
      )}
    </div>
  );
}
