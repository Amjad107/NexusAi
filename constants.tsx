
import React from 'react';
import { AppSettings } from './types';

export const INITIAL_SETTINGS: AppSettings = {
  primaryColor: '#6366f1',
  buttonColor: '#4f46e5',
  fontFamily: 'Inter',
  siteName: 'NexusAI',
  logo: 'https://picsum.photos/seed/logo/200/200',
  databaseMode: 'local',
  pricing: {
    pro: { price: 29, credits: 100, name: 'Pro Plan' },
    enterprise: { price: 99, credits: 500, name: 'Business Pro' }
  }
};

export const MOCK_USER = {
  id: 'u_123',
  email: 'admin@nexusai.com',
  name: 'Alex Rivera',
  credits: 24,
  plan: 'pro' as const,
  avatar: 'https://picsum.photos/seed/user/100/100'
};

export const MOCK_PROJECTS = [
  {
    id: 'p_1',
    name: 'Coffee Haven',
    description: 'A cozy landing page for an artisan coffee shop.',
    sections: [],
    createdAt: '2023-10-01',
    updatedAt: '2023-10-15',
    userId: 'u_123',
    isPublished: true,
    thumbnail: 'https://picsum.photos/seed/coffee/600/400',
    theme: { primaryColor: '#6366f1', fontFamily: 'Inter' }
  },
  {
    id: 'p_2',
    name: 'TechFlow SaaS',
    description: 'Marketing site for a productivity tool.',
    sections: [],
    createdAt: '2023-11-05',
    updatedAt: '2023-11-20',
    userId: 'u_123',
    isPublished: false,
    thumbnail: 'https://picsum.photos/seed/tech/600/400',
    theme: { primaryColor: '#6366f1', fontFamily: 'Inter' }
  }
];
