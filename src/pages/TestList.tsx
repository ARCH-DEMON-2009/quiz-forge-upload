
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Clock, Target, BookOpen } from 'lucide-react'

interface Test {
  id: string
  title: string
  description: string
  questions_count: number
  duration: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  subject: string
}

const TestList = () => {
  const { subject } = useParams<{ subject: string }>()
  const navigate = useNavigate()
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual Supabase call
    const mockTests: Test[] = [
      {
        id: '1',
        title: `${subject?.charAt(0).toUpperCase()}${subject?.slice(1)} Basics`,
        description: 'Fundamental concepts and basic problems',
        questions_count: 25,
        duration: 30,
        difficulty: 'Easy',
        subject: subject || ''
      },
      {
        id: '2',
        title: `Advanced ${subject?.charAt(0).toUpperCase()}${subject?.slice(1)}`,
        description: 'Complex problems and advanced topics',
        questions_count: 40,
        duration: 60,
        difficulty: 'Hard',
        subject: subject || ''
      },
      {
        id: '3',
        title: `${subject?.charAt(0).toUpperCase()}${subject?.slice(1)} Practice Set`,
        description: 'Mixed difficulty practice questions',
        questions_count: 30,
        duration: 45,
        difficulty: 'Medium',
        subject: subject || ''
      }
    ]
    
    setTimeout(() => {
      setTests(mockTests)
      setLoading(false)
    }, 1000)
  }, [subject])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubjectIcon = () => {
    switch (subject) {
      case 'physics': return BookOpen
      case 'chemistry': return '🧪'
      case 'mathematics': return '📐'
      default: return BookOpen
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 capitalize">
                {subject} Tests
              </h1>
              <p className="text-gray-600">Choose a test to begin your practice session</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {test.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(test.difficulty)}>
                    {test.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  {test.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{test.questions_count} Questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{test.duration} mins</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate(`/quiz/${test.id}`)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 rounded-full transition-all group-hover:scale-105"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Test
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestList
