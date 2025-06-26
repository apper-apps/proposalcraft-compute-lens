import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 mx-auto mb-6 bg-surface-100 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="FileQuestion" className="w-12 h-12 text-surface-400" />
        </motion.div>
        
        <h1 className="text-4xl font-display font-bold text-secondary mb-4">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-secondary mb-2">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            icon="Home"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
          
          <Button
            variant="secondary"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound