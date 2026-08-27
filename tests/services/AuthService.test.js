import { jest } from '@jest/globals';
import AuthService from '../../src/services/AuthService.js';


describe('AuthService', () => {

    let service;
    let mockUserRepository;
    let mockUserValidations;


    beforeEach(() => {

        mockUserRepository = {
            findById: jest.fn()
        };

        mockUserValidations = {
            validateEmail: jest.fn()
        };

        service = new AuthService({
            UserRepository: mockUserRepository,
            UserValidations: mockUserValidations
        });

    });


    describe('getMe', () => {

        test('Debe devolver el usuario cuando existe', async () => {

            const user = {
                user_id: '123',
                name: 'Alexander',
                lastname: 'Mota',
                username: 'alex',
                email: 'alex@test.com'
            };

            mockUserRepository.findById.mockResolvedValue(user);


            const result = await service.getMe('123');


            expect(result).toEqual(user);

            expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);

            expect(mockUserRepository.findById)
                .toHaveBeenCalledWith('123');

        });


        test('Debe lanzar un error cuando el usuario no existe', async () => {

            mockUserRepository.findById.mockResolvedValue(null);


            await expect(
                service.getMe('999')
            ).rejects.toThrow('Usuario no encontrado');


            expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);

            expect(mockUserRepository.findById)
                .toHaveBeenCalledWith('999');

        });

    });

});

