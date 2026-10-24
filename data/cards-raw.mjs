/**
 * Source checklist for Welcome to Night City (Beta) — MS01 + showcase.
 * Slot: zoneSlot + s{sheet}{F|B}{row}
 * hasIconic: Legends always; street Secret/Epic only when an Iconic A printing exists.
 * (Some Epics are base-only — e.g. Roamer / Jackie Ride-or-Die / Viktor Illusions.)
 */

function bandFor(num) {
  const n = parseInt(String(num).replace(/[a-z]/gi, ''), 10);
  if (Number.isNaN(n)) return null;
  if (n <= 35) return 'red';
  if (n <= 70) return 'yellow';
  if (n <= 105) return 'green';
  if (n <= 140) return 'blue';
  return null;
}

function parseSlot(slot) {
  // e.g. "L01 s3F1" or "U45 s15F3"
  const m = String(slot).trim().match(/^([LUGP])(\d+)\s+s(\d+)([FB])(\d)$/i);
  if (!m) return { zone: null, zoneSlot: null, sheet: null, face: null, row: null };
  return {
    zone: m[1].toUpperCase(),
    zoneSlot: parseInt(m[2], 10),
    sheet: parseInt(m[3], 10),
    face: m[4].toUpperCase(),
    row: parseInt(m[5], 10),
  };
}

/** Street Epic Units with no Iconic A product (base Epic only → Street binder). */
const STREET_EPIC_NO_ICONIC = new Set([
  '020', // V: Roamer of the Badlands
  '048', // Jackie Welles: Ride or Die Choom
  '057', // Viktor Vektor: Drop Your Illusions
]);

function hasIconic(type, rarity, number = '') {
  if (type === 'Legend') return true;
  if (rarity !== 'Secret' && rarity !== 'Epic') return false;
  const num = String(number).replace(/[a-z]+$/i, '');
  return !STREET_EPIC_NO_ICONIC.has(num);
}

/** [number, name, type, eurodollars|null, rarity, slotCode] */
const MS01 = [
  // === LEGENDS ===
  ['001', 'Adam Smasher: Ender of Legends', 'Legend', 9, 'Epic', 'L01 s3F1'],
  ['002', 'Dexter DeShawn: Off the Grid', 'Legend', null, 'Rare', 'L02 s3F2'],
  ['003', 'Johnny Silverhand: Rocking Renegade', 'Legend', null, 'Secret', 'L03 s3F3'],
  ['004', 'Royce: Psycho on the Edge', 'Legend', 6, 'Rare', 'L04 s3B1'],
  ['005a', 'V: Streetkid (a)', 'Legend', 5, 'Rare', 'L05 s3B2'],
  ['005b', 'V: Streetkid (b)', 'Legend', 5, 'Rare', 'L21 s11F1'],
  ['036', 'Dum Dum: Maelstrom Triggerman', 'Legend', null, 'Rare', 'L06 s3B3'],
  ['037', 'Kerry Eurodyne: Axe, Attitude, Audience', 'Legend', null, 'Rare', 'L07 s4F1'],
  ['038', 'Muamar Reyes: El Capitán', 'Legend', null, 'Rare', 'L08 s4F2'],
  ['039', 'River Ward: Detective on the Hunt', 'Legend', null, 'Rare', 'L09 s4F3'],
  ['040', 'Rogue Amendiares: Preem Solo', 'Legend', 7, 'Rare', 'L10 s4B1'],
  ['071', 'Goro Takemura: Vengeful Bodyguard', 'Legend', null, 'Rare', 'L11 s4B2'],
  ['072', 'Hanako Arasaka: Daughter of the Emperor', 'Legend', null, 'Rare', 'L12 s4B3'],
  ['073', 'Jackie Welles: Mama\'s Favorite', 'Legend', 6, 'Rare', 'L13 s5F1'],
  ['074', 'Padre: Man of the Cross', 'Legend', null, 'Rare', 'L14 s5F2'],
  ['075', 'Panam Palmer: Nomad Cavalry', 'Legend', null, 'Epic', 'L15 s5F3'],
  ['106', 'Alt Cunningham: Soulkiller Architect', 'Legend', null, 'Rare', 'L16 s5B1'],
  ['107', 'Evelyn Parker: Beautiful Enigma', 'Legend', null, 'Rare', 'L17 s5B2'],
  ['108', 'Judy Álvarez: Braindance Maestro', 'Legend', null, 'Epic', 'L18 s5B3'],
  ['109', 'Sasha Yakovleva: Won\'t Let You Down', 'Legend', 5, 'Secret', 'L19 s6F1'],
  ['110', 'Wakako Okada: Peace and Harmony', 'Legend', null, 'Rare', 'L20 s6F2'],

  // === UNITS ===
  ['006', '6th Street Recruits', 'Unit', 4, 'Common', 'U01 s8F1'],
  ['007', 'Animals Wrecker', 'Unit', 6, 'Common', 'U02 s8F2'],
  ['008', 'Chrome Fang', 'Unit', 5, 'Common', 'U03 s8F3'],
  ['009', 'El Sombrerón: La Venganza Lenta', 'Unit', 5, 'Rare', 'U04 s8B1'],
  ['010', 'Japantown Jonin', 'Unit', 2, 'Common', 'U05 s8B2'],
  ['011', 'Johnny Silverhand: Never Stop Fighting', 'Unit', 6, 'Epic', 'U06 s8B3'],
  ['012', 'Kerry Eurodyne: The Last Rockerboy', 'Unit', 4, 'Uncommon', 'U07 s9F1'],
  ['013', 'La Llorona: Ghost of the Past', 'Unit', 3, 'Uncommon', 'U08 s9F2'],
  ['014', 'Meredith Stout: Stone Cold Corpo', 'Unit', 4, 'Rare', 'U09 s9F3'],
  ['015', 'Octant', 'Unit', 7, 'Common', 'U10 s9B1'],
  ['016', 'Royce: Don\'t Call Me Simon', 'Unit', 5, 'Uncommon', 'U11 s9B2'],
  ['017', 'Ruthless Lowlife', 'Unit', 2, 'Common', 'U12 s9B3'],
  ['018', 'Screw: Lovelorn Fool', 'Unit', 5, 'Common', 'U13 s10F1'],
  ['019', 'Swordwise Huscle', 'Unit', 3, 'Common', 'U14 s10F2'],
  ['020', 'V: Roamer of the Badlands', 'Unit', 5, 'Epic', 'U15 s10F3'],
  ['021', 'Valentino Guerrera', 'Unit', 3, 'Common', 'U16 s10B1'],
  ['022', 'Yorinobu Arasaka: Steel Dragon', 'Unit', 7, 'Rare', 'U17 s10B2'],
  ['041', 'Adam Smasher: Metal Over Meat', 'Unit', 9, 'Epic', 'U18 s10B3'],
  ['042', 'Alt Cunningham: Mother of Daemons', 'Unit', 7, 'Rare', 'U19 s11F1'],
  ['043', 'Augmented Negotiators', 'Unit', 3, 'Common', 'U20 s11F2'],
  ['044', 'Caliber: Totentanz\'s Top Dog', 'Unit', 5, 'Rare', 'U21 s11F3'],
  ['045', 'Gilded Matón', 'Unit', 4, 'Common', 'U22 s11B1'],
  ['046', 'Hanako Arasaka: In a Gilded Cage', 'Unit', 4, 'Rare', 'U23 s11B2'],
  ['047', 'Heywood Ripperdoc', 'Unit', 6, 'Uncommon', 'U24 s11B3'],
  ['048', 'Jackie Welles: Ride or Die Choom', 'Unit', 6, 'Epic', 'U25 s12F1'],
  ['049', 'Maelstrom Goons', 'Unit', 3, 'Common', 'U26 s12F2'],
  ['050', 'MaxTac Suppression Team', 'Unit', 5, 'Common', 'U27 s12F3'],
  ['051', 'Offduty Malfini', 'Unit', 4, 'Common', 'U28 s12B1'],
  ['052', 'Rockn\' Rockerboy', 'Unit', 5, 'Common', 'U29 s12B2'],
  ['053', 'Secondhand Bombus', 'Unit', 2, 'Common', 'U30 s12B3'],
  ['054', 'Sketchy Ripper', 'Unit', 2, 'Common', 'U31 s13F1'],
  ['055', 'T-Bug: Amateur Philosopher', 'Unit', 4, 'Uncommon', 'U32 s13F2'],
  ['056', 'Trauma Team Operatives', 'Unit', 6, 'Common', 'U33 s13F3'],
  ['057', 'Viktor Vektor: Drop Your Illusions', 'Unit', 5, 'Epic', 'U34 s13B1'],
  ['058', 'Viktor Vektor: You Might Feel a Little Pinch', 'Unit', 3, 'Uncommon', 'U35 s13B2'],
  ['076', 'Corpo Security', 'Unit', 2, 'Common', 'U36 s13B3'],
  ['077', 'Emergency Atlus', 'Unit', 3, 'Common', 'U37 s14F1'],
  ['078', 'Field Operator', 'Unit', 3, 'Common', 'U38 s14F2'],
  ['079', 'Maelstrom Zealots', 'Unit', 4, 'Common', 'U39 s14F3'],
  ['080', 'MaxTac AV', 'Unit', 5, 'Common', 'U40 s14B1'],
  ['081', 'MaxTac Heavy', 'Unit', 7, 'Uncommon', 'U41 s14B2'],
  ['082', 'MaxTac Squadron', 'Unit', 3, 'Common', 'U42 s14B3'],
  ['083', 'Nadia: Fighting Through Grief', 'Unit', 6, 'Uncommon', 'U43 s15F1'],
  ['084', 'Pacifica Netrunner', 'Unit', 4, 'Common', 'U44 s15F2'],
  ['085', 'Panam Palmer: Strength Through Family', 'Unit', 6, 'Secret', 'U45 s15F3'],
  ['086', 'Pepe Najarro: Working Doubles', 'Unit', 4, 'Uncommon', 'U46 s15B1'],
  ['087', 'Riding Nomad', 'Unit', 5, 'Common', 'U47 s15B2'],
  ['088', 'Sandayu Oda: Hanako\'s Guardian', 'Unit', 7, 'Rare', 'U48 s15B3'],
  ['089', 'Saul Bright: Stormrider', 'Unit', 8, 'Rare', 'U49 s16F1'],
  ['090', 'Tyger\'s Whisper', 'Unit', 2, 'Common', 'U50 s16F2'],
  ['091', 'Valentino Street Racer', 'Unit', 3, 'Common', 'U51 s16F3'],
  ['092', 'Wraith Marauders', 'Unit', 5, 'Uncommon', 'U52 s16B1'],
  ['111', 'Delamain: Rideshare AI', 'Unit', 3, 'Uncommon', 'U53 s16B2'],
  ['112', 'Delamain Cab', 'Unit', 4, 'Common', 'U54 s16B3'],
  ['113', 'Evelyn Parker: Scheming Siren', 'Unit', 2, 'Uncommon', 'U55 s17F1'],
  ['114', 'Hacked Corpo', 'Unit', 4, 'Common', 'U56 s17F2'],
  ['115', 'Jacked-In Voodoo Boy', 'Unit', 2, 'Common', 'U57 s17F3'],
  ['116', 'Judy Álvarez: Nothing to Doubt', 'Unit', 6, 'Secret', 'U58 s17B1'],
  ['117', 'Lizzy Wizzy: Delicate Weapon', 'Unit', 5, 'Rare', 'U59 s17B2'],
  ['118', 'Maman Brigitte: Spirit of Death', 'Unit', 5, 'Uncommon', 'U60 s17B3'],
  ['119', 'Misty Olszewski: Mender of Broken Spirits', 'Unit', 3, 'Rare', 'U61 s18F1'],
  ['120', 'Modded Kusanagi', 'Unit', 6, 'Common', 'U62 s18F2'],
  ['121', 'Modded Muramasa', 'Unit', 5, 'Common', 'U63 s18F3'],
  ['122', 'Mox Inciters', 'Unit', 3, 'Common', 'U64 s18B1'],
  ['123', 'Placide: Voodoo Sentinel', 'Unit', 8, 'Rare', 'U65 s18B2'],
  ['124', 'Psycho Squad', 'Unit', 4, 'Common', 'U66 s18B3'],
  ['125', 'Rita Wheeler: No Stupid Questions', 'Unit', 4, 'Common', 'U67 s19F1'],
  ['126', 'Rogue Amendiares: Queen of the Afterlife', 'Unit', 5, 'Epic', 'U68 s19F2'],
  ['127', 'Westbrook Netrunner', 'Unit', 4, 'Common', 'U69 s19F3'],

  // === GEAR ===
  ['023', 'Arasaka Emergency Radioport', 'Gear', 2, 'Common', 'G01 s21F1'],
  ['024', 'Deadman Transmitter', 'Gear', 3, 'Uncommon', 'G02 s21F2'],
  ['025', 'Mantis Blades', 'Gear', 1, 'Common', 'G03 s21F3'],
  ['026', 'Satori: Sword of Saburo', 'Gear', 2, 'Uncommon', 'G04 s21B1'],
  ['059', 'Adrenaline Converter', 'Gear', 2, 'Common', 'G05 s21B2'],
  ['060', 'Gorilla Arms', 'Gear', 4, 'Common', 'G06 s21B3'],
  ['061', 'Kiroshi Optics', 'Gear', 1, 'Common', 'G07 s22F1'],
  ['062', 'Mandibular Upgrade', 'Gear', 1, 'Common', 'G08 s22F2'],
  ['063', 'The Relic: Experimental Biochip', 'Gear', 5, 'Epic', 'G09 s22F3'],
  ['064', 'Zetatech Faceplate', 'Gear', 2, 'Uncommon', 'G10 s22B1'],
  ['093', 'Overwatch: Panam\'s Gift', 'Gear', 4, 'Epic', 'G11 s22B2'],
  ['094', 'Riot Shield', 'Gear', 2, 'Uncommon', 'G12 s22B3'],
  ['095', 'Sandevistan', 'Gear', 3, 'Uncommon', 'G13 s23F1'],
  ['096', 'Zetatech Berserk', 'Gear', 6, 'Common', 'G14 s23F2'],
  ['128', 'Dying Night: V\'s Pistol', 'Gear', 2, 'Rare', 'G15 s23F3'],
  ['129', 'NetWatch Netdriver', 'Gear', 3, 'Uncommon', 'G16 s23B1'],
  ['130', 'Tetratronic Rippler', 'Gear', 1, 'Common', 'G17 s23B2'],

  // === PROGRAMS ===
  ['027', 'All is Lost', 'Program', 1, 'Common', 'P01 s24F1'],
  ['028', 'Appetite for Destruction', 'Program', 3, 'Uncommon', 'P02 s24F2'],
  ['029', 'Bonnie and Clyde', 'Program', 3, 'Uncommon', 'P03 s24F3'],
  ['030', 'Carnage at the Colosseum', 'Program', 6, 'Common', 'P04 s24B1'],
  ['031', 'Detonate', 'Program', 1, 'Common', 'P05 s24B2'],
  ['032', 'Gunpoint Diplomacy', 'Program', 4, 'Uncommon', 'P06 s24B3'],
  ['033', 'Industrial Assembly', 'Program', 1, 'Uncommon', 'P07 s25F1'],
  ['034', 'Over the Edge', 'Program', 3, 'Common', 'P08 s25F2'],
  ['035', 'Shattered Memories', 'Program', 4, 'Rare', 'P09 s25F3'],
  ['065', 'Afterparty at Lizzie\'s', 'Program', 1, 'Common', 'P10 s25B1'],
  ['066', 'Bootleg Black Sapphire Show', 'Program', 5, 'Uncommon', 'P11 s25B2'],
  ['067', 'Cyberpsychosis', 'Program', 3, 'Uncommon', 'P12 s25B3'],
  ['068', 'Live with the Aftermath', 'Program', 3, 'Common', 'P13 s26F1'],
  ['069', 'Safety Override', 'Program', 2, 'Common', 'P14 s26F2'],
  ['070', 'The Heist', 'Program', 2, 'Uncommon', 'P15 s26F3'],
  ['097', 'Corporate Surveillance', 'Program', 2, 'Uncommon', 'P16 s26B1'],
  ['098', '(Don\'t Fear) The Reaper', 'Program', 7, 'Rare', 'P17 s26B2'],
  ['099', 'Fool on the Hill', 'Program', 2, 'Rare', 'P18 s26B3'],
  ['100', 'Memory Relapse', 'Program', 4, 'Uncommon', 'P19 s27F1'],
  ['101', 'Peace Offering', 'Program', 1, 'Common', 'P20 s27F2'],
  ['102', 'Synapse Burnout', 'Program', 1, 'Uncommon', 'P21 s27F3'],
  ['103', 'Take Control', 'Program', 2, 'Uncommon', 'P22 s27B1'],
  ['104', 'We Gotta Live Together', 'Program', 5, 'Uncommon', 'P23 s27B2'],
  ['105', 'Wild in the Streets', 'Program', 5, 'Common', 'P24 s27B3'],
  ['131', 'Chrome Reverie', 'Program', 3, 'Common', 'P25 s28F1'],
  ['132', 'Floor It', 'Program', 1, 'Common', 'P26 s28F2'],
  ['133', 'Les Élémens', 'Program', 5, 'Uncommon', 'P27 s28F3'],
  ['134', 'Nocturne OP55 N1', 'Program', 3, 'Rare', 'P28 s28B1'],
  ['135', 'Pyramid Song', 'Program', 3, 'Rare', 'P29 s28B2'],
  ['136', 'Reboot Optics', 'Program', 2, 'Common', 'P30 s28B3'],
  ['137', 'Three Mouths, One Desire', 'Program', 2, 'Common', 'P31 s29F1'],
  ['138', 'Towerfall', 'Program', 6, 'Epic', 'P32 s29F2'],
  ['139', 'Trust No One', 'Program', 1, 'Common', 'P33 s29F3'],
  ['140', 'Unlikely Bond', 'Program', 4, 'Common', 'P34 s29B1'],
];

const JUDGE_NOTES = {
  '053': 'Also exists as JUDGEPROMOS-001 — file promo in showcase, not MS01.',
  '082': 'Also exists as JUDGEPROMOS-002 — file promo in showcase, not MS01.',
  '111': 'Also exists as JUDGEPROMOS-003 — file promo in showcase, not MS01.',
};

/** Beta Event kit promos — special B stamp under RAM (Mantis Blades + 10 Legends). */
const BETA_STAMP_NUMBERS = new Set([
  '001', // Adam Smasher: Ender of Legends
  '004', // Royce: Psycho on the Edge
  '025', // Mantis Blades
  '036', // Dum Dum: Maelstrom Triggerman
  '039', // River Ward: Detective on the Hunt
  '040', // Rogue Amendiares: Preem Solo
  '071', // Goro Takemura: Vengeful Bodyguard
  '073', // Jackie Welles: Mama's Favorite
  '075', // Panam Palmer: Nomad Cavalry
  '106', // Alt Cunningham: Soulkiller Architect
  '108', // Judy Álvarez: Braindance Maestro
]);

const BETA_STAMP_NOTE =
  'Beta Event kit B-stamp promo — track B copies on this card (Vault Legend playset or Street for Mantis Blades).';

/** Showcase extras — sheets 1–2; not part of MS01 140 */
const SHOWCASE = [
  // [id, number, name, type, eurodollars, rarity, sheet, face, row, notes]
  ['N000', 'N000', 'Jackie & V: Chooms to the End', 'Legend', 5, 'Promo', 1, 'F', 1, 'Promo — not part of MS01 140'],
  ['N001', 'N001', 'Lucyna Kushinada: Fresh Beginnings', 'Legend', null, 'Promo', 1, 'F', 2, 'Promo — not part of MS01 140'],
  ['PRM01-005', 'PRM01-005', 'Rebecca: Having a Moment', 'Legend', null, 'Nova', 1, 'F', 3, 'Nova Rare box topper — chase card, not MS01 set number'],
  ['NIGHTCITYBRAWL-S1-00', 'NIGHTCITYBRAWL S1-00', 'Minotaur', 'Unit', 7, 'Nova', 1, 'B', 1, 'Nova Rare box topper — not part of MS01 140'],
  ['SD01-001', 'SD01-001', 'Viktor Vektor: Sit Down and Relax', 'Legend', null, 'Epic', 1, 'B', 2, 'Starter deck exclusive'],
  ['SD01-002', 'SD01-002', 'Dexter DeShawn: One Last Chance', 'Unit', 3, 'Uncommon', 1, 'B', 3, 'Starter deck exclusive'],
  ['SD01-011', 'SD01-011', 'Jackie Welles: Pour One Out For Me', 'Legend', null, 'Epic', 2, 'F', 1, 'Starter deck exclusive'],
  ['SD01-012', 'SD01-012', 'V: Corporate Exile', 'Legend', 5, 'Epic', 2, 'F', 2, 'Starter deck exclusive'],
  ['SD01-015', 'SD01-015', 'MT0D12 Flathead', 'Unit', 5, 'Uncommon', 2, 'F', 3, 'Starter deck exclusive'],
  ['SD02-001', 'SD02-001', 'Yorinobu Arasaka: Embracing Destruction', 'Legend', null, 'Epic', 2, 'B', 1, 'Starter deck exclusive'],
  ['SD02-012', 'SD02-012', 'Goro Takemura: Hands Unclean', 'Legend', 5, 'Epic', 2, 'B', 2, 'Starter deck exclusive'],
  ['SD02-013', 'SD02-013', 'Saburo Arasaka: Stubborn Patriarch', 'Legend', null, 'Epic', 2, 'B', 3, 'Starter deck exclusive'],
  ['SD02-017', 'SD02-017', 'Goro Takemura: Losing His Way', 'Unit', 4, 'Uncommon', 2, null, null, 'Starter deck exclusive — place in remaining showcase pocket'],
  ['JUDGEPROMOS-001', 'JUDGEPROMOS-001', 'Secondhand Bombus (Judge Promo)', 'Unit', 2, 'Promo', 1, null, null, 'Promo stamp of MS01-053 — showcase only'],
  ['JUDGEPROMOS-002', 'JUDGEPROMOS-002', 'MaxTac Squadron (Judge Promo)', 'Unit', 3, 'Promo', 1, null, null, 'Promo stamp of MS01-082 — showcase only'],
  ['JUDGEPROMOS-003', 'JUDGEPROMOS-003', 'Delamain: Rideshare AI (Judge Promo)', 'Unit', 3, 'Promo', 1, null, null, 'Promo stamp of MS01-111 — showcase only'],
];

export function buildCards() {
  const cards = [];
  let sort = 0;

  for (const [number, name, type, eurodollars, rarity, slotCode] of MS01) {
    const slot = parseSlot(slotCode);
    const hasBstamp = BETA_STAMP_NUMBERS.has(String(number));
    const judge = JUDGE_NOTES[number] || null;
    const notes = [judge, hasBstamp ? BETA_STAMP_NOTE : null].filter(Boolean).join(' ') || null;
    cards.push({
      id: `MS01-${number}`,
      number,
      name,
      type,
      eurodollars,
      rarity,
      zone: slot.zone,
      zone_slot: slot.zoneSlot,
      sheet: slot.sheet,
      face: slot.face,
      row_pos: slot.row,
      band: bandFor(number),
      has_iconic: hasIconic(type, rarity, number),
      has_bstamp: hasBstamp,
      set_code: 'MS01',
      notes,
      sort_order: sort++,
    });
  }

  for (const row of SHOWCASE) {
    const [id, number, name, type, eurodollars, rarity, sheet, face, rowPos, notes] = row;
    cards.push({
      id,
      number,
      name,
      type,
      eurodollars,
      rarity,
      zone: 'X',
      zone_slot: null,
      sheet,
      face,
      row_pos: rowPos,
      band: null,
      has_iconic: hasIconic(type, rarity, number),
      has_bstamp: false,
      set_code: 'showcase',
      notes,
      sort_order: sort++,
    });
  }

  return cards;
}

export { MS01, SHOWCASE, hasIconic, bandFor };
