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

  const generateAvailableHours = (appointmentType) => {
    const baseHours = ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    if (appointmentType === 'Marcado') {
      return baseHours;
    }
    return ['9:30', '10:30', '11:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30'];
  };
  
  
  export const getDisabledHours = (schedule, appointmentType) => {
    const availableHours = generateAvailableHours(appointmentType);
    const disabledHours = availableHours.map((hour) => {
      const isScheduled = schedule.some((appointment) => appointment.time === hour && 
      (appointment.status !== 'Cancelado'));
      return { time: hour, disabled: isScheduled };
    });
    return disabledHours;
  };