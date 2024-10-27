export const IconUI = (p: { icon: string; color?: string }) => (
   <span
      className='material-symbols-outlined'
      style={{ fontSize: '1.2em', verticalAlign: 'middle', color: p.color }}
   >
      {p.icon}
   </span>
)
