const { userRepository } = require('../repositories');
const { auth } = require('../lib');
const { MESSAGES } = require('../constants');

class AuthService {
    async register(userData) {
        try {
            const existingUser = await userRepository.existsByEmail(userData.email);
            if (existingUser) {
                throw new Error(MESSAGES.USER_EXISTS);
            }
            const hashedPassword = await auth.password.hashPassword(userData.password);

            const newUser = await userRepository.create({
                ...userData,
                password: hashedPassword
            });

            const token = auth.jwt.generateToken({
                userId: newUser.id,
                email: newUser.email
            });

            return {
                user: newUser,
                token,
                message: MESSAGES.USER_CREATED
            };

        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    }

    async login(email, password) {
        try {
            // 1. Find user
            const user = await userRepository.findByEmail(email);
            if (!user) {
                throw new Error(MESSAGES.INVALID_CREDENTIALS);
            }

            if (!user.isActive) {
                throw new Error('Account is deactivated');
            }

            const isPasswordValid = await auth.password.comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new Error(MESSAGES.INVALID_CREDENTIALS);
            }

            const token = auth.jwt.generateToken({
                userId: user.id,
                email: user.email
            });

            const { password: _, ...userWithoutPassword } = user;

            return {
                user: userWithoutPassword,
                token,
                message: MESSAGES.LOGIN_SUCCESS
            };

        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    }

    async getProfile(userId) {
        try {
            const user = await userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            return {
                user,
                message: MESSAGES.SUCCESS
            };

        } catch (error) {
            throw new Error(error.message || 'Failed to get profile');
        }
    }
}

module.exports = new AuthService();