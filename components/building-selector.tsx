'use client'

import { useState, useMemo } from 'react'
import { Check, Search, Building2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface Building {
  id: string
  name: string
  company: string
}

interface BuildingSelectorProps {
  buildings: Building[]
  selectedBuildings: Building[]
  onBuildingToggle: (building: Building) => void
}

export function BuildingSelector({
  buildings,
  selectedBuildings,
  onBuildingToggle,
}: BuildingSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return buildings

    const term = searchTerm.toLowerCase()
    return buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.company.toLowerCase().includes(term)
    )
  }, [buildings, searchTerm])

  const isSelected = (b: Building) =>
    selectedBuildings.some((s) => s.id === b.id)

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher une adresse..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {selectedBuildings.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedBuildings.map((b) => (
            <Badge
              key={b.id}
              variant="secondary"
              className="pl-2 pr-1 py-1 text-xs"
            >
              <span className="truncate max-w-[200px]">{b.name}</span>
              <button
                onClick={() => onBuildingToggle(b)}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-sm p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <ScrollArea className="h-[300px] rounded-md border">
        <div className="p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Aucun immeuble trouvé
            </div>
          ) : (
            filtered.map((b) => {
              const selected = isSelected(b)
              return (
                <Card
                  key={b.id}
                  className={`
                    p-3 cursor-pointer transition-colors
                    ${selected ? 'bg-primary/10 border-primary' : 'hover:bg-accent'}
                  `}
                  onClick={() => onBuildingToggle(b)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {selected ? (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
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
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
