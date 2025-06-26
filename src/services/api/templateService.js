import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const templateService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "created_date" } }
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
      
      const response = await apperClient.fetchRecords('template', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching templates:", error)
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
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "created_date" } }
        ]
      }
      
      const response = await apperClient.getRecordById('template', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching template with ID ${id}:`, error)
      throw error
    }
  },

  async create(templateData) {
    try {
      const apperClient = getApperClient()
      
      const data = {
        Name: templateData.name,
        description: templateData.description || '',
        category: templateData.category || 'General',
        created_date: new Date().toISOString()
      }

      const createParams = {
        records: [data]
      }

      const response = await apperClient.createRecord('template', createParams)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create template:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error('Failed to create template')
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
    } catch (error) {
      console.error("Error creating template:", error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      
      const data = {
        Id: parseInt(id),
        Name: updates.name,
        description: updates.description || '',
        category: updates.category || 'General'
      }

      const updateParams = {
        records: [data]
      }

      const response = await apperClient.updateRecord('template', updateParams)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update template:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error('Failed to update template')
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data
        }
      }
    } catch (error) {
      console.error("Error updating template:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('template', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete template:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
        
        return true
      }
    } catch (error) {
      console.error("Error deleting template:", error)
      throw error
    }
  }
}

export default templateService