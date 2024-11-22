import type * as v from 'valibot'

import chalk from 'chalk'

export const printValibotResultInConsole = (res: {
   //
   success: boolean
   issues: v.BaseIssue<any>[]
}): void => {
   if (res.success) {
      console.log('🟢 valid schema')
      return
   }

   console.log('❌ invalid schema')
   for (const issue of res.issues) {
      const jsonPath = issue.path?.map((p) => p.key).join('.')
      console.log(`at:`, chalk.blue(jsonPath), chalk.red(issue.message) /* { issue } */)
   }

   console.log(`total: ${res.issues.length} issues`)
}
