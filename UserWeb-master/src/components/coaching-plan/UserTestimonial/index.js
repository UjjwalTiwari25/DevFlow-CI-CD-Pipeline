import React from 'react';
import CustomerReview from '../../yourPlan/clean/CustomerReview';
import styles from './styles';

export default function UserTestimonial() {
  return (
    <div className="main">
      <div className="testimonial">
        <CustomerReview isCoachPlan={true} />
      </div>
      <div className="testimonial mt">
        <CustomerReview isCoachPlan={true} hideText />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
