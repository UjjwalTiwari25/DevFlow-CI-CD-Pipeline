import React, { Fragment, useState, useEffect } from 'react';
import useTranslations from '@/hooks/translations';
import useBrowserHistory from '@/hooks/browserHistory';
import Analytics from '@/services/Analytics';
import OnboardingBigContinueButton from '@/components/app/OnboardingBigContinueButton';
import Header from '../Header';

import styles from './styles';
import OnboardingMultipleOptionCheck from '../OnboardingMultipleOptionCheck';

const OPTIONS = {
  restoreInnerBalance: {
    title: `onboarding_inner_healing_needs_list_item_restore_inner_balance`,
    itemKey: `restoreInnerBalance`,
    active: false,
  },
  releaseBuiltUpTension: {
    title: `onboarding_inner_healing_needs_list_item_release_built_up_tension`,
    itemKey: `releaseBuiltUpTension`,
    active: false,
  },
  healEmotionalWounds: {
    title: `onboarding_inner_healing_needs_list_item_heal_emotional_wounds`,
    itemKey: `healEmotionalWounds`,
    active: false,
  },
  reconnectWithMyself: {
    title: `onboarding_inner_healing_needs_list_item_reconnect_with_myself`,
    itemKey: `reconnectWithMyself`,
    active: false,
  },
  regainClarity: {
    title: `onboarding_inner_healing_needs_list_item_regain_clarity`,
    itemKey: `regainClarity`,
    active: false,
  },
  other: {
    title: `onboarding_bothering_event_list_item_other_key`,
    itemKey: `other`,
    active: false,
  },
};

export default function InnerHealingNeeds({ onNext, onBack, experiments }) {
  useBrowserHistory('innerHealingNeeds', true, onBack, onNext);
  const [needsList, setNeedsList] = useState(Object.values(OPTIONS));
  const [activeNeeds, setActiveNeeds] = useState();
  const { t } = useTranslations();

  useEffect(() => {
    const newNeedsList = needsList.filter((needItem) => {
      return needItem.active === true;
    });
    setActiveNeeds(newNeedsList);
  }, [needsList]);

  const onSelectItem = ({ itemKey }) => {
    const newNeedsList = needsList.map((needItem) => {
      let newNeedItem = needItem;
      if (needItem.itemKey === itemKey) {
        newNeedItem = { ...needItem, active: !needItem.active };
      }

      return newNeedItem;
    });
    setNeedsList(newNeedsList);
  };

  function onSubmit() {
    const selectedNeedsObj = {};
    if (activeNeeds?.length) {
      activeNeeds.forEach((need, index) => {
        if (need.itemKey) {
          selectedNeedsObj[need.itemKey] = index + 1;
        }
      });
    }
    const activeNeedsList = Object.keys(selectedNeedsObj);
    Analytics.track(`Inner Healing Needs`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Inner Healing Needs List': activeNeedsList,
    });
    Analytics.setPeopleProperties({
      'Inner Healing Needs List': activeNeedsList,
    });
    onNext({
      innerHealingNeeds: selectedNeedsObj,
    });
  }

  return (
    <Fragment>
      <Header
        title={t('onboarding_inner_healing_needs_header')}
        subtitle={t('onboarding_bothering_event_choose_all')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {needsList.map((item) => (
          <OnboardingMultipleOptionCheck
            dataTestId="onboardingInnerHealingNeeds"
            key={item.itemKey}
            experiments={experiments}
            item={item}
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
