import styles from "./videoBackground.module.css";

interface VideoBackgroundProps {
  src: string;
}

export default function VideoBackground({ src }: VideoBackgroundProps) {
  return (
    <>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* a dark layer on top of the video, so the form is easy to read */}
      <div className={styles.overlay}></div>
    </>
  );
}