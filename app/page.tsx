'use client'

import { useState, useEffect } from 'react'
import { FileUpload } from '@/components/file-upload'
import { BuildingSelector, type Building } from '@/components/building-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader as Loader2, Send } from 'lucide-react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [buildings, setBuildings] = useState<Building[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingBuildings, setLoadingBuildings] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadBuildings()
  }, [])

  const loadBuildings = async () => {
    try {
      setLoadingBuildings(true)

      const response = await fetch('/api/buildings')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur serveur')
      }

      setBuildings(data.buildings || [])
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les immeubles',
        variant: 'destructive',
      })
    } finally {
      setLoadingBuildings(false)
    }
  }


  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'Fichier requis',
        description: 'Veuillez sélectionner un fichier',
        variant: 'destructive',
      })
      return
    }

    if (!selectedBuilding) {
      toast({
        title: 'Immeuble requis',
        description: 'Veuillez sélectionner un immeuble',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('buildings', JSON.stringify([selectedBuilding.id]))
      formData.append('building_name', selectedBuilding.name)
      formData.append('building_entity', selectedBuilding.company)
      formData.append('notes', notes)
      formData.append('source', 'mobile-app')

      const response = await fetch('https://zerobureau.app.n8n.cloud/webhook-test/mobile-invoice', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi vers n8n")
      }

      toast({
        title: 'Succès',
        description: 'Facture envoyée avec succès',
      })

      setFile(null)
      setSelectedBuilding(null)
      setNotes('')
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || "Impossible d'envoyer la facture",
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2 pt-4">
          <h1 className="text-4xl font-bold text-[#ae8b4d]">
            Factures Immeubles
          </h1>
          <p className="text-muted-foreground text-lg">
            Envoyez vos factures rapidement et facilement
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-[#ae8b4d]/20">
            <CardHeader>
              <CardTitle className="text-[#ae8b4d]">Facture</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                file={file}
                onFileSelect={setFile}
                onFileRemove={() => setFile(null)}
              />
            </CardContent>
          </Card>

          <Card className="border-[#ae8b4d]/20">
            <CardHeader>
              <CardTitle className="text-[#ae8b4d]">Immeubles</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBuildings ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#ae8b4d]" />
                </div>
              ) : buildings.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Aucun immeuble disponible
                  </p>
                </div>
              ) : (
                <BuildingSelector
                  buildings={buildings}
                  selectedBuilding={selectedBuilding}
                  onBuildingSelect={setSelectedBuilding}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#ae8b4d]/20">
          <CardHeader>
            <CardTitle className="text-[#ae8b4d]">
              Notes (optionnel)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes">Ajouter une note à la facture</Label>

              <Textarea
                id="notes"
                placeholder="Ajoutez des notes ou commentaires..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5 min-h-[100px] border-[#ae8b4d]/20 focus:border-[#ae8b4d] focus:ring-[#ae8b4d]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || !file || !selectedBuilding}
              className="w-full bg-[#ae8b4d] hover:bg-[#9a7a42] text-white"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Envoyer la facture
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pb-4">
          Développé sur mesure par Zéro Bureau Inc.
        </div>
      </div>
    </div>
  )
}