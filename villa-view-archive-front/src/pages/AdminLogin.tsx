import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, "admin");
if (success) {
  toast({
    title: "✅ Witamy ponownie!",
    description: "Zalogowano pomyślnie jako administrator.",
  });
  navigate("/admin/dashboard");
} else {
  toast({
    title: "❌ Logowanie nieudane",
    description: "Nieprawidłowy adres e-mail lub hasło.",
    variant: "destructive",
  });
}
} catch (error) {
  toast({
    title: "Błąd",
    description: "Wystąpił problem podczas logowania.",
    variant: "destructive",
  });
} finally {
  setIsLoading(false);
}
  };

  return (
    <div className="min-h-screen relative">
      {/* 🏞️ Image de fond */}
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/29c7e0c1-ad55-4119-b61c-a1f1420b7d5a.png"
          alt="Luxury Villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* 📦 Contenu */}
      <div className="relative z-10 flex items-center justify-center px-6 min-h-screen">
        <div className="w-full max-w-md">
          {/* 🔙 Bouton retour */}
          <Link
            to="/"
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do strony głównej
          </Link>

          {/* 🔐 Formulaire de connexion */}
          <div className="bg-white/95 backdrop-blur-sm luxury-shadow rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="font-luxury text-3xl font-semibold text-luxury-darkGrey mb-2">
                Portal administratora
              </h1>
              <p className="text-luxury-grey">
                Uzyskaj dostęp do panelu administracyjnego
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-luxury-darkGrey mb-2"
                >
                  Adres poczty elektronicznej
                </label>
                  <input
                  id="email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="luxury-input"
                  placeholder="admin@test.com"
                  autoComplete="username"          // <—
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  name="admin_login_email"         // <— évite 'email'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-luxury-darkGrey mb-2"
                >
                  Hasło
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="luxury-input"
                  placeholder="Wprowadź swoje hasło"
                  autoComplete="off"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full luxury-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logowanie..." : "Zaloguj się"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
