import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import NewLandingPageStyle from '../NewLandingPageStyle';

function CoachListSlider({ isCelebritieLandingPage }) {
  return (
    <>
      {isCelebritieLandingPage && <NewLandingPageStyle />}
      <section className="section-coaches wf-section">
        <div className={'content__small _700'}>
          <h2
            className={classNames('h2__36 center', {
              'white-text': isCelebritieLandingPage,
            })}>
            {isCelebritieLandingPage
              ? 'Tracks created by the world’s largest community of world-class coaches & therapists'
              : `Access the world’s largest community of world-class coaches & therapists.`}
          </h2>
          <p
            className={classNames('p__22', {
              'white-text': isCelebritieLandingPage,
            })}>
            Aura is home to hundreds of vetted, world-class coaches &amp;
            therapists. Listen to their content and also receive 1-1 coaching
            directly from your favorite coaches.
          </p>
        </div>
        <div className="slider_cards-coaches-1">
          <div className="block__cards">
            <div className="item__card-coaches">
              <Image
                fill
                alt="jiva-masheder"
                src="/static/newLandingPageContent/images/JivaMasheder.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Jiva Masheder</div>
                </div>
                <div className="text__card-coach-title">Meditation Coach</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="lauren-ziegler"
                src="/static/newLandingPageContent/images/LaurenZiegler.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Lauren Ziegler</div>
                </div>
                <div className="text__card-coach-title">
                  Meditation Coach &amp; Yoga Therapist
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="cass-carlopio"
                src="/static/newLandingPageContent/images/CassCarlopio.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-au.png"
                    alt="Australia Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Cass Carlopio</div>
                </div>
                <div className="text__card-coach-title">
                  Sleep Expert &amp; Psychologist
                </div>
              </div>
            </div>
            <div className="item__card-coaches ">
              <Image
                fill
                alt="dorothy-ratusny"
                src="/static/newLandingPageContent/images/DorothyRatusny.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-ca.png"
                    alt="Canada Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dorothy Ratusny</div>
                </div>
                <div className="text__card-coach-title">
                  Holistic Psychotherapist
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="nitima-priya"
                src="/static/newLandingPageContent/images/NitimaPriya.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Nitima Priya</div>
                </div>
                <div className="text__card-coach-title">
                  Integrative Counselor
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="dr-toni"
                src="/static/newLandingPageContent/images/DrToni.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dr. Toni</div>
                </div>
                <div className="text__card-coach-title">
                  Doctor of Physical Therapy
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="kristy-arbon"
                src="/static/newLandingPageContent/images/KristyArbon.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-au.png"
                    alt="Australia Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Kristy Arbon</div>
                </div>
                <div className="text__card-coach-title">
                  Self-Compassion Teacher
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="christina-mcmahon"
                src="/static/newLandingPageContent/images/ChristinaMcMahon.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Christina McMahon</div>
                </div>
                <div className="text__card-coach-title">
                  Relationship Expert
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="dr-alexis-moreno"
                src="/static/newLandingPageContent/images/DrAlexisMoreno.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dr. Alexis Moreno</div>
                </div>
                <div className="text__card-coach-title">Psychologist</div>
              </div>
            </div>
          </div>
          <div className="block__cards">
            <div className="item__card-coaches">
              <Image
                fill
                alt="jiva-masheder"
                src="/static/newLandingPageContent/images/JivaMasheder.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Jiva Masheder</div>
                </div>
                <div className="text__card-coach-title">Meditation Coach</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="lauren-ziegler"
                src="/static/newLandingPageContent/images/LaurenZiegler.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Lauren Ziegler</div>
                </div>
                <div className="text__card-coach-title">
                  Meditation Coach &amp; Yoga Therapist
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="cass-carlopio"
                src="/static/newLandingPageContent/images/CassCarlopio.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-au.png"
                    alt="Australia Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Cass Carlopio</div>
                </div>
                <div className="text__card-coach-title">
                  Sleep Expert &amp; Psychologist
                </div>
              </div>
            </div>
            <div className="item__card-coaches ">
              <Image
                fill
                alt="dorothy-ratusny"
                src="/static/newLandingPageContent/images/DorothyRatusny.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-ca.png"
                    alt="Canada Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dorothy Ratusny</div>
                </div>
                <div className="text__card-coach-title">
                  Holistic Psychotherapist
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="nitima-priya"
                src="/static/newLandingPageContent/images/NitimaPriya.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Nitima Priya</div>
                </div>
                <div className="text__card-coach-title">
                  Integrative Counselor
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="dr-toni"
                src="/static/newLandingPageContent/images/DrToni.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dr. Toni</div>
                </div>
                <div className="text__card-coach-title">
                  Doctor of Physical Therapy
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="kristy-arbon"
                src="/static/newLandingPageContent/images/KristyArbon.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-au.png"
                    alt="Australia Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Kristy Arbon</div>
                </div>
                <div className="text__card-coach-title">
                  Self-Compassion Teacher
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="christina-mcmahon"
                src="/static/newLandingPageContent/images/ChristinaMcMahon.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Christina McMahon</div>
                </div>
                <div className="text__card-coach-title">
                  Relationship Expert
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="dr-alexis-moreno"
                src="/static/newLandingPageContent/images/DrAlexisMoreno.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dr. Alexis Moreno</div>
                </div>
                <div className="text__card-coach-title">Psychologist</div>
              </div>
            </div>
          </div>
          <div className="block__cards">
            <div className="item__card-coaches">
              <Image
                fill
                alt="jiva-masheder"
                src="/static/newLandingPageContent/images/JivaMasheder.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Jiva Masheder</div>
                </div>
                <div className="text__card-coach-title">Meditation Coach</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="lauren-ziegler"
                src="/static/newLandingPageContent/images/LaurenZiegler.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Lauren Ziegler</div>
                </div>
                <div className="text__card-coach-title">
                  Meditation Coach &amp; Yoga Therapist
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="cass-carlopio"
                src="/static/newLandingPageContent/images/CassCarlopio.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-au.png"
                    alt="Australia Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Cass Carlopio</div>
                </div>
                <div className="text__card-coach-title">
                  Sleep Expert &amp; Psychologist
                </div>
              </div>
            </div>
            <div className="item__card-coaches ">
              <Image
                fill
                alt="dorothy-ratusny"
                src="/static/newLandingPageContent/images/DorothyRatusny.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-ca.png"
                    alt="Canada Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dorothy Ratusny</div>
                </div>
                <div className="text__card-coach-title">
                  Holistic Psychotherapist
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="nitima-priya"
                src="/static/newLandingPageContent/images/NitimaPriya.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Nitima Priya</div>
                </div>
                <div className="text__card-coach-title">
                  Integrative Counselor
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="dr-toni"
                src="/static/newLandingPageContent/images/DrToni.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dr. Toni</div>
                </div>
                <div className="text__card-coach-title">
                  Doctor of Physical Therapy
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="kristy-arbon"
                src="/static/newLandingPageContent/images/KristyArbon.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-au.png"
                    alt="Australia Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Kristy Arbon</div>
                </div>
                <div className="text__card-coach-title">
                  Self-Compassion Teacher
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="christina-mcmahon"
                src="/static/newLandingPageContent/images/ChristinaMcMahon.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Christina McMahon</div>
                </div>
                <div className="text__card-coach-title">
                  Relationship Expert
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="dr-alexis-moreno"
                src="/static/newLandingPageContent/images/DrAlexisMoreno.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dr. Alexis Moreno</div>
                </div>
                <div className="text__card-coach-title">Psychologist</div>
              </div>
            </div>
          </div>
        </div>
        <div className="slider_cards-coaches-2">
          <div className="block__cards">
            <div className="item__card-coaches">
              <Image
                fill
                alt="jaisa-sulit"
                src="/static/newLandingPageContent/images/JaisaSulit.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Jaisa Sulit</div>
                </div>
                <div className="text__card-coach-title">
                  Occupational Therapist
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="karuna-priya"
                src="/static/newLandingPageContent/images/JivaMasheder.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Karuna Priya</div>
                </div>
                <div className="text__card-coach-title">
                  Mindfulness Teacher
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="happiness-insight"
                src="/static/newLandingPageContent/images/HappinessInsight.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-au.png"
                    alt="Australia Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Happiness Insight</div>
                </div>
                <div className="text__card-coach-title">
                  Clinical Psychologists
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="vanessa-michele"
                src="/static/newLandingPageContent/images/VanessaMichele.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Vanessa Michele</div>
                </div>
                <div className="text__card-coach-title">Yoga Teacher</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="glenn-harrold"
                src="/static/newLandingPageContent/images/GlennHarrold.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Glenn Harrold</div>
                </div>
                <div className="text__card-coach-title">Hypnotherapist</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="laura-westcott"
                src="/static/newLandingPageContent/images/LauraWestcott.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Laura Westcott</div>
                </div>
                <div className="text__card-coach-title">Singer</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="tom-ward"
                src="/static/newLandingPageContent/images/TomWard.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Tom Ward</div>
                </div>
                <div className="text__card-coach-title">Storyteller</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="dorina-owindi"
                src="/static/newLandingPageContent/images/DorinaOwindi.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-fi.png"
                    alt="Finland Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dorina Owindi</div>
                </div>
                <div className="text__card-coach-title">Healing Coach</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="marisa-moon"
                src="/static/newLandingPageContent/images/MarisaMoon.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Marisa Moon</div>
                </div>
                <div className="text__card-coach-title">
                  Primal Health Coach
                </div>
              </div>
            </div>
          </div>
          <div className="block__cards">
            <div className="item__card-coaches">
              <Image
                fill
                alt="jaisa-sulit"
                src="/static/newLandingPageContent/images/JaisaSulit.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Jaisa Sulit</div>
                </div>
                <div className="text__card-coach-title">
                  Occupational Therapist
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="karuna-priya"
                src="/static/newLandingPageContent/images/JivaMasheder.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Karuna Priya</div>
                </div>
                <div className="text__card-coach-title">
                  Mindfulness Teacher
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="happiness-insight"
                src="/static/newLandingPageContent/images/HappinessInsight.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-au.png"
                    alt="Australia Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Happiness Insight</div>
                </div>
                <div className="text__card-coach-title">
                  Clinical Psychologists
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="vanessa-michele"
                src="/static/newLandingPageContent/images/VanessaMichele.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Vanessa Michele</div>
                </div>
                <div className="text__card-coach-title">Yoga Teacher</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="glenn-harrold"
                src="/static/newLandingPageContent/images/GlennHarrold.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Glenn Harrold</div>
                </div>
                <div className="text__card-coach-title">Hypnotherapist</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="laura-westcott"
                src="/static/newLandingPageContent/images/LauraWestcott.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Laura Westcott</div>
                </div>
                <div className="text__card-coach-title">Singer</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="tom-ward"
                src="/static/newLandingPageContent/images/TomWard.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Tom Ward</div>
                </div>
                <div className="text__card-coach-title">Storyteller</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="dorina-owindi"
                src="/static/newLandingPageContent/images/DorinaOwindi.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-fi.png"
                    alt="Finland Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dorina Owindi</div>
                </div>
                <div className="text__card-coach-title">Healing Coach</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="marisa-moon"
                src="/static/newLandingPageContent/images/MarisaMoon.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Marisa Moon</div>
                </div>
                <div className="text__card-coach-title">
                  Primal Health Coach
                </div>
              </div>
            </div>
          </div>
          <div className="block__cards">
            <div className="item__card-coaches">
              <Image
                fill
                alt="jaisa-sulit"
                src="/static/newLandingPageContent/images/JaisaSulit.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Jaisa Sulit</div>
                </div>
                <div className="text__card-coach-title">
                  Occupational Therapist
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="karuna-priya"
                src="/static/newLandingPageContent/images/JivaMasheder.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Karuna Priya</div>
                </div>
                <div className="text__card-coach-title">
                  Mindfulness Teacher
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="happiness-insight"
                src="/static/newLandingPageContent/images/HappinessInsight.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-au.png"
                    alt="Australia Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Happiness Insight</div>
                </div>
                <div className="text__card-coach-title">
                  Clinical Psychologists
                </div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="vanessa-michele"
                src="/static/newLandingPageContent/images/VanessaMichele.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Vanessa Michele</div>
                </div>
                <div className="text__card-coach-title">Yoga Teacher</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="glenn-harrold"
                src="/static/newLandingPageContent/images/GlennHarrold.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Glenn Harrold</div>
                </div>
                <div className="text__card-coach-title">Hypnotherapist</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="laura-westcott"
                src="/static/newLandingPageContent/images/LauraWestcott.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Laura Westcott</div>
                </div>
                <div className="text__card-coach-title">Singer</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="tom-ward"
                src="/static/newLandingPageContent/images/TomWard.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-gb.png"
                    alt="United Kingdom Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Tom Ward</div>
                </div>
                <div className="text__card-coach-title">Storyteller</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="dorina-owindi"
                src="/static/newLandingPageContent/images/DorinaOwindi.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-fi.png"
                    alt="Finland Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Dorina Owindi</div>
                </div>
                <div className="text__card-coach-title">Healing Coach</div>
              </div>
            </div>
            <div className="item__card-coaches">
              <Image
                fill
                alt="marisa-moon"
                src="/static/newLandingPageContent/images/MarisaMoon.jpg"
                style={{ objectFit: 'cover' }}
              />
              <div className="bg-gradient-darkbottom">
                <div className="block__card-coach-name">
                  <Image
                    height={20}
                    width={20}
                    src="/static/newLandingPageContent/images/flag-us.png"
                    alt="United States of America Flag"
                    className="flag__card-coaches"
                  />
                  <div className="text__card-coach-name">Marisa Moon</div>
                </div>
                <div className="text__card-coach-title">
                  Primal Health Coach
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CoachListSlider;
