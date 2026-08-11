import { AUTH } from './auth';

export const COMP = {
  create: '/api/Competition/Create',
  update: '/api/User/update',
  delete: '/api/User/delete',
  getAll: '/api/Competition/GetAll',
  getById: '/api/Competition/GetById',
} as const;

// export const COMPETITION_STATUS = {
//   DRAFT: 'Rascunho',
//   REGISTRATION_OPEN: 'Inscrições Abertas',
//   REGISTRATION_CLOSED: 'Inscrições Encerradas',
//   IN_PROGRESS: 'Em Andamento',
//   COMPLETED: 'Finalizado',
//   CANCELLED: 'Cancelado',
//   POSTPONED: 'Adiado',
// } as const;

// core/constants/competition-status.ts

/**
 * Chave = valor salvo no banco (e enviado/recebido da API)
 * Valor = label exibido na UI
 */
export const COMPETITION_STATUS = {
  DRAFT: 'Rascunho',
  REGISTRATION_OPEN: 'Inscrições Abertas',
  REGISTRATION_CLOSED: 'Inscrições Encerradas',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Finalizado',
  CANCELLED: 'Cancelado',
  POSTPONED: 'Adiado',
} as const;

/** Entries prontos para usar em @for / ngFor */
export const COMPETITION_STATUS_ENTRIES = Object.entries(
  COMPETITION_STATUS,
).map(([value, label]) => ({ value, label }));
