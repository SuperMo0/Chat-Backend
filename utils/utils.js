export function getReceivers(userId, chat) {
    return chat.users.filter((u) => u.id != userId);
}