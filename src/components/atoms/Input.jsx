import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  type = 'text',
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">
            <ApperIcon name={icon} className="w-4 h-4" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-3 py-2 border rounded-lg transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
              : 'border-surface-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input