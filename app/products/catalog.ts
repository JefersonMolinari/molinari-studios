export type CatalogKind = 'product' | 'custom-order';

export type CatalogItem = {
  slug: string;
  title: string;
  description: string;
  note?: string;
  image: string;
  alt: string;
  sourceUrl: string;
  imagePosition?: string;
  kind: CatalogKind;
};

export const preferredInstagramDmUrl = 'https://ig.me/m/molinaristudios';
export const instagramProfileUrl = 'https://www.instagram.com/molinaristudios/';

// Change this one value to instagramProfileUrl if the direct route fails validation.
export const instagramDmUrl = preferredInstagramDmUrl;

export const catalogItems: CatalogItem[] = [
  {
    slug: 'personalized-collectible',
    title: 'Personalized Collectible',
    description:
      'A custom figure created from your photo—a personal gift or keepsake made just for you.',
    note: 'Made from your photo',
    image: '/products/personalized-collectible.webp',
    alt: 'Personalized 3D-printed collectible figure displayed for a customer gift',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/Dcgypi5tJ8F/',
    kind: 'product',
  },
  {
    slug: 'custom-team-crest',
    title: 'Custom Team Crest',
    description:
      'A dimensional club display made around the team, colors, and story you want to bring into your space.',
    note: 'Choose your team and colors',
    image: '/products/custom-team-crest.webp',
    alt: 'Black and white Vasco da Gama team crest displayed on a small stand',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DcgvmWONpdh/',
    kind: 'product',
  },
  {
    slug: 'rattan-style-tray',
    title: 'Rattan-Style Tray',
    description:
      'A textured decorative tray that adds warmth and useful organization to tables, vanities, and shelves.',
    note: 'Made to order',
    image: '/products/rattan-style-tray.webp',
    alt: 'Textured rattan-style decorative tray arranged on a styled surface',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DcgfqB4NyvF/',
    kind: 'product',
  },
  {
    slug: 'tissue-box-cover',
    title: 'Tissue Box Cover',
    description:
      'A considered cover that turns an everyday tissue box into a clean accent for home or office.',
    note: 'Custom colors available',
    image: '/products/tissue-box-cover.webp',
    alt: 'Decorative tissue box cover shown in a coordinated interior setting',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DceJvo4NS9A/',
    kind: 'product',
  },
  {
    slug: 'key-tray',
    title: 'Key Tray',
    description:
      'A compact place for keys, coins, and the small essentials you reach for every day.',
    note: 'Choose your color',
    image: '/products/key-tray.webp',
    alt: 'Saddle-stitched style key tray holding small everyday essentials',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DceIeXztRbn/',
    kind: 'product',
  },
  {
    slug: 'climber-wall-hooks',
    title: 'Climber Wall Hooks',
    description:
      'Playful climbing figures that work as wall hooks for keys, bags, purses, and accessories.',
    note: 'Choose your colors',
    image: '/products/climber-wall-hooks.webp',
    alt: 'Colorful climbing-figure wall hooks holding bags and accessories',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/Dcdz8izNIXj/',
    kind: 'product',
  },
  {
    slug: 'tent-lamp',
    title: 'Tent Lamp',
    description:
      'Camping-inspired decor with a warm glow for a desk, nightstand, bedroom, or cozy corner.',
    note: 'Customizable',
    image: '/products/tent-lamp.webp',
    alt: 'Tent-shaped decorative lamp glowing warmly in a cozy room',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DcdxT1LNLwR/',
    kind: 'product',
  },
  {
    slug: 'martial-arts-display',
    title: 'Martial Arts Display',
    description:
      'A personalized presentation piece that celebrates the gi, belts, and progress behind the practice.',
    note: 'Personalized name and belts',
    image: '/products/martial-arts-display.webp',
    alt: 'White martial-arts gi and colored belts on a personalized display stand',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DcbKA_Dm1f3/',
    imagePosition: 'center 45%',
    kind: 'product',
  },
  {
    slug: 'custom-event-medals',
    title: 'Custom Event Medals',
    description:
      'A tailored medal set created for the Vancouver Beach Tennis Open—an example of custom work for tournaments, teams, and events.',
    note: 'Custom order example',
    image: '/products/custom-event-medals.webp',
    alt: 'Custom first- and second-place medals made for the Vancouver Beach Tennis Open',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DcbJhquG96x/',
    kind: 'custom-order',
  },
];

export const products = catalogItems.filter((item) => item.kind === 'product');
export const customOrder = catalogItems[catalogItems.length - 1];
