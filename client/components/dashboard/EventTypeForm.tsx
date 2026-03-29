import { useState, useEffect } from "react";
import { useScheduler, EventType } from "../../contexts/SchedulerContext";
import { X } from "lucide-react";

interface EventTypeFormProps {
  eventTypeId?: string;
  onClose: () => void;
}

export default function EventTypeForm({ eventTypeId, onClose }: EventTypeFormProps) {
  const { eventTypes, addEventType, updateEventType } = useScheduler();
  const eventType = eventTypeId
    ? eventTypes.find((et) => et.id === eventTypeId)
    : null;

  const [formData, setFormData] = useState({
    name: eventType?.name || "",
    duration: eventType?.duration || 30,
    slug: eventType?.slug || "",
    description: eventType?.description || "",
    meetingType: eventType?.meetingType || ("call" as const),
    meetingUrl: eventType?.meetingUrl || "",
    format: eventType?.format || ("one-on-one" as const),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Auto-generate slug from name if not editing
    if (!eventTypeId && formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, eventTypeId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Event type name is required";
    }

    if (formData.duration < 15) {
      newErrors.duration = "Duration must be at least 15 minutes";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "URL slug is required";
    }

    // Meeting URL is no longer compulsory to fill

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (eventTypeId) {
      updateEventType(eventTypeId, formData);
    } else {
      addEventType(formData);
    }

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) : value,
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-border p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {eventTypeId ? "Edit Event Type" : "Create Event Type"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Event Type Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., 30-min Meeting, Consultation"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Duration (minutes) *
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="15"
            step="5"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.duration && (
            <p className="text-destructive text-sm mt-1">{errors.duration}</p>
          )}
        </div>

        {/* URL Slug */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            URL Slug *
          </label>
          <div className="flex items-center">
            <span className="text-muted-foreground">
              {window.location.origin}/book/
            </span>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="meeting-slug"
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {errors.slug && (
            <p className="text-destructive text-sm mt-1">{errors.slug}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            This will be the unique URL for booking this event type
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what this meeting is about..."
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Event Format */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Meeting Format
          </label>
          <select
            name="format"
            value={formData.format}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-6"
          >
            <option value="one-on-one">One-on-One</option>
            <option value="round-robin">Round Robin</option>
            <option value="one-to-many">One-to-Many</option>
          </select>
        </div>

        {/* Meeting Type */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Meeting Type *
          </label>
          <select
            name="meetingType"
            value={formData.meetingType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="call">Phone Call</option>
            <option value="teams">Microsoft Teams</option>
            <option value="zoom">Zoom</option>
            <option value="in-person">In-Person</option>
          </select>
        </div>

        {/* Meeting URL */}
        {formData.meetingType !== "in-person" && (
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Meeting URL/Room Link (Optional)
            </label>
            <input
              type="text"
              name="meetingUrl"
              value={formData.meetingUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.meetingUrl && (
              <p className="text-destructive text-sm mt-1">{errors.meetingUrl}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Share your Zoom, Teams, or call link
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow font-semibold"
          >
            {eventTypeId ? "Update Event Type" : "Create Event Type"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
