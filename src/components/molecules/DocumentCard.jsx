import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const DocumentCard = ({ document, onView, onDelete, onCreateProposal }) => {
const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf': return 'FileText'
      case 'docx': case 'doc': return 'FileType'
      case 'xlsx': case 'xls': return 'Spreadsheet'
      case 'txt': return 'File'
      default: return 'File'
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'parsed': return 'success'
      case 'processing': return 'warning'
      case 'error': return 'error'
      default: return 'default'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, shadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-lg border border-surface-200 p-6 hover:border-primary/30 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name={getFileIcon(document.filename)} className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-secondary truncate" title={document.filename}>
              {document.filename}
            </h3>
            <p className="text-sm text-surface-600">
              Uploaded {format(new Date(document.uploadDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <Badge variant={getStatusVariant(document.status)} size="sm">
          {document.status}
        </Badge>
      </div>

      {document.sections && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="List" className="w-4 h-4 text-surface-500" />
            <span className="text-sm font-medium text-surface-700">
              {document.sections.length} sections extracted
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {document.sections.slice(0, 3).map((section) => (
              <Badge key={section.Id} variant="default" size="sm">
                {section.title}
              </Badge>
            ))}
            {document.sections.length > 3 && (
              <Badge variant="default" size="sm">
                +{document.sections.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {document.budgetInfo && (
        <div className="mb-4 p-3 bg-surface-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <ApperIcon name="DollarSign" className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-surface-700">Budget Range</span>
          </div>
          <p className="text-sm text-surface-600">{document.budgetInfo.range}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          icon="Eye"
          onClick={() => onView(document)}
          className="flex-1"
        >
          View Details
        </Button>
        <Button
          variant="accent"
          size="sm"
          icon="Plus"
          onClick={() => onCreateProposal(document)}
          className="flex-1"
        >
          Create Proposal
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="Trash2"
          onClick={() => onDelete(document.Id)}
          className="text-error hover:bg-error/10"
        />
      </div>
    </motion.div>
  )
}

export default DocumentCard