export const _formatPreviewDate = (date?: Date, showInterval = false) => {
   if (date == null) return '<❌ date error>'
   const today = new Date(new Date().setHours(0, 0, 0, 0))
   const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0, 0)
   const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6, 0, 0, 0, 0)
   const thisYear = new Date(today.getFullYear(), 0, 1)

   let intervalStr = ''

   if (showInterval) intervalStr = _getTimeInterval(date)
   if (date >= today)
      return (
         date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' }) + intervalStr
      )
   if (date >= yesterday) return 'Yesterday'
   if (date >= lastWeek) return _weekdays[date.getDay()] + intervalStr
   if (date >= thisYear)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + intervalStr
   return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + intervalStr
}

const _getTimeInterval = (date: Date) => {
   const nowTs = Date.now()
   const dateTs = date.getTime()
   const seconds = Math.floor((nowTs - dateTs) / 1000)

   let interval = seconds / 31536000

   if (interval > 1) return _generateIntervalString(Math.floor(interval), 'year')

   interval = seconds / 2592000
   if (interval > 1) return _generateIntervalString(Math.floor(interval), 'month')

   interval = seconds / 86400
   if (interval > 1) return _generateIntervalString(Math.floor(interval), 'day')

   interval = seconds / 3600
   if (interval > 1) return _generateIntervalString(Math.floor(interval), 'hour')

   interval = seconds / 60
   if (interval > 1) return _generateIntervalString(Math.floor(interval), 'minute')

   return _generateIntervalString(Math.floor(interval), 'second')
}

const _weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const _generateIntervalString = (time: number, unit: string) =>
   ' (' + time + ` ${time > 1 ? `${unit}s` : unit} ago)`
