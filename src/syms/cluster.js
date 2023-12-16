const _ = window.require('cluster')
export default _
export const _events = _._events
export const _eventsCount = _._eventsCount
export const _maxListeners = _._maxListeners
export const isWorker = _.isWorker
export const isMaster = _.isMaster
export const isPrimary = _.isPrimary
export const Worker = _.Worker
export const workers = _.workers
export const settings = _.settings
export const SCHED_NONE = _.SCHED_NONE
export const SCHED_RR = _.SCHED_RR
export const schedulingPolicy = _.schedulingPolicy
export const setupPrimary = _.setupPrimary
export const setupMaster = _.setupMaster
export const fork = _.fork
export const disconnect = _.disconnect
