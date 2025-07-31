'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Upload, Trash2, Star, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppHeader } from '@/components/layout/app-header'

interface UserDocument {
  id: string
  name: string
  size: number
  type: string
  category: string | null
  custom_label: string | null
  description: string | null
  is_favorite: boolean
  upload_date: string
  storage_path: string
}

export default function DataRoomPage() {
  const supabase = createClient()
  const { toast } = useToast()

  const [userId, setUserId] = useState<string | null>(null)
  const [documents, setDocuments] = useState<UserDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // --------------------------
  // Init session
  // --------------------------
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      fetchDocuments(user.id)
    }
    init()
  }, [])

  // --------------------------
  // Fetch documents
  // --------------------------
  const fetchDocuments = async (uid: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', uid)
        .order('upload_date', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // --------------------------
  // Upload document
  // --------------------------
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId || !e.target.files) return
    const files = Array.from(e.target.files)

    setUploading(true)
    try {
      for (const file of files) {
        const filePath = `${userId}/${Date.now()}-${file.name}`

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('user-documents')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Save metadata in DB
        const { error: dbError } = await supabase.from('user_documents').insert({
          user_id: userId,
          name: file.name,
          size: file.size,
          type: file.type,
          storage_path: filePath,
        })
        if (dbError) throw dbError
      }

      toast({ title: 'Uploaded', description: 'Your documents were uploaded successfully.' })
      fetchDocuments(userId)
    } catch (err: any) {
      toast({ title: 'Upload error', description: err.message, variant: 'destructive' })
    } finally {
      setUploading(false)
      e.target.value = '' // reset input
    }
  }

  // --------------------------
  // Download
  // --------------------------
  const handleDownload = async (doc: UserDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-documents')
        .download(doc.storage_path)

      if (error) throw error
      if (!data) return

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      toast({ title: 'Download error', description: err.message, variant: 'destructive' })
    }
  }

  // --------------------------
  // Delete
  // --------------------------
  const handleDelete = async (doc: UserDocument) => {
    try {
      await supabase.storage.from('user-documents').remove([doc.storage_path])
      const { error } = await supabase.from('user_documents').delete().eq('id', doc.id)
      if (error) throw error

      setDocuments((prev) => prev.filter((d) => d.id !== doc.id))
      toast({ title: 'Deleted', description: `${doc.name} has been removed.` })
    } catch (err: any) {
      toast({ title: 'Delete error', description: err.message, variant: 'destructive' })
    }
  }

  // --------------------------
  // Toggle Favorite
  // --------------------------
  const toggleFavorite = async (doc: UserDocument) => {
    try {
      const { error } = await supabase
        .from('user_documents')
        .update({ is_favorite: !doc.is_favorite })
        .eq('id', doc.id)
      if (error) throw error

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id ? { ...d, is_favorite: !doc.is_favorite } : d
        )
      )
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <AppHeader
        title="Data Room"
        subtitle="Upload and manage your business documents"
      />

      {/* Upload Box */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h4 className="font-medium text-gray-900 mb-2">Upload documents</h4>
        <p className="text-sm text-gray-500 mb-4">PDF, Word, Excel, Invoices and more</p>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition">
          <Upload className="h-8 w-8 text-emerald-600 mb-2" />
          <span className="text-sm text-gray-600">Click to select files</span>
          <input
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
        {uploading && <p className="text-sm text-emerald-600 mt-2">Uploading...</p>}
      </div>

      {/* Document List */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h4 className="font-medium text-gray-900 mb-4">My Documents</h4>
        {loading ? (
          <p className="text-gray-500">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {doc.custom_label || doc.name}{' '}
                    {doc.is_favorite && <span className="text-yellow-500">★</span>}
                  </p>
                  <p className="text-sm text-gray-500">
                    {doc.category || 'Uncategorized'} • {(doc.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(doc)}
                    className="p-2 rounded hover:bg-gray-100"
                    title={doc.is_favorite ? 'Unmark favorite' : 'Mark favorite'}
                  >
                    <Star
                      className={`h-5 w-5 ${doc.is_favorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}
                    />
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 rounded hover:bg-gray-100"
                    title="Download"
                  >
                    <Download className="h-5 w-5 text-emerald-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-2 rounded hover:bg-gray-100"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
