// Client-side food search dictionary & fuzzy search matching utility
// Ensures instant multi-lingual food search works 100% offline or on Vercel frontend deployments

const FOOD_DATABASE = [
  // Fresh Produce - Whole
  { name: 'Tomato (Tamatar / टमाटर)', category: 'Fresh Produce', form: 'Whole', keywords: ['tomato', 'tamatar', 'टमाटर'] },
  { name: 'Potato (Aloo / आलू)', category: 'Fresh Produce', form: 'Whole', keywords: ['potato', 'aloo', 'आलू'] },
  { name: 'Onion (Pyaz / Kanda / प्याज)', category: 'Fresh Produce', form: 'Whole', keywords: ['onion', 'pyaz', 'kanda', 'प्याज'] },
  { name: 'Garlic (Lehsun / लहसुन)', category: 'Fresh Produce', form: 'Whole', keywords: ['garlic', 'lehsun', 'लहसुन'] },
  { name: 'Ginger (Adrak / अदरक)', category: 'Fresh Produce', form: 'Whole', keywords: ['ginger', 'adrak', 'अदरक'] },
  { name: 'Mango (Alphonso / Aam / आम)', category: 'Fresh Produce', form: 'Whole', keywords: ['mango', 'alphonso', 'aam', 'आम'] },
  { name: 'Banana (Kela / केला)', category: 'Fresh Produce', form: 'Whole', keywords: ['banana', 'kela', 'केला'] },
  { name: 'Apple (Seb / सेब)', category: 'Fresh Produce', form: 'Whole', keywords: ['apple', 'seb', 'सेब'] },
  { name: 'Grapes (Angur / अंगूर)', category: 'Fresh Produce', form: 'Whole', keywords: ['grapes', 'angur', 'अंगूर'] },
  { name: 'Orange (Santra / संतरा)', category: 'Fresh Produce', form: 'Whole', keywords: ['orange', 'santra', 'संतरा'] },
  { name: 'Spinach (Palak / पालक)', category: 'Fresh Produce', form: 'Whole', keywords: ['spinach', 'palak', 'पालक'] },
  { name: 'Cabbage (Patta Gobi)', category: 'Fresh Produce', form: 'Whole', keywords: ['cabbage', 'patta gobi'] },
  { name: 'Cauliflower (Gobi / गोभी)', category: 'Fresh Produce', form: 'Whole', keywords: ['cauliflower', 'gobi', 'गोभी'] },
  { name: 'Brinjal (Baingan / बैंगन)', category: 'Fresh Produce', form: 'Whole', keywords: ['brinjal', 'eggplant', 'baingan', 'बैंगन'] },
  { name: 'Capsicum (Shimla Mirch)', category: 'Fresh Produce', form: 'Whole', keywords: ['capsicum', 'shimla mirch'] },
  { name: 'Cucumber (Kheera / खीरा)', category: 'Fresh Produce', form: 'Whole', keywords: ['cucumber', 'kheera', 'खीरा'] },
  { name: 'Okra (Bhindi / भिंडी)', category: 'Fresh Produce', form: 'Whole', keywords: ['okra', 'bhindi', 'भिंडी'] },
  { name: 'Peas (Matar / मटर)', category: 'Fresh Produce', form: 'Whole', keywords: ['peas', 'matar', 'मटर'] },
  { name: 'Carrot (Gajar / गाजर)', category: 'Fresh Produce', form: 'Whole', keywords: ['carrot', 'gajar', 'गाजर'] },
  { name: 'Radish (Mooli / मूली)', category: 'Fresh Produce', form: 'Whole', keywords: ['radish', 'mooli', 'मूली'] },
  { name: 'Guava (Amrood / अमरूद)', category: 'Fresh Produce', form: 'Whole', keywords: ['guava', 'amrood', 'अमरूद'] },
  { name: 'Papaya (Papita / पपीता)', category: 'Fresh Produce', form: 'Whole', keywords: ['papaya', 'papita', 'पपीता'] },
  { name: 'Watermelon (Tarbooz / तरबूज)', category: 'Fresh Produce', form: 'Whole', keywords: ['watermelon', 'tarbooz', 'तरबूज'] },
  { name: 'Pomegranate (Anar / अनार)', category: 'Fresh Produce', form: 'Whole', keywords: ['pomegranate', 'anar', 'अनार'] },

  // Fresh Produce - Cut/Processed
  { name: 'Cut Salad / Sliced Vegetables', category: 'Fresh Produce', form: 'Cut/Processed', keywords: ['cut salad', 'sliced vegetables', 'cut vegetables', 'chopped'] },
  { name: 'Peeled Garlic / Cut Ginger', category: 'Fresh Produce', form: 'Cut/Processed', keywords: ['peeled garlic', 'cut ginger', 'garlic cloves'] },
  { name: 'Sliced Mango / Cut Fruits', category: 'Fresh Produce', form: 'Cut/Processed', keywords: ['sliced mango', 'cut fruits', 'fruit bowl'] },

  // Dairy - Whole / Liquid
  { name: 'Fresh Milk (Doodh / दूध)', category: 'Dairy', form: 'Liquid', keywords: ['milk', 'doodh', 'दूध', 'cow milk', 'buffalo milk'] },
  { name: 'Fresh Paneer (Cottage Cheese)', category: 'Dairy', form: 'Whole', keywords: ['paneer', 'cottage cheese', 'पनीर'] },
  { name: 'Curd / Dahi (दही)', category: 'Dairy', form: 'Liquid', keywords: ['curd', 'dahi', 'दही', 'yogurt'] },
  { name: 'Butter (Makhan / मक्खन)', category: 'Dairy', form: 'Whole', keywords: ['butter', 'makhan', 'मक्खन'] },
  { name: 'Ghee (Clarified Butter)', category: 'Dairy', form: 'Liquid', keywords: ['ghee', 'घी'] },
  { name: 'Cheese (Cheddar / Mozzarella)', category: 'Dairy', form: 'Whole', keywords: ['cheese', 'mozzarella', 'cheddar'] },
  { name: 'Buttermilk / Chaas (छाछ)', category: 'Dairy', form: 'Liquid', keywords: ['buttermilk', 'chaas', 'छाछ', 'lassi'] },

  // Dry Snacks - Whole / Powder
  { name: 'Namkeen / Bhujia / Sev', category: 'Dry Snacks', form: 'Whole', keywords: ['namkeen', 'bhujia', 'sev', 'mixture', 'chivda'] },
  { name: 'Potato Chips / Wafers', category: 'Dry Snacks', form: 'Whole', keywords: ['chips', 'potato chips', 'wafers', 'kurkure'] },
  { name: 'Biscuits / Cookies / Rusk', category: 'Dry Snacks', form: 'Whole', keywords: ['biscuits', 'cookies', 'rusk', 'bakery'] },
  { name: 'Wheat Flour / Atta (आटा)', category: 'Dry Snacks', form: 'Powder', keywords: ['atta', 'wheat flour', 'flour', 'आटा', 'maida'] },
  { name: 'Gram Flour (Besan / बेसन)', category: 'Dry Snacks', form: 'Powder', keywords: ['besan', 'gram flour', 'बेसन'] },
  { name: 'Basmati Rice (Chawal / चावल)', category: 'Dry Snacks', form: 'Whole', keywords: ['rice', 'chawal', 'basmati', 'चावल'] },
  { name: 'Dry Fruits (Almonds / Cashews / Badam / Kaju)', category: 'Dry Snacks', form: 'Whole', keywords: ['dry fruits', 'almonds', 'badam', 'cashews', 'kaju', 'raisins'] },
  { name: 'Spices / Chilli Powder / Haldi', category: 'Dry Snacks', form: 'Powder', keywords: ['spices', 'masala', 'chilli powder', 'turmeric', 'haldi'] },

  // Meat - Whole / Cut/Processed
  { name: 'Fresh Mutton (Goat / Keema)', category: 'Meat', form: 'Cut/Processed', keywords: ['mutton', 'goat', 'lamb', 'keema', 'mince'] },
  { name: 'Fresh Chicken (Whole / Cut)', category: 'Meat', form: 'Cut/Processed', keywords: ['chicken', 'murgi', 'chicken cut', 'poultry'] },
  { name: 'Fresh Fish (Machhli / Prawns)', category: 'Meat', form: 'Cut/Processed', keywords: ['fish', 'machhli', 'prawns', 'jhinga', 'seafood'] },
  { name: 'Fresh Eggs (Anda / अंडा)', category: 'Meat', form: 'Whole', keywords: ['egg', 'eggs', 'anda', 'अंडा'] },
];

export function searchFoodClient(queryStr) {
  if (!queryStr || typeof queryStr !== 'string') return [];
  const q = queryStr.trim().toLowerCase();
  if (q.length < 2) return [];

  const matches = [];
  for (const item of FOOD_DATABASE) {
    let score = 0;
    const nameLower = item.name.toLowerCase();

    if (nameLower.startsWith(q)) {
      score = 0.95;
    } else if (nameLower.includes(q)) {
      score = 0.85;
    } else {
      for (const kw of item.keywords) {
        if (kw.startsWith(q)) {
          score = 0.90;
          break;
        } else if (kw.includes(q)) {
          score = 0.75;
          break;
        }
      }
    }

    if (score > 0) {
      matches.push({
        food_name: item.name,
        category: item.category,
        form: item.form,
        confidence: score,
      });
    }
  }

  // Sort descending by confidence score
  matches.sort((a, b) => b.confidence - a.confidence);
  return matches.slice(0, 5);
}

export function generateClientRecommendations(category, form, transitRoute) {
  let recommendations = [];

  if (category === 'Fresh Produce') {
    if (form === 'Whole') {
      recommendations = [
        {
          id: 'bopp',
          rank: 1,
          name: 'Micro-perforated BOPP Film',
          cost_per_unit_inr: 1.5,
          shelf_life_days: transitRoute === 'cold_chain' ? 14 : transitRoute === 'interstate' ? 6 : 8,
          is_fssai_approved: true,
          description: 'Permeable micro-barrier maintains ideal equilibrium headspace (O2 ~3-5%, CO2 ~5-10%), suppressing respiration rate without inducing anaerobic fermentation.',
          score: 0.8677,
          technical_specs: { otr: '1,200 – 1,800 cm³/m²/day', wvtr: '8 – 12 g/m²/day', gauge: '35 – 40 µm', seal_temp: '110°C – 120°C' }
        },
        {
          id: 'pla',
          rank: 2,
          name: 'Bio-degradable PLA Compostable Film',
          cost_per_unit_inr: 2.8,
          shelf_life_days: transitRoute === 'cold_chain' ? 12 : transitRoute === 'interstate' ? 5 : 7,
          is_fssai_approved: true,
          description: 'Eco-friendly compostable plant-based film with medium gas permeability to prevent condensation buildup.',
          score: 0.7286,
          technical_specs: { otr: '800 – 2,200 cm³/m²/day', wvtr: '12 – 20 g/m²/day', gauge: '40 – 50 µm', seal_temp: '125°C – 140°C' }
        },
        {
          id: 'paper',
          rank: 3,
          name: 'Kraft Paper Bag (Vented)',
          cost_per_unit_inr: 0.6,
          shelf_life_days: transitRoute === 'cold_chain' ? 5 : transitRoute === 'interstate' ? 2 : 3,
          is_fssai_approved: true,
          description: 'Cost-effective breathable paper pouch suited for short-distance ambient transit.',
          score: 0.68,
          technical_specs: { otr: '> 10,000 cm³/m²/day', wvtr: '> 100 g/m²/day', gauge: '70 – 90 gsm paper', seal_temp: 'N/A (glued/stitched)' }
        }
      ];
    } else {
      recommendations = [
        {
          id: 'alu',
          rank: 1,
          name: 'Aluminium Foil Laminate',
          cost_per_unit_inr: 6.5,
          shelf_life_days: transitRoute === 'cold_chain' ? 210 : transitRoute === 'interstate' ? 140 : 187,
          is_fssai_approved: true,
          description: 'High moisture and oxygen barrier limits water activity (aw) drift and prevents oxidative degradation during transit.',
          score: 0.6863,
          technical_specs: { otr: '< 0.01 cm³/m²/day', wvtr: '< 0.1 g/m²/day', gauge: '12 µm Al + 50 µm PE', seal_temp: '140°C – 160°C' }
        },
        {
          id: 'map',
          rank: 2,
          name: 'Modified Atmosphere Packaging (MAP Tray)',
          cost_per_unit_inr: 4.8,
          shelf_life_days: transitRoute === 'cold_chain' ? 21 : transitRoute === 'interstate' ? 10 : 14,
          is_fssai_approved: true,
          description: 'Active gas flush (O2 5%, CO2 10%, N2 85%) extends cut produce freshness and prevents browning.',
          score: 0.636,
          technical_specs: { otr: '800 – 1,200 cm³/m²/day', wvtr: '6 – 10 g/m²/day', gauge: '50 – 70 µm', seal_temp: '120°C – 140°C' }
        },
        {
          id: 'pet',
          rank: 3,
          name: 'PET/PE Laminate Pouch',
          cost_per_unit_inr: 4.2,
          shelf_life_days: transitRoute === 'cold_chain' ? 60 : transitRoute === 'interstate' ? 30 : 46,
          is_fssai_approved: true,
          description: 'Durable multi-layer pouch offering balanced oxygen barrier and high puncture resistance.',
          score: 0.569,
          technical_specs: { otr: '20 – 50 cm³/m²/day', wvtr: '1 – 3 g/m²/day', gauge: '75 – 100 µm', seal_temp: '140°C – 160°C' }
        }
      ];
    }
  } else if (category === 'Dairy') {
    recommendations = [
      {
        id: 'alu',
        rank: 1,
        name: 'Aluminium Foil Laminate Pouch',
        cost_per_unit_inr: 6.5,
        shelf_life_days: transitRoute === 'cold_chain' ? 977 : transitRoute === 'interstate' ? 180 : 240,
        is_fssai_approved: true,
        description: 'Complete light and gas barrier preventing lipid oxidation and photo-degradation of milk fats.',
        score: 0.7284,
        technical_specs: { otr: '< 0.01 cm³/m²/day', wvtr: '< 0.1 g/m²/day', gauge: '12 µm Al + 50 µm PE', seal_temp: '140°C – 160°C' }
      },
      {
        id: 'pet',
        rank: 2,
        name: 'PET/PE Barrier Film Pouch',
        cost_per_unit_inr: 4.2,
        shelf_life_days: transitRoute === 'cold_chain' ? 241 : transitRoute === 'interstate' ? 45 : 60,
        is_fssai_approved: true,
        description: 'Flexible multi-layer barrier pouch designed for pasteurized dairy products.',
        score: 0.600,
        technical_specs: { otr: '20 – 50 cm³/m²/day', wvtr: '1 – 3 g/m²/day', gauge: '75 – 100 µm', seal_temp: '140°C – 160°C' }
      },
      {
        id: 'retort',
        rank: 3,
        name: 'Multi-layer Retort Pouch',
        cost_per_unit_inr: 8.0,
        shelf_life_days: transitRoute === 'cold_chain' ? 482 : transitRoute === 'interstate' ? 120 : 180,
        is_fssai_approved: true,
        description: 'High-temperature thermal sterilization pouch enabling long ambient shelf life.',
        score: 0.3845,
        technical_specs: { otr: '< 0.5 cm³/m²/day', wvtr: '< 0.5 g/m²/day', gauge: '110 – 130 µm', seal_temp: '160°C – 180°C' }
      }
    ];
  } else if (category === 'Dry Snacks') {
    recommendations = [
      {
        id: 'alu',
        rank: 1,
        name: 'Aluminium Foil Metallized Laminate',
        cost_per_unit_inr: 6.5,
        shelf_life_days: transitRoute === 'cold_chain' ? 300 : transitRoute === 'interstate' ? 232 : 180,
        is_fssai_approved: true,
        description: 'Zero moisture vapor transmission rate prevents crispiness loss and rancidity in fried snacks.',
        score: 0.6863,
        technical_specs: { otr: '< 0.01 cm³/m²/day', wvtr: '< 0.1 g/m²/day', gauge: '12 µm Al + 50 µm PE', seal_temp: '140°C – 160°C' }
      },
      {
        id: 'bopp',
        rank: 2,
        name: 'BOPP / Met-BOPP Laminate',
        cost_per_unit_inr: 2.1,
        shelf_life_days: transitRoute === 'cold_chain' ? 120 : transitRoute === 'interstate' ? 90 : 60,
        is_fssai_approved: true,
        description: 'High gloss barrier pouch offering excellent moisture barrier for namkeens and biscuits.',
        score: 0.6360,
        technical_specs: { otr: '1,500 – 3,000 cm³/m²/day', wvtr: '3 – 6 g/m²/day', gauge: '20 – 30 µm', seal_temp: '130°C – 150°C' }
      },
      {
        id: 'pet',
        rank: 3,
        name: 'PET/PE Laminate Pouch',
        cost_per_unit_inr: 4.2,
        shelf_life_days: transitRoute === 'cold_chain' ? 180 : transitRoute === 'interstate' ? 120 : 90,
        is_fssai_approved: true,
        description: 'Sturdy packaging option providing good puncture resistance for bulk flours and pulses.',
        score: 0.5690,
        technical_specs: { otr: '20 – 50 cm³/m²/day', wvtr: '1 – 3 g/m²/day', gauge: '75 – 100 µm', seal_temp: '140°C – 160°C' }
      }
    ];
  } else {
    // Meat
    recommendations = [
      {
        id: 'alu',
        rank: 1,
        name: 'Aluminium Vacuum Foil Barrier Pouch',
        cost_per_unit_inr: 6.5,
        shelf_life_days: transitRoute === 'cold_chain' ? 232 : transitRoute === 'interstate' ? 45 : 30,
        is_fssai_approved: true,
        description: 'Ultra-high barrier vacuum seal eliminating oxidative rancidity and microbial growth.',
        score: 0.7284,
        technical_specs: { otr: '< 0.01 cm³/m²/day', wvtr: '< 0.1 g/m²/day', gauge: '12 µm Al + 50 µm PE', seal_temp: '140°C – 160°C' }
      },
      {
        id: 'pet',
        rank: 2,
        name: 'PET/PE High Barrier Vacuum Pouch',
        cost_per_unit_inr: 4.2,
        shelf_life_days: transitRoute === 'cold_chain' ? 57 : transitRoute === 'interstate' ? 14 : 10,
        is_fssai_approved: true,
        description: 'High mechanical strength film suited for refrigerated raw and processed meats.',
        score: 0.6000,
        technical_specs: { otr: '20 – 50 cm³/m²/day', wvtr: '1 – 3 g/m²/day', gauge: '75 – 100 µm', seal_temp: '140°C – 160°C' }
      },
      {
        id: 'retort',
        rank: 3,
        name: 'Multi-layer Retort Pouch',
        cost_per_unit_inr: 8.0,
        shelf_life_days: transitRoute === 'cold_chain' ? 114 : transitRoute === 'interstate' ? 90 : 60,
        is_fssai_approved: true,
        description: 'Autoclave sterilisable laminate for ready-to-eat curries and meat dishes.',
        score: 0.3845,
        technical_specs: { otr: '< 0.5 cm³/m²/day', wvtr: '< 0.5 g/m²/day', gauge: '110 – 130 µm', seal_temp: '160°C – 180°C' }
      }
    ];
  }

  return {
    food_category: category,
    food_form: form,
    transit_route: transitRoute,
    recommendations: recommendations
  };
}
