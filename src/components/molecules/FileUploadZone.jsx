import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const FileUploadZone = ({ onFileSelect, accept = '.pdf,.docx,.xlsx,.xls,.txt', multiple = false }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setDragCounter(prev => prev - 1)
    if (dragCounter <= 1) {
      setIsDragging(false)
    }
  }, [dragCounter])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    setDragCounter(0)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      if (multiple) {
        onFileSelect(files)
      } else {
        onFileSelect(files[0])
      }
    }
  }, [onFileSelect, multiple])

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      if (multiple) {
        onFileSelect(files)
      } else {
        onFileSelect(files[0])
      }
    }
  }

  return (
    <motion.div
      animate={{
        scale: isDragging ? 1.02 : 1,
        borderColor: isDragging ? '#6B46C1' : '#CBD5E1'
      }}
      transition={{ duration: 0.2 }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
        ${isDragging 
          ? 'border-primary bg-primary/5 shadow-lg' 
          : 'border-surface-300 hover:border-surface-400 hover:bg-surface-50'
        }
      `}
    >
      <div className="space-y-4">
        <motion.div
          animate={{ y: isDragging ? -2 : 0 }}
          className="mx-auto w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center"
        >
          <ApperIcon 
            name={isDragging ? "Download" : "Upload"} 
            className={`w-8 h-8 transition-colors ${isDragging ? 'text-primary' : 'text-surface-500'}`} 
          />
        </motion.div>
        
        <div>
<h3 className="text-lg font-semibold text-secondary mb-2">
            {isDragging ? 'Drop your files here' : multiple ? 'Upload RFP Documents' : 'Upload RFP Document'}
          </h3>
          <p className="text-surface-600 mb-4">
            Drag and drop your RFP files here, or click to browse
          </p>
          <p className="text-sm text-surface-500">
            Supports: PDF, DOCX, XLSX, XLS, TXT files
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="FolderOpen"
          onClick={() => document.getElementById('file-input').click()}
        >
          Browse Files
        </Button>
        
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </motion.div>
  )
}

export default FileUploadZone