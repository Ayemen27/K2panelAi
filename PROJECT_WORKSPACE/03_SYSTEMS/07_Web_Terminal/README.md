# 💻 Web Terminal System

## نظرة عامة

نظام **Web Terminal** يتيح للمستخدمين تنفيذ أوامر Shell على سيرفراتهم البعيدة مباشرة من المتصفح.

---

## المكونات

### 1. Terminal UI Component
```yaml
التقنية: xterm.js + React
المسؤولية: عرض Terminal في المتصفح
```

**الميزات:**
- ✅ Terminal emulator كامل
- ✅ دعم الألوان و ANSI codes
- ✅ Copy/Paste
- ✅ Command history
- ✅ Auto-completion (اختياري)

### 2. WebSocket Connection
```yaml
التقنية: WebSocket
المسؤولية: اتصال real-time بين Frontend و Backend
```

**التدفق:**
```
User types command → Frontend → WebSocket → Backend → Bridge → Server
Server output → Bridge → Backend → WebSocket → Frontend → Display
```

### 3. Command Executor (on Server)
```yaml
التقنية: Python subprocess
المسؤولية: تنفيذ الأوامر على السيرفر
```

---

## البنية المعمارية

### Frontend:
```typescript
// components/features/Terminal.tsx
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'

export default function WebTerminal({ serverId }: Props) {
  const terminalRef = useRef<Terminal>()
  const wsRef = useRef<WebSocket>()
  
  useEffect(() => {
    // 1. إنشاء xterm.js instance
    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4'
      }
    })
    
    // 2. الإضافات
    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(new WebLinksAddon())
    
    // 3. فتح Terminal
    terminal.open(terminalRef.current)
    fitAddon.fit()
    
    // 4. الاتصال بـ WebSocket
    const ws = new WebSocket(`wss://api.platform.com/terminal/${serverId}`)
    
    ws.onmessage = (event) => {
      terminal.write(event.data)
    }
    
    terminal.onData((data) => {
      ws.send(data)
    })
    
    return () => {
      ws.close()
      terminal.dispose()
    }
  }, [serverId])
  
  return <div ref={terminalRef} />
}
```

### Backend:
```typescript
// app/api/terminal/[serverId]/route.ts
import { WebSocketServer } from 'ws'

export async function GET(req: Request, { params }) {
  const { serverId } = params
  
  // Upgrade to WebSocket
  const { socket, response } = Deno.upgradeWebSocket(req)
  
  socket.onopen = () => {
    // اتصل بالـ Bridge Daemon على السيرفر
    const bridgeWs = connectToBridge(serverId)
    
    // Pipe data بين Frontend و Bridge
    socket.onmessage = (e) => bridgeWs.send(e.data)
    bridgeWs.onmessage = (e) => socket.send(e.data)
  }
  
  return response
}
```

### Bridge Daemon (on Server):
```python
# bridge_tool/modules/terminal.py
import subprocess
import asyncio
from websockets import serve

class TerminalSession:
    def __init__(self):
        self.process = None
    
    async def start(self, websocket):
        # Start bash shell
        self.process = subprocess.Popen(
            ['/bin/bash'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=False
        )
        
        # Read from websocket → write to shell
        async def handle_input():
            async for message in websocket:
                self.process.stdin.write(message.encode())
                self.process.stdin.flush()
        
        # Read from shell → send to websocket
        async def handle_output():
            while True:
                output = self.process.stdout.read(1024)
                if output:
                    await websocket.send(output.decode())
                await asyncio.sleep(0.01)
        
        await asyncio.gather(
            handle_input(),
            handle_output()
        )

# Start WebSocket server
async def main():
    async with serve(TerminalSession().start, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())
```

---

## التدفق الكامل

```
┌─────────────┐
│   Browser   │
│  (xterm.js) │
└──────┬──────┘
       │ WebSocket
       │
       ↓
┌─────────────┐
│  Backend    │
│   (API)     │
└──────┬──────┘
       │ WebSocket
       │
       ↓
┌─────────────┐
│   Bridge    │
│  (on VPS)   │
└──────┬──────┘
       │ subprocess
       │
       ↓
┌─────────────┐
│  /bin/bash  │
│  (on VPS)   │
└─────────────┘
```

---

## الأمان

### 1. Authentication:
```typescript
// فقط المستخدم صاحب السيرفر يمكنه فتح Terminal
if (!canAccessServer(user.id, serverId)) {
  return new Response('Forbidden', { status: 403 })
}
```

### 2. Command Whitelisting (اختياري):
```python
# قائمة الأوامر المسموحة فقط
ALLOWED_COMMANDS = [
    'ls', 'cd', 'pwd', 'cat', 'grep',
    'git', 'npm', 'docker', 'python'
]

def is_command_allowed(cmd):
    base_cmd = cmd.split()[0]
    return base_cmd in ALLOWED_COMMANDS
```

### 3. Session Timeout:
```typescript
// إغلاق تلقائي بعد 30 دقيقة عدم نشاط
const TERMINAL_TIMEOUT = 30 * 60 * 1000 // 30 minutes

setTimeout(() => {
  ws.close()
}, TERMINAL_TIMEOUT)
```

---

## الميزات المتقدمة

### 1. Multiple Terminals:
```typescript
// المستخدم يمكنه فتح عدة terminals
const terminals = [
  { id: 'term-1', serverId: 'server-1' },
  { id: 'term-2', serverId: 'server-1' }, // نفس السيرفر
  { id: 'term-3', serverId: 'server-2' }  // سيرفر آخر
]
```

### 2. Command History:
```typescript
// حفظ تاريخ الأوامر
const history = localStorage.getItem('terminal-history') || []

terminal.onData((data) => {
  if (data === '\r') { // Enter pressed
    history.push(currentCommand)
    localStorage.setItem('terminal-history', history)
  }
})
```

### 3. File Upload via Terminal:
```bash
# المستخدم يمكنه سحب ملف للـ Terminal
# الملف يُرفع تلقائياً للسيرفر
drag-and-drop file.txt → uploads to /tmp/file.txt
```

---

## التكامل مع الأنظمة الأخرى

### مع Control Plane:
```typescript
// في Dashboard، زر "Open Terminal"
<Button onClick={() => openTerminal(server.id)}>
  <TerminalIcon /> Open Terminal
</Button>
```

### مع File Manager:
```typescript
// في File Manager، "Open in Terminal"
<ContextMenu>
  <MenuItem onClick={() => openTerminalAtPath(file.path)}>
    Open Terminal here
  </MenuItem>
</ContextMenu>
```

---

## المهام ذات الصلة

- المطور 5: Terminal Component Implementation

---

## الحالة الحالية

**ما هو موجود:**
- ❌ لا شيء - يجب البناء من الصفر

**ما يجب إضافته:**
- [ ] xterm.js integration
- [ ] WebSocket backend
- [ ] Bridge terminal handler
- [ ] Authentication & authorization
- [ ] Command history
- [ ] Session management

---

## الوثائق ذات الصلة

- [`../01_ARCHITECTURE/SYSTEM_OVERVIEW.md`](../../01_ARCHITECTURE/SYSTEM_OVERVIEW.md)
- [`../05_OPERATIONS/AGENT_TASKS/DEVELOPER_05.md`](../../05_OPERATIONS/AGENT_TASKS/DEVELOPER_05.md)
- [`../11_Bridge_Coordination/README.md`](../11_Bridge_Coordination/README.md)

---

**آخر تحديث**: 2025-11-18  
**الحالة**: ✅ موثق
