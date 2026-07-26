import { addDays, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { listCoachAvailableSlots } from '../models/coach';
import {
  setCoachAvailableSortedSlots,
  setLoadingMore,
} from '../store/slices/coaching';
import useShallowEqualSelector from './shallowEqualSelector';

export default function useCoachAvailability(
  limit,
  coachId,
  { duration, sessionTypeId } = {}
) {
  const [availableSlots, setAvailableSlots] = useState(null);
  const { sortedTimeSlots, selectedTime, appointment } =
    useShallowEqualSelector(({ coaching }) => coaching);
  const dispatch = useDispatch();
  const hasPreviousSlots = !!sortedTimeSlots;

  useEffect(() => {
    async function getList() {
      const to = format(addDays(new Date(), limit), 'yyyy-MM-dd');
      let from = null;
      if (hasPreviousSlots && limit > 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + (limit - 6));
        from = format(startDate, 'yyyy-MM-dd');
      }
      const res = await listCoachAvailableSlots(
        coachId,
        duration,
        sessionTypeId,
        to,
        from
      );
      if (!res.error) {
        setAvailableSlots(res);
        dispatch(setLoadingMore(false));
      }
    }
    if (duration && sessionTypeId) {
      getList();
    }
  }, [
    coachId,
    dispatch,
    duration,
    limit,
    sessionTypeId,
    hasPreviousSlots,
    selectedTime,
    appointment,
  ]);

  useEffect(() => {
    let timeSlotList = {};
    if (availableSlots && availableSlots.length > 0) {
      const sortedAvailableSlots = availableSlots.sort((a, b) => {
        return new Date(a.start) - new Date(b.start);
      });
      sortedAvailableSlots.forEach((i) => {
        const objKey = format(new Date(i.start), 'MM/dd/yyyy');
        const timeObjKey = format(new Date(i.start), 'h:mm a');
        if (!Object.keys(timeSlotList).includes(objKey)) {
          timeSlotList = { ...timeSlotList, [objKey]: { [timeObjKey]: i } };
        } else {
          timeSlotList = {
            ...timeSlotList,
            [objKey]: { ...timeSlotList[objKey], [timeObjKey]: i },
          };
        }
      });
    }
    if (limit > 7) {
      timeSlotList = { ...sortedTimeSlots, ...timeSlotList };
    }
    dispatch(setCoachAvailableSortedSlots(timeSlotList));
  }, [availableSlots, dispatch]);
}
