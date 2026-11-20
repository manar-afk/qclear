import { AskRequestInput, AskResponseOutput } from '@/lib/schemas/askSchema';

/**
 * High-quality grounded offline situational advisory when Vertex AI is unreachable.
 * Rules are dynamically conditioned on the active live AQI band and the question topic.
 */
export function getOfflineAnswer(input: AskRequestInput): AskResponseOutput {
  const isHindi = input.language === 'hi';
  const isSimple = input.simpleLanguage;
  const qLower = input.question.toLowerCase();
  const aqi = input.aqi;
  const pm25 = input.pm2_5;
  const isSevere = aqi > 200;
  const isClean = aqi <= 100;

  // Topic detection
  const isSchoolOrAssembly = qLower.includes('school') || qLower.includes('assembly') || qLower.includes('स्कूल') || qLower.includes('प्रार्थना');
  const isInfantOrBaby = qLower.includes('infant') || qLower.includes('baby') || qLower.includes('toddler') || qLower.includes('बच्चा') || qLower.includes('शिशु');
  const isExerciseOrWalk = qLower.includes('walk') || qLower.includes('jog') || qLower.includes('exercise') || qLower.includes('टहल') || qLower.includes('व्यायाम');
  const isVentilation = qLower.includes('window') || qLower.includes('ventilate') || qLower.includes('खिड़की') || qLower.includes('हवा');

  if (isHindi) {
    if (isSchoolOrAssembly) {
      if (isSevere) {
        return {
          answer: `वर्तमान वायु गुणवत्ता ${aqi} AQI (PM2.5: ${pm25} µg/m³) है, जो गंभीर श्रेणी में है। स्कूलों को बाहरी प्रार्थना सभाएं और खेलकूद तुरंत रद्द कर देना चाहिए। छात्रों को इनडोर कक्षाओं में रखें।`,
          keyActionItem: 'बाहरी सभाएं तुरंत रद्द करें और सभी गतिविधियां बंद कमरों में शिफ्ट करें।',
          severityAdvisory: 'गंभीर स्मॉग चेतावनी: बच्चों के फेफड़ों पर बाहरी जहरीले धुएं का सीधा दुष्प्रभाव पड़ता है।',
        };
      } else if (isClean) {
        return {
          answer: `वायु गुणवत्ता ${aqi} AQI (संतोषजनक) है। स्कूल सुरक्षित रूप से बाहरी खेलकूद और सुबह की प्रार्थना सभा आयोजित कर सकते हैं।`,
          keyActionItem: 'बाहरी गतिविधियों का सुरक्षित आयोजन करें।',
          severityAdvisory: 'सुरक्षित वायु: बच्चों के शारीरिक स्वास्थ्य के लिए खेलकूद प्रोत्साहित करें।',
        };
      } else {
        return {
          answer: `वर्तमान में वायु गुणवत्ता ${aqi} AQI (मध्यम से अस्वस्थ) है। बाहरी गतिविधियों को 20-30 मिनट तक सीमित रखें और अस्थमा पीड़ित बच्चों को भारी दौड़-भाग से बचाएं।`,
          keyActionItem: 'सभा की अवधि छोटी रखें और संवेदनशील छात्रों को छूट दें।',
          severityAdvisory: 'मध्यम सावधानी: संवेदनशील विद्यार्थियों पर नजर रखें।',
        };
      }
    }

    if (isInfantOrBaby) {
      if (isSevere) {
        return {
          answer: `शिशुओं और 2 साल से छोटे बच्चों के फेफड़े बहुत नाजुक होते हैं। ${aqi} AQI पर बच्चे को बिल्कुल बाहर न ले जाएं। कमरे की खिड़कियां बंद रखें, गीला पोछा लगाएं और प्यूरीफायर चालू रखें।`,
          keyActionItem: 'शिशु को कमरे के अंदर रखें, खिड़कियों की दरारें सील करें और अगरबत्ती/धूपबत्ती न जलाएं।',
          severityAdvisory: 'अति-संवेदनशील समूह: शिशुओं की सांस की दर वयस्कों से दोगुनी होती है।',
        };
      } else {
        return {
          answer: `वर्तमान ${aqi} AQI पर बच्चे को हल्की धूप में 20-30 मिनट के लिए सुरक्षित रूप से रखा जा सकता है। दोपहर 12 से 3 बजे का समय सबसे अच्छा है।`,
          keyActionItem: 'दोपहर की गुनगुनी धूप में बच्चे को ताजी हवा का लाभ दें।',
          severityAdvisory: 'सामान्य सावधानी रखें।',
        };
      }
    }

    if (isExerciseOrWalk) {
      if (isSevere) {
        return {
          answer: `सख्त मनाही: ${aqi} AQI पर सुबह या शाम की सैर जानलेवा साबित हो सकती है। सुबह के समय जमीन के पास जहरीला धुआं सबसे घना होता है। घर के अंदर ही हल्का योग या स्ट्रेचिंग करें।`,
          keyActionItem: 'बाहरी वॉक रद्द करें; घर के अंदर हल्का व्यायाम करें।',
          severityAdvisory: 'कसरत के दौरान हम 5 गुना ज्यादा हवा अंदर खींचते हैं, जिससे फेफड़ों में भारी धुआं जमा होता है।',
        };
      } else {
        return {
          answer: `वायु गुणवत्ता अनुकूल है (${aqi} AQI)। आप सुरक्षित रूप से सैर और जॉगिंग कर सकते हैं। दोपहर या शाम का समय सबसे उत्तम है।`,
          keyActionItem: 'पार्क में खुलकर सैर का आनंद लें।',
          severityAdvisory: 'स्वस्थ वायु गुणवत्ता।',
        };
      }
    }

    // Default Hindi Grounded Response
    return {
      answer: isSevere
        ? `वर्तमान में आपका क्षेत्र ${aqi} AQI (PM2.5: ${pm25} µg/m³) के गंभीर स्मॉग स्तर पर है। खिड़कियां बंद रखें, बाहर जाते समय N95 मास्क पहनें और घर में गीला पोछा लगाएं।`
        : `वर्तमान में आपका क्षेत्र ${aqi} AQI (PM2.5: ${pm25} µg/m³) पर है। स्थिति नियंत्रण में है। दोपहर के समय खिड़कियां खोलकर कमरों की हवा बदलें।`,
      keyActionItem: isSevere
        ? 'कमरे सील रखें और N95 मास्क के बिना घर से बाहर न निकलें।'
        : 'दोपहर में कमरे की ताजी हवा का आदान-प्रदान सुनिश्चित करें।',
      severityAdvisory: isSevere
        ? 'आपातकालीन स्तर: सभी आयु वर्ग के लोगों को सावधानी बरतनी चाहिए।'
        : 'सामान्य पर्यावरणीय स्थिति।',
    };
  }

  // English Responses
  if (isSchoolOrAssembly) {
    if (isSevere) {
      return {
        answer: `Current atmospheric air quality is ${aqi} US AQI (PM2.5: ${pm25} µg/m³), in the Severe Smog category. Schools should immediately cancel outdoor assemblies, physical education, and sports drills. Move all student activities to closed classrooms.`,
        keyActionItem: 'Cancel outdoor sports assemblies; keep students inside sealed classrooms.',
        severityAdvisory: 'Severe Smog Advisory: Children inhale more particulate matter per kilogram of body weight than adults.',
      };
    } else if (isClean) {
      return {
        answer: `Air quality is satisfactory (${aqi} US AQI). Schools can safely conduct outdoor morning assemblies and physical education drills.`,
        keyActionItem: 'Proceed safely with outdoor school activities.',
        severityAdvisory: 'Clean Air Window: Promotes student cardiovascular fitness.',
      };
    } else {
      return {
        answer: `Air quality is currently ${aqi} US AQI (Moderate/Unhealthy for Sensitive Groups). Limit outdoor assemblies to under 20 minutes and excuse students with asthma or respiratory sensitivities.`,
        keyActionItem: 'Shorten outdoor duration and excuse sensitive students from intense exertion.',
        severityAdvisory: 'Precautionary Status: Monitor air changes throughout the school day.',
      };
    }
  }

  if (isInfantOrBaby) {
    if (isSevere) {
      return {
        answer: `At ${aqi} AQI (PM2.5: ${pm25} µg/m³), infants and toddlers must strictly remain indoors. Keep bedroom windows sealed with foam tape, avoid dry brooming or incense, and run air purifiers continuously on medium fan speed.`,
        keyActionItem: 'Keep baby strictly indoors in a draft-sealed bedroom; run continuous filtration.',
        severityAdvisory: 'High Vulnerability: Developing infant lungs are acutely vulnerable to particulate deposition.',
      };
    } else {
      return {
        answer: `Current reading (${aqi} AQI) is safe for normal infant routines. Short outdoor strolls in shaded parks during midday (12:00 - 15:00) are acceptable.`,
        keyActionItem: 'Safe for moderate outdoor strolls during midday hours.',
        severityAdvisory: 'Standard infant care guidelines apply.',
      };
    }
  }

  if (isExerciseOrWalk) {
    if (isSevere) {
      return {
        answer: `Avoid all outdoor morning jogs and brisk walks at ${aqi} AQI. During intense exertion, inhalation volume increases up to 5-fold, forcing fine PM2.5 deep into alveoli. Substitute with indoor yoga or bodyweight exercises.`,
        keyActionItem: 'Cancel outdoor morning exercise; exercise strictly indoors in filtered rooms.',
        severityAdvisory: 'Cardiovascular Risk: Exercising in hazardous smog elevates acute arterial blood pressure.',
      };
    } else {
      return {
        answer: `Air quality is favourable (${aqi} AQI). Outdoor walking and running are safe and encouraged, especially during early afternoon when boundary layers are well-mixed.`,
        keyActionItem: 'Safe for outdoor fitness and recreation.',
        severityAdvisory: 'Clean environmental conditions.',
      };
    }
  }

  // Default English Grounded Response
  return {
    answer: isSevere
      ? `Based on live atmospheric conditions (${aqi} AQI, PM2.5: ${pm25} µg/m³ in ${input.locationName}), severe particulate inversion is active. Seal building envelopes, prioritize N95 respirators for transit, and protect sensitive household members.`
      : `Based on live atmospheric conditions (${aqi} AQI, PM2.5: ${pm25} µg/m³ in ${input.locationName}), air quality is manageable. Ventilate living areas during the midday window and save purifier energy.`,
    keyActionItem: isSevere
      ? 'Seal windows during morning and evening inversion peaks; wear N95 outdoors.'
      : 'Take advantage of midday solar dispersal for room cross-ventilation.',
    severityAdvisory: isSevere
      ? 'Health Alert: Entire urban population is susceptible to particulate irritation.'
      : 'Moderate / Acceptable air quality.',
  };
}
