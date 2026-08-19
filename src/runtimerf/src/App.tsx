import { useState } from 'react'
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Group,
  Text,
  Box,
  Divider,
  ScrollArea,
  Stack,
  Badge,
  ActionIcon,
  Tooltip,
  Button,
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
  IconLayoutDashboard,
  IconDeviceDesktop,
  IconArrowsMaximize,
  IconVideo,
  IconMouse,
  IconInfoCircle,
  IconChevronLeft,
  IconChevronRight,
  IconCpu,
  IconServer,
  IconDatabase,
  IconTerminal,
  IconCommand,
  IconChevronDown,
  IconFile,
  IconFolder,
  IconBrandWindows,
  IconDeviceMobile,
} from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import { ErrorBoundary } from './components/ErrorBoundary'
import WebMSXCanvas from './components/WebMSXCanvas'

const menuItems = [
  {
    category: 'Sistema',
    icon: IconLayoutDashboard,
    items: [
      { label: 'Encendido / Apagado', icon: IconPower, action: 'powerToggle', shortcut: '' },
      { label: 'Reiniciar', icon: IconRefresh, action: 'reset', shortcut: 'Shift' },
      { label: 'Net Play', icon: IconNetwork, action: 'netplay', shortcut: '' },
    ],
  },
  {
    category: 'Medios',
    icon: IconServer,
    items: [
      { label: 'Disquete A', icon: IconDeviceFloppy, action: 'diskA', shortcut: '', subItems: [
        { label: 'Cargar imágenes', icon: IconFile, action: 'loadDiskFiles', slot: 0, shortcut: '' },
        { label: 'Añadir imágenes', icon: IconFile, action: 'addDiskFiles', slot: 0, shortcut: '' },
        { label: 'Disquete en blanco', icon: IconFile, action: 'diskEmpty', slot: 0, shortcut: 'Ctrl' },
        { label: 'Disquete de arranque', icon: IconFile, action: 'diskBoot', slot: 0, shortcut: 'Shift+Ctrl' },
        { label: 'Importar archivos', icon: IconFile, action: 'diskLoadAsDisk', slot: 0, shortcut: '' },
        { label: 'Expandir ZIP', icon: IconFolder, action: 'diskLoadZip', slot: 0, shortcut: '' },
      ]},
      { label: 'Disquete B', icon: IconDeviceFloppy, action: 'diskB', shortcut: '', subItems: [
        { label: 'Cargar imágenes', icon: IconFile, action: 'loadDiskFiles', slot: 1, shortcut: '' },
        { label: 'Añadir imágenes', icon: IconFile, action: 'addDiskFiles', slot: 1, shortcut: '' },
        { label: 'Disquete en blanco', icon: IconFile, action: 'diskEmpty', slot: 1, shortcut: 'Ctrl' },
        { label: 'Disquete de arranque', icon: IconFile, action: 'diskBoot', slot: 1, shortcut: 'Shift+Ctrl' },
        { label: 'Importar archivos', icon: IconFile, action: 'diskLoadAsDisk', slot: 1, shortcut: '' },
        { label: 'Expandir ZIP', icon: IconFolder, action: 'diskLoadZip', slot: 1, shortcut: '' },
      ]},
      { label: 'Disco Duro', icon: IconServer, action: 'harddisk', shortcut: '', subItems: [
        { label: 'Cargar imagen', icon: IconServer, action: 'hdLoadFile', shortcut: '' },
        { label: 'Nuevo en blanco', icon: IconServer, action: 'hdChooseEmpty', shortcut: 'Ctrl' },
        { label: 'Nuevo arranque', icon: IconServer, action: 'hdChooseBoot', shortcut: 'Shift+Ctrl' },
        { label: 'Importar archivos', icon: IconFile, action: 'hdLoadAsDisk', shortcut: '' },
        { label: 'Expandir ZIP', icon: IconFolder, action: 'hdLoadZip', shortcut: '' },
      ]},
      { label: 'Cartucho 1', icon: IconDatabase, action: 'cartridge1', shortcut: '', subItems: [
        { label: 'Cargar ROM', icon: IconBrandWindows, action: 'cartLoadFile', shortcut: '' },
        { label: 'Formato ROM', icon: IconTerminal, action: 'cartChooseFormat', shortcut: 'Shift' },
        { label: 'Cargar datos', icon: IconTerminal, action: 'cartLoadData', shortcut: 'Ctrl' },
        { label: 'Guardar datos', icon: IconTerminal, action: 'cartSaveData', shortcut: 'Ctrl+Alt' },
      ]},
      { label: 'Cartucho 2', icon: IconDatabase, action: 'cartridge2', shortcut: '', subItems: [
        { label: 'Cargar ROM', icon: IconBrandWindows, action: 'cartLoadFile', secSlot: true, shortcut: '' },
        { label: 'Formato ROM', icon: IconTerminal, action: 'cartChooseFormat', secSlot: true, shortcut: 'Shift' },
        { label: 'Cargar datos', icon: IconTerminal, action: 'cartLoadData', secSlot: true, shortcut: 'Ctrl' },
        { label: 'Guardar datos', icon: IconTerminal, action: 'cartSaveData', secSlot: true, shortcut: 'Ctrl+Alt' },
      ]},
      { label: 'Cassette', icon: IconDeviceAudioTape, action: 'tape', shortcut: '', subItems: [
        { label: 'Cargar cinta', icon: IconDeviceAudioTape, action: 'tapeLoadFile', secSlot: true, shortcut: '' },
        { label: 'Cinta en blanco', icon: IconDeviceAudioTape, action: 'tapeEmpty', secSlot: true, shortcut: 'Ctrl' },
        { label: 'Rebobinar', icon: IconRefresh, action: 'tapeRewind', secSlot: true, shortcut: '' },
        { label: 'Ejecutar programa', icon: IconTerminal, action: 'tapeAutoRun', secSlot: true, shortcut: 'Shift+Ctrl+Alt' },
      ]},
    ],
  },
  {
    category: 'Pantalla',
    icon: IconDeviceDesktop,
    items: [
      { label: 'Escalar -', icon: IconArrowsMaximize, action: 'scaleMinus', shortcut: '' },
      { label: 'Escalar +', icon: IconArrowsMaximize, action: 'scalePlus', shortcut: '' },
      { label: 'Pantalla completa', icon: IconArrowsMaximize, action: 'fullscreen', shortcut: '' },
      { label: 'Salida de video', icon: IconVideo, action: 'videoOutput', shortcut: '', subItems: [
        { label: 'Automático', icon: IconVideo, action: 'videoAuto', shortcut: '' },
        { label: 'Interno', icon: IconVideo, action: 'videoInternal', shortcut: 'Shift' },
        { label: 'Externo', icon: IconVideo, action: 'videoExternal', shortcut: 'Ctrl' },
        { label: 'Superpuesto', icon: IconVideo, action: 'videoSuperimposed', shortcut: 'Alt' },
        { label: 'Mixto', icon: IconVideo, action: 'videoMixed', shortcut: 'Shift+Ctrl' },
        { label: 'Pantalla dual', icon: IconVideo, action: 'videoDual', shortcut: 'Alt+Ctrl' },
        { label: 'Reset auto interno', icon: IconRefresh, action: 'videoResetAuto', shortcut: '' },
      ]},
    ],
  },
  {
    category: 'Configuración',
    icon: IconSettings,
    items: [
      { label: 'Seleccionar máquina', icon: IconTerminal, action: 'machineSelect', shortcut: 'Alt' },
      { label: 'Ayuda y ajustes', icon: IconHelp, action: 'settings', shortcut: '' },
      { label: 'Opciones rápidas', icon: IconCommand, action: 'quickOptions', shortcut: 'Ctrl' },
      { label: 'Config. táctil', icon: IconDeviceMobile, action: 'touchConfig', shortcut: 'Ctrl+Alt' },
      { label: 'Valores por defecto', icon: IconRefresh, action: 'defaults', shortcut: 'Shift' },
    ],
  },
  {
    category: 'Extensiones',
    icon: IconCpu,
    items: [
      { label: 'Gestionar extensiones', icon: IconCpu, action: 'extensions', shortcut: '' },
    ],
  },
  {
    category: 'Estados',
    icon: IconServer,
    items: [
      { label: 'Cargar estado', icon: IconDownload, action: 'loadState', shortcut: '' },
      { label: 'Guardar estado', icon: IconUpload, action: 'saveState', shortcut: '' },
    ],
  },
]

interface NavItemProps {
  item: any
  level: number
  collapsed: boolean
  onAction: (action: string, params?: any) => void
  openItems: Set<string>
  setOpenItems: React.Dispatch<React.SetStateAction<Set<string>>>
}

function NavItem({ item, level, collapsed, onAction, openItems, setOpenItems }: NavItemProps) {
  const hasSubItems = item.subItems && item.subItems.length > 0
  const isOpen = openItems.has(item.label)

  const handleClick = () => {
    console.log('[NavItem] Click:', item.label, item.action, item);
    onAction(item.action, { slot: item.slot, secSlot: item.secSlot });
  }

  const IconComponent = item.icon || IconFile

  if (hasSubItems) {
    return (
      <Box key={item.action} style={{ marginLeft: level * 16 }}>
        <Tooltip label={collapsed ? item.label : undefined} position="right" disabled={!collapsed}>
          <Button
            variant="subtle"
            leftSection={<IconComponent size={16} />}
            rightSection={!collapsed && <IconChevronDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />}
            style={{
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: '6px 10px',
              borderRadius: 6,
              width: '100%',
              textAlign: 'left',
            }}
            onClick={() => {
              setOpenItems(prev => {
                const next = new Set(prev)
                if (next.has(item.label)) next.delete(item.label)
                else next.add(item.label)
                return next
              })
            }}
          >
            {!collapsed && (
              <>
                <Text size="sm" fw={500}>{item.label}</Text>
                {item.shortcut && <Badge size="xs" variant="light">{item.shortcut}</Badge>}
              </>
            )}
          </Button>
        </Tooltip>
        {isOpen && (
          <Stack gap="xs" style={{ paddingLeft: collapsed ? 0 : 12, marginTop: 4 }}>
            {item.subItems.map((sub: any) => (
              <NavItem
                key={sub.action}
                item={sub}
                level={level + 1}
                collapsed={collapsed}
                onAction={onAction}
                openItems={openItems}
                setOpenItems={setOpenItems}
              />
            ))}
          </Stack>
        )}
      </Box>
    )
  }

  return (
    <Tooltip key={item.action} label={collapsed ? item.label : undefined} position="right" disabled={!collapsed}>
      <Button
        variant="subtle"
        leftSection={<IconComponent size={16} />}
        style={{
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: '6px 10px',
          borderRadius: 6,
          width: '100%',
          textAlign: 'left',
          marginLeft: level * 16,
        }}
        onClick={handleClick}
      >
        {!collapsed && (
          <>
            <Text size="sm">{item.label}</Text>
            {item.shortcut && <Badge size="xs" variant="light" style={{ marginLeft: 'auto' }}>{item.shortcut}</Badge>}
          </>
        )}
      </Button>
    </Tooltip>
  )
}

function Navbar({ onAction, collapsed }: { onAction: (action: string, params?: any) => void; collapsed: boolean }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  return (
    <AppShellNavbar
      id="navbar"
      style={{ borderRight: '1px solid var(--mantine-color-gray-3)', width: collapsed ? 60 : 280 }}
    >
      <ScrollArea style={{ height: '100%', padding: 'xs' }}>
        <Stack gap="md">
          {menuItems.map((category) => (
            <Box key={category.category}>
              <Tooltip label={collapsed ? category.category : undefined} position="right" disabled={!collapsed}>
                <Group justify="space-between" style={{ padding: '4px 8px', borderRadius: 6 }}>
                  <Text fw={600} size="xs" c="dimmed" tt="uppercase" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {category.category}
                  </Text>
                  {!collapsed && (
                    <category.icon size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />
                  )}
                </Group>
              </Tooltip>
              <Divider size="xs" my="xs" />
              <Stack gap="xs">
                {category.items.map((item) => (
                  <NavItem
                    key={item.action}
                    item={item}
                    level={0}
                    collapsed={collapsed}
                    onAction={onAction}
                    openItems={openItems}
                    setOpenItems={setOpenItems}
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </ScrollArea>
    </AppShellNavbar>
  )
}

function Header({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <AppShellHeader
      px={collapsed ? 0 : 'md'}
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        background: 'var(--mantine-color-body)',
        transition: 'padding 0.2s ease',
      }}
    >
      <Group h="100%" justify="space-between" px="md">
        <Group gap="sm">
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={onToggle}
            aria-label="Toggle sidebar"
          >
            <IconChevronLeft size={20} />
          </ActionIcon>
          <Text fw={700} size="lg" c="blue">
            WebMSXrf
          </Text>
        </Group>
        <Group gap="sm">
          <Tooltip label="Acerca de" position="bottom">
            <ActionIcon variant="subtle" size="lg">
              <IconInfoCircle size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </AppShellHeader>
  )
}

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleAction = (action: string, params?: any) => {
    console.log('[App] handleAction:', action, params);
    const room = (window as any).webmsxRoom;
    if (!room) return;

    try {
      switch (action) {
        case 'powerToggle':
          if (room.machine?.powerIsOn) room.machine.powerOff();
          else room.machine.userPowerOn();
          break;
        case 'reset':
          room.machine.reset?.();
          break;
        case 'netplay':
          room.peripheralControls?.processControlActivated?.('SCREEN_OPEN_NETPLAY', false, false);
          break;
        case 'fullscreen':
          room.screen?.toggleFullscreen?.();
          break;
        case 'scalePlus':
          room.peripheralControls?.processControlActivated?.('SCREEN_SCALE_PLUS', false, false);
          break;
        case 'scaleMinus':
          room.peripheralControls?.processControlActivated?.('SCREEN_SCALE_MINUS', false, false);
          break;
        // Media loading - use file dialog
        case 'loadDiskFiles':
        case 'addDiskFiles':
        case 'hdLoadFile':
        case 'cartLoadFile':
        case 'tapeLoadFile':
        case 'diskLoadAsDisk':
        case 'hdLoadAsDisk':
        case 'diskLoadZip':
        case 'hdLoadZip':
        case 'loadState':
          room.screen?.openLoadFileDialog?.();
          break;
        default:
          // Other controls via processControlActivated
          if (room.peripheralControls?.processControlActivated) {
            const controlMap: Record<string, string> = {
              'diskEmpty': 'DISK_EMPTY',
              'diskBoot': 'DISK_BOOT',
              'hdChooseEmpty': 'HARDDISK_CHOOSE_EMPTY',
              'hdChooseBoot': 'HARDDISK_CHOOSE_BOOT',
              'cartChooseFormat': 'CARTRIDGE_CHOOSE_FORMAT',
              'cartLoadData': 'CARTRIDGE_LOAD_DATA_FILE',
              'cartSaveData': 'CARTRIDGE_SAVE_DATA_FILE',
              'tapeEmpty': 'TAPE_EMPTY',
              'tapeRewind': 'TAPE_REWIND',
              'tapeAutoRun': 'TAPE_AUTO_RUN',
              'machineSelect': 'SCREEN_OPEN_MACHINE_SELECT',
              'settings': 'SCREEN_OPEN_SETTINGS',
              'quickOptions': 'SCREEN_OPEN_QUICK_OPTIONS',
              'touchConfig': 'SCREEN_OPEN_TOUCH_CONFIG',
              'defaults': 'SCREEN_DEFAULTS',
              'extensions': 'EXTENSIONS_MANAGE',
              'saveState': 'MACHINE_SAVE_STATE_MENU',
            };
            const control = controlMap[action];
            if (control) {
              room.peripheralControls.processControlActivated(
                control,
                false,
                params?.secSlot || params?.slot === 1 || false
              );
            }
          }
          break;
      }
    } catch (e) {
      console.error('Action error:', e);
    }
  }

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 280, breakpoint: 'sm' }}
      padding="md"
      styles={{
        main: {
          background: 'var(--mantine-color-gray-0)',
          minHeight: 'calc(100vh - 56px)',
        },
      }}
    >
      <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Navbar onAction={handleAction} collapsed={collapsed} />
      <AppShellMain>
        <div style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
          <ErrorBoundary>
            <WebMSXCanvas />
          </ErrorBoundary>
        </div>
      </AppShellMain>
    </AppShell>
  )
}

export default App
