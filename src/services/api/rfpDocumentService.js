import { toast } from 'react-toastify'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

// Simulate file parsing service
const parseDocument = async (file) => {
  await delay(2000) // Simulate processing time
  
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  
  // Mock extracted content based on file type
  let mockSections = [
    {
      Id: 1,
      title: "Project Overview",
      content: "This RFP seeks proposals for a comprehensive software development project...",
      order: 1,
      required: true
    },
    {
      Id: 2,
      title: "Technical Requirements",
      content: "System must support 1000+ concurrent users, integrate with existing APIs...",
      order: 2,
      required: true
    },
    {
      Id: 3,
      title: "Budget and Timeline",
      content: "Project budget range: $50,000 - $100,000. Timeline: 6 months from contract signing...",
      order: 3,
      required: true
    },
    {
      Id: 4,
      title: "Company Qualifications",
      content: "Vendor must have minimum 5 years experience in similar projects...",
      order: 4,
      required: true
    }
  ]

  let mockRequirements = [
    "Minimum 5 years software development experience",
    "Portfolio of similar projects",
    "Technical architecture documentation",
    "Detailed project timeline",
    "Itemized budget breakdown"
  ]

  // Enhanced content for Excel files
  if (fileExt === 'xlsx' || fileExt === 'xls') {
    mockSections.push({
      Id: 5,
      title: "Data Requirements",
      content: "Excel file contains structured data requirements, reporting specifications, and data integration needs...",
      order: 5,
      required: true
    })
    
    mockRequirements.push(
      "Excel data processing capabilities",
      "Automated reporting features",
      "Data validation and integrity checks"
    )
  }

  const mockBudgetInfo = {
    range: "$50,000 - $100,000",
    paymentTerms: "Net 30",
    currency: "USD",
    budgetType: "Fixed Price"
  }

  return {
    sections: mockSections,
    requirements: mockRequirements,
    budgetInfo: mockBudgetInfo,
    content: `Extracted content from ${file.name}...`
  }
}

const rfpDocumentService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "filename" } },
          { field: { Name: "upload_date" } },
          { field: { Name: "content" } },
          { field: { Name: "requirements" } },
          { field: { Name: "budget_info" } },
          { field: { Name: "status" } }
        ],
        orderBy: [
          {
            fieldName: "upload_date",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      }
      
      const response = await apperClient.fetchRecords('rfp_document', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching RFP documents:", error)
      throw error
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "filename" } },
          { field: { Name: "upload_date" } },
          { field: { Name: "content" } },
          { field: { Name: "requirements" } },
          { field: { Name: "budget_info" } },
          { field: { Name: "status" } }
        ]
      }
      
      const response = await apperClient.getRecordById('rfp_document', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching RFP document with ID ${id}:`, error)
      throw error
    }
  },

  async upload(files) {
    // Handle both single file and multiple files
    const fileArray = Array.isArray(files) ? files : [files]
    const results = []

    try {
      const apperClient = getApperClient()
      
      for (const file of fileArray) {
        try {
          const parsedData = await parseDocument(file)
          
          const documentData = {
            Name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for name
            filename: file.name,
            upload_date: new Date().toISOString(),
            content: parsedData.content,
            requirements: parsedData.requirements.join('\n'),
            budget_info: JSON.stringify(parsedData.budgetInfo),
            status: 'parsed'
          }

          const createParams = {
            records: [documentData]
          }

          const response = await apperClient.createRecord('rfp_document', createParams)
          
          if (!response.success) {
            console.error(response.message)
            results.push({
              filename: file.name,
              error: response.message,
              status: 'error'
            })
            continue
          }

          if (response.results) {
            const successfulRecords = response.results.filter(result => result.success)
            const failedRecords = response.results.filter(result => !result.success)
            
            if (failedRecords.length > 0) {
              console.error(`Failed to create RFP document ${file.name}:${JSON.stringify(failedRecords)}`)
              
              failedRecords.forEach(record => {
                record.errors?.forEach(error => {
                  toast.error(`${error.fieldLabel}: ${error.message}`)
                })
                if (record.message) toast.error(record.message)
              })
              
              results.push({
                filename: file.name,
                error: 'Failed to create document',
                status: 'error'
              })
            }
            
            if (successfulRecords.length > 0) {
              const createdDoc = successfulRecords[0].data
              // Add parsed sections for compatibility
              createdDoc.sections = parsedData.sections
              createdDoc.budgetInfo = parsedData.budgetInfo
              results.push(createdDoc)
            }
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error)
          results.push({
            filename: file.name,
            error: error.message,
            status: 'error'
          })
        }
      }
      
      return fileArray.length === 1 ? results[0] : results
    } catch (error) {
      console.error("Error uploading documents:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('rfp_document', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete RFP document:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        
        return true
      }
    } catch (error) {
      console.error("Error deleting RFP document:", error)
      throw error
    }
  }
}

export default rfpDocumentService