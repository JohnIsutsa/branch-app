import io, { Socket } from 'socket.io-client'
import { SOCKET_URL } from '../config/default'
import { createContext, useContext, useEffect, useState } from 'react'
import { Message } from '@/types/message'
import EVENTS from '@/config/events'
import { Ticket } from '@/types/tickets'

interface Context {
    socket: Socket
    email?: string
    setEmail: Function
    roomID?: string
    setRoomId: Function
    tickets: Ticket[]
    setTickets: Function
    messages: Message[]
    setMessages: Function
    currentTicket?: Ticket
    setCurrentTicket: Function
}

const socket = io(SOCKET_URL)

const SocketContext = createContext<Context>({
    socket,
    setEmail: () => false,
    tickets: [],
    setTickets: () => false,
    messages: [],
    setMessages: () => false,
    setRoomId: () => false,
    setCurrentTicket: () => false,
})

const SocketsProvider = (props: any) => {
    const [email, setEmail] = useState('')
    const [roomID, setRoomId] = useState('')
    const [rooms, setRooms] = useState([])
    const [messages, setMessages] = useState<Message[]>([])
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [currentTicket, setCurrentTicket] = useState<Ticket>()

    useEffect(() => {
        window.onfocus = function () {
            document.title = "Branch App";
        };
    }, []);

    socket.on(EVENTS.SERVER.NEW_TICKET, (data): void => {
        console.log('New ticket created event: ', data)
        setTickets((tickets) => [...tickets, data])
        // setRooms([...rooms, data])
    
    })


    useEffect(() => {
        // socket.on('connect', () => {
        //     console.log('Connected to socket server')
        // })

        // socket.on('disconnect', () => {
        //     console.log('Disconnected from socket server')
        // })

        // socket.on('onNewTicket', (data: any) => {
        //     console.log('New ticket created: ', data)
        //     setRooms([...rooms, data])
        // })

        // socket.on('onJoin', (data: any) => {
        //     console.log('Joined room: ', data)
        // })

        // socket.on('onNewMessage', (data: any) => {
        //     console.log('New message: ', data)
        //     setMessages([...messages, data])
        // })
        socket.on(EVENTS.SERVER.PRIVATE_MESSAGE, (data) => {
            if (!document.hasFocus()) {
                new Notification('New message', {
                    body: data.content
                })
                document.title = 'New message...'
            }
            console.log('New message: ', data)

            setMessages((messages) => [...messages, data])
        })

        
    }, [])

    return (
        <SocketContext.Provider
            value={{ socket, email, setEmail, rooms, roomID, setRooms, messages, setMessages, setRoomId, currentTicket, setCurrentTicket }}
            {...props}
        />
    )
}

export const useSockets = () => useContext(SocketContext)

export default SocketsProvider;