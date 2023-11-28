export async function bark(url: string, title: string, content: string) {
  if (typeof url !== 'string' || !url.startsWith('https://')) {
    console.error('Wrong type for Bark URL.')
    return -1
  }

  const payload = {
    title,
    body: content,
    group: 'Skland',
  }
  try {
    const resp = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )
    const data = await resp.json()
    console.debug(data)
  }
  catch (error) {
    console.error(`[Bark] Error: ${error}`)
    return -1
  }
}
