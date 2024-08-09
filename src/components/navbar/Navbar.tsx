import styles from "./Navbar.module.scss";

interface NavbarProps {
  currentDate: Date;
  days: { date: string; formattedDate: string }[];
  page: number;
  numOfPages: number;
  onPrevDay: () => void;
  onNextDay: () => void;
  onDayClick: (date: string) => void;
}

const Navbar = (props: NavbarProps) => {
  const renderDays = () => {
    const startIndex = (props.page - 1) * 2;
    const endIndex = startIndex + 2;
    const daySelection = props.days.slice(startIndex, endIndex);

    return daySelection.map((day) => (
      <div
        key={day.date}
        class={`${styles.day} ${
          day.date === props.currentDate.toISOString().split("T")[0]
            ? styles.active
            : ""
        }`}
        data-date={day.date}
        onClick={() => props.onDayClick(day.date)}
      >
        {day.formattedDate}
      </div>
    ));
  };

  return (
    <div class={styles.daySelectRow} data-id="timed-order-day-wrapper">
      <div
        class={`${styles.btn} `}
        data-target="prev"
        onClick={props.onPrevDay}
      >
        <img src="https://objedname.eu/ui/system/icons/white/arrow_left.svg" />
      </div>
      <div class={styles.daysRow} data-id="day-select-row">
        {renderDays()}
      </div>
      <div class={`${styles.btn}`} data-target="next" onClick={props.onNextDay}>
        <img src="https://objedname.eu/ui/system/icons/white/arrow_right.svg" />
      </div>
    </div>
  );
};

export default Navbar;
