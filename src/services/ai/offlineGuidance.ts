import { AIRecommendationsOutput, RecommendationRequestInput } from '@/lib/schemas/aiRequestSchema';

export function getOfflineGuidance(input: RecommendationRequestInput): AIRecommendationsOutput {
  const isHindi = input.language === 'hi';
  const isCleanAir = input.aqi <= 100;

  if (isCleanAir) {
    // Clean / Moderate Air Recommendations
    if (isHindi) {
      return {
        dailyRoutines: [
          {
            timeBlock: input.ventilationWindow || '11:00 - 15:00',
            action: 'घर की सभी खिड़कियां खोलें और प्राकृतिक ताजी हवा अंदर आने दें।',
            rationale: 'हवा साफ है; घर के अंदर जमा CO2 और गंध को बाहर निकालने का सबसे अच्छा समय।',
            maskGuidance: 'हवा साफ है, बाहर मास्क की कोई आवश्यकता नहीं है।',
            indoorPm25ReductionPct: 20,
            weeklyEmissionsAvoidedG: 0,
          },
          {
            timeBlock: '16:00 - 18:30',
            action: 'बच्चों और बुजुर्गों के साथ पार्क में टहलने और बाहरी खेलकूद का आनंद लें।',
            rationale: 'सुरक्षित वायु गुणवत्ता के दौरान व्यायाम से फेफड़े स्वस्थ रहते हैं।',
            maskGuidance: 'मास्क की आवश्यकता नहीं।',
            indoorPm25ReductionPct: 0,
            weeklyEmissionsAvoidedG: 0,
          },
          {
            timeBlock: '20:00 - 22:00',
            action: 'एयर प्यूरीफायर को इको (Eco/Low) मोड पर रखें या बंद करके बिजली बचाएं।',
            rationale: 'बाहरी हवा स्वच्छ होने से अतिरिक्त ऊर्जा खर्च करने की जरूरत नहीं है।',
            maskGuidance: 'घर के अंदर सामान्य रहें।',
            indoorPm25ReductionPct: 0,
            weeklyEmissionsAvoidedG: 450,
          },
        ],
        iaqHacks: [
          {
            tier: 'tier_0_free',
            title: 'क्रॉस-वेंटिलेशन (आमने-सामने की खिड़कियां)',
            costEstimate: '₹0 (बिल्कुल मुफ्त)',
            actionSteps: 'विपरीत दिशाओं की खिड़कियां खोलकर प्राकृतिक हवा का प्रवाह बनाएं।',
            whyThisMatters: 'कमरे में ताजगी बढ़ती है और इनडोर प्रदूषक बाहर निकल जाते हैं।',
            indoorPm25ReductionPct: 25,
            weeklyEmissionsAvoidedG: 0,
          },
          {
            tier: 'tier_1_budget',
            title: 'नेचुरल एयर-प्यूरीफाइंग पौधे (स्नेक प्लांट, मनी प्लांट)',
            costEstimate: '~₹300 - ₹500',
            actionSteps: 'कमरे में 2-3 इनडोर पौधे रखें जो ऑक्सीजन और नमी संतुलित रखें।',
            whyThisMatters: 'बिना बिजली खर्च किए प्राकृतिक रूप से इनडोर ताजगी बनी रहती है।',
            indoorPm25ReductionPct: 10,
            weeklyEmissionsAvoidedG: 0,
          },
          {
            tier: 'tier_2_purifier',
            title: 'प्यूरीफायर फिल्टर की धूप में सफाई व प्री-फिल्टर वैक्यूम',
            costEstimate: '₹0',
            actionSteps: 'फिल्टर को साफ करके धूप में रखें ताकि स्मॉग सीजन के लिए तैयार रहे।',
            whyThisMatters: 'साफ फिल्टर हवा को कम बिजली में ज्यादा प्रभावी तरीके से साफ करता है।',
            indoorPm25ReductionPct: 15,
            weeklyEmissionsAvoidedG: 200,
          },
        ],
        sustainableAlternatives: [
          {
            category: 'transport',
            title: 'साइकिल या पैदल आवागमन',
            action: 'आस-पास के छोटे कामों के लिए पेट्रोल स्कूटर की जगह साइकिल या पैदल जाएं।',
            whyThisMatters: 'शून्य प्रदूषण और स्वास्थ्य में सुधार; प्रति सप्ताह लगभग 800 ग्राम CO2 की बचत।',
            indoorPm25ReductionPct: 0,
            weeklyEmissionsAvoidedG: 800,
          },
          {
            category: 'community',
            title: 'पार्क एवं सोसाइटी में पेड़-पौधों की देखभाल',
            action: 'RWA के साथ मिलकर बालकनी व सोसाइटी में हरियाली बढ़ाएं।',
            whyThisMatters: 'हरियाली आने वाले सर्दियों के स्मॉग को सोखने में प्राकृतिक ढाल बनती है।',
            indoorPm25ReductionPct: 5,
            weeklyEmissionsAvoidedG: 1200,
          },
          {
            category: 'cooking',
            title: 'सोलर या इंडक्शन कुकिंग को बढ़ावा',
            action: 'गैस सिलेंडर के बजाय धूप में सोलर कुकर या इंडक्शन का अधिकतम उपयोग करें।',
            whyThisMatters: 'रसोई में गैस का धुआं नहीं बनता और ऊर्जा की बचत होती है।',
            indoorPm25ReductionPct: 10,
            weeklyEmissionsAvoidedG: 1500,
          },
        ],
      };
    }

    // English Clean Air Guidance
    return {
      dailyRoutines: [
        {
          timeBlock: input.ventilationWindow || '11:00 - 15:00',
          action: 'Open all windows for active cross-ventilation to flush trapped indoor air.',
          rationale: 'Atmospheric air is clean; prime opportunity to purge indoor VOCs and stale CO2.',
          maskGuidance: 'No mask required in clean air conditions.',
          indoorPm25ReductionPct: 20,
          weeklyEmissionsAvoidedG: 0,
        },
        {
          timeBlock: '16:00 - 18:30',
          action: 'Encourage outdoor playtime for children and brisk walking for elders in local parks.',
          rationale: 'Clean air exercise strengthens cardiovascular resilience before winter smog peaks.',
          maskGuidance: 'No mask needed.',
          indoorPm25ReductionPct: 0,
          weeklyEmissionsAvoidedG: 0,
        },
        {
          timeBlock: '20:00 - 22:00',
          action: 'Switch air purifiers to Eco / Sleep mode to conserve energy.',
          rationale: 'Low ambient particulate load allows filtration fans to throttle down, saving power.',
          maskGuidance: 'Standard indoor living.',
          indoorPm25ReductionPct: 0,
          weeklyEmissionsAvoidedG: 450,
        },
      ],
      iaqHacks: [
        {
          tier: 'tier_0_free',
          title: 'Daylight Cross-Ventilation Strategy',
          costEstimate: '$0 (Zero cost)',
          actionSteps: 'Crack windows on opposite building faces for 30 minutes to create natural convection currents.',
          whyThisMatters: 'Naturally balances indoor humidity and expels accumulated indoor carbon dioxide.',
          indoorPm25ReductionPct: 25,
          weeklyEmissionsAvoidedG: 0,
        },
        {
          tier: 'tier_1_budget',
          title: 'Indoor Bio-Filtering Houseplants (Snake Plant, Areca)',
          costEstimate: '~₹400 / $5',
          actionSteps: 'Place potted plants in living rooms and study areas.',
          whyThisMatters: 'Assists in natural room oxygenation and VOC absorption without energy footprint.',
          indoorPm25ReductionPct: 10,
          weeklyEmissionsAvoidedG: 0,
        },
        {
          tier: 'tier_2_purifier',
          title: 'HEPA Pre-Filter Vacuum & Maintenance',
          costEstimate: '$0',
          actionSteps: 'Gently vacuum the mesh pre-filter to prepare for high-smog episodes.',
          whyThisMatters: 'Restores airflow efficiency, reducing purifier power consumption by ~15%.',
          indoorPm25ReductionPct: 15,
          weeklyEmissionsAvoidedG: 200,
        },
      ],
      sustainableAlternatives: [
        {
          category: 'transport',
          title: 'Active Commute: Bicycle & Pedestrian Transit',
          action: 'Swap short two-wheeler grocery trips with cycling or walking.',
          whyThisMatters: 'Zero tailpipe emissions and personal cardiovascular conditioning; saves ~800g CO2 weekly.',
          indoorPm25ReductionPct: 0,
          weeklyEmissionsAvoidedG: 800,
        },
        {
          category: 'community',
          title: 'RWA Green Cover & Tree Canopy Stewardship',
          action: 'Collaborate with resident associations to plant native dust-trapping neem and peepal saplings.',
          whyThisMatters: 'Builds permanent biological barriers against winter particulate suspension.',
          indoorPm25ReductionPct: 5,
          weeklyEmissionsAvoidedG: 1200,
        },
        {
          category: 'cooking',
          title: 'Electric Induction Cooking Transition',
          action: 'Shift everyday boiling and light cooking to clean induction cooktops.',
          whyThisMatters: 'Eliminates open methane flame combustion emissions inside living quarters.',
          indoorPm25ReductionPct: 10,
          weeklyEmissionsAvoidedG: 1500,
        },
      ],
    };
  }

  // Severe Smog / Inversion Guidance
  if (isHindi) {
    return {
      dailyRoutines: [
        {
          timeBlock: input.peakSmogWindow || '06:00 - 09:30',
          action: 'खिड़कियां पूरी तरह बंद रखें। सुबह की सैर और बाहरी व्यायाम बिल्कुल न करें।',
          rationale: 'तापमान उलटाव (thermal inversion) के कारण जहरीला धुआं जमीन पर जमा रहता है।',
          maskGuidance: 'यदि बाहर निकलना अनिवार्य हो तो केवल N95/N99 मास्क का उपयोग करें।',
          indoorPm25ReductionPct: 25,
          weeklyEmissionsAvoidedG: 0,
        },
        {
          timeBlock: input.ventilationWindow || '13:00 - 15:30',
          action: 'धूप निकलने पर 15-20 मिनट के लिए हल्की खिड़की खोलकर कमरों की बासी हवा बदलें।',
          rationale: 'दोपहर में धूप से धुआं ऊपर उठता है; हवा बदलने के लिए यह सबसे सुरक्षित समय है।',
          maskGuidance: 'खिड़की के पास खड़े रहने पर सामान्य मास्क पहनें।',
          indoorPm25ReductionPct: 15,
          weeklyEmissionsAvoidedG: 0,
        },
        {
          timeBlock: '18:00 - 21:30',
          action: 'कार में एसी रीसर्क्युलेट (Recirculate) मोड चालू रखें। दोपहिया वाहन पर N95 टाइट बांधें।',
          rationale: 'शाम के ट्रैफिक और ठंड से सड़क पर धुआं और रासायनिक गैसें चरम पर होती हैं।',
          maskGuidance: 'दोपहिया और बस यात्रियों के लिए टाइट N95 अनिवार्य है।',
          indoorPm25ReductionPct: 10,
          weeklyEmissionsAvoidedG: 500,
        },
      ],
      iaqHacks: [
        {
          tier: 'tier_0_free',
          title: 'गीला पोछा (सूखी झाड़ू पर सख्त पाबंदी)',
          costEstimate: '₹0 (मुफ्त)',
          actionSteps: 'झाड़ू लगाने से जमीन पर बैठी सूक्ष्म धूल दोबारा सांस में मिल जाती है। दिन में दो बार गीले कपड़े से पोछा लगाएं।',
          whyThisMatters: 'कमरे में PM10 और PM2.5 को हवा में उड़ने से तुरंत रोकता है।',
          indoorPm25ReductionPct: 20,
          weeklyEmissionsAvoidedG: 0,
        },
        {
          tier: 'tier_1_budget',
          title: 'DIY कोर्सी-रोजेंथल फिल्टर बॉक्स (सस्ता घरेलू प्यूरीफायर)',
          costEstimate: '~₹1,800',
          actionSteps: '4 MERV-13 फिल्टरों को 20" बॉक्स पंखे के चारों ओर डक्ट टेप से जोड़कर airtight बॉक्स बनाएं।',
          whyThisMatters: 'महंगे प्यूरीफायर (₹15,000+) के बराबर कमरे की 70% हवा को साफ करता है।',
          indoorPm25ReductionPct: 65,
          weeklyEmissionsAvoidedG: 0,
        },
        {
          tier: 'tier_2_purifier',
          title: 'खिड़कियों और दरवाजों की फोम टेप से ड्राफ्ट सीलिंग',
          costEstimate: '~₹350',
          actionSteps: 'दरवाजे की चौखट और बालकनी की खिड़कियों की दरारों में सेल्फ-एडहेसिव वेदर-स्ट्रिप लगाएं।',
          whyThisMatters: 'बाहरी जहरीले स्मॉग की 20-25% इनडोर घुसपैठ को सीधे रोकता है।',
          indoorPm25ReductionPct: 25,
          weeklyEmissionsAvoidedG: 0,
        },
      ],
      sustainableAlternatives: [
        {
          category: 'transport',
          title: 'मेट्रो / कारपूलिंग (अकेले दोपहिया वाहन का विकल्प)',
          action: 'सड़कों पर ट्रैफिक धुएं के बीच अकेले स्कूटर चलाने के बजाय मेट्रो या इलेक्ट्रिक बस चुनें।',
          whyThisMatters: 'सीधे एग्जॉस्ट गैसों से बचाव; प्रति सप्ताह लगभग 2.1 किग्रा CO2 की कमी।',
          indoorPm25ReductionPct: 0,
          weeklyEmissionsAvoidedG: 2100,
        },
        {
          category: 'community',
          title: 'आरडब्ल्यूए (RWA) कचरा व पत्ती जलाने पर रोक दस्ता',
          action: 'सोसाइटी में सूखे पत्ते या कचरा जलाने वालों को रोकें और नजदीकी कम्पोस्टिंग गड्ढे में डालें।',
          whyThisMatters: '1 टन कचरा जलने से बचने पर 65 किग्रा जहरीला PM2.5 हवा में घुलने से रुकता है।',
          indoorPm25ReductionPct: 15,
          weeklyEmissionsAvoidedG: 3200,
        },
        {
          category: 'heating',
          title: 'इलेक्ट्रिक रेडिएंट हीटर (कोयले/अंगीठी की जगह)',
          action: 'कमरे में कोयले या लकड़ी की अंगीठी न जलाएं; इसके बजाय इलेक्ट्रिक हीटर या भारी पर्दे लगाएं।',
          whyThisMatters: 'कमरे में जानलेवा कार्बन मोनोऑक्साइड और जहरीले धुएं से पूर्ण सुरक्षा।',
          indoorPm25ReductionPct: 35,
          weeklyEmissionsAvoidedG: 4500,
        },
      ],
    };
  }

  // English Severe Smog Guidance
  return {
    dailyRoutines: [
      {
        timeBlock: input.peakSmogWindow || '06:00 - 09:30',
        action: 'Seal all balcony doors. Cancel outdoor morning jogs, cycling, and school sports assemblies.',
        rationale: 'Thermal inversion traps dense industrial and vehicular smoke in the surface boundary layer.',
        maskGuidance: 'Strictly wear a fitted N95 respirator if outdoor transit is unavoidable.',
        indoorPm25ReductionPct: 25,
        weeklyEmissionsAvoidedG: 0,
      },
      {
        timeBlock: input.ventilationWindow || '13:00 - 15:30',
        action: 'Crack high windows for 15-20 mins during solar heating for safe room air turnover.',
        rationale: 'Maximum thermal boundary layer mixing occurs in the early afternoon, reducing local concentration.',
        maskGuidance: 'Wear light mask if standing directly by open street-facing windows.',
        indoorPm25ReductionPct: 15,
        weeklyEmissionsAvoidedG: 0,
      },
      {
        timeBlock: '18:00 - 21:30',
        action: 'Switch automobile air conditioning to internal recirculate. Run indoor filters continuously.',
        rationale: 'Evening rush-hour traffic emissions re-accumulate as surface air cools rapidly.',
        maskGuidance: 'Mandatory N95 for scooter, auto-rickshaw, and pedestrian commuters.',
        indoorPm25ReductionPct: 10,
        weeklyEmissionsAvoidedG: 500,
      },
    ],
    iaqHacks: [
      {
        tier: 'tier_0_free',
        title: 'Damp Mopping Protocol (Zero Dry Sweeping)',
        costEstimate: '$0 (Completely Free)',
        actionSteps: 'Wet mop floors twice daily with microfiber cloth. Strictly prohibit dry brooms which kick up settled particulate matter.',
        whyThisMatters: 'Prevents settled coarse and fine dust resuspension into the breathing zone.',
        indoorPm25ReductionPct: 20,
        weeklyEmissionsAvoidedG: 0,
      },
      {
        tier: 'tier_1_budget',
        title: 'DIY Corsi-Rosenthal Filter Box',
        costEstimate: '~₹1,800 ($22)',
        actionSteps: 'Build an airtight cube with 4 MERV-13 pleated filters taped to a 20" domestic box fan blowing upwards.',
        whyThisMatters: 'Delivers high clean air delivery rates (~200 CFM CADR), equivalent to commercial HEPA units.',
        indoorPm25ReductionPct: 65,
        weeklyEmissionsAvoidedG: 0,
      },
      {
        tier: 'tier_2_purifier',
        title: 'Door & Balcony Window Weather-Stripping',
        costEstimate: '~₹350 ($4)',
        actionSteps: 'Apply self-adhesive EPDM rubber foam tape along window sashes and balcony exterior door bottoms.',
        whyThisMatters: 'Reduces outdoor toxic smoke infiltration through architectural gaps by ~25%.',
        indoorPm25ReductionPct: 25,
        weeklyEmissionsAvoidedG: 0,
      },
    ],
    sustainableAlternatives: [
      {
        category: 'transport',
        title: 'Rapid Metro / Electric Transit Shift',
        action: 'Replace open two-wheeler commuting with air-filtered Delhi Metro or electric bus routing.',
        whyThisMatters: 'Avoids direct toxic street canyon breathing; saves ~2.1 kg CO2 weekly per commuter.',
        indoorPm25ReductionPct: 0,
        weeklyEmissionsAvoidedG: 2100,
      },
      {
        category: 'community',
        title: 'RWA Horticultural Leaf-Burning Ban & Composting',
        action: 'Organize leaf-collection bags and community composting pits instead of municipal waste incineration.',
        whyThisMatters: 'Prevents high-potency dioxin and particulate emissions directly at neighborhood scale.',
        indoorPm25ReductionPct: 15,
        weeklyEmissionsAvoidedG: 3200,
      },
      {
        category: 'heating',
        title: 'Electric Radiant Heating Swap (No Biomass Angeethi)',
        action: 'Replace smoky open-flame wood or coal braziers with radiant electric space heaters or insulated curtains.',
        whyThisMatters: 'Eliminates deadly indoor carbon monoxide risks and heavy black carbon emissions; saves ~4.5 kg CO2 weekly.',
        indoorPm25ReductionPct: 35,
        weeklyEmissionsAvoidedG: 4500,
      },
    ],
  };
}
