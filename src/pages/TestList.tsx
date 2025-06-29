
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Clock, Target, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface Test {
  id: string
  title: string
  description: string
  total_questions: number
  created_at: string
}

const TestList = () => {
  const { subject } = useParams<{ subject: string }>()
  const navigate = useNavigate()
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTests = async () => {
      try {
        console.log('Fetching tests for subject:', subject)
        
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        console.log('Fetched tests:', data)
        setTests(data || [])
      } catch (error) {
        console.error('Error fetching tests:', error)
        toast({
          title: "Failed to load tests",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [subject, toast])

  const getDifficultyColor = (questionCount: number) => {
    if (questionCount <= 10) return 'bg-green-100 text-green-800'
    if (questionCount <= 25) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getDifficultyLevel = (questionCount: number) => {
    if (questionCount <= 10) return 'Easy'
    if (questionCount <= 25) return 'Medium'
    return 'Hard'
  }

  const getEstimatedDuration = (questionCount: number) => {
    // Estimate 1.5 minutes per question
    return Math.max(15, Math.round(questionCount * 1.5))
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
        {tests.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tests available</h3>
            <p className="text-gray-500">Tests for {subject} haven't been uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => {
              const difficulty = getDifficultyLevel(test.total_questions)
              const duration = getEstimatedDuration(test.total_questions)
              
              return (
                <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {test.title}
                      </CardTitle>
                      <Badge className={getDifficultyColor(test.total_questions)}>
                        {difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      {test.description || 'Practice test with multiple choice questions'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{test.total_questions} Questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{duration} mins</span>
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TestList
