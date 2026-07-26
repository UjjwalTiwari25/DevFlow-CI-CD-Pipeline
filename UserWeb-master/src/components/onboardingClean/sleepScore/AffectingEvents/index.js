import React, { Fragment, useState, useEffect } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import Analytics from '../../../../services/Analytics';
import OnboardingMultipleOptionCheck from '../../OnboardingMultipleOptionCheck';
import styles from './styles';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';

const AFFECTING_EVENTS_OPTIONS = {
  lossOfAJob: {
    title: `onboarding_affecting_events_list_item_loss_of_job`,
    itemKey: `lossOfAJob`,
    sleepScore: -1,
    active: false,
  },
  workStress: {
    title: `onboarding_affecting_events_list_item_work_stress`,
    itemKey: `workStress`,
    sleepScore: -1,
    active: false,
  },
  marriageRelationships: {
    title: `onboarding_affecting_events_list_item_relationship`,
    itemKey: `marriageRelationships`,
    sleepScore: -1,
    active: false,
  },
  healthPain: {
    title: `onboarding_affecting_events_list_item_health`,
    itemKey: `healthPain`,
    sleepScore: -1,
    active: false,
  },
  moveOrRelocation: {
    title: `onboarding_affecting_events_list_item_move`,
    itemKey: `moveOrRelocation`,
    sleepScore: -1,
    active: false,
  },
  none: {
    title: `onboarding_affecting_events_list_item_none`,
    itemKey: `none`,
    sleepScore: 0,
    active: false,
  },
};

export default function AffectingEvents({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('affectingEvents', true, onBack, onNext);
  const { t } = useTranslations();
  const [eventList, setEventList] = useState(
    Object.values(AFFECTING_EVENTS_OPTIONS)
  );
  const [activeEvents, setActiveEvents] = useState([]);

  useEffect(() => {
    const newEventlist = eventList.filter((eventItem) => {
      return eventItem.active === true;
    });
    setActiveEvents(newEventlist);
  }, [eventList]);

  const onSelectItem = ({ itemKey }) => {
    const newEventlist = eventList.map((eventItem) => {
      let newEventItem = eventItem;
      if (eventItem.itemKey === itemKey) {
        newEventItem = { ...eventItem, active: !eventItem.active };
      }
      if (eventItem.itemKey === 'none') {
        newEventItem = { ...eventItem, active: false };
      }
      if (itemKey === 'none') {
        newEventItem = { ...eventItem, active: false };
        if (eventItem.itemKey === 'none') {
          newEventItem = { ...eventItem, active: !eventItem.active };
        }
      }
      return newEventItem;
    });
    setEventList(newEventlist);
  };

  function onSubmit() {
    const selectedEventsObj = {};
    let affectingEventObj = {};
    if (activeEvents?.length) {
      activeEvents.forEach((event, index) => {
        if (event.itemKey) {
          selectedEventsObj[event.itemKey] = index + 1;
          affectingEventObj = {
            ...affectingEventObj,
            [event.itemKey]: {
              itemKey: event.itemKey,
              score: event.itemKey === 'none' ? 0 : -1,
            },
          };
        }
      });
    }

    const activeEventList = Object.keys(selectedEventsObj);
    Analytics.track(`Sleep Affecting Event`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'affecting Event List': activeEventList,
    });
    Analytics.setPeopleProperties({
      'Affecting Event List': activeEventList,
    });
    onNext({
      onboardingSleepScore: {
        ...(profile.onboardingSleepScore || {}),
        affectingEvents: affectingEventObj,
      },
    });
  }

  return (
    <Fragment>
      <Header
        title={t('onboarding_affecting_events_title')}
        subtitle={t('onboarding_affecting_events_choose_all')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {eventList.map((item) => (
          <OnboardingMultipleOptionCheck
            dataTestId="onboardingAffectingEvents"
            experiments={experiments}
            item={item}
            key={item.itemKey}
            onClick={onSelectItem}
            title={t(item.title)}
            isActive={item.active}
          />
        ))}
        <OnboardingBigContinueButton
          title={t('button_continue')}
          experiments={experiments}
          onClick={() => {
            onSubmit();
          }}
        />
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
