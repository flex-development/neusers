import { String } from 'runtypes'
import strongPasswordConstraint from '../utils/passwordConstraint.util'

/**
 * @file Subdomain Model - Password
 * @module app/subdomains/users/Password
 */

export default String.withConstraint(strongPasswordConstraint, {
  name: 'StrongPassword'
})
