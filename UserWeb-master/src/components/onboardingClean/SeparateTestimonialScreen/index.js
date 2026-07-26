import React, { Fragment, useCallback, useEffect, useState } from 'react';
import useTranslations from '@/hooks/translations';
import useBrowserHistory from '../../../hooks/browserHistory';
import styles from './styles';
import Testimonial from '../Testimonial';
import OnboardingBigContinueButton from '../../app/OnboardingBigContinueButton';
import Header from '../Header';
import CustomHorizontalScrollView from '../../app/CustomHorizontalScroll';

const newTestimonial = {
  youngMale: {
    alfanso: {
      name: 'onboarding_testimonials_list_item_alfanso',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/alfanso.png',
      desc: `onboarding_testimonials_list_item_part_of_my_life`,
    },
    hanna: {
      name: 'onboarding_testimonials_list_item_hanna',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/hanna.png',
      desc: `onboarding_testimonials_list_item_having_a_therapist`,
    },
    ryan: {
      name: 'onboarding_testimonials_list_item_ryan',
      memberOf: 'onboarding_testimonials_list_item_one_year_member',
      image: '/static/images/personalizedGraphics/ryan.png',
      desc: `onboarding_testimonials_list_item_best_meditation_app_male`,
    },
  },
  youngFemale: {
    hanna: {
      name: 'onboarding_testimonials_list_item_hanna',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/hanna.png',
      desc: `onboarding_testimonials_list_item_part_of_my_life`,
    },
    brandon: {
      name: 'onboarding_testimonials_list_item_brandon',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/brandon.png',
      desc: `onboarding_testimonials_list_item_having_a_therapist`,
    },
    dulce: {
      name: 'onboarding_testimonials_list_item_dulce',
      memberOf: 'onboarding_testimonials_list_item_one_year_member',
      image: '/static/images/personalizedGraphics/dulce.png',
      desc: `onboarding_testimonials_list_item_best_meditation_app_female`,
    },
  },
  youngOther: {
    hanna: {
      name: 'onboarding_testimonials_list_item_hanna',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/hanna.png',
      desc: `onboarding_testimonials_list_item_part_of_my_life`,
    },
    brandon: {
      name: 'onboarding_testimonials_list_item_brandon',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/brandon.png',
      desc: `onboarding_testimonials_list_item_having_a_therapist`,
    },
    dulce: {
      name: 'onboarding_testimonials_list_item_dulce',
      memberOf: 'onboarding_testimonials_list_item_one_year_member',
      image: '/static/images/personalizedGraphics/dulce.png',
      desc: `onboarding_testimonials_list_item_best_meditation_app_female`,
    },
  },
  mediumMale: {
    alfanso: {
      name: 'onboarding_testimonials_list_item_alfanso',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/alfanso.png',
      desc: `onboarding_testimonials_list_item_part_of_my_life`,
    },
    brent: {
      name: 'onboarding_testimonials_list_item_mark',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/testimonial/brent.png',
      desc: `onboarding_testimonials_list_item_having_a_therapist`,
    },
    david: {
      name: 'onboarding_testimonials_list_item_david',
      memberOf: 'onboarding_testimonials_list_item_one_year_member',
      image: '/static/images/testimonial/david.png',
      desc: `onboarding_testimonials_list_item_best_meditation_app_male`,
    },
  },
  mediumFemale: {
    hanna: {
      name: 'onboarding_testimonials_list_item_hanna',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/hanna.png',
      desc: `onboarding_testimonials_list_item_part_of_my_life`,
    },
    linda: {
      name: 'onboarding_testimonials_list_item_linda',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/testimonial/linda.png',
      desc: `onboarding_testimonials_list_item_having_a_therapist`,
    },
    carly: {
      name: 'onboarding_testimonials_list_item_carly',
      memberOf: 'onboarding_testimonials_list_item_one_year_member',
      image: '/static/images/testimonial/carly.png',
      desc: `onboarding_testimonials_list_item_best_meditation_app_female`,
    },
  },
  mediumOther: {
    hanna: {
      name: 'onboarding_testimonials_list_item_hanna',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/hanna.png',
      desc: `onboarding_testimonials_list_item_part_of_my_life`,
    },
    brandon: {
      name: 'onboarding_testimonials_list_item_brandon',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/brandon.png',
      desc: `onboarding_testimonials_list_item_having_a_therapist`,
    },
    dulce: {
      name: 'onboarding_testimonials_list_item_dulce',
      memberOf: 'onboarding_testimonials_list_item_one_year_member',
      image: '/static/images/personalizedGraphics/dulce.png',
      desc: `onboarding_testimonials_list_item_best_meditation_app_female`,
    },
  },
  oldMale: {
    martin: {
      name: 'onboarding_testimonials_list_item_martin',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/martin.png',
      desc: `onboarding_testimonials_list_item_part_of_my_life`,
    },
    brent: {
      name: 'onboarding_testimonials_list_item_mark',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/testimonial/brent.png',
      desc: `onboarding_testimonials_list_item_having_a_therapist`,
    },
    david: {
      name: 'onboarding_testimonials_list_item_david',
      memberOf: 'onboarding_testimonials_list_item_one_year_member',
      image: '/static/images/testimonial/david.png',
      desc: `onboarding_testimonials_list_item_best_meditation_app_male`,
    },
  },
  oldFemale: {
    jocelyn: {
      name: 'onboarding_testimonials_list_item_jocelyn',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/jocelyn.png',
      desc: `onboarding_testimonials_list_item_part_of_my_life`,
    },
    linda: {
      name: 'onboarding_testimonials_list_item_linda',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/testimonial/linda.png',
      desc: `onboarding_testimonials_list_item_having_a_therapist`,
    },
    carly: {
      name: 'onboarding_testimonials_list_item_carly',
      memberOf: 'onboarding_testimonials_list_item_one_year_member',
      image: '/static/images/testimonial/carly.png',
      desc: `onboarding_testimonials_list_item_best_meditation_app_female`,
    },
  },
  oldOther: {
    jocelyn: {
      name: 'onboarding_testimonials_list_item_jocelyn',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/personalizedGraphics/jocelyn.png',
      desc: `onboarding_testimonials_list_item_part_of_my_life`,
    },
    linda: {
      name: 'onboarding_testimonials_list_item_linda',
      memberOf: 'onboarding_testimonials_list_item_two_year_member',
      image: '/static/images/testimonial/linda.png',
      desc: `onboarding_testimonials_list_item_having_a_therapist`,
    },
    carly: {
      name: 'onboarding_testimonials_list_item_carly',
      memberOf: 'onboarding_testimonials_list_item_one_year_member',
      image: '/static/images/testimonial/carly.png',
      desc: `onboarding_testimonials_list_item_best_meditation_app_female`,
    },
  },
};
export default function SeparateTestimonialScreen({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('separateTestimonialScreen', true, onBack, onNext);
  const { t } = useTranslations();
  const [activeIndex, setActiveIndex] = useState(null);
  const [refVal, setRefVal] = useState(0);
  const [userAgeGroup, setUserAgeGroup] = useState('');
  const [userGender, setUserGender] = useState('');

  useEffect(() => {
    if (profile.ageGroup === 'a' || profile.ageGroup === 'b')
      setUserAgeGroup('young');
    else if (profile.ageGroup === 'c' || profile.ageGroup === 'd')
      setUserAgeGroup('medium');
    else setUserAgeGroup('old');

    if (profile.gender === 'male') setUserGender(profile.gender);
    else if (profile.gender === 'female') setUserGender(profile.gender);
    else setUserGender('other');
  }, [profile.ageGroup, profile.gender]);

  const newTestimonialData = useCallback(() => {
    if (userAgeGroup === 'young') {
      if (userGender === 'male') return newTestimonial.youngMale;
      if (userGender === 'female') return newTestimonial.youngFemale;
      return newTestimonial.youngOther;
    }
    if (userAgeGroup === 'medium') {
      if (userGender === 'male') return newTestimonial.mediumMale;
      if (userGender === 'female') return newTestimonial.mediumFemale;
      return newTestimonial.mediumOther;
    }
    if (userGender === 'male') return newTestimonial.oldMale;
    if (userGender === 'female') return newTestimonial.oldFemale;
    return newTestimonial.oldOther;
  }, [userAgeGroup, userGender]);

  useEffect(() => {
    if (activeIndex === null) {
      setActiveIndex(0);
    }
    if (refVal < 200) {
      setActiveIndex(0);
    }
    if (refVal > 200 && refVal < 420) {
      setActiveIndex(1);
    }
    if (refVal > 420) {
      setActiveIndex(2);
    }
    return undefined;
  }, [activeIndex, refVal]);

  return (
    <Fragment>
      <div className="header-container">
        <Header
          title={t('onboarding_testimonials_trusted_by_5_million')}
          experiments={experiments}></Header>
      </div>

      <div className="item-container-exp">
        <CustomHorizontalScrollView
          data={Object.values(newTestimonialData())}
          setRefVal={setRefVal}
          renderItem={(item) => (
            <Testimonial
              key={item.name}
              name={t(item.name)}
              memberOf={t(item.memberOf)}
              image={item.image}
              desc={t(item.desc)}
              isExperiment={true}
              experiments={experiments}
            />
          )}
        />

        <div className="button-container">
          <OnboardingBigContinueButton
            title={t('button_continue')}
            experiments={experiments}
            onClick={() => {
              onNext();
            }}
          />
        </div>
      </div>
      <div className="wrapper">
        <div className="dot-container">
          {[1, 2, 3].map((item, index) => (
            <div key={item} className="single-dot-container">
              <div
                className={
                  activeIndex === index ? 'active-dot' : 'inactive-dot'
                }
              />
              {activeIndex === index && <div className="dot-shadow" />}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
