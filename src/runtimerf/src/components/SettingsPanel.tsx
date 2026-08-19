import { useEffect, useState } from 'react'
import {
  Drawer,
  Box,
  Text,
  Group,
  Stack,
  Button,
  Select,
  Slider,
  Card,
  Badge,
  ActionIcon,
} from '@mantine/core'
import {
  IconPower,
  IconRefresh,
  IconNetwork,
  IconDownload,
  IconUpload,
  IconDeviceFloppy,
  IconDeviceAudioTape,
  IconSettings,
  IconHelp,
  IconDeviceDesktop,
  IconArrowsMaximize,
  IconVideo,
  IconMouse,
  IconCpu,
  IconServer,
  IconDatabase,
  IconTerminal,
  IconCommand,
  IconX,
  IconLayoutDashboard,
} from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'

interface SettingsPanelProps {
  panel: string
  onClose: () => void
}

const panelConfigs: Record<string, { title: string; icon: React.ComponentType<any>; controls: any[] }> = {
  sistema: {
    title: 'Sistema',
    icon: IconLayoutDashboard,
    controls: [
      { id: 'power', label: 'Encendido / Apagado', icon: IconPower, type: 'action', control: 'MACHINE_POWER_TOGGLE' },
      { id: 'reset', label: 'Reiniciar', icon: IconRefresh, type: 'action', control: 'MACHINE_POWER_RESET', modifier: 'shift' },
      { id: 'netplay', label: 'Net Play', icon: IconNetwork, type: 'action', control: 'SCREEN_OPEN_NETPLAY' },
    ],
  },
  medios: {
    title: 'Medios de almacenamiento',
    icon: IconServer,
    controls: [
      { id: 'disk-a', label: 'Disquete A', icon: IconDeviceFloppy, type: 'group', controls: [
        { id: 'load', label: 'Cargar imágenes', control: 'DISK_LOAD_FILES' },
        { id: 'add', label: 'Añadir imágenes', control: 'DISK_ADD_FILES' },
        { id: 'empty', label: 'Disquete en blanco', control: 'DISK_EMPTY', modifier: 'ctrl' },
        { id: 'boot', label: 'Disquete de arranque', control: 'DISK_BOOT', modifier: 'shift+ctrl' },
        { id: 'import', label: 'Importar archivos', control: 'DISK_LOAD_FILES_AS_DISK' },
        { id: 'zip', label: 'Expandir ZIP', control: 'DISK_LOAD_ZIP_AS_DISK' },
      ]},
      { id: 'disk-b', label: 'Disquete B', icon: IconDeviceFloppy, type: 'group', controls: [
        { id: 'load', label: 'Cargar imágenes', control: 'DISK_LOAD_FILES', secSlot: true },
        { id: 'add', label: 'Añadir imágenes', control: 'DISK_ADD_FILES', secSlot: true },
        { id: 'empty', label: 'Disquete en blanco', control: 'DISK_EMPTY', modifier: 'ctrl', secSlot: true },
        { id: 'boot', label: 'Disquete de arranque', control: 'DISK_BOOT', modifier: 'shift+ctrl', secSlot: true },
        { id: 'import', label: 'Importar archivos', control: 'DISK_LOAD_FILES_AS_DISK', secSlot: true },
        { id: 'zip', label: 'Expandir ZIP', control: 'DISK_LOAD_ZIP_AS_DISK', secSlot: true },
      ]},
      { id: 'hd', label: 'Disco Duro', icon: IconServer, type: 'group', controls: [
        { id: 'load', label: 'Cargar imagen', control: 'HARDDISK_LOAD_FILE' },
        { id: 'empty', label: 'Nuevo en blanco', control: 'HARDDISK_CHOOSE_EMPTY', modifier: 'ctrl' },
        { id: 'boot', label: 'Nuevo arranque', control: 'HARDDISK_CHOOSE_BOOT', modifier: 'shift+ctrl' },
        { id: 'import', label: 'Importar archivos', control: 'HARDDISK_LOAD_FILES_AS_DISK' },
        { id: 'zip', label: 'Expandir ZIP', control: 'HARDDISK_LOAD_ZIP_AS_DISK' },
      ]},
      { id: 'cart1', label: 'Cartucho 1', icon: IconDatabase, type: 'group', controls: [
        { id: 'load', label: 'Cargar ROM', control: 'CARTRIDGE_LOAD_FILE' },
        { id: 'format', label: 'Formato ROM', control: 'CARTRIDGE_CHOOSE_FORMAT', modifier: 'shift' },
        { id: 'load-data', label: 'Cargar datos', control: 'CARTRIDGE_LOAD_DATA_FILE', modifier: 'ctrl' },
        { id: 'save-data', label: 'Guardar datos', control: 'CARTRIDGE_SAVE_DATA_FILE', modifier: 'ctrl+alt' },
      ]},
      { id: 'cart2', label: 'Cartucho 2', icon: IconDatabase, type: 'group', controls: [
        { id: 'load', label: 'Cargar ROM', control: 'CARTRIDGE_LOAD_FILE', secSlot: true },
        { id: 'format', label: 'Formato ROM', control: 'CARTRIDGE_CHOOSE_FORMAT', modifier: 'shift', secSlot: true },
        { id: 'load-data', label: 'Cargar datos', control: 'CARTRIDGE_LOAD_DATA_FILE', modifier: 'ctrl', secSlot: true },
        { id: 'save-data', label: 'Guardar datos', control: 'CARTRIDGE_SAVE_DATA_FILE', modifier: 'ctrl+alt', secSlot: true },
      ]},
      { id: 'tape', label: 'Cassette', icon: IconDeviceAudioTape, type: 'group', controls: [
        { id: 'load', label: 'Cargar cinta', control: 'TAPE_LOAD_FILE', secSlot: true },
        { id: 'empty', label: 'Cinta en blanco', control: 'TAPE_EMPTY', modifier: 'ctrl', secSlot: true },
        { id: 'rewind', label: 'Rebobinar', control: 'TAPE_REWIND', secSlot: true },
        { id: 'run', label: 'Ejecutar programa', control: 'TAPE_AUTO_RUN', modifier: 'shift+ctrl+alt', secSlot: true },
      ]},
    ],
  },
  pantalla: {
    title: 'Pantalla y Video',
    icon: IconDeviceDesktop,
    controls: [
      { id: 'scale', label: 'Escala de pantalla', type: 'slider', min: 1, max: 5, step: 1, default: 2, control: 'SCREEN_SCALE' },
      { id: 'fullscreen', label: 'Pantalla completa', icon: IconArrowsMaximize, type: 'action', control: 'SCREEN_FULLSCREEN' },
      { id: 'video-output', label: 'Salida de video', icon: IconVideo, type: 'select', control: 'VIDEO_OUTPUT', options: [
        { value: 'auto', label: 'Automático' },
        { value: 'internal', label: 'Interno' },
        { value: 'external', label: 'Externo' },
        { value: 'superimposed', label: 'Superpuesto' },
        { value: 'mixed', label: 'Mixto' },
        { value: 'dual', label: 'Pantalla dual' },
      ]},
    ],
  },
  configuracion: {
    title: 'Configuración General',
    icon: IconSettings,
    controls: [
      { id: 'machine', label: 'Seleccionar máquina', icon: IconTerminal, type: 'action', control: 'SCREEN_OPEN_MACHINE_SELECT', modifier: 'alt' },
      { id: 'help', label: 'Ayuda y ajustes', icon: IconHelp, type: 'action', control: 'SCREEN_OPEN_SETTINGS' },
      { id: 'quick', label: 'Opciones rápidas', icon: IconCommand, type: 'action', control: 'SCREEN_OPEN_QUICK_OPTIONS', modifier: 'ctrl' },
      { id: 'touch', label: 'Configuración táctil', icon: IconMouse, type: 'action', control: 'SCREEN_OPEN_TOUCH_CONFIG', modifier: 'ctrl+alt' },
      { id: 'defaults', label: 'Restablecer valores por defecto', icon: IconRefresh, type: 'action', control: 'SCREEN_DEFAULTS', modifier: 'shift', danger: true },
    ],
  },
  extensiones: {
    title: 'Extensiones',
    icon: IconCpu,
    controls: [
      { id: 'manage', label: 'Gestionar extensiones', icon: IconCpu, type: 'action', control: 'EXTENSIONS_MANAGE' },
    ],
  },
  estados: {
    title: 'Estados de la máquina',
    icon: IconServer,
    controls: [
      { id: 'load-state', label: 'Cargar estado', icon: IconDownload, type: 'action', control: 'MACHINE_LOAD_STATE_MENU' },
      { id: 'save-state', label: 'Guardar estado', icon: IconUpload, type: 'action', control: 'MACHINE_SAVE_STATE_MENU' },
    ],
  },
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ panel, onClose }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [opened, setOpened] = useState(true)
  const config = panelConfigs[panel]

  useEffect(() => {
    setOpened(true)
    return () => setOpened(false)
  }, [panel])

  if (!config) return null

  const handleControl = (control: any) => {
    const room = (window as any).webmsxRoom
    if (room && room.peripheralControls) {
      room.peripheralControls.processControlActivated(
        control.control,
        control.altPower || false,
        control.secSlot || false,
        control.extension
      )
    }
    console.log('Activando control:', control)
  }

  const renderControl = (control: any, parentId?: string) => {
    const id = parentId ? `${parentId}-${control.id}` : control.id

    switch (control.type) {
      case 'action':
        return (
          <Button
            key={id}
            variant={control.danger ? 'filled' : 'subtle'}
            color={control.danger ? 'red' : 'blue'}
            leftSection={<control.icon size={16} />}
            rightSection={control.modifier && <Badge size="xs" variant="light">{control.modifier.toUpperCase()}</Badge>}
            onClick={() => handleControl(control)}
            fullWidth
            style={{ justifyContent: 'flex-start', gap: 'sm' }}
          >
            {control.label}
          </Button>
        )
      case 'group':
        return (
          <Box key={id}>
            <Stack gap="xs" ml="md" mt="xs" mb="xs" style={{ borderLeft: '2px solid var(--mantine-color-gray-3)', paddingLeft: 'md' }}>
              {control.controls.map((c: any) => renderControl(c, id))}
            </Stack>
          </Box>
        )
      case 'slider':
        return (
          <Box key={id} style={{ padding: 'md 0' }}>
            <Group justify="space-between" mb="xs">
              <Group gap="sm">
                <control.icon size={18} c="dimmed" />
                <Text fw={500}>{control.label}</Text>
              </Group>
              <Badge variant="light">{control.default}</Badge>
            </Group>
            <Slider
              min={control.min}
              max={control.max}
              step={control.step}
              defaultValue={control.default}
              marks={Array.from({ length: control.max - control.min + 1 }, (_, i) => ({
                value: control.min + i,
                label: String(control.min + i),
              }))}
              onChange={(val) => handleControl({ ...control, control: `${control.control}_${val}` })}
            />
          </Box>
        )
      case 'select':
        return (
          <Box key={id} style={{ padding: 'md 0' }}>
            <Group justify="space-between" mb="xs">
              <Group gap="sm">
                <control.icon size={18} c="dimmed" />
                <Text fw={500}>{control.label}</Text>
              </Group>
            </Group>
            <Select
              placeholder="Seleccionar..."
              data={control.options}
              onChange={(val) => handleControl({ ...control, control: `${control.control}_${val}` })}
            />
          </Box>
        )
      default:
        return (
          <Button
            key={id}
            variant="subtle"
            leftSection={<control.icon size={16} />}
            rightSection={control.modifier && <Badge size="xs" variant="light">{control.modifier.toUpperCase()}</Badge>}
            onClick={() => handleControl(control)}
            fullWidth
            style={{ justifyContent: 'flex-start', gap: 'sm' }}
          >
            {control.label}
          </Button>
        )
    }
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={isMobile ? '100%' : '480px'}
      title={
        <Group justify="space-between">
          <Group gap="sm">
            <config.icon size={24} c="blue" />
            <Text fw={600} size="lg">{config.title}</Text>
          </Group>
          <ActionIcon variant="transparent" size="lg" onClick={onClose}>
            <IconX size={20} />
          </ActionIcon>
        </Group>
      }
    >
      <Stack gap="lg" style={{ padding: 'md' }}>
        {config.controls.map((control) => (
          <Box key={control.id}>
            {control.type === 'group' ? (
              <Card variant="outline" p="md">
                <Group gap="sm" mb="md">
                  <control.icon size={20} c="blue" />
                  <Text fw={600}>{control.label}</Text>
                </Group>
                <Stack gap="xs">
                  {control.controls.map((c: any) => renderControl(c, control.id))}
                </Stack>
              </Card>
            ) : (
              renderControl(control)
            )}
          </Box>
        ))}
      </Stack>
    </Drawer>
  )
}

export default SettingsPanel
