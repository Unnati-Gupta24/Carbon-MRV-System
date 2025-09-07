import { Globe, Leaf, Users } from 'lucide-react'

const StatsCards = ({ stats, projects }) => {
  const statsList = [
    { label: 'Total Projects', value: stats.totalProjects || '0', icon: Globe },
    { label: 'Total Credits', value: stats.totalCarbonCredits || '0', icon: Leaf },
    { label: 'My Projects', value: projects.length || '0', icon: Users },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {statsList.map((stat, index) => (
        <div key={index} className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-white">{stat.label}</p>
              <p className="stats-number">{stat.value}</p>
            </div>
            <stat.icon className="h-8 w-8 text-cyan-300" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
