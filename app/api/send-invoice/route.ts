import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
]

const MAX_SIZE = 20 * 1024 * 1024

const AIRTABLE_ENDPOINT = 'https://api.airtable.com/v0/appmEbO8oLChuvMyL/Buildings'

async function fetchBuildingNames(ids: string[], apiKey: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const formula = `OR(${ids.map((id) => `RECORD_ID()='${id}'`).join(',')})`

  const url = new URL(AIRTABLE_ENDPOINT)
  url.searchParams.append('filterByFormula', formula)

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!response.ok) {
    throw new Error(`Airtable error: ${response.status}`)
  }

  const data = await response.json()
  for (const record of data.records) {
    map.set(record.id, record.fields['Adresse'] || record.id)
  }

  return map
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const buildingsRaw = formData.get('buildings') as string
    const notes = formData.get('notes') as string

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Formats acceptés : PDF, PNG, JPG, JPEG' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum : 20 MB' },
        { status: 400 }
      )
    }

    let buildingIds: string[]
    try {
      buildingIds = JSON.parse(buildingsRaw)
    } catch {
      return NextResponse.json({ error: 'Format des immeubles invalide' }, { status: 400 })
    }

    if (!buildingIds || buildingIds.length === 0) {
      return NextResponse.json({ error: 'Sélectionnez au moins un immeuble' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    const emailFrom = process.env.EMAIL_FROM
    const emailTo = process.env.EMAIL_TO
    const airtableKey = process.env.AIRTABLE_API_KEY

    if (!resendKey || !emailFrom || !emailTo) {
      return NextResponse.json(
        { error: 'Configuration email manquante' },
        { status: 500 }
      )
    }

    if (!airtableKey) {
      return NextResponse.json(
        { error: 'Configuration Airtable manquante' },
        { status: 500 }
      )
    }

    const buildingNames = await fetchBuildingNames(buildingIds, airtableKey)

    const addressList = buildingIds
      .map((id) => buildingNames.get(id) || id)
      .map((addr) => `<li>${addr}</li>`)
      .join('')

    const notesHtml = notes
      ? `<h3>Notes :</h3><p style="white-space: pre-wrap;">${notes}</p>`
      : ''

    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const resend = new Resend(resendKey)

    const { error } = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: 'New Invoice Submission',
      html: `
        <h2>A new invoice has been submitted.</h2>
        <h3>Buildings:</h3>
        <ul>${addressList}</ul>
        ${notesHtml}
      `,
      attachments: [
        {
          filename: file.name,
          content: fileBuffer,
        },
      ],
    })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      success: true,
      message: 'Facture envoyée avec succès',
    })
  } catch (error: any) {
    console.error('Error sending invoice:', error)
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'envoi de la facture" },
      { status: 500 }
    )
  }
}
