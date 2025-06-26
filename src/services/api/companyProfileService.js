const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let companyProfile = null

const companyProfileService = {
  async get() {
    await delay(200)
    return companyProfile ? { ...companyProfile } : null
  },

  async save(profileData) {
    await delay(400)
    companyProfile = {
      ...profileData,
      updatedDate: new Date().toISOString()
    }
    return { ...companyProfile }
  },

  async update(updates) {
    await delay(300)
    if (!companyProfile) {
      throw new Error('No company profile exists')
    }
    companyProfile = {
      ...companyProfile,
      ...updates,
      updatedDate: new Date().toISOString()
    }
    return { ...companyProfile }
  }
}

export default companyProfileService