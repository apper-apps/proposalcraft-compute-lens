const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let templates = []

const templateService = {
  async getAll() {
    await delay(300)
    return [...templates]
  },

  async getById(id) {
    await delay(200)
    const template = templates.find(t => t.Id === parseInt(id))
    if (!template) {
      throw new Error('Template not found')
    }
    return { ...template }
  },

  async create(templateData) {
    await delay(400)
    const newId = templates.length > 0 ? Math.max(...templates.map(t => t.Id)) + 1 : 1
    
    const template = {
      Id: newId,
      name: templateData.name,
      description: templateData.description,
      sections: templateData.sections || [],
      createdDate: new Date().toISOString(),
      category: templateData.category || 'General'
    }

    templates.push(template)
    return { ...template }
  },

  async update(id, updates) {
    await delay(300)
    const index = templates.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Template not found')
    }
    
    templates[index] = {
      ...templates[index],
      ...updates,
      updatedDate: new Date().toISOString()
    }
    
    return { ...templates[index] }
  },

  async delete(id) {
    await delay(200)
    const index = templates.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Template not found')
    }
    const deleted = templates.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default templateService