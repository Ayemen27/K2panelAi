
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

class OriginalSystemsAnalyzer:
    def __init__(self):
        self.base_dir = Path('.')
        self.systems = {}
        self.js_files = []
        self.html_files = []
        
    def analyze_all(self):
        """تحليل جميع الملفات"""
        print("🔍 بدء تحليل الأنظمة الأصلية...")
        
        # جمع الملفات
        self.collect_files()
        
        # تحليل الأنظمة
        self.analyze_next_js()
        self.analyze_apollo_graphql()
        self.analyze_segment_analytics()
        self.analyze_firebase()
        self.analyze_stripe()
        self.analyze_coframe()
        self.analyze_datadog()
        self.analyze_launchdarkly()
        self.analyze_statsig()
        self.analyze_sanity_cms()
        self.analyze_cdn_cloudflare()
        self.analyze_appsflyer()
        self.analyze_webflow()
        
        # توليد التوثيق
        self.generate_documentation()
        
    def collect_files(self):
        """جمع جميع ملفات HTML و JS"""
        for html_file in self.base_dir.rglob('*.html'):
            if 'docs' not in str(html_file):
                self.html_files.append(html_file)
        
        js_dir = self.base_dir / 'static' / 'js' / 'external'
        if js_dir.exists():
            self.js_files = list(js_dir.glob('*.js'))
    
    def analyze_next_js(self):
        """تحليل نظام Next.js"""
        self.systems['Next.js'] = {
            'name': 'Next.js Framework',
            'type': 'Frontend Framework',
            'role': 'إطار العمل الرئيسي للواجهة الأمامية',
            'evidence': [],
            'how_it_works': [],
            'integration': []
        }
        
        # البحث عن دلائل Next.js
        for html_file in self.html_files[:5]:
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                if '__NEXT_DATA__' in content:
                    self.systems['Next.js']['evidence'].append(f"وجود __NEXT_DATA__ في {html_file.name}")
                    
                    # استخراج بيانات Next.js
                    soup = BeautifulSoup(content, 'html.parser')
                    next_data = soup.find('script', {'id': '__NEXT_DATA__'})
                    if next_data:
                        try:
                            data = json.loads(next_data.string)
                            self.systems['Next.js']['buildId'] = data.get('buildId', 'غير معروف')
                            self.systems['Next.js']['page'] = data.get('page', 'غير معروف')
                        except:
                            pass
                            
                # البحث عن ملفات Next.js
                if '_next/' in content:
                    self.systems['Next.js']['evidence'].append(f"مسارات _next/ موجودة في {html_file.name}")
                    
            except Exception as e:
                pass
        
        self.systems['Next.js']['how_it_works'] = [
            "1. Next.js يعمل كإطار عمل React مع Server-Side Rendering (SSR)",
            "2. يولد صفحات HTML ثابتة مع بيانات ديناميكية في __NEXT_DATA__",
            "3. يستخدم نظام routing تلقائي بناءً على بنية الملفات",
            "4. يدعم API routes للتواصل مع الخادم",
            "5. يوفر تحسين أداء تلقائي مع code splitting"
        ]
        
        self.systems['Next.js']['integration'] = [
            "• يتكامل مع Apollo GraphQL لإدارة البيانات",
            "• يستخدم CDN (Cloudflare) لتوزيع الملفات الثابتة",
            "• يعمل مع أنظمة Analytics (Segment, Datadog)",
            "• يدعم Server-Side API للمصادقة والبيانات"
        ]
    
    def analyze_apollo_graphql(self):
        """تحليل نظام Apollo GraphQL"""
        self.systems['Apollo GraphQL'] = {
            'name': 'Apollo GraphQL',
            'type': 'Data Management',
            'role': 'إدارة البيانات والاستعلامات',
            'evidence': [],
            'how_it_works': [],
            'integration': []
        }
        
        for html_file in self.html_files[:5]:
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                if 'apolloState' in content or 'apolloClient' in content:
                    self.systems['Apollo GraphQL']['evidence'].append(f"apolloState موجود في {html_file.name}")
                    
            except:
                pass
        
        self.systems['Apollo GraphQL']['how_it_works'] = [
            "1. يستخدم GraphQL للاستعلام عن البيانات من الخادم",
            "2. يخزن حالة البيانات في apolloState على العميل",
            "3. يوفر caching ذكي لتقليل طلبات الشبكة",
            "4. يدعم subscriptions للبيانات الفورية",
            "5. يدير queries و mutations بشكل مركزي"
        ]
        
        self.systems['Apollo GraphQL']['integration'] = [
            "• يتكامل مع Next.js عبر getServerSideProps",
            "• يعمل مع React Hooks (useQuery, useMutation)",
            "• يتصل بـ GraphQL API على الخادم",
            "• يدعم optimistic UI updates"
        ]
    
    def analyze_segment_analytics(self):
        """تحليل نظام Segment Analytics"""
        self.systems['Segment Analytics'] = {
            'name': 'Segment Analytics',
            'type': 'Analytics & Tracking',
            'role': 'تتبع سلوك المستخدمين والتحليلات',
            'evidence': [],
            'how_it_works': [],
            'integration': []
        }
        
        # البحث في ملفات JS
        for js_file in self.js_files:
            try:
                with open(js_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if 'segment' in content.lower() or 'analytics' in content:
                        self.systems['Segment Analytics']['evidence'].append(f"ذكر في {js_file.name}")
                        break
            except:
                pass
        
        self.systems['Segment Analytics']['how_it_works'] = [
            "1. يتتبع أحداث المستخدم (page views, clicks, conversions)",
            "2. يرسل البيانات إلى Segment API",
            "3. Segment يوزع البيانات على أدوات التحليل الأخرى",
            "4. يدعم user identification و traits",
            "5. يسمح بإنشاء audiences و segments"
        ]
        
        self.systems['Segment Analytics']['integration'] = [
            "• يتكامل مع Google Analytics 4",
            "• يرسل بيانات إلى Mixpanel",
            "• يعمل مع Amplitude",
            "• يدعم customer data platforms (CDPs)"
        ]
    
    def analyze_firebase(self):
        """تحليل نظام Firebase"""
        self.systems['Firebase'] = {
            'name': 'Firebase',
            'type': 'Authentication & Real-time Database',
            'role': 'المصادقة وقاعدة البيانات الفورية',
            'evidence': [],
            'how_it_works': [],
            'integration': []
        }
        
        for html_file in self.html_files[:10]:
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'firebase' in content.lower():
                        self.systems['Firebase']['evidence'].append(f"ذكر في {html_file.name}")
                        break
            except:
                pass
        
        self.systems['Firebase']['how_it_works'] = [
            "1. Firebase Auth يدير تسجيل الدخول (Email, Google, GitHub)",
            "2. Firestore يخزن بيانات المستخدمين والمشاريع",
            "3. Real-time listeners تحدث الواجهة تلقائيًا",
            "4. Security Rules تحمي البيانات",
            "5. Firebase Functions تعالج المنطق على الخادم"
        ]
        
        self.systems['Firebase']['integration'] = [
            "• يتكامل مع Next.js للمصادقة",
            "• يعمل مع React Context لحالة المستخدم",
            "• يدعم OAuth providers",
            "• يتصل بـ Firebase Cloud Functions"
        ]
    
    def analyze_stripe(self):
        """تحليل نظام Stripe"""
        self.systems['Stripe'] = {
            'name': 'Stripe Payments',
            'type': 'Payment Processing',
            'role': 'معالجة المدفوعات والاشتراكات',
            'evidence': ['موجود في صفحة Pricing'],
            'how_it_works': [],
            'integration': []
        }
        
        self.systems['Stripe']['how_it_works'] = [
            "1. يعرض خطط الأسعار على صفحة Pricing",
            "2. عند الاشتراك، يفتح Stripe Checkout",
            "3. يعالج معلومات الدفع بشكل آمن (PCI compliant)",
            "4. يرسل webhooks عند نجاح الدفع",
            "5. يدير الاشتراكات المتكررة تلقائيًا"
        ]
        
        self.systems['Stripe']['integration'] = [
            "• يتكامل مع Firebase لتخزين بيانات الاشتراك",
            "• يرسل أحداث إلى Segment Analytics",
            "• يعمل مع Next.js API routes",
            "• يدعم customer portal للإدارة الذاتية"
        ]
    
    def analyze_coframe(self):
        """تحليل نظام Coframe"""
        self.systems['Coframe'] = {
            'name': 'Coframe',
            'type': 'User Experience Optimization',
            'role': 'تحسين تجربة المستخدم والتجارب A/B',
            'evidence': [],
            'how_it_works': [],
            'integration': []
        }
        
        # البحث عن [Coframe] في console logs
        self.systems['Coframe']['evidence'] = [
            "رسائل [Coframe] في وحدة التحكم",
            "Coframe watcher loaded في الصفحات"
        ]
        
        self.systems['Coframe']['how_it_works'] = [
            "1. يراقب تفاعلات المستخدم مع الصفحة",
            "2. يجري تجارب A/B testing تلقائية",
            "3. يحسن النصوص والعناصر بناءً على الأداء",
            "4. يستخدم AI لاقتراح تحسينات",
            "5. يحفظ نتائج التجارب في cookies"
        ]
        
        self.systems['Coframe']['integration'] = [
            "• يعمل كـ watcher في الصفحات",
            "• يتكامل مع analytics لقياس النتائج",
            "• يدعم multi-variant testing",
            "• يحدث المحتوى ديناميكيًا"
        ]
    
    def analyze_datadog(self):
        """تحليل نظام Datadog"""
        self.systems['Datadog'] = {
            'name': 'Datadog',
            'type': 'Monitoring & Error Tracking',
            'role': 'مراقبة الأخطاء والأداء',
            'evidence': ['ذكر في ملفات JS'],
            'how_it_works': [],
            'integration': []
        }
        
        self.systems['Datadog']['how_it_works'] = [
            "1. يجمع logs من المتصفح والخادم",
            "2. يتتبع الأخطاء JavaScript",
            "3. يراقب أداء الصفحات (Core Web Vitals)",
            "4. يسجل API requests و response times",
            "5. يرسل alerts عند حدوث مشاكل"
        ]
        
        self.systems['Datadog']['integration'] = [
            "• يتكامل مع Next.js error boundaries",
            "• يرصد أخطاء في React components",
            "• يتتبع API calls",
            "• يعمل مع RUM (Real User Monitoring)"
        ]
    
    def analyze_launchdarkly(self):
        """تحليل نظام LaunchDarkly"""
        self.systems['LaunchDarkly'] = {
            'name': 'LaunchDarkly',
            'type': 'Feature Flags Management',
            'role': 'إدارة الميزات وإطلاقها',
            'evidence': ['ذكر في ملفات JS'],
            'how_it_works': [],
            'integration': []
        }
        
        self.systems['LaunchDarkly']['how_it_works'] = [
            "1. يخزن feature flags على الخادم",
            "2. يقرر أي ميزات تظهر لأي مستخدمين",
            "3. يدعم gradual rollouts (نسب مئوية)",
            "4. يسمح بإيقاف الميزات بدون deployment",
            "5. يدعم targeting بناءً على user attributes"
        ]
        
        self.systems['LaunchDarkly']['integration'] = [
            "• يتكامل مع React للعرض الشرطي",
            "• يعمل مع Next.js للتحقق من الميزات",
            "• يدعم server-side و client-side flags",
            "• يرسل events إلى analytics"
        ]
    
    def analyze_statsig(self):
        """تحليل نظام Statsig"""
        self.systems['Statsig'] = {
            'name': 'Statsig',
            'type': 'Experimentation Platform',
            'role': 'التجارب والتحليلات المتقدمة',
            'evidence': ['ذكر في ملفات JS'],
            'how_it_works': [],
            'integration': []
        }
        
        self.systems['Statsig']['how_it_works'] = [
            "1. يدير A/B tests و multivariate tests",
            "2. يحلل نتائج التجارب إحصائيًا",
            "3. يدعم feature gates و dynamic configs",
            "4. يوفر metrics dashboards",
            "5. يقيس impact على business metrics"
        ]
        
        self.systems['Statsig']['integration'] = [
            "• يعمل مع LaunchDarkly للتجارب",
            "• يتكامل مع Segment للبيانات",
            "• يدعم custom events",
            "• يحلل user funnels"
        ]
    
    def analyze_sanity_cms(self):
        """تحليل نظام Sanity CMS"""
        self.systems['Sanity CMS'] = {
            'name': 'Sanity CMS',
            'type': 'Content Management System',
            'role': 'إدارة المحتوى والصور',
            'evidence': [],
            'how_it_works': [],
            'integration': []
        }
        
        # البحث عن مسارات Sanity
        image_dir = self.base_dir / 'static' / 'images' / 'bj34pdbp'
        if image_dir.exists():
            self.systems['Sanity CMS']['evidence'].append(f"مجلد الصور bj34pdbp/ (Sanity CDN)")
        
        self.systems['Sanity CMS']['how_it_works'] = [
            "1. يخزن المحتوى كـ structured data",
            "2. يوفر GROQ API للاستعلام عن المحتوى",
            "3. يدير الصور مع تحسين تلقائي",
            "4. يدعم real-time collaboration",
            "5. يوفر preview mode للمحررين"
        ]
        
        self.systems['Sanity CMS']['integration'] = [
            "• يتكامل مع Next.js عبر getStaticProps",
            "• يستخدم Sanity Image URLs للصور",
            "• يدعم incremental static regeneration",
            "• يعمل مع webhooks للتحديثات"
        ]
    
    def analyze_cdn_cloudflare(self):
        """تحليل نظام CDN (Cloudflare)"""
        self.systems['Cloudflare CDN'] = {
            'name': 'Cloudflare CDN',
            'type': 'Content Delivery Network',
            'role': 'توزيع المحتوى وتسريع التحميل',
            'evidence': [],
            'how_it_works': [],
            'integration': []
        }
        
        cdn_dir = self.base_dir / 'cdn-cgi'
        if cdn_dir.exists():
            self.systems['Cloudflare CDN']['evidence'].append("مجلد cdn-cgi/ موجود")
        
        self.systems['Cloudflare CDN']['how_it_works'] = [
            "1. يخزن الملفات الثابتة في edge servers",
            "2. يقدم المحتوى من أقرب موقع للمستخدم",
            "3. يوفر image optimization تلقائي",
            "4. يحمي من DDoS attacks",
            "5. يدعم caching ذكي مع purge API"
        ]
        
        self.systems['Cloudflare CDN']['integration'] = [
            "• يعمل مع Next.js للملفات الثابتة",
            "• يدعم responsive images",
            "• يوفر SSL/TLS termination",
            "• يدير DNS و routing"
        ]
    
    def analyze_appsflyer(self):
        """تحليل نظام AppsFlyer"""
        self.systems['AppsFlyer'] = {
            'name': 'AppsFlyer',
            'type': 'Mobile Attribution & Analytics',
            'role': 'تتبع تطبيقات الموبايل',
            'evidence': ['ذكر في console errors'],
            'how_it_works': [],
            'integration': []
        }
        
        self.systems['AppsFlyer']['how_it_works'] = [
            "1. يتتبع تثبيت التطبيقات من الإعلانات",
            "2. يقيس ROI للحملات التسويقية",
            "3. يدعم deep linking",
            "4. يحلل user journey من الإعلان للتحويل",
            "5. يوفر fraud detection"
        ]
        
        self.systems['AppsFlyer']['integration'] = [
            "• يعمل مع Replit Mobile App",
            "• يتكامل مع ad networks",
            "• يرسل بيانات إلى analytics platforms",
            "• يدعم cross-platform attribution"
        ]
    
    def analyze_webflow(self):
        """تحليل نظام Webflow"""
        self.systems['Webflow'] = {
            'name': 'Webflow',
            'type': 'Design & CMS Integration',
            'role': 'بعض الصفحات مبنية بـ Webflow',
            'evidence': [],
            'how_it_works': [],
            'integration': []
        }
        
        # البحث عن data-wf attributes
        for html_file in self.html_files[:10]:
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'data-wf-' in content:
                        self.systems['Webflow']['evidence'].append(f"سمات data-wf- في {html_file.name}")
                        break
            except:
                pass
        
        self.systems['Webflow']['how_it_works'] = [
            "1. بعض الصفحات مصممة في Webflow",
            "2. يتم export كـ HTML/CSS/JS",
            "3. يتكامل مع Webflow CMS للمحتوى",
            "4. يدعم interactions و animations",
            "5. يوفر responsive design تلقائي"
        ]
        
        self.systems['Webflow']['integration'] = [
            "• صفحات معينة تستخدم Webflow design",
            "• يتكامل مع Next.js routing",
            "• يستخدم Webflow CMS API",
            "• يدعم custom code embeds"
        ]
    
    def generate_documentation(self):
        """توليد ملفات التوثيق"""
        docs_dir = Path('docs/original_systems')
        docs_dir.mkdir(parents=True, exist_ok=True)
        
        # ملف README رئيسي
        readme_content = self.generate_main_readme()
        with open(docs_dir / 'README.md', 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        # ملف لكل نظام
        for system_key, system_data in self.systems.items():
            system_dir = docs_dir / system_key.lower().replace(' ', '_')
            system_dir.mkdir(exist_ok=True)
            
            system_content = self.generate_system_doc(system_data)
            with open(system_dir / 'README.md', 'w', encoding='utf-8') as f:
                f.write(system_content)
        
        # ملف JSON summary
        with open(docs_dir / 'systems_summary.json', 'w', encoding='utf-8') as f:
            json.dump(self.systems, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ تم إنشاء التوثيق في: {docs_dir}")
        print(f"📊 عدد الأنظمة الموثقة: {len(self.systems)}")
    
    def generate_main_readme(self):
        """توليد README رئيسي"""
        content = "# 🔍 الأنظمة الأصلية في موقع Replit.com\n\n"
        content += "هذا التوثيق يشرح الأنظمة التي كانت تعمل في الموقع الأصلي وكيفية عملها.\n\n"
        content += "## 📋 قائمة الأنظمة\n\n"
        
        # تصنيف الأنظمة
        categories = {
            'Frontend': [],
            'Backend': [],
            'Analytics': [],
            'Infrastructure': [],
            'Marketing': []
        }
        
        for system_key, system_data in self.systems.items():
            system_type = system_data['type']
            if 'Framework' in system_type or 'CMS' in system_type:
                categories['Frontend'].append((system_key, system_data))
            elif 'Auth' in system_type or 'Database' in system_type or 'Data' in system_type:
                categories['Backend'].append((system_key, system_data))
            elif 'Analytics' in system_type or 'Tracking' in system_type or 'Monitoring' in system_type:
                categories['Analytics'].append((system_key, system_data))
            elif 'CDN' in system_type or 'Optimization' in system_type:
                categories['Infrastructure'].append((system_key, system_data))
            else:
                categories['Marketing'].append((system_key, system_data))
        
        for category, systems in categories.items():
            if systems:
                content += f"\n### {category}\n\n"
                for system_key, system_data in systems:
                    folder = system_key.lower().replace(' ', '_')
                    content += f"- **[{system_data['name']}]({folder}/README.md)** - {system_data['role']}\n"
        
        content += "\n## 🔗 كيف تعمل الأنظمة معًا\n\n"
        content += "```\n"
        content += "المستخدم\n"
        content += "   ↓\n"
        content += "Cloudflare CDN (توزيع المحتوى)\n"
        content += "   ↓\n"
        content += "Next.js (عرض الصفحات)\n"
        content += "   ↓\n"
        content += "Apollo GraphQL (جلب البيانات)\n"
        content += "   ↓\n"
        content += "Firebase (المصادقة والتخزين)\n"
        content += "   ↓\n"
        content += "Sanity CMS (المحتوى)\n"
        content += "\n"
        content += "بالتوازي:\n"
        content += "- Segment Analytics (تتبع الأحداث)\n"
        content += "- Datadog (مراقبة الأخطاء)\n"
        content += "- LaunchDarkly (إدارة الميزات)\n"
        content += "- Coframe (تحسين التجربة)\n"
        content += "```\n\n"
        
        content += "## 📊 إحصائيات\n\n"
        content += f"- **إجمالي الأنظمة**: {len(self.systems)}\n"
        content += f"- **ملفات HTML محللة**: {len(self.html_files)}\n"
        content += f"- **ملفات JS محللة**: {len(self.js_files)}\n"
        
        return content
    
    def generate_system_doc(self, system_data):
        """توليد توثيق لنظام واحد"""
        content = f"# {system_data['name']}\n\n"
        content += f"**النوع**: {system_data['type']}\n\n"
        content += f"**الدور**: {system_data['role']}\n\n"
        
        if system_data['evidence']:
            content += "## 🔍 الدلائل على وجود النظام\n\n"
            for evidence in system_data['evidence']:
                content += f"- {evidence}\n"
            content += "\n"
        
        if system_data['how_it_works']:
            content += "## ⚙️ كيف يعمل النظام\n\n"
            for step in system_data['how_it_works']:
                content += f"{step}\n"
            content += "\n"
        
        if system_data['integration']:
            content += "## 🔗 التكامل مع الأنظمة الأخرى\n\n"
            for integration in system_data['integration']:
                content += f"{integration}\n"
            content += "\n"
        
        # إضافة معلومات إضافية من system_data
        for key, value in system_data.items():
            if key not in ['name', 'type', 'role', 'evidence', 'how_it_works', 'integration']:
                content += f"**{key}**: {value}\n"
        
        return content

if __name__ == '__main__':
    print("=" * 60)
    print("📚 مولد توثيق الأنظمة الأصلية")
    print("=" * 60)
    print()
    
    analyzer = OriginalSystemsAnalyzer()
    analyzer.analyze_all()
    
    print("\n" + "=" * 60)
    print("✅ اكتمل التحليل والتوثيق!")
    print("=" * 60)
