import { TranslationDictionary } from './types';

export const hi: TranslationDictionary = {
  appName: 'QCLEAR (शुद्ध वायु साथी)',
  tagline: 'गंभीर सर्दियों के स्मॉग और स्वच्छ जीवन के लिए आपका जेन-एआई साथी',
  languageSwitch: 'English',
  simpleLanguageToggle: 'सरल भाषा',
  highContrastToggle: 'हाई कंट्रास्ट',
  refreshButton: 'डेटा रिफ्रेश करें',
  refreshing: 'अपडेट हो रहा है...',
  searchPlaceholder: 'शहर खोजें (जैसे नई दिल्ली, मुंबई, लाहौर)...',
  searchButton: 'खोजें',
  locating: 'स्थान जांचा जा रहा है...',
  useMyLocation: 'मेरा स्थान उपयोग करें',
  lastUpdated: 'अंतिम अपडेट',
  dataSourceNotice: 'लाइव प्रति घंटा मॉडल एक्यूआई (Open-Meteo)',
  modeledEstimateNotice: 'नोट: ये मान वायुमंडलीय मॉडल अनुमान हैं, भौतिक स्टेशन रीडिंग नहीं।',

  // AQI Bands & Labels
  aqiGood: 'अच्छा (Good)',
  aqiModerate: 'मध्यम (Moderate)',
  aqiSensitive: 'संवेदनशील समूहों के लिए अस्वस्थ',
  aqiUnhealthy: 'अस्वस्थ (Unhealthy)',
  aqiVeryUnhealthy: 'अत्यंत अस्वस्थ (Very Unhealthy)',
  aqiHazardous: 'खतरनाक (Hazardous)',
  aqiSevere: 'गंभीर स्मॉग (Severe)',
  aqiLabel: 'यूएस एक्यूआई (US AQI)',
  pm25Label: 'पीएम 2.5 (सूक्ष्म कण)',
  pm10Label: 'पीएम 10 (धूल के कण)',
  no2Label: 'एनओ₂ (नाइट्रोजन डाइऑक्साइड)',
  o3Label: 'ओ₃ (सतही ओजोन)',
  coLabel: 'सीओ (कार्बन मोनोऑक्साइड)',

  // Trend Chart & Windows
  trendTitle: '24-घंटे का वायु गुणवत्ता व वेंटिलेशन पूर्वानुमान',
  trendSubtitle: 'वास्तविक प्रति घंटा पीएम2.5 फैलाव पैटर्न से गणितीय रूप से निर्धारित',
  ventilationWindowBadge: 'सुरक्षित वेंटिलेशन विंडो',
  peakSmogWindowBadge: 'चरम स्मॉग विंडो (खिड़कियां बंद रखें)',
  recommendedVentilationText: 'कमरों में हवा बदलने और वेंटिलेशन के लिए अनुशंसित समय',
  peakSmogText: 'खिड़कियां कसकर बंद रखें; प्यूरीफायर लगातार चलाएं',
  hourlyPm25: 'पीएम 2.5 (µg/m³)',
  hourlyPm10: 'पीएम 10 (µg/m³)',

  // Household Presets
  demoHouseholdsTitle: 'डेमो परिवार प्रीसेट (एक-क्लिक में अनुकूलन)',
  presetToddlerElderlyName: 'छोटे बच्चे और बुजुर्गों वाला परिवार',
  presetToddlerElderlyDesc: 'उच्च संवेदनशीलता, गैस कुकिंग, दैनिक स्कूल आवागमन',
  presetSchoolRwaName: 'स्कूल और आरडब्ल्यूए (RWA) प्रबंधक',
  presetSchoolRwaDesc: 'बाहरी खेल और प्रार्थना निर्णय, कचरा जलाने पर रोक, कारपूलिंग',
  presetRemoteWorkerName: 'रिमोट वर्कर (प्यूरीफायर युक्त फ्लैट)',
  presetRemoteWorkerDesc: 'कमरे की सीलिंग, डिलीवरी एकत्रीकरण, दोपहिया वाहन आवागमन',
  customProfile: 'अनुकूलित परिवार प्रोफाइल',

  // Three Pillars
  pillarRoutines: 'दैनिक दिनचर्या',
  pillarHacks: 'इनडोर वायु उपाय',
  pillarAlternatives: 'टिकाऊ विकल्प',
  timeBlockedRoutinesTitle: 'समयबद्ध दैनिक दिनचर्या',
  indoorHacksTitle: 'किफायती इनडोर एयर हैक्स',
  sustainableSwapsTitle: 'सामुदायिक व टिकाऊ विकल्प',

  // Impact Badges
  whyThisMatters: 'यह क्यों जरूरी है',
  personalExposureReduction: 'इनडोर पीएम2.5 घुसपैठ में कमी',
  outdoorDoseAvoided: 'सफर में फेफड़ों तक पहुंचने वाले धुएं में बचाव',
  communityEmissionImpact: 'सामुदायिक उत्सर्जन में बचत',
  estimateDisclaimer: 'वैज्ञानिक फैलाव मॉडल पर आधारित अनुमानित प्रभाव',
  aiGeneratedBadge: 'एआई-जनित (Vertex AI)',
  offlineGuidanceBadge: 'सत्यापित ऑफलाइन मार्गदर्शन',

  // Impact Simulator
  simulatorTitle: 'इंटरैक्टिव प्रभाव सिम्युलेटर व आदत चेकलिस्ट',
  simulatorSubtitle: 'नीचे दिए गए उपायों को चुनें और लाइव देखें कि इनडोर धुआं कितना कम होता है',
  cumulativePersonalExposure: 'कुल इनडोर धुएं से बचाव',
  cumulativeCommunityEmissions: 'साप्ताहिक उत्सर्जित धुआं बचत',
  beforeAfterIndoorEstimate: 'अनुमानित इनडोर पीएम2.5 स्तर',
  simulatedIndoorPm25: 'अनुमानित इनडोर पीएम2.5',
  resetHabits: 'आदतें रीसेट करें',
  selectAllHabits: 'सभी आदतें चुनें',

  // DIY IAQ Card
  corsiTitle: 'सस्ता DIY कोर्सी-रोजेंथल एयर फिल्टर बॉक्स गाइड',
  corsiSubtitle: 'घरेलू टेबल/बॉक्स फैन और MERV-13 फिल्टर से बना शक्तिशाली एयर क्लीनर (~200 CFM)',
  corsiMaterials: 'सामग्री: 1 मानक 20" बॉक्स पंखा, 4 MERV-13 फिल्टर, डक्ट टेप, कार्डबोर्ड।',
  corsiSteps: 'फिल्टरों को चौकोर बक्से के रूप में टेप करें (हवा का बहाव अंदर की ओर); ऊपर पंखा लगाकर टेप करें; नीचे कार्डबोर्ड लगाएं।',
  corsiCostNote: 'लागत: लगभग ₹1,800 जबकि समान क्षमता वाले महंगे प्यूरीफायर ₹12,000+ के आते हैं।',

  // Ask QCLEAR Assistant
  askTitle: 'QCLEAR स्मॉग सहायक से पूछें',
  askSubtitle: 'मौजूदा वायु प्रदूषण और अपने परिवार की स्थिति के आधार पर सटीक सलाह पाएं',
  askPlaceholder: 'उदा. क्या आज 2 साल के बच्चे को बाहर खेलने देना सुरक्षित है? या स्कूल की सुबह की प्रार्थना करानी चाहिए?',
  askButton: 'सलाह पूछें',
  askingButton: 'प्रदूषण स्तर का विश्लेषण हो रहा है...',
  askSampleQ1: 'क्या आज स्कूल में आउटडोर खेलकूद या प्रार्थना सभा कराना ठीक है?',
  askSampleQ2: 'इस स्मॉग स्तर पर छोटे बच्चे के कमरे में हवा कैसे बदलें?',
  askSampleQ3: 'आज शाम टहलने के लिए सबसे सुरक्षित समय कौन सा है?',
  askDisclaimer: 'गैर-चिकित्सीय सूचना: ये सुझाव पर्यावरणीय मॉडल व स्वास्थ्य दिशा-निर्देशों पर आधारित हैं। सांस की गंभीर समस्या होने पर तुरंत चिकित्सक से परामर्श लें।',

  // Disclaimers & Errors
  medicalDisclaimer: 'चिकित्सा अस्वीकरण: QCLEAR केवल पर्यावरणीय व स्वास्थ्य संबंधी सामान्य मार्गदर्शन प्रदान करता है। यह डॉक्टरी सलाह का विकल्प नहीं है। गंभीर श्वसन या हृदय रोगी अपने चिकित्सक के निर्देशों का कड़ाई से पालन करें।',
  methodologyLink: 'गणना पद्धति और वैज्ञानिक मान्यताएं',
  rateLimitError: 'अनुरोध सीमा पूरी हो गई है। कृपया थोड़ी देर बाद पुनः प्रयास करें।',
  upstreamError: 'वायु गुणवत्ता सेवा अस्थायी रूप से अनुपलब्ध है। संचित डेटा दिखाया जा रहा है।',
  networkError: 'सेवा से संपर्क नहीं हो पा रहा है। कृपया इंटरनेट कनेक्शन जांचें।',
};
