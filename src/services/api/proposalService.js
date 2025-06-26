const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let proposals = []

const proposalService = {
  async getAll() {
    await delay(300)
    return [...proposals]
  },

  async getById(id) {
    await delay(200)
    const proposal = proposals.find(p => p.Id === parseInt(id))
    if (!proposal) {
      throw new Error('Proposal not found')
    }
    return { ...proposal }
  },

  async create(proposalData) {
    await delay(500)
    const newId = proposals.length > 0 ? Math.max(...proposals.map(p => p.Id)) + 1 : 1
    
    const proposal = {
      Id: newId,
      rfpId: proposalData.rfpId,
      title: proposalData.title || `Proposal ${newId}`,
      sections: proposalData.sections || [],
      budget: proposalData.budget || { total: 0, items: [], currency: 'USD' },
      createdDate: new Date().toISOString(),
      status: 'draft'
    }

    proposals.push(proposal)
    return { ...proposal }
  },

  async update(id, updates) {
    await delay(300)
    const index = proposals.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Proposal not found')
    }
    
    proposals[index] = {
      ...proposals[index],
      ...updates,
      updatedDate: new Date().toISOString()
    }
    
    return { ...proposals[index] }
  },

  async delete(id) {
    await delay(200)
    const index = proposals.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Proposal not found')
    }
    const deleted = proposals.splice(index, 1)[0]
    return { ...deleted }
  },

  async generateFromRFP(rfpId, companyProfile) {
    await delay(1500) // Simulate AI processing time
    
    // Mock proposal generation based on RFP requirements
    const mockSections = [
      {
        Id: 1,
        title: "Executive Summary",
        content: `${companyProfile.name} is pleased to submit this proposal for your consideration. With ${companyProfile.yearsInBusiness || 5} years of experience in software development, we are confident in our ability to deliver exceptional results for your project.`,
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