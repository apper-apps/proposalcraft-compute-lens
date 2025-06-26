const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let rfpDocuments = []
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

// Process multiple files
const uploadMultiple = async (files) => {
  await delay(300)
  
  const results = []
  let currentId = rfpDocuments.length > 0 ? Math.max(...rfpDocuments.map(d => d.Id)) + 1 : 1
  
  for (const file of files) {
    try {
      const parsedData = await parseDocument(file)
      
      const document = {
        Id: currentId++,
        filename: file.name,
        uploadDate: new Date().toISOString(),
        content: parsedData.content,
        sections: parsedData.sections,
        requirements: parsedData.requirements,
        budgetInfo: parsedData.budgetInfo,
        status: 'parsed'
      }

      rfpDocuments.push(document)
      results.push({ ...document })
    } catch (error) {
      results.push({
        filename: file.name,
        error: error.message,
        status: 'error'
      })
    }
  }
  
  return results
}

const rfpDocumentService = {
  async upload(files) {
    // Handle both single file and multiple files
    if (Array.isArray(files)) {
      return await uploadMultiple(files)
    }
    
    // Single file upload
    await delay(300)
    
    const parsedData = await parseDocument(files)
    const newId = rfpDocuments.length > 0 ? Math.max(...rfpDocuments.map(d => d.Id)) + 1 : 1
    
    const document = {
      Id: newId,
      filename: files.name,
      uploadDate: new Date().toISOString(),
      content: parsedData.content,
      sections: parsedData.sections,
      requirements: parsedData.requirements,
      budgetInfo: parsedData.budgetInfo,
      status: 'parsed'
    }

    rfpDocuments.push(document)
    return { ...document }
  },

  async getAll() {
    await delay(300)
    return [...rfpDocuments]
  },

  async getById(id) {
    await delay(200)
    const document = rfpDocuments.find(d => d.Id === parseInt(id))
    if (!document) {
      throw new Error('RFP document not found')
    }
    return { ...document }
  },

  async delete(id) {
    await delay(200)
    const index = rfpDocuments.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error('RFP document not found')
    }
    const deleted = rfpDocuments.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default rfpDocumentService