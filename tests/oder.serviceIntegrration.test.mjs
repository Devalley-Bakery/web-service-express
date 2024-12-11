import request from 'supertest';
import prisma from '../prisma/index.mjs';
import app from '../src/app.mjs';

describe('POST /orders - Cadastro de Pedido', () => {
    beforeEach(async () => {
        await prisma.$executeRaw`DELETE FROM \`OrderProduct\``;
        await prisma.$executeRaw`DELETE FROM \`Orders\``;
        await prisma.$executeRaw`DELETE FROM \`Product\``;
        await prisma.$executeRaw`DELETE FROM \`Employee\``;
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

        const response = await request(app)
            .post('/orders')
            .send({
                employeeId: employee.id,
                products: [{ productId: product.id, quantity: 2 }],
            });

        expect(response.status).toBe(201);
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

    it('Deve retornar erro para produto inexistente', async () => {
        const employee = await prisma.employee.create({
            data: { name: 'Funcionario 1', role: 'attendant' },
        });

        const response = await request(app)
            .post('/orders')
            .send({
                employeeId: employee.id,
                products: [{ productId: 999, quantity: 1 }],
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe(undefined);
    });

    it('Deve retornar erro para lista de produtos inválida', async () => {
        const employee = await prisma.employee.create({
            data: { name: 'Funcionario 1', role: 'attendant' },
        });

        const response = await request(app)
            .post('/orders')
            .send({
                employeeId: employee.id,
                products: [],
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Invalid products');
    });

    it('Deve retornar erro para quantidade superior ao estoque disponível', async () => {
        const employee = await prisma.employee.create({
            data: { name: 'Funcionario 1', role: 'attendant' },
        });

        const product = await prisma.product.create({
            data: { name: 'Produto 1', price: 10.5, type: 'food', stockQuantity: 5 },
        });

        const response = await request(app)
            .post('/orders')
            .send({
                employeeId: employee.id,
                products: [{ productId: product.id, quantity: 10 }],
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe(undefined);
    });

    it('Deve permitir criar pedido com produtos no limite do estoque disponível', async () => {
        const employee = await prisma.employee.create({
            data: { name: 'Funcionario 1', role: 'attendant' },
        });

        const product = await prisma.product.create({
            data: { name: 'Produto 1', price: 10.5, type: 'food', stockQuantity: 5 },
        });

        const response = await request(app)
            .post('/orders')
            .send({
                employeeId: employee.id,
                products: [{ productId: product.id, quantity: 5 }],
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Order created successfully.');
        expect(response.body.data.total).toBe("52.5");

        const productAfterOrder = await prisma.product.findUnique({
            where: { id: product.id },
        });

        expect(productAfterOrder.stockQuantity).toBe(0);
    });
});
