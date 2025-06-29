
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Crown, Clock, CheckCircle } from 'lucide-react'

interface TrialStatusProps {
  status: 'active' | 'expired' | 'premium' | 'loading'
}

export const TrialStatus: React.FC<TrialStatusProps> = ({ status }) => {
  if (status === 'loading') return null
  
  const getStatusDisplay = () => {
    switch (status) {
      case 'premium':
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg px-4 py-2">
            <Crown className="w-5 h-5 mr-2" />
            Premium Member
          </Badge>
        )
      case 'active':
        return (
          <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white text-lg px-4 py-2">
            <CheckCircle className="w-5 h-5 mr-2" />
            3-Day Trial Active
          </Badge>
        )
      case 'expired':
        return (
          <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-white text-lg px-4 py-2">
            <Clock className="w-5 h-5 mr-2" />
            Trial Expired - Upgrade to Premium
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex justify-center">
      {getStatusDisplay()}
    </div>
  )
}
