import { useState, useContext } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { routes } from '@/config/routes'
import { AuthContext } from './App'
const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)

  const navigationItems = Object.values(routes).filter(route => 
    !route.path.includes(':') // Filter out dynamic routes from navigation
  )

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Mobile Header */}
      <header className="lg:hidden flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold text-secondary">ProposalCraft</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon="LogOut"
            onClick={handleLogout}
            className="text-surface-600 hover:text-error"
          />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-surface-600 hover:text-secondary transition-colors"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface-50 border-r border-surface-200 flex-col z-40">
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-secondary">ProposalCraft</h1>
                <p className="text-sm text-surface-600">Intelligent Proposals</p>
              </div>
            </div>
            {user && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-surface-200">
                <div className="text-sm font-medium text-secondary truncate">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-surface-600 truncate">
                  {user.emailAddress}
                </div>
              </div>
            )}
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-700 hover:bg-surface-100 hover:text-secondary'
                  }`
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-surface-200">
            <Button
              variant="ghost"
              icon="LogOut"
              onClick={handleLogout}
              className="w-full justify-start text-surface-600 hover:text-error hover:bg-error/10"
            >
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={closeMobileMenu}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-80 bg-surface-50 border-r border-surface-200 z-50"
              >
<nav className="p-4 space-y-2">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-surface-700 hover:bg-surface-100 hover:text-secondary'
                        }`
                      }
                    >
                      <ApperIcon name={item.icon} className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                  <div className="pt-4 border-t border-surface-200 mt-4">
                    <Button
                      variant="ghost"
                      icon="LogOut"
                      onClick={() => {
                        closeMobileMenu()
                        handleLogout()
                      }}
                      className="w-full justify-start text-surface-600 hover:text-error hover:bg-error/10"
                    >
                      Sign Out
                    </Button>
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout