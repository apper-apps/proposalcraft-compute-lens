import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorState = ({ 
  title = 'Something went wrong', 
  message, 
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="mx-auto w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-secondary mb-2">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          icon="RotateCcw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState