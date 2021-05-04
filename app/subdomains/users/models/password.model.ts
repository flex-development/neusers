import { String } from 'runtypes'
import passwordConstraint from '../utils/passwordConstraint.util'

/**
 * @file Subdomain Model - Password
 * @module app/subdomains/users/Password
 */

export default String.withConstraint(passwordConstraint, { name: 'Password' })
