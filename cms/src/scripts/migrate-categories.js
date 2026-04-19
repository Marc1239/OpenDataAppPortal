// MongoDB migration: consolidate categories from 27 → 7.
// Run via: docker exec odap_mongo mongosh --quiet opendata /tmp/migrate-categories.js

const NEW_CATEGORIES = [
  { name: "Mobilität & Verkehr", slug: "mobilitaet-verkehr", icon: "Bus" },
  { name: "Umwelt & Klima", slug: "umwelt-klima", icon: "TreePine" },
  { name: "Politik & Verwaltung", slug: "politik-verwaltung", icon: "Landmark" },
  { name: "Bürgerservices", slug: "buergerservices", icon: "Users" },
  { name: "Geo & Stadtdaten", slug: "geo-stadtdaten", icon: "Map" },
  { name: "Bildung & Kultur", slug: "bildung-kultur", icon: "GraduationCap" },
  { name: "Freizeit & Sport", slug: "freizeit-sport", icon: "Dumbbell" },
];

// Mapping: old category name → new category name
const MAPPING = {
  "Mobilität": "Mobilität & Verkehr",
  "Verkehr": "Mobilität & Verkehr",
  "Mobilität & Sicherheit": "Mobilität & Verkehr",
  "Barrierefreiheit & Mobilität": "Mobilität & Verkehr",

  "Umwelt & Klima": "Umwelt & Klima",
  "Energie & Klima": "Umwelt & Klima",
  "Umwelt & Gesundheit": "Umwelt & Klima",
  "Umwelt & Wasser": "Umwelt & Klima",
  "Umwelt": "Umwelt & Klima",
  "Nachhaltigkeit": "Umwelt & Klima",

  "Politik & Verwaltung": "Politik & Verwaltung",
  "Politik": "Politik & Verwaltung",
  "Haushalt & Transparenz": "Politik & Verwaltung",
  "Recht & Transparenz": "Politik & Verwaltung",
  "Verwaltung": "Politik & Verwaltung",

  "Bürgerservices": "Bürgerservices",
  "Familie & Soziales": "Bürgerservices",
  "Integration": "Bürgerservices",
  "Gesundheit": "Bürgerservices",

  "Geo & Stadtdaten": "Geo & Stadtdaten",
  "Smart City & Stadtdaten": "Geo & Stadtdaten",
  "Wirtschaft & Stadtentwicklung": "Geo & Stadtdaten",
  "Wirtschaft": "Geo & Stadtdaten",
  "Tourismus": "Geo & Stadtdaten",

  "Bildung & Kultur": "Bildung & Kultur",
  "Bildung": "Bildung & Kultur",
  "Bildung & Infrastruktur": "Bildung & Kultur",
  "Geschichte & Kultur": "Bildung & Kultur",
  "Kultur": "Bildung & Kultur",

  "Freizeit & Sport": "Freizeit & Sport",
  "Freizeit": "Freizeit & Sport",
  "Freizeit & Stadtdaten": "Freizeit & Sport",
  "Sport": "Freizeit & Sport",
  "Essen": "Freizeit & Sport",
};

// 1. Upsert new canonical categories.
const newIds = {};
for (const cat of NEW_CATEGORIES) {
  const now = new Date();
  const res = db.categories.findOneAndUpdate(
    { slug: cat.slug },
    {
      $set: { name: cat.name, icon: cat.icon, updatedAt: now },
      $setOnInsert: { slug: cat.slug, createdAt: now },
    },
    { upsert: true, returnDocument: "after" },
  );
  newIds[cat.name] = res._id;
  print(`✓ Kategorie: ${cat.name} (${res._id})`);
}

// 2. Build old-id → new-id map from existing categories.
const oldCats = db.categories.find({}).toArray();
const oldToNew = {};
for (const oc of oldCats) {
  const targetName = MAPPING[oc.name];
  if (!targetName) {
    print(`⚠ Kein Mapping für: ${oc.name} (${oc._id}) — wird übersprungen`);
    continue;
  }
  const targetId = newIds[targetName];
  if (String(oc._id) === String(targetId)) continue;
  oldToNew[String(oc._id)] = targetId;
}

// 3. Rewrite app.category references.
let updated = 0;
for (const [oldId, newId] of Object.entries(oldToNew)) {
  const r = db.apps.updateMany(
    { category: ObjectId(oldId) },
    { $set: { category: newId } },
  );
  if (r.modifiedCount > 0) {
    print(`→ ${r.modifiedCount} App(s) von ${oldId} zu ${newId}`);
    updated += r.modifiedCount;
  }
}
print(`Σ Apps umgehängt: ${updated}`);

// 4. Delete obsolete categories (anything not in the 7 new slugs).
const keepSlugs = NEW_CATEGORIES.map((c) => c.slug);
const del = db.categories.deleteMany({ slug: { $nin: keepSlugs } });
print(`✗ Alte Kategorien gelöscht: ${del.deletedCount}`);

// 5. Report leftover orphan apps (category pointing to missing doc).
const remaining = db.categories.countDocuments({});
const orphanApps = db.apps.countDocuments({
  category: { $exists: true, $nin: db.categories.distinct("_id") },
});
print(`Kategorien jetzt: ${remaining}`);
print(`Orphan-Apps ohne Kategorie: ${orphanApps}`);
