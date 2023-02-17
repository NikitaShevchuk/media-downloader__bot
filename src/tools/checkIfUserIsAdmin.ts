export const checkIfUserIsAdmin = (chatId: number) => {
    const adminsList = process.env.ADMINS_LIST;
    return adminsList && adminsList.split(",").find((id) => id === String(chatId));
};
