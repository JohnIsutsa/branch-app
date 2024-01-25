import MessagesContainer from "@/containers/Messages";
import TicketsContainer from "@/containers/Tickets";
import { useSockets } from "@/context/socket.context";
import { getUserByEmail } from "@/services/users.service";
import { Inter } from "next/font/google";
import { use, useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import { User } from "@/types/user";
import EVENTS from "@/config/events";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { socket, email, setEmail } = useSockets();
  const emailref = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<string>("");
  const [user, setUser] = useState<User>();

  const handleEmail = async () => {
    const value = emailref.current?.value;
    if (!value) {
      return;
    }

    try {
      const response = await getUserByEmail(value);
      const stringifiedUser = JSON.stringify(response.data);
      const user: User = JSON.parse(stringifiedUser);
      

      // Set the email in the socket context
      setEmail(value);

      // Set the user in local storage
      localStorage.setItem("user", stringifiedUser);
      localStorage.setItem("role", user.role);
      localStorage.setItem("email", user.email);
      localStorage.setItem("user_uuid", user.uuid);

      // Empty the input field
      emailref.current.value = "";
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  useEffect(() => {
    window.onfocus = function () {
      document.title = "Branch App";
    };

    socket.on(EVENTS.SERVER.PRIVATE_MESSAGE, (data) => {
      if (!document.hasFocus()) {
        new Notification("New message", {
          body: data.content,
        });
        document.title = "New message...";
      }
      
    });

    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
  

    if (user) {
      const parsedUser: User = JSON.parse(user);
      setUser(parsedUser);
    }
    if (role) {
      setRole(role);
    }
    if (email) {
      setEmail(email);
    }
  }, []);


  //this is the login page for the user. (CUSTOMER OR AGENT)
  //the user would enter their username and then click start. A request would be sent to the server to check if the username exists. 
  //if it does then the user would be logged in and the username and type would be stored in local storage.
  //depending on the type of user they would be redirected to the correct page.
  return (
    <div className={inter.className}>
      {!email && <div>
        <div className={styles.usernameWrapper}>
          <div className={styles.usernameInner}>
            <input type="email" ref={emailref} placeholder="Enter email..." />
            <button className="cta" onClick={handleEmail}>LOG IN</button>
          </div>
        </div>

      </div>}
      {email && (
        <div className={styles.container}>
          <TicketsContainer />
          <MessagesContainer />
        </div>
      )}
    </div>
  );
}
