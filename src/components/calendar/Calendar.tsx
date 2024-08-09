import { createSignal, createEffect } from "solid-js";
import Navbar from "../navbar/Navbar";
import TimeSlots from "../timeSlots/TimeSlots";
import styles from "./Calendar.module.scss";
import { helpers } from "../../utils";

const Calendar = () => {
  const [currentDate, setCurrentDate] = createSignal(new Date());
  const [selectedTime, setSelectedTime] = createSignal<string | null>(null);
  const [days, setDays] = createSignal<
    { date: string; formattedDate: string }[]
  >([]);
  const [times, setTimes] = createSignal<
    { time: string; availability: string }[]
  >([]);
  const [originalTimes, setOriginalTimes] = createSignal<
    { time: string; availability: string }[]
  >([]);

  const [page, setPage] = createSignal(1);
  const [numOfPages, setNumOfPages] = createSignal(1);

  createEffect(() => {
    const generatedDays = helpers.generateDaysAheadFromNow(30); // Example value for daysAhead
    setDays(generatedDays);
    setNumOfPages(helpers.getNumOfPages(generatedDays, 2));
  });

  createEffect(() => {
    const selectedDayInput = document.querySelector<HTMLInputElement>(
      'input[name="timed-order-selected-day"]',
    );
    const selectedTimeInput = document.querySelector<HTMLInputElement>(
      'input[name="timed-order-selected-time"]',
    );

    if (selectedDayInput) {
      selectedDayInput.value = currentDate().toISOString().split("T")[0];
    }

    if (selectedTimeInput) {
      selectedTimeInput.value = selectedTime() || "";
    }
  });

  createEffect(() => {
    const randomTimes = helpers.generateRandomTimes();
    setTimes(randomTimes);
    setOriginalTimes(randomTimes);
  });

  const handlePrevDay = () => {
    if (page() - 1 < 1) return;
    setPage(page() - 1);
  };

  const handleNextDay = () => {
    if (page() + 1 > numOfPages()) return;
    setPage(page() + 1);
  };

  const handleDayClick = (date: string) => {
    setCurrentDate(new Date(date));
    setSelectedTime(null);
    const randomTimes = helpers.generateRandomTimes();
    setTimes(randomTimes);
    setOriginalTimes(randomTimes);
  };

  const handleUpdateAvailability = (time: string) => {
    setTimes((prevTimes) =>
      prevTimes.map((slot) => {
        if (slot.time === selectedTime()) {
          const originalSlot = originalTimes().find(
            (origSlot) => origSlot.time === slot.time,
          );
          if (originalSlot) {
            return { ...slot, availability: originalSlot.availability };
          }
        }
        if (slot.time === time) {
          const [used, total] = slot.availability
            .slice(1, -1)
            .split("/")
            .map(Number);
          if (used < total) {
            return { ...slot, availability: `(${used + 1}/${total})` };
          }
        }
        return slot;
      }),
    );
    setSelectedTime(time);
  };

  const handleSubmit = () => {
    if (selectedTime()) {
      const updatedTime = times().map((slot) => {
        if (slot.time === selectedTime()) {
          const [used, total] = slot.availability
            .slice(1, -1)
            .split("/")
            .map(Number);
          if (used < total) {
            return { ...slot, availability: `(${used + 1}/${total})` };
          }
        }
        return slot;
      });

      const data = {
        status: "OK",
        message: "OK",
        data: updatedTime.map((slot) => {
          const [used, total] = slot.availability
            .slice(1, -1)
            .split("/")
            .map(Number);
          return {
            time: slot.time,
            capacity: total,
            originalCapacity: used,
          };
        }),
      };
      console.log(data);
    } else {
      console.log("No time selected");
    }
  };

  return (
    <div
      id="timedOrdersView"
      class={`${styles.timedOrdersModule} ${styles.timedOrderWrapper} js-timed-orders-panel`}
      data-panel-groups="groupA"
      data-id="timed-order-wrapper"
    >
      <input type="hidden" name="timed-order-selected-day" />
      <input type="hidden" name="timed-order-selected-time" />
      <Navbar
        currentDate={currentDate()}
        days={days()}
        page={page()}
        numOfPages={numOfPages()}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onDayClick={handleDayClick}
      />
      <TimeSlots
        times={times()}
        selectedTime={selectedTime()}
        onSelectTime={setSelectedTime}
        onUpdateAvailability={handleUpdateAvailability}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Calendar;
