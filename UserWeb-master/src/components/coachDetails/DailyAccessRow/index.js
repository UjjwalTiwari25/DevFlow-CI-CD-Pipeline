import React from 'react';
import {
  getAvailableCoachingSpots,
  getCoachFirstName,
} from '../../../models/coach';
import CustomHorizontalScrollView from '../../app/CustomHorizontalScroll';
import DailyAccessCard from '../DailyAccessCard';
import styles from './styles';

function DailyAccessRow({ coach }) {
  const accessProps = [
    {
      title: `Daily access to 1-on-1 personal coaching with ${getCoachFirstName(
        coach
      )}`,
      description:
        'Receive personalized coaching, gain new perspectives, and reach your wellness goals with daily text, audio, or video messages',
    },
    {
      title: 'Custom recommendations from your coach',
      description: `${getCoachFirstName(
        coach
      )} will send recommendations based on your needs & goals throughout your coaching journey`,
    },
    {
      title: `Track your Mindfulness, Sleep, and Mood with ${getCoachFirstName(
        coach
      )}`,
      description:
        'Set goals together, discuss your health trends, and improve your overall well-being. You will gain new insights with a beautiful weekly graph.',
    },
    {
      title: 'Private & Shared Journal',
      description: `Keep track of all your insights, learnings, and thoughts throughout coaching. Share notes with ${getCoachFirstName(
        coach
      )} anytime to enhance your
        coaching experience`,
    },
  ];
  if (getAvailableCoachingSpots(coach) > 0) {
    accessProps[0].title = `Book 1-on-1 personal coaching with ${getCoachFirstName(
      coach
    )} while
    space is available!`;
    accessProps[0].description = `Receive personalized coaching, gain new perspectives, and reach your goals with video calls and private messaging.
    \n*Coaching sessions must be accessed from a mobile device.`;
  }
  return (
    <>
      <CustomHorizontalScrollView
        newCoachProps
        data={accessProps}
        renderItem={(row, index) => (
          <DailyAccessCard row={row} index={index} coach={coach} />
        )}
        rightChevronStyles={{
          fontSize: 24,
          color: '#4E545F',
          boxShadow: '0px 14.8459px 51.9608px rgba(43, 42, 107, 0.15)',
          background:
            'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
        }}
        leftChevronStyles={{
          fontSize: 24,
          color: '#4E545F',
          boxShadow: '0px 14.8459px 51.9608px rgba(43, 42, 107, 0.15)',
          background:
            'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
        }}
      />
      <style jsx>{styles}</style>
    </>
  );
}

export default DailyAccessRow;
