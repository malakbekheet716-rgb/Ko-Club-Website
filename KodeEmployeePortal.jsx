import React, { useState, useRef } from "react";
import {
  Home, Newspaper, CalendarDays, HelpCircle, Bell, Palette,
  Check, MapPin, Clock, X, ChevronDown, Search, Users, Award,
  ShieldCheck, LogOut,
} from "lucide-react";

/* ===========================================================
   THEME SYSTEM — "Match Point" (blue/purple) is default.
=========================================================== */
const THEMES = {
  matchpoint: { name: { en: "Match Point", ar: "نقطة الحسم" }, sub: { en: "Blue / purple — default", ar: "أزرق / بنفسجي — افتراضي" }, bg: "#0B0B18", surface: "#15122A", surface2: "#1E1938", border: "#2A2350", text: "#F4F3FF", textMuted: "#9C96B8", accent1: "#3E6BFF", accent2: "#9147FF", success: "#34D399", warning: "#FBBF24" },
  hometurf: { name: { en: "Home Turf", ar: "أرض الملعب" }, sub: { en: "Green / teal", ar: "أخضر / تركواز" }, bg: "#0A1712", surface: "#102420", surface2: "#173229", border: "#1F4034", text: "#F1FBF6", textMuted: "#8FB8A8", accent1: "#22C55E", accent2: "#14B8A6", success: "#34D399", warning: "#FBBF24" },
  awayday: { name: { en: "Away Day", ar: "يوم الخصم" }, sub: { en: "Orange / red", ar: "برتقالي / أحمر" }, bg: "#1A0E08", surface: "#271409", surface2: "#33190C", border: "#432313", text: "#FDF3EC", textMuted: "#C9A38C", accent1: "#FB923C", accent2: "#EF4444", success: "#34D399", warning: "#FBBF24" },
  nightshift: { name: { en: "Night Shift", ar: "المناوبة الليلية" }, sub: { en: "Monochrome", ar: "أحادي اللون" }, bg: "#0D0D0F", surface: "#1A1A1D", surface2: "#242427", border: "#333336", text: "#F5F5F5", textMuted: "#9C9C9F", accent1: "#A1A1AA", accent2: "#71717A", success: "#34D399", warning: "#FBBF24" },
  daygame: { name: { en: "Day Game", ar: "مباراة النهار" }, sub: { en: "Light mode", ar: "الوضع الفاتح" }, bg: "#F5F5FA", surface: "#FFFFFF", surface2: "#EFEEFA", border: "#E2E0F0", text: "#18132E", textMuted: "#5C5578", accent1: "#3E6BFF", accent2: "#9147FF", success: "#16A34A", warning: "#D97706" },
};

/* ===========================================================
   DEPARTMENTS
=========================================================== */
const DEPARTMENTS = [
  { id: "hr", name: { en: "HR", ar: "الموارد البشرية" } },
  { id: "tech", name: { en: "Tech", ar: "التقنية" } },
  { id: "safety", name: { en: "Safety", ar: "السلامة" } },
  { id: "foodsafety", name: { en: "Food Safety", ar: "سلامة الغذاء" } },
  { id: "marketing", name: { en: "Marketing", ar: "التسويق" } },
  { id: "sports", name: { en: "Sports", ar: "الرياضة" } },
  { id: "housekeeping", name: { en: "Housekeeping", ar: "التدبير المنزلي" } },
  { id: "security", name: { en: "Security", ar: "الأمن" } },
  { id: "pr", name: { en: "PR", ar: "العلاقات العامة" } },
  { id: "operations", name: { en: "Operations", ar: "العمليات" } },
];

function deptName(id, lang) {
  const d = DEPARTMENTS.find((x) => x.id === id);
  return d ? d.name[lang] : "";
}

const ROLE_LEVELS = ["Manager", "Supervisor", "Team Lead", "Employee"];
const ROLE_SEQUENCE = ["Manager", "Supervisor", "Team Lead", "Employee", "Employee", "Employee"];
const CAN_MANAGE_POINTS = ["Manager", "Supervisor"];
const ROLE_LABELS = {
  Manager: { en: "Manager", ar: "مدير" },
  Supervisor: { en: "Supervisor", ar: "مشرف" },
  "Team Lead": { en: "Team Lead", ar: "قائد فريق" },
  Employee: { en: "Employee", ar: "موظف" },
};

/* ===========================================================
   DIRECTORY — 6 people per department (Manager, Supervisor,
   Team Lead, 3 Employees), generated from a name pool.
=========================================================== */
const NAME_POOL = [
  ["Omar Hassan", "عمر حسن"], ["Laila Ahmed", "ليلى أحمد"], ["Youssef Ibrahim", "يوسف إبراهيم"],
  ["Nour ElDin", "نور الدين"], ["Sara Mostafa", "سارة مصطفى"], ["Karim Adel", "كريم عادل"],
  ["Mona Fathy", "منى فتحي"], ["Tarek Younes", "طارق يونس"], ["Hana Samir", "هناء سمير"],
  ["Ziad Mansour", "زياد منصور"], ["Dina Kamal", "دينا كمال"], ["Ahmed Fouad", "أحمد فؤاد"],
  ["Salma Reda", "سلمى رضا"], ["Amr Nabil", "عمرو نبيل"], ["Yasmin Farouk", "ياسمين فاروق"],
  ["Mahmoud Aziz", "محمود عزيز"], ["Rania Sobhy", "رانيا صبحي"], ["Hossam Latif", "حسام لطيف"],
  ["Nadia Shawky", "نادية شوقي"], ["Khaled Ezzat", "خالد عزت"], ["Farida Gamal", "فريدة جمال"],
  ["Sherif Anwar", "شريف أنور"], ["Mariam Talaat", "مريم طلعت"], ["Omar Zaki", "عمر زكي"],
  ["Heba Rashad", "هبة رشاد"], ["Aly Hesham", "علي هشام"], ["Reem Fahmy", "ريم فهمي"],
  ["Waleed Nasr", "وليد نصر"], ["Dalia Sabry", "داليا صبري"], ["Fady Boutros", "فادي بطرس"],
  ["Passant Waheed", "باسنت وحيد"], ["Tamer Saeed", "تامر سعيد"], ["Nourhan Adly", "نورهان عدلي"],
  ["Amir Refaat", "أمير رفعت"], ["Yara Salah", "يارا صلاح"], ["Islam Barakat", "إسلام بركات"],
  ["Marwa Hafez", "مروة حافظ"], ["Basel Amin", "باسل أمين"], ["Aya Mounir", "آية منير"],
  ["Ehab Ghali", "إيهاب غالي"], ["Salma Kotb", "سلمى قطب"], ["Ramy Habib", "رامي حبيب"],
  ["Ola Sherif", "علا شريف"], ["Adel Rizk", "عادل رزق"], ["Nesma Fikry", "نسمة فكري"],
  ["Kareem Lotfy", "كريم لطفي"], ["Hoda Zidan", "هدى زيدان"], ["Bassem Nour", "باسم نور"],
  ["Rana Khalil", "رنا خليل"], ["Sameh Aref", "سامح عارف"], ["Mai Shokry", "مي شكري"],
  ["Wael Deif", "وائل ضيف"], ["Doaa Helmy", "دعاء حلمي"], ["Fadi Antoun", "فادي أنطون"],
  ["Lina Rostom", "لينا رستم"], ["Hassan Farid", "حسن فريد"], ["Amina Selim", "أمينة سليم"],
  ["Peter George", "بيتر جورج"], ["Jana Wagdy", "جنى وجدي"], ["Mostafa Naguib", "مصطفى نجيب"],
];

function buildDirectory() {
  const dir = [];
  DEPARTMENTS.forEach((dept, di) => {
    const names = NAME_POOL.slice(di * 6, di * 6 + 6);
    let managerId = null, supervisorId = null, teamLeadId = null;
    names.forEach((pair, ri) => {
      const role = ROLE_SEQUENCE[ri];
      const id = `${dept.id}-${ri}`;
      const initials = pair[0].split(" ").map((n) => n[0]).join("");
      let reportsTo = null;
      if (role === "Supervisor") reportsTo = managerId;
      if (role === "Team Lead") reportsTo = supervisorId;
      if (role === "Employee") reportsTo = teamLeadId;
      const person = { id, name: { en: pair[0], ar: pair[1] }, role, departmentId: dept.id, initials, reportsTo };
      if (role === "Manager") managerId = id;
      if (role === "Supervisor") supervisorId = id;
      if (role === "Team Lead") teamLeadId = id;
      dir.push(person);
    });
  });
  return dir;
}
const DIRECTORY = buildDirectory();

/* ===========================================================
   AWARDS / POINTS
=========================================================== */
const AWARD_CRITERIA = ["Performance", "Teamwork", "Punctuality", "Initiative"];
const CRITERIA_LABELS = {
  Performance: { en: "Performance", ar: "الأداء" },
  Teamwork: { en: "Teamwork", ar: "العمل الجماعي" },
  Punctuality: { en: "Punctuality", ar: "الالتزام بالمواعيد" },
  Initiative: { en: "Initiative", ar: "المبادرة" },
};

function monthKeyOffset(offset) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabelFromKey(monthKey, lang) {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { month: "long", year: "numeric" });
}
const LAST_MONTH_KEY = monthKeyOffset(-1);

const INITIAL_AWARDS = [
  { id: "seed-1", employeeId: "tech-3", departmentId: "tech", monthKey: LAST_MONTH_KEY, scores: { Performance: 5, Teamwork: 4, Punctuality: 5, Initiative: 4 }, reason: "Shipped the new training app beta two weeks ahead of schedule and mentored two new hires along the way.", awardedById: "tech-0" },
  { id: "seed-2", employeeId: "hr-4", departmentId: "hr", monthKey: LAST_MONTH_KEY, scores: { Performance: 4, Teamwork: 5, Punctuality: 5, Initiative: 4 }, reason: "Ran open enrollment info sessions for every shift without a single scheduling conflict.", awardedById: "hr-0" },
  { id: "seed-3", employeeId: "marketing-5", departmentId: "marketing", monthKey: LAST_MONTH_KEY, scores: { Performance: 5, Teamwork: 4, Punctuality: 4, Initiative: 5 }, reason: "Kept the Season 24 shoot on budget and on schedule despite two last-minute location changes.", awardedById: "marketing-0" },
];

const INITIAL_COMMENTS = {
  tech: [
    { id: "c-seed-1", authorId: "tech-3", text: "Anyone know if the new app beta is on iOS yet, or Android only for now?", ts: Date.now() - 86400000 },
    { id: "c-seed-2", authorId: "tech-1", text: "الأندرويد فقط للأسبوعين الأولين، وبعدها ينضم iOS للتجربة — هأكد الموعد بمجرد ما الجودة توافق.", ts: Date.now() - 82800000 },
  ],
};

/* ===========================================================
   CONTENT — News / Events / FAQs (bilingual, department-tagged)
=========================================================== */
const CATEGORY_LABELS = {
  Company: { en: "Company", ar: "الشركة" },
  "HR & Benefits": { en: "HR & Benefits", ar: "الموارد البشرية والمزايا" },
  Product: { en: "Product", ar: "المنتج" },
  Safety: { en: "Safety", ar: "السلامة" },
  Security: { en: "Security", ar: "الأمن" },
  Marketing: { en: "Marketing", ar: "التسويق" },
  Social: { en: "Social", ar: "اجتماعي" },
  Wellness: { en: "Wellness", ar: "العافية" },
};

const NEWS = [
  { id: 1, categoryKey: "Company", audience: "all", unread: true,
    title: { en: "Q3 results: running line revenue up 18%", ar: "نتائج الربع الثالث: ارتفاع إيرادات خط الجري 18%" },
    excerpt: { en: "The performance range outsold projections for a third straight quarter, led by the new trail collection.", ar: "تجاوزت مجموعة الأداء التوقعات للربع الثالث على التوالي، بقيادة تشكيلة الجري الوعرة الجديدة." },
    date: { en: "Aug 12", ar: "12 أغسطس" }, author: { en: "Comms Team", ar: "فريق الاتصالات" } },
  { id: 2, categoryKey: "HR & Benefits", audience: "all", unread: true,
    title: { en: "Open enrollment opens September 1", ar: "باب التسجيل في المزايا يفتح 1 سبتمبر" },
    excerpt: { en: "Review your health, dental, and wellness stipend options before the window closes on the 15th.", ar: "راجع خيارات التأمين الصحي وتأمين الأسنان وبدل العافية قبل إغلاق الباب في يوم 15." },
    date: { en: "Aug 11", ar: "11 أغسطس" }, author: { en: "People Team", ar: "فريق الموارد البشرية" } },
  { id: 3, categoryKey: "Product", audience: "tech", unread: false,
    title: { en: "Training app beta needs testers", ar: "تطبيق التدريب التجريبي يحتاج مختبرين" },
    excerpt: { en: "Fifty spots left for the internal beta of the new performance-tracking app. Sign up on the intranet form.", ar: "تبقّى خمسون مقعدًا للنسخة التجريبية الداخلية من تطبيق تتبع الأداء الجديد. سجّل عبر نموذج الإنترانت." },
    date: { en: "Aug 9", ar: "9 أغسطس" }, author: { en: "Product Team", ar: "فريق المنتج" } },
  { id: 4, categoryKey: "Safety", audience: "safety", unread: false,
    title: { en: "New PPE checklist rolled out on the floor", ar: "قائمة تحقق جديدة لمعدات الحماية على أرض العمل" },
    excerpt: { en: "All shift leads must review the updated checklist before Monday. Printed copies are at every station.", ar: "على جميع رؤساء الورديات مراجعة القائمة المحدثة قبل يوم الاثنين. نسخ مطبوعة متوفرة في كل محطة." },
    date: { en: "Aug 8", ar: "8 أغسطس" }, author: { en: "Safety Team", ar: "فريق السلامة" } },
  { id: 5, categoryKey: "Security", audience: "security", unread: false,
    title: { en: "Badge access updated at Gate 2", ar: "تحديث نظام الدخول ببطاقة الهوية عند البوابة 2" },
    excerpt: { en: "New readers go live Thursday. Re-tap your badge once at the kiosk to re-sync access.", ar: "تُفعَّل الأجهزة الجديدة يوم الخميس. مرّر بطاقتك مرة واحدة عند الكشك لإعادة مزامنة الصلاحية." },
    date: { en: "Aug 7", ar: "7 أغسطس" }, author: { en: "Security Team", ar: "فريق الأمن" } },
  { id: 6, categoryKey: "Marketing", audience: "marketing", unread: false,
    title: { en: "Season 24 campaign shoot wraps next week", ar: "تصوير حملة الموسم 24 ينتهي الأسبوع القادم" },
    excerpt: { en: "Thanks to everyone who helped on set. First look at the assets lands in the brand channel Friday.", ar: "شكرًا لكل من ساعد في موقع التصوير. أول عرض للمواد يصل إلى قناة العلامة التجارية يوم الجمعة." },
    date: { en: "Aug 6", ar: "6 أغسطس" }, author: { en: "Marketing Team", ar: "فريق التسويق" } },
  { id: 7, categoryKey: "Company", audience: "all", unread: false,
    title: { en: "Welcome our new VP of Retail, Sara Nasser", ar: "رحبوا بنائبة رئيس التجزئة الجديدة، سارة ناصر" },
    excerpt: { en: "Sara joins from twelve years in global retail operations and starts with the Cairo store walkthroughs.", ar: "تنضم سارة بخبرة اثني عشر عامًا في عمليات التجزئة العالمية، وتبدأ بجولات في فروع القاهرة." },
    date: { en: "Aug 4", ar: "4 أغسطس" }, author: { en: "Comms Team", ar: "فريق الاتصالات" } },
];

const EVENTS = [
  { id: 1, categoryKey: "Safety", audience: "safety", day: "18", month: { en: "AUG", ar: "أغسطس" }, weekday: { en: "Tuesday", ar: "الثلاثاء" }, time: "11:00 AM",
    title: { en: "Fire evacuation walkthrough", ar: "تدريب على إخلاء الحريق" }, location: { en: "All Floors", ar: "جميع الطوابق" } },
  { id: 2, categoryKey: "Company", audience: "all", day: "20", month: { en: "AUG", ar: "أغسطس" }, weekday: { en: "Thursday", ar: "الخميس" }, time: "10:00 AM",
    title: { en: "All-hands town hall", ar: "اللقاء العام لكل الموظفين" }, location: { en: "Main Auditorium", ar: "القاعة الرئيسية" } },
  { id: 3, categoryKey: "Social", audience: "all", day: "22", month: { en: "AUG", ar: "أغسطس" }, weekday: { en: "Saturday", ar: "السبت" }, time: "5:30 PM",
    title: { en: "5-a-side: Engineering vs Retail", ar: "دوري خماسي: الهندسة ضد التجزئة" }, location: { en: "Rooftop Pitch", ar: "ملعب السطح" } },
  { id: 4, categoryKey: "Product", audience: "tech", day: "26", month: { en: "AUG", ar: "أغسطس" }, weekday: { en: "Wednesday", ar: "الأربعاء" }, time: "3:00 PM",
    title: { en: "Tech sprint demo day", ar: "يوم عرض السبرنت التقني" }, location: { en: "Studio B", ar: "الاستوديو ب" } },
  { id: 5, categoryKey: "Product", audience: "marketing", day: "28", month: { en: "AUG", ar: "أغسطس" }, weekday: { en: "Friday", ar: "الجمعة" }, time: "2:00 PM",
    title: { en: "Season 24 kit design review", ar: "مراجعة تصميم أطقم الموسم 24" }, location: { en: "Studio B", ar: "الاستوديو ب" } },
  { id: 6, categoryKey: "Wellness", audience: "all", day: "03", month: { en: "SEP", ar: "سبتمبر" }, weekday: { en: "Wednesday", ar: "الأربعاء" }, time: "12:30 PM",
    title: { en: "Wellness Wednesday: recovery & stretch", ar: "أربعاء العافية: الاستشفاء والإطالة" }, location: { en: "Studio A", ar: "الاستوديو أ" } },
];

const FAQ_CATEGORY_LABELS = {
  Onboarding: { en: "Onboarding", ar: "التهيئة" },
  Benefits: { en: "Benefits", ar: "المزايا" },
  "IT & Access": { en: "IT & Access", ar: "تقنية المعلومات والوصول" },
  Facilities: { en: "Facilities", ar: "المرافق" },
};

const FAQS = [
  { id: 1, categoryKey: "Onboarding", q: { en: "Where do I pick up my employee ID card?", ar: "من أين أستلم بطاقة هويتي الوظيفية؟" }, a: { en: "Facilities desk on the ground floor, Monday to Friday, 9 AM–5 PM. Bring your offer letter for the first visit.", ar: "من مكتب المرافق في الطابق الأرضي، من الاثنين إلى الجمعة، 9 صباحًا حتى 5 مساءً. أحضر خطاب العرض في أول زيارة." } },
  { id: 2, categoryKey: "Onboarding", q: { en: "How do I set up my company email on my phone?", ar: "كيف أُعِدّ بريدي الإلكتروني الخاص بالشركة على هاتفي؟" }, a: { en: "Install the Outlook app, sign in with your @kodesports.com address, and approve the two-factor prompt sent by IT.", ar: "ثبّت تطبيق Outlook، وسجّل الدخول ببريدك @kodesports.com، ووافق على رسالة التحقق الثنائي التي يرسلها فريق تقنية المعلومات." } },
  { id: 3, categoryKey: "Benefits", q: { en: "When does open enrollment start?", ar: "متى يبدأ التسجيل المفتوح في المزايا؟" }, a: { en: "September 1, and the window stays open through September 15. You will get a reminder email one week before it closes.", ar: "يبدأ في 1 سبتمبر ويستمر حتى 15 سبتمبر. ستصلك رسالة تذكير قبل أسبوع من إغلاقه." } },
  { id: 4, categoryKey: "Benefits", q: { en: "How do I book the on-site physio?", ar: "كيف أحجز جلسة العلاج الطبيعي في الموقع؟" }, a: { en: "Use the Wellness tile on this portal, or message the Wellness Team directly to grab a Wednesday slot.", ar: "استخدم بطاقة العافية في هذه البوابة، أو راسل فريق العافية مباشرة لحجز موعد يوم الأربعاء." } },
  { id: 5, categoryKey: "IT & Access", q: { en: "I'm locked out of the VPN, who do I contact?", ar: "تم قفل دخولي إلى الشبكة الافتراضية (VPN)، بمن أتصل؟" }, a: { en: "Open a ticket with IT Support or message #it-helpdesk. Include your employee ID for a faster reset.", ar: "افتح تذكرة مع دعم تقنية المعلومات أو راسل #it-helpdesk. أرفق رقمك الوظيفي لإعادة تعيين أسرع." } },
  { id: 6, categoryKey: "IT & Access", q: { en: "How do I request new gear or software?", ar: "كيف أطلب معدات أو برامج جديدة؟" }, a: { en: "Submit a request through the IT portal. Standard requests are approved within two business days.", ar: "أرسل طلبًا عبر بوابة تقنية المعلومات. تتم الموافقة على الطلبات العادية خلال يومي عمل." } },
  { id: 7, categoryKey: "Facilities", q: { en: "What are the locker room hours?", ar: "ما هي مواعيد عمل غرف تبديل الملابس؟" }, a: { en: "Open daily from 6 AM to 10 PM, except during scheduled maintenance announced in the News feed.", ar: "مفتوحة يوميًا من 6 صباحًا حتى 10 مساءً، باستثناء أوقات الصيانة المعلن عنها في قسم الأخبار." } },
  { id: 8, categoryKey: "Facilities", q: { en: "Can I book the rooftop pitch for personal use?", ar: "هل يمكنني حجز ملعب السطح للاستخدام الشخصي؟" }, a: { en: "Yes, employees get two free bookings a month through the Events tab. Extra slots are subject to availability.", ar: "نعم، يحصل الموظفون على حجزين مجانيين شهريًا عبر تبويب الفعاليات. الحجوزات الإضافية حسب التوفر." } },
];

/* ===========================================================
   UI STRINGS
=========================================================== */
const T = {
  en: {
    portalTitle: "EMPLOYEE PORTAL", navHome: "Home", navNews: "News", navEvents: "Events",
    navDepartment: "Department", navFaqs: "FAQs", navAwards: "My Awards", navManagePoints: "Manage Points",
    signOut: "Sign out", theme: "Theme", chooseTheme: "Choose your theme",
    themeHint: "Match Point (blue/purple) is the company default. Pick your own — it only changes your view.",
    heroLine: "Here's what's in play today across {dept}.", statAnnouncements: "{n} new announcements",
    statEvents: "{n} events this month", statTownHall: "Town hall in 5 days", latestNews: "Latest news",
    viewAll: "View all", comingUp: "Coming up", quickAnswers: "Quick answers", openFaqs: "Open FAQs",
    teamNewsTitle: "TEAM NEWS", eventsTitle: "EVENTS", rsvp: "RSVP", goingIn: "You're in",
    faqsTitle: "FAQS", searchFaqs: "Search FAQs...", noMatches: "No matches. Try a different search or category.",
    allFilter: "All", deptSubtitle: "Your team structure, reporting line, and department-specific updates.",
    teamHierarchy: "Team hierarchy", you: "(You)", noDeptNews: "No department-specific news right now.",
    noDeptEvents: "No department-specific events scheduled.", updatesAndQuestions: "Department updates & questions",
    commentsHint: "Ask about anything related to your department. Only your team can see this.",
    commentPlaceholder: "Write a question or update...", postComment: "Post",
    noCommentsYet: "No comments yet. Start the conversation.", myAwardsTitle: "MY AWARDS",
    timesAwarded: "Times awarded", yourDepartment: "Your department", yourRole: "Your role",
    noAwardsYet: "No awards yet. Employee of the Month is chosen every month per department — keep showing up.",
    managePointsTitle: "MANAGE POINTS",
    managePointsSubtitle: "Visible to Managers and Supervisors only. Choose this month's {dept} Employee of the Month.",
    currentlyAwardedTo: "Currently awarded to", updateNote: "Submitting below will update it.",
    employeeLabel: "Employee", reasonLabel: "Reason", reasonPlaceholder: "What made this month stand out?",
    recordAward: "Record award", updateAward: "Update award", awardRecorded: "Award recorded.",
    awardUpdated: "Award updated.", awardHistory: "Award history", noAwardsRecorded: "No awards recorded yet.",
    certOfRecognition: "CERTIFICATE OF RECOGNITION", employeeOfMonth: "Employee of the Month", awardedBy: "Awarded by",
    signInTab: "Sign in", signUpTab: "Sign up",
    quickSignInHint: "Real login needs a backend, so here's a quick way to preview the portal as each role (Tech department):",
    fullNameLabel: "Full name", emailLabel: "Email", departmentLabel: "Department", createAccount: "Create account",
    signupHint: "You'll be assigned to your department automatically. Role starts as Employee — HR can promote you later.",
    namePlaceholder: "Jane Employee", emailPlaceholder: "jane@kodesports.com",
    greetMorning: "Good morning", greetAfternoon: "Good afternoon", greetEvening: "Good evening",
    feedCaughtUp: "You're all caught up — nothing left in the stack for now.",
    feedRestart: "Start over", feedNews: "NEWS", feedEvent: "EVENT",
    feedHint: "Swipe left to skip · swipe right to open", feedClose: "Back to feed",
    feedSkipLabel: "Skip", feedOpenLabel: "Open", feedOverview: "Full overview, always available below.",
  },
  ar: {
    portalTitle: "بوابة الموظفين", navHome: "الرئيسية", navNews: "الأخبار", navEvents: "الفعاليات",
    navDepartment: "القسم", navFaqs: "الأسئلة الشائعة", navAwards: "جوائزي", navManagePoints: "إدارة النقاط",
    signOut: "تسجيل الخروج", theme: "المظهر", chooseTheme: "اختر مظهرك",
    themeHint: "الأزرق والبنفسجي هو مظهر الشركة الافتراضي. اختر مظهرك الخاص — سيغيّر عرضك أنت فقط.",
    heroLine: "إليك آخر المستجدات اليوم في {dept}.", statAnnouncements: "{n} إعلانات جديدة",
    statEvents: "{n} فعاليات هذا الشهر", statTownHall: "اللقاء العام خلال 5 أيام", latestNews: "آخر الأخبار",
    viewAll: "عرض الكل", comingUp: "قريبًا", quickAnswers: "إجابات سريعة", openFaqs: "فتح الأسئلة الشائعة",
    teamNewsTitle: "أخبار الفريق", eventsTitle: "الفعاليات", rsvp: "تأكيد الحضور", goingIn: "أنت مسجل",
    faqsTitle: "الأسئلة الشائعة", searchFaqs: "ابحث في الأسئلة...", noMatches: "لا توجد نتائج. جرّب بحثًا أو تصنيفًا مختلفًا.",
    allFilter: "الكل", deptSubtitle: "هيكل فريقك، وتسلسل التقارير، وآخر مستجدات قسمك.",
    teamHierarchy: "الهيكل الإداري للفريق", you: "(أنت)", noDeptNews: "لا توجد أخبار خاصة بالقسم حاليًا.",
    noDeptEvents: "لا توجد فعاليات خاصة بالقسم حاليًا.", updatesAndQuestions: "مستجدات القسم والأسئلة",
    commentsHint: "اسأل عن أي شيء يخص قسمك. فريقك فقط من يرى هذا.",
    commentPlaceholder: "اكتب سؤالاً أو تحديثًا...", postComment: "نشر",
    noCommentsYet: "لا توجد تعليقات بعد. ابدأ النقاش.", myAwardsTitle: "جوائزي",
    timesAwarded: "عدد مرات الفوز", yourDepartment: "قسمك", yourRole: "دورك",
    noAwardsYet: "لا توجد جوائز بعد. يتم اختيار موظف الشهر كل شهر لكل قسم — واصل التميّز.",
    managePointsTitle: "إدارة النقاط",
    managePointsSubtitle: "مرئي للمديرين والمشرفين فقط. اختر موظف الشهر لقسم {dept} هذا الشهر.",
    currentlyAwardedTo: "الجائزة الحالية لـ", updateNote: "سيؤدي الإرسال أدناه إلى تحديثها.",
    employeeLabel: "الموظف", reasonLabel: "السبب", reasonPlaceholder: "ما الذي ميّز هذا الشهر؟",
    recordAward: "تسجيل الجائزة", updateAward: "تحديث الجائزة", awardRecorded: "تم تسجيل الجائزة.",
    awardUpdated: "تم تحديث الجائزة.", awardHistory: "سجل الجوائز", noAwardsRecorded: "لا توجد جوائز مسجلة بعد.",
    certOfRecognition: "شهادة تقدير", employeeOfMonth: "موظف الشهر", awardedBy: "مُنحت بواسطة",
    signInTab: "تسجيل الدخول", signUpTab: "إنشاء حساب",
    quickSignInHint: "يحتاج تسجيل الدخول الفعلي إلى خادم خلفي، لذا إليك طريقة سريعة لتجربة البوابة بكل دور (قسم التقنية):",
    fullNameLabel: "الاسم الكامل", emailLabel: "البريد الإلكتروني", departmentLabel: "القسم", createAccount: "إنشاء الحساب",
    signupHint: "سيتم تعيينك لقسمك تلقائيًا. يبدأ دورك كموظف — يمكن لفريق الموارد البشرية ترقيتك لاحقًا.",
    namePlaceholder: "اسم الموظف", emailPlaceholder: "jane@kodesports.com",
    greetMorning: "صباح الخير", greetAfternoon: "نهارك سعيد", greetEvening: "مساء الخير",
    feedCaughtUp: "لقد اطّلعت على كل شيء — لا يوجد المزيد حاليًا.",
    feedRestart: "ابدأ من جديد", feedNews: "خبر", feedEvent: "فعالية",
    feedHint: "اسحب لليسار للتخطي · اسحب لليمين للفتح", feedClose: "العودة إلى القائمة",
    feedSkipLabel: "تخطي", feedOpenLabel: "فتح", feedOverview: "نظرة عامة كاملة متاحة دائمًا أدناه.",
  },
};

function getGreeting(lang) {
  const h = new Date().getHours();
  const s = T[lang];
  if (h < 12) return s.greetMorning;
  if (h < 18) return s.greetAfternoon;
  return s.greetEvening;
}
function heroDateLabel(lang) {
  const d = new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { weekday: "long", month: "long", day: "numeric" });
  return lang === "ar" ? d : d.toUpperCase();
}
function displayFont(lang) {
  return lang === "ar" ? "'Cairo', sans-serif" : "'Anton', sans-serif";
}

/* Each theme gets its own decorative texture, not just recolored accents:
   Match Point = diagonal speed stripes, Home Turf = pitch lines,
   Away Day = chevrons, Night Shift = scan-line grid, Day Game = sunburst. */
function themePattern(themeKey, t) {
  switch (themeKey) {
    case "hometurf":
      return `repeating-linear-gradient(0deg, ${t.accent1}26 0px, ${t.accent1}26 2px, transparent 2px, transparent 26px)`;
    case "awayday":
      return `repeating-linear-gradient(45deg, ${t.accent1}1f 0px, ${t.accent1}1f 9px, transparent 9px, transparent 20px), repeating-linear-gradient(-45deg, ${t.accent2}1f 0px, ${t.accent2}1f 9px, transparent 9px, transparent 20px)`;
    case "nightshift":
      return `repeating-linear-gradient(0deg, ${t.accent1}1a 0px, ${t.accent1}1a 1px, transparent 1px, transparent 7px), repeating-linear-gradient(90deg, ${t.accent2}12 0px, ${t.accent2}12 1px, transparent 1px, transparent 42px)`;
    case "daygame":
      return `conic-gradient(from 200deg at 100% 0%, ${t.accent1}29, transparent 25deg, transparent 335deg, ${t.accent2}29)`;
    case "matchpoint":
    default:
      return `repeating-linear-gradient(115deg, ${t.accent1}24 0px, ${t.accent1}24 14px, transparent 14px, transparent 34px)`;
  }
}

/* ===========================================================
   SMALL COMPONENTS
=========================================================== */
function KMark({ t, size = 40 }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0, background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "'Anton', sans-serif", color: "#fff", fontSize: size * 0.48, lineHeight: 1 }}>K</span>
    </div>
  );
}
function Divider({ t, width = 64 }) {
  return <div style={{ height: 4, width, borderRadius: 2, marginTop: 8, marginBottom: 16, background: `linear-gradient(90deg, ${t.accent1}, ${t.accent2})`, transform: "skewX(-12deg)" }} />;
}
function Chip({ label, active, onClick, t }) {
  return (
    <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1px solid ${active ? "transparent" : t.border}`, background: active ? `linear-gradient(90deg, ${t.accent1}, ${t.accent2})` : "transparent", color: active ? "#fff" : t.textMuted }}>
      {label}
    </button>
  );
}
function LanguageToggle({ lang, setLang, t }) {
  return (
    <div style={{ display: "flex", border: `1px solid ${t.border}`, borderRadius: 999, overflow: "hidden" }}>
      <button onClick={() => setLang("en")} style={{ padding: "5px 12px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", background: lang === "en" ? t.surface2 : "transparent", color: lang === "en" ? t.text : t.textMuted }}>EN</button>
      <button onClick={() => setLang("ar")} style={{ padding: "5px 12px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", background: lang === "ar" ? t.surface2 : "transparent", color: lang === "ar" ? t.text : t.textMuted }}>AR</button>
    </div>
  );
}
function RoleBadge({ role, t, lang }) {
  const colors = { Manager: t.accent2, Supervisor: t.accent1, "Team Lead": t.success, Employee: t.textMuted };
  const label = ROLE_LABELS[role][lang];
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, padding: "2px 8px", borderRadius: 999, color: "#fff", background: colors[role] }}>{lang === "en" ? label.toUpperCase() : label}</span>;
}
function Connector({ t }) {
  return <div style={{ width: 2, height: 22, background: t.border }} />;
}
function PersonCard({ person, t, lang, currentUser, compact, honoree }) {
  const isYou = person.id === currentUser.id;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: compact ? "12px 14px" : "16px 22px", borderRadius: 14, background: isYou ? t.surface2 : "transparent", border: `1px solid ${isYou ? t.accent1 : t.border}`, minWidth: compact ? 110 : 160, position: "relative" }}>
      {honoree && (
        <div style={{ position: "absolute", top: -10, background: t.warning, color: "#1a1a1a", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
          ★ {T[lang].employeeOfMonth}
        </div>
      )}
      <div style={{ width: compact ? 38 : 46, height: compact ? 38 : 46, borderRadius: 999, background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: compact ? 13 : 15, fontWeight: 700 }}>
        {person.initials}
      </div>
      <p style={{ margin: 0, fontSize: compact ? 12 : 14, fontWeight: 700, color: t.text, textAlign: "center" }}>
        {person.name[lang]} {isYou && T[lang].you}
      </p>
      <RoleBadge role={person.role} t={t} lang={lang} />
    </div>
  );
}
function CertificateCard({ award, t, lang, directory, themeKey }) {
  const s = T[lang];
  const person = directory.find((p) => p.id === award.employeeId);
  const awardedBy = directory.find((p) => p.id === award.awardedById);
  return (
    <div style={{ position: "relative", overflow: "hidden", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: "30px 26px" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: themePattern(themeKey, t), opacity: 0.5 }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${t.accent1}, ${t.accent2})` }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <KMark t={t} size={40} />
      </div>
      <p style={{ textAlign: "center", margin: 0, fontSize: 11, letterSpacing: 2, color: t.textMuted }}>{s.certOfRecognition}</p>
      <h3 style={{ textAlign: "center", fontFamily: displayFont(lang), fontSize: 22, margin: "8px 0 2px", color: t.text }}>{person ? person.name[lang] : ""}</h3>
      <p style={{ textAlign: "center", margin: 0, fontSize: 13, color: t.textMuted }}>{s.employeeOfMonth} — {deptName(award.departmentId, lang)} · {monthLabelFromKey(award.monthKey, lang)}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, margin: "18px 0", flexWrap: "wrap" }}>
        {Object.entries(award.scores).map(([k, v]) => (
          <div key={k} style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: t.accent1 }}>{v}/5</p>
            <p style={{ margin: 0, fontSize: 10, color: t.textMuted }}>{CRITERIA_LABELS[k][lang]}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: t.textMuted, fontStyle: "italic", textAlign: "center", lineHeight: 1.5, margin: "0 0 14px" }}>&quot;{award.reason}&quot;</p>
      <p style={{ textAlign: "center", margin: 0, fontSize: 11, color: t.textMuted }}>{s.awardedBy} {awardedBy ? awardedBy.name[lang] : ""}</p>
    </div>
  );
}
function ScoreSelector({ label, value, onChange, t }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: t.accent1 }}>{value}/5</span>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, border: n <= value ? "none" : `1px solid ${t.border}`, background: n <= value ? `linear-gradient(90deg, ${t.accent1}, ${t.accent2})` : "transparent", color: n <= value ? "#fff" : t.textMuted }}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===========================================================
   SWIPE DECK — Tinder-style card stack for the home feed.
   Swipe left = skip (item stays fully visible in News/Events/
   Department tabs). Swipe right (or tap Open) = view details.
=========================================================== */
function buildFeed(currentUser) {
  const relevantNews = NEWS.filter((n) => n.audience === "all" || n.audience === currentUser.departmentId);
  const relevantEvents = EVENTS.filter((e) => e.audience === "all" || e.audience === currentUser.departmentId);
  const unreadNews = relevantNews.filter((n) => n.unread).map((n) => ({ feedId: `news-${n.id}`, kind: "news", data: n }));
  const readNews = relevantNews.filter((n) => !n.unread).map((n) => ({ feedId: `news-${n.id}`, kind: "news", data: n }));
  const eventItems = relevantEvents.map((e) => ({ feedId: `event-${e.id}`, kind: "event", data: e }));
  return [...unreadNews, ...eventItems, ...readNews];
}

function FeedDetail({ item, t, lang, onClose }) {
  const s = T[lang];
  const isNews = item.kind === "news";
  const d = item.data;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
      <div style={{ position: "relative", width: 440, maxWidth: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, padding: 28, maxHeight: "85vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, insetInlineEnd: 16, background: "none", border: "none", cursor: "pointer" }}>
          <X size={18} color={t.textMuted} />
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: t.accent1 }}>
          {isNews ? s.feedNews : s.feedEvent} · {CATEGORY_LABELS[d.categoryKey][lang]}
        </span>
        <h3 style={{ margin: "10px 0 6px", fontSize: 20, color: t.text, fontFamily: displayFont(lang) }}>{d.title[lang]}</h3>
        {isNews ? (
          <>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: t.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{d.date[lang]} · {d.author[lang]}</p>
            <p style={{ margin: 0, fontSize: 14, color: t.textMuted, lineHeight: 1.6 }}>{d.excerpt[lang]}</p>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10, fontSize: 14, color: t.textMuted }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} /> {d.weekday[lang]}, {d.time} · {d.day} {d.month[lang]}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> {d.location[lang]}</span>
          </div>
        )}
        <button onClick={onClose} style={{ marginTop: 20, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#fff", background: `linear-gradient(90deg, ${t.accent1}, ${t.accent2})` }}>
          {s.feedClose}
        </button>
      </div>
    </div>
  );
}

function SwipeDeck({ t, lang, themeKey, currentUser }) {
  const s = T[lang];
  const isRtl = lang === "ar";
  const feed = buildFeed(currentUser);
  const [index, setIndex] = useState(0);
  const [openedItem, setOpenedItem] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);

  const current = feed[index];
  const behind = feed[index + 1];
  const pattern = themePattern(themeKey, t);

  function skipCurrent() { setDragX(0); setDragging(false); setIndex((i) => i + 1); }
  function openCurrent() { setDragX(0); setDragging(false); setOpenedItem(current); setIndex((i) => i + 1); }

  function handlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    startXRef.current = e.clientX;
  }
  function handlePointerMove(e) {
    if (!dragging) return;
    setDragX(e.clientX - startXRef.current);
  }
  function handlePointerUp() {
    if (!dragging) return;
    if (dragX > 90) openCurrent();
    else if (dragX < -90) skipCurrent();
    else { setDragX(0); setDragging(false); }
  }

  const cardOf = (item) => {
    const isNews = item.kind === "news";
    const d = item.data;
    return (
      <>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#fff", background: isNews ? t.accent1 : t.accent2, padding: "3px 10px", borderRadius: 999 }}>
          {isNews ? s.feedNews : s.feedEvent}
        </span>
        <h3 style={{ margin: "16px 0 6px", fontSize: 24, lineHeight: 1.25, color: t.text, fontFamily: displayFont(lang) }}>{d.title[lang]}</h3>
        <p style={{ margin: 0, fontSize: 13, color: t.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          {isNews ? d.date[lang] : `${d.day} ${d.month[lang]} · ${d.time}`}
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: t.textMuted }}>{CATEGORY_LABELS[d.categoryKey][lang]}</p>
      </>
    );
  };

  if (!current) {
    return (
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, padding: "48px 32px", textAlign: "center", background: t.surface, border: `1px solid ${t.border}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: pattern, opacity: 0.5 }} />
        <div style={{ position: "relative" }}>
          <p style={{ margin: "0 0 18px", fontSize: 15, color: t.textMuted }}>{s.feedCaughtUp}</p>
          <button onClick={() => setIndex(0)} style={{ padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#fff", background: `linear-gradient(90deg, ${t.accent1}, ${t.accent2})` }}>{s.feedRestart}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, padding: 24, background: t.surface, border: `1px solid ${t.border}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: pattern, opacity: 0.6 }} />
        <div style={{ position: "relative", height: 210 }}>
          {behind && (
            <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: t.surface2, border: `1px solid ${t.border}`, padding: 24, transform: "translateY(10px) scale(0.96)", opacity: 0.6 }} />
          )}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              position: "absolute", inset: 0, borderRadius: 16, background: t.surface2, border: `1px solid ${t.border}`, padding: 24,
              cursor: dragging ? "grabbing" : "grab", touchAction: "pan-y", userSelect: "none",
              transform: `translateX(${dragX}px) rotate(${dragX / 18}deg)`,
              transition: dragging ? "none" : "transform .25s ease",
            }}
          >
            {cardOf(current)}
            <span style={{ position: "absolute", top: 20, insetInlineStart: 20, fontSize: 13, fontWeight: 800, letterSpacing: 1, color: t.warning, opacity: dragX < 0 ? Math.min(-dragX / 90, 1) : 0, transform: "rotate(-8deg)" }}>{s.feedSkipLabel.toUpperCase()}</span>
            <span style={{ position: "absolute", top: 20, insetInlineEnd: 20, fontSize: 13, fontWeight: 800, letterSpacing: 1, color: t.success, opacity: dragX > 0 ? Math.min(dragX / 90, 1) : 0, transform: "rotate(8deg)" }}>{s.feedOpenLabel.toUpperCase()}</span>
          </div>
        </div>
        <p style={{ position: "relative", textAlign: "center", margin: "14px 0 0", fontSize: 11, color: t.textMuted }}>{s.feedHint}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
        <button onClick={skipCurrent} aria-label={s.feedSkipLabel} style={{ width: 44, height: 44, borderRadius: 999, border: `1px solid ${t.border}`, background: t.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={18} color={t.warning} />
        </button>
        <button onClick={openCurrent} aria-label={s.feedOpenLabel} style={{ width: 44, height: 44, borderRadius: 999, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})` }}>
          <Check size={18} color="#fff" />
        </button>
      </div>
      {openedItem && <FeedDetail item={openedItem} t={t} lang={lang} onClose={() => setOpenedItem(null)} />}
    </div>
  );
}

/* ===========================================================
   VIEWS
=========================================================== */
function HomeView({ t, lang, currentUser, unreadCount, goTo, themeKey }) {
  const s = T[lang];
  const dName = deptName(currentUser.departmentId, lang);

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 1, color: t.accent1, marginBottom: 4 }}>{heroDateLabel(lang)}</p>
        <h1 style={{ fontFamily: displayFont(lang), fontSize: 28, lineHeight: 1.2, letterSpacing: 0.5, margin: 0, color: t.text }}>
          {getGreeting(lang)}, {currentUser.name[lang]}.
        </h1>
        <p style={{ marginTop: 6, fontSize: 14, color: t.textMuted }}>{s.heroLine.replace("{dept}", dName)}</p>
      </div>

      <SwipeDeck t={t} lang={lang} themeKey={themeKey} currentUser={currentUser} />

      <div style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
        <span style={{ padding: "8px 14px", borderRadius: 10, background: t.surface2, color: t.text }}>{s.statAnnouncements.replace("{n}", unreadCount)}</span>
        <span style={{ padding: "8px 14px", borderRadius: 10, background: t.surface2, color: t.text }}>{s.statEvents.replace("{n}", EVENTS.length)}</span>
        <span style={{ padding: "8px 14px", borderRadius: 10, background: t.surface2, color: t.text }}>{s.statTownHall}</span>
      </div>

      <p style={{ margin: "18px 0 0", fontSize: 12, color: t.textMuted }}>{s.feedOverview}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginTop: 12 }}>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>{s.latestNews}</h3>
            <button onClick={() => goTo("news")} style={{ background: "none", border: "none", color: t.accent1, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{s.viewAll}</button>
          </div>
          <Divider t={t} width={40} />
          {NEWS.slice(0, 3).map((n) => (
            <div key={n.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderTop: `1px solid ${t.border}` }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, marginTop: 6, flexShrink: 0, background: n.unread ? t.accent1 : t.border }} />
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: t.text }}>{n.title[lang]}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: t.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{n.date[lang]} · {CATEGORY_LABELS[n.categoryKey][lang]}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>{s.comingUp}</h3>
            <button onClick={() => goTo("events")} style={{ background: "none", border: "none", color: t.accent1, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{s.viewAll}</button>
          </div>
          <Divider t={t} width={40} />
          {EVENTS.slice(0, 2).map((e) => (
            <div key={e.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderTop: `1px solid ${t.border}` }}>
              <div style={{ textAlign: "center", width: 42, flexShrink: 0 }}>
                <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: t.accent2 }}>{e.day}</p>
                <p style={{ margin: 0, fontSize: 10, color: t.textMuted, letterSpacing: 1 }}>{e.month[lang]}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: t.text }}>{e.title[lang]}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: t.textMuted }}>{e.time} · {e.location[lang]}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>{s.quickAnswers}</h3>
            <button onClick={() => goTo("faqs")} style={{ background: "none", border: "none", color: t.accent1, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{s.openFaqs}</button>
          </div>
          <Divider t={t} width={40} />
          {FAQS.slice(0, 3).map((f) => (
            <p key={f.id} style={{ fontSize: 13, color: t.textMuted, padding: "8px 0", borderTop: `1px solid ${t.border}`, margin: 0 }}>{f.q[lang]}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsView({ t, lang, currentUser }) {
  const s = T[lang];
  const categoryKeys = [...new Set(NEWS.map((n) => n.categoryKey))];
  const [filter, setFilter] = useState("All");
  const visible = NEWS.filter((n) => n.audience === "all" || n.audience === currentUser.departmentId);
  const filtered = filter === "All" ? visible : visible.filter((n) => n.categoryKey === filter);

  return (
    <div>
      <h2 style={{ fontFamily: displayFont(lang), fontSize: 28, color: t.text, margin: 0 }}>{s.teamNewsTitle}</h2>
      <Divider t={t} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        <Chip label={s.allFilter} active={filter === "All"} onClick={() => setFilter("All")} t={t} />
        {categoryKeys.map((c) => <Chip key={c} label={CATEGORY_LABELS[c][lang]} active={filter === c} onClick={() => setFilter(c)} t={t} />)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map((n) => (
          <div key={n.id} style={{ display: "flex", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ width: 5, background: `linear-gradient(180deg, ${t.accent1}, ${t.accent2})` }} />
            <div style={{ padding: "18px 20px", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: t.accent1 }}>{lang === "en" ? CATEGORY_LABELS[n.categoryKey][lang].toUpperCase() : CATEGORY_LABELS[n.categoryKey][lang]}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: t.textMuted }}>{n.date[lang]}</span>
              </div>
              <h3 style={{ margin: "6px 0 4px", fontSize: 17, color: t.text }}>{n.title[lang]}</h3>
              <p style={{ margin: 0, fontSize: 14, color: t.textMuted, lineHeight: 1.5 }}>{n.excerpt[lang]}</p>
              <p style={{ margin: "10px 0 0", fontSize: 12, color: t.textMuted }}>— {n.author[lang]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsView({ t, lang, currentUser }) {
  const s = T[lang];
  const [rsvped, setRsvped] = useState(new Set());
  const toggle = (id) => setRsvped((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const visible = EVENTS.filter((e) => e.audience === "all" || e.audience === currentUser.departmentId);

  return (
    <div>
      <h2 style={{ fontFamily: displayFont(lang), fontSize: 28, color: t.text, margin: 0 }}>{s.eventsTitle}</h2>
      <Divider t={t} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {visible.map((e) => {
          const going = rsvped.has(e.id);
          return (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 18, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 18, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", width: 56, flexShrink: 0, padding: "8px 0", borderRadius: 10, background: t.surface2 }}>
                <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: t.accent2 }}>{e.day}</p>
                <p style={{ margin: 0, fontSize: 11, color: t.textMuted, letterSpacing: 1 }}>{e.month[lang]}</p>
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: t.accent1 }}>{lang === "en" ? CATEGORY_LABELS[e.categoryKey][lang].toUpperCase() : CATEGORY_LABELS[e.categoryKey][lang]}</p>
                <h3 style={{ margin: "2px 0 6px", fontSize: 16, color: t.text }}>{e.title[lang]}</h3>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13, color: t.textMuted }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {e.weekday[lang]}, {e.time}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={14} /> {e.location[lang]}</span>
                </div>
              </div>
              <button onClick={() => toggle(e.id)} style={{ padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0, border: going ? `1px solid ${t.success}` : "none", background: going ? "transparent" : `linear-gradient(90deg, ${t.accent1}, ${t.accent2})`, color: going ? t.success : "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                {going && <Check size={14} />}
                {going ? s.goingIn : s.rsvp}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FAQsView({ t, lang }) {
  const s = T[lang];
  const categoryKeys = [...new Set(FAQS.map((f) => f.categoryKey))];
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const filtered = FAQS.filter((f) => (category === "All" || f.categoryKey === category) && f.q[lang].toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 style={{ fontFamily: displayFont(lang), fontSize: 28, color: t.text, margin: 0 }}>{s.faqsTitle}</h2>
      <Divider t={t} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px", marginBottom: 18 }}>
        <Search size={16} color={t.textMuted} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={s.searchFaqs} style={{ background: "none", border: "none", outline: "none", color: t.text, fontSize: 14, width: "100%" }} />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        <Chip label={s.allFilter} active={category === "All"} onClick={() => setCategory("All")} t={t} />
        {categoryKeys.map((c) => <Chip key={c} label={FAQ_CATEGORY_LABELS[c][lang]} active={category === c} onClick={() => setCategory(c)} t={t} />)}
      </div>
      {filtered.length === 0 && <p style={{ color: t.textMuted, fontSize: 14 }}>{s.noMatches}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((f) => {
          const open = openId === f.id;
          return (
            <div key={f.id} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => setOpenId(open ? null : f.id)} style={{ width: "100%", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: lang === "ar" ? "right" : "left" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{f.q[lang]}</span>
                <ChevronDown size={16} color={t.textMuted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease", flexShrink: 0, marginInlineStart: 12 }} />
              </button>
              {open && <p style={{ margin: 0, padding: "0 18px 16px", fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>{f.a[lang]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DepartmentView({ t, lang, currentUser, directory, awards, currentMonthKey, comments, setComments }) {
  const s = T[lang];
  const deptId = currentUser.departmentId;
  const dName = deptName(deptId, lang);
  const manager = directory.find((p) => p.departmentId === deptId && p.role === "Manager");
  const supervisor = directory.find((p) => p.departmentId === deptId && p.role === "Supervisor");
  const teamLead = directory.find((p) => p.departmentId === deptId && p.role === "Team Lead");
  const employees = directory.filter((p) => p.departmentId === deptId && p.role === "Employee");
  const currentAward = awards.find((a) => a.departmentId === deptId && a.monthKey === currentMonthKey);
  const honoreeId = currentAward ? currentAward.employeeId : null;

  const deptNews = NEWS.filter((n) => n.audience === "all" || n.audience === deptId).slice(0, 3);
  const deptEvents = EVENTS.filter((e) => e.audience === "all" || e.audience === deptId).slice(0, 2);

  const heading = lang === "ar" ? `قسم ${dName}` : `${dName.toUpperCase()} DEPARTMENT`;
  const newsHeading = lang === "ar" ? `أخبار ${dName}` : `${dName} news`;
  const eventsHeading = lang === "ar" ? `فعاليات ${dName}` : `${dName} events`;

  const deptComments = comments[deptId] || [];
  const [draft, setDraft] = useState("");
  const post = () => {
    if (!draft.trim()) return;
    setComments((prev) => ({ ...prev, [deptId]: [...(prev[deptId] || []), { id: `c-${Date.now()}`, authorId: currentUser.id, text: draft.trim(), ts: Date.now() }] }));
    setDraft("");
  };

  return (
    <div>
      <h2 style={{ fontFamily: displayFont(lang), fontSize: 28, color: t.text, margin: 0 }}>{heading}</h2>
      <Divider t={t} />
      <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 24 }}>{s.deptSubtitle}</p>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: t.text }}>{s.teamHierarchy}</h3>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {manager && <PersonCard person={manager} t={t} lang={lang} currentUser={currentUser} honoree={manager.id === honoreeId} />}
          {supervisor && (<><Connector t={t} /><PersonCard person={supervisor} t={t} lang={lang} currentUser={currentUser} honoree={supervisor.id === honoreeId} /></>)}
          {teamLead && (<><Connector t={t} /><PersonCard person={teamLead} t={t} lang={lang} currentUser={currentUser} honoree={teamLead.id === honoreeId} /></>)}
          {employees.length > 0 && <Connector t={t} />}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {employees.map((e) => <PersonCard key={e.id} person={e} t={t} lang={lang} currentUser={currentUser} compact honoree={e.id === honoreeId} />)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>{newsHeading}</h3>
          <Divider t={t} width={40} />
          {deptNews.length === 0 && <p style={{ fontSize: 13, color: t.textMuted }}>{s.noDeptNews}</p>}
          {deptNews.map((n) => (
            <div key={n.id} style={{ padding: "10px 0", borderTop: `1px solid ${t.border}` }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: t.text }}>{n.title[lang]}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: t.textMuted }}>{n.date[lang]}</p>
            </div>
          ))}
        </div>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>{eventsHeading}</h3>
          <Divider t={t} width={40} />
          {deptEvents.length === 0 && <p style={{ fontSize: 13, color: t.textMuted }}>{s.noDeptEvents}</p>}
          {deptEvents.map((e) => (
            <div key={e.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0", borderTop: `1px solid ${t.border}` }}>
              <div style={{ textAlign: "center", width: 36 }}>
                <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: t.accent2 }}>{e.day}</p>
                <p style={{ margin: 0, fontSize: 9, color: t.textMuted }}>{e.month[lang]}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: t.text }}>{e.title[lang]}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: t.textMuted }}>{e.time} · {e.location[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: t.text }}>{s.updatesAndQuestions}</h3>
        <p style={{ margin: "0 0 18px", fontSize: 13, color: t.textMuted }}>{s.commentsHint}</p>

        {deptComments.length === 0 ? (
          <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 18 }}>{s.noCommentsYet}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
            {deptComments.map((c) => {
              const author = directory.find((p) => p.id === c.authorId);
              return (
                <div key={c.id} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 999, flexShrink: 0, background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                    {author ? author.initials : "?"}
                  </div>
                  <div style={{ background: t.surface2, borderRadius: 12, padding: "10px 14px", flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: t.text }}>{author ? author.name[lang] : ""}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: t.text }}>{c.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") post(); }} placeholder={s.commentPlaceholder} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface2, color: t.text, fontSize: 13, outline: "none" }} />
          <button onClick={post} style={{ padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#fff", background: `linear-gradient(90deg, ${t.accent1}, ${t.accent2})` }}>{s.postComment}</button>
        </div>
      </div>
    </div>
  );
}

function MyAwardsView({ t, lang, currentUser, awards, directory, themeKey }) {
  const s = T[lang];
  const mine = awards.filter((a) => a.employeeId === currentUser.id).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  return (
    <div>
      <h2 style={{ fontFamily: displayFont(lang), fontSize: 28, color: t.text, margin: 0 }}>{s.myAwardsTitle}</h2>
      <Divider t={t} />
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: "16px 22px" }}>
          <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 700, color: t.accent1 }}>{mine.length}</p>
          <p style={{ margin: 0, fontSize: 12, color: t.textMuted }}>{s.timesAwarded}</p>
        </div>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: "16px 22px" }}>
          <p style={{ margin: 0, fontSize: 13, color: t.text, fontWeight: 600 }}>{deptName(currentUser.departmentId, lang)}</p>
          <p style={{ margin: 0, fontSize: 12, color: t.textMuted }}>{s.yourDepartment}</p>
        </div>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: "16px 22px" }}>
          <p style={{ margin: 0, fontSize: 13, color: t.text, fontWeight: 600 }}>{ROLE_LABELS[currentUser.role][lang]}</p>
          <p style={{ margin: 0, fontSize: 12, color: t.textMuted }}>{s.yourRole}</p>
        </div>
      </div>
      {mine.length === 0 ? (
        <div style={{ background: t.surface, border: `1px dashed ${t.border}`, borderRadius: 16, padding: 32, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 14, color: t.textMuted }}>{s.noAwardsYet}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {mine.map((a) => <CertificateCard key={a.id} award={a} t={t} lang={lang} directory={directory} themeKey={themeKey} />)}
        </div>
      )}
    </div>
  );
}

function ManagePointsView({ t, lang, currentUser, awards, setAwards, directory, currentMonthKey }) {
  const s = T[lang];
  const myLevel = ROLE_LEVELS.indexOf(currentUser.role);
  const eligible = directory.filter((p) => p.departmentId === currentUser.departmentId && ROLE_LEVELS.indexOf(p.role) > myLevel);
  const existing = awards.find((a) => a.departmentId === currentUser.departmentId && a.monthKey === currentMonthKey);

  const [selectedId, setSelectedId] = useState(existing ? existing.employeeId : (eligible[0] ? eligible[0].id : ""));
  const [scores, setScores] = useState(existing ? existing.scores : AWARD_CRITERIA.reduce((acc, c) => ({ ...acc, [c]: 3 }), {}));
  const [reason, setReason] = useState(existing ? existing.reason : "");
  const [savedMsg, setSavedMsg] = useState("");

  const submit = () => {
    if (!selectedId || !reason.trim()) return;
    const record = { id: existing ? existing.id : `award-${Date.now()}`, employeeId: selectedId, departmentId: currentUser.departmentId, monthKey: currentMonthKey, scores, reason: reason.trim(), awardedById: currentUser.id };
    setAwards((prev) => {
      const withoutThisMonth = prev.filter((a) => !(a.departmentId === currentUser.departmentId && a.monthKey === currentMonthKey));
      return [...withoutThisMonth, record];
    });
    setSavedMsg(existing ? s.awardUpdated : s.awardRecorded);
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const history = awards.filter((a) => a.departmentId === currentUser.departmentId).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  const rawMonthLabel = monthLabelFromKey(currentMonthKey, lang);
  const monthLabelDisplay = lang === "en" ? rawMonthLabel.toUpperCase() : rawMonthLabel;
  const existingPerson = existing ? directory.find((p) => p.id === existing.employeeId) : null;

  if (eligible.length === 0) {
    return (
      <div>
        <h2 style={{ fontFamily: displayFont(lang), fontSize: 28, color: t.text, margin: 0 }}>{s.managePointsTitle}</h2>
        <Divider t={t} />
        <p style={{ fontSize: 14, color: t.textMuted }}>{s.noAwardsRecorded}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: displayFont(lang), fontSize: 28, color: t.text, margin: 0 }}>{s.managePointsTitle}</h2>
      <Divider t={t} />
      <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 24 }}>{s.managePointsSubtitle.replace("{dept}", deptName(currentUser.departmentId, lang))}</p>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: t.accent1 }}>{monthLabelDisplay}</p>
        {existing && existingPerson && (
          <p style={{ margin: "0 0 16px", fontSize: 13, color: t.textMuted }}>
            {s.currentlyAwardedTo} <strong style={{ color: t.text }}>{existingPerson.name[lang]}</strong>. {s.updateNote}
          </p>
        )}

        <label style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{s.employeeLabel}</label>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} style={{ width: "100%", marginTop: 6, marginBottom: 18, padding: "10px 12px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface2, color: t.text, fontSize: 14 }}>
          {eligible.map((p) => <option key={p.id} value={p.id}>{p.name[lang]} — {ROLE_LABELS[p.role][lang]}</option>)}
        </select>

        {AWARD_CRITERIA.map((c) => (
          <ScoreSelector key={c} label={CRITERIA_LABELS[c][lang]} value={scores[c]} onChange={(v) => setScores((sc) => ({ ...sc, [c]: v }))} t={t} />
        ))}

        <label style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{s.reasonLabel}</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder={s.reasonPlaceholder} rows={3} style={{ width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface2, color: t.text, fontSize: 14, resize: "vertical", fontFamily: "inherit" }} />

        <button onClick={submit} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#fff", background: `linear-gradient(90deg, ${t.accent1}, ${t.accent2})` }}>
          {existing ? s.updateAward : s.recordAward}
        </button>
        {savedMsg && <span style={{ marginInlineStart: 12, fontSize: 13, color: t.success }}>{savedMsg}</span>}
      </div>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: t.text }}>{s.awardHistory} — {deptName(currentUser.departmentId, lang)}</h3>
        {history.length === 0 && <p style={{ fontSize: 13, color: t.textMuted }}>{s.noAwardsRecorded}</p>}
        {history.map((a) => {
          const p = directory.find((x) => x.id === a.employeeId);
          return (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 13, color: t.text }}>{p ? p.name[lang] : ""}</span>
              <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{monthLabelFromKey(a.monthKey, lang)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ThemePanel({ t, lang, themeKey, setThemeKey, onClose, isRtl }) {
  const s = T[lang];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: isRtl ? "flex-start" : "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <div style={{ position: "relative", width: 320, maxWidth: "90vw", height: "100%", background: t.surface, borderLeft: isRtl ? "none" : `1px solid ${t.border}`, borderRight: isRtl ? `1px solid ${t.border}` : "none", padding: 24, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>{s.chooseTheme}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={t.textMuted} /></button>
        </div>
        <p style={{ fontSize: 13, color: t.textMuted, marginTop: 4, marginBottom: 20 }}>{s.themeHint}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(THEMES).map(([key, theme]) => {
            const active = key === themeKey;
            return (
              <button key={key} onClick={() => setThemeKey(key)} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 12, cursor: "pointer", textAlign: isRtl ? "right" : "left", background: t.surface2, border: active ? `2px solid ${t.accent1}` : `1px solid ${t.border}` }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})`, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.text }}>{theme.name[lang]}</p>
                  <p style={{ margin: 0, fontSize: 12, color: t.textMuted }}>{theme.sub[lang]}</p>
                </div>
                {active && <Check size={16} color={t.accent1} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ t, lang, setLang, onLogin, directory, setDirectory }) {
  const s = T[lang];
  const isRtl = lang === "ar";
  const [mode, setMode] = useState("quick");
  const [form, setForm] = useState({ name: "", email: "", departmentId: DEPARTMENTS[0].id });
  const demoAccounts = directory.filter((p) => p.departmentId === "tech");

  const handleSignup = () => {
    if (!form.name.trim()) return;
    const dept = DEPARTMENTS.find((d) => d.id === form.departmentId);
    const teamLead = directory.find((p) => p.departmentId === form.departmentId && p.role === "Team Lead");
    const initials = form.name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    const newPerson = { id: `${form.departmentId}-new-${Date.now()}`, name: { en: form.name.trim(), ar: form.name.trim() }, role: "Employee", departmentId: dept.id, initials, reportsTo: teamLead ? teamLead.id : null };
    setDirectory((prev) => [...prev, newPerson]);
    onLogin(newPerson);
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ direction: isRtl ? "rtl" : "ltr", minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: isRtl ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Cairo:wght@400;500;600;700;800&display=swap');`}</style>
      <div style={{ width: 420, maxWidth: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <LanguageToggle lang={lang} setLang={setLang} t={t} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", margin: "14px 0 18px" }}>
          <KMark t={t} size={48} />
        </div>
        <p style={{ textAlign: "center", margin: "0 0 4px", fontSize: 11, letterSpacing: 2, color: t.textMuted }}>{isRtl ? "نادي كود الرياضي" : "KODE SPORTS CLUB"}</p>
        <h1 style={{ textAlign: "center", fontFamily: displayFont(lang), fontSize: 24, margin: "0 0 24px", color: t.text }}>{s.portalTitle}</h1>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button onClick={() => setMode("quick")} style={{ flex: 1, padding: "8px 0", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, border: "none", background: mode === "quick" ? t.surface2 : "transparent", color: mode === "quick" ? t.text : t.textMuted }}>{s.signInTab}</button>
          <button onClick={() => setMode("signup")} style={{ flex: 1, padding: "8px 0", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, border: "none", background: mode === "signup" ? t.surface2 : "transparent", color: mode === "signup" ? t.text : t.textMuted }}>{s.signUpTab}</button>
        </div>

        {mode === "quick" ? (
          <div>
            <p style={{ fontSize: 12, color: t.textMuted, marginBottom: 12, lineHeight: 1.5 }}>{s.quickSignInHint}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {demoAccounts.map((p) => (
                <button key={p.id} onClick={() => onLogin(p)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface2, cursor: "pointer", textAlign: isRtl ? "right" : "left" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 999, background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>{p.initials}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.text }}>{p.name[lang]}</p>
                    <p style={{ margin: 0, fontSize: 11, color: t.textMuted }}>{ROLE_LABELS[p.role][lang]} · {deptName(p.departmentId, lang)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{s.fullNameLabel}</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={s.namePlaceholder} style={{ width: "100%", marginTop: 5, marginBottom: 14, padding: "10px 12px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface2, color: t.text, fontSize: 14 }} />
            <label style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{s.emailLabel}</label>
            <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder={s.emailPlaceholder} style={{ width: "100%", marginTop: 5, marginBottom: 14, padding: "10px 12px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface2, color: t.text, fontSize: 14 }} />
            <label style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{s.departmentLabel}</label>
            <select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))} style={{ width: "100%", marginTop: 5, marginBottom: 20, padding: "10px 12px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface2, color: t.text, fontSize: 14 }}>
              {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name[lang]}</option>)}
            </select>
            <button onClick={handleSignup} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#fff", background: `linear-gradient(90deg, ${t.accent1}, ${t.accent2})` }}>{s.createAccount}</button>
            <p style={{ fontSize: 11, color: t.textMuted, marginTop: 10, textAlign: "center" }}>{s.signupHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===========================================================
   APP SHELL
=========================================================== */
export default function App() {
  const [themeKey, setThemeKey] = useState("matchpoint");
  const [lang, setLang] = useState("en");
  const t = THEMES[themeKey];
  const isRtl = lang === "ar";
  const s = T[lang];

  const [directory, setDirectory] = useState(DIRECTORY);
  const [currentUser, setCurrentUser] = useState(null);
  const [awards, setAwards] = useState(INITIAL_AWARDS);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [view, setView] = useState("home");
  const [themePanelOpen, setThemePanelOpen] = useState(false);

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const fontBody = isRtl ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  if (!currentUser) {
    return <AuthScreen t={t} lang={lang} setLang={setLang} onLogin={setCurrentUser} directory={directory} setDirectory={setDirectory} />;
  }

  const unreadCount = NEWS.filter((n) => n.unread && (n.audience === "all" || n.audience === currentUser.departmentId)).length;

  const baseNav = [
    { id: "home", label: s.navHome, Icon: Home },
    { id: "news", label: s.navNews, Icon: Newspaper },
    { id: "events", label: s.navEvents, Icon: CalendarDays },
    { id: "department", label: s.navDepartment, Icon: Users },
    { id: "faqs", label: s.navFaqs, Icon: HelpCircle },
    { id: "awards", label: s.navAwards, Icon: Award },
  ];
  const navItems = CAN_MANAGE_POINTS.includes(currentUser.role) ? [...baseNav, { id: "managepoints", label: s.navManagePoints, Icon: ShieldCheck }] : baseNav;

  const handleSignOut = () => { setCurrentUser(null); setView("home"); };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ direction: isRtl ? "rtl" : "ltr", background: t.bg, minHeight: "100vh", fontFamily: fontBody }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Cairo:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid ${t.accent1}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <aside className="hidden md:flex" style={{ position: "fixed", top: 0, bottom: 0, [isRtl ? "right" : "left"]: 0, width: 240, flexDirection: "column", padding: 24, borderRight: isRtl ? "none" : `1px solid ${t.border}`, borderLeft: isRtl ? `1px solid ${t.border}` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <KMark t={t} size={38} />
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: t.text, letterSpacing: 0.5 }}>{isRtl ? "كود" : "KODE"}</p>
            <p style={{ margin: 0, fontSize: 10, color: t.textMuted, letterSpacing: 1 }}>{isRtl ? "النادي الرياضي" : "SPORTS CLUB"}</p>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(({ id, label, Icon }) => {
            const active = view === id;
            return (
              <button key={id} onClick={() => setView(id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, cursor: "pointer", border: "none", background: active ? t.surface2 : "transparent", color: active ? t.text : t.textMuted, fontSize: 14, fontWeight: active ? 700 : 500, textAlign: isRtl ? "right" : "left" }}>
                <Icon size={18} color={active ? t.accent1 : t.textMuted} />
                {label}
                {id === "news" && unreadCount > 0 && <span style={{ marginInlineStart: "auto", fontSize: 11, fontWeight: 700, color: "#fff", background: t.accent2, borderRadius: 999, padding: "1px 7px" }}>{unreadCount}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto" }}>
          <div style={{ marginBottom: 10 }}>
            <LanguageToggle lang={lang} setLang={setLang} t={t} />
          </div>
          <button onClick={() => setThemePanelOpen(true)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, width: "100%", border: `1px solid ${t.border}`, background: "none", cursor: "pointer", marginBottom: 10 }}>
            <Palette size={16} color={t.accent1} />
            <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{s.theme}: {t.name[lang]}</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 999, background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>
              {currentUser.initials}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.text }}>{currentUser.name[lang]}</p>
              <p style={{ margin: 0, fontSize: 11, color: t.textMuted }}>{ROLE_LABELS[currentUser.role][lang]}</p>
            </div>
            <button onClick={handleSignOut} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <LogOut size={16} color={t.textMuted} />
            </button>
          </div>
        </div>
      </aside>

      <div className={isRtl ? "md:mr-60" : "md:ml-60"} style={{ paddingBottom: 84 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${t.border}` }}>
          <div className="flex md:hidden" style={{ alignItems: "center", gap: 10 }}>
            <KMark t={t} size={30} />
            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: t.text }}>{isRtl ? "كود" : "KODE"}</p>
          </div>
          <p className="hidden md:block" style={{ margin: 0, fontSize: 14, color: t.textMuted }}>
            {getGreeting(lang)}, <span style={{ color: t.text, fontWeight: 700 }}>{currentUser.name[lang]}</span>
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="md:hidden">
              <LanguageToggle lang={lang} setLang={setLang} t={t} />
            </div>
            <button onClick={() => setThemePanelOpen(true)} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Palette size={19} color={t.textMuted} />
            </button>
            <div style={{ position: "relative" }}>
              <Bell size={19} color={t.textMuted} />
              {unreadCount > 0 && <span style={{ position: "absolute", top: -4, [isRtl ? "left" : "right"]: -4, width: 8, height: 8, borderRadius: 999, background: t.warning }} />}
            </div>
            <button onClick={handleSignOut} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <LogOut size={18} color={t.textMuted} />
            </button>
            <div style={{ width: 30, height: 30, borderRadius: 999, background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
              {currentUser.initials}
            </div>
          </div>
        </header>

        <main style={{ padding: "28px 24px", maxWidth: 1000 }}>
          {view === "home" && <HomeView t={t} lang={lang} currentUser={currentUser} unreadCount={unreadCount} goTo={setView} themeKey={themeKey} />}
          {view === "news" && <NewsView t={t} lang={lang} currentUser={currentUser} />}
          {view === "events" && <EventsView t={t} lang={lang} currentUser={currentUser} />}
          {view === "department" && <DepartmentView t={t} lang={lang} currentUser={currentUser} directory={directory} awards={awards} currentMonthKey={currentMonthKey} comments={comments} setComments={setComments} />}
          {view === "faqs" && <FAQsView t={t} lang={lang} />}
          {view === "awards" && <MyAwardsView t={t} lang={lang} currentUser={currentUser} awards={awards} directory={directory} themeKey={themeKey} />}
          {view === "managepoints" && CAN_MANAGE_POINTS.includes(currentUser.role) && <ManagePointsView t={t} lang={lang} currentUser={currentUser} awards={awards} setAwards={setAwards} directory={directory} currentMonthKey={currentMonthKey} />}
        </main>
      </div>

      <nav className="md:hidden" style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", overflowX: "auto", padding: "10px 6px", background: t.surface, borderTop: `1px solid ${t.border}`, zIndex: 40 }}>
        {navItems.map(({ id, label, Icon }) => {
          const active = view === id;
          return (
            <button key={id} onClick={() => setView(id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: "0 12px", minWidth: 62 }}>
              <Icon size={20} color={active ? t.accent1 : t.textMuted} />
              <span style={{ fontSize: 10, color: active ? t.text : t.textMuted, fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}>{label}</span>
            </button>
          );
        })}
      </nav>

      {themePanelOpen && <ThemePanel t={t} lang={lang} themeKey={themeKey} setThemeKey={setThemeKey} onClose={() => setThemePanelOpen(false)} isRtl={isRtl} />}
    </div>
  );
}
