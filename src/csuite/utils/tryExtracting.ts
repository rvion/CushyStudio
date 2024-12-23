/** quick utility to verbosely attempt various data recovery tricks */
export enum RecoveryVerbosity {
   Quiet = 0,
   info = 1,
   Verbose = 2,
}

export function tryRecovering<T>({
   verbose = RecoveryVerbosity.Quiet,
   property,
   hacks,
   onFail,
   onSuccess,
}: {
   verbose?: RecoveryVerbosity
   property: string
   hacks: {
      level?: RecoveryVerbosity
      attempt: string
      fn: () => Maybe<T>
   }[]
   onFail?: (propName: string) => void
   onSuccess?: (propName: string, value: T) => void
}): T {
   if (verbose >= RecoveryVerbosity.Verbose)
      console.log(`[🔶] trying to find a suitable value for ${property}...`)

   for (const hack of hacks) {
      if (verbose >= RecoveryVerbosity.Verbose) console.log(`   > trying to use ${hack.attempt}...`)
      const value = hack.fn()
      if (value != null) {
         if (verbose >= (hack.level ?? RecoveryVerbosity.info))
            if (verbose) console.log(`   🔶 recovered ${property} using ${hack.attempt}.`)
         onSuccess?.(property, value)
         return value
      }
   }
   onFail?.(property)
   throw new Error(`[🔶] ${property} could not be recovered`)
}
