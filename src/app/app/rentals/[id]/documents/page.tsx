'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DocumentUploadPage() {
  const router = useRouter()
  const params = useParams()
  const rentalId = params?.id as string

  const [documentType, setDocumentType] = useState<'INE' | 'PASSPORT'>('INE')
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }

      if (side === 'front') {
        setFrontFile(file)
      } else {
        setBackFile(file)
      }
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!frontFile || !backFile) {
      setError('Please upload both front and back documents')
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('rentalId', rentalId)
      formData.append('documentType', documentType)
      formData.append('front', frontFile)
      formData.append('back', backFile)

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload documents')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/app/rentals/${rentalId}`)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to upload documents')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Identification Documents</CardTitle>
          <CardDescription>
            Please upload clear photos of both sides of your identification document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Type Selection */}
            <div>
              <label className="text-sm font-medium block mb-2">Document Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="documentType"
                    value="INE"
                    checked={documentType === 'INE'}
                    onChange={(e) => setDocumentType(e.target.value as 'INE' | 'PASSPORT')}
                    className="w-4 h-4"
                  />
                  <span>National ID (INE)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="documentType"
                    value="PASSPORT"
                    checked={documentType === 'PASSPORT'}
                    onChange={(e) => setDocumentType(e.target.value as 'INE' | 'PASSPORT')}
                    className="w-4 h-4"
                  />
                  <span>Passport</span>
                </label>
              </div>
            </div>

            {/* Front Document Upload */}
            <div>
              <label className="text-sm font-medium block mb-2">Front Side</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="front-file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e, 'front')}
                  className="hidden"
                />
                <label htmlFor="front-file" className="cursor-pointer">
                  <div className="text-4xl mb-2">📸</div>
                  {frontFile ? (
                    <div>
                      <p className="font-semibold text-green-600">{frontFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(frontFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Back Document Upload */}
            <div>
              <label className="text-sm font-medium block mb-2">Back Side</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="back-file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e, 'back')}
                  className="hidden"
                />
                <label htmlFor="back-file" className="cursor-pointer">
                  <div className="text-4xl mb-2">📸</div>
                  {backFile ? (
                    <div>
                      <p className="font-semibold text-green-600">{backFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(backFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                ✓ Documents uploaded successfully! Redirecting...
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !frontFile || !backFile}
            >
              {loading ? 'Uploading...' : 'Submit Documents'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Your documents will be reviewed by our team within 24 hours.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
