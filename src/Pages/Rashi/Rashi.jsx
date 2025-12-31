import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';

const Rashi = () => {
  const [selectedRashi, setSelectedRashi] = useState('');
  const [rashiInfo, setRashiInfo] = useState(null);
  const [suggestedRudraksha, setSuggestedRudraksha] = useState([]);
  const [modalMukhi, setModalMukhi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allRudraksha, setAllRudraksha] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // All 12 Rashis (Zodiac Signs)
  const rashis = [
    { value: 'Aries', label: 'Aries (मेष)', english: 'Aries', hindi: 'मेष', planet: 'Mars', element: 'Fire' },
    { value: 'Taurus', label: 'Taurus (वृषभ)', english: 'Taurus', hindi: 'वृषभ', planet: 'Venus', element: 'Earth' },
    { value: 'Gemini', label: 'Gemini (मिथुन)', english: 'Gemini', hindi: 'मिथुन', planet: 'Mercury', element: 'Air' },
    { value: 'Cancer', label: 'Cancer (कर्क)', english: 'Cancer', hindi: 'कर्क', planet: 'Moon', element: 'Water' },
    { value: 'Leo', label: 'Leo (सिंह)', english: 'Leo', hindi: 'सिंह', planet: 'Sun', element: 'Fire' },
    { value: 'Virgo', label: 'Virgo (कन्या)', english: 'Virgo', hindi: 'कन्या', planet: 'Mercury', element: 'Earth' },
    { value: 'Libra', label: 'Libra (तुला)', english: 'Libra', hindi: 'तुला', planet: 'Venus', element: 'Air' },
    { value: 'Scorpio', label: 'Scorpio (वृश्चिक)', english: 'Scorpio', hindi: 'वृश्चिक', planet: 'Mars', element: 'Water' },
    { value: 'Sagittarius', label: 'Sagittarius (धनु)', english: 'Sagittarius', hindi: 'धनु', planet: 'Jupiter', element: 'Fire' },
    { value: 'Capricorn', label: 'Capricorn (मकर)', english: 'Capricorn', hindi: 'मकर', planet: 'Saturn', element: 'Earth' },
    { value: 'Aquarius', label: 'Aquarius (कुम्भ)', english: 'Aquarius', hindi: 'कुम्भ', planet: 'Saturn', element: 'Air' },
    { value: 'Pisces', label: 'Pisces (मीन)', english: 'Pisces', hindi: 'मीन', planet: 'Jupiter', element: 'Water' }
  ];

  // Rashi Information Database
  const rashiDetails = {
    'Aries': {
      name: 'Aries (मेष)',
      description: 'Aries is the first sign of the zodiac, representing new beginnings and leadership. People born under this sign are known for their courage, determination, and pioneering spirit.',
      characteristics: ['Courageous', 'Energetic', 'Independent', 'Impulsive', 'Confident'],
      rulingPlanet: 'Mars',
      element: 'Fire',
      luckyColors: ['Red', 'Orange'],
      luckyNumbers: [1, 8, 17]
    },
    'Taurus': {
      name: 'Taurus (वृषभ)',
      description: 'Taurus is an earth sign known for stability, patience, and a love for beauty and comfort. Taureans are reliable, practical, and enjoy the finer things in life.',
      characteristics: ['Stable', 'Patient', 'Reliable', 'Stubborn', 'Luxury-loving'],
      rulingPlanet: 'Venus',
      element: 'Earth',
      luckyColors: ['Green', 'Pink'],
      luckyNumbers: [2, 6, 24]
    },
    'Gemini': {
      name: 'Gemini (मिथुन)',
      description: 'Gemini is an air sign representing communication, curiosity, and adaptability. Geminis are known for their quick wit, versatility, and social nature.',
      characteristics: ['Communicative', 'Curious', 'Adaptable', 'Restless', 'Intelligent'],
      rulingPlanet: 'Mercury',
      element: 'Air',
      luckyColors: ['Yellow', 'Light Green'],
      luckyNumbers: [3, 12, 21]
    },
    'Cancer': {
      name: 'Cancer (कर्क)',
      description: 'Cancer is a water sign associated with emotions, intuition, and nurturing. Cancerians are deeply caring, protective, and have strong emotional intelligence.',
      characteristics: ['Emotional', 'Intuitive', 'Nurturing', 'Moody', 'Protective'],
      rulingPlanet: 'Moon',
      element: 'Water',
      luckyColors: ['Silver', 'White'],
      luckyNumbers: [4, 7, 28]
    },
    'Leo': {
      name: 'Leo (सिंह)',
      description: 'Leo is a fire sign representing creativity, leadership, and self-expression. Leos are confident, generous, and love being in the spotlight.',
      characteristics: ['Confident', 'Creative', 'Generous', 'Proud', 'Dramatic'],
      rulingPlanet: 'Sun',
      element: 'Fire',
      luckyColors: ['Gold', 'Orange'],
      luckyNumbers: [5, 19, 23]
    },
    'Virgo': {
      name: 'Virgo (कन्या)',
      description: 'Virgo is an earth sign known for attention to detail, practicality, and service. Virgos are analytical, organized, and strive for perfection.',
      characteristics: ['Analytical', 'Practical', 'Organized', 'Critical', 'Helpful'],
      rulingPlanet: 'Mercury',
      element: 'Earth',
      luckyColors: ['Navy Blue', 'Beige'],
      luckyNumbers: [6, 15, 24]
    },
    'Libra': {
      name: 'Libra (तुला)',
      description: 'Libra is an air sign representing balance, harmony, and relationships. Librans are diplomatic, fair-minded, and seek beauty and justice.',
      characteristics: ['Diplomatic', 'Balanced', 'Social', 'Indecisive', 'Aesthetic'],
      rulingPlanet: 'Venus',
      element: 'Air',
      luckyColors: ['Pink', 'Light Blue'],
      luckyNumbers: [7, 14, 21]
    },
    'Scorpio': {
      name: 'Scorpio (वृश्चिक)',
      description: 'Scorpio is a water sign known for intensity, passion, and transformation. Scorpios are mysterious, resourceful, and have deep emotional depth.',
      characteristics: ['Intense', 'Passionate', 'Resourceful', 'Secretive', 'Determined'],
      rulingPlanet: 'Mars',
      element: 'Water',
      luckyColors: ['Dark Red', 'Black'],
      luckyNumbers: [8, 13, 22]
    },
    'Sagittarius': {
      name: 'Sagittarius (धनु)',
      description: 'Sagittarius is a fire sign representing adventure, philosophy, and freedom. Sagittarians are optimistic, adventurous, and love exploring new horizons.',
      characteristics: ['Adventurous', 'Optimistic', 'Philosophical', 'Impatient', 'Honest'],
      rulingPlanet: 'Jupiter',
      element: 'Fire',
      luckyColors: ['Purple', 'Deep Blue'],
      luckyNumbers: [9, 12, 21]
    },
    'Capricorn': {
      name: 'Capricorn (मकर)',
      description: 'Capricorn is an earth sign known for ambition, discipline, and responsibility. Capricorns are hardworking, practical, and value tradition and structure.',
      characteristics: ['Ambitious', 'Disciplined', 'Responsible', 'Pessimistic', 'Traditional'],
      rulingPlanet: 'Saturn',
      element: 'Earth',
      luckyColors: ['Brown', 'Dark Green'],
      luckyNumbers: [10, 16, 26]
    },
    'Aquarius': {
      name: 'Aquarius (कुम्भ)',
      description: 'Aquarius is an air sign representing innovation, humanitarianism, and independence. Aquarians are original, progressive, and value freedom and equality.',
      characteristics: ['Innovative', 'Independent', 'Humanitarian', 'Detached', 'Eccentric'],
      rulingPlanet: 'Saturn',
      element: 'Air',
      luckyColors: ['Electric Blue', 'Silver'],
      luckyNumbers: [11, 22, 29]
    },
    'Pisces': {
      name: 'Pisces (मीन)',
      description: 'Pisces is a water sign associated with intuition, compassion, and spirituality. Pisceans are empathetic, artistic, and deeply connected to the spiritual realm.',
      characteristics: ['Compassionate', 'Intuitive', 'Artistic', 'Escapist', 'Dreamy'],
      rulingPlanet: 'Jupiter',
      element: 'Water',
      luckyColors: ['Sea Green', 'Lavender'],
      luckyNumbers: [12, 24, 33]
    }
  };

  // Mapping of Rashi to Suggested Rudraksha Mukhi (1-14 Mukhi)
  const rashiToRudrakshaMapping = {
    'Aries': ['1 Mukhi', '3 Mukhi', '11 Mukhi'],
    'Taurus': ['2 Mukhi', '6 Mukhi', '14 Mukhi'],
    'Gemini': ['3 Mukhi', '5 Mukhi', '12 Mukhi'],
    'Cancer': ['2 Mukhi', '4 Mukhi', '7 Mukhi'],
    'Leo': ['1 Mukhi', '5 Mukhi', '9 Mukhi'],
    'Virgo': ['6 Mukhi', '10 Mukhi', '14 Mukhi'],
    'Libra': ['2 Mukhi', '7 Mukhi', '11 Mukhi'],
    'Scorpio': ['3 Mukhi', '8 Mukhi', '13 Mukhi'],
    'Sagittarius': ['4 Mukhi', '9 Mukhi', '12 Mukhi'],
    'Capricorn': ['6 Mukhi', '10 Mukhi', '14 Mukhi'],
    'Aquarius': ['5 Mukhi', '11 Mukhi', '13 Mukhi'],
    'Pisces': ['4 Mukhi', '7 Mukhi', '12 Mukhi']
  };

  // Detailed information about each Mukhi (1-14)
  const mukhiDetails = {
    '1 Mukhi': {
      deity: 'Lord Shiva',
      planet: 'Sun',
      benefits: 'Enhances leadership qualities, removes ego, brings enlightenment, provides spiritual growth, and connects with the divine consciousness. Best for those seeking self-realization and inner peace.',
      description: 'The One Mukhi Rudraksha represents Lord Shiva himself. It is extremely rare and powerful, symbolizing unity and oneness with the universe. It helps in removing all obstacles and brings clarity of thought.',
      chakra: 'Crown Chakra (Sahasrara)',
      mantra: 'Om Namah Shivaya'
    },
    '2 Mukhi': {
      deity: 'Ardhanarishvara (Shiva-Parvati)',
      planet: 'Moon',
      benefits: 'Improves relationships, enhances harmony in partnerships, balances emotions, promotes marital bliss, and brings peace in family life. Ideal for couples and those seeking emotional stability.',
      description: 'The Two Mukhi Rudraksha represents the union of Shiva and Parvati. It symbolizes balance, harmony, and unity. It helps in maintaining healthy relationships and emotional equilibrium.',
      chakra: 'Third Eye Chakra (Ajna)',
      mantra: 'Om Namah Shivaya'
    },
    '3 Mukhi': {
      deity: 'Agni (Fire God)',
      planet: 'Mars',
      benefits: 'Removes past sins, eliminates guilt, enhances confidence, improves focus, and provides mental clarity. Helps in overcoming obstacles and negative thoughts.',
      description: 'The Three Mukhi Rudraksha is associated with Agni, the fire god. It purifies the mind and body, removes negative karma, and helps in spiritual purification.',
      chakra: 'Solar Plexus Chakra (Manipura)',
      mantra: 'Om Namah Shivaya'
    },
    '4 Mukhi': {
      deity: 'Brahma',
      planet: 'Mercury',
      benefits: 'Enhances intelligence, improves memory, increases creativity, boosts communication skills, and helps in learning. Perfect for students and professionals.',
      description: 'The Four Mukhi Rudraksha represents Lord Brahma, the creator. It enhances intellectual abilities, improves memory power, and helps in gaining knowledge and wisdom.',
      chakra: 'Throat Chakra (Vishuddha)',
      mantra: 'Om Namah Shivaya'
    },
    '5 Mukhi': {
      deity: 'Kalagni Rudra',
      planet: 'Jupiter',
      benefits: 'Provides overall health benefits, reduces stress, improves concentration, enhances meditation, and brings peace of mind. Most commonly used Rudraksha.',
      description: 'The Five Mukhi Rudraksha is the most common and versatile bead. It represents Kalagni Rudra and provides overall protection, health benefits, and spiritual growth.',
      chakra: 'Heart Chakra (Anahata)',
      mantra: 'Om Namah Shivaya'
    },
    '6 Mukhi': {
      deity: 'Kartikeya (Lord Murugan)',
      planet: 'Venus',
      benefits: 'Enhances focus, improves concentration, removes obstacles in education, helps in career growth, and provides mental clarity. Great for students and professionals.',
      description: 'The Six Mukhi Rudraksha represents Lord Kartikeya. It helps in improving focus, removing obstacles, and achieving success in education and career.',
      chakra: 'Third Eye Chakra (Ajna)',
      mantra: 'Om Namah Shivaya'
    },
    '7 Mukhi': {
      deity: 'Saptarishi (Seven Sages)',
      planet: 'Saturn',
      benefits: 'Brings wealth and prosperity, removes financial obstacles, enhances business success, provides protection from negative energies, and improves luck.',
      description: 'The Seven Mukhi Rudraksha represents the seven sages. It is known for bringing wealth, prosperity, and removing financial obstacles. It also provides protection from negative energies.',
      chakra: 'Root Chakra (Muladhara)',
      mantra: 'Om Namah Shivaya'
    },
    '8 Mukhi': {
      deity: 'Ganesha',
      planet: 'Rahu',
      benefits: 'Removes obstacles, provides success in endeavors, enhances intelligence, brings good fortune, and protects from negative influences. Ideal for new beginnings.',
      description: 'The Eight Mukhi Rudraksha represents Lord Ganesha, the remover of obstacles. It helps in overcoming challenges, achieving success, and brings good fortune.',
      chakra: 'Solar Plexus Chakra (Manipura)',
      mantra: 'Om Namah Shivaya'
    },
    '9 Mukhi': {
      deity: 'Durga (Navadurga)',
      planet: 'Ketu',
      benefits: 'Provides protection, removes fear, enhances courage, brings confidence, and protects from accidents and negative energies. Great for those facing challenges.',
      description: 'The Nine Mukhi Rudraksha represents the nine forms of Goddess Durga. It provides strong protection, removes fear, and enhances courage and confidence.',
      chakra: 'Root Chakra (Muladhara)',
      mantra: 'Om Namah Shivaya'
    },
    '10 Mukhi': {
      deity: 'Lord Vishnu',
      planet: 'Jupiter',
      benefits: 'Provides protection from all directions, removes negative karma, enhances spiritual growth, brings peace, and protects from black magic and evil eye.',
      description: 'The Ten Mukhi Rudraksha represents Lord Vishnu. It provides protection from all directions, removes negative karma, and enhances spiritual protection.',
      chakra: 'Crown Chakra (Sahasrara)',
      mantra: 'Om Namah Shivaya'
    },
    '11 Mukhi': {
      deity: 'Ekadasha Rudra (Eleven Forms of Shiva)',
      planet: 'Mars',
      benefits: 'Enhances leadership qualities, provides courage, removes obstacles, brings success in competitions, and protects from enemies. Ideal for leaders and warriors.',
      description: 'The Eleven Mukhi Rudraksha represents the eleven forms of Lord Shiva. It enhances leadership qualities, provides courage, and helps in overcoming challenges.',
      chakra: 'Solar Plexus Chakra (Manipura)',
      mantra: 'Om Namah Shivaya'
    },
    '12 Mukhi': {
      deity: 'Surya (Sun God)',
      planet: 'Sun',
      benefits: 'Enhances leadership, improves confidence, brings recognition, provides success in career, and enhances charisma. Perfect for those in leadership positions.',
      description: 'The Twelve Mukhi Rudraksha represents Lord Surya, the sun god. It enhances leadership qualities, brings recognition, and provides success in career and life.',
      chakra: 'Solar Plexus Chakra (Manipura)',
      mantra: 'Om Namah Shivaya'
    },
    '13 Mukhi': {
      deity: 'Kamadeva (God of Love)',
      planet: 'Venus',
      benefits: 'Enhances attractiveness, improves relationships, brings love and harmony, increases charm, and helps in finding a life partner. Ideal for relationship issues.',
      description: 'The Thirteen Mukhi Rudraksha represents Kamadeva, the god of love. It enhances attractiveness, improves relationships, and brings love and harmony in life.',
      chakra: 'Heart Chakra (Anahata)',
      mantra: 'Om Namah Shivaya'
    },
    '14 Mukhi': {
      deity: 'Lord Shiva (Mahadev)',
      planet: 'Saturn',
      benefits: 'Provides ultimate protection, enhances spiritual growth, brings enlightenment, removes all obstacles, and connects with divine consciousness. Most powerful Rudraksha.',
      description: 'The Fourteen Mukhi Rudraksha represents Lord Shiva in his most powerful form. It is extremely rare and provides ultimate protection, spiritual growth, and enlightenment.',
      chakra: 'Crown Chakra (Sahasrara)',
      mantra: 'Om Namah Shivaya'
    }
  };

  // Rashi images (placeholder URLs - can be replaced with actual images)
  const rashiImages = {
    'Aries': 'https://via.placeholder.com/400x300?text=Aries+%28%E0%A4%AE%E0%A5 87%E0%A4%B7%29',
    'Taurus': 'https://via.placeholder.com/400x300?text=Taurus+%28%E0%A4%B5%E0%A5%83%E0%A4%B7%E0%A4%AD%29',
    'Gemini': 'https://via.placeholder.com/400x300?text=Gemini+%28%E0%A4%AE%E0%A4%BF%E0%A4%A5%E0%A5%81%E0%A4%A8%29',
    'Cancer': 'https://via.placeholder.com/400x300?text=Cancer+%28%E0%A4%95%E0%A4%B0%E0%A5%8D%E0%A4%95%29',
    'Leo': 'https://via.placeholder.com/400x300?text=Leo+%28%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9%29',
    'Virgo': 'https://via.placeholder.com/400x300?text=Virgo+%28%E0%A4%95%E0%A4%A8%E0%A5%8D%E0%A4%AF%E0%A4%BE%29',
    'Libra': 'https://via.placeholder.com/400x300?text=Libra+%28%E0%A4%A4%E0%A5%81%E0%A4%B2%E0%A4%BE%29',
    'Scorpio': 'https://via.placeholder.com/400x300?text=Scorpio+%28%E0%A4%B5%E0%A5%83%E0%A4%B6%E0%A5%8D%E0%A4%9A%E0%A4%BF%E0%A4%95%29',
    'Sagittarius': 'https://via.placeholder.com/400x300?text=Sagittarius+%28%E0%A4%A7%E0%A4%A8%E0%A5%81%29',
    'Capricorn': 'https://via.placeholder.com/400x300?text=Capricorn+%28%E0%A4%AE%E0%A4%95%E0%A4%B0%29',
    'Aquarius': 'https://via.placeholder.com/400x300?text=Aquarius+%28%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A5%8D%E0%A4%AD%29',
    'Pisces': 'https://via.placeholder.com/400x300?text=Pisces+%28%E0%A4%AE%E0%A5%80%E0%A4%A8%29'
  };

  useEffect(() => {
    fetchAllRudraksha();
  }, []);

  useEffect(() => {
    if (selectedRashi) {
      setRashiInfo(rashiDetails[selectedRashi]);
      findSuggestedRudraksha();
    } else {
      setRashiInfo(null);
      setSuggestedRudraksha([]);
    }
  }, [selectedRashi, allRudraksha]);

  const fetchAllRudraksha = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products?category=Rudraksha`);
      if (!response.ok) throw new Error('Failed to fetch Rudraksha');
      const result = await response.json();
      if (result.success) {
        setAllRudraksha(result.data);
      }
    } catch (error) {
      console.error('Error fetching Rudraksha:', error);
    } finally {
      setLoading(false);
    }
  };

  const findSuggestedRudraksha = () => {
    if (!selectedRashi || !allRudraksha.length) return;

    const suggestedMukhi = rashiToRudrakshaMapping[selectedRashi] || [];
    const suggested = allRudraksha.filter(product => {
      // Check if product name or subcategory contains any of the suggested mukhi
      const productText = `${product.name} ${product.subcategory || ''}`.toLowerCase();
      return suggestedMukhi.some(mukhi => 
        productText.includes(mukhi.toLowerCase()) ||
        productText.includes(mukhi.replace(' Mukhi', '').toLowerCase() + ' mukhi') ||
        productText.includes(mukhi.replace(' Mukhi', '').toLowerCase() + 'mukhi')
      );
    });

    // If no exact match, try to find by mukhi number in subcategory
    if (suggested.length === 0) {
      const mukhiNumbers = suggestedMukhi.map(m => m.replace(' Mukhi', '').trim());
      const alternative = allRudraksha.filter(product => {
        const subcat = (product.subcategory || '').toLowerCase();
        return mukhiNumbers.some(num => 
          subcat.includes(num + ' mukhi') || 
          subcat.includes(num + 'mukhi') ||
          subcat.includes('mukhi ' + num)
        );
      });
      setSuggestedRudraksha(alternative);
    } else {
      setSuggestedRudraksha(suggested);
    }
  };

  const calculatePricing = (price) => {
    const discountPercent = 25;
    const originalPrice = price / (1 - discountPercent / 100);
    return {
      currentPrice: price,
      originalPrice: originalPrice,
      discount: discountPercent
    };
  };

  const getReviewCount = (productId) => {
    return 5 + (productId % 3);
  };

  return (
    <div className="min-h-screen py-4 sm:py-6 lg:py-8 bg-gradient-to-br from-orange-50/30 to-white">
      <style>{`
        select option {
          color: #ff914d !important;
          background-color: white !important;
        }
        select option:hover {
          background-color: rgba(255, 145, 77, 0.1) !important;
        }
        select:focus option:checked {
          background-color: rgba(255, 145, 77, 0.2) !important;
        }
      `}</style>
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
            Find Your Rashi Rudraksha
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover the perfect Rudraksha beads for your zodiac sign
          </p>
        </div>

        {/* Rashi Selection */}
        <div className="mb-8 max-w-2xl mx-auto">
          <label className="block text-sm font-semibold text-primary mb-3">
            Select Your Rashi (Zodiac Sign)
          </label>
          <div className="relative">
            <select
              value={selectedRashi}
              onChange={(e) => setSelectedRashi(e.target.value)}
              className="w-full px-4 py-3 pr-12 text-base border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-br from-white to-primary/5 text-primary font-medium appearance-none cursor-pointer hover:border-primary transition-all shadow-sm hover:shadow-md"
              style={{
                color: '#ff914d'
              }}
            >
              <option value="" style={{ color: '#ff914d', backgroundColor: 'white' }}>Select Your Rashi</option>
              {rashis.map((rashi) => (
                <option 
                  key={rashi.value} 
                  value={rashi.value} 
                  style={{ color: '#ff914d', backgroundColor: 'white' }}
                  className="hover:bg-primary/10 py-2"
                >
                  {rashi.label}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow overlay for better visibility */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Rashi Information with Image */}
        {rashiInfo && (
          <div className="mb-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl shadow-lg overflow-hidden border-2 border-primary/30">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Rashi Image */}
                <div className="lg:order-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10"></div>
                  <img
                    src={rashiImages[selectedRashi]}
                    alt={rashiInfo.name}
                    className="w-full h-full object-cover min-h-[300px]"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=' + selectedRashi;
                    }}
                  />
                </div>

                {/* Rashi Details */}
                <div className="p-6 sm:p-8 lg:order-2 bg-white">
                  <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
                    {rashiInfo.name}
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                    {rashiInfo.description}
                  </p>

                  <div className="space-y-4">
                    {/* Characteristics */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3">Key Characteristics</h3>
                      <div className="flex flex-wrap gap-2">
                        {rashiInfo.characteristics.map((char, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium border border-primary/30"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3">Rashi Details</h3>
                      <div className="space-y-2 text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary">Ruling Planet:</span>
                          <span className="text-gray-700">{rashiInfo.rulingPlanet}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary">Element:</span>
                          <span className="text-gray-700">{rashiInfo.element}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary">Lucky Colors:</span>
                          <span className="text-gray-700">{rashiInfo.luckyColors.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary">Lucky Numbers:</span>
                          <span className="text-gray-700">{rashiInfo.luckyNumbers.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Rudraksha Cards (Modal) */}
        {selectedRashi && rashiToRudrakshaMapping[selectedRashi] && (
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                Recommended Rudraksha for {rashiInfo?.name}
              </h2>
              <p className="text-gray-600">
                Click on each Rudraksha to learn more about its benefits and properties:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {rashiToRudrakshaMapping[selectedRashi].map((mukhi) => {
                const mukhiInfo = mukhiDetails[mukhi];

                return (
                  <div
                    key={mukhi}
                    onClick={() => setModalMukhi(mukhi)}
                    className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl shadow-md border-2 border-primary/30 overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  >
                    {/* Rudraksha Image */}
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden relative">
                      <img
                        src={`https://via.placeholder.com/400x400?text=${mukhi.replace(' ', '+')}+Rudraksha`}
                        alt={mukhi}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-md shadow-lg">
                        {mukhi}
                      </div>
                    </div>

                    {/* Rudraksha Info */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-primary mb-3">{mukhi}</h3>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">Deity:</span>
                          <span className="text-sm text-gray-700">{mukhiInfo.deity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">Planet:</span>
                          <span className="text-sm text-gray-700">{mukhiInfo.planet}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">Chakra:</span>
                          <span className="text-sm text-gray-700">{mukhiInfo.chakra}</span>
                        </div>
                      </div>

                      <button className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal for Rudraksha Details */}
        {modalMukhi && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setModalMukhi(null)}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const mukhiInfo = mukhiDetails[modalMukhi];
                return (
                  <>
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl sm:text-3xl font-bold">{modalMukhi} Rudraksha</h2>
                        <button
                          onClick={() => setModalMukhi(null)}
                          className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/20 rounded-full"
                          aria-label="Close"
                        >
                          <FaTimes className="text-xl" />
                        </button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6">
                      {/* Image */}
                      <div className="mb-6">
                        <img
                          src={`https://via.placeholder.com/600x400?text=${modalMukhi.replace(' ', '+')}+Rudraksha`}
                          alt={modalMukhi}
                          className="w-full h-64 object-cover rounded-lg border-2 border-primary/30"
                        />
                      </div>

                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                          <span className="text-sm font-medium text-primary block mb-1">Deity</span>
                          <span className="text-lg font-semibold text-gray-800">{mukhiInfo.deity}</span>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                          <span className="text-sm font-medium text-primary block mb-1">Planet</span>
                          <span className="text-lg font-semibold text-gray-800">{mukhiInfo.planet}</span>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                          <span className="text-sm font-medium text-primary block mb-1">Chakra</span>
                          <span className="text-lg font-semibold text-gray-800">{mukhiInfo.chakra}</span>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                          <span className="text-sm font-medium text-primary block mb-1">Mantra</span>
                          <span className="text-lg font-semibold text-primary">{mukhiInfo.mantra}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-primary mb-3">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{mukhiInfo.description}</p>
                      </div>

                      {/* Benefits */}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-primary mb-3">Benefits</h3>
                        <p className="text-gray-700 leading-relaxed">{mukhiInfo.benefits}</p>
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={() => setModalMukhi(null)}
                        className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Buy Cards - Actual Products */}
        {selectedRashi && (
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                Available Rudraksha Products
              </h2>
              <p className="text-gray-600">
                Purchase the recommended Rudraksha beads for your rashi:
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader size="lg" />
              </div>
            ) : suggestedRudraksha.length === 0 ? (
              <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-6 text-center">
                <p className="text-gray-700">
                  No Rudraksha products found matching the recommended mukhi for your rashi.
                  <br />
                  <span className="text-sm text-primary font-medium mt-2 block">
                    Recommended: {rashiToRudrakshaMapping[selectedRashi]?.join(', ')}
                  </span>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {suggestedRudraksha.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="rashi"
                    calculatePricing={calculatePricing}
                    getReviewCount={getReviewCount}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Section when no rashi selected */}
        {!selectedRashi && (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 border-2 border-primary/30 text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">
                How It Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-2">1</div>
                  <h4 className="font-semibold text-primary mb-2">Select Your Rashi</h4>
                  <p className="text-sm text-gray-600">
                    Choose your zodiac sign from the dropdown above
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-2">2</div>
                  <h4 className="font-semibold text-primary mb-2">Learn About Your Rashi</h4>
                  <p className="text-sm text-gray-600">
                    Discover detailed information about your zodiac sign
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-2">3</div>
                  <h4 className="font-semibold text-primary mb-2">Get Recommendations</h4>
                  <p className="text-sm text-gray-600">
                    Find the perfect Rudraksha beads recommended for your rashi
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rashi;
