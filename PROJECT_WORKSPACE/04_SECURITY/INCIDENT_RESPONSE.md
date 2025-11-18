# خطة الاستجابة للحوادث الأمنية (Incident Response Plan)

## 1. نظرة عامة

هذا المستند يحدد الإجراءات الواجب اتباعها عند اكتشاف حادثة أمنية.

---

## 2. تصنيف الحوادث

### P0 - Critical (حرج)
**الوصف**: اختراق أمني نشط، تسريب بيانات، ransomware  
**زمن الاستجابة**: فوري (< 15 دقيقة)  
**الإجراء**: تفعيل فريق الطوارئ الكامل

**أمثلة**:
- اختراق قاعدة البيانات وتسريب بيانات المستخدمين
- Ransomware attack على السيرفرات
- RCE (Remote Code Execution) vulnerability تُستغل بنشاط
- DDoS attack يُسقط الخدمة

### P1 - High (عالي)
**الوصف**: ثغرة أمنية خطيرة، محاولة اختراق  
**زمن الاستجابة**: < 1 ساعة  
**الإجراء**: تفعيل فريق الأمان

**أمثلة**:
- SQL Injection vulnerability مُكتشفة
- Privilege escalation bug
- محاولات login فاشلة مشبوهة (> 1000/min)
- تسريب API keys على GitHub

### P2 - Medium (متوسط)
**الوصف**: مشكلة أمنية محتملة  
**زمن الاستجابة**: < 24 ساعة  
**الإجراء**: التحقيق والتقييم

**أمثلة**:
- XSS vulnerability محدودة التأثير
- Outdated dependencies مع CVEs معروفة
- Misconfigured permissions
- Suspicious traffic patterns

### P3 - Low (منخفض)
**الوصف**: تحسين أمني  
**زمن الاستجابة**: < 7 أيام  
**الإجراء**: إضافة للـ backlog

**أمثلة**:
- Missing security headers
- Weak password policy
- No rate limiting على endpoint غير حساس

---

## 3. فريق الاستجابة (Incident Response Team)

### الأدوار

#### Incident Commander (قائد الحادثة)
- **المسؤولية**: القرارات الحاسمة، التنسيق العام
- **الاتصال**: الهاتف المباشر، Slack

#### Security Lead (رئيس الأمان)
- **المسؤولية**: التحليل الفني، تحديد الثغرات
- **المتطلبات**: خبرة في penetration testing

#### DevOps Lead (رئيس العمليات)
- **المسؤولية**: احتواء الحادثة، إصلاح الأنظمة
- **المتطلبات**: وصول كامل للسيرفرات

#### Communications Lead (رئيس التواصل)
- **المسؤولية**: إخطار المستخدمين والجهات المعنية
- **المتطلبات**: مهارات تواصل ممتازة

#### Legal Counsel (الاستشاري القانوني)
- **المسؤولية**: التأكد من الامتثال القانوني
- **المتطلبات**: خبرة في GDPR وقوانين حماية البيانات

---

## 4. مراحل الاستجابة

### المرحلة 1: الكشف والإبلاغ (Detection & Reporting)

#### مصادر الكشف
- Automated monitoring alerts
- User reports
- Security researchers
- Internal audit
- Penetration testing

#### الإبلاغ
```
Email: security@platform.com
Slack: #security-incidents (P0/P1 فقط)
Phone: +XXX-XXX-XXXX (P0 فقط)
```

#### المعلومات المطلوبة
```yaml
report:
  timestamp: "2025-11-18T12:34:56Z"
  reporter: "الاسم أو anonymous"
  severity: "P0/P1/P2/P3"
  description: "وصف تفصيلي"
  affected_systems: ["database", "api"]
  evidence: "logs, screenshots, PoC"
  reproduction_steps: "خطوات إعادة الإنتاج"
```

---

### المرحلة 2: التقييم والتصنيف (Assessment & Classification)

#### خطوات التقييم
1. **تأكيد الحادثة** - هل هي حادثة حقيقية أم False positive?
2. **تقييم الخطورة** - P0/P1/P2/P3
3. **تحديد النطاق** - ما الأنظمة المتأثرة؟
4. **تقدير التأثير** - كم مستخدم متأثر؟

#### قرار التصعيد
```python
if severity == "P0":
    activate_full_team()
    notify_ceo()
    
elif severity == "P1":
    activate_security_team()
    notify_cto()
    
elif severity == "P2":
    assign_to_security_engineer()
    
else:  # P3
    create_ticket()
```

---

### المرحلة 3: الاحتواء (Containment)

#### احتواء فوري (للـ P0/P1)
```bash
# عزل النظام المتأثر
iptables -A INPUT -s <attacker-ip> -j DROP

# إيقاف الخدمة المتأثرة مؤقتاً
systemctl stop <vulnerable-service>

# تدوير جميع API keys و Tokens
./scripts/rotate_all_tokens.sh

# تفعيل read-only mode للـ database
psql -c "ALTER DATABASE production SET default_transaction_read_only = on;"
```

#### احتواء طويل المدى
- تطبيق WAF rules جديدة
- تحديث Firewall policies
- Deploy temporary patches
- Enable additional monitoring

---

### المرحلة 4: الاستئصال (Eradication)

#### إزالة الثغرة
```bash
# تحديث التبعيات
npm audit fix
pip install --upgrade <package>

# تطبيق Security patch
git apply security-patch.diff

# إعادة بناء الصور (Docker)
docker build --no-cache -t app:secure .

# Scan مرة أخرى
snyk test
```

#### تنظيف الأنظمة
- حذف Backdoors
- إزالة Malicious code
- استعادة من Backup نظيف
- Reset passwords و tokens

---

### المرحلة 5: الاستعادة (Recovery)

#### خطوات الاستعادة
1. **اختبار الإصلاح** في بيئة الـ staging
2. **Deploy تدريجي** (Canary deployment)
3. **مراقبة مكثفة** لأي نشاط غير طبيعي
4. **استعادة الخدمات** بالتدريج

#### Rollback Plan
```yaml
rollback_triggers:
  - error_rate > 5%
  - latency > 2s (p95)
  - new_vulnerabilities_detected
  
rollback_procedure:
  1. git revert <commit-hash>
  2. docker pull app:last-stable
  3. kubectl rollout undo deployment/app
  4. verify health checks
```

---

### المرحلة 6: الدروس المستفادة (Post-Incident Review)

#### اجتماع المراجعة
**الموعد**: خلال 48 ساعة من حل الحادثة  
**الحضور**: جميع أعضاء فريق الاستجابة  
**المدة**: 1-2 ساعة

#### الأسئلة الرئيسية
1. **ما حدث؟** - Timeline تفصيلي
2. **لماذا حدث؟** - Root cause analysis
3. **كيف اكتشفناه؟** - هل الكشف كان سريعاً؟
4. **ما الذي نجح؟** - ما الإجراءات الفعالة؟
5. **ما الذي فشل؟** - أين كانت الثغرات؟
6. **كيف نمنع تكراره؟** - Action items

#### تقرير ما بعد الحادثة
```markdown
# Incident Report: [ID]

## Executive Summary
ملخص بسيط للحادثة (3-5 جمل)

## Timeline
- 12:00 - Incident detected
- 12:05 - Team notified
- 12:15 - Containment initiated
- 14:00 - Fix deployed
- 16:00 - Full recovery

## Root Cause
السبب الجذري للحادثة

## Impact
- Users affected: X
- Data leaked: Yes/No
- Downtime: X minutes
- Financial impact: $X

## Action Items
- [ ] Update dependency X
- [ ] Add monitoring for Y
- [ ] Improve documentation Z

## Lessons Learned
ما تعلمناه من هذه الحادثة
```

---

## 5. الإخطار والتواصل (Notification & Communication)

### المستخدمون المتأثرون
**متى**: خلال 72 ساعة (حسب GDPR)  
**كيف**: Email + In-app notification  
**ماذا**:
```
Subject: إخطار أمني مهم - اتخذ إجراءً

عزيزي [الاسم],

نكتب لإبلاغك بحادثة أمنية حدثت في [التاريخ] وربما أثرت على حسابك.

ما حدث:
[وصف موجز غير تقني]

البيانات المتأثرة:
- [قائمة بالبيانات]

ما فعلناه:
- [الإجراءات المتخذة]

ما يجب عليك فعله:
1. تغيير كلمة المرور فوراً
2. تفعيل MFA إن لم تكن مُفعلة
3. مراجعة نشاط الحساب

للأسئلة: support@platform.com

نعتذر عن أي إزعاج.

فريق الأمان
```

### الجهات التنظيمية
**GDPR**: الإبلاغ خلال 72 ساعة إذا كان هناك خطر على حقوق المستخدمين  
**الجهات المحلية**: حسب القوانين المحلية

### الإعلام
**متى**: للحوادث الكبيرة جداً فقط (P0 مع تأثير واسع)  
**كيف**: بيان صحفي رسمي  
**من**: Communications Lead + Legal Counsel

---

## 6. الأدوات والموارد

### Monitoring & Alerting
```yaml
tools:
  - Datadog (monitoring)
  - PagerDuty (alerting)
  - Sentry (error tracking)
  - ELK Stack (log analysis)
```

### Forensics
```yaml
tools:
  - Wireshark (network analysis)
  - Volatility (memory forensics)
  - Autopsy (disk forensics)
  - OSSEC (host intrusion detection)
```

### Communication
```yaml
channels:
  emergency: "#security-incidents" (Slack)
  status_page: status.platform.com
  email: security@platform.com
  phone: +XXX-XXX-XXXX (P0 only)
```

---

## 7. Playbooks لسيناريوهات شائعة

### Playbook: Data Breach
راجع `05_OPERATIONS/RUNBOOKS/data_breach.md`

### Playbook: DDoS Attack
راجع `05_OPERATIONS/RUNBOOKS/ddos_attack.md`

### Playbook: Ransomware
راجع `05_OPERATIONS/RUNBOOKS/ransomware.md`

### Playbook: API Key Leak
راجع `05_OPERATIONS/RUNBOOKS/api_key_leak.md`

---

## 8. جهات الاتصال للطوارئ

| الدور | الاسم | الهاتف | البريد |
|------|------|--------|--------|
| Incident Commander | [الاسم] | +XXX-XXX-XXXX | [email] |
| Security Lead | [الاسم] | +XXX-XXX-XXXX | [email] |
| DevOps Lead | [الاسم] | +XXX-XXX-XXXX | [email] |
| Legal Counsel | [الاسم] | +XXX-XXX-XXXX | [email] |

---

## 9. التدريبات (Drills)

### تدريبات ربع سنوية
- **Tabletop Exercise**: مناقشة سيناريو افتراضي
- **Simulated Attack**: هجوم وهمي للتدريب
- **Communication Drill**: اختبار قنوات التواصل

### قياس الأداء
```yaml
metrics:
  - mean_time_to_detect (MTTD): < 15 min
  - mean_time_to_respond (MTTR): < 1 hour
  - mean_time_to_recover (MTTR): < 4 hours
```

---

**آخر تحديث**: 2025-11-18  
**الإصدار**: 1.0  
**المسؤول**: Security Team  
**المراجعة القادمة**: 2026-02-18
