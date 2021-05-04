import { String } from 'runtypes'
import emailConstraint from '../utils/emailConstraint.util'

/**
 * @file Global Model - Email
 * @module app/lib/models/Email
 * @see https://github.com/pelotom/runtypes#constraint-checking
 */

export default String.withConstraint(emailConstraint)
