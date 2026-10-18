export const site = {
  name: 'Purple Fox Event Planners',
  phone: '917075505617',
  displayPhone: '+91 70755 05617',
  instagram: 'https://www.instagram.com/purplefox_planners/',
  origin: 'https://purplefox-ten.vercel.app'
};

export const events = [
  ['wedding-events', 'Wedding Events', 'Weddings', 'A beautiful beginning, thoughtfully brought to life with bespoke mandaps and floral artistry.', 'wedding', 'Mandap & aisle styling|Floral palettes|Ceremony coordination'],
  ['birthday-parties', 'Birthday Parties', 'Birthdays', 'A little wonder. A lot of joy. A celebration that feels like you.', 'birthday', 'Personalised themes|Cake table styling|Balloon & backdrop concepts'],
  ['baby-showers', 'Baby Showers', 'Baby Showers', 'Sweet little details for a wonderful new chapter in soft, welcoming palettes.', 'baby', 'Soft pastel palettes|Welcome & photo corners|Intimate gathering styling'],
  ['corporate-events', 'Corporate Events', 'Corporate', 'Considered experiences that bring people and ideas together with poise.', 'corporate', 'Brand-led styling|Stage & presentation concepts|Guest flow planning'],
  ['anniversary-celebrations', 'Anniversary Celebrations', 'Anniversaries', 'Celebrate your story with an evening made for romance under candlelit canopies.', 'dinner', 'Candlelit tables|Romantic floral styling|Personalised celebration concepts'],
  ['housewarming-events', 'Housewarming Events', 'Other Events', 'A warm, auspicious welcome to a home filled with light, tradition, and blessing.', 'housewarming', 'Traditional entrance toran|Flower rangoli & brass urlis|Intimate guest arrangements'],
  ['private-celebrations', 'Private Celebrations', 'Other Events', 'Gather your favourite people for bespoke evenings, dining, and celebratory moments.', 'v2-private', 'Dinner table styling|Personal themes|Ambient lighting concepts'],
  ['religious-events', 'Religious Events', 'Religious', 'Meaningful traditions, celebrated with deep care, sacred flowers, and reverence.', 'religious', 'Traditional floral decoration|Ceremony space styling|Setup coordination'],
  ['engagement-ceremonies', 'Engagement Ceremonies', 'Weddings', 'The first yes deserves an unforgettable floral setting and romantic stage.', 'engagement', 'Ring ceremony backdrop|Floral photo corners|Intimate stage styling'],
  ['haldi-ceremonies', 'Haldi Ceremonies', 'Weddings', 'Sunshine, marigolds, and moments of pure happiness bathed in golden warmth.', 'haldi', 'Marigold backdrops|Yellow & citrus palettes|Playful seating concepts'],
  ['mehndi-events', 'Mehndi Events', 'Weddings', 'Vibrant festive corners for laughter, music, rich colors, and beautiful traditions.', 'mehndi', 'Vibrant lounge styling|Floral accents|Mehndi seating arrangements'],
  ['sangeet-celebrations', 'Sangeet Celebrations', 'Weddings', 'A joyful, high-energy evening with sparkling chandeliers and concert-grade stage lights.', 'sangeet', 'Stage styling|Festive lighting concepts|Celebration flow planning'],
  ['wedding-receptions', 'Wedding Receptions', 'Weddings', 'A magnificent, grand celebration welcoming your next chapter together.', 'reception', 'Reception stage concepts|Table & venue styling|Guest welcome arrangements'],
  ['naming-ceremonies', 'Naming Ceremonies', 'Other Events', 'A small name, a world of love, and a beautifully adorned floral cradle.', 'naming', 'Cradle & backdrop concepts|Gentle floral palettes|Family photo corners'],
  ['school-college-events', 'School & College Events', 'Other Events', 'Big milestones and shared memories celebrated with energetic stage setups.', 'v2-college', 'Stage & theme concepts|Welcome area styling|Event coordination'],
  ['cultural-events', 'Cultural Events', 'Other Events', 'Bring heritage, artistic performance, and classical tradition into the spotlight.', 'v2-cultural', 'Cultural stage concepts|Traditional decor|Gathering coordination']
].map(([slug, title, category, description, image, services]) => ({
  slug,
  title,
  category,
  description,
  image,
  services: services.split('|')
}));

export const gallery = [
  { image: 'wedding', title: 'Lavender & Ivory Mandap', category: 'Weddings', alt: 'AI concept of an outdoor luxury floral mandap with lavender and ivory flowers' },
  { image: 'reception', title: 'Grand Wisteria Ballroom', category: 'Weddings', alt: 'AI concept of a grand wedding reception ballroom with cascading wisteria and chandeliers' },
  { image: 'engagement', title: 'Blush & Rose Ring Stage', category: 'Weddings', alt: 'AI concept of an engagement ring ceremony with circular floral arch and velvet loveseat' },
  { image: 'sangeet', title: 'Sparkling Sangeet Night', category: 'Weddings', alt: 'AI concept of a glamorous Sangeet musical celebration stage with glittering lights' },
  { image: 'haldi', title: 'Sunlit Marigold Courtyard', category: 'Weddings', alt: 'AI concept of a traditional haldi ceremony with marigold garlands and brass urlis' },
  { image: 'mehndi', title: 'Carnival of Colors Lounge', category: 'Weddings', alt: 'AI concept of a vibrant festive mehndi celebration lounge with colorful drapes and floral swing' },
  { image: 'birthday', title: 'Lilac & Gold Balloon Magic', category: 'Birthdays', alt: 'AI concept of a pastel lilac and pale gold balloon arch and birthday cake table' },
  { image: 'baby', title: 'Soft Pastel Sweetness', category: 'Baby Showers', alt: 'AI concept of a charming baby shower setup with cream and sage balloons and floral backdrop' },
  { image: 'naming', title: 'Floral Cradle Welcome', category: 'Other Events', alt: 'AI concept of a traditional naming ceremony with ornate floral-decorated cradle' },
  { image: 'dinner', title: 'Under a Thousand Lights', category: 'Anniversaries', alt: 'AI concept of a candlelit garden dinner under fairy lights' },
  { image: 'corporate', title: 'Corporate Gala Stage', category: 'Corporate', alt: 'AI concept of an elegantly styled corporate event venue and presentation stage' },
  { image: 'housewarming', title: 'Traditional Griha Pravesh', category: 'Other Events', alt: 'AI concept of a traditional Indian housewarming entrance with marigold toran and rangoli' },
  { image: 'religious', title: 'Sacred Lotus & Brass Sanctuary', category: 'Religious', alt: 'AI concept of a traditional sacred pooja ceremony with lotus flowers and brass oil lamps' },
  { image: 'v2-private', title: 'Intimate Sunset Celebration', category: 'Other Events', alt: 'AI concept of an intimate private gathering with candlelit dinner styling' },
  { image: 'v2-college', title: 'Milestone Fest & Stage', category: 'Other Events', alt: 'AI concept of a dynamic college fest stage with lighting and banners' },
  { image: 'v2-cultural', title: 'Heritage & Classical Splendour', category: 'Other Events', alt: 'AI concept of a rich traditional Indian cultural event stage with floral garlands and brass lamps' },
  { image: 'our-story', title: 'Violet Ballroom & Floral Arch', category: 'Weddings', alt: 'AI concept of with circular floral arch and violet banquet lighting' },
];

gallery.push(...[
 ['v2-home-garden','The Garden Pavilion','Weddings','An airy ivory and lavender wedding pavilion in a garden'],
 ['v2-home-birthday','Peach & Lilac Party','Birthdays','A playful peach and lilac birthday dessert installation'],
 ['v2-home-gala','Midnight Blue Gala','Corporate','A midnight blue ballroom with elegant dinner tables'],
 ['v2-story-moodboard','A Palette in the Making','Other Events','An overhead collection of floral swatches and design materials'],
 ['v2-story-florist','The Floral Details','Other Events','Hands arranging a delicate floral composition'],
 ['v2-story-table','The Art of the Table','Anniversaries','A detailed lavender and ivory place setting'],
 ['v2-package-essential','The Veranda Gathering','Other Events','An intimate veranda lunch with delicate table styling'],
 ['v2-package-signature','The Glasshouse Romance','Weddings','A romantic floral reception in a glasshouse'],
 ['v2-package-royal','An Evening at the Palace','Weddings','A grand Indian palace courtyard celebration'],
 ['v2-contact-flowers','A Thoughtful Floral Moment','Other Events','A sculptural ivory and lavender floral arrangement'],
 ['v2-feature-coastal','A Sunset by the Sea','Anniversaries','A peach-toned seaside reception at sunset'],
 ['v2-feature-courtyard','The Courtyard Celebration','Weddings','An intimate marigold haldi ceremony in a terracotta courtyard']
].map(([image,title,category,alt])=>({image,title,category,alt:'AI concept: '+alt})));
export const recentEvents = []; // Reserved for approved client events; the journal uses explicitly labelled concept stories.

export const packages = [
  {
    name: 'Essential Celebration',
    image: 'v2-package-essential',
    description: 'For intimate gatherings, birthdays, and lovely little milestones that deserve thoughtful charm.',
    features: ['Event concept consultation', 'Backdrop design options', 'Decoration arrangement', 'Setup coordination', 'Dedicated team support']
  },
  {
    name: 'Signature Celebration',
    image: 'v2-package-signature',
    description: 'For personal details, expressive floral touches, and a beautifully connected look.',
    features: ['Personalised decoration concept', 'Floral design consultation', 'Stage & backdrop styling', 'Setup coordination', 'Custom entrance & photo corners']
  },
  {
    name: 'Royal Celebration',
    image: 'v2-package-royal',
    description: 'For grand occasions and milestone weddings with luxurious styling and meticulous coordination.',
    features: ['Premium styling concepts', 'Custom decoration direction', 'Floral & venue ceiling styling', 'Full-day detailed coordination', 'VIP lounge & mirrored aisle arrangements']
  }
];
