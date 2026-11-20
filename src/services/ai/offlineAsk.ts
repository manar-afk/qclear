import { AskRequestInput, AskResponseOutput } from '@/lib/schemas/askSchema';

/**
 * Multi-topic grounded offline situational advisory engine.
 * Dynamically conditions advice on the live AQI/PM2.5 values, active household demographics,
 * and user query topic across 14+ common winter smog categories.
 */
export function getOfflineAnswer(input: AskRequestInput): AskResponseOutput {
  const isHindi = input.language === 'hi';
  const q = input.question.toLowerCase().trim();
  const aqi = input.aqi;
  const pm25 = input.pm2_5;
  const isSevere = aqi > 200;
  const isClean = aqi <= 100;

  // Multi-topic pattern matchers
  const isMask = /mask|n95|n99|surgical|cloth|ffp2|kn95|मास्क|नकाब/.test(q);
  const isPurifier = /purifier|hepa|cadr|filter|cleaner|प्यूरीफायर|फिल्टर/.test(q);
  const isSchool = /school|assembly|sports|recess|student|playground|class|स्कूल|प्रार्थना|खेल|छात्र/.test(q);
  const isInfant = /infant|baby|toddler|child|kid|newborn|pediatric|बच्चा|शिशु|नन्हा/.test(q);
  const isElderly = /elderly|senior|grandparent|heart|cardiac|stroke|bp|बुजुर्ग|वृद्ध|दादा|दादी|दिल|रक्तचाप/.test(q);
  const isHealth = /asthma|cough|throat|wheez|inhaler|allergy|eye|burn|headache|दमा|खांसी|गला|जलन|सांस|आंख/.test(q);
  const isExercise = /walk|jog|run|exercise|gym|workout|stroll|सैर|टहल|दौड़|कसरत|व्यायाम|जिम/.test(q);
  const isVentilation = /window|door|ventilat|fresh air|airing|खिड़की|दरवाजा|हवा|वेंटिलेशन/.test(q);
  const isCooking = /cook|kitchen|fry|gas|stove|smoke|agarbatti|incense|candle|dhoop|रसोई|खाना|गैस|अगरबत्ती|धूप/.test(q);
  const isCommute = /commute|travel|car|metro|bike|scooter|bus|traffic|auto|सफर|गाड़ी|कार|मेट्रो|स्कूटर|बाइक/.test(q);
  const isPlants = /plant|snake|spider|areca|gardening|पौधा|गमला|पेड़/.test(q);
  const isPets = /pet|dog|cat|animal|puppy|कुत्ता|बिल्ली|पालतू/.test(q);
  const isCleaning = /mop|broom|sweep|dust|clean|vacuum|पोछा|झाड़ू|सफाई|धूल/.test(q);
  const isAQI = /aqi|pm2\.5|pm10|what does|scale|number|meaning|मतलब|स्तर|संख्या|पैमाना/.test(q);

  if (isHindi) {
    if (isMask) {
      return {
        answer: isSevere
          ? `वर्तमान ${aqi} AQI पर साधारण कपड़े या सर्जिकल मास्क 95% सूक्ष्म जहरीले कणों को नहीं रोक पाते। आपको NIOSH-प्रमाणित N95 या FFP2 मास्क पहनना चाहिए। मास्क नाक और ठुड्डी पर बिना किसी गैप के बिल्कुल टाइट बैठना चाहिए।`
          : `हवा का स्तर ${aqi} AQI है। भीड़भाड़ वाले मुख्य मार्गों पर सामान्य सावधानी के तौर पर N95 मास्क पहन सकते हैं।`,
        keyActionItem: 'केवल प्रमाणित N95/FFP2 मास्क का प्रयोग करें; कपड़े के मास्क से सूक्ष्म PM2.5 नहीं रुकता।',
        severityAdvisory: 'मास्क सुरक्षा: सही फिटिंग वाला N95 मास्क फेफड़ों में जाने वाले 95% जहरीले कणों को रोकता है।',
      };
    }

    if (isPurifier) {
      return {
        answer: isSevere
          ? `${aqi} AQI पर घर में HEPA एयर प्यूरीफायर को बंद कमरों में 24 घंटे लगातार 'ऑटो' या 'मीडियम' स्पीड पर चलाएं। प्यूरीफायर को दीवार से कम से कम 1-2 फीट दूर और कमरे के बीच में रखें ताकि हवा का सर्कुलेशन सही रहे।`
          : `वर्तमान ${aqi} AQI पर प्यूरीफायर को लो/इको मोड पर चला सकते हैं या दोपहर में बंद करके बिजली बचा सकते हैं।`,
        keyActionItem: 'प्यूरीफायर को कमरे के बीच में रखें और फिल्टर की प्री-मेश को हर 2 हफ्ते में वैक्यूम करें।',
        severityAdvisory: 'इनडोर शुद्धता: बंद कमरे में HEPA फिल्टर 30 मिनट में 70-80% PM2.5 को साफ कर देता है।',
      };
    }

    if (isSchool) {
      return {
        answer: isSevere
          ? `वायु गुणवत्ता ${aqi} AQI (PM2.5: ${pm25} µg/m³) पर गंभीर है। स्कूलों को सुबह की बाहरी प्रार्थना सभा, शारीरिक व्यायाम और खेलकूद तुरंत रद्द करने चाहिए। सभी गतिविधियां बंद कमरों में शिफ्ट करें।`
          : `वायु गुणवत्ता ${aqi} AQI पर संतोषजनक है। स्कूल में बाहरी खेलकूद और प्रार्थना सभा सामान्य रूप से कराई जा सकती है।`,
        keyActionItem: isSevere ? 'बाहरी सभाएं तुरंत रद्द करें और छात्रों को अंदर रखें।' : 'बाहरी गतिविधियों का सुरक्षित आयोजन करें।',
        severityAdvisory: 'बाल स्वास्थ्य: बच्चे वयस्कों की तुलना में प्रति मिनट अधिक हवा सांस में लेते हैं।',
      };
    }

    if (isInfant) {
      return {
        answer: isSevere
          ? `शिशुओं और 2 साल से छोटे बच्चों के फेफड़े अभी विकसित हो रहे होते हैं। ${aqi} AQI पर बच्चे को बिल्कुल बाहर न ले जाएं। कमरे की खिड़कियां सील रखें, गीला पोछा लगाएं और अगरबत्ती न जलाएं।`
          : `वर्तमान ${aqi} AQI पर बच्चे को दोपहर 12 से 3 बजे की हल्की गुनगुनी धूप में 20-30 मिनट ले जाना सुरक्षित है।`,
        keyActionItem: 'शिशु को सीलबंद इनडोर कमरे में रखें और कमरे में धुआं या तेज गंध बिल्कुल न होने दें।',
        severityAdvisory: 'उच्च संवेदनशीलता: शिशु की श्वसन दर वयस्कों से दोगुनी होती है।',
      };
    }

    if (isElderly) {
      return {
        answer: isSevere
          ? `बुजुर्गों और हृदय/बीपी रोगियों के लिए ${aqi} AQI पर सुबह की सैर अत्यधिक खतरनाक है। ठंड और स्मॉग मिलकर रक्तचाप बढ़ाते हैं जिससे हार्ट अटैक का जोखिम बढ़ता है। घर के अंदर ही हल्का टहलें।`
          : `हवा सामान्य है (${aqi} AQI)। बुजुर्ग सुबह धूप निकलने के बाद ही सैर पर जाएं।`,
        keyActionItem: 'सुबह 6 से 9 बजे के बीच बुजुर्गों को घर से बाहर न निकलने दें; दवाएं नियमित लें।',
        severityAdvisory: 'हृदय सुरक्षा: जहरीले कण रक्त में घुलकर सूजन और क्लॉटिंग का जोखिम बढ़ाते हैं।',
      };
    }

    if (isHealth) {
      return {
        answer: isSevere
          ? `गंभीर स्मॉग (${aqi} AQI) में आंखों में जलन, गले में खराश और सूखी खांसी आम है। आंखों को ठंडे साफ पानी से धोएं, गुनगुने पानी से गरारे करें और अस्थमा रोगी अपना इनहेलर हमेशा साथ रखें। समस्या बढ़ने पर डॉक्टर से संपर्क करें।`
          : `वर्तमान ${aqi} AQI पर लक्षण हल्के रह सकते हैं। भरपूर पानी पिएं और हाइड्रेटेड रहें।`,
        keyActionItem: 'अस्थमा रोगी प्रिवेंटिव इनहेलर की खुराक न छोड़ें और दिन में 2 बार गुनगुने पानी के गरारे करें।',
        severityAdvisory: 'गैर-चिकित्सीय सलाह: सांस लेने में अत्यधिक कठिनाई होने पर तुरंत आपातकालीन चिकित्सा सहायता लें।',
      };
    }

    if (isExercise) {
      return {
        answer: isSevere
          ? `सख्त चेतावनी: ${aqi} AQI पर बाहर दौड़ना, जॉगिंग या तेज सैर फेफड़ों को भारी नुकसान पहुंचाती है। दौड़ते समय हम 5 गुना अधिक जहरीली हवा अंदर खींचते हैं। केवल कमरे के अंदर हल्का योग करें।`
          : `वायु गुणवत्ता अनुकूल है (${aqi} AQI)। दोपहर या शाम के समय पार्क में सुरक्षित व्यायाम किया जा सकता है।`,
        keyActionItem: 'बाहरी दौड़ व व्यायाम तुरंत रोकें; घर के अंदर ही स्ट्रेचिंग व योग करें।',
        severityAdvisory: 'व्यायाम जोखिम: भारी एरोबिक व्यायाम में PM2.5 सीधे फेफड़ों की सबसे भीतरी कोशिकाओं में जमा होता है।',
      };
    }

    if (isVentilation) {
      return {
        answer: isSevere
          ? `वर्तमान ${aqi} AQI पर खिड़कियां और दरवाजे कसकर बंद रखें। खिड़कियों की दरारों पर फोम टेप या गीला तौलिया लगाएं। केवल दोपहर 12 से 2 बजे के बीच थोड़ी देर ही सीमित हवा का आदान-प्रदान करें।`
          : `हवा साफ है (${aqi} AQI)। सुबह और दोपहर में सभी खिड़कियां खोलकर कमरों की हवा पूरी तरह बदलें।`,
        keyActionItem: 'खिड़कियों को फोम टेप से सील रखें और रात में एग्जॉस्ट फैन बंद रखें।',
        severityAdvisory: 'इनडोर घुसपैठ: अनसील खिड़कियों से 55% बाहरी जहरीला धुआं सीधे कमरे में घुस जाता है।',
      };
    }

    if (isCooking) {
      return {
        answer: `रसोई में गैस चूल्हे और तेल में तलने से इनडोर PM2.5 150-200 µg/m³ तक बढ़ जाता है। खाना बनाते समय एग्जॉस्ट फैन हमेशा चलाएं और रसोई का दरवाजा बाकी घर से बंद रखें। अगरबत्ती और धूपबत्ती बिल्कुल न जलाएं।`,
        keyActionItem: 'खाना बनाते समय रसोई का दरवाजा बंद रखें और एग्जॉस्ट फैन चालू रखें; अगरबत्ती से बचें।',
        severityAdvisory: 'घरेलू स्रोत: 1 अगरबत्ती 4 सिगरेट के बराबर जहरीला धुआं छोड़ती है।',
      };
    }

    if (isCommute) {
      return {
        answer: isSevere
          ? `सफर के दौरान: कार में बैठते ही एसी को 'रीसर्कुलेट मोड' (Recirculate / अंदर की हवा) पर रखें। दोपहिया वाहन या ऑटो की जगह दिल्ली मेट्रो या बंद बस से यात्रा करें। बाहर N95 मास्क अनिवार्य रखें।`
          : `वर्तमान ${aqi} AQI पर सामान्य यात्रा कर सकते हैं। कारपूलिंग और सार्वजनिक परिवहन को प्राथमिकता दें।`,
        keyActionItem: 'कार एसी को रीसर्कुलेशन मोड पर रखें; दोपहिया चालक अनिवार्य रूप से N95 मास्क पहनें।',
        severityAdvisory: 'सड़क प्रदूषण: मुख्य सड़कों पर ट्रैफिक धुएं के कारण PM2.5 स्तर 30-40% अधिक होता है।',
      };
    }

    if (isPlants) {
      return {
        answer: `स्नेक प्लांट, मनी प्लांट और एरेका पाम जैसे इनडोर पौधे ऑक्सीजन और नमी संतुलित करते हैं। हालांकि, वे भारी PM2.5 धुएं को अकेले नहीं हटा सकते। इन्हें HEPA प्यूरीफायर और गीले पोछे के साथ सहायक रूप में रखें।`,
        keyActionItem: 'कमरे में 2-3 स्नेक प्लांट लगाएं और उनकी पत्तियों को गीले कपड़े से हफ्ते में एक बार साफ करें।',
        severityAdvisory: 'प्राकृतिक उपाय: पौधे इनडोर टॉक्सिन्स (VOCs) सोखने में सहायक हैं।',
      };
    }

    if (isPets) {
      return {
        answer: isSevere
          ? `पालतू जानवरों (कुत्तों/बिल्लियों) के फेफड़े भी स्मॉग से प्रभावित होते हैं। ${aqi} AQI पर कुत्तों को केवल 5-10 मिनट के लिए हल्के शौच हेतु बाहर ले जाएं, लंबी सैर या दौड़ न कराएं। बाहर से आने पर उनके पंजे पोंछें।`
          : `वायु स्तर सुरक्षित है (${aqi} AQI)। पालतू जानवरों को पार्क में टहलाया जा सकता है।`,
        keyActionItem: 'पालतू जानवरों की बाहरी सैर को 5 मिनट तक सीमित रखें और घर में ब्रश करें।',
        severityAdvisory: 'पशु स्वास्थ्य: छोटे कुत्तों में स्मॉग से फेफड़ों का संक्रमण तेजी से फैलता है।',
      };
    }

    if (isCleaning) {
      return {
        answer: `स्मॉग के दौरान कभी भी सूखा झाड़ू न लगाएं। सूखा झाड़ू फर्श पर बैठी धूल और PM2.5 को दोबारा हवा में उड़ा देता है। हमेशा पानी में थोड़ा नमक या डिसइंफेक्टेंट डालकर गीला पोछा लगाएं।`,
        keyActionItem: 'सूखा झाड़ू बंद करें; दिन में दो बार गीले कपड़े से पोछा लगाएं।',
        severityAdvisory: 'धूल नियंत्रण: गीला पोछा लगाने से इनडोर हवा में तुरंत 20-25% कण कम हो जाते हैं।',
      };
    }

    if (isAQI) {
      return {
        answer: `वर्तमान में आपका क्षेत्र ${aqi} AQI (PM2.5: ${pm25} µg/m³) पर है। 0-50 अच्छा, 51-100 मध्यम, 101-200 अस्वस्थ, 201-300 अत्यंत अस्वस्थ और 300+ गंभीर/खतरनाक माना जाता है। ${isSevere ? 'यह स्तर स्वास्थ्य आपातकाल की श्रेणी में है।' : 'यह स्तर सामान्य नियंत्रण में है।'}`,
        keyActionItem: isSevere ? 'घर से बाहर निकलना न्यूनतम करें और मास्क पहनें।' : 'दैनिक गतिविधियों को सामान्य रखें।',
        severityAdvisory: 'पैमाना जानकारी: CPCB मानक के अनुसार PM2.5 का सुरक्षित 24-घंटे स्तर 60 µg/m³ है।',
      };
    }

    // Dynamic grounded fallback in Hindi
    return {
      answer: isSevere
        ? `वर्तमान में आपका क्षेत्र ${aqi} AQI (PM2.5: ${pm25} µg/m³) के गंभीर स्मॉग स्तर पर है। आपके सवाल के संदर्भ में मुख्य सलाह यह है कि बाहरी जहरीले धुएं से अधिकतम दूरी बनाएं। खिड़कियां सील रखें, बाहर जाते समय N95 मास्क पहनें, फर्श पर गीला पोछा लगाएं और बच्चों व बुजुर्गों को घर में सुरक्षित रखें।`
        : `वर्तमान में आपका क्षेत्र ${aqi} AQI (PM2.5: ${pm25} µg/m³) पर है। स्थिति संतोषजनक है। दोपहर के समय खिड़कियां खोलकर वेंटिलेशन करें और सामान्य दैनिक कार्य बिना मास्क के किए जा सकते हैं।`,
      keyActionItem: isSevere
        ? 'कमरे सील रखें, गीला पोछा लगाएं और N95 मास्क के बिना बाहर न निकलें।'
        : 'दोपहर में कमरों की हवा बदलें और सामान्य दिनचर्या जारी रखें।',
      severityAdvisory: isSevere
        ? 'गंभीर स्मॉग अलर्ट: सभी आयु वर्ग के नागरिकों को एहतियात बरतनी चाहिए।'
        : 'सामान्य पर्यावरणीय स्थिति।',
    };
  }

  // ENGLISH RESPONSES
  if (isMask) {
    return {
      answer: isSevere
        ? `At ${aqi} US AQI, standard cloth or surgical masks are ineffective against microscopic PM2.5 particles. Wear a NIOSH-certified N95, KN95, or FFP2 respirator. Ensure an airtight seal around the nose bridge and chin with zero leakage.`
        : `Current air quality is ${aqi} US AQI. Standard cloth masks or normal precautions are sufficient unless commuting along heavy-traffic truck corridors.`,
      keyActionItem: 'Use certified N95 respirators with a snug fit; cloth bandanas do not filter fine PM2.5.',
      severityAdvisory: 'Filter Efficiency: Certified N95 media blocks >= 95% of inhaled fine particulates.',
    };
  }

  if (isPurifier) {
    return {
      answer: isSevere
        ? `With outdoor AQI at ${aqi}, keep true HEPA purifiers running continuously 24/7 on medium or auto speed in closed bedrooms. Position the unit at least 1-2 feet away from walls in the center of living spaces to maximize airflow circulation.`
        : `At ${aqi} AQI, run your air purifier on low/eco mode or open windows during midday ventilation hours to conserve electricity.`,
      keyActionItem: 'Run HEPA filters 24/7 in closed bedrooms; vacuum the outer pre-filter every 2 weeks.',
      severityAdvisory: 'Clean Air Delivery: A properly sized HEPA unit clears 70-85% of indoor PM2.5 within 30 minutes.',
    };
  }

  if (isSchool) {
    return {
      answer: isSevere
        ? `Air quality is ${aqi} US AQI (${pm25} µg/m³ PM2.5), in the Severe Smog category. Schools must immediately suspend outdoor morning assemblies, sports practices, and recess drills. Shift all student activities inside closed classrooms.`
        : `Air quality is satisfactory (${aqi} US AQI). Schools can safely hold normal outdoor morning assemblies and physical education drills.`,
      keyActionItem: isSevere
        ? 'Cancel outdoor sports assemblies; keep students inside sealed classrooms.'
        : 'Safe to proceed with normal outdoor school curriculum.',
      severityAdvisory: 'Pediatric Health: Children inhale greater air volume per kilogram of body weight than adults.',
    };
  }

  if (isInfant) {
    return {
      answer: isSevere
        ? `Infants and toddlers have delicate, developing alveoli. At ${aqi} AQI, keep infants strictly indoors in draft-sealed rooms. Avoid dry sweeping or incense, run filtration, and do not take baby out in strollers during early mornings.`
        : `Current reading (${aqi} AQI) is safe for normal infant routines. Short outdoor stroller walks in shaded parks during midday (12:00 - 15:00) are acceptable.`,
      keyActionItem: 'Keep baby in a sealed room with active filtration; avoid incense or frying smoke.',
      severityAdvisory: 'High Vulnerability: Developing infant lungs deposit double the particulate dose of adult lungs.',
    };
  }

  if (isElderly) {
    return {
      answer: isSevere
        ? `For elderly family members and those with cardiovascular conditions, outdoor morning walks at ${aqi} AQI are extremely dangerous. Cold smog spikes blood pressure and triggers cardiac strain. Restrict exercise to gentle indoor walking.`
        : `Air quality is moderate (${aqi} AQI). Seniors can enjoy outdoor walks after midday when solar heating has dispersed ground-level haze.`,
      keyActionItem: 'Cancel elderly morning walks between 06:00 and 09:00; monitor blood pressure regularly.',
      severityAdvisory: 'Cardiovascular Risk: Fine particulates translocate into the bloodstream, elevating thrombotic risk.',
    };
  }

  if (isHealth) {
    return {
      answer: isSevere
        ? `Severe smog (${aqi} AQI) commonly causes burning eyes, dry throat scratching, and asthma exacerbations. Rinse eyes with clean cool water, gargle with warm saline, and keep fast-acting bronchodilator inhalers close at hand.`
        : `At ${aqi} AQI, symptoms should remain mild for most individuals. Stay well-hydrated to keep mucous membranes moist.`,
      keyActionItem: 'Keep asthma inhalers within reach; rinse eyes and gargle with warm water twice daily.',
      severityAdvisory: 'Non-Clinical Guidance: Seek immediate professional medical care if experiencing chest tightness or acute shortness of breath.',
    };
  }

  if (isExercise) {
    return {
      answer: isSevere
        ? `Strict warning: Do not run, jog, or cycle outdoors at ${aqi} AQI. Strenuous cardiovascular exercise increases respiration 5-fold, drawing deep particulate matter directly into lung tissue. Substitute with indoor yoga or strength work.`
        : `Air quality is favorable (${aqi} AQI). Outdoor walking, jogging, and cycling are safe and beneficial, particularly in the afternoon.`,
      keyActionItem: 'Cancel outdoor morning exercise; exercise strictly indoors in filtered rooms.',
      severityAdvisory: 'Exercise Risk: Deep aerobic mouth-breathing bypasses natural nasal filtration mechanisms.',
    };
  }

  if (isVentilation) {
    return {
      answer: isSevere
        ? `Keep windows and external balcony doors sealed tightly at ${aqi} AQI. Apply inexpensive foam draft tape to window gaps. Only open windows for a brief 15-minute flush during peak solar hours (12:00 - 14:00) if indoor CO2 feels stuffy.`
        : `Air is clean (${aqi} AQI). Open opposite windows for cross-ventilation to flush out indoor pollutants and odors.`,
      keyActionItem: 'Draft-seal window perimeters with weather-strip tape; keep kitchen exhaust running.',
      severityAdvisory: 'Envelope Infiltration: Up to 55% of outdoor ambient PM2.5 penetrates unsealed window gaps.',
    };
  }

  if (isCooking) {
    return {
      answer: `Indoor cooking smoke and gas burner combustion can spike room PM2.5 above 180 µg/m³. Always switch on kitchen exhaust fans before lighting stoves, keep kitchen doors closed, and avoid deep-frying or burning incense/dhoop during smog peaks.`,
      keyActionItem: 'Run the kitchen exhaust fan before cooking and keep the kitchen door closed from living rooms.',
      severityAdvisory: 'Internal Emissions: One incense stick produces particulate emissions equivalent to 4 cigarettes.',
    };
  }

  if (isCommute) {
    return {
      answer: isSevere
        ? `While commuting: Set car air conditioning strictly to 'Recirculate / Internal Air' mode. Switch from two-wheelers to the Metro or air-conditioned buses. If riding a scooter or walking, wearing a sealed N95 respirator is mandatory.`
        : `Normal commute routines are safe at ${aqi} AQI. Public transit and carpooling remain the best sustainable choices.`,
      keyActionItem: 'Set car AC to recirculate; motorized two-wheeler commuters must wear an N95 mask.',
      severityAdvisory: 'Transit Exposure: In-cabin PM2.5 drops by 70% when vehicle AC recirculation is switched on.',
    };
  }

  if (isPlants) {
    return {
      answer: `Indoor plants such as Snake Plants (Sansevieria), Areca Palms, and Spider Plants help regulate indoor humidity and absorb volatile compounds (VOCs). However, they cannot filter dense PM2.5 smog; pair them with a HEPA purifier and damp mopping.`,
      keyActionItem: 'Place 2-3 snake plants in bedrooms and wipe their leaves with a damp cloth weekly.',
      severityAdvisory: 'Natural Bio-Filtration: Plants complement mechanical filtration but cannot replace HEPA purifiers.',
    };
  }

  if (isPets) {
    return {
      answer: isSevere
        ? `Pets are vulnerable to smog inhalation. At ${aqi} AQI, shorten dog walks to 5-minute bathroom breaks only. Avoid intense outdoor fetch or running, and wipe their paws and coats with a damp cloth when returning indoors.`
        : `Air quality is safe (${aqi} AQI). Normal dog walking and park playtime can proceed safely.`,
      keyActionItem: 'Limit dog walks to short 5-minute relief breaks; avoid outdoor exertion.',
      severityAdvisory: 'Animal Health: Small domestic pets inhale air close to street-level particulate settling zones.',
    };
  }

  if (isCleaning) {
    return {
      answer: `Never dry sweep during winter smog. Dry brooms kick settled fine PM2.5 back into breathing zones for hours. Always damp-mop floors with water and mild floor cleaner to trap particulates permanently.`,
      keyActionItem: 'Discontinue dry brooming; damp-mop all hard floors twice daily.',
      severityAdvisory: 'Resuspension: Dry sweeping increases indoor floating particulate concentration by over 40%.',
    };
  }

  if (isAQI) {
    return {
      answer: `Your location is currently at ${aqi} US AQI with PM2.5 concentration of ${pm25} µg/m³. The EPA AQI scale: 0-50 Good, 51-100 Moderate, 101-150 Sensitive, 151-200 Unhealthy, 201-300 Very Unhealthy, 300+ Hazardous. ${isSevere ? 'Your area is in emergency territory.' : 'Your area is within acceptable limits.'}`,
      keyActionItem: isSevere ? 'Minimize outdoor exposure and run indoor filtration.' : 'Continue daily routines normally.',
      severityAdvisory: 'NAAQS Standard: CPCB safe 24-hr threshold for PM2.5 is 60 µg/m³; WHO guideline is 15 µg/m³.',
    };
  }

  // Dynamic grounded fallback in English
  return {
    answer: isSevere
      ? `Your location is currently experiencing Severe Smog at ${aqi} US AQI (${pm25} µg/m³ PM2.5). Addressing your question: the primary protective strategy is minimizing particulate dose. Stay inside sealed building envelopes, run air purifiers, damp-mop hard floors, and wear a certified N95 respirator if stepping outside.`
      : `Your location is currently at ${aqi} US AQI (${pm25} µg/m³ PM2.5), which is in the acceptable range. General daily activities, ventilation, and outdoor recreation can proceed with standard health awareness.`,
    keyActionItem: isSevere
      ? 'Seal room gaps, use continuous filtration, and wear an N95 respirator outside.'
      : 'Open windows for midday ventilation and continue daily routines.',
    severityAdvisory: isSevere
      ? 'Severe Smog Advisory: Take proactive indoor protective measures across all age groups.'
      : 'Satisfactory Air Quality: Ambient levels support normal outdoor activities.',
  };
}
