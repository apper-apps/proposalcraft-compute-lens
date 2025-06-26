import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const companyProfileService = {
  async get() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "updated_date" } }
        ],
        orderBy: [
          {
            fieldName: "updated_date",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      }
      
      const response = await apperClient.fetchRecords('company_profile', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data && response.data.length > 0 ? response.data[0] : null
    } catch (error) {
      console.error("Error fetching company profile:", error)
      throw error
    }
  },

  async save(profileData) {
    try {
      const apperClient = getApperClient()
      
      const data = {
        Name: profileData.name || profileData.companyName || 'Company Profile',
        updated_date: new Date().toISOString()
      }

      const createParams = {
        records: [data]
      }

      const response = await apperClient.createRecord('company_profile', createParams)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create company profile:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error('Failed to create company profile')
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
    } catch (error) {
      console.error("Error saving company profile:", error)
      throw error
    }
  },

  async update(updates) {
    try {
      // First get the existing profile to get its ID
      const existingProfile = await this.get()
      if (!existingProfile) {
        throw new Error('No company profile exists')
      }

      const apperClient = getApperClient()
      
      const data = {
        Id: existingProfile.Id,
        Name: updates.name || updates.companyName || existingProfile.Name,
        updated_date: new Date().toISOString()
      }

      const updateParams = {
        records: [data]
      }

      const response = await apperClient.updateRecord('company_profile', updateParams)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update company profile:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
          throw new Error('Failed to update company profile')
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data
        }
      }
    } catch (error) {
      console.error("Error updating company profile:", error)
      throw error
    }
  }
}

export default companyProfileService