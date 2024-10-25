export function formatDateForInput(date: Maybe<Date>): string {
   if (date == null || isNaN(date.getTime())) return ''

   // we need the date in the format `yyyy-MM-dd'T'HH:mm`
   const year = date.getFullYear()
   const month = (date.getMonth() + 1).toString().padStart(2, '0')
   const day = date.getDate().toString().padStart(2, '0')
   const hours = date.getHours().toString().padStart(2, '0')
   const minutes = date.getMinutes().toString().padStart(2, '0')
   return `${year}-${month}-${day}T${hours}:${minutes}`
}
