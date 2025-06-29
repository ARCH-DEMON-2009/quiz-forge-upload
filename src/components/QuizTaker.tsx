
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase, Test, Question } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { PlayCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react'

export const QuizTaker = () => {
  const [tests, setTests] = useState<Test[]>([])
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadTests()
  }, [])

  const loadTests = async () => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTests(data || [])
    } catch (error) {
      console.error('Error loading tests:', error)
      toast({
        title: "Failed to load tests",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    }
  }

  const startQuiz = async (testId: string) => {
    setLoading(true)
    try {
      const { data: questionsData, error } = await supabase
        .from('questions')
        .select('*')
        .eq('test_id', testId)

      if (error) throw error

      const test = tests.find(t => t.id === testId)
      setSelectedTest(test || null)
      setQuestions(questionsData || [])
      setCurrentQuestion(0)
      setAnswers({})
      setShowResults(false)
      setScore(0)
    } catch (error) {
      console.error('Error loading questions:', error)
      toast({
        title: "Failed to load questions",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitQuiz = () => {
    let correctAnswers = 0
    questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctAnswers++
      }
    })
    
    setScore(correctAnswers)
    setShowResults(true)
    
    toast({
      title: "Quiz completed!",
      description: `You scored ${correctAnswers} out of ${questions.length}`
    })
  }

  const resetQuiz = () => {
    setSelectedTest(null)
    setQuestions([])
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setScore(0)
  }

  if (loading) {
    return <div className="text-center py-8">Loading quiz...</div>
  }

  if (showResults) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">{selectedTest?.title}</h2>
            <p className="text-xl mb-4">
              Your Score: <span className="font-bold text-green-600">{score}</span> / {questions.length}
            </p>
            <p className="text-lg mb-6">
              Percentage: <span className="font-bold">{Math.round((score / questions.length) * 100)}%</span>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Question Review:</h3>
            {questions.map((question, index) => {
              const userAnswer = answers[question.id]
              const isCorrect = userAnswer === question.correct
              
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">Q{index + 1}. Question {index + 1}</p>
                      {question.image && (
                        <img src={question.image} alt="Question" className="mb-2 max-w-md rounded" />
                      )}
                      <div className="space-y-1 text-sm">
                        <p>Your answer: <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{userAnswer || 'Not answered'}</span></p>
                        <p>Correct answer: <span className="text-green-600 font-medium">{question.correct}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center">
            <Button onClick={resetQuiz} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Take Another Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (selectedTest && questions.length > 0) {
    const question = questions[currentQuestion]
    
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{selectedTest.title}</CardTitle>
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Question {currentQuestion + 1}</h3>
            {question.image && (
              <img 
                src={question.image} 
                alt="Question" 
                className="mb-4 max-w-full h-auto rounded border"
              />
            )}
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswer(question.id, option)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            {currentQuestion === questions.length - 1 ? (
              <Button onClick={submitQuiz}>
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="w-6 h-6" />
          Take a Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No quizzes available</p>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select a Quiz:</label>
              <Select onValueChange={(value) => startQuiz(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a quiz to start" />
                </SelectTrigger>
                <SelectContent>
                  {tests.map((test) => (
                    <SelectItem key={test.id} value={test.id}>
                      <div>
                        <p className="font-medium">{test.title}</p>
                        <p className="text-xs text-gray-500">{test.total_questions} questions</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
