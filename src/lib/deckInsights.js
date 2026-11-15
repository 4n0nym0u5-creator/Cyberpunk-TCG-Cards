/**
 * Gallery-wide power ranking + play commentary.
 * Contender scores weight the top end; community lists ranked by archetype strength vs that meta.
 */

/** @typedef {{ galleryRank: number, strategy: string, combos: string, powerInsight: string }} DeckInsight */

/** @type {Record<string, DeckInsight>} */
export const DECK_INSIGHTS = {
  'smasher-dumdum-streetkid': {
    galleryRank: 1,
    strategy:
      'Play the Eddie clock: sell early, Call to flip Smasher, and hold Gear for the turn you Go Solo or swing a Rockn’/Yorinobu body past 10. Streetkid recycles Braindance so you never soft-brick on All is Lost / Bonnie. Against BBG, pressure Gigs before Towerfall locks the board; against mirrors, Faceplate + Dum Dum pumps win the race.',
    combos:
      'Rockn’ + Mantis (or Satori) for a turn-3 10-power steal · Faceplate on a face-up Legend for free Gig nudges/draws · Go Solo Smasher with Mantis already equipped for an 11-power double Gig swing · Streetkid Braindance fetch after you trash Industrial Assembly turn 1.',
    powerInsight:
      'Gallery #1 — Contender score 64 and ~16% share. Clearest “answer to BBG” that still closes games itself. Cheap staples, high floor, and the best-documented win lines in Standard.',
  },
  'bbg-alt-hanako-jackie': {
    galleryRank: 2,
    strategy:
      'You are the deck to beat: tuck threats with Pyramid Song / Les Élémens / Towerfall, draw off Hanako value-pairs, and stall into late Programs. Sell dead early cards for Eddies, keep Floor It for 10+ attackers, and side Riot Shield / Placide vs Smasher Go Solo lines.',
    combos:
      'Hanako spend after you create a Gig pair · Trust No One + Pyramid Song on the min d4 · Towerfall double-mode once Street Cred is high · Maman Brigitte tuck into an unequipped Unit · Jackie Pour feeding Blue RAM 4 for Les Élémens / Towerfall.',
    powerInsight:
      'Gallery #2 — Contender Tier 1 (~10% share) and the format’s control pillar. Slightly behind RRY on Contender score, but every other shell is measured against this stack.',
  },
  'community-deathmonkey-bbg': {
    galleryRank: 3,
    strategy:
      'Same BBG spine as Contender #4 with denser Units (Valentino, Rogue Queen) and Memory Relapse instead of Take Control. Curve tempo Units, protect the d4, and grind with Hanako draws. Relapse buys a turn against Smasher attackers.',
    combos:
      'Valentino into Pepe for mid Gig pressure · Memory Relapse on a spent rival Unit before your attack · Rogue Queen as a 5-drop that survives small Towerfalls · classic Pyramid / Towerfall close.',
    powerInsight:
      'Gallery #3 — Fully published BBG list that improves the Contender shell’s Unit density. Expect it to overperform the stock guide into Gear races.',
  },
  'dexter-muamar-streetkid': {
    galleryRank: 4,
    strategy:
      'Gig-race midrange: Fixer Legends (Dexter/Muamar) plus Streetkid engine. Curve cheap yellow Gear, keep Streetkid ready to recycle Braindance, and force BBG to answer mid Units before Towerfall comes online.',
    combos:
      'Adrenaline / Gorilla / Faceplate stacking on Meredith or Rockn’ · Streetkid Braindance loops · Muamar Gig tools into Dexter Off the Grid value.',
    powerInsight:
      'Gallery #4 — Contender #2 (score 59). The “other” Tier-1 RYY axis: less raw Smasher ceiling than #1, more consistent midgame.',
  },
  'smasher-saburo-streetkid': {
    galleryRank: 5,
    strategy:
      'Arasaka midrange-control: Saburo buffs Arasaka attackers, Streetkid digs, Smasher closes. Play for board clears into a Go Solo finish rather than pure Gear race.',
    combos:
      'Satori draw loops on Arasaka Units · Saburo attack buff into Yorinobu / Swordwise · Go Solo Smasher after the board is soft · Streetkid Braindance recursion.',
    powerInsight:
      'Gallery #5 — Contender #3. Lower share than RRY/BBG but a high Contender score and a clean midrange plan.',
  },
  'community-arasaka-9s': {
    galleryRank: 6,
    strategy:
      'GRR Arasaka midrange with Saburo + Yorinobu Embracing Destruction + Smasher. Curve Field Operator / Pepe / Valentino, equip Satori/Radioport, and convert removal (All is Lost, Bonnie, Carnage) into Gig swings.',
    combos:
      'Swordwise + Satori or Radioport · Yorinobu Steel Dragon as a 7-drop finisher under Saburo · Peace Offering / We Gotta for green glue · Smasher as the shared closer.',
    powerInsight:
      'Gallery #6 — Best published community Arasaka list in the gallery. Sits just under Contender Saburo shells; Minotaur + Pepe package is real into midrange.',
  },
  'community-varela-bbg-judy': {
    galleryRank: 7,
    strategy:
      'GBB Judy tempo: Jackie + Judy + Hanako. Blue Units do the racing; Peace Offering is the green splash; Judy’s Braindance engine replaces some Hanako draws when pairs are contested.',
    combos:
      'Judy Braindance pump into Three Mouths / Chrome Reverie · Peace Offering value into Hanako pairs · Delamain / Jacked-In into Lizzy / Maman curve · Unlikely Bond / Les Élémens as soft locks.',
    powerInsight:
      'Gallery #7 — Strong BBG cousin with a Judy engine. Slightly less “deck to beat” than Alt/Hanako/Jackie, but excellent into mirrors and Gear when the d4 cooperates.',
  },
  'smasher-judy-streetkid': {
    galleryRank: 8,
    strategy:
      'Hybrid Gig-race: Streetkid + Judy Braindance midrange with Smasher as the hammer. Mulligan for early Programs and a body that can wear Gear.',
    combos:
      'Judy Braindance into red removal · Smasher Go Solo after Judy has ground out cards · Streetkid fetch after you feed the trash.',
    powerInsight:
      'Gallery #8 — High Contender score but Tier 2 by share floor. Explosive when it works; less consistent than pure RRY or BBG.',
  },
  'alt-jackie-judy': {
    galleryRank: 9,
    strategy:
      'Blue-leaning control without Hanako: tuck, draw, and finish with Judy Unit / Placide-sized bodies. Respect RAM — Judy Unit wants Blue RAM 5+.',
    combos:
      'Alt tuck suite into Jackie Blue RAM · Judy Nothing to Doubt as a late free-play engine · Towerfall / Pyramid Song as the soft lock.',
    powerInsight:
      'Gallery #9 — Contender Tier 2 with solid share. Loses Hanako’s pair draws vs classic BBG; gains Judy’s Braindance payoff.',
  },
  'smasher-alt-streetkid': {
    galleryRank: 10,
    strategy:
      'Midrange-control hybrid: Alt disruption early, Streetkid recursion, Smasher late. Play like a control deck until you can afford the Go Solo.',
    combos:
      'Alt Programs into Streetkid Braindance · Smasher as the shared finisher · blue tuck answering Gear Units.',
    powerInsight:
      'Gallery #10 — Contender Tier 2 hybrid. Flexible, but can be a master-of-none between RRY speed and BBG locks.',
  },
  'community-roguelite': {
    galleryRank: 11,
    strategy:
      'Yellow-blue midrange: River/Rogue yellow Gear spine with V: Corporate Exile for blue programs. Equip early, Safety Override for tempo, Caliber from the side for mirrors.',
    combos:
      'River free Gear into Faceplate / Adrenaline · Chrome Reverie / Nocturne with Corporate Exile RAM · Bootleg Black Sapphire as yellow Braindance · Placide as the blue hammer.',
    powerInsight:
      'Gallery #11 — Clean published YB list. Not Contender top-10 by results, but a coherent midrange plan that steals games from pure Gear.',
  },
  'community-smasher-dumdum-river-gear': {
    galleryRank: 12,
    strategy:
      'Popular Gear race with Smasher instead of Royce: Dum Dum pumps, River discounts Gear, Smasher closes. Curve Rockn’ / Bombus / 6th Street, stack Faceplate + Adrenaline, and time Detonate / Aftermath for contested Gigs.',
    combos:
      'River into Faceplate or Adrenaline for near-free pumps · Dum Dum spend pump on a geared Rockn’ · Bootleg Black Sapphire as yellow Braindance · Go Solo Smasher after the board is soft · Aftermath / Detonate as the race tools.',
    powerInsight:
      'Gallery #12 — Table-photo Gear shell on the ripperdeck-popular Dum Dum/River axis with Smasher as the finisher. High builder popularity; Contender results still trail RRY #1 and BBG.',
  },
  'community-rocking-sweet-gear': {
    galleryRank: 13,
    strategy:
      'Johnny / Kerry / Royce Gear aggro: equip early Rockerboys, Deadman / Heist for disruption, Minotaur side for fat midrange mirrors.',
    combos:
      'Rockn’ + Mantis/Satori · Deadman Transmitter value · The Heist yellow payoff · Royce as the red closer.',
    powerInsight:
      'Gallery #13 — Fun, fully listed Gear aggro. Strong into slow decks; struggles more than RRY into optimized BBG.',
  },
  'community-rogue-kerry-royce-table': {
    galleryRank: 14,
    strategy:
      'Same RYY Gear family as Rocking sweet Gear, with Rogue Preem Solo instead of Johnny. Lean on Negotiators / Rockn’ / Offduty and yellow Aftermath / Bootleg.',
    combos:
      'Rogue Solo value into equipped Units · Gorilla / Mandibular stacks · Over the Edge for high Gigs · Royce finish.',
    powerInsight:
      'Gallery #14 — Solid table reconstruction. Slightly less explosive than Johnny-legend Gear; still a real midrange Gear plan.',
  },
  'jackie-mama-johnny-streetkid': {
    galleryRank: 15,
    strategy:
      'Red Gig pressure with Mama’s Favorite / Johnny / Streetkid. Attack for Gigs early and keep Streetkid ready to recycle Programs.',
    combos:
      'Johnny Never Stop Fighting bodies · Bonnie and Clyde / Over the Edge race tools · Streetkid Braindance.',
    powerInsight:
      'Gallery #15 — Contender Tier 2, low share. Clear attack plan; lacks the Contender ceiling of RRY/BBG.',
  },
  'smasher-dexter-hanako': {
    galleryRank: 16,
    strategy:
      'Unusual red/green mix: Dexter midrange into Hanako draws, Smasher closes. Mulligan for a coherent color stretch.',
    combos:
      'Dexter Fixer tools · Hanako pair draws · Smasher as the shared finisher.',
    powerInsight:
      'Gallery #16 — Contender Tier 2 climber. Flexible but awkward RAM; more “spicy” than optimal.',
  },
  'smasher-dexter-muamar': {
    galleryRank: 17,
    strategy:
      'Accessible Smasher shell: Dexter + Muamar do the midgame, Smasher bombs late. Good learning deck for Gear midrange.',
    combos:
      'Yellow Gear race into Smasher · Fixer midrange value · same RYY spine as popular Gear lists.',
    powerInsight:
      'Gallery #17 — Contender’s “beginner” Smasher shell. Approachable, but the least scary Contender top-10 seat in this gallery.',
  },
};

export const GALLERY_RANKING_NOTE =
  'Gallery power ranking blends TCG Contender Standard scores/share with published guides and how community lists sit on those archetypes. Contender still leads; BBG remains the deck to beat; Gear shells are popular on ripperdeck but trail Contender top results. Snapshot ~Nov 2026 — early meta before Night City Showdowns settle.';

export function insightForDeck(id) {
  return DECK_INSIGHTS[id] || null;
}

export function withDeckInsights(deck) {
  const insight = insightForDeck(deck.id);
  if (!insight) return deck;
  return { ...deck, ...insight };
}
