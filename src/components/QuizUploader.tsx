import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface ParsedQuestion {
  id: number
  image: string
  options: string[]
  correct: string
  subject: string
  type: string
}

export const QuizUploader = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showTitleDialog, setShowTitleDialog] = useState(false)
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { toast } = useToast()

  const parseQuizFile = (content: string): ParsedQuestion[] => {
    try {
      // Extract arrays from the JavaScript content
      const rawIdsMatch = content.match(/const rawIds = \[(.*?)\];/s)
      const correctAnswersMatch = content.match(/const correctAnswers = \[(.*?)\];/s)
      
      if (!rawIdsMatch || !correctAnswersMatch) {
        throw new Error('Invalid file format: Missing rawIds or correctAnswers')
      }

      // Parse the arrays
      const rawIds = rawIdsMatch[1]
        .split(',')
        .map(id => id.trim().replace(/['"]/g, ''))
        .filter(id => id.length > 0)

      const correctAnswers = correctAnswersMatch[1]
        .split(',')
        .map(answer => answer.trim().replace(/['"]/g, ''))
        .filter(answer => answer.length > 0)

      if (rawIds.length !== correctAnswers.length) {
        throw new Error('Mismatch between rawIds and correctAnswers length')
      }

      // Generate questions using the same logic
      const questions = rawIds.map((id, index) => {
        const subject = index < 25 ? "Physics" : index < 50 ? "Chemistry" : "Maths"
        const idx = index % 25
        const type = idx >= 20 ? "integer" : "mcq"
        
        return {
          id: index + 1,
          image: `https://static.pw.live/5b09189f7285894d9130ccd0/${id}.png`,
          options: type === "mcq" ? ["A", "B", "C", "D"] : [],
          correct: correctAnswers[index],
          subject,
          type,
        }
      })

      return questions
    } catch (error) {
      throw new Error(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.js')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JavaScript (.js) file",
        variant: "destructive"
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const questions = parseQuizFile(content)
        setParsedQuestions(questions)
        setShowTitleDialog(true)
        console.log(`Parsed ${questions.length} questions successfully`)
      } catch (error) {
        toast({
          title: "File parsing failed",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        })
      }
    }
    reader.readAsText(selectedFile)
    setFile(selectedFile)
  }

  const uploadTest = async () => {
    if (!title.trim() || parsedQuestions.length === 0) {
      toast({
        title: "Missing information",
        description: "Please provide a title and ensure questions are parsed",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    try {
      // Insert test record with correct column name
      const { data: testData, error: testError } = await supabase
        .from('tests')
        .insert({
          title: title.trim(),
          description: description.trim(),
          total_questions: parsedQuestions.length
        })
        .select()
        .single()

      if (testError) throw testError

      // Insert questions
      const questionsToInsert = parsedQuestions.map(q => ({
        test_id: testData.id,
        image: q.image,
        options: q.options,
        correct: q.correct,
        subject: q.subject,
        type: q.type
      }))

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert)

      if (questionsError) throw questionsError

      toast({
        title: "Upload successful",
        description: `Test "${title}" uploaded with ${parsedQuestions.length} questions`
      })

      // Reset form
      setTitle('')
      setDescription('')
      setParsedQuestions([])
      setShowTitleDialog(false)
      setFile(null)
      
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Quiz Uploader</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="quiz-file">Select Quiz JavaScript File</Label>
          <Input
            id="quiz-file"
            type="file"
            accept=".js"
            onChange={handleFileUpload}
            className="mt-2"
          />
        </div>

        {parsedQuestions.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              ✅ Successfully parsed {parsedQuestions.length} questions
            </p>
          </div>
        )}

        {showTitleDialog && (
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Test Details</h3>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter test title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter test description (optional)"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={uploadTest} 
                disabled={isUploading || !title.trim()}
                className="flex-1"
              >
                {isUploading ? 'Uploading...' : 'Upload Test'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowTitleDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
