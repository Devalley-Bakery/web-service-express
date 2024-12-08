import prisma from './index.mjs'

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Calzone de Calabresa', 
        price: 8.50,
        type: "food",
        stockQuantity: 15,
        imagePath: "https://th.bing.com/th/id/OIP.FJ-NQ4yUxTBYRLe5Gg3aZAHaE8?rs=1&pid=ImgDetMain",
      },
      {
        name: 'Calzone de Frango',
        price: 10.50,
        type: "food",
        stockQuantity: 28,
        imagePath: "https://th.bing.com/th/id/R.3b12eb7a9223fae99096dda9f8afa0a6?rik=IjSyclQs4PPF5A&pid=ImgRaw&r=0%27",
      },
      {
        name: 'Coxinha',
        price: 6.50,
        type: "food",
        stockQuantity: 22,
        imagePath: "https://i.pinimg.com/564x/80/e6/1c/80e61c8b719dd0a0b9f1dc845803b0fe.jpg"
      },
      {
        name: 'Empada de Frango',
        price: 8.0,
        type: "food",
        stockQuantity: 32,
        imagePath: "https://th.bing.com/th/id/OIP.vY0QQZBCt_UtiEevZ52QgwHaFJ?rs=1&pid=ImgDetMain%27",
      },
      {
        name: 'Brigadeiro',
        price: 4.5,
        type: "dessert",
        stockQuantity: 12,
        imagePath: "https://www.guiadasemana.com.br/contentFiles/system/pictures/2015/7/139076/original/fotolia-51257019-subscription-monthly-m.jpg",
      },
      {
        name: 'Croassaint de chocolate',
        price: 7.5,
        type: "dessert",
        stockQuantity: 32,
        imagePath: "https://i.pinimg.com/originals/1d/89/9f/1d899f3c2c688f3d1e2c6c7f2a4e2df5.jpg",
      },
      {
        name: "Bolo de Cenoura",
        price: 15.0,
        type: "dessert",
        stockQuantity: 10,
        imagePath: "https://th.bing.com/th/id/R.ca4bc05a670700acf7cada85ce20e7fa?rik=E%2bqZK7EEn3vs6A&riu=http%3a%2f%2fwww.aminhafestinha.com%2fwp-content%2fuploads%2f2019%2f03%2fbolo-de-cenoura.jpg&ehk=viKJBzN82vIWh6gdpZJRyY3LSBkMMa3Sz7ObULYkb5c%3d&risl=&pid=ImgRaw&r=0",
      },
      {
        name: "Suco de Laranja",
        price: 7.0,
        type: "drink",
        stockQuantity: 20,
        imagePath: "https://th.bing.com/th/id/OIP.NWaBAFc0YFkJJoE9lbW62wAAAA?rs=1&pid=ImgDetMain%27",
      },
      {
        name: "Suco de Moranjo",
        price: 8.0,
        type: "drink",
        stockQuantity: 20,
        imagePath: "https://th.bing.com/th/id/R.456e684530f12099f7acba12454d8e39?rik=mZQVxChpmJyDHg&pid=ImgRaw&r=0"
      },
      {
        name: "Soda Italiana de Kiwi",
        price: 3.50,
        type: 'drink',
        stockQuantity: 40,
        imagePath: "https://i.pinimg.com/236x/de/70/c7/de70c77071e8bd3bb90058d5bcaf4d34.jpg"
      }
    ],
  });

  await prisma.employee.createMany({
    data: [
      {
        name: "service",
        role: "attendant",
      },
      {
        name: "admin",
        role: "manager", 
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
