import css from 'styled-jsx/css';

export default css`
  .main {
    display: flex;
    max-width: 420px;
    overflow: hidden;
  }
  .testimonial {
    margin-right: 12px;
    width: 310px;
  }
  .mt {
    margin-top: 34px;
  }
  @media screen and (max-width: 576px) {
    .main {
      max-width: 330px;
    }
  }
`;
