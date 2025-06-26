import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import proposalService from "@/services/api/proposalService";
import ApperIcon from "@/components/ApperIcon";
import Templates from "@/components/pages/Templates";
import Upload from "@/components/pages/Upload";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import ErrorState from "@/components/molecules/ErrorState";
import ProposalCard from "@/components/molecules/ProposalCard";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const ActiveProposals = () => {
  const navigate = useNavigate()
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadProposals()
  }, [])

  const loadProposals = async () => {
    setLoading(true)
    setError(null)
    try {
const result = await proposalService.getAll()
      // Transform data to include required fields
      const transformedProposals = result.map(proposal => ({
        ...proposal,
        rfpId: proposal.rfp_id || proposal.rfpId,
        title: proposal.title || proposal.Name,
        createdDate: proposal.created_date || proposal.createdDate,
        sections: proposal.sections || []
      }))
      setProposals(transformedProposals)
    } catch (err) {
      setError(err.message || 'Failed to load proposals')
      toast.error('Failed to load proposals')
    } finally {
      setLoading(false)
    }
  }

  const handleViewProposal = (proposal) => {
    // Navigate to proposal view/preview
    toast.info('Proposal viewer coming soon!')
  }

  const handleEditProposal = (proposalId) => {
    navigate(`/proposal-builder/${proposalId}`)
  }

  const handleDeleteProposal = async (proposalId) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) {
      return
    }

    try {
      await proposalService.delete(proposalId)
      setProposals(prev => prev.filter(p => p.Id !== proposalId))
      toast.success('Proposal deleted successfully')
    } catch (error) {
      toast.error('Failed to delete proposal')
      console.error('Delete error:', error)
    }
  }

  const handleExportProposal = (proposal) => {
    // Mock export functionality
    toast.success('Proposal exported successfully!')
    
    // In a real app, this would generate and download the file
    const blob = new Blob([`Proposal: ${proposal.title}\n\nGenerated at: ${new Date().toISOString()}`], 
      { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${proposal.title.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFilteredProposals = () => {
    if (filter === 'all') return proposals
    return proposals.filter(p => p.status === filter)
  }

  const filteredProposals = getFilteredProposals()

  const getStatusCounts = () => {
    return {
      all: proposals.length,
      draft: proposals.filter(p => p.status === 'draft').length,
      generated: proposals.filter(p => p.status === 'generated').length,
      completed: proposals.filter(p => p.status === 'completed').length,
      submitted: proposals.filter(p => p.status === 'submitted').length
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">Active Proposals</h1>
          <p className="text-surface-600">Manage and track your proposal progress</p>
        </div>
        <SkeletonLoader count={3} type="card" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">Active Proposals</h1>
          <p className="text-surface-600">Manage and track your proposal progress</p>
        </div>
        <ErrorState 
          message={error}
          onRetry={loadProposals}
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
            Active Proposals
          </h1>
          <p className="text-surface-600">
            Track progress and manage your proposal pipeline
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => navigate('/')}
        >
          New Proposal
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="text-2xl font-bold text-secondary">{statusCounts.all}</div>
          <div className="text-sm text-surface-600">Total</div>
        </div>
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="text-2xl font-bold text-warning">{statusCounts.draft}</div>
          <div className="text-sm text-surface-600">Draft</div>
        </div>
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="text-2xl font-bold text-primary">{statusCounts.generated}</div>
          <div className="text-sm text-surface-600">Generated</div>
        </div>
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="text-2xl font-bold text-success">{statusCounts.completed}</div>
          <div className="text-sm text-surface-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="text-2xl font-bold text-info">{statusCounts.submitted}</div>
          <div className="text-sm text-surface-600">Submitted</div>
</div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {[
          { key: 'all', label: 'All Proposals', count: statusCounts.all },
          { key: 'draft', label: 'Draft', count: statusCounts.draft },
          { key: 'generated', label: 'Generated', count: statusCounts.generated },
          { key: 'completed', label: 'Completed', count: statusCounts.completed },
          { key: 'submitted', label: 'Submitted', count: statusCounts.submitted }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === filterOption.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
            }`}
          >
            {filterOption.label}
            {filterOption.count > 0 && (
              <Badge 
                variant={filter === filterOption.key ? 'default' : 'primary'} 
                size="sm" 
                className="ml-2"
              >
                {filterOption.count}
              </Badge>
            )}
          </button>
        ))}
      </motion.div>

      {/* Proposals Grid */}
      <div>
        {filteredProposals.length === 0 ? (
          <EmptyState
            title={filter === 'all' ? "No proposals yet" : `No ${filter} proposals`}
            description={
              filter === 'all' 
                ? "Start by uploading an RFP document to generate your first proposal"
                : `No proposals with status "${filter}" found. Try a different filter.`
            }
            icon="FileText"
            actionLabel={filter === 'all' ? "Upload RFP" : "View All Proposals"}
            onAction={() => filter === 'all' ? navigate('/') : setFilter('all')}
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredProposals.map((proposal, index) => (
              <motion.div
                key={proposal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProposalCard
                  proposal={proposal}
                  onView={handleViewProposal}
                  onEdit={handleEditProposal}
                  onDelete={handleDeleteProposal}
                  onExport={handleExportProposal}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            icon="Upload"
            onClick={() => navigate('/')}
            className="justify-start"
          >
            Upload New RFP
          </Button>
          
          <Button
            variant="outline"
            icon="Building2"
            onClick={() => navigate('/company-profile')}
            className="justify-start"
          >
            Update Company Profile
          </Button>
          
          <Button
            variant="outline"
            icon="Layout"
            onClick={() => navigate('/templates')}
            className="justify-start"
          >
            Manage Templates
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default ActiveProposals