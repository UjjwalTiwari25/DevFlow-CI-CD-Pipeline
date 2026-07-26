/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import Router from 'next/router';
import { getAvailableCoachingSpots } from '../../models/coach';
import { createAppointment } from '../../models/service';
import LocalStorage from '../../services/LocalStorage';
import Logger from '../../services/Logger';
import { generateQueryPath } from '../../utils';
import routeConstants from '../../utils/constants/routes';

export const setTimeAction = createAction('coaching/setTimeAction');

export const createAppointmentAction = createAsyncThunk(
  'coaching/createAppointmentAction',
  async (
    { time, appointmentInformation },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const { coaching } = getState();
      const {
        sortedTimeSlots,
        coachService,
        selectedDuration,
        selectedDate,
        selectedTime,
        appointmentType,
        appointment,
      } = coaching;
      let timeObjKey = null;
      if (selectedTime) {
        timeObjKey = format(new Date(selectedTime.start), 'h:mm a');
      }
      const key = time || timeObjKey;
      const appointmentData = sortedTimeSlots[selectedDate][key];
      if (
        appointment &&
        appointmentData &&
        new Date(appointment.start) === new Date(appointmentData.start) &&
        appointment.sessionTypeId === appointmentData.sessionTypeId
      ) {
        return null;
      }
      dispatch(setTimeAction(appointmentData));
      let data;
      if (appointmentType === 'free-discovery') {
        data = {
          ...appointmentData,
          sessionTypeId: appointmentInformation.sessionTypeId,
          coachId: appointmentInformation.coachId,
          start: appointmentInformation.start,
          requiresCoachingSubscription:
            appointmentInformation.requiresCoachingSubscription,
          duration: selectedDuration,
          preventAutoConfirm: appointmentInformation.preventAutoConfirm,
          includesCoaching: appointmentInformation.includesCoaching,
        };
      } else {
        const { id: serviceId = null, sessionTypeId = null } = coachService;
        data = {
          ...appointmentData,
          sessionTypeId,
          duration: selectedDuration,
          serviceId,
          preventAutoConfirm: true,
        };
      }
      const res = await createAppointment(data);
      if (res && !res.error) {
        LocalStorage.setItem('APPOINTMENT_COUNT_DOWN_MINUTES', 4);
        LocalStorage.setItem('APPOINTMENT_COUNT_DOWN_SECONDS', 59);
      } else {
        Logger.warn('unable to fetch coach detail');
      }
      return res;
    } catch (error) {
      return rejectWithValue({ error: 'Failed to create appointment' });
    }
  }
);

export const handleBookCoachingCTA = createAsyncThunk(
  'coaching/handleBookCoachingCTA',
  async (coach) => {
    if (!getAvailableCoachingSpots(coach)) return;
    const path = generateQueryPath(
      `${routeConstants.PAGE_COACHES}/${coach.slug}/${routeConstants.PAGE_VIDEO_COACHING}`,
      {}
    );
    Router.push(path).then(() => {
      window.scrollTo(0, 0);
    });
  }
);

export const handleBookCoachingSessionCTA = createAsyncThunk(
  'coaching/handleBookCoachingSessionCTA',
  async ({ session, coach, query }, { rejectWithValue }) => {
    try {
      if (!session || !coach) return;
      const {
        utm_source = null,
        utm_campaign = null,
        utm_medium = null,
        utm_content = null,
        referralCode = null,
        referralType = null,
      } = query;
      const path = generateQueryPath(
        `${routeConstants.PAGE_COACHES}/${coach.slug}/coaching-session`,
        {
          serviceId: session.id,
          utm_source,
          utm_campaign,
          utm_medium,
          utm_content,
          referralCode,
          referralType,
        }
      );
      Router.push(path).then(() => {
        window.scrollTo(0, 0);
      });
    } catch (error) {
      rejectWithValue({ error: 'Failed to handle book coaching session CTA' });
    }
  }
);

const initialState = {
  appointment: null,
  coachService: null,
  sortedTimeSlots: null,
  selectedDuration: 30,
  selectedDate: null,
  selectedPlan: null,
  selectedTime: null,
  isLoading: false,
  allowAppointment: true,
  waitListStatus: false,
  showWaitListModal: false,
  isLoadingMore: false,
  appointmentType: null,
};

export const coachingSlice = createSlice({
  name: 'coaching',
  initialState,
  reducers: {
    setCoachService: (state, action) => {
      state.coachService = action.payload;
    },
    setCoachAvailableSortedSlots: (state, action) => {
      state.sortedTimeSlots = action.payload;
    },
    setSelectedDuration: (state, action) => {
      state.selectedDuration = action.payload;
    },
    setDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    setTimeAction: (state, action) => {
      state.selectedTime = action.payload;
    },
    createdCoachAppointment: (state, action) => {
      state.appointment = action.payload;
      state.isLoading = false;
    },
    setAllowAppointment: (state, action) => {
      state.allowAppointment = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLoadingMore: (state, action) => {
      state.isLoadingMore = action.payload;
    },
    setWaitListStatus: (state, action) => {
      state.waitListStatus = action.payload;
    },
    setShowWaitListModal: (state, action) => {
      state.showWaitListModal = action.payload;
    },
    setAppointmentType: (state, action) => {
      state.appointmentType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAppointmentAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAppointmentAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointment = action.payload;
      });
  },
});

export const {
  setCoachService,
  setCoachAvailableSortedSlots,
  setSelectedDuration,
  setDate,
  setSelectedPlan,
  createdCoachAppointment,
  setAllowAppointment,
  setLoading,
  setLoadingMore,
  setWaitListStatus,
  setShowWaitListModal,
  setAppointmentType,
} = coachingSlice.actions;

export default coachingSlice.reducer;
