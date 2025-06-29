
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QuizUploader } from '@/components/QuizUploader'
import { TestManager } from '@/components/TestManager'
import { PremiumAdmin } from '@/components/PremiumAdmin'
import { AdminLogin } from '@/components/AdminLogin'
import { Upload, List, Settings, PlayCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Index = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Quiz Forge</h1>
          <p className="text-gray-600">Upload, manage, and take quizzes with ease</p>
        </div>

        {/* Take Quiz Button */}
        <div className="flex justify-center mb-8">
          <Button 
            onClick={() => navigate('/quiz')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all"
          >
            <PlayCircle className="w-6 h-6" />
            Take Quiz
          </Button>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Quiz
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Manage Tests
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Premium Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <QuizUploader />
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            <TestManager />
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            {isAdminLoggedIn ? (
              <PremiumAdmin onLogout={() => setIsAdminLoggedIn(false)} />
            ) : (
              <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Index
