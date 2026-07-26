import Axios from 'axios';
import Logger from '../services/Logger';
import Auth from '../services/Auth';
import config from '../config';
import schedulingConstants from '../utils/constants/scheduling';
import FirebaseDatabase from '../services/FirebaseDatabase';
import { notifyAPIError } from '../services/ErrorMonitoring';

const { SESSION_TYPES } = schedulingConstants;

async function listCoachServices(coachId) {
  const authToken = await Auth.getUserAuthToken();
  const data = {
    coachId,
    anySessionTypes: [SESSION_TYPES.PAID_SERVICE_INDIVIDUAL],
  };
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/scheduling/services/list`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data,
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching services list' });
    return { error };
  }
  return { error: 'Services Fetch Failed' };
}

async function fetchService(serviceId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/scheduling/services/${serviceId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching service' });
    return { error };
  }
  return { error: 'service Fetch Failed' };
}

async function createAppointment(data) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/scheduling/appointments`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data,
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error setting appointment' });
    return { error };
  }
  return { error: 'Set Appointment Failed' };
}

async function deleteAppointment(data) {
  const { appointmentId, name, email } = data;

  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'DELETE',
      url: `${config.api.auraServices}/scheduling/appointments/${appointmentId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data: { name, email },
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error delete appointment' });
    return { error };
  }
  return { error: 'Delete Appointment Failed' };
}

async function confirmOnSchedAppointmentAttendee({ source, onSchedId }) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'PUT',
      url: `${config.api.auraServices}/scheduling/appointments/onSched/${onSchedId}/confirmAttendee`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data: { source },
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error confirm onSched appointment' });
    return null;
  }
  return null;
}

async function getAppointmentWithOnSchedId({ onSchedAppointmentId }) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/scheduling/appointments/onSched/${onSchedAppointmentId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching onSched appointment' });
    return null;
  }
  return null;
}

const getPricingDetail = (pricing, key) => {
  let pricingText;
  if (pricing && pricing.length > 0) {
    const sortedByDuration = pricing
      .filter((item) => item.price !== null)
      .sort((a, b) => {
        return a[key] - b[key];
      });
    if (sortedByDuration.length === 1) {
      pricingText =
        key === 'duration'
          ? `${sortedByDuration[0].duration} min`
          : sortedByDuration[0].price;
    }
    if (sortedByDuration.length > 1) {
      pricingText =
        key === 'duration'
          ? `${sortedByDuration[0].duration}-${
              sortedByDuration[sortedByDuration.length - 1].duration
            } min`
          : `${sortedByDuration[0].price}-${
              sortedByDuration[sortedByDuration.length - 1].price
            }`;
    }
  }
  return pricingText;
};

const getLowestPricing = (pricing, key) => {
  let pricingText;
  if (pricing && pricing.length > 0) {
    const sortedByDuration = pricing
      .filter((item) => item.price !== null)
      .sort((a, b) => {
        return a[key] - b[key];
      });
    if (sortedByDuration.length === 1 || sortedByDuration.length > 1) {
      pricingText = sortedByDuration[0].price;
    }
  }
  return pricingText;
};

const fetchServiceReviews = async (serviceId) => {
  const authToken = await Auth.getUserAuthToken();
  const data = { serviceId };
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/scheduling/reviews/list`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data,
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching service reviews' });
    return { error };
  }
  return { error: 'Error fetching service reviews' };
};

async function setUserInWaitList(coachId, userId) {
  if (!coachId || !userId) {
    return null;
  }
  const date = new Date().toISOString();
  try {
    await FirebaseDatabase.setValue(
      `coachingWaitlist/${coachId}/${userId}`,
      date
    );
  } catch (error) {
    return { error: 'error setting wait list' };
  }
  return null;
}

async function getUserFromWaitList(coachId, userId) {
  if (!coachId || !userId) {
    return null;
  }
  try {
    const response = await FirebaseDatabase.getValue(
      `coachingWaitlist/${coachId}/${userId}`
    );
    if (response) {
      return response;
    }
  } catch (error) {
    Logger.error({ error });
    return { error: 'Error fetching user from wait list' };
  }
  return null;
}

async function confirmAppointment(id) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'PUT',
      url: `${config.api.auraServices}/scheduling/appointments/${id}/confirm`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error setting appointment' });
    return { error };
  }
  return { error: 'Set Appointment Failed' };
}

async function getAppointment(id) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/scheduling/appointments/${id}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error setting appointment' });
    return { error };
  }
  return { error: 'Set Appointment Failed' };
}

async function setuserCoachingWaitlist(userId) {
  if (!userId) {
    return null;
  }
  const date = new Date().toISOString();
  try {
    await FirebaseDatabase.setValue(`userCoachingWaitlist/${userId}`, date);
  } catch (error) {
    return { error: 'error setting wait list' };
  }
  return null;
}

async function setUserGroupClassesWaitlist(userId) {
  if (!userId) {
    return null;
  }
  const date = new Date().toISOString();
  try {
    await FirebaseDatabase.setValue(`userGroupClassesWaitlist/${userId}`, date);
  } catch (error) {
    return { error: 'error setting wait list' };
  }
  return null;
}

async function rescheduleAppointment(data) {
  const authToken = await Auth.getUserAuthToken();
  const { appointmentId, start } = data;
  try {
    const options = {
      method: 'PUT',
      url: `${config.api.auraServices}/scheduling/appointments/${appointmentId}/reschedule`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data: { start },
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error rescheduling appointment' });
    return { error };
  }
  return { error: 'Rescheduling Appointment Failed' };
}
async function cancelAppointment({ appointmentId, reason }) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'PUT',
      url: `${config.api.auraServices}/scheduling/appointments/${appointmentId}/cancel`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data: { reason },
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error rescheduling appointment' });
    return { error };
  }
  return { error: 'Rescheduling Appointment Failed' };
}

export {
  listCoachServices,
  fetchService,
  createAppointment,
  getPricingDetail,
  fetchServiceReviews,
  deleteAppointment,
  setUserInWaitList,
  getUserFromWaitList,
  confirmAppointment,
  setuserCoachingWaitlist,
  getLowestPricing,
  setUserGroupClassesWaitlist,
  confirmOnSchedAppointmentAttendee,
  getAppointmentWithOnSchedId,
  getAppointment,
  rescheduleAppointment,
  cancelAppointment,
};
