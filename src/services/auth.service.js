const { userRepository } = require('../repositories');
const { auth } = require('../lib');
const tokenService = require('./token.service');
const { MESSAGES } = require('../constants');

class AuthService {
    async register(userData, res) {
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
    
            const token = tokenService.generateAccessToken({
                userId: newUser.id,
                email: newUser.email
            });
    
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });
    
            return {
                user: newUser,
                message: MESSAGES.USER_CREATED
            };
    
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    }
    async login(email, password, res) {
        try {
            console.log("problemhere");
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
    
            const token = tokenService.generateAccessToken({
                userId: user.id,
                email: user.email
            });
    
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });
    
            const { password: _, ...userWithoutPassword } = user;
    
            return {
                user: userWithoutPassword,
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
    async logout(res) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax'
            });
    
            return {
                message: 'Logged out successfully'
            };
    
        } catch (error) {
            throw new Error(error.message || 'Logout failed');
        }
    }
}

module.exports = new AuthService();