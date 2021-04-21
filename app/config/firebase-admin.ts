import * as testing from '@firebase/rules-unit-testing'
import type { AppOptions, ServiceAccount } from 'firebase-admin'
import * as admin from 'firebase-admin'
import type { PlainObject } from 'simplytyped'
import { CONF } from './configuration'

/**
 * @file Config - Firebase Admin
 * @module app/config/firebase-admin
 */

const SERVICE_ACCOUNT = {
  client_email: CONF.FIREBASE_CLIENT_EMAIL,
  private_key: CONF.FIREBASE_PRIVATE_KEY,
  project_id: CONF.FIREBASE_PROJECT_ID
} as ServiceAccount

const APP_OPTIONS: AppOptions = {
  credential: admin.credential.cert(SERVICE_ACCOUNT),
  databaseURL: `https://${CONF.FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: CONF.FIREBASE_PROJECT_ID
}

/**
 * Initializes the Firebase Admin SDK.
 *
 * @return {admin.app.App} Initialzied Firebase Admin app
 */
export default (): admin.app.App => {
  let app: PlainObject = {}

  if (CONF.TEST) {
    if (!testing.apps.length) app = testing.initializeAdminApp(APP_OPTIONS)
  } else {
    if (!admin.apps.length) app = admin.initializeApp(APP_OPTIONS)
  }

  return app as admin.app.App
}
