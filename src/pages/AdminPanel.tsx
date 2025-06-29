
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QuizUploader } from '@/components/QuizUploader'
import { TestManager } from '@/components/TestManager'
import { PremiumAdmin } from '@/components/PremiumAdmin'
import { AdminLogin } from '@/components/AdminLogin'
import { Upload, List, Settings, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage quizzes, tests, and premium users</p>
          </div>
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

export default AdminPanel
