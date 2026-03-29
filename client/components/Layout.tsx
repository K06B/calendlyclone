import { Link } from "react-router-dom";
import { Calendar, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:shadow-lg transition-shadow">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:inline">
                Scheduler
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/dashboard"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/meetings"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Meetings
              </Link>
              {user && !user.isDefaultAdmin ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    {user.name}
                  </span>
                  <button
                    onClick={signOut}
                    className="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {user?.isDefaultAdmin && (
                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">Admin View</span>
                  )}
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-border pt-4 space-y-3">
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/meetings"
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Meetings
              </Link>
              {user && !user.isDefaultAdmin ? (
                <div className="px-4 py-2 space-y-3">
                  <div className="font-medium text-foreground">{user.name}</div>
                  <button
                    onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                    }}
                    className="block w-full py-2 border border-border text-foreground hover:bg-muted rounded-lg text-center font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2 space-y-3">
                  {user?.isDefaultAdmin && (
                    <div className="text-xs text-muted-foreground mb-2 text-center">Admin View Active</div>
                  )}
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2 bg-primary text-primary-foreground rounded-lg text-center font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 Scheduler. All rights reserved.</p>
            <p>Made with care</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
