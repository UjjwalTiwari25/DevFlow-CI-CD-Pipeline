import React from 'react';
import {
  AiFillLinkedin,
  AiOutlineInstagram,
  AiOutlineTwitter,
} from 'react-icons/ai';
import { BsApple, BsFacebook } from 'react-icons/bs';
import { DiAndroid } from 'react-icons/di';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuraButton from '../AuraButton';
import Text from '../Text';
import styles from './styles';

const INTERNAL_PAGES_LINKS = [
  { link: '/aura', title: 'Explore' },
  { link: '/coaches', title: 'Coaches' },
  { link: '/tracks', title: 'Tracks' },
  { link: '/topics', title: 'Topics' },
];
const MORE_SECTION_LINKS = [
  {
    link: 'https://app.aurahealth.io/gift?campaign=website',
    title: 'Gift Aura',
  },
  {
    link: 'https://app.aurahealth.io/redeem',
    title: 'Redeem Gift Code',
  },
  {
    link: 'https://www.aurahealth.io/gift-terms',
    title: 'Gift Card Terms',
  },
  {
    link: 'https://www.aurahealth.io/privacy-policy',
    title: 'Privacy Policy',
  },
  {
    link: 'https://www.aurahealth.io/terms-of-service',
    title: 'Terms of Service',
  },
  {
    link: 'https://www.aurahealth.io/faq',
    title: 'Support FAQ',
  },
];
const FOLLOW_US_SECTION = [
  {
    link: 'https://www.instagram.com/aurahealthhq/',
    icon: <AiOutlineInstagram />,
  },
  {
    link: 'https://www.facebook.com/AuraHealthHQ/',
    icon: <BsFacebook />,
  },
  {
    link: 'https://twitter.com/AuraHealthHQ',
    icon: <AiOutlineTwitter />,
  },
  {
    link: 'https://www.linkedin.com/company/aura-health-technologies?original_referer=https%3A%2F%2Fwww.aurahealth.io%2F',
    icon: <AiFillLinkedin />,
  },
];
const Footer = ({ containerStyle }) => {
  const router = useRouter();

  function handleSignUpClick(e) {
    e.preventDefault();

    router.push('/signup');
  }

  return (
    <div className="box">
      <div className="container" style={containerStyle}>
        <div className="row">
          <div className="column">
            <Text type="h3" align="left" style={{ marginBottom: '20px' }}>
              Aura
            </Text>
            {INTERNAL_PAGES_LINKS.map((item) => (
              <Link legacyBehavior href={item.link} key={item.link}>
                <a className="footer-link">
                  <Text type="body" align="left">
                    {item.title}
                  </Text>
                </a>
              </Link>
            ))}
            <a
              className="footer-link"
              target="_blank"
              href="https://www.aurahealth.io/blog">
              <Text type="body" align="left">
                Blog
              </Text>
            </a>
            <a
              className="footer-link"
              target="_blank"
              href="https://www.aurahealth.io/learning/learning-center">
              <Text type="body" align="left">
                Learning Center
              </Text>
            </a>
          </div>
          <div className="column">
            <Text type="h3" align="left" style={{ marginBottom: '20px' }}>
              More
            </Text>
            {MORE_SECTION_LINKS.map((item) => (
              <a
                className="footer-link"
                target="_blank"
                href={item.link}
                key={item.link}>
                <Text type="body" align="left">
                  {item.title}
                </Text>
              </a>
            ))}
          </div>
          <div className="column">
            <Text type="h3" align="left" style={{ marginBottom: '20px' }}>
              Get Started
            </Text>
            <AuraButton
              textWeight="bold"
              textStyle={{ fontSize: '14px' }}
              title="Get Started"
              style={{
                height: '35px',
                minWidth: '135px',
                maxWidth: '135px',
                marginBottom: '30px',
                background:
                  'linear-gradient(-225deg, rgb(1, 248, 239) 0%,rgb(3, 169, 244) 100%)',
                padding: '0 28px',
              }}
              onClick={handleSignUpClick}
            />
            <a
              className="footer-link"
              target="_blank"
              href="https://apps.apple.com/app/apple-store/id1114223104"
              style={{ display: 'flex' }}>
              <div className="app-logo">
                <div
                  style={{
                    marginRight: '5px',
                    marginBottom: '5px',
                    color: '#ccccd5',
                  }}>
                  <BsApple />
                </div>
                <Text type="subtitle" align="left">
                  Download IOS App
                </Text>
              </div>
            </a>
            <a
              className="footer-link"
              target="_blank"
              href="https://play.google.com/store/apps/details?id=com.aurahealth"
              style={{ display: 'flex' }}>
              <div className="app-logo">
                <div style={{ marginRight: '5px', color: '#ccccd5' }}>
                  <DiAndroid />
                </div>
                <Text type="subtitle" align="left">
                  Download Android App
                </Text>
              </div>
            </a>
          </div>
          <div className="column">
            <Text type="h3" align="left" style={{ marginBottom: '20px' }}>
              Follow Us
            </Text>
            <div className="social-logos">
              {FOLLOW_US_SECTION.map((item) => (
                <a
                  className="social-icons"
                  target="_blank"
                  href={item.link}
                  key={item.link}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-text">
            <Text type="body2">© 2023 Aura Health</Text>
          </div>
          <Text type="body2">
            Contact us:
            <span>
              <a href="mailto:hello@aurahealth.io" style={{ color: '#5b657a' }}>
                hello@aurahealth.io
              </a>
            </span>
          </Text>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
export default Footer;
