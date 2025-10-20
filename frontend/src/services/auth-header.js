export default () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.accessToken) {
        // Используй Authorization или x-access-token в зависимости от backend
        return { 'x-access-token': `${user.accessToken}` };
    } else {
        return {};
    }
};