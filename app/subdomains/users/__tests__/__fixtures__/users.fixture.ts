import type { IUser } from '@neusers/subdomains/users/interfaces'

/**
 * @file Test Fixture - Users
 * @module app/subdomains/users/tests/fixtures/users.fixture
 */

export const USERS_ROOT: Record<
  IUser['id'],
  Omit<IUser, 'created_at' | 'updated_at'>
> = {
  '078086a3-6190-42c5-8b96-5c93e4633e65': {
    email: 'jeisenberg3@mac.com',
    first_name: 'Jozef',
    id: '078086a3-6190-42c5-8b96-5c93e4633e65',
    last_name: 'Eisenberg',
    password: 'Z5UOVAJv'
  },
  '1c3fed43-1a2e-4878-82ac-ad3fb6357228': {
    email: 'hthorpe0@about.com',
    first_name: 'Horatio',
    id: '1c3fed43-1a2e-4878-82ac-ad3fb6357228',
    last_name: 'Thorpe',
    password: 'qvB1ZpzmKKL'
  },
  '7f45835b-d105-447e-b0ae-d11e7a07fdd8': {
    email: 'cdownton4@bbb.org',
    first_name: 'Courtnay',
    id: '7f45835b-d105-447e-b0ae-d11e7a07fdd8',
    last_name: 'Downton',
    password: 'VTyHPjEvX2'
  },
  '2696e0bc-7965-4df6-9a69-3feea41b75ff': {
    email: 'mrogier2@google.ru',
    first_name: 'Meryl',
    id: '2696e0bc-7965-4df6-9a69-3feea41b75ff',
    last_name: 'Rogier',
    password: 'twaa2aZ2'
  },
  'e8005401-2927-4a9a-9096-b7c6731f4edc': {
    email: 'sgrodden1@sbwire.com',
    first_name: 'Sutton',
    id: 'e8005401-2927-4a9a-9096-b7c6731f4edc',
    last_name: 'Grodden',
    password: 'a4IVKrLExO'
  }
}
