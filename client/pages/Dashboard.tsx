import { useState } from "react";
import Layout from "../components/Layout";
import EventTypesSection from "../components/dashboard/EventTypesSection";
import AvailabilitySection from "../components/dashboard/AvailabilitySection";
import { Settings, Clock } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"events" | "availability">("events");

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your event types and availability settings
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 pb-4 px-2 font-semibold transition-colors ${
                activeTab === "events"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="w-4 h-4" />
              Event Types
            </button>
            <button
              onClick={() => setActiveTab("availability")}
              className={`flex items-center gap-2 pb-4 px-2 font-semibold transition-colors ${
                activeTab === "availability"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="w-4 h-4" />
              Availability
            </button>
          </div>

          {/* Content */}
          <div>
            {activeTab === "events" && <EventTypesSection />}
            {activeTab === "availability" && <AvailabilitySection />}
          </div>
        </div>
      </div>
    </Layout>
  );
}
