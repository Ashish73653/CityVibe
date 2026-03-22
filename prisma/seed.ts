import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create Cities
  const cities = await Promise.all([
    prisma.city.create({ data: { name: 'Indore', state: 'Madhya Pradesh' } }),
    prisma.city.create({ data: { name: 'Bhopal', state: 'Madhya Pradesh' } }),
    prisma.city.create({ data: { name: 'Jabalpur', state: 'Madhya Pradesh' } }),
    prisma.city.create({ data: { name: 'Udaipur', state: 'Rajasthan' } }),
    prisma.city.create({ data: { name: 'Kota', state: 'Rajasthan' } }),
  ]);
  console.log('Created cities:', cities.length);

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Food Spots', slug: 'food-spots', description: 'Best food places and restaurants' } }),
    prisma.category.create({ data: { name: 'Cafes', slug: 'cafes', description: 'Cozy cafes and coffee shops' } }),
    prisma.category.create({ data: { name: 'Study Cafes', slug: 'study-cafes', description: 'Perfect places for studying' } }),
    prisma.category.create({ data: { name: 'Date Places', slug: 'date-places', description: 'Romantic spots for couples' } }),
    prisma.category.create({ data: { name: 'Sports Grounds', slug: 'sports-grounds', description: 'Sports and fitness areas' } }),
    prisma.category.create({ data: { name: 'Parks', slug: 'parks', description: 'Gardens and parks' } }),
    prisma.category.create({ data: { name: 'Hidden Gems', slug: 'hidden-gems', description: 'Lesser-known amazing places' } }),
    prisma.category.create({ data: { name: 'Street Food', slug: 'street-food', description: 'Local street food vendors' } }),
  ]);
  console.log('Created categories:', categories.length);

  // Create Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@cityvibe.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      selectedCityId: cities[0].id,
    },
  });
  console.log('Created admin user:', admin.email);

  // Create Regular Users
  const userPasswordHash = await bcrypt.hash('user123', 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        passwordHash: userPasswordHash,
        role: 'USER',
        selectedCityId: cities[0].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Priya Patel',
        email: 'priya@example.com',
        passwordHash: userPasswordHash,
        role: 'USER',
        selectedCityId: cities[0].id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        passwordHash: userPasswordHash,
        role: 'USER',
        selectedCityId: cities[1].id,
      },
    }),
  ]);
  console.log('Created users:', users.length);

  // Create Places - Indore
  const indorePlaces = await Promise.all([
    prisma.place.create({
      data: {
        name: '56 Dukan',
        cityId: cities[0].id,
        categoryId: categories[7].id, // Street Food
        address: 'Vijay Nagar, Indore',
        locality: 'Vijay Nagar',
        description: 'Famous food street with variety of street food options',
      },
    }),
    prisma.place.create({
      data: {
        name: 'Chappan Dukan',
        cityId: cities[0].id,
        categoryId: categories[7].id,
        address: 'New Palasia, Indore',
        locality: 'New Palasia',
        description: 'Iconic 56 food stalls offering local delicacies',
      },
    }),
    prisma.place.create({
      data: {
        name: 'Cafe Terazza',
        cityId: cities[0].id,
        categoryId: categories[1].id, // Cafes
        address: 'Sapna Sangeeta Road, Indore',
        locality: 'Sapna Sangeeta',
        description: 'Rooftop cafe with great ambiance',
      },
    }),
    prisma.place.create({
      data: {
        name: 'Central Library Cafe',
        cityId: cities[0].id,
        categoryId: categories[2].id, // Study Cafes
        address: 'Scheme 78, Indore',
        locality: 'Scheme 78',
        description: 'Quiet place perfect for studying',
      },
    }),
    prisma.place.create({
      data: {
        name: 'Ralamandal Wildlife Sanctuary',
        cityId: cities[0].id,
        categoryId: categories[5].id, // Parks
        address: 'Indore-Khandwa Road, Indore',
        locality: 'Ralamandal',
        description: 'Beautiful wildlife sanctuary and park',
      },
    }),
  ]);

  // Create Places - Bhopal
  const bhopalPlaces = await Promise.all([
    prisma.place.create({
      data: {
        name: 'Upper Lake View Point',
        cityId: cities[1].id,
        categoryId: categories[3].id, // Date Places
        address: 'Van Vihar Road, Bhopal',
        locality: 'Shyamla Hills',
        description: 'Scenic lake view perfect for romantic outings',
      },
    }),
    prisma.place.create({
      data: {
        name: 'Indian Coffee House',
        cityId: cities[1].id,
        categoryId: categories[1].id, // Cafes
        address: 'MP Nagar, Bhopal',
        locality: 'MP Nagar',
        description: 'Iconic old-style coffee house',
      },
    }),
    prisma.place.create({
      data: {
        name: 'Van Vihar National Park',
        cityId: cities[1].id,
        categoryId: categories[5].id, // Parks
        address: 'Van Vihar Road, Bhopal',
        locality: 'Shyamla Hills',
        description: 'National park in the heart of city',
      },
    }),
  ]);

  const allPlaces = [...indorePlaces, ...bhopalPlaces];
  console.log('Created places:', allPlaces.length);

  // Create Sample Posts
  const posts = await Promise.all([
    prisma.recommendationPost.create({
      data: {
        userId: users[0].id,
        cityId: cities[0].id,
        placeId: indorePlaces[0].id,
        categoryId: categories[7].id,
        caption: 'Best place for evening snacks! Try the corn and momos here 😋',
        mediaUrl: '/uploads/sample-1.jpg',
        mediaType: 'IMAGE',
        tags: 'evening,snacks,budget-friendly',
        budgetEstimate: 150,
      },
    }),
    prisma.recommendationPost.create({
      data: {
        userId: users[1].id,
        cityId: cities[0].id,
        placeId: indorePlaces[2].id,
        categoryId: categories[1].id,
        caption: 'Amazing rooftop vibes! Perfect for weekend hangout with friends ☕',
        mediaUrl: '/uploads/sample-2.jpg',
        mediaType: 'IMAGE',
        tags: 'rooftop,weekend,friends',
        budgetEstimate: 400,
      },
    }),
    prisma.recommendationPost.create({
      data: {
        userId: users[0].id,
        cityId: cities[0].id,
        placeId: indorePlaces[3].id,
        categoryId: categories[2].id,
        caption: 'Super quiet and peaceful. Great wifi and charging points for studying 📚',
        mediaUrl: '/uploads/sample-3.jpg',
        mediaType: 'IMAGE',
        tags: 'study,peaceful,wifi',
        budgetEstimate: 200,
      },
    }),
    prisma.recommendationPost.create({
      data: {
        userId: users[2].id,
        cityId: cities[1].id,
        placeId: bhopalPlaces[0].id,
        categoryId: categories[3].id,
        caption: 'Stunning sunset views! Took my partner here and it was magical 🌅',
        mediaUrl: '/uploads/sample-4.jpg',
        mediaType: 'IMAGE',
        tags: 'sunset,romantic,views',
        budgetEstimate: 0,
      },
    }),
    prisma.recommendationPost.create({
      data: {
        userId: users[1].id,
        cityId: cities[0].id,
        placeId: indorePlaces[1].id,
        categoryId: categories[7].id,
        caption: 'The famous poha and jalebi combo is a must try! 🥘',
        mediaUrl: '/uploads/sample-5.jpg',
        mediaType: 'IMAGE',
        tags: 'breakfast,traditional,must-try',
        budgetEstimate: 100,
      },
    }),
    prisma.recommendationPost.create({
      data: {
        userId: users[2].id,
        cityId: cities[1].id,
        placeId: bhopalPlaces[2].id,
        categoryId: categories[5].id,
        caption: 'Morning walk spot! Fresh air and greenery all around 🌳',
        mediaUrl: '/uploads/sample-6.jpg',
        mediaType: 'IMAGE',
        tags: 'morning,nature,exercise',
        budgetEstimate: 0,
      },
    }),
  ]);
  console.log('Created posts:', posts.length);

  // Create some likes
  await Promise.all([
    prisma.like.create({ data: { postId: posts[0].id, userId: users[1].id } }),
    prisma.like.create({ data: { postId: posts[0].id, userId: users[2].id } }),
    prisma.like.create({ data: { postId: posts[1].id, userId: users[0].id } }),
    prisma.like.create({ data: { postId: posts[2].id, userId: users[1].id } }),
    prisma.like.create({ data: { postId: posts[3].id, userId: users[0].id } }),
  ]);
  console.log('Created likes');

  // Create some comments
  await Promise.all([
    prisma.comment.create({
      data: {
        postId: posts[0].id,
        userId: users[1].id,
        content: 'Thanks for the recommendation! Will definitely visit.',
      },
    }),
    prisma.comment.create({
      data: {
        postId: posts[1].id,
        userId: users[0].id,
        content: 'Looks amazing! What time did you go?',
      },
    }),
    prisma.comment.create({
      data: {
        postId: posts[0].id,
        userId: users[2].id,
        content: 'I went there last week, it was awesome!',
      },
    }),
  ]);
  console.log('Created comments');

  // Create some saved places
  await Promise.all([
    prisma.savedPlace.create({ data: { userId: users[0].id, placeId: indorePlaces[2].id } }),
    prisma.savedPlace.create({ data: { userId: users[1].id, placeId: indorePlaces[0].id } }),
    prisma.savedPlace.create({ data: { userId: users[2].id, placeId: bhopalPlaces[0].id } }),
  ]);
  console.log('Created saved places');

  console.log('Seed completed successfully!');
  console.log('\n=== TEST CREDENTIALS ===');
  console.log('Admin:');
  console.log('  Email: admin@cityvibe.com');
  console.log('  Password: admin123');
  console.log('\nRegular Users:');
  console.log('  Email: rahul@example.com');
  console.log('  Password: user123');
  console.log('\n  Email: priya@example.com');
  console.log('  Password: user123');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
