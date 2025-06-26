import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const ProposalSectionEditor = ({ section, onUpdate, onToggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(section.content || '')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSave = () => {
    onUpdate(section.Id, { content })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setContent(section.content || '')
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-surface-200 overflow-hidden"
    >
      {/* Section Header */}
      <div className="p-4 border-b border-surface-100 bg-surface-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-surface-500 hover:text-surface-700 transition-colors"
            >
              <ApperIcon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                className="w-5 h-5" 
              />
            </button>
            <div>
              <h3 className="font-semibold text-secondary">
                {section.order}. {section.title}
              </h3>
              {section.required && (
                <Badge variant="error" size="sm" className="mt-1">
                  Required
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={section.completed ? "success" : "warning"} 
              size="sm"
              icon={section.completed ? "Check" : "Clock"}
            >
              {section.completed ? "Complete" : "In Progress"}
            </Badge>
            
            <button
              onClick={() => onToggleComplete(section.Id)}
              className={`p-2 rounded-lg transition-colors ${
                section.completed 
                  ? 'text-success hover:bg-success/10' 
                  : 'text-surface-400 hover:bg-surface-100'
              }`}
            >
              <ApperIcon name="Check" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="p-4">
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Enter content for ${section.title}...`}
                rows={8}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
              />
              
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon="Save"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {section.content ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-surface-700">
                    {section.content}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-surface-500">
                  <ApperIcon name="Edit" className="w-8 h-8 mx-auto mb-2" />
                  <p>Click "Edit Section" to add content</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  icon="Edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Section
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProposalSectionEditor