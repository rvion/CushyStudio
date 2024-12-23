export function formatDateForInput(date: Maybe<Date>): string {
   if (date == null || isNaN(date.getTime())) return ''

   // 💬 2024-12-08 rvion: previous code was using date-fns, but we don't want that big lib.
   // import { format } from 'src/utils/date-fns-mini'
   // return format(date, `yyyy-MM-dd'T'HH:mm`)
   const year = date.getFullYear()
   const month = String(date.getMonth() + 1).padStart(2, '0')
   const day = String(date.getDate()).padStart(2, '0')
   const hours = String(date.getHours()).padStart(2, '0')
   const minutes = String(date.getMinutes()).padStart(2, '0')
   return `${year}-${month}-${day}T${hours}:${minutes}`
}
