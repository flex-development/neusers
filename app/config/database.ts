import * as fireorm from 'fireorm'
import firebaseAdmin from './firebase-admin'

/**
 * @file Config - Database
 * @module app/config/database
 * @see https://fireorm.js.org/
 */

fireorm.initialize(firebaseAdmin().firestore())
