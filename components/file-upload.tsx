'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Camera, Upload, FileImage, X, RotateCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { compressImage, getThumbnailPreview } from '@/lib/image-utils'

interface FileUploadProps {
  file: File | null
  onFileSelect: (file: File) => void
  onFileRemove: () => void
}

export function FileUpload({ file, onFileSelect, onFileRemove }: FileUploadProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const handleCameraCapture = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const files = input.files
    if (files && files.length > 0) {
      setIsCompressing(true)
      try {
        let processedFile = files[0]
        if (processedFile.type.startsWith('image/')) {
          processedFile = await compressImage(processedFile)
        }
        const thumb = await getThumbnailPreview(processedFile)
        setPreview(thumb)
        onFileSelect(processedFile)
      } finally {
        setIsCompressing(false)
        input.value = ''
      }
    }
  }, [onFileSelect])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsCompressing(true)
      try {
        let processedFile = acceptedFiles[0]
        if (processedFile.type.startsWith('image/')) {
          processedFile = await compressImage(processedFile)
        }
        const thumb = await getThumbnailPreview(processedFile)
        setPreview(thumb)
        onFileSelect(processedFile)
      } finally {
        setIsCompressing(false)
      }
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
    noClick: true,
  })

  const handleRemove = () => {
    setPreview(null)
    onFileRemove()
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (file) {
    return (
      <div className="space-y-4">
        {preview && (
          <div className="rounded-lg overflow-hidden border border-[#ae8b4d]/20 aspect-video bg-gray-100 flex items-center justify-center">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <FileImage className="h-8 w-8 text-[#ae8b4d] flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  cameraInputRef.current?.click()
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => {
          const files = e.currentTarget.files
          if (files) handleCameraCapture(e as any)
        }}
        className="hidden"
      />

      <Button
        onClick={() => cameraInputRef.current?.click()}
        disabled={isCompressing}
        className="w-full h-14 bg-[#ae8b4d] hover:bg-[#9a7a42] text-white font-semibold text-base"
        size="lg"
      >
        <Camera className="mr-2 h-5 w-5" />
        {isCompressing ? 'Compression...' : 'Prendre une photo'}
      </Button>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6
          transition-colors cursor-pointer
          ${isDragActive
            ? 'border-[#ae8b4d] bg-[#ae8b4d]/5'
            : 'border-gray-300 hover:border-[#ae8b4d]/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 text-center">
          <Upload className="h-8 w-8 text-gray-400" />
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-medium text-[#ae8b4d] hover:underline"
            >
              Ou choisir un fichier
            </button>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, PNG, JPG jusqu'à 20MB
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
