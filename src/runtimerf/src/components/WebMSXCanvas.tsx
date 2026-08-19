import { useEffect, useRef, useState } from 'react'
import { Box, Button, Center, Group, Loader, Text } from '@mantine/core'
import { IconAlertTriangle, IconRefresh, IconBrandGithub } from '@tabler/icons-react'

interface WebMSXCanvasProps {
  onControlActivate?: (control: string, altPower?: boolean, secSlot?: boolean, extension?: string) => void
}

const WebMSXCanvas: React.FC<WebMSXCanvasProps> = ({ onControlActivate }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const roomRef = useRef<any>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    // Configure WebMSX BEFORE loading the script
    const WMSX = (window as any).WMSX || {}
    WMSX.IMAGES_PATH = '/webmsx/images/'
    WMSX.SCREEN_ELEMENT_ID = 'wmsx-screen'
    WMSX.MACHINE = 'MSX2+'
    WMSX.EXTENSIONS = {
      SCC: 1,
      'MSX-MUSIC': 1,
      'MSX-AUDIO': 1,
      Moonsound: 1,
    }
    WMSX.SCREEN_DEFAULT_SCALE = 2
    WMSX.SCREEN_RESIZE_DISABLED = false
    WMSX.UI = { bar: false, osd: true }
    WMSX.SCREEN_CONTROL_BAR = 0  // Disable control bar
    WMSX.AUTO_START = true
    WMSX.AUTO_POWER_ON_DELAY = 0
    ;(window as any).WMSX = WMSX

    const loadWebMSX = () => {
      const script = document.createElement('script')
      script.src = '/webmsx/webmsx.min.js'
      script.onload = () => {
        try {
          if ((window as any).WMSX?.start) {
            (window as any).WMSX.start()
          }
          
          const checkRoom = setInterval(() => {
            if ((window as any).WMSX?.room) {
              clearInterval(checkRoom)
              const room = (window as any).WMSX.room
              roomRef.current = room
              ;(window as any).webmsxRoom = room
              
              // Hide the control bar after room is created
              if (room.screen && room.screen.setControlBar) {
                room.screen.setControlBar(false)
              }
              
              if (room.peripheralControls) {
                const originalProcess = room.peripheralControls.processControlActivated.bind(room.peripheralControls)
                room.peripheralControls.processControlActivated = (control: string, altPower: boolean, secSlot: boolean, extension?: string) => {
                  onControlActivate?.(control, altPower, secSlot, extension)
                  return originalProcess(control, altPower, secSlot, extension)
                }
              }
              setLoaded(true)
            }
          }, 100)
        } catch (e) {
          console.error('Error starting WebMSX:', e)
          setError('Error al iniciar WebMSX: ' + e.message)
        }
      }
      script.onerror = () => {
        setError('No se pudo cargar WebMSX. Verifica que los archivos estén en public/webmsx/')
        console.error('Failed to load /webmsx/webmsx.min.js')
      }
      document.head.appendChild(script)
    }

    loadWebMSX()

    return () => {
      const room = roomRef.current || (window as any).webmsxRoom
      if (room) {
        try {
          room.powerOff()
        } catch (e) {
          console.warn('Error powering off WebMSX:', e)
        }
        ;(window as any).webmsxRoom = null
        roomRef.current = null
      }
      startedRef.current = false
      setLoaded(false)
    }
  }, [onControlActivate])

  if (error) {
    return (
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--mantine-color-red-0)',
          border: '1px solid var(--mantine-color-red-3)',
          borderRadius: 'md',
          margin: 'md',
          padding: 'xl',
        }}
      >
        <IconAlertTriangle size={48} style={{ color: 'var(--mantine-color-red-6)' }} />
        <Text mt="md" fw={500} c="red">Error cargando WebMSX</Text>
        <Text mt="xs" size="sm" c="dimmed" ta="center" style={{ maxWidth: 400 }}>{error}</Text>
        <Group mt="lg" gap="md">
          <Button leftSection={<IconRefresh size={16} />} onClick={() => window.location.reload()}>Reintentar</Button>
          <Button variant="outline" leftSection={<IconBrandGithub size={16} />} onClick={() => window.open('https://github.com/ppeccin/WebMSX', '_blank')}>Ver original</Button>
        </Group>
      </Box>
    )
  }

  return (
    <Box
      ref={containerRef}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        minHeight: 0,
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div id="wmsx-screen" style={{ width: '100%', height: '100%' }} />
      {!loaded && (
        <Center style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(0,0,0,0.5)' }}>
          <Loader size="lg" color="white" />
        </Center>
      )}
    </Box>
  )
}

export default WebMSXCanvas
