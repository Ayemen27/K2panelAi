# 👤 مهام المطور 5 - Terminal Component

> **📍 أنت هنا**: المطور الخامس - الطرفية التفاعلية  
> **⬅️ السابق**: [`DEVELOPER_04.md`](DEVELOPER_04.md)  
> **➡️ التالي**: [`DEVELOPER_06.md`](DEVELOPER_06.md)  
> **🏠 العودة للدليل**: [`../../INDEX.md`](../../INDEX.md)

---

## 🎯 مهمتك الرئيسية

**أنت المطور الخامس** - مسؤوليتك:
- ✅ **إنشاء Terminal Component** باستخدام xterm.js
- ✅ **WebSocket للتواصل** مع السيرفر
- ✅ **التحقق من عدم تكرار** terminal موجود
- ✅ **تنفيذ أوامر حقيقية** عن بُعد
- ✅ **Command history** و auto-complete (اختياري)
- ✅ **التسليم للمطور 6** مع terminal يعمل

**تقدير الجهد**: 4-5 أيام (32 ساعة)  
**الأولوية**: 🔴 حرج - Terminal هو Core Feature

---

## ✅ قائمة التحقق من إعادة الاستخدام (إلزامية!)

### **قبل البدء**:
- [ ] ✅ بحثت عن terminal component موجود
- [ ] ✅ فحصت ServerAutomationAI - هل يحتوي terminal؟
- [ ] ✅ راجعت المشاريع مفتوحة المصدر (Replit, VSCode)
- [ ] ✅ حددت المكتبات التي سأستخدمها (xterm.js)

### **بعد الانتهاء**:
- [ ] ✅ تأكدت من عدم إنشاء terminal logic مكرر
- [ ] ✅ راجعت WebSocket - لا تكرار في connections
- [ ] ✅ وثّقت في HANDOFF

---

## 📋 المهام التفصيلية

### **Phase 1: الإعداد** ⏱️ 4 ساعات

```bash
# Dependencies (أضف في package.json):
{
  "dependencies": {
    "xterm": "^5.3.0",
    "xterm-addon-fit": "^0.8.0",
    "xterm-addon-web-links": "^0.9.0",
    "ws": "^8.14.2"
  }
}
```

---

### **Phase 2: Terminal Component** ⏱️ 12 ساعات

```typescript
// src/components/workspace/Terminal.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

interface TerminalProps {
  workspaceId: string;
}

export function Terminal({ workspaceId }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm>();
  const wsRef = useRef<WebSocket>();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!terminalRef.current) return;

    // إنشاء Terminal
    const xterm = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
      },
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    xterm.loadAddon(fitAddon);
    xterm.loadAddon(webLinksAddon);
    xterm.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;

    // WebSocket connection
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/terminal/${workspaceId}`
    );

    ws.onopen = () => {
      setConnected(true);
      xterm.writeln('Connected to workspace terminal');
      xterm.write('$ ');
    };

    ws.onmessage = (event) => {
      xterm.write(event.data);
    };

    ws.onerror = () => {
      xterm.writeln('\r\nWebSocket error');
      setConnected(false);
    };

    ws.onclose = () => {
      xterm.writeln('\r\nConnection closed');
      setConnected(false);
    };

    wsRef.current = ws;

    // إرسال input للسيرفر
    xterm.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'input', data }));
      }
    });

    // Cleanup
    return () => {
      ws.close();
      xterm.dispose();
    };
  }, [workspaceId]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-200">Terminal</h3>
        <span className={`text-xs ${connected ? 'text-green-400' : 'text-red-400'}`}>
          {connected ? '● Connected' : '○ Disconnected'}
        </span>
      </div>
      <div ref={terminalRef} className="flex-1" />
    </div>
  );
}
```

---

### **Phase 3: WebSocket Server** ⏱️ 8 ساعات

```typescript
// src/app/api/terminal/[workspaceId]/route.ts

import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';

export async function GET(
  req: Request,
  { params }: { params: { workspaceId: string } }
) {
  const { workspaceId } = params;

  // Upgrade to WebSocket
  const upgrade = req.headers.get('upgrade');
  if (upgrade !== 'websocket') {
    return new Response('Expected WebSocket', { status: 426 });
  }

  // في بيئة إنتاج حقيقية، نستخدم WebSocket server منفصل
  // هنا نعرض المفهوم فقط
  
  return new Response('WebSocket endpoint', {
    status: 101,
    headers: {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
    },
  });
}
```

**ملاحظة**: في الإنتاج، استخدم WebSocket server منفصل (مثل ws package)

---

### **Phase 4: الاختبار** ⏱️ 6 ساعات

```yaml
سيناريوهات الاختبار:

1. الاتصال:
   - ✓ Terminal يتصل بـ WebSocket
   - ✓ عرض رسالة "Connected"
   
2. تنفيذ الأوامر:
   - ✓ تنفيذ: ls
   - ✓ تنفيذ: pwd
   - ✓ تنفيذ: echo "Hello"
   
3. Output:
   - ✓ عرض نتائج الأوامر
   - ✓ معالجة الأخطاء
   
4. Reconnection:
   - ✓ إعادة الاتصال عند قطع الاتصال
```

---

## 📝 Deliverables

- [ ] Terminal Component جاهز
- [ ] WebSocket integration يعمل
- [ ] تنفيذ أوامر حقيقية
- [ ] UI نظيف واحترافي
- [ ] HANDOFF للمطور 6

---

## ✅ معايير القبول

**يُقبل عندما**:
- [x] ✅ Terminal يفتح بدون أخطاء
- [x] ✅ يمكن تنفيذ أوامر bash
- [x] ✅ Output يعرض بشكل صحيح
- [x] ✅ WebSocket مستقر
- [x] ✅ Git Tag: `dev5_complete`

---

## 📊 تقدير الوقت

| المرحلة | الوقت |
|---------|-------|
| Phase 1: الإعداد | 4 ساعات |
| Phase 2: Terminal Component | 12 ساعات |
| Phase 3: WebSocket Server | 8 ساعات |
| Phase 4: الاختبار | 6 ساعات |
| Phase 5: Polish | 2 ساعات |
| **المجموع** | **32 ساعة (4-5 أيام)** |

---

**آخر تحديث**: 2025-11-18  
**الحالة**: ✅ جاهز للتنفيذ  
**تقدير الجهد**: 4-5 أيام (32 ساعة)
