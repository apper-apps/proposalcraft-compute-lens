import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import companyProfileService from '@/services/api/companyProfileService'

const CompanyProfileForm = ({ profile, onSave }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    website: profile?.website || '',
    description: profile?.description || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    address: profile?.address || '',
    yearsInBusiness: profile?.yearsInBusiness || '',
    employeeCount: profile?.employeeCount || '',
    capabilities: profile?.capabilities || [],
    certifications: profile?.certifications || [],
    pastProjects: profile?.pastProjects || [],
    teamMembers: profile?.teamMembers || []
  })
  
  const [loading, setLoading] = useState(false)
  const [newCapability, setNewCapability] = useState('')
  const [newCertification, setNewCertification] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addCapability = () => {
    if (newCapability.trim()) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, newCapability.trim()]
      }))
      setNewCapability('')
    }
  }

  const removeCapability = (index) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== index)
    }))
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }))
      setNewCertification('')
    }
  }

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const savedProfile = await companyProfileService.save(formData)
      toast.success('Company profile saved successfully!')
      onSave?.(savedProfile)
    } catch (error) {
      toast.error('Failed to save company profile')
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-surface-200 p-6"
      >
        <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
          <ApperIcon name="Building2" className="w-5 h-5 text-primary" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter company name"
            required
          />
          
          <Input
            label="Website"
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://example.com"
          />
          
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="contact@company.com"
          />
          
          <Input
            label="Years in Business"
            type="number"
            value={formData.yearsInBusiness}
            onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
            placeholder="5"
          />
          
          <Input
            label="Employee Count"
            type="number"
            value={formData.employeeCount}
            onChange={(e) => handleInputChange('employeeCount', e.target.value)}
            placeholder="25"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-secondary mb-2">
            Company Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of your company and services..."
            rows={4}
            className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-secondary mb-2">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Company address..."
            rows={2}
            className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </motion.div>

      {/* Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg border border-surface-200 p-6"
      >
        <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
          <ApperIcon name="Settings" className="w-5 h-5 text-primary" />
          Core Capabilities
        </h3>
        
        <div className="flex gap-2 mb-4">
          <Input
            value={newCapability}
            onChange={(e) => setNewCapability(e.target.value)}
            placeholder="Add a capability..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
          />
          <Button
            type="button"
            variant="secondary"
            icon="Plus"
            onClick={addCapability}
            disabled={!newCapability.trim()}
          >
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {capability}
              <button
                type="button"
                onClick={() => removeCapability(index)}
                className="text-primary/60 hover:text-primary"
              >
                <ApperIcon name="X" className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg border border-surface-200 p-6"
      >
        <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
          <ApperIcon name="Award" className="w-5 h-5 text-primary" />
          Certifications & Awards
        </h3>
        
        <div className="flex gap-2 mb-4">
          <Input
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            placeholder="Add a certification..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
          />
          <Button
            type="button"
            variant="secondary"
            icon="Plus"
            onClick={addCertification}
            disabled={!newCertification.trim()}
          >
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {cert}
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="text-accent/60 hover:text-accent"
              >
                <ApperIcon name="X" className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon="Save"
        >
          Save Profile
        </Button>
      </div>
    </form>
  )
}

export default CompanyProfileForm