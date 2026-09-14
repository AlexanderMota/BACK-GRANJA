import { jest } from '@jest/globals';

import UserRepository from '../../src/repositories/UserRepository.js';
import { DBPool } from '../../src/config/dbconnection.js';

const userRepository = new UserRepository({
    DBPool
});

describe('UserRepository - Integración', () => {

    afterAll(async () => {
        await DBPool.end();
    });

    describe('register', () => {
        test('debería conectarse correctamente a la base de datos de test', async () => {

            const [rows] = await DBPool.query('SELECT 1 AS resultado');

            expect(rows[0].resultado).toBe(1);
        });
        test('debería registrar un usuario correctamente', async () => {

            const user = {
                user_id: 'test-user-001',
                name: 'Usuario',
                lastname: 'Test',
                username: 'usuario_test',
                email: 'usuario.test@example.com',
                phone: '600000000',
                password: 'password_test'
            };

            const result = await userRepository.register(user);

            expect(result).toBeDefined();
        });

    });

});