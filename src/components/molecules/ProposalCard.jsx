import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const ProposalCard = ({ proposal, onView, onEdit, onDelete, onExport }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'draft': return 'warning'
      case 'completed': return 'success'
      case 'submitted': return 'info'
      case 'generated': return 'primary'
      default: return 'default'
    }
  }

  const completedSections = proposal.sections?.filter(s => s.completed).length || 0
  const totalSections = proposal.sections?.length || 0
  const completionPercentage = totalSections > 0 ? (completedSections / totalSections) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, shadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-lg border border-surface-200 p-6 hover:border-primary/30 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-secondary mb-1 truncate" title={proposal.title}>
            {proposal.title}
          </h3>
          <p className="text-sm text-surface-600">
            Created {format(new Date(proposal.createdDate), 'MMM d, yyyy')}
          </p>
        </div>
        <Badge variant={getStatusVariant(proposal.status)} size="sm">
          {proposal.status}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-surface-700">Progress</span>
          <span className="text-sm text-surface-600">{completedSections}/{totalSections} sections</span>
        </div>
        <div className="w-full bg-surface-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-primary h-2 rounded-full"
          />
        </div>
      </div>

      {/* Budget Info */}
      {proposal.budget && (
        <div className="mb-4 p-3 bg-surface-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ApperIcon name="DollarSign" className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-surface-700">Total Budget</span>
            </div>
            <span className="text-sm font-semibold text-secondary">
              ${proposal.budget.total?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      )}

      {/* Sections Preview */}
      {proposal.sections && proposal.sections.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="FileText" className="w-4 h-4 text-surface-500" />
            <span className="text-sm font-medium text-surface-700">Sections</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {proposal.sections.slice(0, 3).map((section) => (
              <Badge 
                key={section.Id} 
                variant={section.completed ? 'success' : 'default'} 
                size="sm"
                icon={section.completed ? 'Check' : 'Clock'}
              >
                {section.title}
              </Badge>
            ))}
            {proposal.sections.length > 3 && (
              <Badge variant="default" size="sm">
                +{proposal.sections.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          icon="Edit"
          onClick={() => onEdit(proposal.Id)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon="Eye"
          onClick={() => onView(proposal)}
        />
        <Button
          variant="accent"
          size="sm"
          icon="Download"
          onClick={() => onExport(proposal)}
        />
        <Button
          variant="ghost"
          size="sm"
          icon="Trash2"
          onClick={() => onDelete(proposal.Id)}
          className="text-error hover:bg-error/10"
        />
      </div>
    </motion.div>
  )
}

export default ProposalCard