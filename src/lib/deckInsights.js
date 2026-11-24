/**
 * Gallery-wide power ranking + play commentary.
 * Contender scores weight the top end; community lists ranked by archetype strength vs that meta.
 */

/**
 * @typedef {{ title: string, body: string }} StrategySection
 * @typedef {{
 *   galleryRank: number,
 *   strategy: string,
 *   combos: string,
 *   powerInsight: string,
 *   strategyDetail?: StrategySection[],
 * }} DeckInsight
 */

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
    strategyDetail: [
      {
        title: 'Core game plan',
        body: 'You win by racing Gigs with geared Units before BBG’s Towerfall / Pyramid Song soft-locks the board. Every turn should advance at least one of: (1) put a body on board that can wear Gear, (2) equip that body past 10 power, (3) Call / Streetkid toward Smasher, (4) steal contested Gigs with All is Lost / Bonnie / Over the Edge / Carnage. Do not “fair midrange” into control — if you miss early pressure, sell late cards for Eddies and rebuild a 10+ attacker the same turn you Answer their Floor It window.',
      },
      {
        title: 'Legend roles (play order matters)',
        body: 'Dum Dum: early Call priority — his Spend pumps and Gear synergy make Rockn’ / Negotiators / Animals real threats. V: Streetkid: Braindance recursion after you feed the trash (Industrial Assembly turn 1 is the classic feed); keep her face-up before you soft-brick on All is Lost / Bonnie. Adam Smasher: late Call — Go Solo with Mantis (or Satori) already equipped is the double-Gig closer. Sequence Calls Dum Dum → Streetkid → Smasher unless you already have a geared body and need the Go Solo this turn.',
      },
      {
        title: 'Opening & mulligan',
        body: 'Keep hands with a cheap Unit (Rockn’, Negotiators, 6th Street, Animals), a Gear piece (Mantis / Satori / Faceplate), and either a sellable Industrial Assembly or an early Call path. Mulligan pure Program hands with no body. Going first (2 €$): Unit or Call+cheap play — Faceplate on a face-up Legend is a free Gig nudge/draw engine once Dum Dum or Streetkid is up. Going second (4 €$): Call Dum Dum → Rockn’ or Negotiators → equip Mantis/Satori if Eddies allow is the gold curve toward a turn-2/3 Gig steal. Never mulligan away both Mantis and Satori.',
      },
      {
        title: 'Sample early turns',
        body: 'Turn 1: Sell Industrial Assembly if you need Eddies, Call Dum Dum (or Streetkid if Dum Dum is buried), play Rockn’ / Negotiators / 6th Street. If Faceplate is in hand and a Legend is face-up, equip it for the free Gig nudge. Turn 2: Equip Mantis or Satori on the live body and attack for Gigs; second Call if you can afford Streetkid. Hold Appetite / Over the Edge only if the attack already clears 10 power — otherwise sell or wait. Turn 3: Yorinobu Steel Dragon as the mid hammer, or stack Faceplate + Dum Dum pump on Rockn’ for a 10+ steal. Turn 4–5: Call Smasher, equip leftover Mantis, Go Solo into two Gigs. If BBG showed Pyramid / Towerfall early, pivot to racing Gigs now — do not sit and draw.',
      },
      {
        title: 'Key combos (this list)',
        body: 'Rockn’ + Mantis/Satori: turn-2/3 10-power Gig steal — the deck’s bread and butter. Faceplate on Dum Dum/Streetkid: recurring Gig nudges and draws while you curve Units. Dum Dum Spend pump: push a geared Rockn’ / Animals / Negotiators over the Floor It / Riot Shield line. Industrial Assembly → Streetkid Braindance: trash the Assembly, fetch All is Lost / Bonnie / Appetite when you need the race tool. Go Solo Smasher + Mantis: 11-power double Gig finish after the board is soft. Yorinobu + Satori: midrange brick that forces BBG to spend Song / Maman / Les Élémens. All is Lost / Bonnie / Carnage / Over the Edge: close contested Gigs the turn after a geared attack softens them.',
      },
      {
        title: 'Midgame & closing',
        body: 'Once you have one geared attacker and Streetkid online, stop banking “value” and start converting Gigs. Prefer attacking over developing a second body if BBG is loading Programs. Save one disruption spell for the turn they try to stabilize with Peace Offering / Trust No One. Close with either (a) Go Solo Smasher into the last Gigs, or (b) Over the Edge / Carnage after a Faceplate-pumped Unit already contested the board. If you flood with Gear, sell the second Satori/Mantis for Eddies to Call Smasher on curve.',
      },
      {
        title: 'Matchups',
        body: 'vs BBG / DeathMonkey / Judy BBG (Gallery #2–3, #8): You must be the aggressor. Pressure Gigs before Towerfall; keep Floor It ranges in mind (they leave 1–2 €$). Prefer going first. Do not walk unequipped Units into Maman. vs YYR / River Gear (Gallery #4, #13): Faceplate + Dum Dum pumps win races; watch Johnny + Adrenaline Converter; Smasher Go Solo breaks stalls. vs Arasaka midrange (Gallery #6–7): Race before Minotaur/Yorinobu stick; All is Lost the Arasaka brick. vs RogueLite / YB: Your Gear density outpaces theirs — equip first, then fight Gigs.',
      },
      {
        title: 'Common mistakes',
        body: 'Calling Smasher before Dum Dum/Streetkid when you have no Gear ready. Equipping Mantis onto a Unit that will die to Pyramid Song the same turn — bait Song with a chump, then re-equip. Attacking for less than 10 into open Floor It. Holding Industrial Assembly in hand instead of selling/trashing it for Streetkid. Going wide into Les Élémens / Towerfall instead of one fat attacker. Forgetting Faceplate’s Legend trigger because you played Gear before Calling.',
      },
    ],
  },
  'bbg-alt-hanako-jackie': {
    galleryRank: 2,
    strategy:
      'You are the deck to beat: tuck threats with Pyramid Song / Les Élémens / Towerfall, draw off Hanako value-pairs, and stall into late Programs. Sell dead early cards for Eddies, keep Floor It for 10+ attackers, and side Riot Shield / Placide vs Smasher Go Solo lines.',
    combos:
      'Hanako spend after you create a Gig pair · Trust No One + Pyramid Song on the min d4 · Towerfall double-mode once Street Cred is high · Maman Brigitte tuck into an unequipped Unit · Jackie Pour feeding Blue RAM 4 for Les Élémens / Towerfall.',
    powerInsight:
      'Gallery #2 — Contender Tier 1 (~10% share) and the format’s control pillar. Slightly behind RRY on Contender score, but every other shell is measured against this stack.',
    strategyDetail: [
      {
        title: 'Core game plan',
        body: 'You win by owning Gig math and answering threats, not by racing power. Each turn: (1) create or protect a min Gig (value 1), (2) complete Hanako value-pairs for free draws, (3) tuck or freeze their best attacker (Pyramid Song, Les Élémens, Towerfall, Maman, Take Control / Memory Relapse), (4) only then steal Gigs with Pepe / Lizzy / Jacked-In. Stock Contender BBG is Program-heavier than DeathMonkey — lean on Song / Élémens / Towerfall / Floor It, and bring Riot Shield / Placide / Modded Kusanagi from the side vs Go Solo Gear.',
      },
      {
        title: 'Legend roles (play order matters)',
        body: 'Jackie Pour One Out: first Blue Unit/Gear each turn may drop a friendly Gig by up to 2 and draw on a new min Gig — Call her early and play Blue Units only while she is face-up. Hanako: free draw each turn per value-pair; Spend swaps Gigs to finish pairs, reclaim the d4, or dump Street Cred for Towerfall. Alt: Spend to discount the next Program by 1 €$ per min Gig, or replay a Program from trash. Priority Calls: Jackie → Hanako → Alt, unless you already have min Gigs and need an Alt discount for Towerfall this turn.',
      },
      {
        title: 'Opening & mulligan',
        body: 'Always roll the d4 as Gig #1 — Pyramid Song’s strong mode wants it at 1. Keep: a min-Gig tool (Trust No One, Jacked-In Voodoo Boy, Peace Offering), a ≤5 €$ answer (Pyramid Song, Chrome Reverie, Nocturne, Les Élémens, Maman, Take Control / Relapse), and a sellable late Program. Going first (2 €$): Trust No One / Peace Offering + Call beats Call+Unit. Going second (4 €$): Call → Jacked-In (Jackie trigger) → Trust No One locking the d4 at 1 is the gold opener. Mulligan all 5–6 drops with no min-Gig path. Hold 1 €$ for a reaction Call when you can.',
      },
      {
        title: 'Sample early turns',
        body: 'Turn 1: Sell a dead Towerfall/Les Élémens if needed, Call Jackie, Trust No One the d4 to 1 (or Jacked-In if Jackie is up and Eddies allow). Pass with Eddie open if possible. Turn 2: Call Hanako, finish min Gigs / pairs with Peace Offering or Trust No One, Pyramid Song or Chrome Reverie their best body. Turn 3: Hanako should be drawing; curve Pepe (or Lizzy / Maman), keep Floor It up vs geared attackers. Turn 4+: Alt discounts make Les Élémens and Towerfall castable with a Unit the same turn — wipe, then Pepe/Lizzy for Gigs. Side in Riot Shield / Placide when you see Smasher + Mantis; Take Control blanks a Gig swing when Relapse timing is wrong.',
      },
      {
        title: 'Key combos (this list)',
        body: 'Trust No One → Pyramid Song: d4 at 1 unlocks Song’s strong mode and sets up Towerfall. Jackie + Blue Unit: Gig nudge/draw — Unit only after Jackie is face-up. Hanako pairs: park two Gigs on the same value (usually 1s) for free cards every turn. Alt trash loop: sell/feed Programs, Alt-Spend replay Song / Nocturne / Three Mouths. Take Control or Memory Relapse: blank a Gig attack or freeze a geared Unit for a turn. Floor It: leave 1–2 €$ vs RRY so a 10–11 swing becomes nothing. Towerfall: both modes only when your Street Cred is lower — Hanako-swap or Trust No One first. Maman: uncapped tuck vs unequipped Units. Side Riot Shield / Placide: stop Go Solo / fat Gear races.',
      },
      {
        title: 'Midgame & closing',
        body: 'With 2–3 min Gigs, Alt turns Les Élémens (5→~2–3) and Towerfall (6→~3–4) into same-turn plays with a Unit. Three Mouths / Chrome Reverie / Nocturne keep their board lagging while Pepe chips Gigs. Into Gear, Relapse / Take Control / Floor It matter more than Maman. Close with Towerfall into a Pepe/Lizzy attack, or grind until Hanako draws find the last Song/Towerfall. Never race a geared Rockn’/Smasher fair — answer first.',
      },
      {
        title: 'Matchups',
        body: 'vs RRY / YYR / Smasher Gear (Gallery #1, #4, #13–15): Floor It + Relapse/Take Control; side Riot Shield / Placide; tuck unequipped bodies with Maman; never leave Mantis / Johnny+Converter unanswered. vs DeathMonkey / Judy BBG: Fight over the d4 and pairs; Hanako swaps break their Pyramid; don’t overextend into mirror Towerfall. vs Arasaka (Gallery #6–7): Song / Élémens eat mid Units; Relapse blanks Satori attackers; pressure before Minotaur/Yorinobu stick. vs RogueLite / YB: Floor It vs geared lines; Song the midcurve; your Program density wins long games.',
      },
      {
        title: 'Common mistakes',
        body: 'Blue Unit before Jackie is face-up. Rolling a high Gig die before the d4. Towerfall while you have higher Street Cred. Spending Hanako every turn instead of banking Eddie for Alt. Attacking into open Floor It. Selling your only Trust No One. Holding Maman while an unequipped 7-power Unit eats Gigs. Forgetting to side Riot Shield / Placide into Smasher.',
      },
    ],
  },
  'community-deathmonkey-bbg': {
    galleryRank: 3,
    strategy:
      'Min-Gig control: push Gigs to 1, snowball Hanako draws, discount Programs with Alt, and bottom-deck the board with Pyramid Song / Les Élémens / Towerfall. This DeathMonkey build races harder than stock BBG via Valentino / Pepe / Rogue Queen, and uses Memory Relapse (not Take Control) to freeze Gear attackers.',
    combos:
      'Trust No One + Pyramid Song once your d4 is at 1 · Jackie’s first Blue Unit each turn for a free Gig nudge/draw · Hanako value-pairs for passive draws · Alt Spend to replay a Program from trash · Memory Relapse into Pepe attacking the spent Unit · Floor It answering a 10+ Gig swing · Towerfall when your Street Cred is lower than theirs.',
    powerInsight:
      'Gallery #3 — Published BBG with denser Units than Contender #4. Still the format’s control pillar, tuned to punish Gear races while keeping the classic min-Gig engine.',
    strategyDetail: [
      {
        title: 'Core game plan',
        body: 'You win by owning the Gig math, not by racing power first. Every turn should advance at least one of: (1) create or protect a min Gig (value 1), (2) complete a Hanako value-pair for free cards, (3) remove or freeze the rival’s best attacker, (4) steal Gigs with a small tempo Unit once the board is soft. DeathMonkey’s twist vs stock BBG is denser mid Units — Valentino Street Racer, Pepe Najarro, Rogue Amendiares: Queen of the Afterlife — so you can actually pressure Gigs while the control suite loads. Memory Relapse replaces Take Control: you spend a rival Unit until your next turn (and often draw on even Street Cred), which is better into equipped Smasher/Gear attackers than “no Gigs this attack.”',
      },
      {
        title: 'Legend roles (play order matters)',
        body: 'Jackie Pour One Out: first Blue Unit/Gear each turn may drop a friendly Gig by up to 2 and draw if it becomes a min Gig — play the Blue Unit while Jackie is already face-up, or you miss the trigger. Hanako: free draw at the start of your turn for each value-pair; Spend swaps a friendly Gig with a rival Gig to reclaim your d4, finish a pair, or dump Street Cred for Towerfall. Alt: Spend to discount the next Program by 1 €$ per min Gig (worth it from 2+ min Gigs) or to replay a Program from trash (then bottom-deck it). Prioritize Calls that flip Jackie early for the engine, then Hanako before turn 3 draws matter, then Alt once you have Programs in trash and min Gigs online.',
      },
      {
        title: 'Opening & mulligan',
        body: 'Always roll the d4 as Gig #1 — Pyramid Song’s full mode needs your d4 at 1, and Trust No One + Pyramid is live from turn 2 if that die is already out. Keep hands with three pieces: a min-Gig tool (Trust No One, Jacked-In Voodoo Boy, Peace Offering), a ≤5 €$ answer (Pyramid Song, Chrome Reverie, Nocturne, Les Élémens, Maman Brigitte, Memory Relapse), and a sellable Program. Going first (2 €$): prefer Trust No One / Peace Offering + Call over Voodoo Boy, because Call + Unit is 3 €$. Going second (4 €$): Call → Voodoo Boy (Jackie trigger if she’s up) → Trust No One to lock the d4 at 1 is the gold opener. Mulligan blanks that are all 5–6 drops with no min-Gig path. Hold 1 €$ when you can for a reaction Call on their attack — two face-up Legends before your turn 2 massively stabilizes Jackie/Hanako timing.',
      },
      {
        title: 'Sample early turns',
        body: 'Turn 1: Sell a dead late Program if needed, Call Jackie, play Jacked-In Voodoo Boy if she’s up (Gig −2 toward 1 + draw), otherwise Trust No One the d4 to 1; pass with Eddie open if possible. Turn 2: Call Hanako, finish pairs / min Gigs with Trust No One or Peace Offering, Pyramid Song or Chrome Reverie their best body. Turn 3: Hanako should be drawing; curve Valentino (3) → Pepe (4); keep Floor It up vs geared attackers. Turn 4+: Lizzy / Maman / Rogue Queen (5), Alt-discount Les Élémens or Towerfall once you have 2–3 min Gigs, then attack. Never spend Hanako’s Eddie on a greedy swap if you needed that Eddie for Élémens / Towerfall the same turn. Memory Relapse the turn before Pepe attacks their spent Unit.',
      },
      {
        title: 'Key combos (this list)',
        body: 'Trust No One → Pyramid Song: with d4 at 1, Song’s strong mode strips mid Units and sets up Towerfall. Jackie + any Blue Unit: free Gig nudge; sequence Blue Unit first only after Jackie is face-up. Hanako pair snowball: park two Gigs on the same value (usually both 1s) and draw every turn for free. Alt trash loop: feed Programs to Maman / sells, then Alt-Spend replay Pyramid, Nocturne, or Three Mouths. Memory Relapse → Pepe: Relapse spends their best attacker; Pepe fights that spent Unit or races Gigs while Alt/Jackie ready. Floor It: leave 1–2 €$ vs RRY/Smasher so a 10–11 power steal becomes a blank. Towerfall: only both modes when your Street Cred is lower — Hanako-swap or Trust No One to get there before you cast it. Rogue Queen: 5-drop that lives through small Towerfalls and forces them to spend real removal. vs stock BBG: your denser Units (Valentino / Pepe / Queen) let you race Gigs while the same control suite loads.',
      },
      {
        title: 'Midgame & closing',
        body: 'Once you have 2–3 min Gigs, Alt discounts make Les Élémens (5→~2–3) and Towerfall (6→~3–4) castable the same turn as a Unit. Use Three Mouths / Chrome Reverie / Nocturne to keep their board lagging while Valentino and Pepe chip Gigs. Maman Brigitte is your uncapped tuck — but only vs unequipped Units; into Gear decks, Relapse + Floor It + Pyramid matter more than Maman. Close by either (a) Towerfall wipe into a Pepe/Queen attack for the last Gigs, or (b) grinding them out of threats until Hanako draws find the last Song/Towerfall. Do not race a geared Rockn’/Smasher fair — answer first, then attack.',
      },
      {
        title: 'Matchups',
        body: 'vs RRY / YYR / Smasher Gear (Gallery #1, #4, #13–15): Keep Floor It and Relapse; tuck unequipped bodies with Maman; never let a Mantis-equipped Unit or Johnny+Converter sit unanswered. Go second if you can in game 1 only when your hand is the full Call+Voodoo+Trust package — otherwise Prefer the reactive seat RareTotem recommends opponents take against BBG (they want to go first; you still win by answering). vs other BBG / GBB Judy: Fight over the d4 and pairs; Hanako swaps break their Pyramid; Chrome Reverie / Nocturne the first Pepe; don’t overextend into mirror Towerfall. vs Arasaka / Saburo midrange (Gallery #6–7): Les Élémens and Song eat mid Arasaka Units; Relapse blanks Satori attackers for a turn; pressure before Minotaur/Yorinobu stick. vs RogueLite / YB midrange: Floor It vs geared MaxTac lines; Song the midcurve; your denser Units outpace stock BBG here.',
      },
      {
        title: 'Common mistakes',
        body: 'Playing a Blue Unit before Jackie is face-up (wasted trigger). Rolling a high die before the d4 (delays Pyramid). Casting Towerfall while you have higher Street Cred (half the card). Spending Hanako every turn instead of banking Eddie for Alt discounts. Attacking into open Floor It / Riot Shield ranges. Selling your only Trust No One. Holding Maman for “value” while an unequipped 7-power Unit eats two Gigs.',
      },
    ],
  },
  'community-smasher-river-viktor-yyr': {
    galleryRank: 4,
    strategy:
      'YYR Gear midrange: Call Viktor early to dig ≤2€$ Gear, keep River face-up with Gear in hand for Quick free equips on their turn, and build one body past 10 (Johnny + Adrenaline Converter is the signature two-Gig steal). Faceplate on a face-up Legend is the second engine. Close with Go Solo Smasher once the board is soft — do not race BBG fair without Converter/Johnny online.',
    combos:
      'Viktor dig → Adrenaline / Faceplate / Satori / Blades · River Quick-equip Converter on Johnny for an immediate 11-power double Gig steal · Faceplate on Smasher/River for Gig nudge + draw · Mandibular Johnny block→ready · Bootleg Black Sapphire even/odd sell-draw · Aftermath reset into River top-2 trash · Go Solo Smasher after Faceplate draws.',
    powerInsight:
      'Gallery #4 — Tournament #1 (5-0-1, 14 players, Nov 22). Yellow-yellow-red “took the crown” from BBG in early meta writing; this Meredith-heavy tournament cut is the proof list. Sits just under Contender RRY #1 and the BBG pillars.',
    strategyDetail: [
      {
        title: 'Core game plan',
        body: 'You win by stacking cheap Gear onto mid Units until attacks clear 10 power (two Gigs), not by flooding bodies. Every turn should advance at least one of: (1) Call Viktor and take the Gear the board needs, (2) put a carrier on board (Negotiators, Bombus, Meredith, Rockn’, Johnny), (3) equip past Floor It / 10-power lines, (4) keep River ready with ≤2€$ Gear in hand as information warfare. Gear is the curve — reading it as “equipment for later” is playing the list wrong. Against BBG, Adrenaline Converter + Johnny is the tempo answer to early Gig turtling; against Gear mirrors, Detonate / Safety Override / Aftermath decide the race.',
      },
      {
        title: 'Legend roles (play order matters)',
        body: 'Viktor Vektor: the engine — Call looks at top 5, takes up to 2 Gears costing 2 or less. Call him whenever you can play (or River-equip) a find the same turn; do not Call into a dead hand. Prefer Converter when they are ahead on Gigs, Faceplate when they sit on pairs, Blades/Satori for the next Gig steal, Mandibular when you need a blocker. River Ward: Quick Spend plays a ≤2€$ Gear from hand for free — strongest on their turn as a surprise pump/blocker. When an equipped friendly Unit is defeated, look at top 2 and trash 1 (feed what you want). Adam Smasher: late closer — Go Solo defeats a rival Unit and attacks ready at 9+; flip him earlier than in RRY when Faceplate wants a Legend to ride for draws. Sequence Calls Viktor early → River as soon as you have Gear to hold → Smasher when Eddies and board allow Go Solo.',
      },
      {
        title: 'Opening & mulligan',
        body: 'Keep: at least one cheap Unit (Bombus, Negotiators, Meredith path) and one ≤2€$ Gear (Blades, Mandibular, Converter, Faceplate, Satori). Mulligan all-Program / all-Johnny hands with no early Gear or body. Going first (2 €$): Call Viktor if the dig can become a play, or drop Bombus/Negotiators + Blades; Faceplate on a face-up Legend once you have one. Going second (4 €$): Call Viktor → equip a find, or Call River and hold Gear for their attack. Never mulligan away both Adrenaline Converter and Mantis Blades. Bootleg Black Sapphire is a keep vs control (even/odd Gig sell-draw) and a mulligan vs pure aggro — five Eddies with no Unit is suicide into tempo.',
      },
      {
        title: 'Sample early turns',
        body: 'Turn 1: Sell if needed, Call Viktor (or River if Viktor is buried), play Bombus / Negotiators / Mandibular+Blades. If a Legend is face-up and Faceplate is in hand, equip the Legend for Gig nudge/draw on Spend. Turn 2: Call the second yellow Legend; equip Converter or Satori on the live body and attack if you clear a Gig; hold River + Gear open if they threaten a swing. Turn 3: Meredith Stout as the mid brick (punishes Gig fiddling), or Rockn’ into Blades/Satori for a 10+ steal; Safety Override up vs Go Solo races. Turn 4–5: Johnny for 6 — if they are ≥2 Gigs ahead and River is up, Quick-equip Converter for free → Johnny is 11 with Adrenaline and steals two Gigs the turn he enters. Turn 5–6: Faceplate already on Smasher if he is face-up; Go Solo wipe + attack to close. Side MaxTac / Royce / second Detonate when mirrors or wipe-heavy Smasher seats show up.',
      },
      {
        title: 'Key combos (this list)',
        body: 'Johnny + River + Adrenaline Converter: six Eddies, one body, two Gigs — the deck’s biggest tempo swing (needs them ≥2 Gigs ahead for Adrenaline). Viktor dig → Converter/Faceplate/Satori/Blades: plan the 1 €$ Call with a follow-up equip the same turn. Faceplate on face-up Smasher/River: Gig adjust on Spend + draw once you have three different Gig values — second engine before Go Solo. Mandibular on Johnny: block, win the fight, ready, attack again. Bootleg Black Sapphire: sell top + draw 2 on even/odd Gig spread — ramp into another Call/equip vs control. Live with the Aftermath: mutual Unit defeat you choose; River then digs top-2 from the equipped death. Meredith + equipped attacker: Gig-steal payoffs and midrange wall. Detonate / Safety Override: answer Legend Faceplates or blank a Smasher swing. Go Solo Smasher + leftover Blades/Satori: wipe + 9–11 power finish.',
      },
      {
        title: 'Midgame & closing',
        body: 'Once Viktor has fetched and one Unit wears real Gear, stop banking “value digs” and start converting Gigs. Prefer one fat attacker over a wide board into Les Élémens / Towerfall. Keep at least one ≤2€$ Gear in hand whenever River is face-up — the threat alone slows their attacks. Close with either (a) Johnny + Converter double Gig, (b) Rockn’/Meredith stacked past 10 into Over the Edge, or (c) Go Solo Smasher after Faceplate draws have loaded your hand. If you flood Gear, sell the redundant Satori/Radioport for Eddies to hit Johnny or Smasher on curve. Sideboard: MaxTac for board presence into wipe seats; Royce ×2 and Offduty for midrange mirrors; second Detonate vs Legend-Gear; Over the Edge when Gig races go long.',
      },
      {
        title: 'Matchups',
        body: 'vs BBG / DeathMonkey / Judy BBG (Gallery #2–3, #8): Fair, not free. Converter punishes early Gig turtles; Johnny steals two without warning. Gear on Units dies to Pyramid/Song — put Faceplate on Legends. Prefer going first; do not Bootleg-ramp into their tempo. vs RRY / other Gear (Gallery #1, #13–15): Detonate Legend Faceplates; Safety Override into Go Solo; Aftermath is often a side-out in the pure mirror. Whoever assembles Johnny+Converter first usually wins. vs Arasaka midrange (Gallery #6–7): Race before Yorinobu/Minotaur stick; Meredith walls mid attackers; Smasher closes. vs RogueLite / YB (Gallery #12): Your Gear density and Viktor selection outpace theirs — equip first, then fight Gigs. vs Smasher wipe seats: hold a Unit in reserve, rebuild with Viktor digs after the clear, MaxTac from the side.',
      },
      {
        title: 'Common mistakes',
        body: 'Calling Viktor with no plan to use a find the same turn. Using River only on your turn — Quick equip is stronger as a defensive threat. Playing Smasher without Faceplate on him while he is face-up (you miss the draw engine). Bootleg Black Sapphire into aggro (five Eddies, no Unit). Attacking unequipped into open Floor It. Leaving all Gear on one Unit that Song/Maman will tuck. Searching for Converter only after they are already locking Gigs — Viktor belongs in the first two turns. Forgetting Mandibular Johnny can block, win, and ready.',
      },
    ],
  },
  'dexter-muamar-streetkid': {
    galleryRank: 5,
    strategy:
      'Gig-race midrange: Fixer Legends (Dexter/Muamar) plus Streetkid engine. Curve cheap yellow Gear, keep Streetkid ready to recycle Braindance, and force BBG to answer mid Units before Towerfall comes online.',
    combos:
      'Adrenaline / Gorilla / Faceplate stacking on Meredith or Rockn’ · Streetkid Braindance loops · Muamar Gig tools into Dexter Off the Grid value.',
    powerInsight:
      'Gallery #4 — Contender #2 (score 59). The “other” Tier-1 RYY axis: less raw Smasher ceiling than #1, more consistent midgame.',
  },
  'smasher-saburo-streetkid': {
    galleryRank: 6,
    strategy:
      'Arasaka midrange-control: Saburo buffs Arasaka attackers, Streetkid digs, Smasher closes. Play for board clears into a Go Solo finish rather than pure Gear race.',
    combos:
      'Satori draw loops on Arasaka Units · Saburo attack buff into Yorinobu / Swordwise · Go Solo Smasher after the board is soft · Streetkid Braindance recursion.',
    powerInsight:
      'Gallery #5 — Contender #3. Lower share than RRY/BBG but a high Contender score and a clean midrange plan.',
  },
  'community-arasaka-9s': {
    galleryRank: 7,
    strategy:
      'GRR Arasaka midrange with Saburo + Yorinobu Embracing Destruction + Smasher. Curve Field Operator / Pepe / Valentino, equip Satori/Radioport, and convert removal (All is Lost, Bonnie, Carnage) into Gig swings.',
    combos:
      'Swordwise + Satori or Radioport · Yorinobu Steel Dragon as a 7-drop finisher under Saburo · Peace Offering / We Gotta for green glue · Smasher as the shared closer.',
    powerInsight:
      'Gallery #6 — Best published community Arasaka list in the gallery. Sits just under Contender Saburo shells; Minotaur + Pepe package is real into midrange.',
  },
  'community-varela-bbg-judy': {
    galleryRank: 8,
    strategy:
      'GBB Judy tempo: Jackie + Judy + Hanako. Blue Units do the racing; Peace Offering is the green splash; Judy’s Braindance engine replaces some Hanako draws when pairs are contested.',
    combos:
      'Judy Braindance pump into Three Mouths / Chrome Reverie · Peace Offering value into Hanako pairs · Delamain / Jacked-In into Lizzy / Maman curve · Unlikely Bond / Les Élémens as soft locks.',
    powerInsight:
      'Gallery #7 — Strong BBG cousin with a Judy engine. Slightly less “deck to beat” than Alt/Hanako/Jackie, but excellent into mirrors and Gear when the d4 cooperates.',
  },
  'smasher-judy-streetkid': {
    galleryRank: 9,
    strategy:
      'Hybrid Gig-race: Streetkid + Judy Braindance midrange with Smasher as the hammer. Mulligan for early Programs and a body that can wear Gear.',
    combos:
      'Judy Braindance into red removal · Smasher Go Solo after Judy has ground out cards · Streetkid fetch after you feed the trash.',
    powerInsight:
      'Gallery #8 — High Contender score but Tier 2 by share floor. Explosive when it works; less consistent than pure RRY or BBG.',
  },
  'alt-jackie-judy': {
    galleryRank: 10,
    strategy:
      'Blue-leaning control without Hanako: tuck, draw, and finish with Judy Unit / Placide-sized bodies. Respect RAM — Judy Unit wants Blue RAM 5+.',
    combos:
      'Alt tuck suite into Jackie Blue RAM · Judy Nothing to Doubt as a late free-play engine · Towerfall / Pyramid Song as the soft lock.',
    powerInsight:
      'Gallery #9 — Contender Tier 2 with solid share. Loses Hanako’s pair draws vs classic BBG; gains Judy’s Braindance payoff.',
  },
  'smasher-alt-streetkid': {
    galleryRank: 11,
    strategy:
      'Midrange-control hybrid: Alt disruption early, Streetkid recursion, Smasher late. Play like a control deck until you can afford the Go Solo.',
    combos:
      'Alt Programs into Streetkid Braindance · Smasher as the shared finisher · blue tuck answering Gear Units.',
    powerInsight:
      'Gallery #10 — Contender Tier 2 hybrid. Flexible, but can be a master-of-none between RRY speed and BBG locks.',
  },
  'community-roguelite': {
    galleryRank: 12,
    strategy:
      'Yellow-blue midrange: River/Rogue yellow Gear spine with V: Corporate Exile for blue programs. Equip early, Safety Override for tempo, Caliber from the side for mirrors.',
    combos:
      'River free Gear into Faceplate / Adrenaline · Chrome Reverie / Nocturne with Corporate Exile RAM · Bootleg Black Sapphire as yellow Braindance · Placide as the blue hammer.',
    powerInsight:
      'Gallery #11 — Clean published YB list. Not Contender top-10 by results, but a coherent midrange plan that steals games from pure Gear.',
  },
  'community-smasher-dumdum-river-gear': {
    galleryRank: 13,
    strategy:
      'Popular Gear race with Smasher instead of Royce: Dum Dum pumps, River discounts Gear, Smasher closes. Curve Rockn’ / Bombus / 6th Street, stack Faceplate + Adrenaline, and time Detonate / Aftermath for contested Gigs.',
    combos:
      'River into Faceplate or Adrenaline for near-free pumps · Dum Dum spend pump on a geared Rockn’ · Bootleg Black Sapphire as yellow Braindance · Go Solo Smasher after the board is soft · Aftermath / Detonate as the race tools.',
    powerInsight:
      'Gallery #12 — Table-photo Gear shell on the ripperdeck-popular Dum Dum/River axis with Smasher as the finisher. High builder popularity; Contender results still trail RRY #1 and BBG.',
  },
  'community-rocking-sweet-gear': {
    galleryRank: 14,
    strategy:
      'Johnny / Kerry / Royce Gear aggro: equip early Rockerboys, Deadman / Heist for disruption, Minotaur side for fat midrange mirrors.',
    combos:
      'Rockn’ + Mantis/Satori · Deadman Transmitter value · The Heist yellow payoff · Royce as the red closer.',
    powerInsight:
      'Gallery #13 — Fun, fully listed Gear aggro. Strong into slow decks; struggles more than RRY into optimized BBG.',
  },
  'community-rogue-kerry-royce-table': {
    galleryRank: 15,
    strategy:
      'Same RYY Gear family as Rocking sweet Gear, with Rogue Preem Solo instead of Johnny. Lean on Negotiators / Rockn’ / Offduty and yellow Aftermath / Bootleg.',
    combos:
      'Rogue Solo value into equipped Units · Gorilla / Mandibular stacks · Over the Edge for high Gigs · Royce finish.',
    powerInsight:
      'Gallery #14 — Solid table reconstruction. Slightly less explosive than Johnny-legend Gear; still a real midrange Gear plan.',
  },
  'jackie-mama-johnny-streetkid': {
    galleryRank: 16,
    strategy:
      'Red Gig pressure with Mama’s Favorite / Johnny / Streetkid. Attack for Gigs early and keep Streetkid ready to recycle Programs.',
    combos:
      'Johnny Never Stop Fighting bodies · Bonnie and Clyde / Over the Edge race tools · Streetkid Braindance.',
    powerInsight:
      'Gallery #15 — Contender Tier 2, low share. Clear attack plan; lacks the Contender ceiling of RRY/BBG.',
  },
  'smasher-dexter-hanako': {
    galleryRank: 17,
    strategy:
      'Unusual red/green mix: Dexter midrange into Hanako draws, Smasher closes. Mulligan for a coherent color stretch.',
    combos:
      'Dexter Fixer tools · Hanako pair draws · Smasher as the shared finisher.',
    powerInsight:
      'Gallery #16 — Contender Tier 2 climber. Flexible but awkward RAM; more “spicy” than optimal.',
  },
  'smasher-dexter-muamar': {
    galleryRank: 18,
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
