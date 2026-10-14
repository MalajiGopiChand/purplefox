export const site = { name: 'Purple Fox Event Planners', phone: '917075505617', displayPhone: '+91 70755 05617', instagram: 'https://www.instagram.com/purplefox_planners/', origin: 'https://purple-fox-celebrations.snappy-hawk-7137.chatgpt.site' };
export const events = [
 ['wedding-events','Wedding Events','Weddings','A beautiful beginning, thoughtfully brought to life.','wedding','Mandap & aisle styling|Floral palettes|Ceremony coordination'],
 ['birthday-parties','Birthday Parties','Birthdays','A little wonder. A lot of joy. A celebration that feels like you.','birthday','Personalised themes|Cake table styling|Balloon & backdrop concepts'],
 ['baby-showers','Baby Showers','Baby Showers','Sweet little details for a wonderful new chapter.','baby','Soft pastel palettes|Welcome & photo corners|Intimate gathering styling'],
 ['corporate-events','Corporate Events','Corporate','Considered experiences that bring people and ideas together.','corporate','Brand-led styling|Stage & presentation concepts|Guest flow planning'],
 ['anniversary-celebrations','Anniversary Celebrations','Anniversaries','Celebrate your story with an evening made for memories.','dinner','Candlelit tables|Romantic floral styling|Personalised celebration concepts'],
 ['housewarming-events','Housewarming Events','Other Events','A warm welcome to a place filled with new possibilities.','wedding','Entrance flowers|Intimate guest arrangements|Traditional decoration concepts'],
 ['private-celebrations','Private Celebrations','Other Events','Gather your favourite people. We’ll help set the scene.','dinner','Dinner table styling|Personal themes|Ambient lighting concepts'],
 ['religious-events','Religious Events','Religious','Meaningful traditions, celebrated with care and respect.','haldi','Traditional floral decoration|Ceremony space styling|Setup coordination'],
 ['engagement-ceremonies','Engagement Ceremonies','Weddings','The first yes deserves a beautiful setting.','wedding','Ring ceremony backdrop|Floral photo corners|Intimate stage styling'],
 ['haldi-ceremonies','Haldi Ceremonies','Weddings','Sunshine, marigolds and moments of pure happiness.','haldi','Marigold backdrops|Yellow & citrus palettes|Playful seating concepts'],
 ['mehndi-events','Mehndi Events','Weddings','Colourful corners for laughter, music and beautiful traditions.','haldi','Vibrant lounge styling|Floral accents|Mehndi seating arrangements'],
 ['sangeet-celebrations','Sangeet Celebrations','Weddings','A joyful evening with a little sparkle and plenty of rhythm.','dinner','Stage styling|Festive lighting concepts|Celebration flow planning'],
 ['wedding-receptions','Wedding Receptions','Weddings','A memorable welcome to your next chapter together.','dinner','Reception stage concepts|Table & venue styling|Guest welcome arrangements'],
 ['naming-ceremonies','Naming Ceremonies','Other Events','A small name. A whole world of love.','baby','Cradle & backdrop concepts|Gentle floral palettes|Family photo corners'],
 ['school-college-events','School & College Events','Other Events','Big milestones and shared memories, beautifully celebrated.','corporate','Stage & theme concepts|Welcome area styling|Event coordination'],
 ['cultural-events','Cultural Events','Other Events','Bring community, creativity and tradition into the spotlight.','haldi','Cultural stage concepts|Traditional decor|Gathering coordination']
].map(([slug,title,category,description,image,services])=>({slug,title,category,description,image,services:services.split('|')}));
export const gallery = [
 {image:'wedding',title:'A garden of forever',category:'Weddings',alt:'AI concept of a garden wedding mandap with lavender and ivory flowers'},
 {image:'birthday',title:'A little birthday magic',category:'Birthdays',alt:'AI concept of a pastel balloon birthday backdrop and cake table'},
 {image:'dinner',title:'Under a thousand lights',category:'Anniversaries',alt:'AI concept of a candlelit garden dinner under fairy lights'},
 {image:'baby',title:'The sweetest beginning',category:'Baby Showers',alt:'AI concept of a soft pastel baby shower setting'},
 {image:'haldi',title:'A touch of sunshine',category:'Religious',alt:'AI concept of a marigold ceremonial setting'},
 {image:'corporate',title:'An evening of connection',category:'Corporate',alt:'AI concept of an elegantly styled corporate event venue'},
 {image:'dinner',title:'Gathered with love',category:'Other Events',alt:'AI garden dinner concept for a private celebration'},
 {image:'haldi',title:'Marigolds & memories',category:'Weddings',alt:'AI marigold decoration concept for a haldi ceremony'}
];
export const recentEvents = []; // Add only approved, completed client events. See README.md.
export const packages = [
 {name:'Essential Celebration',image:'birthday',description:'For intimate gatherings and lovely little moments.',features:['Event concept consultation','Backdrop design options','Decoration arrangement','Setup coordination']},
 {name:'Signature Celebration',image:'wedding',description:'For personal details and a beautifully connected look.',features:['Personalised decoration concept','Floral design consultation','Stage & backdrop styling','Setup coordination','Additional styling options']},
 {name:'Royal Celebration',image:'dinner',description:'For grand occasions with a considered touch at every turn.',features:['Premium styling concepts','Custom decoration direction','Floral & venue styling','Detailed coordination','Personalised arrangements']}
];
