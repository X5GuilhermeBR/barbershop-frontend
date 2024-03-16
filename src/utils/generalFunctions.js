/* eslint-disable no-plusplus */
export const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

export const getFutureDate = () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 45);
    const year = futureDate.getFullYear();
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
    const day = futureDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateAvailableHours = () => {
    const availableHours = [];
    for (let hour = 9; hour <= 18; hour++) {
      availableHours.push(`${hour}:00`);
    }
    return availableHours;
  };

  export const getDisabledHours = (schedule) => {
    const availableHours = generateAvailableHours();
    const disabledHours = availableHours.map((hour) => {
      const isScheduled = schedule.some((appointment) => appointment.time === hour);
      return { time: hour, disabled: isScheduled };
    });
    return disabledHours;
  };