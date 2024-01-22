import { useSockets } from '@/context/socket.context';
import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/Messages.module.css'
import { Message } from '@/types/message';
import { getMessagesByTicket } from '@/services/messages.service';
import { User } from '@/types/user';
import EVENTS from '@/config/events';
import { Ticket, TicketStatus } from '@/types/tickets';
import { updateTicket } from '@/services/tickets.service';

const MessagesContainer = () => {
    const { socket, messages, roomID, email, setMessages, currentTicket, setCurrentTicket } = useSockets();
    const [role, setRole] = useState<string>('');
    const inputMessageRef = useRef<HTMLTextAreaElement>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = () => {
        // get the message from the input field
        // emit the onNewMessage event to the server
        // update the messages state with the new message
        const message = inputMessageRef.current?.value!;
        if (!message) {
            return;
        }

        const user = localStorage.getItem('user');
        if (!user) {
            return;
        }
        const parsedUser: User = JSON.parse(user);

        const value = {
            content: message,
            ticket_uuid: roomID,
            sender_uuid: parsedUser.uuid,
        }

        console.log('VALUE', value);

        socket.emit(EVENTS.CLIENT.NEW_MESSAGE, value);

        inputMessageRef.current!.value = '';
    }

    const handleStatusChange = async (newStatus: TicketStatus) => {
        // Perform any additional logic here if needed
        console.log('New status:', newStatus);

        // You can send a patch request to the server to update the ticket status
        // Example: updateTicketStatus(currentTicket.uuid, newStatus);
        const response = await updateTicket(currentTicket!.uuid, { status: newStatus })
        console.log('RESPONSE ',response);
        const stringifiedTicket = JSON.stringify(response.data);
        const ticket: Ticket = JSON.parse(stringifiedTicket);
        setCurrentTicket(ticket);
    };

    // useEffect(() => {
    //     const fetchMessages = async () => {
    //         const response = await getMessagesByTicket(roomID!);
    //         const stringifiedMessages = JSON.stringify(response.data);
    //         const responseMessages: Message[] = JSON.parse(stringifiedMessages);
    //         console.log(responseMessages);
    //         setMessages(responseMessages);
    //     }
    //     fetchMessages();
    // }, [roomID])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            return;
        }
        const parsedUser: User = JSON.parse(user);
        setRole(parsedUser.role);
    }, []);

    if (!roomID) {
        return <div className={styles.wrapper}>Select a ticket to start chatting {email}</div>
    }


    const TicketStatusDropdown = ({ currentStatus, onChange }: { currentStatus: TicketStatus, onChange: Function }) => {
        const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(currentStatus);

        const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newStatus = e.target.value;
            setSelectedStatus(newStatus as TicketStatus);
            onChange(newStatus);
        };

        return (
            <select value={selectedStatus} onChange={handleStatusChange}>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
            </select>
        );
    };

    return (
        <div className={styles.wrapper}>
            {role === 'agent' && currentTicket && (
                <div className={styles.userDetails}>
                    <div className={styles.ticketInfo}>
                        <h2>{currentTicket.title}</h2>
                        <p>Status: {currentTicket.status}</p>
                    </div>
                    <div className={styles.customerInfo}>
                        <h3>Customer Details</h3>
                        <p>Name: {currentTicket.customer.name}</p>
                        <p>Email: {currentTicket.customer.email}</p>
                    </div>
                    <div className={styles.statusDropdown}>
                        <label htmlFor="statusDropdown">Change Status:</label>
                        <TicketStatusDropdown
                            currentStatus={currentTicket.status}
                            onChange={handleStatusChange}
                        />
                    </div>
                </div>

            )}

            {role === 'customer' && currentTicket && (
                <div className={styles.userDetails}>
                    <div className={styles.ticketInfo}>
                        <h2>{currentTicket.title}</h2>
                        <p>Status: {currentTicket.status}</p>
                    </div>
                </div>
            )}
            <div className={styles.messageList}>
                {messages.map((message) => {
                    return (
                        <div key={message.uuid} className={styles.message}>
                            <div key={message.uuid} className={styles.messageInner}>
                                <span className={styles.messageSender}>
                                    {message.sender} - {new Date(message.timestamp).toLocaleDateString(undefined, { timeZone: 'Africa/Nairobi' })} {new Date(message.timestamp).toLocaleTimeString(undefined, { timeZone: 'Africa/Nairobi' })}
                                </span>
                                <span className={styles.messageBody}>{message.content}</span>
                            </div>
                        </div>
                    )
                })}
                <div ref={messageEndRef} />
            </div>
            <div className={styles.messageBox}>
                <textarea
                    name=""
                    id=""
                    rows={1}
                    placeholder='Type your message here...'
                    ref={inputMessageRef}
                />
                <button onClick={handleSendMessage}>SEND</button>
            </div>
        </div>
    )
}

export default MessagesContainer;