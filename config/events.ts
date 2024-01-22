const EVENTS = {
    SERVER: {
        NEW_TICKET: 'newTicket',
        PRIVATE_MESSAGE: 'privateMessage',
    },
    CLIENT: {
        NEW_TICKET: 'onNewTicket',
        JOIN_CHAT: 'onJoinChat',
        NEW_MESSAGE: 'onNewMessage',
    }
}

export default EVENTS;