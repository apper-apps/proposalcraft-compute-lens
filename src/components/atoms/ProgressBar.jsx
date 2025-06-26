import { motion } from 'framer-motion'

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  className = '',
  showValue = false,
  variant = 'primary',
  size = 'md' 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const variants = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error'
  }
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }
  
  return (
    <div className={`w-full bg-surface-200 rounded-full overflow-hidden ${sizes[size]} ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`h-full ${variants[variant]} transition-all duration-300`}
      />
      {showValue && (
        <div className="text-xs text-surface-600 mt-1">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}

export default ProgressBar