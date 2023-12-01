import mongoose from "mongoose";

const SuperheroSchema = new mongoose.Schema({
  id: Number,
  "name": String,
  "Gender": String,
  "Eye color": String,
  "Race": String,
  "Hair color": String,
  "Height": Number,
  "Publisher": String,
  "Skin color": String,
  "Alignment": String,
  "Weight": Number
});

const SuperheroPowerSchema = new mongoose.Schema({
  hero_names: String,
  // Include other power fields as Boolean types
  "Agility": Boolean,
  "Accelerated Healing": Boolean,
  "Lantern Power Ring": Boolean,
  "Dimensional Awareness": Boolean,
  "Cold Resistance": Boolean,
  "Durability": Boolean,
  "Stealth": Boolean,
  "Energy Absorption": Boolean,
  "Flight": Boolean,
  "Danger Sense": Boolean,
  "Underwater breathing": Boolean,
  "Marksmanship": Boolean,
  "Weapons Master": Boolean,
  "Power Augmentation": Boolean,
  "Animal Attributes": Boolean,
  "Longevity": Boolean,
  "Intelligence": Boolean,
  "Super Strength": Boolean,
  "Cryokinesis": Boolean,
  "Telepathy": Boolean,
  "Energy Armor": Boolean,
  "Energy Blasts": Boolean,
  "Duplication": Boolean,
  "Size Changing": Boolean,
  "Density Control": Boolean,
  "Stamina": Boolean,
  "Astral Travel": Boolean,
  "Audio Control": Boolean,
  "Dexterity": Boolean,
  "Omnitrix": Boolean,
  "Super Speed": Boolean,
  "Possession": Boolean,
  "Animal Oriented Powers": Boolean,
  "Weapon-based Powers": Boolean,
  "Electrokinesis": Boolean,
  "Darkforce Manipulation": Boolean,
  "Death Touch": Boolean,
  "Teleportation": Boolean,
  "Enhanced Senses": Boolean,
  "Telekinesis": Boolean,
  "Energy Beams": Boolean,
  "Magic": Boolean,
  "Hyperkinesis": Boolean,
  "Jump": Boolean,
  "Clairvoyance": Boolean,
  "Dimensional Travel": Boolean,
  "Power Sense": Boolean,
  "Shapeshifting": Boolean,
  "Peak Human Condition": Boolean,
  "Immortality": Boolean,
  "Camouflage": Boolean,
  "Element Control": Boolean,
  "Phasing": Boolean,
  "Astral Projection": Boolean,
  "Electrical Transport": Boolean,
  "Fire Control": Boolean,
  "Projection": Boolean,
  "Summoning": Boolean,
  "Enhanced Memory": Boolean,
  "Reflexes": Boolean,
  "Invulnerability": Boolean,
  "Energy Constructs": Boolean,
  "Force Fields": Boolean,
  "Self-Sustenance": Boolean,
  "Anti-Gravity": Boolean,
  "Empathy": Boolean,
  "Power Nullifier": Boolean,
  "Radiation Control": Boolean,
  "Psionic Powers": Boolean,
  "Elasticity": Boolean,
  "Substance Secretion": Boolean,
  "Elemental Transmogrification": Boolean,
  "Technopath/Cyberpath": Boolean,
  "Photographic Reflexes": Boolean,
  "Seismic Power": Boolean,
  "Animation": Boolean,
  "Precognition": Boolean,
  "Mind Control": Boolean,
  "Fire Resistance": Boolean,
  "Power Absorption": Boolean,
  "Enhanced Hearing": Boolean,
  "Nova Force": Boolean,
  "Insanity": Boolean,
  "Hypnokinesis": Boolean,
  "Animal Control": Boolean,
  "Natural Armor": Boolean,
  "Intangibility": Boolean,
  "Enhanced Sight": Boolean,
  "Molecular Manipulation": Boolean,
  "Heat Generation": Boolean,
  "Adaptation": Boolean,
  "Gliding": Boolean,
  "Power Suit": Boolean,
  "Mind Blast": Boolean,
  "Probability Manipulation": Boolean,
  "Gravity Control": Boolean,
  "Regeneration": Boolean,
  "Light Control": Boolean,
  "Echolocation": Boolean,
  "Levitation": Boolean,
  "Toxin and Disease Control": Boolean,
  "Banish": Boolean,
  "Energy Manipulation": Boolean,
  "Heat Resistance": Boolean,
  "Natural Weapons": Boolean,
  "Time Travel": Boolean,
  "Enhanced Smell": Boolean,
  "Illusions": Boolean,
  "Thirstokinesis": Boolean,
  "Hair Manipulation": Boolean,
  "Illumination": Boolean,
  "Omnipotent": Boolean,
  "Cloaking": Boolean,
  "Changing Armor": Boolean,
  "Power Cosmic": Boolean,
  "Biokinesis": Boolean,
  "Water Control": Boolean,
  "Radiation Immunity": Boolean,
  "Vision - Telescopic": Boolean,
  "Toxin and Disease Resistance": Boolean,
  "Spatial Awareness": Boolean,
  "Energy Resistance": Boolean,
  "Telepathy Resistance": Boolean,
  "Molecular Combustion": Boolean,
  "Omnilingualism": Boolean,
  "Portal Creation": Boolean,
  "Magnetism": Boolean,
  "Mind Control Resistance": Boolean,
  "Plant Control": Boolean,
  "Sonar": Boolean,
  "Sonic Scream": Boolean,
  "Time Manipulation": Boolean,
  "Enhanced Touch": Boolean,
  "Magic Resistance": Boolean,
  "Invisibility": Boolean,
  "Sub-Mariner": Boolean,
  "Radiation Absorption": Boolean,
  "Intuitive aptitude": Boolean,
  "Vision - Microscopic": Boolean,
  "Melting": Boolean,
  "Wind Control": Boolean,
  "Super Breath": Boolean,
  "Wallcrawling": Boolean,
  "Vision - Night": Boolean,
  "Vision - Infrared": Boolean,
  "Grim Reaping": Boolean,
  "Matter Absorption": Boolean,
  "The Force": Boolean,
  "Resurrection": Boolean,
  "Terrakinesis": Boolean,
  "Vision - Heat": Boolean,
  "Vitakinesis": Boolean,
  "Radar Sense": Boolean,
  "Qwardian Power Ring": Boolean,
  "Weather Control": Boolean,
  "Vision - X-Ray": Boolean,
  "Vision - Thermal": Boolean,
  "Web Creation": Boolean,
  "Reality Warping": Boolean,
  "Odin Force": Boolean,
  "Symbiote Costume": Boolean,
  "Speed Force": Boolean,
  "Phoenix Force": Boolean,
  "Molecular Dissipation": Boolean,
  "Vision - Cryo": Boolean,
  "Omnipresent": Boolean,
  "Omniscient": Boolean
});

const Superhero = mongoose.model('Superhero', SuperheroSchema);
const SuperheroPower = mongoose.model('SuperheroPower', SuperheroPowerSchema);

export { Superhero, SuperheroPower };