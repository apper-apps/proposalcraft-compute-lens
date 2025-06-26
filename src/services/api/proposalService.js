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

const proposalService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "rfp_id" } },
          { field: { Name: "title" } },
          { field: { Name: "budget" } },
          { field: { Name: "created_date" } },
          { field: { Name: "status" } }
        ],
        orderBy: [
          {
            fieldName: "created_date",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      }
      
      const response = await apperClient.fetchRecords('proposal', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching proposals:", error)
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
          { field: { Name: "rfp_id" } },
          { field: { Name: "title" } },
          { field: { Name: "budget" } },
          { field: { Name: "created_date" } },
          { field: { Name: "status" } }
        ]
      }
      
      const response = await apperClient.getRecordById('proposal', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching proposal with ID ${id}:`, error)
      throw error
    }
  },

  async create(proposalData) {
    try {
      const apperClient = getApperClient()
      
// Validate and truncate budget field to meet 255 character database limit
      function validateBudgetField(budget) {
        let budgetString;
        
        if (typeof budget === 'string') {
          budgetString = budget;
        } else {
          budgetString = JSON.stringify(budget || { total: 0, items: [], currency: 'USD' });
        }
        
        // Check if budget exceeds 255 character limit
        if (budgetString.length > 255) {
          // Try to create a summary version
          let budgetObj;
          try {
            budgetObj = typeof budget === 'string' ? JSON.parse(budget) : budget;
          } catch (e) {
            // If parsing fails, truncate the string
            return budgetString.substring(0, 250) + '...';
          }
          
          // Create summary with just total and currency
          const summary = {
            total: budgetObj.total || 0,
            currency: budgetObj.currency || 'USD',
            itemCount: (budgetObj.items && budgetObj.items.length) || 0
          };
          
          const summaryString = JSON.stringify(summary);
          
          // If even the summary is too long, fallback to basic info
          if (summaryString.length > 255) {
            return `{"total":${budgetObj.total || 0},"currency":"${budgetObj.currency || 'USD'}"}`;
          }
          
          return summaryString;
        }
        
        return budgetString;
      }

      const data = {
        Name: proposalData.title || `Proposal ${Date.now()}`,
        rfp_id: proposalData.rfpId || proposalData.rfp_id,
        title: proposalData.title || `Proposal ${Date.now()}`,
        budget: validateBudgetField(proposalData.budget),
        created_date: new Date().toISOString(),
        status: proposalData.status || 'draft'
      }

      const createParams = {
        records: [data]
      }

      const response = await apperClient.createRecord('proposal', createParams)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create proposal:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error('Failed to create proposal')
        }
        
        if (successfulRecords.length > 0) {
          const createdProposal = successfulRecords[0].data
          // Add sections for compatibility if they were provided
          if (proposalData.sections) {
            createdProposal.sections = proposalData.sections
          }
          return createdProposal
        }
      }
    } catch (error) {
      console.error("Error creating proposal:", error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      
const data = {
        Id: parseInt(id),
        title: updates.title,
        budget: validateBudgetField(updates.budget),
        status: updates.status
      }

      // Only include fields that are being updated
      Object.keys(data).forEach(key => {
        if (data[key] === undefined) {
          delete data[key]
        }
      })

      const updateParams = {
        records: [data]
      }

      const response = await apperClient.updateRecord('proposal', updateParams)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update proposal:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error('Failed to update proposal')
        }
        
        if (successfulUpdates.length > 0) {
          const updatedProposal = successfulUpdates[0].data
          // Preserve sections if they were provided in updates
          if (updates.sections) {
            updatedProposal.sections = updates.sections
          }
          return updatedProposal
        }
      }
    } catch (error) {
      console.error("Error updating proposal:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('proposal', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete proposal:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        
        return true
      }
    } catch (error) {
      console.error("Error deleting proposal:", error)
      throw error
    }
  },

  async generateFromRFP(rfpId, companyProfile) {
    await delay(1500) // Simulate AI processing time
    
    // Mock proposal generation based on RFP requirements
    const mockSections = [
      {
        Id: 1,
        title: "Executive Summary",
        content: `${companyProfile.name || 'Our company'} is pleased to submit this proposal for your consideration. With ${companyProfile.yearsInBusiness || 5} years of experience in software development, we are confident in our ability to deliver exceptional results for your project.`,
        order: 1,
        completed: true
      },
      {
        Id: 2,
        title: "Technical Approach",
        content: `Our technical approach leverages our core capabilities in ${companyProfile.capabilities?.join(', ') || 'software development, system integration, and project management'}. We propose a phased implementation strategy that ensures minimal disruption to your current operations.`,
        order: 2,
        completed: true
      },
      {
        Id: 3,
        title: "Project Timeline",
        content: "Phase 1: Requirements Analysis (2 weeks)\nPhase 2: System Design (3 weeks)\nPhase 3: Development (16 weeks)\nPhase 4: Testing & Deployment (3 weeks)\nTotal Duration: 24 weeks",
        order: 3,
        completed: true
      },
      {
        Id: 4,
        title: "Budget Proposal",
        content: "Detailed budget breakdown aligned with project phases and deliverables.",
        order: 4,
        completed: false
      }
    ]

    const mockBudget = {
      total: 75000,
      currency: 'USD',
      validityPeriod: '30 days',
      items: [
        { Id: 1, description: 'Requirements Analysis & Design', quantity: 1, rate: 15000, total: 15000 },
        { Id: 2, description: 'Development & Implementation', quantity: 1, rate: 45000, total: 45000 },
        { Id: 3, description: 'Testing & Quality Assurance', quantity: 1, rate: 10000, total: 10000 },
        { Id: 4, description: 'Deployment & Training', quantity: 1, rate: 5000, total: 5000 }
      ]
    }

    const newProposal = {
      rfpId: parseInt(rfpId),
      title: `Proposal for RFP Document #${rfpId}`,
      sections: mockSections,
      budget: mockBudget,
      status: 'generated'
    }

    return await this.create(newProposal)
  }
}

export default proposalService