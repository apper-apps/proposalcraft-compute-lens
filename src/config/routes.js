import Upload from '@/components/pages/Upload'
import CompanyProfile from '@/components/pages/CompanyProfile'
import ActiveProposals from '@/components/pages/ActiveProposals'
import Templates from '@/components/pages/Templates'
import ProposalBuilder from '@/components/pages/ProposalBuilder'

export const routes = {
  upload: {
    id: 'upload',
    label: 'Upload RFP',
    path: '/',
    icon: 'Upload',
    component: Upload
  },
  companyProfile: {
    id: 'companyProfile',
    label: 'Company Profile',
    path: '/company-profile',
    icon: 'Building2',
    component: CompanyProfile
  },
  activeProposals: {
    id: 'activeProposals',
    label: 'Active Proposals',
    path: '/active-proposals',
    icon: 'FileText',
    component: ActiveProposals
  },
  templates: {
    id: 'templates',
    label: 'Templates',
    path: '/templates',
    icon: 'Layout',
    component: Templates
  },
  proposalBuilder: {
    id: 'proposalBuilder',
    label: 'Proposal Builder',
    path: '/proposal-builder/:id',
    icon: 'Edit',
    component: ProposalBuilder
  }
}

export const routeArray = Object.values(routes)
export default routes