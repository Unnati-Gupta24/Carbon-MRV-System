import { CheckCircle, AlertCircle } from 'lucide-react'

const Notification = ({ notification }) => {
  if (!notification) return null

  return (
    <div className={`notification ${notification.type}`}>
      <div className="flex items-center">
        {(notification.type === 'success' || notification.type === 'info') && (
          <CheckCircle className="h-5 w-5 mr-2 text-white" />
        )}
        {notification.type === 'error' && (
          <AlertCircle className="h-5 w-5 mr-2 text-white" />
        )}
        <span className="text-white">{notification.message}</span>
      </div>
    </div>
  )
}

export default Notification
