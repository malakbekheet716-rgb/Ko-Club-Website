/**
 * KODE Sports Club — Employee Hub
 * Main Application & SPA Router Controller (js/app.js)
 * 
 * Manages bilingual i18n dictionaries, auth-state transitions, view rendering,
 * dynamic 12-state theme engine, touch/mouse swipe feed, and KODE Buddy companions.
 */

// =========================================================
// MODULE 1: DOM REFERENCES & INITIAL STATE
// =========================================================
const content = document.getElementById('content'),
      toast = document.getElementById('toast'),
      drawer = document.getElementById('drawer'),
      modal = document.getElementById('modal');

let page = localStorage.getItem('kode-active-page') || 'home',
    adminActiveTab = 'employees',
    dark = localStorage.getItem('kode-mode') !== 'light',
    arabic = localStorage.getItem('kode-lang') === 'ar',
    feedIndex = 0,
    currentUser = null;

// Apply initial language & theme classes
document.body.classList.toggle('dark', dark);
document.body.classList.toggle('rtl', arabic);
document.documentElement.dir = arabic ? 'rtl' : 'ltr';

// =========================================================
// =========================================================
// MODULE 2: BILINGUAL I18N LOCALIZATION DICTIONARY
// =========================================================
const i18n = {
  en: {
    brandMain: "KODE",
    brandSub: "SPORTS CLUB",
    navHome: "Dashboard",
    navNews: "News",
    navDept: "My Department",
    navEvents: "Events",
    navResources: "Resources & Guidelines",
    navContacts: "Contacts",
    navFaqs: "FAQs",
    navAdmin: "Admin Panel",
    navFeedback: "Feedback",
    navRecognition: "Recognition",
    navSettings: "Settings",
    navLogout: "Log out",
    searchPlaceholder: "What are you looking for? (Ctrl K)",
    switchRole: "Switch Role",
    notifications: "Notifications",
    dailyFeed: "YOUR DAILY FEED",
    todayAtKode: "Today at KODE",
    recentNewsEvents: "Recent News & Events",
    of: "of",
    prev: "Previous",
    next: "Next",
    details: "Details",
    clubNews: "Club news",
    deptUpdate: "Department update",
    officialAnnouncement: "Official Announcement",
    event: "Event",
    comments: "Comments",
    discuss: "Discuss",
    openResource: "Open resource",
    contact: "Contact",
    readAnswer: "Read answer →",
    submitQuestion: "Submit Question",
    submitFeedback: "Submit Feedback",
    grantAward: "+ Grant an Award",
    yourTrophyRoom: "Your Trophy Room",
    totalPoints: "Total Points Earned",
    addEmployee: "+ Add Employee",
    addDepartment: "Add Department",
    adminHubTitle: "Admin & HR Management Hub",
    adminHubSub: "Manage club employees, departments, access roles, and permissions in one place.",
    totalPersonnel: "Total Personnel",
    activeDepts: "Active Departments",
    systemRoles: "System Roles",
    tabEmployees: "Employees",
    tabDepartments: "Departments",
    tabRoles: "Roles & Permissions",
    searchEmpPlaceholder: "Search by name or email...",
    allDepartments: "All Departments",
    createDeptBtn: "Create Department",
    createRoleBtn: "Create Role",
    assignedEmployees: "Assigned Employees",
    assignedUsers: "Assigned Users",
    deptNamePlaceholder: "e.g. Aquatics & Swimming, Fitness",
    roleNamePlaceholder: "e.g. Head Coach, Shift Supervisor",
    activeStatus: "Active",
    fullAccess: "Full Access",
    employeeNamePlaceholder: "Employee Full Name",
    employeeEmailPlaceholder: "Email (e.g. name@kodeclub.com)",
    addRole: "Add Access Role",
    manageRoles: "Manage Roles",
    currentDepts: "Current Departments",
    allEmployees: "All Employees",
    orgHierarchy: "Organization Hierarchy",
    reportingLines: "Reporting lines for",
    deptManagers: "Department Managers",
    teamLeads: "Team Leads & Specialists",
    colleagues: "Colleagues",
    privateWorkspace: "PRIVATE WORKSPACE",
    privateContentFor: "Private content for employees assigned to",
    otherDeptsHidden: "Other departments are not visible here.",
    deptNews: "Department News",
    askDept: "Ask Your Department",
    askPlaceholder: "What do you need help with?",
    askDetailsPlaceholder: "Add more details (optional)",
    askVisibility: "Your question is visible only to colleagues and department admins.",
    authSignInTab: "Sign In",
    authSignUpTab: "Sign Up (First Time)",
    loginTitle: "Welcome to Employee Hub",
    loginSub: "Sign in with your Employee ID, registered name, or email.",
    loginIdLabel: "Employee ID, Name, or Email",
    loginPassLabel: "Password",
    loginInputPlaceholder: "e.g. EMP001, Malak Hussein, or malak@kode.club",
    loginBtn: "Enter Employee Hub",
    signupTitle: "Create Employee Account",
    signupSub: "Register your profile to access your department workspace.",
    signupNameLabel: "Full Name",
    signupNamePlaceholder: "e.g. Mohamed Ali",
    signupEmailLabel: "Work Email",
    signupEmailPlaceholder: "e.g. mohamed@kode.club",
    signupDeptLabel: "Department",
    signupRoleLabel: "Job Role",
    signupPassLabel: "Password",
    signupPassPlaceholder: "Default: kode123 (or choose your own)",
    signupBtn: "Create Account & Enter Hub",
    quickDemoLabel: "⚡ 1-Click Quick Demo Sign In:",
    haveAccount: "Already registered? Sign In",
    firstTimeHere: "First time here? Sign Up",
    loginFooter: "🔒 Restricted to active KODE personnel. Unregistered? Sign up above or contact HR.",
    settingsTitle: "Settings & Preferences",
    settingsSub: "Personalize your background, theme, language, account profile, and notification alerts.",
    secBgMode: "Desktop Background Style",
    secBgModeSub: "Choose between the cosmic galaxy, original crystal, or a pure minimalist solid theme.",
    bgGalaxy: "🌌 Cosmic Galaxy (Default)",
    bgCrystal: "💎 3D Crystal (Original)",
    bgClean: "🎨 Minimalist Theme Only",
    secProfile: "Profile & Fast Account Switcher",
    secProfileSub: "Switch between registered employee accounts for testing and verification.",
    secAppearance: "Appearance & Theme",
    secAppearanceSub: "Toggle between Dark and Light mode or choose a custom color palette.",
    secLang: "Language & Region",
    secLangSub: "Switch between English (LTR) and Arabic (RTL) across all modules.",
    secNotifs: "Notification Preferences",
    secNotifsSub: "Configure notification alerts and department activity feeds.",
    langOption: "Language · English / العربية",
    appearanceOption: "Appearance · Light / Dark",
    themeOption: "Theme Palette",
    notifPrefOption: "Notification preferences",
    done: "Done",
    discussionThread: "Discussion Thread",
    noComments: "No comments yet. Be the first to start the conversation!",
    writeComment: "Write a comment...",
    post: "Post",
    anonymous: "Submit anonymously",
    tellUs: "Tell us what you think...",
    whoToContact: "Who do I contact?",
    whoToContactSub: "Find the right person without searching through the whole organization.",
    searchContactPlaceholder: "Search by team, service or person...",
    availableInternal: "Available · Internal contact",
    policies: "Policies & Guidelines",
    procedures: "Procedures",
    forms: "Forms & Templates",
    all: "All",
    newsSub: "Official club announcements and private department discussions.",
    eventsSub: "Personalized calendar combining club events with department schedules.",
    resourcesSub: "Policies, operational procedures, guidelines, and downloadable templates.",
    faqsSub: "General answers plus questions relevant to your department.",
    feedbackSub: "Your voice matters. Submit a suggestion, problem or improvement idea.",
    recognitionSub: "Celebrate colleagues who make a difference.",
    adminSub: "Manage users, roles, and departments.",
    roleEmployee: "Employee",
    roleManager: "Manager",
    roleAdmin: "Admin",
    roleHR: "HR",
    toastAr: "تم تفعيل اللغة العربية",
    toastEn: "English language enabled",
    toastDark: "Dark mode enabled",
    toastLight: "Light mode enabled"
  },
  ar: {
    brandMain: "كود",
    brandSub: "نادي رياضي",
    navHome: "لوحة التحكم",
    navNews: "الأخبار",
    navDept: "إدارتي",
    navEvents: "الفعاليات",
    navResources: "المصادر والإرشادات",
    navContacts: "دليل الاتصال",
    navFaqs: "الأسئلة الشائعة",
    navAdmin: "لوحة الإدارة",
    navFeedback: "المقترحات والملاحظات",
    navRecognition: "التقدير والجوائز",
    navSettings: "الإعدادات",
    navLogout: "تسجيل الخروج",
    searchPlaceholder: "عن ماذا تبحث؟ (Ctrl K)",
    switchRole: "تبديل الحساب",
    notifications: "الإشعارات",
    dailyFeed: "موجزك اليومي",
    todayAtKode: "اليوم في كود",
    recentNewsEvents: "أحدث الأخبار والفعاليات",
    of: "من",
    prev: "السابق",
    next: "التالي",
    details: "التفاصيل",
    clubNews: "أخبار النادي العامة",
    deptUpdate: "تحديث الإدارة",
    officialAnnouncement: "إعلان رسمي عام",
    event: "فعالية",
    comments: "التعليقات",
    discuss: "مناقشة",
    openResource: "فتح الملف",
    contact: "تواصل",
    readAnswer: "قراءة الإجابة ←",
    submitQuestion: "إرسال السؤال",
    submitFeedback: "إرسال المقترح",
    grantAward: "+ منح مكافأة / تقدير",
    yourTrophyRoom: "سجل إنجازاتك وجوائزك",
    totalPoints: "إجمالي النقاط المكتسبة",
    addEmployee: "+ إضافة موظف",
    addDepartment: "إضافة إدارة جديدة",
    adminHubTitle: "مركز إدارة النادي والموارد البشرية",
    adminHubSub: "إدارة موظفي النادي، الأقسام والإدارات، والأدوار والصلاحيات في مكان واحد.",
    totalPersonnel: "إجمالي الكادر",
    activeDepts: "الإدارات النشطة",
    systemRoles: "الأدوار والصلاحيات",
    tabEmployees: "الموظفون",
    tabDepartments: "الأقسام والإدارات",
    tabRoles: "الأدوار والصلاحيات",
    searchEmpPlaceholder: "بحث بالاسم أو البريد الإلكتروني...",
    allDepartments: "كافة الإدارات",
    createDeptBtn: "إنشاء إدارة",
    createRoleBtn: "إنشاء دور وصلاحية",
    assignedEmployees: "موظفين معينين",
    assignedUsers: "مستخدمين معينين",
    deptNamePlaceholder: "مثال: أكاديمية السباحة، اللياقة البدنية",
    roleNamePlaceholder: "مثال: مدرب رئيسي، مشرف قسم",
    activeStatus: "نشط",
    fullAccess: "صلاحية كاملة",
    employeeNamePlaceholder: "اسم الموظف الكامل",
    employeeEmailPlaceholder: "البريد الإلكتروني (مثال: name@kodeclub.com)",
    addRole: "إضافة دور وصلاحية جديدة",
    manageRoles: "إدارة الأدوار والصلاحيات",
    currentDepts: "الإدارات الحالية",
    allEmployees: "جميع موظفي النادي",
    orgHierarchy: "الهيكل التنظيمي للإدارة",
    reportingLines: "التسلسل الإداري لإدارة",
    deptManagers: "مدراء الإدارة",
    teamLeads: "رؤساء الفرق والأخصائيين",
    colleagues: "الزملاء وفريق العمل",
    privateWorkspace: "مساحة العمل الخاصة",
    privateContentFor: "محتوى خاص ومخصص لموظفي إدارة",
    otherDeptsHidden: "بيانات الإدارات الأخرى غير معروضة هنا لضمان الخصوصية.",
    deptNews: "أخبار وتحديثات الإدارة",
    askDept: "اسأل إدارتك",
    askPlaceholder: "بماذا تحتاج مساعدة اليوم؟",
    askDetailsPlaceholder: "أضف مزيداً من التفاصيل (اختياري)",
    askVisibility: "سؤالك مرئي فقط لزملائك في الإدارة ومسؤولي القسم.",
    authSignInTab: "تسجيل الدخول",
    authSignUpTab: "حساب جديد (لأول مرة)",
    loginTitle: "مرحباً بك في بوابة موظفي كود",
    loginSub: "تسجيل الدخول عبر الرقم الوظيفي، الاسم المسجل، أو البريد.",
    loginIdLabel: "الرقم الوظيفي أو الاسم أو البريد",
    loginPassLabel: "كلمة المرور",
    loginInputPlaceholder: "مثال: EMP001 أو ملاك حسين أو malak@kode.club",
    loginBtn: "دخول بوابة الموظفين",
    signupTitle: "إنشاء حساب موظف جديد",
    signupSub: "سجل بياناتك للوصول إلى مساحة عمل إدارتك ولوحة النادي.",
    signupNameLabel: "الاسم الكامل",
    signupNamePlaceholder: "مثال: محمد علي",
    signupEmailLabel: "البريد الإلكتروني للعمل",
    signupEmailPlaceholder: "مثال: mohamed@kode.club",
    signupDeptLabel: "الإدارة / القسم",
    signupRoleLabel: "الدور الوظيفي",
    signupPassLabel: "كلمة المرور",
    signupPassPlaceholder: "الافتراضية: kode123 (أو اختر كلمة مرورك)",
    signupBtn: "إنشاء الحساب والدخول للبوابة",
    quickDemoLabel: "⚡ دخول سريع بنقرة واحدة (حسابات تجريبية):",
    haveAccount: "لديك حساب بالفعل؟ تسجيل الدخول",
    firstTimeHere: "زيارتك الأولى للنادي؟ سجل حسابك",
    loginFooter: "🔒 الخدمة مخصصة حصرياً لمنسوبي نادي كود. لست مسجلاً؟ أنشئ حسابك بالأعلى أو تواصل مع HR.",
    settingsTitle: "الإعدادات وتفضيلات النظام",
    settingsSub: "تخصيص نمط الخلفية، المظهر، اللغة، الحساب، وتفضيلات الإشعارات.",
    secBgMode: "نمط خلفية سطح المكتب",
    secBgModeSub: "اختر بين مجرة الفضاء السديمية، الكريستال الأصلي، أو النمط البسيط المعتمد على ألوان السمة.",
    bgGalaxy: "🌌 مجرة الفضاء (الافتراضي)",
    bgCrystal: "💎 الكريستال 3D (الأصلي)",
    bgClean: "🎨 ألوان السمة فقط (بدون صورة)",
    secProfile: "الملف الشخصي وتبديل الحسابات",
    secProfileSub: "التبديل الفوري بين حسابات الموظفين المسجلة لسهولة التجربة.",
    secAppearance: "المظهر ولوحة الألوان",
    secAppearanceSub: "التبديل بين الوضع الداكن والفاتح واختيار طابع الألوان المفضل.",
    secLang: "اللغة واتجاه العرض",
    secLangSub: "التبديل بين العربية والإنجليزية مع التكيف التلقائي للواجهة.",
    secNotifs: "تفضيلات الإشعارات والتنبيهات",
    secNotifsSub: "ضبط تنبيهات التحديثات الخاصة بإدارتك وإعلانات النادي.",
    langOption: "اللغة · English / العربية",
    appearanceOption: "المظهر · فاتح / داكن",
    themeOption: "لوحة الألوان والمظهر",
    notifPrefOption: "تفضيلات الإشعارات والتنبيهات",
    done: "تم والحفظ",
    discussionThread: "سلسلة النقاش والاستفسارات",
    noComments: "لا توجد تعليقات حتى الآن. كن أول من يطرح استفساراً!",
    writeComment: "اكتب تعليقك أو استفسارك هنا...",
    post: "نشر التعليق",
    anonymous: "إرسال بهوية مجهولة",
    tellUs: "شاركنا برأيك أو مقترحك لتطوير بيئة العمل...",
    whoToContact: "دليل التواصل والمساعدة",
    whoToContactSub: "تواصل مع الشخص المسؤول أو القسم المختص مباشرة وبكل سهولة.",
    searchContactPlaceholder: "ابحث بالاسم، القسم، أو نوع الخدمة...",
    availableInternal: "متاح الآن · جهة اتصال داخلية",
    policies: "السياسات والإرشادات",
    procedures: "الإجراءات",
    forms: "النماذج والقوالب",
    all: "الكل",
    newsSub: "إعلانات النادي الرسمية والنقاشات الخاصة بإدارتك.",
    eventsSub: "تقويمك المخصص يجمع فعاليات النادي الرياضية مع أنشطة إدارتك.",
    resourcesSub: "السياسات والإجراءات والنماذج الرسمية والإرشادات التشغيلية للنادي.",
    faqsSub: "إجابات وافية على أكثر الأسئلة شيوعاً الخاصة بالنادي وإدارتك.",
    feedbackSub: "صوتك مسموع. شاركنا باقتراح، فكرة تطوير، أو بلاغ لتحسين العمل.",
    recognitionSub: "نحتفي بالزملاء المتميزين الذين يصنعون الفارق كل يوم.",
    adminSub: "إدارة بيانات الموظفين، الأدوار الوظيفية، والأقسام.",
    roleEmployee: "موظف",
    roleManager: "مدير",
    roleAdmin: "مسؤول نظام",
    roleHR: "موارد بشرية",
    toastAr: "تم تفعيل اللغة العربية",
    toastEn: "English language enabled",
    toastDark: "تم تفعيل الوضع الداكن",
    toastLight: "تم تفعيل الوضع الفاتح"
  }
};

function t(key) {
  const lang = arabic ? 'ar' : 'en';
  return (i18n[lang] && i18n[lang][key]) || (i18n.en && i18n.en[key]) || key;
}

function tDept(dept) {
  if (!dept) return '';
  if (!arabic) {
    const revMap = {
      'التسويق': 'Marketing', 'الموارد البشرية': 'HR', 'تكنولوجيا المعلومات': 'Tech',
      'الأمن والسلامة': 'Safety', 'سلامة الغذاء': 'Food Safety', 'العلاقات العامة': 'PR',
      'المجتمع': 'Community', 'خدمة المجتمع': 'Community', 'السباحة': 'Swimming',
      'أكاديمية السباحة': 'Swimming', 'اللياقة البدنية': 'Fitness', 'الخدمات الطبية': 'Medical',
      'المالية': 'Finance', 'العمليات والملاعب': 'Operations', 'كافة النادي': 'General'
    };
    return revMap[dept] || dept;
  }
  const deptMap = {
    'Marketing': 'التسويق',
    'HR': 'الموارد البشرية',
    'Tech': 'تكنولوجيا المعلومات',
    'Safety': 'الأمن والسلامة',
    'Food Safety': 'سلامة الغذاء',
    'PR': 'العلاقات العامة',
    'Community': 'خدمة المجتمع',
    'Swimming': 'أكاديمية السباحة',
    'Aquatics & Swimming': 'أكاديمية السباحة',
    'Fitness': 'اللياقة البدنية والجمباز',
    'Fitness & Gym': 'اللياقة البدنية والجمباز',
    'Medical': 'الخدمات الطبية والتأهيل',
    'Medical & Physio': 'الخدمات الطبية والتأهيل',
    'Finance': 'الإدارة المالية والمحاسبة',
    'Operations': 'العمليات والملاعب',
    'Operations & Courts': 'العمليات والملاعب',
    'General': 'كافة النادي',
    'All Club': 'كافة النادي'
  };
  return deptMap[dept] || dept;
}

function tRole(role) {
  if (!role) return '';
  if (!arabic) {
    const revMap = {
      'مسؤول نظام': 'Admin', 'مسؤول موارد بشرية': 'HR', 'موارد بشرية': 'HR',
      'مدير': 'Manager', 'مدير إدارة': 'Manager', 'موظف': 'Employee',
      'مدرب رئيسي': 'Head Coach', 'مدرب لياقة': 'Fitness Trainer',
      'مشرف قسم': 'Supervisor', 'أخصائي علاج طبيعي': 'Physiotherapist',
      'رئيس فريق': 'Team Lead', 'أخصائي': 'Specialist'
    };
    return revMap[role] || role;
  }
  const roleMap = {
    'Admin': 'مسؤول نظام',
    'HR': 'مسؤول موارد بشرية',
    'Manager': 'مدير إدارة',
    'Employee': 'موظف',
    'Head Coach': 'مدرب رئيسي',
    'Fitness Trainer': 'مدرب لياقة بدنية',
    'Supervisor': 'مشرف قسم',
    'Physiotherapist': 'أخصائي علاج طبيعي',
    'Team Lead': 'رئيس فريق',
    'Specialist': 'أخصائي تشغيل'
  };
  return roleMap[role] || role;
}

const feedItemsEn = [
  {type:'Department update',icon:'◌',title:'New Campaign Guidelines',dept:'Marketing Department',time:'Posted 1 hour ago',summary:'Please review the Q3 campaign guidelines for all upcoming initiatives.',details:'The refreshed guidelines include audience segments, brand voice examples, the campaign calendar and the approval process. Your feedback is requested by Thursday at 3:00 PM.',action:'Open department update',allowComments:true},
  {type:'Club news',icon:'◫',title:'New Club Operating Schedule',dept:'All Club',time:'Posted 10 minutes ago',summary:'Updated operating hours and staff procedures are now available for every KODE employee.',details:'From Sunday, May 17, the club will open at 7:00 AM and close at 11:00 PM. Please review the updated handover, attendance and guest-support procedures before your next shift.',action:'Read announcement',allowComments:false},
  {type:'Event',icon:'◷',title:'KODE Staff Event',dept:'All Club',time:'Wednesday, May 20 · 3:00 PM',summary:'An afternoon for the full club team at the Main Stadium.',details:'Join the staff event at the Main Stadium from 3:00 PM to 6:00 PM. Light refreshments and team activities will be provided. Please confirm your attendance with your manager.',action:'View event',allowComments:false},
  {type:'Department event',icon:'◷',title:'Digital Marketing Training',dept:'Marketing Department',time:'Wednesday, May 27 · 11:00 AM',summary:'A practical workshop on the new digital campaign toolkit in Training Room 2.',details:'This Marketing-only session covers asset workflows, reporting dashboards and campaign handoff. Bring your laptop and the current campaign brief.',action:'View event',allowComments:true},
  {type:'Club update',icon:'▣',title:'Employee Handbook v2.1',dept:'All Club',time:'Updated 3 hours ago',summary:'The latest handbook includes updated safety and leave guidance.',details:'Version 2.1 clarifies the annual leave request process, emergency response roles and staff benefits. Please acknowledge the revised handbook by the end of the month.',action:'Open handbook',allowComments:false}
];

const feedItemsAr = [
  {type:'تحديث الإدارة',icon:'◌',title:'إرشادات الحملة التسويقية للربع الثالث',dept:'إدارة التسويق',time:'نُشر منذ ساعة',summary:'يرجى مراجعة إرشادات حملة الربع الثالث ومشاركة الملاحظات مع فريق التسويق.',details:'تتضمن الإرشادات الجديدة شرائح الجمهور ونبرة الخطاب والجدول الزمني للحملة وآلية الاعتمادات. نرجو تزويدنا بالملاحظات قبل يوم الخميس الساعة 3:00 مساءً.',action:'فتح تحديث الإدارة',allowComments:true},
  {type:'أخبار النادي',icon:'◫',title:'جدول مواعيد العمل الجديد للنادي',dept:'كافة النادي',time:'نُشر منذ 10 دقائق',summary:'تم تحديث أوقات العمل الرسمية وإجراءات الموظفين وهي متاحة الآن لجميع منسوبي كود.',details:'اعتباراً من يوم الأحد 17 مايو، سيفتح النادي أبوابه من الساعة 7:00 صباحاً حتى 11:00 مساءً. يرجى مراجعة إجراءات التسليم والحضور قبل موعد الوردية القادمة.',action:'قراءة الإعلان بالكامل',allowComments:false},
  {type:'فعالية النادي',icon:'◷',title:'الملتقى السنوي لمنسوبي كود',dept:'كافة النادي',time:'الأربعاء، 20 مايو · 3:00 مساءً',summary:'أمسية ترفيهية ورياضية مخصصة لفريق عمل النادي بالاستاد الرئيسي.',details:'انضم إلى ملتقى الموظفين في الاستاد الرئيسي من الساعة 3:00 إلى 6:00 مساءً، مع أنشطة وبوفيه مفتوح. يرجى تأكيد الحضور مع مديرك المباشر.',action:'عرض تفاصيل الفعالية',allowComments:false},
  {type:'تدريب مهني',icon:'◷',title:'ورشة أدوات التسويق الرقمي الحديثة',dept:'إدارة التسويق',time:'الأربعاء، 27 مايو · 11:00 صباحاً',summary:'ورشة عمل تطبيقية على أدوات إدارة الحملات الرقمية في قاعة التدريب 2.',details:'هذه الجلسة مخصصة لفريق التسويق وتغطي سير عمل التصاميم والتقارير وتسليم الحملات. يرجى إحضار جهازك المحمول ومسودة الحملة الحالية.',action:'عرض تفاصيل التدريب',allowComments:true},
  {type:'تحديث السياسات',icon:'▣',title:'دليل الموظف المحدث - الإصدار 2.1',dept:'كافة النادي',time:'نُشر منذ 3 ساعات',summary:'يتضمن الدليل الجديد إرشادات السلامة والإجازات المحدثة ومزايا الموظفين.',details:'يوضح الإصدار 2.1 آلية تقديم طلبات الإجازات السنوية، وأدوار الاستجابة للطوارئ والمزايا المحدثة. يرجى مراجعة الدليل والموافقة عليه قبل نهاية الشهر.',action:'فتح دليل الموظف',allowComments:false}
];

function getFeedItems() {
  return arabic ? feedItemsAr : feedItemsEn;
}

const notificationsEn = [
  ['purple','◈','New announcement','Company-wide meeting on May 20 at 10:00 AM.','10m ago'],
  ['purple','◌','Marketing Department','New update posted in your department.','1h ago'],
  ['green','✓','Question answered','Your question has been answered by Ahmed Samy.','2h ago'],
  ['yellow','▣','Document updated','Employee Handbook was updated to v2.1.','3h ago']
];

const notificationsAr = [
  ['purple','◈','إعلان جديد للجميع','اجتماع شامل لكافة منسوبي النادي في 20 مايو الساعة 10:00 صباحاً.','منذ 10 د'],
  ['purple','◌','إدارة التسويق','تم نشر تحديث جديد في مساحة عمل إدارتك.','منذ 1 س'],
  ['green','✓','تمت الإجابة على سؤالك','قام أحمد سامي بالإجابة على استفسارك الأخير.','منذ 2 س'],
  ['yellow','▣','تحديث مستند رسمي','تم تحديث دليل الموظف إلى الإصدار v2.1.','منذ 3 س']
];

function getNotifications() {
  return arabic ? notificationsAr : notificationsEn;
}

// =========================================================
// MODULE 3: AUTHENTICATION STATE, LOGIN & SIGN UP
// =========================================================

function toastMsg(msg, duration = 2000) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

window.switchAuthTab = (tab) => {
  const isLogin = tab === 'login';
  const tabLogin = document.getElementById('tabBtnLogin');
  const tabSignup = document.getElementById('tabBtnSignup');
  if (tabLogin) tabLogin.classList.toggle('active', isLogin);
  if (tabSignup) tabSignup.classList.toggle('active', !isLogin);
  
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (loginForm) loginForm.style.display = isLogin ? 'flex' : 'none';
  if (signupForm) signupForm.style.display = !isLogin ? 'flex' : 'none';
  
  const titleEl = document.getElementById('authHeaderTitle');
  const subEl = document.getElementById('authHeaderSub');
  if (titleEl) titleEl.textContent = isLogin ? t('loginTitle') : t('signupTitle');
  if (subEl) subEl.textContent = isLogin ? t('loginSub') : t('signupSub');

  const loginErr = document.getElementById('loginError');
  const signupErr = document.getElementById('signupError');
  if (loginErr) loginErr.style.display = 'none';
  if (signupErr) signupErr.style.display = 'none';
};

window.quickLogin = async (userId) => {
  try {
    currentUser = await window.apiService.loginAsUser(userId);
    toastMsg((arabic ? 'أهلاً بك، ' : 'Welcome, ') + currentUser.name + '!');
    showApp();
  } catch(err) {
    toastMsg(err.message || 'Login error');
  }
};

function showLogin() {
  document.body.classList.remove('auth-logged-in');
  document.body.classList.add('auth-logged-out');
  
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.style.display = 'none';
  const signupErr = document.getElementById('signupError');
  if (signupErr) signupErr.style.display = 'none';

  const loginInput = document.getElementById('loginInput');
  if (loginInput) {
    loginInput.value = '';
    setTimeout(() => loginInput.focus(), 80);
  }
  const passInput = document.getElementById('loginPassword');
  if (passInput) passInput.value = '';

  switchAuthTab('login');
  updateStaticUI();
}

function showApp() {
  document.body.classList.remove('auth-logged-out');
  document.body.classList.add('auth-logged-in');
  
  updateStaticUI();
  updateUserUI();
  document.querySelectorAll('.nav[data-page]').forEach(x => x.classList.toggle('active', x.dataset.page === page));
  render();
}

window.togglePasswordVisibility = (inputId = 'loginPassword', iconId = 'passToggleIcon') => {
  const passInput = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!passInput) return;
  const isPass = passInput.type === 'password';
  passInput.type = isPass ? 'text' : 'password';
  if (icon) icon.textContent = isPass ? 'visibility' : 'visibility_off';
};

window.handleLoginSubmit = async () => {
  const input = document.getElementById('loginInput')?.value.trim();
  const password = document.getElementById('loginPassword')?.value.trim();
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');
  
  if (!input) {
    if (errEl) {
      errEl.innerText = arabic ? "يرجى إدخال الرقم الوظيفي، الاسم، أو البريد الإلكتروني." : "Please enter your Employee ID, name, or email.";
      errEl.style.display = 'block';
    }
    return;
  }
  
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>${arabic ? 'جاري الدخول...' : 'Signing in...'}</span>`;
  }
  
  try {
    currentUser = await window.apiService.loginWithCredentials(input, password);
    if (errEl) errEl.style.display = 'none';
    toastMsg((arabic ? 'أهلاً بك مجدداً، ' : 'Welcome back, ') + currentUser.name + '!');
    showApp();
  } catch(err) {
    if (errEl) {
      errEl.innerText = err.message || (arabic ? "بيانات الدخول غير صحيحة." : "Invalid login credentials.");
      errEl.style.display = 'block';
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>${t('loginBtn')}</span><span class="material-symbols-outlined">${arabic ? 'arrow_back' : 'arrow_forward'}</span>`;
    }
  }
};

window.handleSignupSubmit = async () => {
  const name = document.getElementById('signupName')?.value.trim();
  const email = document.getElementById('signupEmail')?.value.trim();
  const dept = document.getElementById('signupDept')?.value;
  const role = document.getElementById('signupRole')?.value;
  const pass = document.getElementById('signupPassword')?.value.trim() || 'kode123';
  const errEl = document.getElementById('signupError');
  const btn = document.getElementById('signupBtn');
  
  if (!name || !email) {
    if (errEl) {
      errEl.innerText = arabic ? "يرجى كتابة الاسم الكامل والبريد الإلكتروني." : "Please enter your full name and email address.";
      errEl.style.display = 'block';
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>${arabic ? 'جاري إنشاء الحساب...' : 'Creating account...'}</span>`;
  }

  try {
    currentUser = await window.apiService.signUp({ name, email, department: dept, role, password: pass });
    if (errEl) errEl.style.display = 'none';
    toastMsg((arabic ? 'تم تسجيل حسابك بنجاح! أهلاً بك، ' : 'Account registered successfully! Welcome, ') + currentUser.name + ' 🎉');
    showApp();
  } catch(err) {
    if (errEl) {
      errEl.innerText = err.message || (arabic ? "حدث خطأ أثناء التسجيل." : "Registration failed.");
      errEl.style.display = 'block';
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>${t('signupBtn')}</span><span class="material-symbols-outlined">${arabic ? 'arrow_back' : 'arrow_forward'}</span>`;
    }
  }
};

window.handleLogout = async () => {
  const confirmMsg = arabic ? "هل أنت متأكد من تسجيل الخروج من بوابة كود؟" : "Are you sure you want to log out of KODE Hub?";
  if (!confirm(confirmMsg)) return;
  await window.apiService.logout();
  currentUser = null;
  toastMsg(arabic ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
  showLogin();
};

function updateUserUI() {
  if (!currentUser) return;
  const userNameEl = document.getElementById('userName');
  if (userNameEl) userNameEl.innerText = currentUser.name;
  const userAvatarEl = document.getElementById('userAvatar');
  if (userAvatarEl) userAvatarEl.innerText = currentUser.avatar;
  const userRoleBadgeEl = document.getElementById('userRoleBadge');
  if (userRoleBadgeEl) userRoleBadgeEl.innerText = tRole(currentUser.role) + ' · ' + tDept(currentUser.department);
  
  const sidebarNameEl = document.getElementById('sidebarName');
  if (sidebarNameEl) sidebarNameEl.innerText = currentUser.name;
  const sidebarAvatarEl = document.getElementById('sidebarAvatar');
  if (sidebarAvatarEl) sidebarAvatarEl.innerText = currentUser.avatar;
  const sidebarJobTitleEl = document.getElementById('sidebarJobTitle');
  if (sidebarJobTitleEl) sidebarJobTitleEl.innerText = `${tRole(currentUser.role)} · ${currentUser.employeeId || 'EMP001'}`;

  const adminNav = document.getElementById('navAdmin');
  if (adminNav) {
    adminNav.style.display = 'flex';
  }
}

function updateStaticUI() {
  const brandMainEl = document.querySelector('.brand-main');
  if (brandMainEl) brandMainEl.textContent = t('brandMain');
  const brandSubEl = document.querySelector('.brand-sub');
  if (brandSubEl) brandSubEl.textContent = t('brandSub');
  
  const navMap = {
    home: 'navHome',
    news: 'navNews',
    department: 'navDept',
    resources: 'navResources',
    events: 'navEvents',
    contacts: 'navContacts',
    faqs: 'navFaqs',
    admin: 'navAdmin',
    feedback: 'navFeedback',
    recognition: 'navRecognition',
    settings: 'navSettings'
  };
  Object.entries(navMap).forEach(([pageKey, tKey]) => {
    const el = document.querySelector(`.nav[data-page="${pageKey}"] .nav-label-text`);
    if (el) el.textContent = t(tKey);
  });
  
  const settingsLabel = document.querySelector('#settings .nav-label-text');
  if (settingsLabel) settingsLabel.textContent = t('navSettings');
  const logoutLabel = document.querySelector('#logout .nav-label-text');
  if (logoutLabel) logoutLabel.textContent = t('navLogout');

  const searchInput = document.getElementById('search');
  if (searchInput) searchInput.placeholder = t('searchPlaceholder');
  const searchPlaceholderText = document.querySelector('.search-placeholder-text');
  if (searchPlaceholderText) searchPlaceholderText.textContent = arabic ? 'بحث...' : 'Search...';
  
  const drawerTitle = document.querySelector('.drawer-head b');
  if (drawerTitle) drawerTitle.textContent = t('notifications');

  // Auth Card Text Strings
  const tabBtnLogin = document.getElementById('tabBtnLogin');
  if (tabBtnLogin) tabBtnLogin.textContent = t('authSignInTab');
  const tabBtnSignup = document.getElementById('tabBtnSignup');
  if (tabBtnSignup) tabBtnSignup.textContent = t('authSignUpTab');
  
  const loginInput = document.getElementById('loginInput');
  if (loginInput) loginInput.placeholder = t('loginInputPlaceholder');
  const loginIdLabel = document.getElementById('loginIdLabel');
  if (loginIdLabel) loginIdLabel.textContent = t('loginIdLabel');
  const loginPassLabel = document.getElementById('loginPassLabel');
  if (loginPassLabel) loginPassLabel.textContent = t('loginPassLabel');

  const loginBtnText = document.querySelector('#loginBtn span:first-child');
  if (loginBtnText) loginBtnText.textContent = t('loginBtn');
  const signupBtnText = document.querySelector('#signupBtn span:first-child');
  if (signupBtnText) signupBtnText.textContent = t('signupBtn');

  const signupNameLabel = document.getElementById('signupNameLabel');
  if (signupNameLabel) signupNameLabel.textContent = t('signupNameLabel');
  const signupName = document.getElementById('signupName');
  if (signupName) signupName.placeholder = t('signupNamePlaceholder');

  const signupEmailLabel = document.getElementById('signupEmailLabel');
  if (signupEmailLabel) signupEmailLabel.textContent = t('signupEmailLabel');
  const signupEmail = document.getElementById('signupEmail');
  if (signupEmail) signupEmail.placeholder = t('signupEmailPlaceholder');

  const signupDeptLabel = document.getElementById('signupDeptLabel');
  if (signupDeptLabel) signupDeptLabel.textContent = t('signupDeptLabel');
  const signupRoleLabel = document.getElementById('signupRoleLabel');
  if (signupRoleLabel) signupRoleLabel.textContent = t('signupRoleLabel');
  const signupPassLabel = document.getElementById('signupPassLabel');
  if (signupPassLabel) signupPassLabel.textContent = t('signupPassLabel');
  const signupPassword = document.getElementById('signupPassword');
  if (signupPassword) signupPassword.placeholder = t('signupPassPlaceholder');

  const quickDemoLabel = document.getElementById('quickDemoLabel');
  if (quickDemoLabel) quickDemoLabel.textContent = t('quickDemoLabel');
  const loginFooterText = document.querySelector('.login-footer small');
  if (loginFooterText) loginFooterText.textContent = t('loginFooter');
}

// =========================================================
// MODULE 4: SPA ROUTER & VIEW RENDERERS
// =========================================================
function go(p) {
  page = p;
  localStorage.setItem('kode-active-page', p);
  document.querySelectorAll('.nav[data-page]').forEach(x => x.classList.toggle('active', x.dataset.page === p));
  window.scrollTo({ top: 0, behavior: 'instant' });
  const searchWrapper = document.getElementById('iosSearchWrapper');
  const searchInput = document.getElementById('search');
  if (searchWrapper && document.activeElement !== searchInput && (!searchInput || !searchInput.value.trim())) {
    searchWrapper.classList.remove('ios-search-visible');
  }
  render();
}

function head(k, sub) {
  return `<div class="page-title">${k}</div><div class="sub">${sub}</div>`;
}

function notificationHtml() {
  return getNotifications().map(n => `
    <div class="notif">
      <div class="nicon ${n[0]}">${n[1]}</div>
      <div><b>${n[2]}</b><p>${n[3]}</p><time>${n[4]}</time></div>
    </div>
  `).join('');
}

async function home() {
  const dept = currentUser?.department || 'Marketing';
  
  // Clean mock list matching the reference photo
  const recentItems = [
    {
      id: 1,
      rank: 1,
      icon: 'calendar_today',
      title: arabic ? 'جدول اجتماع استراتيجية الربع الرابع' : 'Q4 Strategy Meeting Agenda',
      meta: arabic ? 'كافة الموظفين، 28 أغسطس | 2:00 م' : 'All Staff, Aug 28 | 2 PM'
    },
    {
      id: 2,
      rank: 2,
      icon: 'celebration',
      title: arabic ? 'احتفالية تدشين المقر الإداري الجديد' : 'New Office Opening Celebration',
      meta: arabic ? 'أخبار النادي، 30 أغسطس | 5:00 م' : 'Internal News, Aug 30 | 5 PM'
    }
  ];

  const recentListHtml = recentItems.map(item => `
    <div class="recent-list-row glass-panel" onclick="go('news')" style="cursor:pointer;" title="Click to view details">
      <div class="recent-rank">${item.rank}</div>
      <div class="recent-icon-badge">
        <span class="material-symbols-outlined">${item.icon}</span>
      </div>
      <div class="recent-info">
        <div class="recent-title">${item.title}</div>
        <div class="recent-meta">${item.meta}</div>
      </div>
      <div class="recent-tag">11pt</div>
    </div>
  `).join('');

  return `${feedDeck()}
    <section class="recent-news-container">
      <div class="recent-header">
        <h3 class="recent-news-heading">${t('recentNewsEvents')}</h3>
        <span class="recent-header-tag">20pt</span>
      </div>
      <div class="recent-news-list">
        ${recentListHtml}
      </div>
    </section>`;
}

async function newsPage() {
  const dept = currentUser?.department || 'Marketing';
  const rawNews = await window.apiService.getNews(dept);
  const news = rawNews.map(n => {
    if (!arabic) return n;
    const arNews = {
      1: { title: 'جدول مواعيد العمل الجديد للنادي', content: 'تم تحديث أوقات العمل الرسمية وإجراءات الموظفين وهي متاحة الآن لجميع منسوبي كود.', date: '16 مايو' },
      2: { title: 'إرشادات الحملة التسويقية للربع الثالث', content: 'يرجى مراجعة إرشادات الحملة التسويقية ومشاركة الملاحظات مع فريق التسويق.', date: '15 مايو' },
      3: { title: 'صيانة دورية لخوادم البوابة', content: 'ستخضع خوادم البوابة الداخلية لصيانة مجدولة لمدة ساعتين هذا الأحد.', date: '17 مايو' }
    };
    return { ...n, ...(arNews[n.id] || {}) };
  });

  const html = news.map(n => {
    // REQUIREMENT 1: Only department-specific items have Q/A or comments
    const isDeptSpecific = n.department !== 'General' && n.department !== 'All Club';
    const commentsBtn = isDeptSpecific 
      ? `<button class="btn light" onclick="openComments('news', ${n.id}, '${n.title.replace(/'/g, "\\'")}')">💬 ${t('comments')}</button>`
      : `<span class="pill" style="opacity:0.75;font-size:10px;">📢 ${t('officialAnnouncement')}</span>`;

    return `
      <div class="card large-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span class="pill ${isDeptSpecific ? 'primary' : ''}">${tDept(n.department)}</span>
          ${isDeptSpecific ? '<span style="font-size:10px;color:var(--theme-accent);font-weight:700;">● Q&A Active</span>' : ''}
        </div>
        <h3>${n.title}</h3>
        <p>${n.content}</p>
        <div style="margin-top:15px;display:flex;justify-content:space-between;align-items:center">
          <small style="color:var(--text-muted)">${n.date} · ${n.likes} ${arabic ? 'إعجاب' : 'likes'}</small>
          ${commentsBtn}
        </div>
      </div>
    `;
  }).join('');

  return `${head(t('navNews'), t('newsSub'))}
    <div class="page-grid">${html}</div>`;
}

async function eventsPage() {
  const dept = currentUser?.department || 'Marketing';
  const rawEvents = await window.apiService.getEvents(dept);
  const events = (rawEvents || []).map(e => {
    if (!arabic) return e;
    const arEvents = {
      1: { title: 'جدول اجتماع استراتيجية الربع الرابع', date: '28 أغسطس', time: '02:00 مساءً' },
      2: { title: 'احتفالية تدشين المقر الإداري الجديد', date: '30 أغسطس', time: '05:00 مساءً' },
      3: { title: 'ورشة أدوات التسويق الرقمي الحديثة', date: '02 سبتمبر', time: '11:00 صباحاً' },
      4: { title: 'جلسة تهيئة وتدريب الموظفين الجدد', date: '05 سبتمبر', time: '09:00 صباحاً' }
    };
    return { ...e, ...(arEvents[e.id] || {}) };
  });

  const html = events.map(e => {
    // REQUIREMENT 1: Only department-specific items have Q/A or comments
    const isDeptEvent = e.department !== 'General' && e.department !== 'All Club';
    const discussBtn = isDeptEvent 
      ? `<button class="btn light" onclick="openComments('event', ${e.id}, '${(e.title || '').replace(/'/g, "\\'")}')">💬 ${t('discuss')}</button>`
      : `<span class="pill" style="opacity:0.75;font-size:10px;">📍 ${t('officialAnnouncement')}</span>`;

    return `
      <div class="event" style="padding:14px 0">
        <div class="datebox"><b>${(e.date || '20').split(' ')[0]}</b><small>${(e.date || 'Aug').split(' ')[1] || (arabic ? 'أغسطس' : 'Aug')}</small></div>
        <div class="event-main" style="flex:1">
          <b style="color:var(--text-heading);font-size:14px">${e.title || 'Event'}</b>
          <div style="margin-top:4px"><span style="font-size:11px;color:var(--text-muted)">◷ ${e.time || '10:00 AM'} · </span><span class="pill ${isDeptEvent ? 'primary' : ''}">${tDept(e.department)}</span></div>
        </div>
        ${discussBtn}
      </div>
    `;
  }).join('');

  const days = arabic ? ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'] : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return `${head(t('navEvents'), t('eventsSub'))}
    <div class="two-col events-layout">
      <div class="card event-list">
        <h3 style="margin-bottom:12px;color:var(--text-heading);font-size:16px">${t('navEvents')}</h3>
        ${html}
      </div>
      <div class="card">
        <h3 style="margin-bottom:14px;color:var(--text-heading);font-size:16px">${arabic ? 'التقويم الشهري' : 'Monthly Calendar'}</h3>
        <div class="calendar">
          ${days.map(d => `<div class="day header-day">${d}</div>`).join('')}
          ${Array.from({length:31}, (_,i) => `<div class="day"><b>${i+1}</b>${[28,30,2,5].includes(i+1) ? `<small>● ${t('event')}</small>` : ''}</div>`).join('')}
        </div>
      </div>
    </div>`;
}

// =========================================================
// MODULE 5: SETTINGS FULL PAGE VIEW
// =========================================================
async function settingsPage() {
  const users = await window.apiService.getUsers();
  const currentTheme = document.body.getAttribute('data-theme') || 'default';
  const currentBg = localStorage.getItem('kode-bg-mode') || 'galaxy';

  const userSwitchCards = users.map(u => `
    <div class="settings-user-card ${currentUser?.id === u.id ? 'active-current' : ''}" onclick="switchRole(${u.id})">
      <div class="avatar" style="background:linear-gradient(135deg, var(--theme-banner-start), var(--theme-banner-end));color:#fff;font-weight:bold;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;">
        ${u.avatar}
      </div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:13px;color:var(--text-heading);">${u.name}</div>
        <div style="font-size:11px;color:var(--text-muted);">${u.employeeId || 'EMP00' + u.id} · ${tRole(u.role)} · ${tDept(u.department)}</div>
      </div>
      ${currentUser?.id === u.id ? `<span class="pill primary" style="font-size:9px;">Active</span>` : `<button class="btn light" style="font-size:11px;padding:5px 10px;">Switch</button>`}
    </div>
  `).join('');

  return `
    <div class="settings-page-header">
      <h1 class="page-title">${t('settingsTitle')}</h1>
      <p class="sub">${t('settingsSub')}</p>
    </div>

    <div class="settings-grid">
      <!-- 1. Background Style Options (Requirement 6) -->
      <div class="card settings-card">
        <div class="settings-card-head">
          <span class="material-symbols-outlined">wallpaper</span>
          <div>
            <h3>${t('secBgMode')}</h3>
            <p>${t('secBgModeSub')}</p>
          </div>
        </div>
        <div class="bg-mode-picker" style="display:flex;flex-direction:column;gap:10px;">
          <div class="bg-choice-card ${currentBg==='galaxy'?'active':''}" onclick="setBgMode('galaxy')">
            <div class="bg-preview-swatch galaxy-swatch">🌌</div>
            <div style="flex:1">
              <b style="font-size:13px;color:var(--text-heading);">${t('bgGalaxy')}</b>
              <p style="font-size:11px;color:var(--text-muted);margin:2px 0 0;">${arabic ? 'سديم فضائي عميق مع نجوم مشعة وتوهج بنفسجي' : 'Deep purple & blue nebula with glowing cosmic stars'}</p>
            </div>
            ${currentBg==='galaxy' ? '<span class="pill primary" style="font-size:9px;">Active</span>' : ''}
          </div>

          <div class="bg-choice-card ${currentBg==='crystal'?'active':''}" onclick="setBgMode('crystal')">
            <div class="bg-preview-swatch crystal-swatch">💎</div>
            <div style="flex:1">
              <b style="font-size:13px;color:var(--text-heading);">${t('bgCrystal')}</b>
              <p style="font-size:11px;color:var(--text-muted);margin:2px 0 0;">${arabic ? 'تصميم الكريستال الهندسي ثلاثي الأبعاد الأصلي' : 'Original geometric floating crystal polygon background'}</p>
            </div>
            ${currentBg==='crystal' ? '<span class="pill primary" style="font-size:9px;">Active</span>' : ''}
          </div>

          <div class="bg-choice-card ${currentBg==='clean'?'active':''}" onclick="setBgMode('clean')">
            <div class="bg-preview-swatch clean-swatch">🎨</div>
            <div style="flex:1">
              <b style="font-size:13px;color:var(--text-heading);">${t('bgClean')}</b>
              <p style="font-size:11px;color:var(--text-muted);margin:2px 0 0;">${arabic ? 'تدرجات ألوان السمة النقية بدون أي صور لبيئة عمل هادئة' : 'Distraction-free pure theme colors with smooth gradients'}</p>
            </div>
            ${currentBg==='clean' ? '<span class="pill primary" style="font-size:9px;">Active</span>' : ''}
          </div>
        </div>
      </div>

      <!-- 2. Profile & Account Switcher -->
      <div class="card settings-card">
        <div class="settings-card-head">
          <span class="material-symbols-outlined">badge</span>
          <div>
            <h3>${t('secProfile')}</h3>
            <p>${t('secProfileSub')}</p>
          </div>
        </div>
        <div class="settings-users-list">
          ${userSwitchCards}
        </div>
      </div>

      <!-- 3. Appearance & Theme Palettes -->
      <div class="card settings-card">
        <div class="settings-card-head">
          <span class="material-symbols-outlined">palette</span>
          <div>
            <h3>${t('secAppearance')}</h3>
            <p>${t('secAppearanceSub')}</p>
          </div>
        </div>
        <div class="theme-mode" style="margin-bottom:16px;">
          <button class="theme-mode-choice ${!dark?'active':''}" onclick="if(dark)toggleAppearance()">${arabic ? '☼ المظهر الفاتح' : '☼ Light Mode'}</button>
          <button class="theme-mode-choice ${dark?'active':''}" onclick="if(!dark)toggleAppearance()">${arabic ? '☾ المظهر الداكن' : '☾ Dark Mode'}</button>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text-heading);margin-bottom:10px;">${t('themeOption')}</div>
        <div class="theme-picker">
          <button class="theme-choice ${currentTheme==='default'?'active':''}" data-theme="default" onclick="setTheme('default')"><span class="theme-dot dot-default"></span>KODE Purple</button>
          <button class="theme-choice ${currentTheme==='ocean'?'active':''}" data-theme="ocean" onclick="setTheme('ocean')"><span class="theme-dot dot-ocean"></span>Ocean Blue</button>
          <button class="theme-choice ${currentTheme==='emerald'?'active':''}" data-theme="emerald" onclick="setTheme('emerald')"><span class="theme-dot dot-emerald"></span>Emerald</button>
          <button class="theme-choice ${currentTheme==='sunset'?'active':''}" data-theme="sunset" onclick="setTheme('sunset')"><span class="theme-dot dot-sunset"></span>Sunset Orange</button>
          <button class="theme-choice ${currentTheme==='rose'?'active':''}" data-theme="rose" onclick="setTheme('rose')"><span class="theme-dot dot-rose"></span>Rose Pink</button>
          <button class="theme-choice ${currentTheme==='indigo'?'active':''}" data-theme="indigo" onclick="setTheme('indigo')"><span class="theme-dot dot-indigo"></span>Indigo Neon</button>
        </div>
      </div>

      <!-- 4. Language & Localization -->
      <div class="card settings-card">
        <div class="settings-card-head">
          <span class="material-symbols-outlined">language</span>
          <div>
            <h3>${t('secLang')}</h3>
            <p>${t('secLangSub')}</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-top:10px;">
          <button class="btn ${!arabic ? '' : 'light'}" onclick="if(arabic)toggleLanguage()" style="flex:1;justify-content:center;padding:12px;">
            🇬🇧 English (LTR)
          </button>
          <button class="btn ${arabic ? '' : 'light'}" onclick="if(!arabic)toggleLanguage()" style="flex:1;justify-content:center;padding:12px;">
            🇪🇬 العربية (RTL)
          </button>
        </div>
      </div>

      <!-- 5. Notification Preferences -->
      <div class="card settings-card">
        <div class="settings-card-head">
          <span class="material-symbols-outlined">notifications_active</span>
          <div>
            <h3>${t('secNotifs')}</h3>
            <p>${t('secNotifsSub')}</p>
          </div>
        </div>
        <div class="notif-toggle-list" style="display:flex;flex-direction:column;gap:12px;margin-top:10px;">
          <label style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--text-heading);cursor:pointer;">
            <span>${arabic ? 'تنبيهات تحديثات الإدارة ومساحة العمل' : 'Department Updates & Workspace Alerts'}</span>
            <input type="checkbox" checked style="accent-color:var(--theme-accent);width:18px;height:18px;">
          </label>
          <label style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--text-heading);cursor:pointer;">
            <span>${arabic ? 'إعلانات النادي الرسمية والفعاليات العامة' : 'General Club News & Official Announcements'}</span>
            <input type="checkbox" checked style="accent-color:var(--theme-accent);width:18px;height:18px;">
          </label>
          <label style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--text-heading);cursor:pointer;">
            <span>${arabic ? 'إشعارات الردود على الأسئلة والاستفسارات' : 'Q&A Discussion Replies & Mentions'}</span>
            <input type="checkbox" checked style="accent-color:var(--theme-accent);width:18px;height:18px;">
          </label>
        </div>
      </div>
    </div>
  `;
}

async function departmentPage() {
  const dept = currentUser?.department || 'Marketing';
  const allUsers = await window.apiService.getUsers();
  
  const deptUsers = allUsers.filter(u => u.department === dept);
  const managers = deptUsers.filter(u => u.role === 'Manager');
  const teamLeads = deptUsers.filter(u => u.role !== 'Manager' && u.role !== 'Employee');
  const employees = deptUsers.filter(u => u.role === 'Employee');

  const renderOrgLevel = (users, title) => {
    if (users.length === 0) return '';
    return `
      <h3 style="margin-top:15px;font-size:11px;color:var(--text-muted)">${title}</h3>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
        ${users.map(u => `<div class="card" style="padding:10px;display:flex;gap:10px;align-items:center;min-width:180px">
          <div class="avatar sm">${u.avatar}</div>
          <div><b>${u.name}</b><br><small style="color:var(--text-muted)">${tRole(u.role)}</small></div>
        </div>`).join('')}
      </div>
    `;
  };

  const orgChartHtml = `
    <div class="card" style="padding:20px;margin-bottom:20px;background:var(--card-bg)">
      <h2>${t('orgHierarchy')}</h2>
      <p style="font-size:11px;color:var(--text-muted)">${t('reportingLines')} ${tDept(dept)}</p>
      ${renderOrgLevel(managers, t('deptManagers'))}
      ${renderOrgLevel(teamLeads, t('teamLeads'))}
      ${renderOrgLevel(employees, t('colleagues'))}
    </div>
  `;

  const news = await window.apiService.getNews(dept);
  const deptNews = news.filter(n => n.department === dept);
  const newsHtml = deptNews.length ? deptNews.map(n => `
    <div class="news-item" style="display:block">
      <h3>${n.title}</h3>
      <p style="margin-bottom:8px">${n.content}</p>
      <button class="btn light" onclick="openComments('news', ${n.id}, '${n.title.replace(/'/g, "\\'")}')">${t('comments')}</button>
    </div>
  `).join('') : `<p style="color:var(--text-muted);padding:10px">${arabic ? 'لا توجد تحديثات جديدة للإدارة حالياً.' : 'No department specific news.'}</p>`;

  return `<div class="welcome">
      <div>
        <div class="eyebrow">${t('privateWorkspace')}</div>
        <h1 class="page-title">${tDept(dept)} ${arabic ? 'إدارة' : 'Department'}</h1>
        <p class="sub">${t('privateContentFor')} ${tDept(dept)}. ${t('otherDeptsHidden')}</p>
      </div>
    </div>
    ${orgChartHtml}
    <div class="two-col section">
      <div>
        <div class="section-head"><h2>${t('deptNews')}</h2></div>
        <div class="card news-list">${newsHtml}</div>
      </div>
      <div>
        <div class="section-head"><h2>${t('askDept')}</h2></div>
        <div class="card form">
          <input id="q" placeholder="${t('askPlaceholder')}">
          <textarea placeholder="${t('askDetailsPlaceholder')}"></textarea>
          <button class="btn" onclick="ask()">${t('submitQuestion')}</button>
          <small style="color:var(--text-muted)">${t('askVisibility')}</small>
        </div>
      </div>
    </div>`;
}

function resourcesPage() {
  const items = [
    ['PDF', arabic ? 'دليل الموظف v2.1' : 'Employee Handbook v2.1', t('policies'), arabic ? 'محدث منذ ساعتين' : 'Updated 2h ago'],
    ['DOC', arabic ? 'إرشادات التسويق والهوية v3.0' : 'Marketing & Brand Guidelines v3.0', arabic ? 'الإدارة' : 'Department', arabic ? 'محدث منذ يوم' : 'Updated 1d ago'],
    ['PDF', arabic ? 'إجراءات السلامة والوقاية v2.4' : 'Safety & Operational Procedures v2.4', arabic ? 'التدريب' : 'Training', arabic ? 'محدث منذ يومين' : 'Updated 2d ago'],
    ['FORM', arabic ? 'نموذج طلب إجازة سنوية' : 'Leave Request Form', t('forms'), 'Aug 10'],
    ['DOC', arabic ? 'نموذج طلبات التصاميم والحملات' : 'Campaign Request Brief Template', arabic ? 'التسويق' : 'Marketing', 'Aug 8'],
    ['PDF', arabic ? 'خطة الطوارئ والإخلاء المعتمدة' : 'Emergency Evacuation Protocol', arabic ? 'السلامة' : 'Safety', 'Aug 1']
  ];

  return `${head(t('navResources'), t('resourcesSub'))}
    <div class="toolbar" style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
      <button class="btn light active">${t('all')}</button>
      <button class="btn light">${t('policies')}</button>
      <button class="btn light">${t('procedures')}</button>
      <button class="btn light">${t('forms')}</button>
    </div>
    <div class="page-grid">
      ${items.map(x => `
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
          <div class="doc">
            <div class="doc-icon">${x[0]}</div>
            <div class="doc-main">
              <b>${x[1]}</b>
              <span>${x[2]} · ${x[3]}</span>
            </div>
          </div>
          <button class="btn light" style="width:fit-content" onclick="toastMsg('${t('openResource')}')">${t('openResource')}</button>
        </div>
      `).join('')}
    </div>`;
}

function contactsPage() {
  const contactsList = arabic ? [
    ['الموارد البشرية', 'فريق الرواتب والمزايا', 'قسم الاستحقاقات المالية'],
    ['الدعم التقني', 'فريق تكنولوجيا المعلومات', 'المكتب الفني والمساعدة'],
    ['العمليات', 'فريق دعم العمليات والتشغيل', 'خدمات المرافق والملاعب'],
    ['الأمن والسلامة', 'مكتب الأمن والحراسة', 'قسم الأمن والسلامة المهنية'],
    ['الجودة', 'سلامة الأغذية والضيافة', 'فريق فحص الجودة الغذائية'],
    ['التسويق', 'إدارة التسويق والفعاليات', 'فريق التواصل والإعلام']
  ] : [
    ['HR', 'Payroll & Benefits', 'Payroll Team'],
    ['Tech', 'IT Helpdesk & Support', 'IT Support Team'],
    ['Operations', 'Operations & Facilities', 'Operations Team'],
    ['Security', 'Security & Safety Desk', 'Security Team'],
    ['Food Safety', 'Food Safety & Quality', 'Food Safety Team'],
    ['Marketing', 'Marketing & Media Team', 'Marketing Team']
  ];

  return `${head(t('whoToContact'), t('whoToContactSub'))}
    <div class="card form" style="margin-bottom:20px;padding:14px 18px;">
      <input id="contactSearch" placeholder="${t('searchContactPlaceholder')}" oninput="contactFilter()">
    </div>
    <div class="contact-grid" id="contacts">
      ${contactsList.map(c => `
        <div class="card contact" data-key="${c.join(' ').toLowerCase()}">
          <span class="pill">${c[0]}</span>
          <h3>${c[1]}</h3>
          <p>${c[2]}</p>
          <small style="color:var(--text-muted);margin:4px 0 8px">${t('availableInternal')}</small>
          <button class="btn light" onclick="toastMsg('${t('contact')}')">${t('contact')}</button>
        </div>
      `).join('')}
    </div>`;
}

function faqsPage() {
  const faqs = arabic ? [
    ['عام', 'كيف يمكنني تقديم طلب إجازة سنوية؟', 'عبر نموذج طلب الإجازة المتاح في قسم المصادر والإرشادات.'],
    ['عام', 'أين أجد النسخة المحدثة من دليل الموظف؟', 'توجه إلى صفحة المصادر والإرشادات ← السياسات.'],
    ['تسويق', 'كيف أطلب مواد دعائية أو تصاميم جديدة؟', 'باستخدام نموذج طلبات التسويق والتصاميم المعتمد.'],
    ['تسويق', 'أين أجد الدليل الإرشادي لهوية النادي؟', 'من خلال مساحة عمل إدارتي ← المصادر.']
  ] : [
    ['General', 'How do I request annual leave?', 'Use the Leave Request Form in the Resources section.'],
    ['General', 'Where can I find the employee handbook?', 'Open Resources → Policies.'],
    ['Marketing', 'How do I request marketing materials?', 'Use the Marketing Request Form in Resources.'],
    ['Marketing', 'Where are the brand guidelines located?', 'Open My Department → Resources.']
  ];

  return `${head(t('navFaqs'), t('faqsSub'))}
    <div class="page-grid">
      ${faqs.map(f => `
        <div class="card large-card">
          <span class="pill primary">${f[0]}</span>
          <h3>${f[1]}</h3>
          <p>${f[2]}</p>
          <button class="view" onclick="toastMsg('${t('readAnswer')}')">${t('readAnswer')}</button>
        </div>
      `).join('')}
    </div>`;
}

function feedbackPage() {
  const options = arabic ? ['اقتراح تطويري', 'إبلاغ عن مشكلة', 'فكرة تحسين بيئة العمل', 'ملاحظات عامة'] : ['Suggestion', 'Problem', 'Improvement idea', 'General feedback'];
  
  return `${head(t('navFeedback'), t('feedbackSub'))}
    <div class="two-col">
      <div class="card form">
        <select>${options.map(o => `<option>${o}</option>`).join('')}</select>
        <textarea id="feedback" placeholder="${t('tellUs')}"></textarea>
        <label style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
          <input type="checkbox"> ${t('anonymous')}
        </label>
        <button class="btn" onclick="submitFeedback()">${t('submitFeedback')}</button>
      </div>
      <div class="card qa">
        <div class="qa-row">
          <span class="pill status">${arabic ? 'قيد المراجعة' : 'Under Review'}</span>
          <h4>${arabic ? 'تحسين تذكيرات فعاليات النادي' : 'Improve staff event reminders'}</h4>
          <p>${arabic ? 'تم التقديم في 12 أغسطس' : 'Submitted Aug 12'}</p>
        </div>
        <div class="qa-row">
          <span class="pill primary status">${arabic ? 'جاري التنفيذ' : 'In Progress'}</span>
          <h4>${arabic ? 'إضافة نماذج رقمية للإدارات' : 'More department templates'}</h4>
          <p>${arabic ? 'تم التقديم في 5 أغسطس' : 'Submitted Aug 5'}</p>
        </div>
      </div>
    </div>`;
}

async function recognitionPage() {
  const awards = await window.apiService.getAllAwards();
  const users = await window.apiService.getUsers();
  
  const myAwards = awards.filter(a => a.receiverId === currentUser?.id);
  const myPoints = myAwards.reduce((sum, a) => sum + a.points, 0);

  const awardCards = awards.map(a => {
    const receiver = users.find(u => u.id === a.receiverId);
    const giver = users.find(u => u.id === a.giverId);
    return `<div class="card large-card">
      <div style="display:flex;gap:10px;align-items:center">
        <div class="avatar">${receiver?.avatar || '??'}</div>
        <div>
          <b style="font-size:13px">${receiver?.name || 'Unknown'}</b>
          <div><span class="pill primary">★ ${a.points} ${arabic ? 'نقطة' : 'pts'}</span></div>
        </div>
      </div>
      <p style="margin-top:12px;font-size:14px"><b>${a.criteria}</b></p>
      <small style="color:var(--text-muted)">${arabic ? 'ممنوحة بواسطة' : 'Awarded by'} ${giver?.name || 'Admin'} · ${a.date}</small>
    </div>`;
  }).join('');

  const canAward = ['Admin', 'HR', 'Manager'].includes(currentUser?.role);
  const awardBtn = canAward ? `<button class="btn" onclick="openAwardModal()">${t('grantAward')}</button>` : '';

  return `${head(t('navRecognition'), t('recognitionSub'))}
    <div class="two-col" style="margin-bottom:20px;gap:15px">
      <div class="card trophy-card" style="padding:24px;border-radius:16px">
        <h3 style="opacity:0.95;margin:0 0 8px">${t('yourTrophyRoom')}</h3>
        <h1 style="font-size:36px;margin:0">★ ${myPoints}</h1>
        <p style="font-size:12px;margin:6px 0 0">${t('totalPoints')}</p>
      </div>
      <div style="display:flex;align-items:center;justify-content:flex-start">
        ${awardBtn}
      </div>
    </div>
    <div class="page-grid">${awardCards}</div>`;
}

async function adminPage() {
  const users = await window.apiService.getUsers();
  const depts = await window.apiService.getDepartments();
  const roles = await window.apiService.getRoles();

  // 1. KPI Metric Calculations
  const totalStaffCount = users.length;
  const totalDeptCount = depts.length;
  const totalRoleCount = roles.length;

  // 2. Tab 1: Employees Roster List
  const userRows = users.map(u => `
    <div class="admin-user-card" data-name="${u.name.toLowerCase()}" data-email="${(u.email || '').toLowerCase()}" data-dept="${u.department}">
      <div class="admin-user-info">
        <div class="avatar" style="background:linear-gradient(135deg, var(--theme-banner-start), var(--theme-banner-end));color:#fff;font-weight:bold;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">
          ${u.avatar || u.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div class="u-name">${u.name}</div>
          <div class="u-email">${u.email || u.name.toLowerCase().replace(/\s+/g, '') + '@kodeclub.com'}</div>
        </div>
      </div>
      <div class="admin-actions">
        <select class="admin-filter-select" onchange="updateRole(${u.id}, this.value)" title="${t('tabRoles')}">
          ${roles.map(r => `<option value="${r}" ${r===u.role?'selected':''}>${tRole(r)}</option>`).join('')}
        </select>
        <select class="admin-filter-select" onchange="updateDept(${u.id}, this.value)" title="${t('tabDepartments')}">
          ${depts.map(d => `<option value="${d}" ${d===u.department?'selected':''}>${tDept(d)}</option>`).join('')}
        </select>
        <button class="btn light" onclick="removeEmp(${u.id})" style="color:#ef4444;border-color:rgba(239, 68, 68, 0.3);padding:6px 10px;">
          <span class="material-symbols-outlined" style="font-size:16px">delete</span>
        </button>
      </div>
    </div>
  `).join('');

  // 3. Tab 2: Departments List
  const deptCards = depts.map(d => {
    const assignedCount = users.filter(u => u.department === d).length;
    return `
      <div class="admin-entity-card">
        <div class="top">
          <div class="title">${tDept(d)}</div>
          <span class="material-symbols-outlined" style="color:var(--theme-accent)">corporate_fare</span>
        </div>
        <div class="count">${assignedCount} ${t('assignedEmployees')}</div>
      </div>
    `;
  }).join('');

  // 4. Tab 3: Roles List
  const roleCards = roles.map(r => {
    const assignedCount = users.filter(u => u.role === r).length;
    return `
      <div class="admin-entity-card">
        <div class="top">
          <div class="title">${tRole(r)}</div>
          <span class="material-symbols-outlined" style="color:var(--theme-accent)">admin_panel_settings</span>
        </div>
        <div class="count">${assignedCount} ${t('assignedUsers')}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="welcome" style="margin-bottom:24px;">
      <div>
        <div class="eyebrow">${t('navAdmin')}</div>
        <h1 class="page-title">${t('adminHubTitle')}</h1>
        <p class="sub">${t('adminHubSub')}</p>
      </div>
    </div>

    <!-- Admin KPI Row (Side by Side 3-Column Grid) -->
    <div class="admin-kpi-grid">
      <div class="admin-kpi-card">
        <div class="admin-kpi-icon">
          <span class="material-symbols-outlined">group</span>
        </div>
        <div class="admin-kpi-info">
          <h4>${t('totalPersonnel')}</h4>
          <div class="val">${totalStaffCount} <span class="val-sub">${arabic ? 'موظف' : 'Staff'}</span></div>
        </div>
      </div>
      <div class="admin-kpi-card">
        <div class="admin-kpi-icon">
          <span class="material-symbols-outlined">domain</span>
        </div>
        <div class="admin-kpi-info">
          <h4>${t('activeDepts')}</h4>
          <div class="val">${totalDeptCount} <span class="val-sub">${arabic ? 'إدارات' : 'Depts'}</span></div>
        </div>
      </div>
      <div class="admin-kpi-card">
        <div class="admin-kpi-icon">
          <span class="material-symbols-outlined">shield_person</span>
        </div>
        <div class="admin-kpi-info">
          <h4>${t('systemRoles')}</h4>
          <div class="val">${totalRoleCount} <span class="val-sub">${arabic ? 'أدوار' : 'Roles'}</span></div>
        </div>
      </div>
    </div>

    <!-- Segmented 3-Tab Bar -->
    <div class="admin-tabs">
      <button class="admin-tab-btn ${adminActiveTab==='employees'?'active':''}" onclick="switchAdminTab('employees')">
        <span class="material-symbols-outlined" style="font-size:18px">people</span>
        <span>${t('tabEmployees')}</span>
      </button>
      <button class="admin-tab-btn ${adminActiveTab==='departments'?'active':''}" onclick="switchAdminTab('departments')">
        <span class="material-symbols-outlined" style="font-size:18px">corporate_fare</span>
        <span>${t('tabDepartments')}</span>
      </button>
      <button class="admin-tab-btn ${adminActiveTab==='roles'?'active':''}" onclick="switchAdminTab('roles')">
        <span class="material-symbols-outlined" style="font-size:18px">admin_panel_settings</span>
        <span>${t('tabRoles')}</span>
      </button>
    </div>

    <!-- TAB 1: EMPLOYEES -->
    <div id="sectionAdminEmployees" style="display:${adminActiveTab==='employees'?'block':'none'}">
      <div class="admin-toolbar">
        <div class="admin-search-wrap">
          <span class="material-symbols-outlined" style="color:var(--text-muted);font-size:20px">search</span>
          <input type="text" id="adminEmpSearch" placeholder="${t('searchEmpPlaceholder')}" oninput="filterAdminEmployees()">
        </div>
        <div style="display:flex;gap:10px;">
          <select class="admin-filter-select" id="adminEmpDeptFilter" onchange="filterAdminEmployees()">
            <option value="ALL">${t('allDepartments')}</option>
            ${depts.map(d => `<option value="${d}">${tDept(d)}</option>`).join('')}
          </select>
          <button class="btn" onclick="openAddEmpModal()" style="background:linear-gradient(135deg, var(--theme-banner-start), var(--theme-banner-end));color:#fff;border:none;display:flex;align-items:center;gap:6px;">
            <span class="material-symbols-outlined" style="font-size:18px">person_add</span>
            <span>${t('addEmployee')}</span>
          </button>
        </div>
      </div>
      <div class="admin-roster-grid" id="adminRosterList">
        ${userRows}
      </div>
    </div>

    <!-- TAB 2: DEPARTMENTS -->
    <div id="sectionAdminDepartments" style="display:${adminActiveTab==='departments'?'block':'none'}">
      <div class="card" style="padding:20px;margin-bottom:20px;">
        <h3 style="margin-bottom:12px;">+ ${t('addDepartment')}</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <input type="text" id="newDeptNameInput" placeholder="${t('deptNamePlaceholder')}" style="flex:1;min-width:220px;padding:10px 14px;border-radius:12px;background:var(--card-bg);border:1px solid var(--card-border);color:var(--text-heading);outline:none;font-family:inherit;">
          <button class="btn" onclick="addNewDept()" style="background:linear-gradient(135deg, var(--theme-banner-start), var(--theme-banner-end));color:#fff;border:none;font-weight:bold;padding:10px 20px;">${t('createDeptBtn')}</button>
        </div>
      </div>
      <div class="admin-entity-grid">
        ${deptCards}
      </div>
    </div>

    <!-- TAB 3: ROLES -->
    <div id="sectionAdminRoles" style="display:${adminActiveTab==='roles'?'block':'none'}">
      <div class="card" style="padding:20px;margin-bottom:20px;">
        <h3 style="margin-bottom:12px;">+ ${t('addRole')}</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <input type="text" id="newRoleNameInput" placeholder="${t('roleNamePlaceholder')}" style="flex:1;min-width:220px;padding:10px 14px;border-radius:12px;background:var(--card-bg);border:1px solid var(--card-border);color:var(--text-heading);outline:none;font-family:inherit;">
          <button class="btn" onclick="addNewRole()" style="background:linear-gradient(135deg, var(--theme-banner-start), var(--theme-banner-end));color:#fff;border:none;font-weight:bold;padding:10px 20px;">${t('createRoleBtn')}</button>
        </div>
      </div>
      <div class="admin-entity-grid">
        ${roleCards}
      </div>
    </div>
  `;
}

async function render() {
  const pages = {
    home: () => home(),
    news: newsPage,
    events: eventsPage,
    department: departmentPage,
    resources: resourcesPage,
    contacts: contactsPage,
    faqs: faqsPage,
    feedback: feedbackPage,
    recognition: recognitionPage,
    admin: adminPage,
    settings: settingsPage
  };
  
  try {
    const pageFn = pages[page] || pages.home;
    let html = await pageFn();
    if (content) content.innerHTML = html;
    if (page === 'home') bindFeedSwipe();
  } catch (err) {
    console.error('Render error on page:', page, err);
    if (content) {
      content.innerHTML = `
        <div class="card" style="padding:28px;text-align:center;">
          <h2 style="color:#ef4444;margin-bottom:10px;">⚠️ View Error</h2>
          <p style="color:var(--text-muted);font-size:13px;">${err.message || 'An error occurred while loading this page.'}</p>
          <button class="btn" onclick="go('home')" style="margin-top:16px;">Return Home</button>
        </div>
      `;
    }
  }
}

// =========================================================
// MODULE 6: HERO SWIPE DECK & MULTI-DIRECTIONAL GESTURES
// =========================================================
function feedDeck() {
  const items = getFeedItems();
  const item = items[feedIndex] || items[0];
  const dots = items.map((_, i) => `<span class="feed-dot ${i === feedIndex ? 'active' : ''}"></span>`).join('');
  const isRtl = arabic;
  const nextIcon = isRtl ? 'arrow_back' : 'arrow_forward';
  const prevIcon = isRtl ? 'arrow_forward' : 'arrow_back';

  return `<section class="feed-section">
    <div class="feed-stage" id="feedStage" aria-label="Swipeable updates feed (Swipe left for next, right for previous, up for details)">
      <article class="feed-card glass-panel" id="feedCard" tabindex="0">
        <div class="feed-inner-banner">
          <h3 class="banner-kode-title">KODE</h3>
          <span class="badge feed-type-badge">${item.type}</span>
        </div>
        <h4 class="feed-card-title">${item.title}</h4>
        <p class="feed-card-body">${item.summary}</p>
        <div class="feed-controls">
          <div class="feed-dots" aria-label="${items.length} feed items">${dots}</div>
          <div class="feed-actions">
            <button class="feed-action-btn" onclick="prevFeed()" title="${t('prev')} (Swipe Right)">
              <span class="material-symbols-outlined">${prevIcon}</span> <span>${t('prev')}</span>
            </button>
            <button class="feed-action-btn" onclick="advanceFeed()" title="${t('next')} (Swipe Left)">
              <span>${t('next')}</span> <span class="material-symbols-outlined">${nextIcon}</span>
            </button>
            <button class="feed-action-btn primary-action" onclick="openFeedDetails()" title="${t('details')} (Swipe Up)">
              <span class="material-symbols-outlined">info</span> <span>${t('details')}</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>`;
}

function advanceFeed() {
  const items = getFeedItems();
  feedIndex = (feedIndex + 1) % items.length;
  render();
}

function prevFeed() {
  const items = getFeedItems();
  feedIndex = (feedIndex - 1 + items.length) % items.length;
  render();
}

function openFeedDetails() {
  const items = getFeedItems();
  const item = items[feedIndex] || items[0];
  const isDept = item.dept.includes('Marketing') || item.dept.includes('تسويق') || item.allowComments;
  const action = isDept ? "go('department')" : `toastMsg('${item.action}')`;
  
  modal.classList.add('show');
  document.getElementById('modalBody').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span class="pill primary">${item.dept}</span>
      <small style="color:var(--text-muted);font-size:11px;">${item.time}</small>
    </div>
    <h2 class="feed-modal-title" style="margin-top:8px">${item.title}</h2>
    <p class="feed-modal-copy" style="line-height:1.6;margin:16px 0;font-size:14px;color:var(--text-body)">${item.details}</p>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:18px;">
      ${isDept ? `<button class="btn light" onclick="document.getElementById('closeModal').click();openComments('news', 2, '${item.title.replace(/'/g, "\\'")}')">💬 ${t('comments')}</button>` : ''}
      <button class="btn" onclick="document.getElementById('closeModal').click();${action}">${item.action}</button>
    </div>
  `;
}

function bindFeedSwipe() {
  const card = document.getElementById('feedCard');
  if (!card) return;
  let startX = 0, startY = 0, deltaX = 0, deltaY = 0, dragging = false;
  let wheelTimeout = null;
  
  const reset = () => {
    card.style.transform = '';
    card.style.opacity = '';
    card.classList.remove('dragging', 'leaving-left', 'leaving-right', 'leaving-up');
  };
  
  const move = e => {
    if (!dragging) return;
    deltaX = e.clientX - startX;
    deltaY = e.clientY - startY;
    
    // Check if vertical upward drag or horizontal drag
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
      card.style.transform = `translateY(${deltaY}px) scale(${Math.max(0.92, 1 + deltaY / 600)})`;
    } else {
      card.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 28}deg)`;
    }
  };
  
  const finish = () => {
    if (!dragging) return;
    dragging = false;
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', finish);
    window.removeEventListener('pointercancel', cancel);
    
    // Swipe Up -> Details
    if (deltaY <= -50 && Math.abs(deltaY) > Math.abs(deltaX)) {
      card.classList.add('leaving-up');
      setTimeout(openFeedDetails, 180);
      setTimeout(reset, 200);
    }
    // Swipe Left -> Next
    else if (deltaX <= -50) {
      card.classList.add('leaving-left');
      setTimeout(advanceFeed, 180);
    }
    // Swipe Right -> Previous
    else if (deltaX >= 50) {
      card.classList.add('leaving-right');
      setTimeout(prevFeed, 180);
    } else {
      reset();
    }
  };
  
  const cancel = () => {
    dragging = false;
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', finish);
    window.removeEventListener('pointercancel', cancel);
    reset();
  };
  
  // 1. Mouse / Pointer / Touch drag support
  card.addEventListener('pointerdown', e => {
    startX = e.clientX;
    startY = e.clientY;
    deltaX = 0;
    deltaY = 0;
    dragging = true;
    card.classList.add('dragging');
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', cancel);
  });
  
  // 2. Trackpad / Wheel gesture support (Left = Next, Right = Prev, Up = Details)
  card.addEventListener('wheel', e => {
    const rawDeltaX = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    const rawDeltaY = e.deltaY;
    
    if (Math.abs(rawDeltaX) < 18 && Math.abs(rawDeltaY) < 25) return;
    
    e.preventDefault();
    if (wheelTimeout) return;
    
    if (rawDeltaY < -30 && Math.abs(rawDeltaY) > Math.abs(rawDeltaX)) {
      // Swiped Up -> Open Details
      card.classList.add('leaving-up');
      wheelTimeout = setTimeout(() => {
        openFeedDetails();
        setTimeout(reset, 190);
        wheelTimeout = null;
      }, 180);
    } else if (rawDeltaX > 0) {
      // Swiped Left -> Next
      card.classList.add('leaving-left');
      wheelTimeout = setTimeout(() => {
        advanceFeed();
        wheelTimeout = null;
      }, 180);
    } else if (rawDeltaX < 0) {
      // Swiped Right -> Previous
      card.classList.add('leaving-right');
      wheelTimeout = setTimeout(() => {
        prevFeed();
        wheelTimeout = null;
      }, 180);
    }
  }, { passive: false });
  
  // 3. Keyboard navigation: ArrowLeft (Next), ArrowRight (Prev), ArrowUp (Details)
  card.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') advanceFeed();
    if (e.key === 'ArrowRight') prevFeed();
    if (e.key === 'ArrowUp') openFeedDetails();
  });
}

// =========================================================
// MODULE 7: THEME ENGINE, BACKGROUND MODES & LANGUAGE
// =========================================================
const themeNames = {
  default: 'KODE Purple',
  ocean: 'Ocean',
  emerald: 'Emerald',
  sunset: 'Sunset',
  rose: 'Rose',
  indigo: 'Indigo'
};

let bgMode = localStorage.getItem('kode-bg-mode') || 'galaxy';

function setBgMode(mode) {
  bgMode = mode;
  localStorage.setItem('kode-bg-mode', mode);
  applyBgMode();
  if (page === 'settings') render();
  toastMsg(mode === 'galaxy' ? (arabic ? 'تم تفعيل خلفية المجرة' : 'Galaxy background active') :
           mode === 'crystal' ? (arabic ? 'تم تفعيل خلفية الكريستال' : 'Crystal background active') :
           (arabic ? 'تم تفعيل نمط ألوان السمة البسيط' : 'Clean theme active'));
}

function applyBgMode() {
  document.body.setAttribute('data-bg-mode', bgMode);
  const appBg = document.getElementById('appBg');
  if (appBg) {
    appBg.setAttribute('data-bg-mode', bgMode);
    if (bgMode === 'galaxy') {
      appBg.style.backgroundImage = "var(--app-bg-overlay), url('assets/bg-nebula.png')";
    } else if (bgMode === 'crystal') {
      appBg.style.backgroundImage = "var(--app-bg-overlay), url('assets/bg-stitch-crystal.jpg')";
    } else {
      appBg.style.backgroundImage = "";
    }
  }
}

function toggleAppearance() {
  dark = !dark;
  document.body.classList.toggle('dark', dark);
  localStorage.setItem('kode-mode', dark ? 'dark' : 'light');
  toastMsg(dark ? t('toastDark') : t('toastLight'), 800);
  if (page === 'settings') render();
}

function toggleLanguage() {
  arabic = !arabic;
  document.documentElement.dir = arabic ? 'rtl' : 'ltr';
  document.body.classList.toggle('rtl', arabic);
  localStorage.setItem('kode-lang', arabic ? 'ar' : 'en');
  updateStaticUI();
  updateUserUI();
  if (currentUser) render();
  toastMsg(arabic ? t('toastAr') : t('toastEn'), 1000);
}

function setTheme(name) {
  document.body.dataset.theme = name === 'default' ? '' : name;
  localStorage.setItem('kode-theme', name);
  document.querySelectorAll('.theme-choice').forEach(x => x.classList.toggle('active', x.dataset.theme === name));
  toastMsg(themeNames[name] + (arabic ? ' تم تفعيل المظهر' : ' theme enabled'), 800);
  if (page === 'settings') render();
}

function openThemes() {
  go('settings');
}

// =========================================================
// MODULE 8: INTERACTIVE MODALS & CRUD HANDLERS
// =========================================================
function contactFilter() {
  let q = document.getElementById('contactSearch')?.value.toLowerCase() || '';
  document.querySelectorAll('.contact').forEach(x => x.style.display = x.dataset.key.includes(q) ? 'block' : 'none');
}

function ask() {
  let q = document.getElementById('q')?.value.trim();
  if (!q) return toastMsg(arabic ? 'يرجى كتابة سؤالك أولاً' : 'Please write your question first');
  toastMsg(arabic ? 'تم إرسال السؤال إلى إدارة التسويق بنجاح' : 'Question submitted to Marketing');
  const qEl = document.getElementById('q');
  if (qEl) qEl.value = '';
}

function submitFeedback() {
  const fb = document.getElementById('feedback')?.value.trim();
  if (!fb) return toastMsg(arabic ? 'يرجى كتابة مقترحك أولاً' : 'Please add your feedback');
  toastMsg(arabic ? 'تم استلام مقترحك بنجاح. شكراً لمشاركتك!' : 'Feedback submitted successfully');
  const fbEl = document.getElementById('feedback');
  if (fbEl) fbEl.value = '';
}

function openNotifications() {
  const list = document.getElementById('notificationList');
  if (list) list.innerHTML = notificationHtml();
  if (drawer) drawer.classList.add('show');
}

window.switchRole = async (id) => {
  await window.apiService.loginAsUser(id);
  currentUser = await window.apiService.getCurrentUser();
  updateUserUI();
  if (modal?.classList.contains('show')) document.getElementById('closeModal')?.click();
  toastMsg((arabic ? 'تم التبديل إلى ' : 'Switched to ') + currentUser.name);
  render();
};

window.updateRole = async (userId, role) => {
  await window.apiService.changeUserRole(userId, role);
  toastMsg(arabic ? 'تم تحديث الدور بنجاح' : 'Role updated');
  render();
};

window.updateDept = async (userId, dept) => {
  await window.apiService.assignDepartment(userId, dept);
  toastMsg(arabic ? 'تم تحديث الإدارة بنجاح' : 'Department updated');
  render();
};

window.addNewDept = async () => {
  const val = (document.getElementById('newDeptNameInput')?.value || document.getElementById('newDeptName')?.value || '').trim();
  if (!val) return toastMsg(arabic ? 'يرجى كتابة اسم الإدارة' : 'Please enter department name');
  await window.apiService.addDepartment(val);
  toastMsg(arabic ? 'تمت إضافة الإدارة بنجاح' : 'Department added');
  render();
};

window.removeEmp = async (id) => {
  if (!confirm(arabic ? "هل أنت متأكد من حذف هذا الموظف؟" : "Remove this employee?")) return;
  await window.apiService.removeEmployee(id);
  toastMsg(arabic ? "تم حذف الموظف" : "Employee removed");
  render();
};

window.openAddEmpModal = async () => {
  const depts = await window.apiService.getDepartments();
  const roles = await window.apiService.getRoles();
  modal.classList.add('show');
  document.getElementById('modalBody').innerHTML = `
    <h2 style="margin-bottom:14px">${t('addEmployee')}</h2>
    <div class="form" style="display:flex;flex-direction:column;gap:12px;">
      <input id="newEmpName" placeholder="${t('employeeNamePlaceholder')}" style="width:100%;padding:10px 14px;border-radius:12px;background:var(--card-bg);border:1px solid var(--card-border);color:var(--text-heading);outline:none;font-family:inherit;">
      <input id="newEmpEmail" placeholder="${t('employeeEmailPlaceholder')}" style="width:100%;padding:10px 14px;border-radius:12px;background:var(--card-bg);border:1px solid var(--card-border);color:var(--text-heading);outline:none;font-family:inherit;">
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <select id="newEmpDept" style="flex:1;min-width:160px;padding:10px 14px;border-radius:12px;background:var(--card-bg);border:1px solid var(--card-border);color:var(--text-heading);outline:none;font-family:inherit;">
          ${depts.map(d => `<option value="${d}">${tDept(d)}</option>`).join('')}
        </select>
        <select id="newEmpRole" style="flex:1;min-width:160px;padding:10px 14px;border-radius:12px;background:var(--card-bg);border:1px solid var(--card-border);color:var(--text-heading);outline:none;font-family:inherit;">
          ${roles.map(r => `<option value="${r}">${tRole(r)}</option>`).join('')}
        </select>
      </div>
      <button class="btn" onclick="submitNewEmp()" style="background:linear-gradient(135deg, var(--theme-banner-start), var(--theme-banner-end));color:#fff;border:none;margin-top:6px;padding:12px;font-weight:bold;">${t('addEmployee')}</button>
    </div>
  `;
};

window.submitNewEmp = async () => {
  const name = document.getElementById('newEmpName')?.value.trim();
  const email = document.getElementById('newEmpEmail')?.value.trim();
  const dept = document.getElementById('newEmpDept')?.value;
  const role = document.getElementById('newEmpRole')?.value;
  
  if (!name || !email) return toastMsg(arabic ? 'يرجى كتابة الاسم والبريد' : 'Please provide name and email');
  
  await window.apiService.addEmployee({ name, email, department: dept, role, avatar: name.split(' ').map(x => x[0]).join('').toUpperCase() });
  document.getElementById('closeModal').click();
  toastMsg(arabic ? 'تمت إضافة الموظف بنجاح' : 'Employee added successfully');
  render();
};

window.openAwardModal = async () => {
  const users = await window.apiService.getUsers();
  modal.classList.add('show');
  document.getElementById('modalBody').innerHTML = `
    <h2>${t('grantAward')}</h2>
    <div class="form">
      <select id="awardReceiver" style="width:100%">
        ${users.filter(u => u.id !== currentUser?.id).map(u => `<option value="${u.id}">${u.name} (${u.department})</option>`).join('')}
      </select>
      <input id="awardCriteria" placeholder="${arabic ? 'سبب التكريم (مثال: العمل الجماعي والتميز)' : 'Criteria (e.g., Great Teamwork)'}" style="width:100%">
      <input type="number" id="awardPoints" placeholder="${arabic ? 'عدد النقاط (مثال: 50)' : 'Points (e.g., 50)'}" style="width:100%">
      <button class="btn" onclick="submitAward()">${t('grantAward')}</button>
    </div>
  `;
};

window.submitAward = async () => {
  const recId = parseInt(document.getElementById('awardReceiver')?.value);
  const crit = document.getElementById('awardCriteria')?.value.trim();
  const pts = document.getElementById('awardPoints')?.value.trim();
  
  if (!crit || !pts) return toastMsg(arabic ? 'يرجى ملء جميع الحقول' : 'Please fill out criteria and points');
  
  await window.apiService.giveAward(currentUser.id, recId, crit, pts, '');
  document.getElementById('closeModal').click();
  toastMsg(arabic ? 'تم منح المكافأة بنجاح!' : 'Award granted successfully!');
  render();
};

window.openComments = async (postType, postId, title) => {
  const comments = await window.apiService.getComments(postType, postId);
  const users = await window.apiService.getUsers();
  
  let commentsHtml = comments.map(c => {
    const u = users.find(user => user.id === c.userId);
    return `<div style="border-bottom:1px solid var(--card-border);padding:10px 0">
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:5px">
        <div class="avatar sm" style="width:24px;height:24px;font-size:8px">${u?.avatar||'?'}</div>
        <b>${u?.name||'Unknown'}</b> <small style="color:var(--text-muted)">${c.date}</small>
      </div>
      <p style="margin:0;font-size:13px;color:var(--text-body)">${c.text}</p>
    </div>`;
  }).join('');
  
  if (!commentsHtml) commentsHtml = `<p style="color:var(--text-muted);font-size:12px;padding:10px 0">${t('noComments')}</p>`;

  modal.classList.add('show');
  document.getElementById('modalBody').innerHTML = `
    <h2 style="font-size:16px;margin-bottom:5px">${title}</h2>
    <p style="color:var(--text-muted);font-size:11px;margin-bottom:15px">${t('discussionThread')}</p>
    <div style="max-height:300px;overflow-y:auto;margin-bottom:15px;padding-right:10px">
      ${commentsHtml}
    </div>
    <div style="display:flex;gap:10px">
      <input id="newCommentText" placeholder="${t('writeComment')}" style="flex:1;padding:10px;border-radius:8px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text-heading)">
      <button class="btn" onclick="submitComment('${postType}', ${postId}, '${title.replace(/'/g, "\\'")}')">${t('post')}</button>
    </div>
  `;
};

window.submitComment = async (postType, postId, title) => {
  const txt = document.getElementById('newCommentText')?.value.trim();
  if (!txt) return;
  await window.apiService.addComment(postType, postId, currentUser.id, txt);
  openComments(postType, postId, title);
};

// =========================================================
// MODULE 10: AUTO-HIDING COLLAPSIBLE SEARCH & EVENT BINDINGS
// =========================================================
document.querySelectorAll('.nav[data-page]').forEach(b => {
  b.addEventListener('click', () => go(b.dataset.page));
});

const notifBtn = document.getElementById('notifications');
if (notifBtn) notifBtn.onclick = openNotifications;
const closeDrawerBtn = document.getElementById('closeDrawer');
if (closeDrawerBtn) closeDrawerBtn.onclick = () => drawer?.classList.remove('show');

const closeModalBtn = document.getElementById('closeModal');
if (closeModalBtn) closeModalBtn.onclick = () => modal?.classList.remove('show');

if (modal) {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('show');
  });
}

if (drawer) {
  drawer.addEventListener('click', e => {
    if (e.target === drawer) drawer.classList.remove('show');
  });
}

const logoutBtn = document.getElementById('logout');
if (logoutBtn) logoutBtn.onclick = () => handleLogout();
const mobileMenuBtn = document.getElementById('mobileMenu');
if (mobileMenuBtn) mobileMenuBtn.onclick = () => document.querySelector('.sidebar')?.classList.toggle('mobile-open');

// --- REQUIREMENT 4: AUTO-HIDING SEARCH BAR (Hidden at start & hides on cursor leave) ---
const searchHoverZone = document.getElementById('searchHoverZone');
const searchContainer = document.getElementById('searchContainer');
const searchTrigger = document.getElementById('searchTrigger');
const searchInputEl = document.getElementById('search');
window.toggleIosSearch = () => {
  const searchWrapper = document.getElementById('iosSearchWrapper');
  const searchInput = document.getElementById('search');
  if (!searchWrapper) return;
  const isVisible = searchWrapper.classList.contains('ios-search-visible');
  if (isVisible) {
    searchWrapper.classList.remove('ios-search-visible');
    searchInput?.blur();
  } else {
    searchWrapper.classList.add('ios-search-visible');
    searchInput?.focus();
  }
};

function initIosSearch() {
  const searchWrapper = document.getElementById('iosSearchWrapper');
  const searchInput = document.getElementById('search');
  const searchClearBtn = document.getElementById('searchClearBtn');
  if (!searchWrapper) return;

  // Search bar starts HIDDEN
  searchWrapper.classList.remove('ios-search-visible');

  // iOS-style scroll detection:
  // When scrolling down into content (> 15px), smoothly hide the search bar.
  const handleScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const isFocused = document.activeElement === searchInput;
    const hasValue = searchInput && searchInput.value.trim().length > 0;

    if (isFocused || hasValue) {
      searchWrapper.classList.add('ios-search-visible');
      return;
    }

    if (scrollY > 15) {
      searchWrapper.classList.remove('ios-search-visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('scroll', handleScroll, { passive: true });

  // Mouse wheel pull-down detection at the top of the page
  window.addEventListener('wheel', (e) => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const isFocused = document.activeElement === searchInput;
    const hasValue = searchInput && searchInput.value.trim().length > 0;
    if (isFocused || hasValue) return;

    if (scrollY <= 10 && e.deltaY < -10) {
      // Pulling down at top of page -> Reveal search bar
      searchWrapper.classList.add('ios-search-visible');
    } else if (e.deltaY > 15 || scrollY > 20) {
      // Scrolling down -> Hide search bar
      searchWrapper.classList.remove('ios-search-visible');
    }
  }, { passive: true });

  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchWrapper.classList.add('ios-search-visible');
    });
    searchInput.addEventListener('blur', () => {
      setTimeout(handleScroll, 150);
    });
    searchInput.addEventListener('input', () => {
      if (searchClearBtn) searchClearBtn.style.display = searchInput.value ? 'grid' : 'none';
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        go('news');
        toastMsg((arabic ? 'بحث عن: ' : 'Searching for: ') + searchInput.value);
      }
      if (e.key === 'Escape') {
        searchInput.value = '';
        if (searchClearBtn) searchClearBtn.style.display = 'none';
        searchInput.blur();
        searchWrapper.classList.remove('ios-search-visible');
      }
    });
  }

  // iOS Pull-Down Touch Gesture at Top of Screen
  let touchStartY = 0;
  window.addEventListener('touchstart', e => {
    if ((window.scrollY || document.documentElement.scrollTop || 0) <= 10) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (touchStartY > 0 && (window.scrollY || document.documentElement.scrollTop || 0) <= 10) {
      const touchY = e.touches[0].clientY;
      if (touchY - touchStartY > 30) {
        searchWrapper.classList.add('ios-search-visible');
      }
    }
  }, { passive: true });
}

// Global Hotkeys
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modal?.classList.contains('show')) modal.classList.remove('show');
    if (drawer?.classList.contains('show')) drawer.classList.remove('show');
    const searchWrapper = document.getElementById('iosSearchWrapper');
    if (searchWrapper && (window.scrollY || 0) > 25) searchWrapper.classList.remove('ios-search-visible');
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const searchWrapper = document.getElementById('iosSearchWrapper');
    const searchInput = document.getElementById('search');
    if (searchWrapper) searchWrapper.classList.add('ios-search-visible');
    if (searchInput) searchInput.focus();
  }
});

// Hydrate Theme & Background Mode
const savedTheme = localStorage.getItem('kode-theme') || 'default';
if (savedTheme !== 'default') document.body.setAttribute('data-theme', savedTheme);
applyBgMode();
initIosSearch();

// Start App Lifecycle
initApp();
async function initApp() {
  currentUser = await window.apiService.getCurrentUser();
  if (currentUser) {
    showApp();
  } else {
    showLogin();
  }
}

window.switchAdminTab = (tab) => {
  adminActiveTab = tab;
  render();
};

window.filterAdminEmployees = () => {
  const q = document.getElementById('adminEmpSearch')?.value.toLowerCase() || '';
  const dept = document.getElementById('adminEmpDeptFilter')?.value || 'ALL';
  
  document.querySelectorAll('#adminRosterList .admin-user-card').forEach(card => {
    const name = card.dataset.name || '';
    const email = card.dataset.email || '';
    const cardDept = card.dataset.dept || '';
    
    const matchQuery = name.includes(q) || email.includes(q);
    const matchDept = dept === 'ALL' || cardDept === dept;
    card.style.display = (matchQuery && matchDept) ? 'flex' : 'none';
  });
};

window.addNewRole = async () => {
  const val = document.getElementById('newRoleNameInput')?.value.trim();
  if (!val) return toastMsg(arabic ? 'يرجى كتابة اسم الدور الوظيفي' : 'Please enter role name');
  await window.apiService.addRole(val);
  toastMsg(arabic ? 'تمت إضافة الدور الوظيفي بنجاح' : 'Role added successfully');
  render();
};
