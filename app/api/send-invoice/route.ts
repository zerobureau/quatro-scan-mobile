export async function POST(req: Request) {
  const formData = await req.formData()

  const forwarded = new FormData()

  const file = formData.get('file')
  if (file) forwarded.append('file', file)

  const fields = ['buildings', 'building_name', 'building_entity', 'notes', 'source']
  for (const field of fields) {
    const value = formData.get(field)
    if (value !== null) forwarded.append(field, value as string)
  }

  const response = await fetch(
    'https://zerobureau.app.n8n.cloud/webhook-test/mobile-invoice',
    {
      method: 'POST',
      body: forwarded,
    }
  )

  const text = await response.text()

  return new Response(text, {
    status: response.status,
  })
}
