import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CVListPage } from '@/pages/CVListPage'
import { CVEditorPage } from '@/pages/CVEditorPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { LoginPage } from '@/pages/LoginPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useCVStorageSync } from '@/hooks/useCVStorageSync'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'

const queryClient = new QueryClient()

function AppRoutes() {
  useCVStorageSync()
  useAuthBootstrap()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<CVListPage />} />
        <Route path="/cvs/:id/edit" element={<CVEditorPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
