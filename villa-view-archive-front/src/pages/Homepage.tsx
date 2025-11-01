import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-lightGrey to-white">
      {/* Hero Section with Overlay */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/29c7e0c1-ad55-4119-b61c-a1f1420b7d5a.png"
            alt="Luxury Villa with Reflection Pool"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <div className="mb-16 animate-fade-in-up" style={{ marginTop: '70px' }}>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <h1
                style={{ fontFamily: "Archivo", fontSize: '2.6rem', color:'white' }}
              >
                {/* <span style={{color:'transparent'}}>l</span> From <span style={{color:'transparent'}}>H</span>the Garden<span style={{color:'transparent'}}>H</span> House */}
             {/* <span style={{color:'transparent'}}>ffhhh</span>    Z <span style={{color:'transparent'}}>hghhg</span> domek  <span style={{color:'transparent'}}>lllldh</span>ogrodowy */}

              </h1>
            </motion.h1>

            {/* Animated Logo */}
            <div style={{ textAlign: "center" , marginTop: '50px'}}>
              <motion.img 
                src="/lovable-uploads/best-of-2021-whitee.svg" 
                alt="logo" 
                style={{ display: "inline-block" ,  width: "100px"}} 
                animate={{ y: [0, -15, 0] }}       // monte et descend
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </div>

          </div>

          {/* Login Options Overlay */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' , marginTop: '-40px' }}>
            <h2 className="font-luxury text-3xl font-semibold mb-8 text-white drop-shadow-lg">
              {/* Access Private Archives */} Dostęp do prywatnych archiwów
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/admin/login"
                className="bg-white/90 hover:bg-white text-luxury-darkGrey font-medium px-8 py-4 rounded-md transition-all duration-300 luxury-shadow hover:shadow-lg backdrop-blur-sm min-w-48 text-center"
              >
                {/* Admin Login */} Logowanie administratora
              </Link>
              <Link 
                to="/visitor/login"
                className="bg-white/90 hover:bg-white text-luxury-darkGrey font-medium px-8 py-4 rounded-md transition-all duration-300 luxury-shadow hover:shadow-lg backdrop-blur-sm min-w-48 text-center"
              >
                {/* Visitor Access */} Dostęp dla gości
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Awards Section */}
      {/* <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in-up">
          <div className="luxury-card p-8 text-center">
            <Crown className="w-12 h-12 text-luxury-grey mx-auto mb-4" />
            <h3 className="font-luxury text-xl font-semibold mb-2"> Najlepsza architektura </h3>
            <p className="text-luxury-grey">Nagrodzony projekt architektoniczny, doceniony za innowacyjność i elegancję</p>
          </div>
          
          <div className="luxury-card p-8 text-center">
            <Star className="w-12 h-12 text-luxury-grey mx-auto mb-4" />
            <h3 className="font-luxury text-xl font-semibold mb-2">Luksusowa nieruchomość roku</h3>

            <p className="text-luxury-grey">Uhonorowana jako najbardziej prestiżowa nieruchomość mieszkalna w Polsce</p>
          </div>
          
          <div className="luxury-card p-8 text-center">
            <Award className="w-12 h-12 text-luxury-grey mx-auto mb-4" />
            <h3 className="font-luxury text-xl font-semibold mb-2">Doskonałość w designie</h3>
            <p className="text-luxury-grey">Świętujemy wyjątkowe rzemiosło i dbałość o detale</p>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-luxury-grey">
            {/* © 2025 Janusz Szychliński Luxury Villa Archive. All rights reserved. */}
            © 2025 Archiwum Domu. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
