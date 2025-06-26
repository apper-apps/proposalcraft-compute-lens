import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ProgressBar from '@/components/atoms/ProgressBar'
import ProposalSectionEditor from '@/components/organisms/ProposalSectionEditor'
import BudgetBuilder from '@/components/organisms/BudgetBuilder'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import proposalService from '@/services/api/proposalService'
import rfpDocumentService from '@/services/api/rfpDocumentService'

const ProposalBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [proposal, setProposal] = useState(null)
  const [rfpDocument, setRfpDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('sections')

  useEffect(() => {
    loadProposal()
  }, [id])

  const loadProposal = async () => {
    setLoading(true)
    setError(null)
    try {
const proposalData = await proposalService.getById(parseInt(id))
      // Transform data to include required fields
      const transformedProposal = {
        ...proposalData,
        rfpId: proposalData.rfp_id || proposalData.rfpId,
        title: proposalData.title || proposalData.Name,
        createdDate: proposalData.created_date || proposalData.createdDate,
        sections: proposalData.sections || []
      }
      setProposal(transformedProposal)
      
      // Load the associated RFP document
      if (proposalData.rfpId) {
        try {
          const rfpData = await rfpDocumentService.getById(proposalData.rfpId)
          setRfpDocument(rfpData)
        } catch (rfpError) {
          console.warn('Could not load RFP document:', rfpError)
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load proposal')
      toast.error('Failed to load proposal')
    } finally {
      setLoading(false)
    }
  }

  const handleSectionUpdate = async (sectionId, updates) => {
    setSaving(true)
    try {
      const updatedSections = proposal.sections.map(section => 
        section.Id === sectionId ? { ...section, ...updates } : section
      )
      
      const updatedProposal = await proposalService.update(proposal.Id, {
        sections: updatedSections
      })
      
      setProposal(updatedProposal)
      toast.success('Section updated successfully')
    } catch (error) {
      toast.error('Failed to update section')
      console.error('Update error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleComplete = async (sectionId) => {
    const section = proposal.sections.find(s => s.Id === sectionId)
    if (!section) return

    await handleSectionUpdate(sectionId, { completed: !section.completed })
  }

  const handleBudgetUpdate = async (updatedBudget) => {
    setSaving(true)
    try {
      const updatedProposal = await proposalService.update(proposal.Id, {
        budget: updatedBudget
      })
      
      setProposal(updatedProposal)
      toast.success('Budget updated successfully')
    } catch (error) {
      toast.error('Failed to update budget')
      console.error('Budget update error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    // Mock export functionality
    toast.success('Proposal exported successfully!')
    
    // Generate a simple text export
    const exportContent = `
${proposal.title}
Generated: ${new Date().toISOString()}

${proposal.sections.map(section => `
${section.order}. ${section.title}
${section.content || '[Content not yet added]'}
`).join('\n')}

Budget Summary:
Total: ${proposal.budget?.currency || 'USD'} ${proposal.budget?.total?.toLocaleString() || '0'}
${proposal.budget?.items?.map(item => `- ${item.description}: ${item.quantity} x ${item.rate} = ${item.total}`).join('\n') || ''}
    `.trim()

    const blob = new Blob([exportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${proposal.title.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getCompletionStats = () => {
    if (!proposal?.sections) return { completed: 0, total: 0, percentage: 0 }
    
    const completed = proposal.sections.filter(s => s.completed).length
    const total = proposal.sections.length
    const percentage = total > 0 ? (completed / total) * 100 : 0
    
    return { completed, total, percentage }
  }

  const stats = getCompletionStats()

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <SkeletonLoader count={1} type="form" />
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <ErrorState 
          message={error || 'Proposal not found'}
          onRetry={loadProposal}
        />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-surface-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => navigate('/active-proposals')}
                  className="text-surface-500 hover:text-surface-700 transition-colors"
                >
                  <ApperIcon name="ArrowLeft" className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-display font-bold text-secondary truncate">
                  {proposal.title}
                </h1>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-surface-600">
                <div className="flex items-center gap-1">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
<span>Created {new Date(proposal.created_date || proposal.createdDate).toLocaleDateString()}</span>
                </div>
                <Badge variant="primary" size="sm">
                  {proposal.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                icon="Download"
                onClick={handleExport}
              >
                Export
              </Button>
              <Button
                variant="primary"
                icon="Save"
                loading={saving}
              >
                {saving ? 'Saving...' : 'Save All'}
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-surface-700">
                Completion Progress
              </span>
              <span className="text-sm text-surface-600">
                {stats.completed}/{stats.total} sections complete
              </span>
            </div>
            <ProgressBar value={stats.percentage} variant="primary" />
          </div>

          {/* Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'sections'
                  ? 'bg-primary text-white'
                  : 'text-surface-700 hover:bg-surface-100'
              }`}
            >
              <ApperIcon name="FileText" className="w-4 h-4 inline mr-2" />
              Sections
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'budget'
                  ? 'bg-primary text-white'
                  : 'text-surface-700 hover:bg-surface-100'
              }`}
            >
              <ApperIcon name="Calculator" className="w-4 h-4 inline mr-2" />
              Budget
            </button>
            {rfpDocument && (
              <button
                onClick={() => setActiveTab('requirements')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'requirements'
                    ? 'bg-primary text-white'
                    : 'text-surface-700 hover:bg-surface-100'
                }`}
              >
                <ApperIcon name="CheckCircle" className="w-4 h-4 inline mr-2" />
                Requirements
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {activeTab === 'sections' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {proposal.sections?.map((section, index) => (
                <motion.div
                  key={section.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProposalSectionEditor
                    section={section}
                    onUpdate={handleSectionUpdate}
                    onToggleComplete={handleToggleComplete}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'budget' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BudgetBuilder
                budget={proposal.budget}
                onUpdate={handleBudgetUpdate}
              />
            </motion.div>
          )}

          {activeTab === 'requirements' && rfpDocument && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-surface-200 p-6"
            >
              <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
                RFP Requirements
              </h3>
              
              {rfpDocument.requirements && (
                <div className="space-y-3">
                  {rfpDocument.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg">
                      <ApperIcon name="CheckCircle" className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-surface-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              )}

              {rfpDocument.budgetInfo && (
                <div className="mt-6 p-4 bg-info/5 border border-info/20 rounded-lg">
                  <h4 className="font-medium text-secondary mb-2">Budget Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Range:</span> {rfpDocument.budgetInfo.range}
                    </div>
                    <div>
                      <span className="font-medium">Currency:</span> {rfpDocument.budgetInfo.currency}
                    </div>
                    <div>
                      <span className="font-medium">Payment Terms:</span> {rfpDocument.budgetInfo.paymentTerms}
                    </div>
                    <div>
                      <span className="font-medium">Budget Type:</span> {rfpDocument.budgetInfo.budgetType}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProposalBuilder