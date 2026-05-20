export type SupportedLanguage = "en" | "hi" | "mr" | "ta" | "kn";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  "en",
  "hi",
  "mr",
  "ta",
  "kn",
];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export type StringKey =
  | "app.name"
  | "app.tagline"
  | "common.save"
  | "common.cancel"
  | "common.delete"
  | "common.search"
  | "common.next"
  | "common.back"
  | "common.skip"
  | "common.done"
  | "common.add"
  | "common.loading"
  | "common.error"
  | "common.retry"
  | "dashboard.title"
  | "analytics.title"
  | "analytics.subtitle"
  | "analytics.backToDashboard"
  | "analytics.export"
  | "analytics.period.thisMonth"
  | "analytics.period.lastMonth"
  | "analytics.period.thisQuarter"
  | "analytics.period.thisYear"
  | "analytics.kpi.totalRevenue"
  | "analytics.kpi.avgOrderValue"
  | "analytics.kpi.customerRetention"
  | "analytics.kpi.efficiency"
  | "analytics.chart.revenueVsExpenses"
  | "analytics.chart.revenue"
  | "analytics.chart.expenses"
  | "analytics.chart.ordersByGarment"
  | "analytics.topRepeatCustomers"
  | "analytics.viewAll"
  | "analytics.ordersThisMonth"
  | "analytics.insight.peakHours"
  | "analytics.insight.topGarment"
  | "analytics.demoNote"
  | "today.title"
  | "today.empty"
  | "today.openInsights"
  | "customers.title"
  | "customers.add"
  | "customers.searchPlaceholder"
  | "customers.empty"
  | "customers.callNow"
  | "customers.whatsapp"
  | "customers.directoryTitle"
  | "customers.subtitle"
  | "customers.filters"
  | "customers.sort"
  | "customers.sortName"
  | "customers.sortRecent"
  | "customers.loadMore"
  | "customers.sms"
  | "customers.activeOrder"
  | "customers.measurementsPending"
  | "gallery.title"
  | "gallery.subtitle"
  | "gallery.shopTab"
  | "gallery.customerTab"
  | "gallery.upload"
  | "gallery.filter"
  | "gallery.sortNewest"
  | "gallery.empty"
  | "calendar.deliveriesFor"
  | "calendar.jobCount"
  | "calendar.viewDetails"
  | "profile.ownerName"
  | "profile.saveChanges"
  | "profile.notifications"
  | "profile.businessHours"
  | "profile.dataBackup"
  | "profile.syncNow"
  | "profile.systemSettings"
  | "calendar.title"
  | "calendar.noJobs"
  | "profile.title"
  | "profile.profile"
  | "profile.editName"
  | "profile.shopName"
  | "profile.language"
  | "profile.theme"
  | "profile.privacy"
  | "profile.aiSummaries"
  | "profile.logout"
  | "profile.help"
  | "auth.phonePrompt"
  | "auth.sendOtp"
  | "auth.otpPrompt"
  | "auth.verify"
  | "auth.resend"
  | "onboarding.languageTitle"
  | "onboarding.languageSubtitle"
  | "onboarding.themeTitle"
  | "onboarding.themeSubtitle"
  | "onboarding.shopTitle"
  | "onboarding.shopHint"
  | "job.new"
  | "job.title"
  | "job.markNextStatus"
  | "job.shareOnWhatsapp"
  | "job.status.received"
  | "job.status.cutting"
  | "job.status.stitching"
  | "job.status.trial"
  | "job.status.finishing"
  | "job.status.ready"
  | "job.status.delivered"
  | "job.status.cancelled"
  | "job.wizard.pickCustomer"
  | "job.wizard.pickGarment"
  | "job.wizard.pickGarmentHint"
  | "job.wizard.customGarmentName"
  | "job.wizard.garmentNameLabel"
  | "job.wizard.customGarmentRequired"
  | "job.wizard.customGarmentPlaceholder"
  | "job.wizard.customGarmentHint"
  | "job.wizard.measurements"
  | "measurements.customize"
  | "measurements.done"
  | "measurements.saved"
  | "measurements.editorHint"
  | "measurements.addPreset"
  | "measurements.addCustom"
  | "measurements.customPlaceholder"
  | "measurements.resetDefaults"
  | "measurements.emptyHint"
  | "measurements.valuePlaceholder"
  | "measurements.textValuePlaceholder"
  | "measurements.addCustomText"
  | "measurements.addCustomTextHint"
  | "measurements.textField"
  | "measurements.customNameLabel"
  | "measurements.customValueLabel"
  | "measurements.quickAddHint"
  | "dashboard.urgentPin"
  | "dashboard.urgentUnpin"
  | "dashboard.urgentCollapse"
  | "dashboard.urgentExpand"
  | "job.wizard.garmentExpand"
  | "job.wizard.garmentCollapse"
  | "job.wizard.fabric"
  | "job.wizard.deliveryDate"
  | "job.wizard.price"
  | "job.wizard.finish"
  | "job.shareConfirm"
  | "insights.title"
  | "insights.takeaways"
  | "insights.monthlyOrders"
  | "insights.garmentMix"
  | "insights.busyDays"
  | "insights.festivalForecast"
  | "insights.cashflow"
  | "insights.customerSegments"
  | "profile.totalOrders"
  | "profile.lifetimeRevenue"
  | "profile.memberSince"
  | "profile.editShop"
  | "insights.forecast"
  | "insights.nextMonth"
  | "insights.next3Months"
  | "voice.tap"
  | "voice.listening"
  | "voice.unavailable";

type StringTable = Record<StringKey, string>;

const en: StringTable = {
  "app.name": "Naap Book",
  "app.tagline": "Your tailoring workbook",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.search": "Search",
  "common.next": "Next",
  "common.back": "Back",
  "common.skip": "Skip",
  "common.done": "Done",
  "common.add": "Add",
  "common.loading": "Loading…",
  "common.error": "Something went wrong",
  "common.retry": "Retry",
  "dashboard.title": "Dashboard",
  "analytics.title": "Advanced Analytics",
  "analytics.subtitle": "Key performance indicators and shop insights.",
  "analytics.backToDashboard": "Back to Dashboard",
  "analytics.export": "Export",
  "analytics.period.thisMonth": "This Month",
  "analytics.period.lastMonth": "Last Month",
  "analytics.period.thisQuarter": "This Quarter",
  "analytics.period.thisYear": "This Year",
  "analytics.kpi.totalRevenue": "Total Revenue",
  "analytics.kpi.avgOrderValue": "Avg. Order Value",
  "analytics.kpi.customerRetention": "Customer Retention",
  "analytics.kpi.efficiency": "Efficiency (Jobs/Day)",
  "analytics.chart.revenueVsExpenses": "Revenue vs Expenses",
  "analytics.chart.revenue": "Revenue",
  "analytics.chart.expenses": "Expenses",
  "analytics.chart.ordersByGarment": "Orders by Garment",
  "analytics.topRepeatCustomers": "Top Repeat Customers",
  "analytics.viewAll": "View All",
  "analytics.ordersThisMonth": "{count} orders this month",
  "analytics.insight.peakHours": "Peak Busy Hours",
  "analytics.insight.topGarment": "Top Performing Garment",
  "analytics.demoNote": "Demo analytics — connect live data when the API is enabled.",
  "today.title": "Today's deliveries",
  "today.empty": "No deliveries today — relax!",
  "today.openInsights": "Insights",
  "customers.title": "Customers",
  "customers.add": "New Customer",
  "customers.searchPlaceholder": "Search by name, phone, or location...",
  "customers.empty": "No customers yet",
  "customers.callNow": "Call",
  "customers.whatsapp": "WhatsApp",
  "customers.directoryTitle": "Customers Directory",
  "customers.subtitle": "Manage and connect with your clients",
  "customers.filters": "Filters",
  "customers.sort": "Sort",
  "customers.sortName": "Name (A–Z)",
  "customers.sortRecent": "Recently added",
  "customers.loadMore": "Load more customers",
  "customers.sms": "SMS",
  "customers.activeOrder": "Active order",
  "customers.measurementsPending": "Measurements pending",
  "gallery.title": "Gallery",
  "gallery.subtitle": "Manage and showcase your finished garments and reference photos.",
  "gallery.shopTab": "Shop Gallery",
  "gallery.customerTab": "Customer Gallery",
  "gallery.upload": "Upload Photo",
  "gallery.filter": "Filter",
  "gallery.sortNewest": "Sort by: Newest",
  "gallery.empty": "No photos yet — upload your first finished piece.",
  "calendar.deliveriesFor": "Deliveries for",
  "calendar.jobCount": "{count} jobs",
  "calendar.viewDetails": "View details",
  "profile.ownerName": "Owner name",
  "profile.saveChanges": "Save changes",
  "profile.notifications": "Notifications",
  "profile.businessHours": "Business hours",
  "profile.dataBackup": "Data backup",
  "profile.syncNow": "Sync now",
  "profile.systemSettings": "System settings",
  "calendar.title": "Calendar",
  "calendar.noJobs": "No jobs on this day",
  "profile.title": "Profile & Settings",
  "profile.profile": "Profile",
  "profile.editName": "Edit name",
  "profile.shopName": "Shop name",
  "profile.language": "Language",
  "profile.theme": "Theme",
  "profile.privacy": "Privacy",
  "profile.aiSummaries": "AI summaries",
  "profile.logout": "Log out",
  "profile.help": "Help & support",
  "auth.phonePrompt": "My phone",
  "auth.sendOtp": "Send OTP",
  "auth.otpPrompt": "Enter the 6-digit OTP",
  "auth.verify": "Verify",
  "auth.resend": "Resend OTP",
  "onboarding.languageTitle": "Choose your language",
  "onboarding.languageSubtitle": "You can change this later",
  "onboarding.themeTitle": "Choose a look",
  "onboarding.themeSubtitle": "Tap a tile to preview",
  "onboarding.shopTitle": "Your shop",
  "onboarding.shopHint": "Optional — used on shared notes",
  "job.new": "New job",
  "job.title": "Job card",
  "job.markNextStatus": "Mark next status",
  "job.shareOnWhatsapp": "Share on WhatsApp",
  "job.status.received": "Received",
  "job.status.cutting": "Cutting",
  "job.status.stitching": "Stitching",
  "job.status.trial": "Trial",
  "job.status.finishing": "Finishing",
  "job.status.ready": "Ready",
  "job.status.delivered": "Delivered",
  "job.status.cancelled": "Cancelled",
  "job.wizard.pickCustomer": "Pick customer",
  "job.wizard.pickGarment": "Pick garment",
  "job.wizard.pickGarmentHint": "Tap to choose",
  "job.wizard.customGarmentName": "Garment type name",
  "job.wizard.garmentNameLabel": "Garment name (optional)",
  "job.wizard.customGarmentRequired": "Required",
  "job.wizard.customGarmentPlaceholder": "e.g. Indo-western gown, Kids frock",
  "job.wizard.customGarmentHint": "Describe the garment you are stitching. Add measurements below.",
  "job.wizard.measurements": "Measurements",
  "measurements.customize": "Customize fields",
  "measurements.done": "Done",
  "measurements.saved": "Saved",
  "measurements.editorHint": "Add, remove, or reorder fields. Changes save automatically for this garment.",
  "measurements.addPreset": "Add preset field…",
  "measurements.addCustom": "Add custom",
  "measurements.customPlaceholder": "Custom field name",
  "measurements.resetDefaults": "Reset to defaults",
  "measurements.emptyHint": "Tap Customize to add measurement fields for this garment.",
  "measurements.valuePlaceholder": "e.g. 36 or 1/4",
  "measurements.textValuePlaceholder": "Free text (e.g. as per sample)",
  "measurements.addCustomText": "+ Text field",
  "measurements.addCustomTextHint": "Add a field for free-text notes",
  "measurements.textField": "Text",
  "measurements.customNameLabel": "Measurement name",
  "measurements.customValueLabel": "Value",
  "measurements.quickAddHint": "Add an extra measurement field and value below",
  "dashboard.urgentPin": "Pin open",
  "dashboard.urgentUnpin": "Unpin",
  "dashboard.urgentCollapse": "Collapse urgent list",
  "dashboard.urgentExpand": "Expand urgent list",
  "job.wizard.garmentExpand": "Show all garments",
  "job.wizard.garmentCollapse": "Hide garment list",
  "job.wizard.fabric": "Fabric",
  "job.wizard.deliveryDate": "Delivery date",
  "job.wizard.price": "Price",
  "job.wizard.finish": "Finish",
  "job.shareConfirm": "Share details with customer on WhatsApp?",
  "insights.title": "Insights",
  "insights.takeaways": "Key takeaways",
  "insights.monthlyOrders": "Monthly orders",
  "insights.garmentMix": "Garment mix",
  "insights.busyDays": "Busy days",
  "insights.festivalForecast": "Festival forecast",
  "insights.cashflow": "Cashflow",
  "insights.customerSegments": "Customer segments",
  "profile.totalOrders": "Total orders",
  "profile.lifetimeRevenue": "Lifetime revenue",
  "profile.memberSince": "Member since",
  "profile.editShop": "Edit shop name",
  "insights.forecast": "Sales forecast",
  "insights.nextMonth": "Next month",
  "insights.next3Months": "Next 3 months",
  "voice.tap": "Tap to speak",
  "voice.listening": "Listening…",
  "voice.unavailable": "Voice not available",
};

const hi: StringTable = {
  "app.name": "नाप बुक",
  "app.tagline": "आपकी सिलाई बही",
  "common.save": "सेव",
  "common.cancel": "रद्द",
  "common.delete": "मिटाएँ",
  "common.search": "खोज",
  "common.next": "आगे",
  "common.back": "वापस",
  "common.skip": "छोड़ें",
  "common.done": "हो गया",
  "common.add": "जोड़ें",
  "common.loading": "लोड हो रहा है…",
  "common.error": "कुछ गड़बड़ हो गई",
  "common.retry": "फिर कोशिश",
  "dashboard.title": "डैशबोर्ड",
  "analytics.title": "विश्लेषण",
  "analytics.subtitle": "Key performance indicators and shop insights.",
  "analytics.backToDashboard": "Back to Dashboard",
  "analytics.export": "Export",
  "analytics.period.thisMonth": "This Month",
  "analytics.period.lastMonth": "Last Month",
  "analytics.period.thisQuarter": "This Quarter",
  "analytics.period.thisYear": "This Year",
  "analytics.kpi.totalRevenue": "Total Revenue",
  "analytics.kpi.avgOrderValue": "Avg. Order Value",
  "analytics.kpi.customerRetention": "Customer Retention",
  "analytics.kpi.efficiency": "Efficiency (Jobs/Day)",
  "analytics.chart.revenueVsExpenses": "Revenue vs Expenses",
  "analytics.chart.revenue": "Revenue",
  "analytics.chart.expenses": "Expenses",
  "analytics.chart.ordersByGarment": "Orders by Garment",
  "analytics.topRepeatCustomers": "Top Repeat Customers",
  "analytics.viewAll": "View All",
  "analytics.ordersThisMonth": "{count} orders this month",
  "analytics.insight.peakHours": "Peak Busy Hours",
  "analytics.insight.topGarment": "Top Performing Garment",
  "analytics.demoNote": "Demo analytics — connect live data when the API is enabled.",
  "today.title": "आज की डिलीवरी",
  "today.empty": "आज कोई डिलीवरी नहीं — आराम कीजिए!",
  "today.openInsights": "जानकारी",
  "customers.title": "ग्राहक",
  "customers.add": "ग्राहक जोड़ें",
  "customers.searchPlaceholder": "नाम या फ़ोन से खोजें",
  "customers.empty": "अभी कोई ग्राहक नहीं",
  "customers.callNow": "कॉल",
  "customers.whatsapp": "WhatsApp",
  "customers.directoryTitle": "ग्राहक सूची",
  "customers.subtitle": "अपने ग्राहकों को देखें और संपर्क करें",
  "customers.filters": "फ़िल्टर",
  "customers.sort": "क्रम",
  "customers.sortName": "नाम (अ–ज्ञ)",
  "customers.sortRecent": "हाल में जोड़े",
  "customers.loadMore": "और ग्राहक लोड करें",
  "customers.sms": "SMS",
  "customers.activeOrder": "चालू ऑर्डर",
  "customers.measurementsPending": "माप लंबित",
  "gallery.title": "गैलरी",
  "gallery.subtitle": "तैयार कपड़ों और रेफ़रेंस फ़ोटो देखें।",
  "gallery.shopTab": "दुकान गैलरी",
  "gallery.customerTab": "ग्राहक गैलरी",
  "gallery.upload": "फ़ोटो अपलोड",
  "gallery.filter": "फ़िल्टर",
  "gallery.sortNewest": "नवीनतम पहले",
  "gallery.empty": "अभी कोई फ़ोटो नहीं।",
  "calendar.deliveriesFor": "डिलीवरी",
  "calendar.jobCount": "{count} काम",
  "calendar.viewDetails": "विवरण देखें",
  "profile.ownerName": "मालिक का नाम",
  "profile.saveChanges": "सेव करें",
  "profile.notifications": "सूचनाएँ",
  "profile.businessHours": "दुकान का समय",
  "profile.dataBackup": "डेटा बैकअप",
  "profile.syncNow": "अभी सिंक करें",
  "profile.systemSettings": "सिस्टम सेटिंग",
  "calendar.title": "कैलेंडर",
  "calendar.noJobs": "इस दिन कोई काम नहीं",
  "profile.title": "प्रोफ़ाइल",
  "profile.profile": "मेरी जानकारी",
  "profile.editName": "नाम बदलें",
  "profile.shopName": "दुकान का नाम",
  "profile.language": "भाषा",
  "profile.theme": "रंग-रूप",
  "profile.privacy": "गोपनीयता",
  "profile.aiSummaries": "AI सारांश",
  "profile.logout": "लॉग आउट",
  "profile.help": "मदद",
  "auth.phonePrompt": "मेरा फ़ोन",
  "auth.sendOtp": "OTP भेजें",
  "auth.otpPrompt": "6 अंकों का OTP डालें",
  "auth.verify": "जाँच करें",
  "auth.resend": "फिर भेजें",
  "onboarding.languageTitle": "अपनी भाषा चुनें",
  "onboarding.languageSubtitle": "बाद में बदल सकते हैं",
  "onboarding.themeTitle": "रंग-रूप चुनें",
  "onboarding.themeSubtitle": "टैप करके देखें",
  "onboarding.shopTitle": "आपकी दुकान",
  "onboarding.shopHint": "वैकल्पिक — साझा नोट पर दिखेगा",
  "job.new": "नया काम",
  "job.title": "जॉब कार्ड",
  "job.markNextStatus": "अगली स्थिति लगाएँ",
  "job.shareOnWhatsapp": "WhatsApp पर भेजें",
  "job.status.received": "मिला",
  "job.status.cutting": "कटाई",
  "job.status.stitching": "सिलाई",
  "job.status.trial": "ट्रायल",
  "job.status.finishing": "फिनिशिंग",
  "job.status.ready": "तैयार",
  "job.status.delivered": "दे दिया",
  "job.status.cancelled": "रद्द",
  "job.wizard.pickCustomer": "ग्राहक चुनें",
  "job.wizard.pickGarment": "कपड़ा चुनें",
  "job.wizard.pickGarmentHint": "चुनने के लिए टैप करें",
  "job.wizard.customGarmentName": "कपड़े का नाम",
  "job.wizard.garmentNameLabel": "कपड़े का नाम (वैकल्पिक)",
  "job.wizard.customGarmentRequired": "ज़रूरी",
  "job.wizard.customGarmentPlaceholder": "जैसे इंडो-वेस्टर्न गाउन, बच्चों का फ्रॉक",
  "job.wizard.customGarmentHint": "बताएँ क्या सिल रहे हैं। नीचे नाप जोड़ें।",
  "job.wizard.measurements": "नाप",
  "measurements.customize": "फ़ील्ड बदलें",
  "measurements.done": "हो गया",
  "measurements.saved": "सेव",
  "measurements.editorHint": "फ़ील्ड जोड़ें, हटाएँ या क्रम बदलें। यह सिलाई के लिए सेव रहेगा।",
  "measurements.addPreset": "प्रीसेट जोड़ें…",
  "measurements.addCustom": "नया जोड़ें",
  "measurements.customPlaceholder": "नए फ़ील्ड का नाम",
  "measurements.resetDefaults": "डिफ़ॉल्ट पर लौटें",
  "measurements.emptyHint": "नाप जोड़ने के लिए «फ़ील्ड बदलें» दबाएँ।",
  "measurements.valuePlaceholder": "जैसे 36 या 1/4",
  "measurements.textValuePlaceholder": "मनपसंद टेक्स्ट (जैसे नमूने के अनुसार)",
  "measurements.addCustomText": "+ टेक्स्ट फ़ील्ड",
  "measurements.addCustomTextHint": "मुक्त टेक्स्ट के लिए फ़ील्ड जोड़ें",
  "measurements.textField": "टेक्स्ट",
  "measurements.customNameLabel": "नाप का नाम",
  "measurements.customValueLabel": "मान",
  "measurements.quickAddHint": "नीचे अतिरिक्त नाप का नाम और मान जोड़ें",
  "dashboard.urgentPin": "खुला रखें",
  "dashboard.urgentUnpin": "पिन हटाएँ",
  "dashboard.urgentCollapse": "सूची बंद करें",
  "dashboard.urgentExpand": "सूची खोलें",
  "job.wizard.garmentExpand": "सभी कपड़े दिखाएँ",
  "job.wizard.garmentCollapse": "सूची छुपाएँ",
  "job.wizard.fabric": "कपड़ा",
  "job.wizard.deliveryDate": "डिलीवरी तारीख़",
  "job.wizard.price": "क़ीमत",
  "job.wizard.finish": "ख़त्म",
  "job.shareConfirm": "क्या ग्राहक को WhatsApp पर भेजें?",
  "insights.title": "जानकारी",
  "insights.takeaways": "मुख्य बातें",
  "insights.monthlyOrders": "महीने का काम",
  "insights.garmentMix": "कपड़ों का मिश्रण",
  "insights.busyDays": "व्यस्त दिन",
  "insights.festivalForecast": "त्यौहार पूर्वानुमान",
  "insights.cashflow": "नकदी",
  "insights.customerSegments": "ग्राहक वर्ग",
  "profile.totalOrders": "कुल ऑर्डर",
  "profile.lifetimeRevenue": "कुल कमाई",
  "profile.memberSince": "सदस्य बने",
  "profile.editShop": "दुकान का नाम बदलें",
  "insights.forecast": "बिक्री पूर्वानुमान",
  "insights.nextMonth": "अगला महीना",
  "insights.next3Months": "अगले 3 महीने",
  "voice.tap": "बोलने के लिए टैप करें",
  "voice.listening": "सुन रहा हूँ…",
  "voice.unavailable": "आवाज़ उपलब्ध नहीं",
};

const mr: StringTable = {
  "app.name": "नाप बुक",
  "app.tagline": "तुमची शिवणकाम वही",
  "common.save": "साठवा",
  "common.cancel": "रद्द",
  "common.delete": "हटवा",
  "common.search": "शोधा",
  "common.next": "पुढे",
  "common.back": "मागे",
  "common.skip": "वगळा",
  "common.done": "झाले",
  "common.add": "जोडा",
  "common.loading": "लोड होत आहे…",
  "common.error": "काहीतरी चुकले",
  "common.retry": "पुन्हा प्रयत्न",
  "dashboard.title": "डॅशबोर्ड",
  "analytics.title": "विश्लेषण",
  "analytics.subtitle": "Key performance indicators and shop insights.",
  "analytics.backToDashboard": "Back to Dashboard",
  "analytics.export": "Export",
  "analytics.period.thisMonth": "This Month",
  "analytics.period.lastMonth": "Last Month",
  "analytics.period.thisQuarter": "This Quarter",
  "analytics.period.thisYear": "This Year",
  "analytics.kpi.totalRevenue": "Total Revenue",
  "analytics.kpi.avgOrderValue": "Avg. Order Value",
  "analytics.kpi.customerRetention": "Customer Retention",
  "analytics.kpi.efficiency": "Efficiency (Jobs/Day)",
  "analytics.chart.revenueVsExpenses": "Revenue vs Expenses",
  "analytics.chart.revenue": "Revenue",
  "analytics.chart.expenses": "Expenses",
  "analytics.chart.ordersByGarment": "Orders by Garment",
  "analytics.topRepeatCustomers": "Top Repeat Customers",
  "analytics.viewAll": "View All",
  "analytics.ordersThisMonth": "{count} orders this month",
  "analytics.insight.peakHours": "Peak Busy Hours",
  "analytics.insight.topGarment": "Top Performing Garment",
  "analytics.demoNote": "Demo analytics — connect live data when the API is enabled.",
  "today.title": "आजची डिलिव्हरी",
  "today.empty": "आज काही नाही — आराम करा!",
  "today.openInsights": "माहिती",
  "customers.title": "ग्राहक",
  "customers.add": "ग्राहक जोडा",
  "customers.searchPlaceholder": "नाव किंवा फोन शोधा",
  "customers.empty": "अद्याप ग्राहक नाहीत",
  "customers.callNow": "कॉल",
  "customers.whatsapp": "WhatsApp",
  "customers.directoryTitle": "ग्राहक यादी",
  "customers.subtitle": "ग्राहक व्यवस्थापन",
  "customers.filters": "फिल्टर",
  "customers.sort": "क्रम",
  "customers.sortName": "नाव (अ–ज्ञ)",
  "customers.sortRecent": "नुकतेच जोडले",
  "customers.loadMore": "अजून ग्राहक",
  "customers.sms": "SMS",
  "customers.activeOrder": "सुरू ऑर्डर",
  "customers.measurementsPending": "मापे बाकी",
  "gallery.title": "गॅलरी",
  "gallery.subtitle": "तयार कपडे आणि फोटो.",
  "gallery.shopTab": "दुकान गॅलरी",
  "gallery.customerTab": "ग्राहक गॅलरी",
  "gallery.upload": "फोटो अपलोड",
  "gallery.filter": "फिल्टर",
  "gallery.sortNewest": "नवीनतम",
  "gallery.empty": "अजून फोटो नाहीत.",
  "calendar.deliveriesFor": "डिलिव्हरी",
  "calendar.jobCount": "{count} कामे",
  "calendar.viewDetails": "तपशील",
  "profile.ownerName": "मालकाचे नाव",
  "profile.saveChanges": "सेव्ह",
  "profile.notifications": "सूचना",
  "profile.businessHours": "वेळापत्रक",
  "profile.dataBackup": "बॅकअप",
  "profile.syncNow": "सिंक",
  "profile.systemSettings": "सिस्टम",
  "calendar.title": "कॅलेंडर",
  "calendar.noJobs": "या दिवशी काम नाही",
  "profile.title": "प्रोफाइल",
  "profile.profile": "माझी माहिती",
  "profile.editName": "नाव बदला",
  "profile.shopName": "दुकानाचे नाव",
  "profile.language": "भाषा",
  "profile.theme": "रंगसंगती",
  "profile.privacy": "गोपनीयता",
  "profile.aiSummaries": "AI सारांश",
  "profile.logout": "बाहेर पडा",
  "profile.help": "मदत",
  "auth.phonePrompt": "माझा फोन",
  "auth.sendOtp": "OTP पाठवा",
  "auth.otpPrompt": "6 अंकी OTP टाका",
  "auth.verify": "तपासा",
  "auth.resend": "पुन्हा पाठवा",
  "onboarding.languageTitle": "तुमची भाषा निवडा",
  "onboarding.languageSubtitle": "नंतर बदलू शकता",
  "onboarding.themeTitle": "रंगसंगती निवडा",
  "onboarding.themeSubtitle": "टॅप करून बघा",
  "onboarding.shopTitle": "तुमचे दुकान",
  "onboarding.shopHint": "ऐच्छिक — सामायिक नोट्सवर दिसेल",
  "job.new": "नवीन काम",
  "job.title": "जॉब कार्ड",
  "job.markNextStatus": "पुढची स्थिती लावा",
  "job.shareOnWhatsapp": "WhatsApp वर पाठवा",
  "job.status.received": "मिळाले",
  "job.status.cutting": "कापणी",
  "job.status.stitching": "शिवण",
  "job.status.trial": "ट्रायल",
  "job.status.finishing": "फिनिशिंग",
  "job.status.ready": "तयार",
  "job.status.delivered": "दिले",
  "job.status.cancelled": "रद्द",
  "job.wizard.pickCustomer": "ग्राहक निवडा",
  "job.wizard.pickGarment": "कपडा निवडा",
  "job.wizard.pickGarmentHint": "निवडण्यासाठी टॅप करा",
  "job.wizard.measurements": "माप",
  "measurements.customize": "फील्ड बदला",
  "measurements.done": "झाले",
  "measurements.saved": "सेव्ह",
  "measurements.editorHint": "फील्ड जोडा, काढा किंवा क्रम बदला. बदल या कपड्यासाठी सेव्ह होतील.",
  "measurements.addPreset": "प्रीसेट जोडा…",
  "measurements.addCustom": "नवीन जोडा",
  "measurements.customPlaceholder": "नवीन फील्ड नाव",
  "measurements.resetDefaults": "मूळवर परत",
  "measurements.emptyHint": "माप जोडण्यासाठी «फील्ड बदला» दाबा.",
  "measurements.valuePlaceholder": "उदा. 36 किंवा 1/4",
  "measurements.textValuePlaceholder": "मुक्त मजकूर (उदा. नमुन्याप्रमाणे)",
  "measurements.addCustomText": "+ मजकूर फील्ड",
  "measurements.addCustomTextHint": "मुक्त मजकुरासाठी फील्ड जोडा",
  "measurements.textField": "मजकूर",
  "job.wizard.garmentExpand": "सर्व कपडे दाखवा",
  "job.wizard.garmentCollapse": "यादी लपवा",
  "job.wizard.fabric": "कपडा",
  "job.wizard.deliveryDate": "डिलिव्हरी तारीख",
  "job.wizard.price": "किंमत",
  "job.wizard.finish": "संपवा",
  "job.shareConfirm": "ग्राहकाला WhatsApp वर पाठवायचे?",
  "insights.title": "माहिती",
  "insights.takeaways": "मुख्य गोष्टी",
  "insights.monthlyOrders": "महिन्याची कामे",
  "insights.garmentMix": "कपड्यांचे मिश्रण",
  "insights.busyDays": "व्यस्त दिवस",
  "insights.festivalForecast": "सण अंदाज",
  "insights.cashflow": "रोख प्रवाह",
  "insights.customerSegments": "ग्राहक वर्ग",
  "profile.totalOrders": "एकूण कामे",
  "profile.lifetimeRevenue": "एकूण कमाई",
  "profile.memberSince": "सदस्य झालात",
  "profile.editShop": "दुकानाचे नाव बदला",
  "insights.forecast": "विक्री अंदाज",
  "insights.nextMonth": "पुढचा महिना",
  "insights.next3Months": "पुढचे 3 महिने",
  "voice.tap": "बोलण्यासाठी टॅप करा",
  "voice.listening": "ऐकत आहे…",
  "voice.unavailable": "आवाज उपलब्ध नाही",
};

const ta: StringTable = {
  "app.name": "நாப் புக்",
  "app.tagline": "உங்கள் தையல் புத்தகம்",
  "common.save": "சேமி",
  "common.cancel": "ரத்து",
  "common.delete": "நீக்கு",
  "common.search": "தேடு",
  "common.next": "அடுத்து",
  "common.back": "பின்",
  "common.skip": "தவிர்",
  "common.done": "முடிந்தது",
  "common.add": "சேர்",
  "common.loading": "ஏற்றுகிறது…",
  "common.error": "ஏதோ தவறு",
  "common.retry": "மீண்டும் முயற்சி",
  "dashboard.title": "டாஷ்போர்டு",
  "analytics.title": "பகுப்பாய்வு",
  "analytics.subtitle": "Key performance indicators and shop insights.",
  "analytics.backToDashboard": "Back to Dashboard",
  "analytics.export": "Export",
  "analytics.period.thisMonth": "This Month",
  "analytics.period.lastMonth": "Last Month",
  "analytics.period.thisQuarter": "This Quarter",
  "analytics.period.thisYear": "This Year",
  "analytics.kpi.totalRevenue": "Total Revenue",
  "analytics.kpi.avgOrderValue": "Avg. Order Value",
  "analytics.kpi.customerRetention": "Customer Retention",
  "analytics.kpi.efficiency": "Efficiency (Jobs/Day)",
  "analytics.chart.revenueVsExpenses": "Revenue vs Expenses",
  "analytics.chart.revenue": "Revenue",
  "analytics.chart.expenses": "Expenses",
  "analytics.chart.ordersByGarment": "Orders by Garment",
  "analytics.topRepeatCustomers": "Top Repeat Customers",
  "analytics.viewAll": "View All",
  "analytics.ordersThisMonth": "{count} orders this month",
  "analytics.insight.peakHours": "Peak Busy Hours",
  "analytics.insight.topGarment": "Top Performing Garment",
  "analytics.demoNote": "Demo analytics — connect live data when the API is enabled.",
  "today.title": "இன்று டெலிவரி",
  "today.empty": "இன்று டெலிவரி இல்லை — ஓய்வாக!",
  "today.openInsights": "தகவல்",
  "customers.title": "வாடிக்கையாளர்",
  "customers.add": "வாடிக்கையாளர் சேர்",
  "customers.searchPlaceholder": "பெயர் அல்லது தொலைபேசி",
  "customers.empty": "வாடிக்கையாளர் இல்லை",
  "customers.callNow": "அழை",
  "customers.whatsapp": "WhatsApp",
  "customers.directoryTitle": "வாடிக்கை பட்டியல்",
  "customers.subtitle": "வாடிக்கைகளை நிர்வகிக்கவும்",
  "customers.filters": "வடிகட்டி",
  "customers.sort": "வரிசை",
  "customers.sortName": "பெயர் (அ–ஹ)",
  "customers.sortRecent": "புதியவை",
  "customers.loadMore": "மேலும் ஏற்று",
  "customers.sms": "SMS",
  "customers.activeOrder": "செயலில் உள்ள ஆர்டர்",
  "customers.measurementsPending": "அளவீடு நிலுவையில்",
  "gallery.title": "கேலரி",
  "gallery.subtitle": "முடிந்த ஆடை புகைப்படங்கள்.",
  "gallery.shopTab": "கடை கேலரி",
  "gallery.customerTab": "வாடிக்கை கேலரி",
  "gallery.upload": "புகைப்படம்",
  "gallery.filter": "வடிகட்டி",
  "gallery.sortNewest": "புதியது முதல்",
  "gallery.empty": "புகைப்படங்கள் இல்லை.",
  "calendar.deliveriesFor": "டெலிவரி",
  "calendar.jobCount": "{count} வேலை",
  "calendar.viewDetails": "விவரம்",
  "profile.ownerName": "உரிமையாளர் பெயர்",
  "profile.saveChanges": "சேமி",
  "profile.notifications": "அறிவிப்புகள்",
  "profile.businessHours": "நேரம்",
  "profile.dataBackup": "காப்பு",
  "profile.syncNow": "ஒத்திசை",
  "profile.systemSettings": "அமைப்புகள்",
  "calendar.title": "காலண்டர்",
  "calendar.noJobs": "இந்த நாளில் வேலை இல்லை",
  "profile.title": "சுயவிவரம்",
  "profile.profile": "என் விவரம்",
  "profile.editName": "பெயர் மாற்று",
  "profile.shopName": "கடை பெயர்",
  "profile.language": "மொழி",
  "profile.theme": "தோற்றம்",
  "profile.privacy": "தனியுரிமை",
  "profile.aiSummaries": "AI சுருக்கம்",
  "profile.logout": "வெளியேறு",
  "profile.help": "உதவி",
  "auth.phonePrompt": "என் தொலைபேசி",
  "auth.sendOtp": "OTP அனுப்பு",
  "auth.otpPrompt": "6 இலக்க OTP",
  "auth.verify": "சரிபார்",
  "auth.resend": "மீண்டும் அனுப்பு",
  "onboarding.languageTitle": "உங்கள் மொழியைத் தேர்",
  "onboarding.languageSubtitle": "பின்னர் மாற்றலாம்",
  "onboarding.themeTitle": "தோற்றம் தேர்",
  "onboarding.themeSubtitle": "தட்டி பாரு",
  "onboarding.shopTitle": "உங்கள் கடை",
  "onboarding.shopHint": "விரும்பினால் — பகிர்வில் தோன்றும்",
  "job.new": "புதிய வேலை",
  "job.title": "வேலை கார்டு",
  "job.markNextStatus": "அடுத்த நிலை",
  "job.shareOnWhatsapp": "WhatsApp இல் அனுப்பு",
  "job.status.received": "பெற்றது",
  "job.status.cutting": "வெட்டு",
  "job.status.stitching": "தைப்பு",
  "job.status.trial": "ட்ரையல்",
  "job.status.finishing": "முடிப்பு",
  "job.status.ready": "தயார்",
  "job.status.delivered": "கொடுத்தது",
  "job.status.cancelled": "ரத்து",
  "job.wizard.pickCustomer": "வாடிக்கையாளர் தேர்",
  "job.wizard.pickGarment": "ஆடை தேர்",
  "job.wizard.pickGarmentHint": "தேர்வதற்கு தட்டு",
  "job.wizard.measurements": "அளவு",
  "measurements.customize": "புலங்களை மாற்று",
  "measurements.done": "முடிந்தது",
  "measurements.saved": "சேமிக்கப்பட்டது",
  "measurements.editorHint": "புலங்களை சேர், நீக்கு அல்லது வரிசை மாற்று. மாற்றங்கள் சேமிக்கப்படும்.",
  "measurements.addPreset": "முன்னமைவு சேர்…",
  "measurements.addCustom": "புதியது சேர்",
  "measurements.customPlaceholder": "புதிய புலம் பெயர்",
  "measurements.resetDefaults": "இயல்புக்கு மீட்டமை",
  "measurements.emptyHint": "அளவுகள் சேர்க்க «புலங்களை மாற்று» அழுத்தவும்.",
  "measurements.valuePlaceholder": "எ.கா. 36 அல்லது 1/4",
  "measurements.textValuePlaceholder": "இலவச உரை (எ.கா. மாதிரியின்படி)",
  "measurements.addCustomText": "+ உரை புலம்",
  "measurements.addCustomTextHint": "இலவச உரைக்கு புலம் சேர்",
  "measurements.textField": "உரை",
  "job.wizard.garmentExpand": "அனைத்து ஆடைகளும் காட்டு",
  "job.wizard.garmentCollapse": "பட்டியலை மறை",
  "job.wizard.fabric": "துணி",
  "job.wizard.deliveryDate": "டெலிவரி தேதி",
  "job.wizard.price": "விலை",
  "job.wizard.finish": "முடி",
  "job.shareConfirm": "வாடிக்கையாளருக்கு WhatsApp இல் அனுப்பவா?",
  "insights.title": "தகவல்கள்",
  "insights.takeaways": "முக்கியக் குறிப்புகள்",
  "insights.monthlyOrders": "மாத ஆர்டர்கள்",
  "insights.garmentMix": "ஆடைகள் கலவை",
  "insights.busyDays": "பிஸி நாட்கள்",
  "insights.festivalForecast": "திருவிழா முன்னறிவிப்பு",
  "insights.cashflow": "பணப்புழக்கம்",
  "insights.customerSegments": "வாடிக்கையாளர் பிரிவு",
  "profile.totalOrders": "மொத்த ஆர்டர்கள்",
  "profile.lifetimeRevenue": "மொத்த வருவாய்",
  "profile.memberSince": "உறுப்பினர் ஆனது",
  "profile.editShop": "கடை பெயர் மாற்று",
  "insights.forecast": "விற்பனை முன்னறிவிப்பு",
  "insights.nextMonth": "அடுத்த மாதம்",
  "insights.next3Months": "அடுத்த 3 மாதங்கள்",
  "voice.tap": "பேச தட்டு",
  "voice.listening": "கேட்கிறேன்…",
  "voice.unavailable": "குரல் கிடைக்கவில்லை",
};

const kn: StringTable = {
  "app.name": "ನಾಪ್ ಬುಕ್",
  "app.tagline": "ನಿಮ್ಮ ಹೊಲಿಗೆ ಪುಸ್ತಕ",
  "common.save": "ಉಳಿಸಿ",
  "common.cancel": "ರದ್ದು",
  "common.delete": "ಅಳಿಸಿ",
  "common.search": "ಹುಡುಕಿ",
  "common.next": "ಮುಂದೆ",
  "common.back": "ಹಿಂದೆ",
  "common.skip": "ಬಿಡಿ",
  "common.done": "ಮುಗಿಯಿತು",
  "common.add": "ಸೇರಿಸಿ",
  "common.loading": "ಲೋಡ್ ಆಗ್ತಿದೆ…",
  "common.error": "ಏನೋ ತಪ್ಪಾಯ್ತು",
  "common.retry": "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  "dashboard.title": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  "analytics.title": "ವಿಶ್ಲೇಷಣೆ",
  "analytics.subtitle": "Key performance indicators and shop insights.",
  "analytics.backToDashboard": "Back to Dashboard",
  "analytics.export": "Export",
  "analytics.period.thisMonth": "This Month",
  "analytics.period.lastMonth": "Last Month",
  "analytics.period.thisQuarter": "This Quarter",
  "analytics.period.thisYear": "This Year",
  "analytics.kpi.totalRevenue": "Total Revenue",
  "analytics.kpi.avgOrderValue": "Avg. Order Value",
  "analytics.kpi.customerRetention": "Customer Retention",
  "analytics.kpi.efficiency": "Efficiency (Jobs/Day)",
  "analytics.chart.revenueVsExpenses": "Revenue vs Expenses",
  "analytics.chart.revenue": "Revenue",
  "analytics.chart.expenses": "Expenses",
  "analytics.chart.ordersByGarment": "Orders by Garment",
  "analytics.topRepeatCustomers": "Top Repeat Customers",
  "analytics.viewAll": "View All",
  "analytics.ordersThisMonth": "{count} orders this month",
  "analytics.insight.peakHours": "Peak Busy Hours",
  "analytics.insight.topGarment": "Top Performing Garment",
  "analytics.demoNote": "Demo analytics — connect live data when the API is enabled.",
  "today.title": "ಇಂದಿನ ಡೆಲಿವರಿ",
  "today.empty": "ಇಂದು ಯಾವುದೂ ಇಲ್ಲ — ಆರಾಮ ಮಾಡಿ!",
  "today.openInsights": "ಮಾಹಿತಿ",
  "customers.title": "ಗ್ರಾಹಕರು",
  "customers.add": "ಗ್ರಾಹಕರನ್ನು ಸೇರಿಸಿ",
  "customers.searchPlaceholder": "ಹೆಸರು ಅಥವಾ ಫೋನ್ ಮೂಲಕ ಹುಡುಕಿ",
  "customers.empty": "ಇನ್ನೂ ಗ್ರಾಹಕರಿಲ್ಲ",
  "customers.callNow": "ಕರೆ",
  "customers.whatsapp": "WhatsApp",
  "customers.directoryTitle": "ಗ್ರಾಹಕ ಪಟ್ಟಿ",
  "customers.subtitle": "ಗ್ರಾಹಕರನ್ನು ನಿರ್ವಹಿಸಿ",
  "customers.filters": "ಫಿಲ್ಟರ್",
  "customers.sort": "ವಿಂಗಡಣೆ",
  "customers.sortName": "ಹೆಸರು (ಅ–ಹ)",
  "customers.sortRecent": "ಇತ್ತೀಚಿನ",
  "customers.loadMore": "ಇನ್ನಷ್ಟು ಲೋಡ್",
  "customers.sms": "SMS",
  "customers.activeOrder": "ಸಕ್ರಿಯ ಆರ್ಡರ್",
  "customers.measurementsPending": "ಅಳತೆ ಬಾಕಿ",
  "gallery.title": "ಗ್ಯಾಲರಿ",
  "gallery.subtitle": "ಮುಗಿದ ಬಟ್ಟೆ ಫೋಟೋಗಳು.",
  "gallery.shopTab": "ಅಂಗಡಿ ಗ್ಯಾಲರಿ",
  "gallery.customerTab": "ಗ್ರಾಹಕ ಗ್ಯಾಲರಿ",
  "gallery.upload": "ಫೋಟೋ ಅಪ್‌ಲೋಡ್",
  "gallery.filter": "ಫಿಲ್ಟರ್",
  "gallery.sortNewest": "ಹೊಸದು ಮೊದಲು",
  "gallery.empty": "ಇನ್ನೂ ಫೋಟೋಗಳಿಲ್ಲ.",
  "calendar.deliveriesFor": "ಡೆಲಿವರಿ",
  "calendar.jobCount": "{count} ಕೆಲಸ",
  "calendar.viewDetails": "ವಿವರ",
  "profile.ownerName": "ಮಾಲೀಕರ ಹೆಸರು",
  "profile.saveChanges": "ಉಳಿಸಿ",
  "profile.notifications": "ಅಧಿಸೂಚನೆ",
  "profile.businessHours": "ಸಮಯ",
  "profile.dataBackup": "ಬ್ಯಾಕಪ್",
  "profile.syncNow": "ಸಿಂಕ್",
  "profile.systemSettings": "ಸಿಸ್ಟಮ್",
  "calendar.title": "ಕ್ಯಾಲೆಂಡರ್",
  "calendar.noJobs": "ಈ ದಿನ ಕೆಲಸವಿಲ್ಲ",
  "profile.title": "ಪ್ರೊಫೈಲ್",
  "profile.profile": "ನನ್ನ ಮಾಹಿತಿ",
  "profile.editName": "ಹೆಸರು ಬದಲಿಸಿ",
  "profile.shopName": "ಅಂಗಡಿಯ ಹೆಸರು",
  "profile.language": "ಭಾಷೆ",
  "profile.theme": "ರಂಗು",
  "profile.privacy": "ಗೌಪ್ಯತೆ",
  "profile.aiSummaries": "AI ಸಾರಾಂಶ",
  "profile.logout": "ಲಾಗ್ ಔಟ್",
  "profile.help": "ಸಹಾಯ",
  "auth.phonePrompt": "ನನ್ನ ಫೋನ್",
  "auth.sendOtp": "OTP ಕಳುಹಿಸಿ",
  "auth.otpPrompt": "6 ಅಂಕಿಯ OTP ಹಾಕಿ",
  "auth.verify": "ಪರಿಶೀಲಿಸಿ",
  "auth.resend": "ಮತ್ತೆ ಕಳುಹಿಸಿ",
  "onboarding.languageTitle": "ನಿಮ್ಮ ಭಾಷೆ ಆರಿಸಿ",
  "onboarding.languageSubtitle": "ನಂತರ ಬದಲಾಯಿಸಬಹುದು",
  "onboarding.themeTitle": "ರಂಗು ಆರಿಸಿ",
  "onboarding.themeSubtitle": "ಟ್ಯಾಪ್ ಮಾಡಿ ನೋಡಿ",
  "onboarding.shopTitle": "ನಿಮ್ಮ ಅಂಗಡಿ",
  "onboarding.shopHint": "ಐಚ್ಛಿಕ — ಹಂಚಿಕೊಂಡ ನೋಟ್‌ನಲ್ಲಿ ಬರುತ್ತದೆ",
  "job.new": "ಹೊಸ ಕೆಲಸ",
  "job.title": "ಕೆಲಸದ ಕಾರ್ಡ್",
  "job.markNextStatus": "ಮುಂದಿನ ಸ್ಥಿತಿ ಗುರ್ತಿಸಿ",
  "job.shareOnWhatsapp": "WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ",
  "job.status.received": "ಸಿಕ್ಕಿತು",
  "job.status.cutting": "ಕತ್ತರಿಸುವಿಕೆ",
  "job.status.stitching": "ಹೊಲಿಗೆ",
  "job.status.trial": "ಟ್ರಯಲ್",
  "job.status.finishing": "ಮುಗಿಯುತ್ತಿದೆ",
  "job.status.ready": "ಸಿದ್ಧ",
  "job.status.delivered": "ಕೊಟ್ಟಾಯ್ತು",
  "job.status.cancelled": "ರದ್ದು",
  "job.wizard.pickCustomer": "ಗ್ರಾಹಕರನ್ನು ಆರಿಸಿ",
  "job.wizard.pickGarment": "ಬಟ್ಟೆ ಆರಿಸಿ",
  "job.wizard.pickGarmentHint": "ಆರಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
  "job.wizard.measurements": "ಅಳತೆ",
  "measurements.customize": "ಫೀಲ್ಡ್ ಬದಲಾಯಿಸಿ",
  "measurements.done": "ಮುಗಿದಿದೆ",
  "measurements.saved": "ಉಳಿಸಲಾಗಿದೆ",
  "measurements.editorHint": "ಫೀಲ್ಡ್ ಸೇರಿಸಿ, ತೆಗೆದುಹಾಕಿ ಅಥವಾ ಕ್ರಮ ಬದಲಾಯಿಸಿ. ಬದಲಾವಣೆಗಳು ಉಳಿಯುತ್ತವೆ.",
  "measurements.addPreset": "ಪ್ರಿಸೆಟ್ ಸೇರಿಸಿ…",
  "measurements.addCustom": "ಹೊಸದು ಸೇರಿಸಿ",
  "measurements.customPlaceholder": "ಹೊಸ ಫೀಲ್ಡ್ ಹೆಸರು",
  "measurements.resetDefaults": "ಡೀಫಾಲ್ಟ್‌ಗೆ ಹಿಂತಿರುಗಿ",
  "measurements.emptyHint": "ಅಳತೆಗಳಿಗಾಗಿ «ಫೀಲ್ಡ್ ಬದಲಾಯಿಸಿ» ಒತ್ತಿ.",
  "measurements.valuePlaceholder": "ಉದಾ. 36 ಅಥವಾ 1/4",
  "measurements.textValuePlaceholder": "ಸ್ವತಂತ್ರ ಪಠ್ಯ (ಉದಾ. ಮಾದರಿಯಂತೆ)",
  "measurements.addCustomText": "+ ಪಠ್ಯ ಫೀಲ್ಡ್",
  "measurements.addCustomTextHint": "ಸ್ವತಂತ್ರ ಪಠ್ಯಕ್ಕೆ ಫೀಲ್ಡ್ ಸೇರಿಸಿ",
  "measurements.textField": "ಪಠ್ಯ",
  "job.wizard.garmentExpand": "ಎಲ್ಲಾ ಬಟ್ಟೆಗಳನ್ನು ತೋರಿಸಿ",
  "job.wizard.garmentCollapse": "ಪಟ್ಟಿಯನ್ನು ಮರೆಮಾಡಿ",
  "job.wizard.fabric": "ಬಟ್ಟೆ",
  "job.wizard.deliveryDate": "ಡೆಲಿವರಿ ದಿನಾಂಕ",
  "job.wizard.price": "ಬೆಲೆ",
  "job.wizard.finish": "ಮುಗಿಸಿ",
  "job.shareConfirm": "ಗ್ರಾಹಕರಿಗೆ WhatsApp ನಲ್ಲಿ ಕಳುಹಿಸುವುದೇ?",
  "insights.title": "ಮಾಹಿತಿ",
  "insights.takeaways": "ಮುಖ್ಯ ವಿಷಯಗಳು",
  "insights.monthlyOrders": "ತಿಂಗಳ ಕೆಲಸ",
  "insights.garmentMix": "ಬಟ್ಟೆಗಳ ಮಿಶ್ರಣ",
  "insights.busyDays": "ಬ್ಯುಸಿ ದಿನಗಳು",
  "insights.festivalForecast": "ಹಬ್ಬದ ಮುನ್ನಂದಾಜು",
  "insights.cashflow": "ನಗದು",
  "insights.customerSegments": "ಗ್ರಾಹಕ ವರ್ಗ",
  "profile.totalOrders": "ಒಟ್ಟು ಆರ್ಡರ್‌ಗಳು",
  "profile.lifetimeRevenue": "ಒಟ್ಟು ಗಳಿಕೆ",
  "profile.memberSince": "ಸದಸ್ಯರಾದದ್ದು",
  "profile.editShop": "ಅಂಗಡಿಯ ಹೆಸರು ಬದಲಿಸಿ",
  "insights.forecast": "ಮಾರಾಟ ಮುನ್ನಂದಾಜು",
  "insights.nextMonth": "ಮುಂದಿನ ತಿಂಗಳು",
  "insights.next3Months": "ಮುಂದಿನ 3 ತಿಂಗಳುಗಳು",
  "voice.tap": "ಮಾತಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
  "voice.listening": "ಕೇಳುತ್ತಿದ್ದೇನೆ…",
  "voice.unavailable": "ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ",
};

export const STRINGS: Record<SupportedLanguage, StringTable> = {
  en,
  hi,
  mr,
  ta,
  kn,
};

export function getString(
  language: SupportedLanguage,
  key: StringKey
): string {
  const table = STRINGS[language] ?? STRINGS.en;
  return table[key] ?? STRINGS.en[key] ?? key;
}
