import { Component, ReactNode } from 'react'
import { Box, Text, Button, Alert } from '@mantine/core'
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <Box style={{ padding: 'xl', textAlign: 'center' }}>
          <IconAlertTriangle size={48} color="red" />
          <Text mt="md" fw={500} c="red">Error en la aplicación</Text>
          <Text mt="xs" size="sm" c="dimmed" style={{ maxWidth: 400 }}>
            {this.state.error?.message}
          </Text>
          <Button mt="lg" leftSection={<IconRefresh size={16} />} onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}
