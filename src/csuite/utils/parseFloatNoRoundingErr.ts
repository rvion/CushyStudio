export const parseFloatNoRoundingErr = (str: string | number, maxDigitsAfterDot = 3): number => {
   const result = typeof str === 'number' ? str : parseFloat(str)
   if (isNaN(result)) return 0
   const out = Number(result.toFixed(maxDigitsAfterDot))
   return out
}

// parseFloatNoRoundingErr('3.101')        : 3.101
// parseFloatNoRoundingErr('3.10001')      : 3.1
// parseFloatNoRoundingErr('3.1000000001') : 3.1
// parseFloatNoRoundingErr(3.101)          : 3.101
// parseFloatNoRoundingErr(3.10001)        : 3.1
// parseFloatNoRoundingErr(3.1000000001)   : 3.1
