import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Croassaint de Frango",
        price: 8.5,
        type: "food",
        stock_quantity: 15, // altere para stock_quantity
        image_path: "/uploads/croassaint.jpg",
      },
      {
        name: "Bolo de Cenoura",
        price: 15.0,
        type: "dessert",
        stock_quantity: 10, // altere para stock_quantity
        image_path: "/carrot_cake.jpg",
      },
      {
        name: "Suco de Morango",
        price: 7.0,
        type: "drink",
        stock_quantity: 20, // altere para stock_quantity
        image_path: "strawberry_juice.jpg",
      },
    ],
  });

  await prisma.employee.createMany({
    data: [
      {
        name: "service",
        role: "attendant", // função de atendente
      },
      {
        name: "admin",
        role: "manager", // função de gerente
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
