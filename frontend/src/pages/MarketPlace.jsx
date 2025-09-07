import { Award } from 'lucide-react'

const Marketplace = () => {
  return (
    <div className="cyber-card">
      <h3 className="text-lg font-bold text-white mb-4">Carbon Credits Marketplace</h3>
      <div className="text-center text-white">
        <Award className="h-16 w-16 text-cyan-300 mx-auto mb-4" />
        <p className="text-lg mb-2">Marketplace Coming Soon</p>
        <p className="text-cyan-300 text-sm">
          Trade verified blue carbon credits with buyers worldwide
        </p>
      </div>
    </div>
  )
}

export default Marketplace
