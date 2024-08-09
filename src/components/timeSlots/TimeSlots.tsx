import styles from "./TimeSlots.module.scss";

interface TimeSlot {
  time: string;
  availability: string;
}

interface TimeSlotsProps {
  times: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  onUpdateAvailability: (time: string) => void;
  onSubmit: () => void;
}

const TimeSlots = (props: TimeSlotsProps) => {
  const handleClick = (time: string) => {
    props.onSelectTime(time);
    props.onUpdateAvailability(time);
    props.onSubmit();
  };

  return (
    <div class={styles.timeSelectContainer} data-id="time-select-container">
      {props.times.map(({ time, availability }) => {
        const [used, total] = availability.slice(1, -1).split("/").map(Number);

        if (total === 0) return null;
        return (
          <div
            key={time}
            class={`${styles.timeSelect} ${
              props.selectedTime === time ? styles.active : ""
            }`}
            data-time={time}
            onClick={() => handleClick(time)}
          >
            {time}
            <span class={styles.availability}>
              {props.selectedTime === time
                ? `(${used + 1}/${total})`
                : availability}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlots;
