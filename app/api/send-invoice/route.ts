export async function POST(req: Request) {
  const formData = await req.formData()

  const response = await fetch(
    'https://zerobureau.app.n8n.cloud/webhook/mobile-invoice',
    {
      method: 'POST',
      body: formData,
    }
  )

  const text = await response.text()

  return new Response(text, {
    status: response.status,
  })
}
