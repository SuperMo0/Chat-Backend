import prisma from '../lib/prisma.js'

export async function getUserFriends(userId) {
    try {
        let result = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                friendsTo: { select: { id: true, avatar: true, name: true } },
            }
        })
        return result.friendsTo

    } catch (error) {
        throw "error while getting user Friends"
    }
}

export async function getUserChats(userId) {
    try {
        let result = await prisma.user.findUnique({
            select: {
                chats: {
                    select: {
                        id: true,
                        lastMessage: true,
                        name: true,
                        users: {
                            select: {
                                id: true,
                                avatar: true,
                                name: true
                            }
                        }
                    }
                },
            },
            where: { id: userId },
        })
        return result.chats;
    } catch (error) {
        throw "error while gettin user chats"
    }
}

export async function getChatMessages(chatId) {
    try {
        let result = await prisma.message.findMany({
            where: { chatId: chatId }

        })
        return result;

    } catch (error) {
        throw "error while getting chat messages"
    }

}
export async function getUserFriendsRequestsTo(userId) {
    try {
        let result = await prisma.request.findMany({
            where: { receiverId: userId }
        })
        console.log(result);

        return result;
    } catch (error) {
        throw "error while getting friends request sent to the user "
    }
}

export async function getUserFriendsRequestsBy(userId) {
    try {
        let result = await prisma.request.findMany({
            where: { senderId: userId }
        })
        return result;
    } catch (error) {
        throw "error while getting friends request sent by the user "
    }
}

export async function markMessageAsRead(messageId) {
    try {
        let result = await prisma.message.update({
            data: {
                isRead: true
            },
            where: { id: messageId }
        })
        return result;
    } catch (error) {
        throw "error marking message as read"
    }
}

export async function createFriendRequest(senderId, receiverId) {
    try {
        let result = await prisma.request.create({
            data: {
                senderId: senderId,
                receiverId: receiverId,
            },
        })
        return result;
    } catch (error) {
        throw "error sending friend request"
    }
}

export async function acceptFriendRequest(requestId) {

    try {
        let request = prisma.message.findUnique({
            where: { id: requestId }
        })

        if (!request) throw "request was not found"

        const { senderId, receiverId } = result;

        const [_, sender, receiver] = prisma.$transaction([
            prisma.request.delete({
                where: { id: requestId }
            }),
            prisma.user.update({
                data: { friendsTo: { connect: { id: receiverId } } },
                where: { id: senderId },
                select: {
                    id: true,
                    avatar: true,
                    name: true,
                }
            }),
            prisma.user.update({
                data: { friendsTo: { connect: { id: senderId } } },
                where: { id: receiverId },
                select: {
                    id: true,
                    avatar: true,
                    name: true,
                }
            })
        ])

        return [sender, receiver]

    } catch (error) {
        throw "error accepting friends request"
    }
}

export async function createNewMessage(chatId, senderId, content) {
    try {
        let result = await prisma.message.create({
            data: {
                senderId: senderId,
                chatId: chatId,
                content: content
            },
        })
        return result;
    } catch (error) {
        throw "error creating a new message"
    }
}

export async function getAllUsers(userId) {

    try {
        let result = await prisma.user.findMany(
            {
                where: {
                    id: { not: userId }
                }
            }
        )
        return result

    } catch (error) {
        throw error
    }



}
