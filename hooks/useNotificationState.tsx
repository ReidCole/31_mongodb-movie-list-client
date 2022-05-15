import { useState } from "react";

export type NotificationState = {
  count: number;
  text: string;
  bgColor: string;
};

const useNotificationState: () => [
  NotificationState,
  (text: string, styles?: string) => void
] = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationText, setNotificationText] = useState("");
  const [notificationStyles, setNotificationStyles] = useState("");

  function showNotification(text: string, bgColor?: string) {
    setNotificationCount((prev) => prev + 1);
    setNotificationText(text);
    if (bgColor) setNotificationStyles(bgColor);
  }

  const state: NotificationState = {
    count: notificationCount,
    text: notificationText,
    bgColor: notificationStyles,
  };

  return [state, showNotification];
};

export default useNotificationState;
