// components/sections/IngredientsBenefits/IngredientsBenefits.jsx
'use client';

import { useState } from 'react';
import { Sparkles, Leaf, Shield, CheckCircle2, Droplet, Sun } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';

export const IngredientsBenefits = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState(0);

  const ingredients = [
    {
      id: 1,
      name: 'Pure Honduran Batana Oil',
      tagline: 'The Miracle Hair & Scalp Nutrient',
      description: 'Extracted naturally from American Palm trees, Batana oil is supercharged with essential fatty acids (Omega-6 and Omega-9) and Vitamin E. It heals dry scalp itching, repairs follicle damage, and accelerates natural hair growth.',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
      benefits: [
        'Relieves persistent scalp itchiness & dryness',
        'Stimulates dormant hair follicles for growth',
        'Locks in long-lasting hair & body shine',
        'Cold-pressed unrefined 100% pure quality',
      ],
    },
    {
      id: 2,
      name: 'Kojic Acid & Papaya Enzyme',
      tagline: 'Natural Melanin Inhibitor & Exfoliant',
      description: 'Kojic Acid derived from mushroom fermentation naturally diminishes dark spots, hyperpigmentation, and sun damage. Combined with Papaya Papain enzymes, it gently dissolves dead surface skin cells.',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
      benefits: [
        'Noticeably fades stubborn dark spots & acne scars',
        'Gently exfoliates without micro-tears or irritation',
        'Evens out skin tone on face, knees, and underarms',
        'Restores crystal clarity and youthful skin glow',
      ],
    },
    {
      id: 3,
      name: 'Golden Turmeric Extract',
      tagline: 'Potent Anti-Inflammatory Soother',
      description: 'Rich in Curcumin antioxidants, golden turmeric protects against environmental stress, calms redness, and locks in 24-hour hydration when paired with nourishing plant ceramides.',
      image: 'https://images.unsplash.com/photo-1608248597263-0007999658b0?auto=format&fit=crop&q=80&w=800',
      benefits: [
        'Reduces facial redness and sensitivity',
        'Neutralizes free radicals and pollution damage',
        'Enhances skin elasticity and bouncy firmness',
        'Completely non-staining botanical extraction',
      ],
    },
  ];

  const current = ingredients[activeTab];

  return (
    <section id="ingredients" className={`py-16 lg:py-24 bg-gradient-to-b from-white via-rose-50/30 to-white relative ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="Pure Active Botanicals"
          title="Clean, Honest & Powerful Ingredients"
          subtitle="Formulated without harsh parabens, sulfates, mineral oils, or synthetic toxins."
        />

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 mb-10">
          {ingredients.map((ing, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === idx
                  ? 'bg-[#d9006c] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-[#d9006c] border border-rose-100'
              }`}
            >
              {ing.name}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-rose-100 shadow-xl relative bg-rose-50">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-ingredient.jpg';
                  }}
                />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-100 text-[11px] font-bold text-gray-900 shadow-md flex items-center space-x-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                  <span>100% Sustainably Sourced</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-extrabold text-[#d4af37] uppercase tracking-widest">
                {current.tagline}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {current.name}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                {current.description}
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {current.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs sm:text-sm font-semibold text-gray-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-rose-100">
                <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Dermatologically Tested</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                  <Droplet className="w-3.5 h-3.5 text-blue-500" />
                  <span>Paraben & Sulfate Free</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cruelty-Free</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};