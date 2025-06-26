import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import templateService from '@/services/api/templateService'

const Templates = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'General'
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await templateService.getAll()
      setTemplates(result)
    } catch (err) {
      setError(err.message || 'Failed to load templates')
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async (e) => {
    e.preventDefault()
    if (!newTemplate.name.trim()) return

    try {
      const created = await templateService.create(newTemplate)
      setTemplates(prev => [created, ...prev])
      setNewTemplate({ name: '', description: '', category: 'General' })
      setIsCreating(false)
      toast.success('Template created successfully!')
    } catch (error) {
      toast.error('Failed to create template')
      console.error('Create error:', error)
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return
    }

    try {
      await template.delete(templateId)
      setTemplates(prev => prev.filter(t => t.Id !== templateId))
      toast.success('Template deleted successfully')
    } catch (error) {
      toast.error('Failed to delete template')
      console.error('Delete error:', error)
    }
  }

  const getTemplatesByCategory = () => {
    const categories = {}
    templates.forEach(template => {
      const category = template.category || 'General'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(template)
    })
    return categories
  }

  const templatesByCategory = getTemplatesByCategory()

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">Proposal Templates</h1>
          <p className="text-surface-600">Manage reusable proposal templates</p>
        </div>
        <SkeletonLoader count={3} type="card" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">Proposal Templates</h1>
          <p className="text-surface-600">Manage reusable proposal templates</p>
        </div>
        <ErrorState 
          message={error}
          onRetry={loadTemplates}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">
            Proposal Templates
          </h1>
          <p className="text-surface-600">
            Create and manage reusable templates for consistent proposals
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setIsCreating(true)}
        >
          New Template
        </Button>
      </motion.div>

      {/* Create Template Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-lg border border-surface-200 p-6"
        >
          <h3 className="text-lg font-semibold text-secondary mb-4">Create New Template</h3>
          <form onSubmit={handleCreateTemplate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Template Name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Software Development Proposal"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Category
                </label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="General">General</option>
                  <option value="Technology">Technology</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Construction">Construction</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Description
              </label>
              <textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of what this template is used for..."
                rows={3}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" variant="primary" icon="Save">
                Create Template
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Templates by Category */}
      {Object.keys(templatesByCategory).length === 0 ? (
        <EmptyState
          title="No templates yet"
          description="Create your first proposal template to streamline your proposal creation process"
          icon="Layout"
          actionLabel="Create Template"
          onAction={() => setIsCreating(true)}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-display font-semibold text-secondary">
                  {category}
                </h2>
                <Badge variant="default" size="sm">
                  {categoryTemplates.length}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTemplates.map((template, index) => (
                  <motion.div
                    key={template.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2, shadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                    className="bg-white rounded-lg border border-surface-200 p-6 hover:border-primary/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-secondary mb-1 truncate">
                          {template.name}
                        </h3>
                        <p className="text-sm text-surface-600 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <Badge variant="primary" size="sm">
                        {template.category}
                      </Badge>
                    </div>

                    {/* Template Sections */}
                    {template.sections && template.sections.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ApperIcon name="List" className="w-4 h-4 text-surface-500" />
                          <span className="text-sm font-medium text-surface-700">
                            {template.sections.length} sections
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {template.sections.slice(0, 3).map((section) => (
                            <Badge key={section.Id} variant="default" size="sm">
                              {section.title}
                            </Badge>
                          ))}
                          {template.sections.length > 3 && (
                            <Badge variant="default" size="sm">
                              +{template.sections.length - 3} more
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
                        className="flex-1"
                        onClick={() => toast.info('Template editor coming soon!')}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="Copy"
                        onClick={() => toast.info('Template duplication coming soon!')}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteTemplate(template.Id)}
                        className="text-error hover:bg-error/10"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Template Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-secondary mb-4">Template Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Copy" className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-secondary">Reusable Sections</h4>
              <p className="text-sm text-surface-600">Create standardized sections for consistent proposals</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Zap" className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h4 className="font-medium text-secondary">Quick Start</h4>
              <p className="text-sm text-surface-600">Jump-start new proposals with pre-built templates</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Settings" className="w-4 h-4 text-info" />
            </div>
            <div>
              <h4 className="font-medium text-secondary">Customizable</h4>
              <p className="text-sm text-surface-600">Adapt templates to specific RFP requirements</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Templates