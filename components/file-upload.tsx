'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileImage, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FileUploadProps {
  file: File | null
  onFileSelect: (file: File) => void
  onFileRemove: () => void
}

export function FileUpload({ file, onFileSelect, onFileRemove }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
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
  })

  if (file) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <FileImage className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onFileRemove}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        transition-colors cursor-pointer
        ${isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-gray-300 hover:border-primary/50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 text-center">
        <Upload className="h-12 w-12 text-gray-400" />
        <div>
          <p className="text-sm font-medium">
            {isDragActive ? 'Déposez le fichier ici' : 'Prendre une photo ou choisir un fichier'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, PNG, JPG jusqu'à 20MB
          </p>
        </div>
      </div>
    </div>
  )
}
