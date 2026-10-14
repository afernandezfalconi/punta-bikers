'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Document {
  id: string
  rental_id: string
  document_type: string
  front_photo_url: string
  back_photo_url: string
  status: string
  created_at: string
}

export default function DocumentVerificationPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    // In a real app, this would fetch documents from the API
    // For now, we'll show a placeholder
    setLoading(false)
  }, [])

  const handleApprove = async (docId: string) => {
    // API call to approve document
    console.log('Approving document:', docId)
  }

  const handleReject = async (docId: string, reason: string) => {
    // API call to reject document
    console.log('Rejecting document:', docId, 'Reason:', reason)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading documents...</div>
  }

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Document Verification</h1>
        <p className="text-gray-600">Review and approve customer identification documents</p>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No documents pending verification</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Rental #{doc.rental_id.slice(0, 8)}</CardTitle>
                    <CardDescription>{doc.document_type}</CardDescription>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                    {doc.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded p-2">
                    <p className="text-xs text-gray-600 mb-2">Front</p>
                    <a
                      href={doc.front_photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View Image
                    </a>
                  </div>
                  <div className="border rounded p-2">
                    <p className="text-xs text-gray-600 mb-2">Back</p>
                    <a
                      href={doc.back_photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View Image
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 flex-1"
                    onClick={() => handleApprove(doc.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setSelectedDoc(doc)
                      setAction('reject')
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {action === 'reject' && selectedDoc && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Reject Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">
              Rental #{selectedDoc.rental_id.slice(0, 8)} - {selectedDoc.document_type}
            </p>
            <textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2 border rounded text-sm"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 flex-1"
                onClick={() => {
                  handleReject(selectedDoc.id, rejectionReason)
                  setAction(null)
                  setRejectionReason('')
                }}
              >
                Confirm Rejection
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setAction(null)
                  setRejectionReason('')
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
