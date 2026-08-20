async function request(path, options) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText} ${text}`.trim())
  }
  if (res.status === 204) return null
  return res.json()
}

export async function fetchForms() {
  const data = await request('/v1/forms')
  return Array.isArray(data?.forms) ? data.forms : []
}

export async function upsertForm(form) {
  return request(`/v1/forms/${encodeURIComponent(form.id)}`, {
    method: 'PUT',
    body: JSON.stringify(form),
  })
}

export async function fetchResponses() {
  const data = await request('/v1/responses')
  return Array.isArray(data?.responses) ? data.responses : []
}

export async function createResponse(response) {
  return request('/v1/responses', {
    method: 'POST',
    body: JSON.stringify(response),
  })
}
