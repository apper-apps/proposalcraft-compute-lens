import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const EmptyState = ({ 
  title, 
  description, 
  icon = 'Package', 
  actionLabel, 
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mx-auto w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={icon} className="w-8 h-8 text-surface-400" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-secondary mb-2">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            onClick={onAction}
            icon="Plus"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState