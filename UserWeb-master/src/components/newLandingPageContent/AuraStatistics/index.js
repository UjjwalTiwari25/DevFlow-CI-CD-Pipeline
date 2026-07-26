import React from 'react';
import classNames from 'classnames';

function AuraStatistics({ isCelebritieLandingPage }) {
  return (
    <section className="section-numbers wf-section">
      <div className="content__medium">
        <div
          data-w-id="effdf0a0-1ad3-5712-5d26-c337f9c20a20"
          className="block__subtitle join">
          <h2
            className={classNames('h2__36', {
              'white-text': isCelebritieLandingPage,
            })}>
            Join millions who find peace with Aura.
          </h2>
        </div>
        <div className="block__numbers">
          <div
            data-w-id="6ed5e21c-944b-fa3d-99d1-e34c6ef663d7"
            className="item__number">
            <div className="text__number-grad clipped grad3">7M+</div>
            <h3
              className={classNames('h3__24 join', {
                'white-text': isCelebritieLandingPage,
              })}>
              {isCelebritieLandingPage ? 'Community' : 'Community members'}
            </h3>
            <p
              className={classNames('p__18', {
                'review-text': isCelebritieLandingPage,
              })}>
              {isCelebritieLandingPage
                ? 'Join an empowering community of coaches and supportive friends.'
                : 'Join a big, empowering community of supportive members & coaches.'}
            </p>
          </div>
          <div
            data-w-id="60508b03-3ae9-c056-03cf-483d011d9eda"
            className="item__number">
            <div className="text__number-grad clipped grad2">100M+</div>
            <h3
              className={classNames('h3__24 join', {
                'white-text': isCelebritieLandingPage,
              })}>
              Minutes spent in self-care
            </h3>
            <p
              className={classNames('p__18', {
                'review-text': isCelebritieLandingPage,
              })}>
              Every year, hundreds of millions of minutes are spent in
              meditation &amp; listening to experts on Aura.
            </p>
          </div>
          <div
            data-w-id="2b1e47d0-3725-dfce-5016-44ebbe835479"
            className="item__number">
            <div className="text__number-grad clipped grad1">20K+</div>
            <h3
              className={classNames('h3__24 join', {
                'white-text': isCelebritieLandingPage,
              })}>
              {isCelebritieLandingPage
                ? 'Personalized tracks'
                : 'Exclusive tracks'}
            </h3>
            <p
              className={classNames('p__18', {
                'review-text': isCelebritieLandingPage,
              })}>
              Get unlimited, access to Aura’s exclusive library of wellness
              tracks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuraStatistics;
