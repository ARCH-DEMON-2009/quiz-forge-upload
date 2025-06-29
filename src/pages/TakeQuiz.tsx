
import React from 'react'
import { QuizTaker } from '@/components/QuizTaker'
import { Brain, Sparkles, BookOpen, Target } from 'lucide-react'

const TakeQuiz = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Brain className="w-20 h-20 text-white animate-pulse" />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-bounce" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Quiz Challenge
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Test your knowledge with our comprehensive quiz system. Challenge yourself and track your progress!
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/20 rounded-full blur-lg"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Multiple Subjects</h3>
            <p className="text-gray-600">Physics, Chemistry, Mathematics and more topics to explore</p>
          </div>
          
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Results</h3>
            <p className="text-gray-600">Get immediate feedback and detailed score analysis</p>
          </div>
          
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Interactive Experience</h3>
            <p className="text-gray-600">Engaging questions with images and multiple formats</p>
          </div>
        </div>

        {/* Quiz Component */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl transform rotate-1"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl border border-white/50 p-8">
            <QuizTaker />
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-100 to-transparent"></div>
        <div className="relative py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Challenge Yourself?</h2>
            <p className="text-gray-600 text-lg">Select a quiz above and start your learning journey today!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TakeQuiz
