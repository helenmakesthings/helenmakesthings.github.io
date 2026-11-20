/* ============================================================
   HELEN MAKES THINGS — everything you edit lives in this file.
   Change text here, save, refresh the page.
   ============================================================ */

const SITE = {
  name: "Helen Makes Things",
  tagline: "Collage, paint, clay, thread & one-offs.\nMade by hand, broadcast from the studio.",
  email: "hello@helenmakesthings.com", // <- your contact email (used by Inquire + Commissions)
  instagram: "https://www.instagram.com/helenmakesthings/", // <- full link, e.g. "https://instagram.com/yourname" (blank hides it)
  showWorkshops: true,                  // <- false hides Workshops from the menu
  commissionsOpen: true,
  ticker: [
    "Now showing", "Originals", "Commissions open",
    "One of one", "Made by hand"
  ],
};

/* ------------------------------------------------------------
   ARTWORK  (listed in the order they appear on the site)
   medium:  "collage" | "painting" | "illustration" | "textile" | "ceramics" | "photo"
   status:  "original"  one-of-a-kind, for sale
            "print"     reproduction, for sale (can have size options)
            "sold"      shown in the portfolio with a SOLD tag
            "archive"   portfolio only, not for sale
   images:  photos in the images folder. The first one is the cover.
            A cover ending in -cut.webp is a cut-out (no background) and gets a clean backdrop on the site.
            For the neatest cards, crop the cover to 4:5 (e.g. 1000 x 1250)
            with the piece centered and an even border around it.
   details: medium and materials, e.g. "Paper collage on wood block"
   size:    dimensions, e.g. "4 × 4 × 1 in" (width × height × depth). Blank hides it.
   year:    leave "" to hide it
   buy:     price: a number like 120, or null to show "Ask about this piece"
            link:  paste a Stripe Payment Link. Blank = email inquiry.
   ------------------------------------------------------------ */
const WORKS = [
  {
    id: "manatee", title: "Manatee & Calf", medium: "collage", year: "",
    details: "Paper collage on wood block · stands or hangs", status: "original",
    size: "4 × 4 × ⅜ in",
    images: ["images/manatee-cut.webp", "images/manatee-2.jpg"],
    blurb: "A manatee and her calf drift through a torn-paper sea, with seagrass growing up from the edges. Mounted on a small wooden block that can stand on a shelf or hang on the wall.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
  {
    id: "garden-in-bloom", title: "Garden in Bloom", medium: "collage", year: "",
    details: "Paper collage on wood block · stands or hangs", status: "original",
    size: "4 × 4 × ⅜ in",
    images: ["images/garden-in-bloom-cut.webp", "images/garden-in-bloom-2.jpg"],
    blurb: "A dense little garden of cut-paper flowers in pink, red, blue and white, layered over mossy greens. Mounted on a wooden block that can stand on a shelf or hang on the wall.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
  {
    id: "tide-pool", title: "Tide Pool", medium: "collage", year: "",
    details: "Paper collage on wood block · stands or hangs", status: "original",
    size: "4 × 4 × ⅜ in",
    images: ["images/tide-pool-cut.webp", "images/tide-pool-2.jpg"],
    blurb: "Turquoise creatures, like something under a microscope, scattered across a rocky shoreline of silver and blue paper. Mounted on a wooden block that can stand on a shelf or hang on the wall.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
  {
    id: "lantern-bearer", title: "The Lantern Bearer", medium: "painting", year: "",
    details: "Acrylic on canvas panel", status: "original",
    size: "7 × 5 in",
    images: ["images/lantern-bearer-cut.webp", "images/lantern-bearer-2.jpg"],
    blurb: "A hooded figure carries a lantern through deep blue night, its glow spilling yellow and pink across the ground.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
  {
    id: "meadow", title: "Meadow Under Cumulus", medium: "painting", year: "",
    details: "Acrylic on canvas panel", status: "original",
    size: "7 × 5 in",
    images: ["images/meadow-cut.webp", "images/meadow-2.jpg"],
    blurb: "Green hills under a big lilac cloud, with a field of pink and blue wildflowers in the foreground.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
  {
    id: "blue-pups", title: "Awoooo: Blue Pup Studies", medium: "illustration", year: "",
    details: "Ink and watercolor on paper", status: "original",
    size: "7 × 5 in",
    images: ["images/blue-pups-cut.webp", "images/blue-pups-2.jpg"],
    blurb: "A page of fluffy blue pups sleeping, trotting, sniffing and howling. One sketchbook-style original.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
  {
    id: "wildflower-crescent", title: "Wildflower Crescent", medium: "textile", year: "",
    details: "Hand embroidery in wooden hoop", status: "original",
    size: "6 in hoop",
    images: ["images/wildflower-crescent-cut.webp", "images/wildflower-crescent-2.jpg"],
    blurb: "A crescent of hand-stitched flowers, wheat and leaves in coral, blush, sage and moss, worked in long-and-short stitch. Comes ready to hang in its hoop.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
  {
    id: "rainbow-hanging", title: "Soft Rainbow Wall Hanging", medium: "textile", year: "",
    details: "Yarn-wrapped cord with cotton fringe", status: "original",
    size: "12.5 × 17.5 × 1 in",
    images: ["images/rainbow-hanging-cut.webp", "images/rainbow-hanging-2.jpg", "images/rainbow-hanging-3.jpg"],
    blurb: "Six bands of blush, ochre, cream and gray, wrapped by hand and finished with fluffy cotton fringe. Perfect for a nursery.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
  {
    id: "bunny-cross-stitch", title: "Bunny Cross-Stitch", medium: "textile", year: "",
    details: "Cross-stitch in wooden hoop", status: "archive",
    size: "6 in hoop",
    // Portfolio only: this is a well-known trademarked character, so it isn't safe to sell.
    images: ["images/bunny-cross-stitch-cut.webp", "images/bunny-cross-stitch-2.jpg"],
    blurb: "A favorite bunny in a blue dress, stitched for fun. Not for sale, but I take commissions for original cross-stitch designs.",
    buy: [],
  },
  {
    id: "palette-and-cup", title: "Painter's Palette & Brush Cup", medium: "ceramics", year: "",
    details: "Handbuilt stoneware · palette with matching water cup", status: "original",
    size: "7 × 5 × 2.5 in",
    images: ["images/palette-and-cup-1.jpg", "images/palette-and-cup-2.jpg", "images/palette-and-cup-3.jpg"],
    blurb: "A wobbly-edged mixing palette with nine wells and a cup that sits in its own nook, glazed in creamy white with a drippy brown-speckled cup. Made for watercolor.",
    buy: [{ label: "Buy the set", price: null, link: "" }],
  },
  {
    id: "diamond-dishes", title: "Diamond Trinket Dishes (pair)", medium: "ceramics", year: "",
    details: "Handbuilt ceramic · set of two", status: "original",
    size: "4 × 2 × ½ in (each)",
    images: ["images/diamond-dishes-cut.webp", "images/diamond-dishes-2.jpg", "images/diamond-dishes-3.jpg"],
    blurb: "Two little diamond dishes, half white and half shimmering gold-ochre. Just right for rings and earrings.",
    buy: [{ label: "Buy the pair", price: null, link: "" }],
  },
  {
    id: "bud-vase", title: "Sea Glass Bud Vase", medium: "ceramics", year: "",
    details: "Wheel-thrown stoneware", status: "original",
    size: "2¼ × 2¼ × 3 in · about 1 in opening",
    images: ["images/bud-vase-1.jpg"],
    blurb: "A small bud vase in soft sea-green and lilac glaze. Big enough for a single stem.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
  {
    id: "storm-mug", title: "Storm Mug", medium: "ceramics", year: "",
    details: "Wheel-thrown stoneware", status: "original",
    size: "3½ in tall · holds 8 oz",
    images: ["images/storm-mug-1.jpg"],
    blurb: "A round-bellied mug dipped in pale gray over matte black, with a diagonal line where the glazes meet.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
  {
    id: "celadon-mug", title: "Crackle Celadon Mug", medium: "ceramics", year: "",
    details: "Wheel-thrown stoneware", status: "original",
    size: "3½ in tall · holds 10 oz",
    images: ["images/celadon-mug-1.jpg"],
    blurb: "A warm olive-celadon mug with a fine crackle glaze that catches the light.",
    buy: [{ label: "Buy original", price: null, link: "" }],
  },
];

/* ------------------------------------------------------------
   ABOUT PAGE
   Anything in [square brackets] is a spot for you to fill in.
   Type \n inside the quotes to start a new line.
   Delete a paragraph or FAQ entry to remove it from the page.
   ------------------------------------------------------------ */
const ABOUT = {
  photo: "",          // <- e.g. "images/me.jpg" (a portrait or studio shot). Blank shows a "no signal" screen.
  photoCaption: "Live from the studio",
  bio: [
    "Hi, I'm Helen.\nAll things made by me, a ho of all hobbies.",
    "I'm attempting to craft my way through all the hobbies. It usually starts with \"how hard can it be?\" and ends with a table covered in paper scraps, clay dust and tangled thread. Every new craft means new mistakes, new tricks and something weird and wonderful at the end.",
    "What you see here is the stuff that turned out well: torn-paper collages, little acrylic paintings, embroidery, wall hangings and a growing shelf of mugs and dishes. I love bright color, small scale, and the slightly wobbly charm of things made by hand. Nearly everything here is one of one. Once it's gone, it's gone.",
    "Currently based in Austin, TX; I have had a penchant for crafting and meddling since childhood. Follow along on Instagram to see what I'm trying next.",
  ],
  // Hobbies tried so far. Shown as a scoreboard on the About page; add each new one here.
  hobbies: ["Paper collage", "Painting & Watercolor", "Ink drawing", "Embroidery", "Cross-stitch", "Macramé",
            "Pottery & Sculpture", "Mosaics", "Candle making", "Water marbling", "Rug tufting", "Cyanotype", "Sketches", "Photography", "Cooking,", "Metal Embossing", "Jewelry-making","Polymer Clay", "Cooking", "Ikebana & Flower Arranging", "Wood Carving & Woodworking", "Glassblowing", "Stained Glass", "Cake Decorating", "Candle Making", "Kintsugi", "Felting", "Arduino", "Wreath Making", "Knitting & Crocheting", "Sewing & Costume Fabrication", "Linocut"],
  pickupArea: "",     // <- e.g. "Portland, OR". Blank just says "local pickup".
  shipping: "I ship within the US. Every piece is wrapped by hand and usually goes out within 5 business days.",
  pickup: "Local? Choose pickup and we'll arrange a time by email. No shipping cost.",
  returns: "Because every piece is one of a kind, all sales are final.",
  damage: "If something arrives damaged, email me photos within 7 days and I'll make it right with a repair, replacement or refund.",
  faq: [
    ["Is everything really one of a kind?", "Yes. Unless it's marked as a print, there's only one. Pairs and sets are sold together."],
    ["How do I care for the ceramics?", "Hand-washing is kindest to handmade pottery. If you want to know whether a particular piece is microwave or dishwasher safe, just ask."],
    ["How do I care for the collages and embroidery?", "Keep them out of direct sunlight and away from damp, and dust gently with a soft dry brush."],
    ["Can the block collages hang on a wall?", "Yes. They can stand on a shelf or hang on the wall."],
    ["Can you make something custom?", "Yes. Head to the Commissions page and tell me your idea."],
    ["Do you teach workshops?", "Not yet, but they're on the way! Follow me on Instagram to hear first when they open."],
    ["Do you ship outside the US?", "Not right now, sorry! US shipping and local pickup only."],
  ],
};

/* ------------------------------------------------------------
   WORKSHOPS — while this list is empty, the page says "Coming Soon".
   To list a workshop, add one between the [ ] like this example:
   {
     title: "Intro to Linocut", date: "Sat, Jan 17, 2027",
     place: "Austin, TX", length: "3 hours", price: 65, spots: "8 spots",
     link: "",   // <- paste a Stripe Payment Link to take bookings
     blurb: "What people will make and what's included.",
   },
   ------------------------------------------------------------ */
const WORKSHOPS = [
];

const CURRENCY = "$";
