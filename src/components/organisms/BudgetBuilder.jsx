import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const BudgetBuilder = ({ budget, onUpdate }) => {
  const [items, setItems] = useState(budget?.items || [])
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    rate: 0
  })

  const addItem = () => {
    if (newItem.description.trim()) {
      const newId = items.length > 0 ? Math.max(...items.map(item => item.Id)) + 1 : 1
      const item = {
        Id: newId,
        description: newItem.description.trim(),
        quantity: parseInt(newItem.quantity) || 1,
        rate: parseFloat(newItem.rate) || 0,
        total: (parseInt(newItem.quantity) || 1) * (parseFloat(newItem.rate) || 0)
      }
      
      const updatedItems = [...items, item]
      setItems(updatedItems)
      setNewItem({ description: '', quantity: 1, rate: 0 })
      
      updateBudget(updatedItems)
    }
  }

  const removeItem = (id) => {
    const updatedItems = items.filter(item => item.Id !== id)
    setItems(updatedItems)
    updateBudget(updatedItems)
  }

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.Id === id) {
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updated.total = updated.quantity * updated.rate
        }
        return updated
      }
      return item
    })
    setItems(updatedItems)
    updateBudget(updatedItems)
  }

  const updateBudget = (updatedItems) => {
    const total = updatedItems.reduce((sum, item) => sum + item.total, 0)
    onUpdate({
      ...budget,
      items: updatedItems,
      total
    })
  }

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="bg-white rounded-lg border border-surface-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <ApperIcon name="Calculator" className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-secondary">Budget Builder</h3>
      </div>

      {/* Add New Item */}
      <div className="mb-6 p-4 bg-surface-50 rounded-lg">
        <h4 className="font-medium text-secondary mb-4">Add Budget Item</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Input
              placeholder="Item description"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
          </div>
          <Input
            type="number"
            placeholder="Qty"
            value={newItem.quantity}
            onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
            min="1"
          />
          <Input
            type="number"
            placeholder="Rate"
            value={newItem.rate}
            onChange={(e) => setNewItem(prev => ({ ...prev, rate: e.target.value }))}
            min="0"
            step="0.01"
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            variant="primary"
            size="sm"
            icon="Plus"
            onClick={addItem}
            disabled={!newItem.description.trim()}
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Budget Items */}
      <div className="space-y-3 mb-6">
        {items.length === 0 ? (
          <div className="text-center py-8 text-surface-500">
            <ApperIcon name="Package" className="w-8 h-8 mx-auto mb-2" />
            <p>No budget items yet. Add your first item above.</p>
          </div>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={item.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-surface-50 rounded-lg items-end"
            >
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-surface-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.Id, 'description', e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-white border border-surface-300 rounded focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.Id, 'quantity', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-2 py-1 text-sm bg-white border border-surface-300 rounded focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">
                  Rate ($)
                </label>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(item.Id, 'rate', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-2 py-1 text-sm bg-white border border-surface-300 rounded focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-medium text-surface-600 mb-1">
                    Total
                  </label>
                  <div className="text-sm font-semibold text-secondary">
                    ${item.total.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.Id)}
                  className="p-1 text-error hover:bg-error/10 rounded transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Total */}
      <div className="border-t border-surface-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-secondary">Total Budget:</span>
          <span className="text-2xl font-bold text-primary">
            ${totalAmount.toLocaleString()}
          </span>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Currency
            </label>
            <select
              value={budget?.currency || 'USD'}
              onChange={(e) => onUpdate({ ...budget, currency: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Validity Period
            </label>
            <select
              value={budget?.validityPeriod || '30 days'}
              onChange={(e) => onUpdate({ ...budget, validityPeriod: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="15 days">15 days</option>
              <option value="30 days">30 days</option>
              <option value="60 days">60 days</option>
              <option value="90 days">90 days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BudgetBuilder