'use client'

import { useState, useMemo } from 'react'
import { Search, Building2, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export interface Building {
  id: string
  name: string
  company: string
}

interface BuildingSelectorProps {
  buildings: Building[]
  selectedBuilding: Building | null
  onBuildingSelect: (building: Building | null) => void
}

export function BuildingSelector({
  buildings,
  selectedBuilding,
  onBuildingSelect,
}: BuildingSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(true)

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return buildings
    const term = searchTerm.toLowerCase()
    return buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.company.toLowerCase().includes(term)
    )
  }, [buildings, searchTerm])

  const handleSelect = (b: Building) => {
    onBuildingSelect(b)
    setOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#ae8b4d] focus:ring-offset-2 transition-colors hover:bg-accent"
      >
        {selectedBuilding ? (
          <span className="flex items-center gap-2 text-left min-w-0">
            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{selectedBuilding.name}</span>
            {selectedBuilding.company && (
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {selectedBuilding.company}
              </Badge>
            )}
          </span>
        ) : (
          <span className="text-muted-foreground">Sélectionner un immeuble...</span>
        )}
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground flex-shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="rounded-md border shadow-md bg-background">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                type="text"
                placeholder="Rechercher une adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="h-[240px]">
            <div className="p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Aucun immeuble trouvé
                </div>
              ) : (
                filtered.map((b) => {
                  const selected = selectedBuilding?.id === b.id
                  return (
                    <Card
                      key={b.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        selected
                          ? 'bg-[#ae8b4d]/10 border-[#ae8b4d]'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => handleSelect(b)}
                    >
                      <div className="flex items-start gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium break-words">{b.name}</p>
                          {b.company && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {b.company}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
