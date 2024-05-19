import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale'

/**
 * Get time distance between `timestamp` and the current date 
 * @param {string} timestamp ISO timestamp string
 * @returns Time distance between `timestamp` and the current date
 */
const getTimeDistance = (timestamp) => {
   const baseDate = new Date();
   const date = new Date(timestamp);
   return formatDistance(date, baseDate, { locale: vi, addSuffix: true })
}
export {
   getTimeDistance
}