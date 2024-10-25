export function waitConfirm() {
   const readline = require('readline')
   const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
   })
   return new Promise((res) => {
      rl.question('Press any key to continue', () => {
         rl.close()
         res(null)
      })
   })
}
