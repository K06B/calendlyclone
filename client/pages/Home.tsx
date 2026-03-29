import { Link } from "react-router-dom";
import { Calendar, Clock, Users, CheckCircle, ArrowRight, Zap } from "lucide-react";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Scheduling Made
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Simple & Powerful
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create custom event types, manage your availability, and let clients book time with you automatically. No back-and-forth emails needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow font-semibold flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-12 md:mt-16 bg-gradient-to-b from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Smart Calendar</h3>
                <p className="text-sm text-muted-foreground">Real-time availability with timezone support</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Time Slots</h3>
                <p className="text-sm text-muted-foreground">Custom durations and breaks between meetings</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Easy Booking</h3>
                <p className="text-sm text-muted-foreground">Shareable links and instant confirmations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to save you time and streamline your scheduling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Event Types</h3>
              <p className="text-muted-foreground mb-4">
                Create unlimited event types with custom names, durations, and booking links. Perfect for different meeting types.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                Custom durations
              </div>
              <div className="flex items-center gap-2 text-primary font-medium mt-2">
                <CheckCircle className="w-4 h-4" />
                Unique booking URLs
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-secondary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Availability</h3>
              <p className="text-muted-foreground mb-4">
                Set your working hours, choose available days, and manage your timezone. Update anytime as your schedule changes.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                Timezone aware
              </div>
              <div className="flex items-center gap-2 text-primary font-medium mt-2">
                <CheckCircle className="w-4 h-4" />
                Flexible hours
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Smart Booking</h3>
              <p className="text-muted-foreground mb-4">
                Prevent double bookings with real-time slot availability. Instant confirmation emails for both you and your clients.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                No double bookings
              </div>
              <div className="flex items-center gap-2 text-primary font-medium mt-2">
                <CheckCircle className="w-4 h-4" />
                Instant confirmations
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-secondary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Meeting Management</h3>
              <p className="text-muted-foreground mb-4">
                Track all your meetings in one place. See upcoming appointments, review past meetings, and cancel when needed.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                Upcoming meetings
              </div>
              <div className="flex items-center gap-2 text-primary font-medium mt-2">
                <CheckCircle className="w-4 h-4" />
                Meeting history
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to simplify your scheduling?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Get started in minutes. No credit card required. Start managing your calendar smarter today.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-3 bg-primary-foreground text-primary rounded-lg hover:shadow-xl transition-shadow font-semibold"
          >
            Create Your First Event Type
          </Link>
        </div>
      </section>
    </Layout>
  );
}
