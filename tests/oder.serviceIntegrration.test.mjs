import request from 'supertest';
import prisma from '../prisma/index.mjs';
import app from '../src/app.mjs';

describe('POST /orders - Cadastro de Pedido', () => {
    beforeEach(async () => {;
        await prisma.$executeRaw`DELETE FROM \`OrderProduct\``;
        await prisma.$executeRaw`DELETE FROM \`Orders\``;
        await prisma.$executeRaw`DELETE FROM \`Product\``;
        await prisma.$executeRaw`DELETE FROM \`Employee\``;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('Deve criar um pedido com sucesso', async () => {
        const employee = await prisma.employee.create({
            data: { name: 'Funcionario 1', role: 'attendant' },
        });

        const product = await prisma.product.create({
            data: { name: 'Produto 1', price: 10.5, type: 'food', stockQuantity: 100 },
        });

        // Envia a requisição para criar o pedido
        const response = await request(app)
            .post('/orders')
            .send({
                employeeId: employee.id,
                products: [{ productId: product.id, quantity: 2 }],
            });

        // Verifica a resposta
        expect(response.status).toBe(201);  // Status de criação
        expect(response.body.message).toBe('Order created successfully.');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.status).toBe('in_progress');
        expect(response.body.data.total).toBe("21");


        const order = await prisma.orders.findUnique({
            where: { id: response.body.data.id },
            include: { products: true },
        });
        expect(order).not.toBeNull();
        expect(order.products.length).toBe(1);
    });
});