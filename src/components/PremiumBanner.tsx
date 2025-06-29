import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Crown, Star, Zap, Shield } from 'lucide-react'
import { PaymentModal } from './PaymentModal'

export const PremiumBanner: React.FC = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleUpgrade = () => {
    setShowPaymentModal(true)
  }

  return (
    <>
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <Crown className="w-16 h-16 text-yellow-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Upgrade to Premium</h2>
                <p className="text-gray-600 text-lg">Your 3-day trial has expired. Unlock unlimited access!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Unlimited Tests</h3>
                  <p className="text-gray-600 text-sm">Access all subjects and tests</p>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Instant Results</h3>
                  <p className="text-gray-600 text-sm">Detailed analysis and feedback</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">Ad-Free Experience</h3>
                  <p className="text-gray-600 text-sm">Distraction-free learning</p>
                </div>
              </div>

              <div className="text-center">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-800">₹59</span>
                  <span className="text-gray-600 ml-2">for 30 days</span>
                </div>
                <Button 
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </>
  )
}
