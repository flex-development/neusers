import { RepoDBConnection as Connection } from '@flex-development/dreepo'
import rpath from '../lib/utils/repoPath.util'
import { CONF } from './configuration'

/**
 * @file Config - Database Connections
 * @module app/config/database
 * @see https://github.com/flex-development/dreepo#database-connection
 */

export type RepoDBConnectionKey = keyof typeof CONF.SUBDOMAINS

const {
  FIREBASE_CLIENT_EMAIL: client_email,
  FIREBASE_PRIVATE_KEY: private_key,
  SUBDOMAINS
} = CONF

const { users } = SUBDOMAINS

const DBCONNS: Record<RepoDBConnectionKey, Connection> = {
  users: new Connection(rpath(users.repo), users.db, client_email, private_key)
}

export default DBCONNS
