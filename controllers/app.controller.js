import { getReceivers } from '../utils/utils.js';
import * as model from './../models/app.model.js'
import { io } from '../lib/socket.js';
export async function getUserFriends(req, res) {
    try {
        let friends = await model.getUserFriends(req.userId);
        res.json({ friends });

    } catch (error) {
        console.log(error);
    }
}
export async function getUserChats(req, res) {

    try {
        let chats = await model.getUserChats(req.userId);
        res.json({ chats });
    } catch (error) {
        console.log(error);
    }

}


export async function getChatMessages(req, res) {
    try {
        const { chatId } = req.params;
        let messages = await model.getChatMessages(chatId);
        res.json({ messages });
    } catch (error) {
        console.log(error);
    }
}

export async function getUserFriendsRequestsTo(req, res) {
    try {
        const userId = req.userId
        let requestsTo = await model.getUserFriendsRequestsTo(userId);
        res.json({ requestsTo });
    } catch (error) {
        console.log(error);
    }
}

export async function getUserFriendsRequestsBy(req, res) {
    try {
        const userId = req.userId
        let requestsBy = await model.getUserFriendsRequestsBy(userId);
        console.log(requestsBy);

        res.json({ requestsBy });
    } catch (error) {
        console.log(error);
    }
}

export async function markMessageAsRead(req, res) {
    try {
        const userId = req.userId;
        const { messageId } = req.params;
        let message = await model.markMessageAsRead(messageId);
        res.json({ message });
        // check if the other chat member is online and send him an update for the message
    } catch (error) {
        console.log(error);
    }
}


export async function createFriendReqesut(req, res) {
    try {
        const userId = req.userId;
        const { receiverId } = req.params;
        let request = await model.createFriendRequest(userId, receiverId);
        res.json({ request });
        // check if receiver is online and update his friends requestTo data
    } catch (error) {
        console.log(error);
    }
}

export async function acceptFriendRequest(req, res) {

    try {
        const userId = req.userId; // make sure that the current user is the reciever of the request 
        const { requestId } = req.params;
        const [sender, receiver] = await model.acceptFriendRequest(requestId)
        res.json({ message: 'success' });
        io.to(sender.id).emit("updateFriends", receiver);
        io.to(receiver).emit("updateFriends", sender);
    } catch (error) {
        console.log(error);
    }
}

export async function createNewMessage(req, res) {
    try {
        const userId = req.userId;
        const { chatId } = req.params;
        const { content } = req.body

        const message = await model.createNewMessage(chatId, userId, content);

        const chat = await model.updateChatLastMessage(chatId, message)

        res.status(201).json({ message: 'ok' });

        chat.users.forEach(user => {
            io.to(user.id).emit("chatUpdate", chat);
        });

    } catch (error) {
        console.log(error);
    }
}

export async function getAllUsers(req, res) {
    try {
        const users = await model.getAllUsers(res.userId);
        res.json({ users });
    } catch (error) {
        console.log(error);
    }
}
