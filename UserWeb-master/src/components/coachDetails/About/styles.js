import css from 'styled-jsx/css';

export default css`
  .about {
    max-width: 554px;
    margin-top: 58px;
    position: relative;
    z-index: 2;
    margin-bottom: 40px;
  }
  .specialities {
    margin-top: 15px;
    flex-wrap: wrap;
  }
  .speciality {
    background: #ffffff;
    border: 1px solid rgba(144, 146, 163, 0.2);
    border-radius: 8px;
    padding: 10px;
    width: fit-content;
    height: fit-content;
    margin-right: 5px;
    margin-top: 5px;
  }
  @media screen and (max-width: 576px) {
    .about {
      margin-top: 32px;
      padding: 0px 28px;
    }
  }
`;
