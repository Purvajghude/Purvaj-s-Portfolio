/**
 * Layout primitive. Max-width + gutter, nothing else.
 * Keeps every section on the same horizontal rhythm without each one
 * redefining padding. See DESIGN_CONTRACT.md section 3.
 */
export default function Container({ as: As = 'div', className = '', children, ...rest }) {
  return (
    <As className={className ? `u-container ${className}` : 'u-container'} {...rest}>
      {children}
    </As>
  );
}
