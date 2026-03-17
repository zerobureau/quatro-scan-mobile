import { NextResponse } from 'next/server'

const AIRTABLE_TABLE_ID = 'tblxiZlC1BCL8oaMd'

export async function GET() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID
    if (!apiKey || !baseId) {
      return NextResponse.json(
        { error: 'AIRTABLE_API_KEY ou AIRTABLE_BASE_ID manquant' },
        { status: 500 }
      )
    }

    const AIRTABLE_ENDPOINT = `https://api.airtable.com/v0/${baseId}/${AIRTABLE_TABLE_ID}`

    const buildings: { id: string; name: string; company: string }[] = []
    let offset: string | undefined

    do {
      const url = new URL(AIRTABLE_ENDPOINT)
      url.searchParams.append('filterByFormula', '{Actif}=TRUE()')
      if (offset) {
        url.searchParams.append('offset', offset)
      }

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Airtable error ${response.status}: ${text}`)
      }

      const data = await response.json()

      for (const record of data.records) {
        const name = record.fields['Adresse']
        const company = record.fields['Compagnie'] || ''
        if (name) {
          buildings.push({
            id: record.id,
            name: name.trim(),
            company,
          })
        }
      }

      offset = data.offset
    } while (offset)

    return NextResponse.json({ buildings })
  } catch (error: any) {
    console.error('Error fetching buildings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch buildings' },
      { status: 500 }
    )
  }
}
