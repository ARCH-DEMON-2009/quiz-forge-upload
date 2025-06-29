
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Beaker, Calculator, Crown, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TrialStatus } from '@/components/TrialStatus'
import { PremiumBanner } from '@/components/PremiumBanner'
import { checkTrialStatus, TrialStatus as TrialStatusType } from '@/services/trialService'

const Index = () => {
  const navigate = useNavigate()
  const [trialStatus, setTrialStatus] = useState<TrialStatusType>('loading')

  useEffect(() => {
    const loadTrialStatus = async () => {
      const status = await checkTrialStatus()
      setTrialStatus(status)
    }
    
    loadTrialStatus()
  }, [])

  const subjects = [
    {
      id: 'physics',
      name: 'Physics',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      description: 'Mechanics, Thermodynamics, Electromagnetism'
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: Beaker,
      color: 'from-green-500 to-green-600',
      description: 'Organic, Inorganic, Physical Chemistry'
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      color: 'from-purple-500 to-purple-600',
      description: 'Algebra, Calculus, Geometry, Statistics'
    }
  ]

  const handleSubjectClick = (subjectId: string) => {
    if (trialStatus === 'expired') {
      return // Prevent navigation - banner will show payment option
    }
    navigate(`/tests/${subjectId}`)
  }

  if (trialStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Test Sagar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Test Sagar
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-6">
              Master Physics, Chemistry & Mathematics with comprehensive practice tests
            </p>
            <TrialStatus status={trialStatus} />
          </div>
        </div>
      </div>

      {/* Premium Banner */}
      {trialStatus === 'expired' && <PremiumBanner />}

      {/* Subjects Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Subject</h2>
          <p className="text-gray-600 text-lg">Select a subject to start practicing with our comprehensive test series</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subjects.map((subject) => {
            const Icon = subject.icon
            const isDisabled = trialStatus === 'expired'
            
            return (
              <Card 
                key={subject.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 shadow-lg ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => handleSubjectClick(subject.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 bg-gradient-to-r ${subject.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">{subject.name}</CardTitle>
                  <CardDescription className="text-gray-600">{subject.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className={`w-full bg-gradient-to-r ${subject.color} hover:opacity-90 text-white font-semibold py-3 rounded-full transition-all`}
                    disabled={isDisabled}
                  >
                    {isDisabled ? 'Premium Required' : 'Start Practice'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Test Sagar?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Comprehensive Coverage</h3>
              <p className="text-gray-600">Complete syllabus coverage for all three subjects</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Results</h3>
              <p className="text-gray-600">Get immediate feedback and detailed analysis</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Premium Experience</h3>
              <p className="text-gray-600">Ad-free learning with unlimited access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
