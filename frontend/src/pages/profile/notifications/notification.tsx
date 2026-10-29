import styles from "../profilePage.module.css";

interface NotificationsProps {
  notifications: string[];
}

export default function Notifications({ notifications }: NotificationsProps) {
  return (
    <div className={styles.notificationsContainerStack}>
      <h3 className={styles.subTitleHeading}>Recent Alerts</h3>
      <div className={styles.notificationsListRows}>
        {notifications.map((notif, index) => (
          <div key={index} className={styles.notificationAlertBar}>
            <span className={styles.notificationDotMarker}></span>
            <p>{notif}</p>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className={styles.emptyStateFallback}>
            No recent alerts tracked inside system thresholds.
          </p>
        )}
      </div>
    </div>
  );
}
