import { String } from 'runtypes'
import nesContraint from '../utils/nesContraint.util'

/**
 * @file Global Model - NonEmptyString
 * @module app/lib/models/NonEmptyString
 * @see https://github.com/pelotom/runtypes#constraint-checking
 */

export default String.withConstraint(nesContraint, { name: 'NonEmptyString' })
