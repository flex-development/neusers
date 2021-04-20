import axios from 'axios'
import GAMP from 'ga-measurement-protocol'
import { CONF } from './configuration'

/**
 * @file Config - Google Analytics Measurement Protocol
 * @module app/config/measurement-protocol
 */

// Create new Google Analytics Measurement Protocol client
const MeasurementProtocol = new GAMP(CONF.GA_TRACKING_ID, axios, '1', true)

// Toggle tracking
MeasurementProtocol[CONF.GA_ENABLED ? 'enable' : 'disable']()

export default MeasurementProtocol
