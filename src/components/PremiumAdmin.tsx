
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { supabase, PremiumUser } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Trash2, Plus, Calendar } from 'lucide-react'

interface PremiumAdminProps {
  onLogout: () => void
}

export const PremiumAdmin = ({ onLogout }: PremiumAdminProps) => {
  const [users, setUsers] = useState<PremiumUser[]>([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ name: '', device: '', days: 30 })
  const [extendDays, setExtendDays] = useState<{ [key: string]: number }>({})
  const { toast } = useToast()

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_users')
        .select('*')
        .order('purchased_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
      toast({
        title: "Failed to load users",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addPremiumUser = async () => {
    if (!newUser.name.trim() || !newUser.device.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both name and device",
        variant: "destructive"
      })
      return
    }

    try {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + newUser.days)

      const { error } = await supabase
        .from('premium_users')
        .insert({
          name: newUser.name.trim(),
          device_id: newUser.device.trim(),
          expires_at: expiresAt.toISOString()
        })

      if (error) throw error

      toast({
        title: "Premium user added",
        description: `${newUser.name} added with ${newUser.days} days premium`
      })

      setNewUser({ name: '', device: '', days: 30 })
      loadUsers()
    } catch (error) {
      console.error('Error adding user:', error)
      toast({
        title: "Failed to add user",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    }
  }

  const extendPremium = async (userId: string, userName: string) => {
    const days = extendDays[userId] || 30
    
    try {
      const { data: user, error: fetchError } = await supabase
        .from('premium_users')
        .select('expires_at')
        .eq('id', userId)
        .single()

      if (fetchError) throw fetchError

      const currentExpiry = new Date(user.expires_at)
      const now = new Date()
      const newExpiry = new Date(Math.max(currentExpiry.getTime(), now.getTime()))
      newExpiry.setDate(newExpiry.getDate() + days)

      const { error } = await supabase
        .from('premium_users')
        .update({ expires_at: newExpiry.toISOString() })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Premium extended",
        description: `${userName}'s premium extended by ${days} days`
      })

      // Clear the extend days input for this user
      setExtendDays(prev => ({ ...prev, [userId]: 30 }))
      loadUsers()
    } catch (error) {
      console.error('Error extending premium:', error)
      toast({
        title: "Failed to extend premium",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    }
  }

  const deleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) return

    try {
      const { error } = await supabase
        .from('premium_users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "User deleted",
        description: `${userName} has been removed`
      })

      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Failed to delete user",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Premium Admin Panel</h1>
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>

      {/* Add New Premium User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Premium User
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="User name"
              />
            </div>
            <div>
              <Label htmlFor="device">Device</Label>
              <Input
                id="device"
                value={newUser.device}
                onChange={(e) => setNewUser({ ...newUser, device: e.target.value })}
                placeholder="Device identifier"
              />
            </div>
            <div>
              <Label htmlFor="days">Premium Days</Label>
              <Input
                id="days"
                type="number"
                value={newUser.days}
                onChange={(e) => setNewUser({ ...newUser, days: parseInt(e.target.value) || 30 })}
                min="1"
              />
            </div>
          </div>
          <Button onClick={addPremiumUser}>Add Premium User</Button>
        </CardContent>
      </Card>

      {/* Existing Premium Users */}
      <Card>
        <CardHeader>
          <CardTitle>Premium Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No premium users found</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      {isExpired(user.expires_at) && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">Device: {user.device_id}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      Expires: {new Date(user.expires_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Days"
                      value={extendDays[user.id] || 30}
                      onChange={(e) => setExtendDays({ 
                        ...extendDays, 
                        [user.id]: parseInt(e.target.value) || 30 
                      })}
                      className="w-20"
                      min="1"
                    />
                    <Button
                      size="sm"
                      onClick={() => extendPremium(user.id, user.name)}
                    >
                      Extend
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteUser(user.id, user.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
