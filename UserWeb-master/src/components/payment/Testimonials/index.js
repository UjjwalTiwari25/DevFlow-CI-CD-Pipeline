import React, { Fragment } from 'react';
import styles from './styles';
import CustomHorizontalScrollView from '../../app/CustomHorizontalScroll';
import Testimonial from '../../onboardingClean/Testimonial';

const testimonial = {
  julie: {
    name: 'Julie',
    memberOf: 'Aura member for two years',
    image: '/static/images/testimonial/julie.png',
    desc: `Aura has become part of my daily habits and routine. It has eased my depression on days when I am down and helped me focus on days when I had to tackle a major project. Having said that, I use it for all sorts of situations.`,
  },
  david: {
    name: 'David',
    memberOf: 'Aura member for two years',
    image: '/static/images/testimonial/david.png',
    desc: `Aura is like having a therapist, personal life coach, guru & sleep buddy all wrapped into one. Aura allowed me to find myself & believe in who I am again`,
  },
  carly: {
    name: 'Carly',
    memberOf: 'Aura member for one year',
    image: '/static/images/testimonial/carly.png',
    desc: `Aura is by far the best meditation application i ever used. Every single time I get to fall asleep peacefully and wake up rested. Aura’s personalization is magical and knows just what works for me. Thank you!`,
  },
};
export default function Testimonials() {
  return (
    <Fragment>
      <div className="item-container-exp">
        <CustomHorizontalScrollView
          data={Object.values(testimonial)}
          renderItem={(item) => (
            <Testimonial
              key={item.name}
              name={item.name}
              memberOf={item.memberOf}
              image={item.image}
              desc={item.desc}
              isExperiment={true}
            />
          )}
        />
      </div>

      <style jsx>{styles}</style>
    </Fragment>
  );
}
