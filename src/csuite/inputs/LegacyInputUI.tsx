export const LegacyInputUI = (p: React.JSX.IntrinsicElements['input']): React.JSX.Element => {
   const { className, children, ...rest } = p
   return (
      <input tw={['csuite-basic-input', className]} {...rest}>
         {children}
      </input>
   )
}
