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
                password: true, // Include password for authentication
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
    async findById(id) {
        return await prisma.user.findUnique(
            {
                where: { id },
                select:
                {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                    isAdmin: true
                }
            }
        );
    }

    async updateById(id, updateData) {
        return await prisma.user.update({
            where: { id },
            data: updateData,
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

    async deleteById(id) {
        return await prisma.user.delete({
            where: { id }
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