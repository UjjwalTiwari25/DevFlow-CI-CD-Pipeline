import css from 'styled-jsx/css';

export default css`
  .header {
    padding: 35px 0 0 150px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .page-background-image {
    background-image: url('/static/images/referNew/new-reffer-lp-hero.png');
    background-repeat: no-repeat;
    transition: opacity 200ms ease;
    width: 100%;
    background-size: contain;
  }

  @media (max-width: 768px) {
    .header {
      padding: 23px 0 0 23px;
    }
  }
`;
