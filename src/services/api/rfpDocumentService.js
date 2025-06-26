const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let rfpDocuments = []

// Simulate file parsing service
const parseDocument = async (file) => {
  await delay(2000) // Simulate processing time
  
  // Mock extracted content based on file type
  const mockSections = [
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

  const mockRequirements = [
    "Minimum 5 years software development experience",
    "Portfolio of similar projects",
    "Technical architecture documentation",
    "Detailed project timeline",
    "Itemized budget breakdown"
  ]

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
  async upload(file) {
    await delay(300)
    
    const parsedData = await parseDocument(file)
    const newId = rfpDocuments.length > 0 ? Math.max(...rfpDocuments.map(d => d.Id)) + 1 : 1
    
    const document = {
      Id: newId,
      filename: file.name,
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