const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const cardSkeleton = (
    <div className="bg-white rounded-lg border border-surface-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-surface-200 rounded-lg" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-surface-200 rounded w-3/4" />
            <div className="h-3 bg-surface-200 rounded w-1/2" />
          </div>
        </div>
        <div className="h-5 bg-surface-200 rounded-full w-16" />
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-3 bg-surface-200 rounded w-full" />
        <div className="h-3 bg-surface-200 rounded w-2/3" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-surface-200 rounded flex-1" />
        <div className="h-8 bg-surface-200 rounded flex-1" />
        <div className="h-8 bg-surface-200 rounded w-8" />
      </div>
    </div>
  )

  const listSkeleton = (
    <div className="bg-white rounded-lg border border-surface-200 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-surface-200 rounded" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-surface-200 rounded w-3/4" />
          <div className="h-3 bg-surface-200 rounded w-1/2" />
        </div>
        <div className="h-5 bg-surface-200 rounded-full w-16" />
      </div>
    </div>
  )

  const formSkeleton = (
    <div className="space-y-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-surface-200 rounded w-24" />
          <div className="h-10 bg-surface-200 rounded w-full" />
        </div>
      ))}
    </div>
  )

  const getSkeleton = () => {
    switch (type) {
      case 'card': return cardSkeleton
      case 'list': return listSkeleton
      case 'form': return formSkeleton
      default: return cardSkeleton
    }
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {getSkeleton()}
        </div>
      ))}
    </div>
  )
}

export default SkeletonLoader