
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const VisitorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, 'visitor');
      if (success) {
        toast({
        title: "Witaj!",
    description: "Zalogowano pomyślnie jako gość.",
        });
        navigate('/visitor/dashboard');
      } else {
        toast({
          title: "Brak dostępu",
    description: "Nieprawidłowy e-mail lub hasło.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
       title: "Błąd",
    description: "Wystąpił błąd podczas logowania.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/29c7e0c1-ad55-4119-b61c-a1f1420b7d5a.png"
          alt="Luxury Villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-6 min-h-screen">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link 
            to="/" 
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {/* Back to Home */}Powrót do strony głównej
          </Link>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur-sm luxury-shadow rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="font-luxury text-3xl font-semibold text-luxury-darkGrey mb-2">
                {/* Visitor Access */} Dostęp dla gości
              </h1>
              <p className="text-luxury-grey">
                {/* View the exclusive villa archive */} Zobacz ekskluzywne archiwum willi
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-luxury-darkGrey mb-2">
                  {/* Email Address */} Adres poczty elektronicznej
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="luxury-input"
                  placeholder="azerty@villa.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-luxury-darkGrey mb-2">
                  {/* Password */} Hasło
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="luxury-input"
                  // placeholder="Enter your password"
                  placeholder="Wprowadź swoje hasło"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full luxury-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* {isLoading ? 'Accessing...' : 'Enter'} */}
                {isLoading ? 'Uzyskiwanie dostępu...' : 'Wpisz'}
              </button>
            </form>

            {/* <div className="mt-6 text-center text-sm text-luxury-grey">
              Demo credentials: visitor@villa.com / visitor123
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorLogin;
