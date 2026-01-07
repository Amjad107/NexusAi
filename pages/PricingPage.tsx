
import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { AppSettings } from '../types';

interface PricingPageProps {
  settings: AppSettings;
}

const PricingPage: React.FC<PricingPageProps> = ({ settings }) => {
  const plans = [
    {
      name: 'Free',
      price: 0,
      credits: 3,
      features: ['Basic AI Generation', 'Standard Hosting', 'Community Support', 'Mobile Responsive'],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: settings.pricing.pro.name,
      price: settings.pricing.pro.price,
      credits: settings.pricing.pro.credits,
      features: ['Advanced AI Models', 'Priority Generation', 'Custom Domains', 'Email Support', 'Remove Badge'],
      buttonText: 'Upgrade to Pro',
      popular: true
    },
    {
      name: settings.pricing.enterprise.name,
      price: settings.pricing.enterprise.price,
      credits: settings.pricing.enterprise.credits,
      features: ['Everything in Pro', 'Unlimited Projects', 'Dedicated Account Manager', 'White-label Support', 'API Access'],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Simple, Transparent Pricing</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Choose the plan that's right for you. Upgrade or downgrade at any time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <div 
            key={plan.name} 
            className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' : 'border-slate-200 bg-white'} transition-transform hover:scale-105`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center space-x-1">
                <Sparkles size={12} />
                <span>MOST POPULAR</span>
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-black">${plan.price}</span>
              <span className="text-slate-500 ml-1">/month</span>
            </div>
            <p className="text-sm font-medium text-indigo-600 mb-8">{plan.credits} AI credits included</p>
            
            <ul className="space-y-4 mb-10">
              {plan.features.map(feat => (
                <li key={feat} className="flex items-start space-x-3 text-sm text-slate-600">
                  <div className="mt-0.5 p-0.5 bg-green-100 rounded-full text-green-600"><Check size={14} /></div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${plan.popular ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
              style={plan.popular ? { backgroundColor: settings.buttonColor } : {}}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
