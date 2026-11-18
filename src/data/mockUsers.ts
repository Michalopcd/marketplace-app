import type { User } from '../types/user'

/** Sample sellers used until Firebase is connected (Sprint 3–5). */
export const mockUsers: readonly User[] = [
  {
    id: 'user-1',
    name: 'Anna Kowalska',
    email: 'anna.kowalska@example.com',
    avatarUrl: null,
    bio: 'Oddaję drugie życie ubraniom z mojej szafy.',
    location: 'Warszawa',
    createdAt: '2025-03-12T09:15:00.000Z',
  },
  {
    id: 'user-2',
    name: 'Piotr Wiśniewski',
    email: 'piotr.wisniewski@example.com',
    avatarUrl: null,
    bio: 'Elektronika i gadżety w dobrym stanie.',
    location: 'Kraków',
    createdAt: '2025-05-02T14:40:00.000Z',
  },
  {
    id: 'user-3',
    name: 'Zofia Lewandowska',
    email: 'zofia.lewandowska@example.com',
    avatarUrl: null,
    bio: 'Vintage, ceramika i rzeczy z duszą.',
    location: 'Gdańsk',
    createdAt: '2025-07-21T18:05:00.000Z',
  },
  {
    id: 'user-4',
    name: 'Jakub Wójcik',
    email: 'jakub.wojcik@example.com',
    avatarUrl: null,
    bio: 'Sprzęt sportowy po sezonie.',
    location: 'Wrocław',
    createdAt: '2025-09-30T07:50:00.000Z',
  },
  {
    id: 'user-5',
    name: 'Maja Kamińska',
    email: 'maja.kaminska@example.com',
    avatarUrl: null,
    bio: 'Minimalizm w praktyce – sprzedaję, czego nie używam.',
    location: 'Poznań',
    createdAt: '2026-01-08T11:25:00.000Z',
  },
]
