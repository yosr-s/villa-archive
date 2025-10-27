
// import type { Config } from "tailwindcss";

// export default {
// 	darkMode: ["class"],
// 	content: [
// 		"./pages/**/*.{ts,tsx}",
// 		"./components/**/*.{ts,tsx}",
// 		"./app/**/*.{ts,tsx}",
// 		"./src/**/*.{ts,tsx}",
// 	],
// 	prefix: "",
// 	theme: {
// 		container: {
// 			center: true,
// 			padding: '2rem',
// 			screens: {
// 				'2xl': '1400px'
// 			}
// 		},
// 		extend: {
// 			colors: {
// 				border: 'hsl(var(--border))',
// 				input: 'hsl(var(--input))',
// 				ring: 'hsl(var(--ring))',
// 				background: 'hsl(var(--background))',
// 				foreground: 'hsl(var(--foreground))',
// 				primary: {
// 					DEFAULT: 'hsl(var(--primary))',
// 					foreground: 'hsl(var(--primary-foreground))'
// 				},
// 				secondary: {
// 					DEFAULT: 'hsl(var(--secondary))',
// 					foreground: 'hsl(var(--secondary-foreground))'
// 				},
// 				destructive: {
// 					DEFAULT: 'hsl(var(--destructive))',
// 					foreground: 'hsl(var(--destructive-foreground))'
// 				},
// 				muted: {
// 					DEFAULT: 'hsl(var(--muted))',
// 					foreground: 'hsl(var(--muted-foreground))'
// 				},
// 				accent: {
// 					DEFAULT: 'hsl(var(--accent))',
// 					foreground: 'hsl(var(--accent-foreground))'
// 				},
// 				popover: {
// 					DEFAULT: 'hsl(var(--popover))',
// 					foreground: 'hsl(var(--popover-foreground))'
// 				},
// 				card: {
// 					DEFAULT: 'hsl(var(--card))',
// 					foreground: 'hsl(var(--card-foreground))'
// 				},
// 				sidebar: {
// 					DEFAULT: 'hsl(var(--sidebar-background))',
// 					foreground: 'hsl(var(--sidebar-foreground))',
// 					primary: 'hsl(var(--sidebar-primary))',
// 					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
// 					accent: 'hsl(var(--sidebar-accent))',
// 					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
// 					border: 'hsl(var(--sidebar-border))',
// 					ring: 'hsl(var(--sidebar-ring))'
// 				},
// 				luxury: {
// 					silver: '#C0C0C0',
// 					grey: '#8B8B8B',
// 					lightGrey: '#F5F5F5',
// 					darkGrey: '#2D2D2D'
// 				}
// 			},
// 			fontFamily: {
// 				'luxury': ['Playfair Display', 'serif'],
// 				'sans': ['Inter', 'sans-serif'],
// 			},
// 			borderRadius: {
// 				lg: 'var(--radius)',
// 				md: 'calc(var(--radius) - 2px)',
// 				sm: 'calc(var(--radius) - 4px)'
// 			},
// 			keyframes: {
// 				'accordion-down': {
// 					from: {
// 						height: '0'
// 					},
// 					to: {
// 						height: 'var(--radix-accordion-content-height)'
// 					}
// 				},
// 				'accordion-up': {
// 					from: {
// 						height: 'var(--radix-accordion-content-height)'
// 					},
// 					to: {
// 						height: '0'
// 					}
// 				},
// 				'fade-in-up': {
// 					'0%': {
// 						opacity: '0',
// 						transform: 'translateY(20px)'
// 					},
// 					'100%': {
// 						opacity: '1',
// 						transform: 'translateY(0)'
// 					}
// 				},
// 				'timeline-reveal': {
// 					'0%': {
// 						opacity: '0',
// 						transform: 'scale(0.9) translateY(20px)'
// 					},
// 					'100%': {
// 						opacity: '1',
// 						transform: 'scale(1) translateY(0)'
// 					}
// 				}
// 			},
// 			animation: {
// 				'accordion-down': 'accordion-down 0.2s ease-out',
// 				'accordion-up': 'accordion-up 0.2s ease-out',
// 				'fade-in-up': 'fade-in-up 0.6s ease-out',
// 				'timeline-reveal': 'timeline-reveal 0.8s ease-out'
// 			}
// 		}
// 	},
// 	plugins: [require("tailwindcss-animate")],
// } satisfies Config;
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /** 🎨 Couleurs globales */
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        /** 🌑 Palette "Luxury Dark" */
        luxury: {
          black: "#0d0d0d",
          dark: "#1a1a1a",
          darker: "#141414",
          grey: "#8b8b8b",
          darkGrey: "#2d2d2d",
          silver: "#C0C0C0",
          accent: "#FF9F43", // pour les rares surbrillances chaudes
        },
      },

      /** 🪶 Polices */
      fontFamily: {
        luxury: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },

      /** 🔲 Rayons de bordure */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /** 🎞️ Animations personnalisées */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "timeline-reveal": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9) translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },

        /** ✨ Glow froid gris métallique */
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(200, 200, 200, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(220, 220, 220, 0.6)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "timeline-reveal": "timeline-reveal 0.8s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
