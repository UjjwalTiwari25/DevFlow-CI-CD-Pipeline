import React from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import Faq from './Faq';
import styles from './styles';

export default function FaqList({ isCelebritieLandingPage, isUsedInYourPlan }) {
  const { t } = useTranslations();
  const faqs = [
    {
      question: 'payment_subscribe_faq_list_item_question1',
      answer: 'payment_subscribe_faq_list_item_answer1',
    },
    {
      question: 'payment_subscribe_faq_list_item_question2',
      answer: 'payment_subscribe_faq_list_item_answer2',
    },
    {
      question: 'payment_subscribe_faq_list_item_question3',
      answer: 'payment_subscribe_faq_list_item_answer3',
    },
    {
      question: 'payment_subscribe_faq_list_item_question4',
      answer: 'payment_subscribe_faq_list_item_answer4',
    },
  ];
  return (
    <div className="col align-center w-100">
      <div
        className={classNames('container w-100', {
          'your-plan-top-margin': isUsedInYourPlan,
        })}>
        {!isCelebritieLandingPage && (
          <Text
            type="h4"
            color="b100"
            style={
              isUsedInYourPlan
                ? {
                    fontSize: '20px',
                    marginBottom: 12,
                    lineHeight: '25px',
                    fontWeight: '600',
                  }
                : { marginBottom: 12 }
            }>
            {t(
              isUsedInYourPlan
                ? 'payment_subscribe_faq_header_text_exp'
                : 'payment_subscribe_faq_header_text'
            )}
          </Text>
        )}
        {faqs.map((i) => (
          <Faq
            key={i.question}
            item={i}
            chageColorOnOpen={!isCelebritieLandingPage}
          />
        ))}
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}
