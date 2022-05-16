import { useEffect, useState } from "react";
import { NotificationState } from "../../hooks/useNotificationState";
import styles from "./Notification.module.css";

type Props = {
  state: NotificationState;
};

const Notification: React.FC<Props> = ({ state }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.count === 0) return;

    setIsOpen(true);
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [state.count]);

  return (
    <div className={`notification ${styles.notification} ${isOpen ? styles.open : styles.closed}`}>
      <style jsx>
        {`
          .notification {
            background-color: ${state.bgColor};
            color: white;
          }
        `}
      </style>
      <p>{state.text}</p>
    </div>
  );
};

export default Notification;
