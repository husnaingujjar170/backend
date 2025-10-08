const prisma = require('../lib/database');

class CommentRepository {
  async create(commentData) {
    return await prisma.comment.create({
      data: commentData,
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

  async findByPostId(postId) {
    return await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
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

  async findById(id) {
    return await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        post: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
  }
  async updateById(id, updateData) {
    return await prisma.comment.update({
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
    return await prisma.comment.delete({
      where: { id }
    });
  }

  async isOwner(commentId, userId) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true }
    });
    return comment?.authorId === userId;
  }
}

module.exports = new CommentRepository();