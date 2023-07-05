import { notification } from "antd";
import { useAppSelector } from "../../redux/store";
import { useEffect } from "react";

export default function Message() {
  const { message } = useAppSelector((state) => state.message);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (!message || message.title === "") return;

    const { title, description, type } = message;
    const notificationConfig = {
      message: title,
      description,
    };

    const notificationMapping = {
      success: api.success,
      error: api.error,
      warning: api.warning,
      info: api.info,
    };

    const showNotification = notificationMapping[type] || api.info;
    showNotification(notificationConfig);
  }, [api, message]);

  return <> {contextHolder}</>;
}
