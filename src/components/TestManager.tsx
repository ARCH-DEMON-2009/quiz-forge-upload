
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { supabase, Test } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Trash2, Eye } from 'lucide-react'

export const TestManager = () => {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

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
    } finally {
      setLoading(false)
    }
  }

  const deleteTest = async (testId: number, testTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${testTitle}"? This will also delete all associated questions.`)) {
      return
    }

    try {
      // Delete questions first (foreign key constraint)
      const { error: questionsError } = await supabase
        .from('questions')
        .delete()
        .eq('test_id', testId)

      if (questionsError) throw questionsError

      // Delete test
      const { error: testError } = await supabase
        .from('tests')
        .delete()
        .eq('id', testId)

      if (testError) throw testError

      toast({
        title: "Test deleted",
        description: `"${testTitle}" and all its questions have been deleted`
      })

      // Reload tests
      loadTests()
    } catch (error) {
      console.error('Error deleting test:', error)
      toast({
        title: "Failed to delete test",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    loadTests()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading tests...</div>
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Existing Tests ({tests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {tests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tests uploaded yet</p>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{test.title}</h3>
                  {test.description && (
                    <p className="text-gray-600 text-sm mt-1">{test.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {test.question_count} questions
                    </span>
                    <span>Created: {new Date(test.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTest(test.id, test.title)}
                  className="ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
