import React, { Fragment, useState, useEffect } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import Analytics from '../../../../services/Analytics';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';

import styles from './styles';
import OnboardingMultipleOptionCheck from '../../OnboardingMultipleOptionCheck';

const OPTIONS = {
  anxietyWorrying: {
    title: `onboarding_bothering_event_list_item_anxiety`,
    itemKey: `anxietyWorrying`,
    sleepScore: -1,
    active: false,
  },
  lowEnergyMotivation: {
    title: `onboarding_bothering_event_list_item_low_energy`,
    itemKey: `lowEnergyMotivation`,
    sleepScore: -1,
    active: false,
  },
  troubleSleeping: {
    title: `onboarding_bothering_event_list_item_trouble_sleeping`,
    itemKey: `troubleSleeping`,
    sleepScore: -1,
    active: false,
  },
  feelingDown: {
    title: `onboarding_bothering_event_list_item_feeling_down`,
    titleChakraExp: `onboarding_bothering_event_list_item_feeling_down_chakra_exp`,
    itemKey: `feelingDown`,
    sleepScore: -1,
    active: false,
  },
  physicalSymptomsOfStress: {
    title: `onboarding_bothering_event_list_item_symptoms_of_stress`,
    itemKey: `physicalSymptomsOfStress`,
    sleepScore: -1,
    active: false,
  },
  other: {
    title: `onboarding_bothering_event_list_item_other_key`,
    itemKey: `other`,
    sleepScore: -1,
    active: false,
  },
  none: {
    title: `onboarding_bothering_event_list_item_none`,
    itemKey: `none`,
    sleepScore: 0,
    active: false,
  },
};

export default function BotheringEvents({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('botheringEvents', true, onBack, onNext);
  const [eventList, setEventList] = useState(Object.values(OPTIONS));
  const [activeEvents, setActiveEvents] = useState();
  const { t } = useTranslations();

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
    Analytics.track(`Sleep Bothering Event`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Bothering Event List': activeEventList,
    });
    Analytics.setPeopleProperties({
      'Bothering Event List': activeEventList,
    });
    onNext({
      onboardingWellnessScore: {
        ...(profile.onboardingWellnessScore || {}),
        botheringEvents: affectingEventObj,
      },
    });
  }

  return (
    <Fragment>
      <Header
        title={t('onboarding_bothering_event_currently_bothering')}
        subtitle={t('onboarding_bothering_event_choose_all')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {eventList.map((item) => (
          <OnboardingMultipleOptionCheck
            dataTestId="onboardingBotheringEvents"
            key={item.itemKey}
            experiments={experiments}
            item={item}
            onClick={onSelectItem}
            title={item.titleChakraExp ? t(item.titleChakraExp) : t(item.title)}
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
