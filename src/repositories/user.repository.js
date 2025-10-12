const prisma = require('../lib/database');
class UserRepository {
    async create(userData) {
        return await prisma.user.create({
            data: userData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                isAdmin: true
            }
        });
    }
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                isAdmin: true
            }
        });
    }
    async existsByEmail(email) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });
        return !!user;
    }
}
module.exports = new UserRepository();