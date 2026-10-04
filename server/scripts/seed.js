// Inserts a few sample recipes so the app has something to show.
// Usage: npm run seed            (adds samples, skipping titles that already exist)
//        npm run seed -- --reset (clears the recipes collection first)
import 'dotenv/config';
import mongoose from 'mongoose';
import Recipe from '../models/Recipe.js';

const samples = [
  {
    title: 'Masala Chai',
    description: 'Spiced milk tea for slow mornings.',
    category: 'Breakfast',
    cookTime: 10,
    ingredients: ['1 cup water', '1 cup milk', '2 tsp loose black tea', '2 cardamom pods, crushed', '1 small piece ginger', 'Sugar to taste'],
    steps: ['Boil the water with the ginger and cardamom.', 'Add the tea and simmer for 2 minutes.', 'Pour in the milk and sugar, bring back to a boil.', 'Strain into cups and serve hot.'],
  },
  {
    title: 'Chana Masala',
    description: 'Chickpeas simmered in a tangy onion-tomato gravy.',
    category: 'Dinner',
    cookTime: 35,
    ingredients: ['2 cans chickpeas, drained', '1 onion, finely chopped', '2 tomatoes, pureed', '1 tbsp ginger-garlic paste', '1 tbsp chana masala spice mix', '2 tbsp oil', 'Fresh coriander'],
    steps: ['Heat the oil and fry the onion until golden.', 'Add ginger-garlic paste and cook for a minute.', 'Stir in the tomato puree and spice mix; cook until the oil separates.', 'Add the chickpeas and a cup of water, simmer for 15 minutes.', 'Garnish with coriander.'],
  },
  {
    title: 'Mango Smoothie',
    description: 'A thick, cold smoothie with ripe mangoes.',
    category: 'Snack',
    cookTime: 5,
    ingredients: ['1 ripe mango, chopped', '1 cup yogurt', '1 tbsp honey', 'A handful of ice'],
    steps: ['Blend everything until smooth.', 'Serve chilled.'],
  },
  {
    title: 'Vegetable Poha',
    description: 'Light flattened-rice breakfast with peas and peanuts.',
    category: 'Breakfast',
    cookTime: 20,
    ingredients: ['2 cups thick poha', '1 onion, chopped', '1/2 cup green peas', '2 tbsp peanuts', '1 tsp mustard seeds', '1/2 tsp turmeric', 'Lemon juice'],
    steps: ['Rinse the poha and let it drain.', 'Fry peanuts and mustard seeds in oil, then add onion and peas.', 'Add turmeric and the poha, mix gently and steam for 3 minutes.', 'Finish with lemon juice.'],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set. Copy server/.env.example to server/.env first.');
    process.exit(1);
  }

  await mongoose.connect(uri);

  if (process.argv.includes('--reset')) {
    const { deletedCount } = await Recipe.deleteMany({});
    console.log(`🧹 Removed ${deletedCount} existing recipes`);
  }

  let added = 0;
  for (const sample of samples) {
    const exists = await Recipe.exists({ title: sample.title });
    if (!exists) {
      await Recipe.create(sample);
      added += 1;
    }
  }
  console.log(`🌱 Added ${added} sample recipes (${samples.length - added} already existed)`);
}

seed()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
