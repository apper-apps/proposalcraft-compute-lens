import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = '' 
}) => {
  const variants = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }
  
  return (
    <span className={`
      inline-flex items-center gap-1 font-medium rounded-full
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {icon && <ApperIcon name={icon} className="w-3 h-3" />}
      {children}
    </span>
  )
}

export default Badge