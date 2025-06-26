import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import CompanyProfileForm from '@/components/organisms/CompanyProfileForm'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import companyProfileService from '@/services/api/companyProfileService'

const CompanyProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    setError(null)
try {
      const result = await companyProfileService.get()
      setProfile(result)
    } catch (err) {
      setError(err.message || 'Failed to load company profile')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSave = (savedProfile) => {
    setProfile(savedProfile)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">Company Profile</h1>
          <p className="text-surface-600">Manage your company information for proposal generation</p>
        </div>
        <SkeletonLoader count={1} type="form" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">Company Profile</h1>
          <p className="text-surface-600">Manage your company information for proposal generation</p>
        </div>
        <ErrorState 
          message={error}
          onRetry={loadProfile}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-display font-bold text-secondary mb-2">
          Company Profile
        </h1>
        <p className="text-surface-600 max-w-2xl mx-auto">
          Complete your company profile to generate personalized proposals. 
          This information will be used to automatically fill proposal sections with your company details.
        </p>
      </motion.div>

      {/* Profile Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-50 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            profile ? 'bg-success/10' : 'bg-warning/10'
          }`}>
            <ApperIcon 
              name={profile ? "CheckCircle" : "AlertCircle"} 
              className={`w-5 h-5 ${profile ? 'text-success' : 'text-warning'}`} 
            />
          </div>
          <div>
            <h3 className="font-semibold text-secondary">
              Profile Status: {profile ? 'Complete' : 'Incomplete'}
            </h3>
            <p className="text-sm text-surface-600">
              {profile 
                ? 'Your company profile is ready for proposal generation'
                : 'Complete your profile to enable automatic proposal generation'
              }
            </p>
          </div>
        </div>

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-surface-200">
            <div className="text-center">
<div className="text-2xl font-bold text-primary">
                {profile.Tags ? profile.Tags.split(',').length : 0}
              </div>
              <div className="text-sm text-surface-600">Capabilities</div>
            </div>
            <div className="text-center">
<div className="text-2xl font-bold text-accent">
                {profile.Name ? 1 : 0}
              </div>
<div className="text-sm text-surface-600">Profile Data</div>
            </div>
            <div className="text-center">
<div className="text-2xl font-bold text-info">
                {profile.updated_date ? new Date(profile.updated_date).getFullYear() : new Date().getFullYear()}
              </div>
<div className="text-sm text-surface-600">Last Updated</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CompanyProfileForm 
          profile={profile}
          onSave={handleProfileSave}
        />
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-info/5 border border-info/20 rounded-xl p-6"
      >
        <div className="flex items-start gap-3">
          <ApperIcon name="Lightbulb" className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary mb-2">Profile Tips</h3>
            <ul className="space-y-1 text-sm text-surface-600">
              <li>• Include specific capabilities that match your target RFPs</li>
              <li>• Add relevant certifications to strengthen your proposals</li>
              <li>• Keep your company description concise but compelling</li>
              <li>• Update your profile regularly to reflect new capabilities</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CompanyProfile