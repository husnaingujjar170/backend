const prisma = require('../lib/database');

class PostRepository {
  async create(postData) {
    return await prisma.post.create({
      data: postData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: { comments: true }
        }
      }
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    return await prisma.post.findMany({
      where: { isActive: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: { comments: true }
        }
      }
    });
  }

  async findById(id) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async findByAuthorId(authorId) {
    return await prisma.post.findMany({
      where: { 
        authorId,
        isActive: true 
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });
  }

  async updateById(id, updateData) {
    return await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  async deleteById(id) {
    return await prisma.post.delete({
      where: { id }
    });
  }

  async isOwner(postId, userId) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    });
    return post?.authorId === userId;
  }
}

module.exports = new PostRepository();