import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import FileUploadZone from '@/components/molecules/FileUploadZone'
import DocumentCard from '@/components/molecules/DocumentCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import ProgressBar from '@/components/atoms/ProgressBar'
import rfpDocumentService from '@/services/api/rfpDocumentService'
import proposalService from '@/services/api/proposalService'

const Upload = () => {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
const result = await rfpDocumentService.getAll()
      // Transform data to include required fields
      const transformedDocuments = result.map(doc => ({
        ...doc,
        uploadDate: doc.upload_date || doc.uploadDate,
        budgetInfo: doc.budget_info ? (typeof doc.budget_info === 'string' ? JSON.parse(doc.budget_info) : doc.budget_info) : {},
        requirements: doc.requirements ? (Array.isArray(doc.requirements) ? doc.requirements : doc.requirements.split('\n')) : []
      }))
      setDocuments(transformedDocuments)
    } catch (err) {
      setError(err.message || 'Failed to load documents')
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

const handleFileUpload = async (files) => {
    if (!files) return

    // Handle both single file and array of files
    const fileArray = Array.isArray(files) ? files : [files]
    
    // Validate file types
    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ]
    
    const invalidFiles = fileArray.filter(file => !allowedTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      toast.error('Please upload PDF, DOCX, XLSX, XLS, or TXT files only')
      return
    }

    // Validate file sizes (max 10MB each)
    const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      toast.error('Each file must be less than 10MB')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const results = await rfpDocumentService.upload(fileArray.length === 1 ? fileArray[0] : fileArray)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Handle results (single file or multiple files)
      if (Array.isArray(results)) {
        const successCount = results.filter(r => !r.error).length
        const errorCount = results.filter(r => r.error).length
        
        if (successCount > 0) {
          toast.success(`${successCount} document${successCount > 1 ? 's' : ''} uploaded successfully!`)
          const validResults = results.filter(r => !r.error)
          setDocuments(prev => [...validResults, ...prev])
        }
        
        if (errorCount > 0) {
          toast.error(`${errorCount} document${errorCount > 1 ? 's' : ''} failed to upload`)
        }
      } else {
        toast.success('Document uploaded and parsed successfully!')
        setDocuments(prev => [results, ...prev])
      }
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0)
      }, 1000)
      
    } catch (error) {
      toast.error('Failed to upload documents')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleViewDocument = (document) => {
    // Navigate to document detail view or show modal
    toast.info('Document viewer coming soon!')
  }

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      await rfpDocumentService.delete(documentId)
      setDocuments(prev => prev.filter(doc => doc.Id !== documentId))
      toast.success('Document deleted successfully')
    } catch (error) {
      toast.error('Failed to delete document')
      console.error('Delete error:', error)
    }
  }

  const handleCreateProposal = async (document) => {
    try {
      // First check if company profile exists
      const companyProfile = { name: 'Sample Company' } // This would come from the profile service
      
      const proposal = await proposalService.generateFromRFP(document.Id, companyProfile)
      toast.success('Proposal generated successfully!')
      navigate(`/proposal-builder/${proposal.Id}`)
    } catch (error) {
      toast.error('Failed to generate proposal')
      console.error('Proposal generation error:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">Upload RFP Documents</h1>
          <p className="text-surface-600">Upload and parse your RFP documents to get started</p>
        </div>
        <SkeletonLoader count={3} type="card" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">Upload RFP Documents</h1>
          <p className="text-surface-600">Upload and parse your RFP documents to get started</p>
        </div>
        <ErrorState 
          message={error}
          onRetry={loadDocuments}
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
        className="text-center"
      >
        <h1 className="text-3xl font-display font-bold text-secondary mb-2">
          Upload RFP Documents
        </h1>
        <p className="text-surface-600 max-w-2xl mx-auto">
          Upload your RFP documents to automatically extract requirements, sections, and budget information. 
          Our AI will parse the content and prepare it for proposal generation.
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
<FileUploadZone 
          onFileSelect={handleFileUpload}
          accept=".pdf,.docx,.xlsx,.xls,.txt"
          multiple={true}
        />
        {/* Upload Progress */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-surface-50 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <ApperIcon name="Upload" className="w-5 h-5 text-primary" />
              <span className="font-medium text-secondary">Processing document...</span>
            </div>
<ProgressBar value={uploadProgress} showValue className="mb-2" />
            <p className="text-sm text-surface-600">
              {uploadProgress < 30 && "Uploading files..."}
              {uploadProgress >= 30 && uploadProgress < 70 && "Processing documents..."}
              {uploadProgress >= 70 && uploadProgress < 90 && "Extracting content..."}
              {uploadProgress >= 90 && "Finalizing..."}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Documents Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-secondary">
            Uploaded Documents
          </h2>
          <div className="flex items-center gap-2 text-sm text-surface-600">
            <ApperIcon name="FileText" className="w-4 h-4" />
            <span>{documents.length} documents</span>
          </div>
        </div>

        {documents.length === 0 ? (
<EmptyState
            title="No documents uploaded yet"
            description="Upload your RFP documents to get started with proposal generation. Supported formats: PDF, DOCX, XLSX, XLS, TXT"
            icon="Upload"
            actionLabel="Upload Documents"
            onAction={() => document.getElementById('file-input')?.click()}
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {documents.map((doc, index) => (
              <motion.div
                key={doc.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DocumentCard
                  document={doc}
                  onView={handleViewDocument}
                  onDelete={handleDeleteDocument}
                  onCreateProposal={handleCreateProposal}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface-50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-secondary mb-4">What happens after upload?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Search" className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-secondary">Smart Parsing</h4>
              <p className="text-sm text-surface-600">AI extracts sections, requirements, and budget information</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Zap" className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h4 className="font-medium text-secondary">Auto-Generation</h4>
              <p className="text-sm text-surface-600">Generate proposals matching RFP structure and requirements</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Download" className="w-4 h-4 text-info" />
            </div>
            <div>
              <h4 className="font-medium text-secondary">Export Ready</h4>
              <p className="text-sm text-surface-600">Export as PDF or DOCX with proper formatting</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Upload