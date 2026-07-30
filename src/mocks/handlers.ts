import { http, HttpResponse } from 'msw'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export const handlers = [
  http.get(`${API_BASE_URL}/templates`, () => {
    return HttpResponse.json([])
  }),
]
