import EVENTS from '@/config/events';
import { useSockets } from '@/context/socket.context';
import { createTicket, getCustomerTickets, getTicketByUuid, getTickets } from '@/services/tickets.service';
import { CreateTicketDto, Ticket } from '@/types/tickets';
import { User } from '@/types/user';
import React, { useEffect, useState } from 'react'
import styles from '../styles/Tickets.module.css'
import { getMessagesByTicket } from '@/services/messages.service';
import { Message } from '@/types/message';
import axios from 'axios';

const TicketsContainer = () => {
    const { socket, roomID, setRoomId, setMessages, tickets, currentTicket, setCurrentTicket } = useSockets();

    const [ticketsLocal, setTicketsLocal] = useState<Ticket[]>([]);
    const [role, setRole] = useState<string>('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState<string>('');
    const [prevPage, setPrevPage] = useState<string>('');
    const [ticketTypeFilter, setTicketTypeFilter] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const ticketTitleRef = React.useRef<HTMLInputElement>(null);
    const ticketDescriptionRef = React.useRef<HTMLTextAreaElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    //create room is our create ticket function
    const handleCreateTicket = async () => {
        const title = ticketTitleRef.current?.value!;
        const description = ticketDescriptionRef.current?.value!;

        if (!String(title).trim() || !String(description).trim()) {
            return;
        }

        const user = localStorage.getItem('user');
        if (!user) {
            return;
        }
        const parsedUser: User = JSON.parse(user);

        const value: CreateTicketDto = {
            title,
            description,
            customer_uuid: parsedUser.uuid,
        }

        setIsLoading(true);

        const ticketResponse = await createTicket(value)
        const stringifiedMessages = JSON.stringify(ticketResponse.data);
        const ticket: Ticket = JSON.parse(stringifiedMessages);

        console.log(ticket);

        socket.emit(EVENTS.CLIENT.NEW_TICKET, ticket);

        setIsLoading(false);

        ticketTitleRef.current!.value = '';
        ticketDescriptionRef.current!.value = '';

        // get the ticket details from the form
        // create a new ticket using the endpoint
        // update the rooms(tickets) state with the new ticket
        // emit the onNewTicket event to the server
    }

    const handleClickedTicket = async (uuid: string) => {
        // set the roomID state to the uuid of the ticket
        // emit the onJoin event to the server
        // redirect the user to the messages page
        console.log('Ticket clicked: ', uuid);
        setRoomId(uuid);
        const response = await getMessagesByTicket(uuid);
        const stringifiedMessages = JSON.stringify(response.data);
        const responseMessages: Message[] = JSON.parse(stringifiedMessages);
        console.log(responseMessages);
        setMessages(responseMessages);

        const ticketResponse = await getTicketByUuid(uuid);
        const stringifiedTicket = JSON.stringify(ticketResponse.data);
        const ticket: Ticket = JSON.parse(stringifiedTicket);
        console.log(ticket);
        setCurrentTicket(ticket);

        socket.emit(EVENTS.CLIENT.JOIN_CHAT, { ticket_uuid: uuid });

    }

    const handleSearchTicket = async () => {
        const search = searchInputRef.current?.value!;
        if (!String(search).trim()) {
            return;
        }

        const response = await getTickets({ search });
        const stringigfiedResponse = JSON.stringify(response);
        const parsedResponse = JSON.parse(stringigfiedResponse);

        const stringifiedTickets = JSON.stringify(response.data);
        const tickets: Ticket[] = JSON.parse(stringifiedTickets);
        setTicketsLocal(tickets);

        setPage(parsedResponse.current_page);
        setTotalPages(parsedResponse.last_page);
        setNextPage(parsedResponse.next_page_url);
        setPrevPage(parsedResponse.prev_page_url);

        searchInputRef.current!.value = '';
    }

    const handleLogOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('user_uuid');
        window.location.reload();   
    }

    const handleMouseOver = (uuid: string) => () => {
        const ticketElement = document.getElementById(uuid);
        console.log('Ticket hovered: ', ticketElement);
        if (ticketElement) {
            ticketElement.classList.remove(styles['ticket']);
            ticketElement.classList.add(styles['ticket-hovered']);
        }
    }

    const handleMouseOut = (uuid: string) => () => {
        const ticketElement = document.getElementById(uuid);
        if (ticketElement) {
            ticketElement.classList.remove(styles['ticket-hovered']);
            ticketElement.classList.add(styles['ticket']);
        }
    }

    const handlePrevPage = async () => {
        if (page > 1 && prevPage) {
            try {
                const response = await axios.get(prevPage);
                const stringifiedResponse = JSON.stringify(response.data);
                const parsedResponse = JSON.parse(stringifiedResponse);

                setPage(parsedResponse.current_page);
                setTotalPages(parsedResponse.last_page);
                setNextPage(parsedResponse.next_page_url);
                setPrevPage(parsedResponse.prev_page_url);

                const stringifiedTickets = JSON.stringify(response.data.data);
                const tickets: Ticket[] = JSON.parse(stringifiedTickets);
                console.log('Tickets', tickets);
                setTicketsLocal(tickets);
            } catch (error) {
                console.error('Error fetching previous page:', error);
            }
        }
    };

    const handleNextPage = async () => {
        if (page < totalPages && nextPage) {
            try {
                const response = await axios.get(nextPage);
                console.log('Response', response)
                const stringifiedResponse = JSON.stringify(response.data);
                const parsedResponse = JSON.parse(stringifiedResponse);

                setPage(parsedResponse.current_page);
                setTotalPages(parsedResponse.last_page);
                setNextPage(parsedResponse.next_page_url);
                setPrevPage(parsedResponse.prev_page_url);

                const stringifiedTickets = JSON.stringify(response.data.data);
                const tickets: Ticket[] = JSON.parse(stringifiedTickets);
                console.log('Tickets', tickets);
                setTicketsLocal(tickets);
            } catch (error) {
                console.error('Error fetching next page:', error);
            }
        }
    };

    const handleFilterChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setTicketTypeFilter(value);

        const response = await getTickets(value === 'All' ? {} : { ticket_type: value });
        const stringigfiedResponse = JSON.stringify(response);
        const parsedResponse = JSON.parse(stringigfiedResponse);

        const stringifiedTickets = JSON.stringify(response.data);
        const tickets: Ticket[] = JSON.parse(stringifiedTickets);
        setTicketsLocal(tickets);

        setPage(parsedResponse.current_page);
        setTotalPages(parsedResponse.last_page);
        setNextPage(parsedResponse.next_page_url);
        setPrevPage(parsedResponse.prev_page_url);
    }

    useEffect(() => {
        (async () => {
            try {

                const user = localStorage.getItem('user');
                const user_uuid = localStorage.getItem('user_uuid');

                const role = localStorage.getItem('role');
                setRole(role!);

                let response;
                if (role === 'customer') {
                    response = await getCustomerTickets(user_uuid!);
                } else {
                    response = await getTickets();
                }


                const stringifiedResponse = JSON.stringify(response);
                const parsedResponse = JSON.parse(stringifiedResponse);

                setPage(parsedResponse.current_page);
                setTotalPages(parsedResponse.last_page);
                setNextPage(parsedResponse.next_page_url);
                setPrevPage(parsedResponse.prev_page_url);

                const stringifiedTickets = JSON.stringify(response.data);
                const tickets: Ticket[] = JSON.parse(stringifiedTickets);
                console.log('Tickets', tickets);
                setTicketsLocal(tickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        })();
    }, [isLoading])

    return (
        <nav className={styles.wrapper}>
            <button className='cta' onClick={handleLogOut}>{`Log Out`}</button>
            {role === 'customer' && <div className={styles.createTicketWrapper}>
                <input type="text" placeholder="Title" ref={ticketTitleRef} />
                <textarea name="" id="" cols={30} rows={10} placeholder='Describe your issue...' ref={ticketDescriptionRef}></textarea>
                <button className="cta" onClick={handleCreateTicket}>Create ticket</button>
            </div>}

            {role !== 'customer' && <div className={styles.createTicketWrapper}>
                <input type="text" placeholder="Search.." ref={searchInputRef} />
                <button className="cta" onClick={handleSearchTicket}>Search tickets</button>

                <div className={styles.filterDropdown}>
                    <label htmlFor="accountType">Ticket Type:</label>
                    <select id="accountType" onChange={handleFilterChange} value={ticketTypeFilter}>
                        <option value="All">All</option>
                        <option value="LOAN_APPLICATION_STATUS">Loan Application Status</option>
                        <option value="REPAYMENT_ISSUES">Repayment Issues</option>
                        <option value="LOAN_APPROVAL_PROCESS">Loan Approval Process</option>
                        <option value="ACCOUNT_MANAGEMENT">Account Management</option>
                        <option value="TECHNICAL_ISSUES">Technical Issues</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
            </div>}


            <div className={styles.ticketListWrapper}>
                <div className={styles.ticketList}>
                    {ticketsLocal.map((ticket) => (
                        <div
                            key={ticket.uuid}
                            className={styles.ticket}
                            onClick={() => handleClickedTicket(ticket.uuid)}
                            onMouseOver={() => handleMouseOver(ticket.uuid)}
                            onMouseOut={() => handleMouseOut(ticket.uuid)}
                            id={ticket.uuid}
                        >
                            <h3 className={styles.ticket_title}>{ticket.title}</h3>
                            <p className={styles.ticket_description}>{ticket.description}</p>
                            <p className={styles.ticket_status}>Status: {ticket.status}</p>
                            {role === 'agent' && <p className={styles.ticket_status}>Type: {ticket.ticket_type}</p>}
                            <p className={styles.ticket_time}>Created at: {new Date(ticket.created_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination controls */}
            <div className={styles.pagination}>
                <button className="cta" onClick={handlePrevPage} disabled={page === 1}>Prev</button>
                <p>{`Page ${page} of ${totalPages}`}</p>
                <button className="cta" onClick={handleNextPage} disabled={page === totalPages}>Next</button>
            </div>


        </nav>
    )
}

export default TicketsContainer;