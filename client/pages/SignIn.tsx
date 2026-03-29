import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, ArrowRight, UserPlus } from "lucide-react";

export default function SignIn() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const { signIn, registerAccount } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (email && password) {
      try {
        if (isRegistering) {
            await registerAccount(email, password);
        } else {
            await signIn(email, password);
        }
        navigate("/dashboard");
      } catch (err: any) {
         setErrorMsg(err.message || "An error occurred during authentication.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-border p-8">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            {isRegistering ? (
                 <UserPlus className="w-6 h-6 text-primary" />
            ) : (
                 <Lock className="w-6 h-6 text-primary" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground">
             {isRegistering ? "Create your Account" : "Sign In"}
          </h2>
          <p className="text-muted-foreground mt-2">
             {isRegistering ? "Securely register to the new database" : "Enter your details to access your account"}
          </p>
        </div>

        {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-200">
               {errorMsg}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          >
            {isRegistering ? "Register Account" : "Sign In"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
            {isRegistering ? "Already have a database account?" : "No database account?"}{" "}
            <button 
                onClick={() => setIsRegistering(!isRegistering)} 
                className="text-primary hover:underline font-medium focus:outline-none"
                type="button"
            >
                {isRegistering ? "Sign In instead" : "Create one"}
            </button>
        </div>
      </div>
    </div>
  );
}
