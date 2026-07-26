import css from 'styled-jsx/css';

export default css`
  .booking-coach-wait-list {
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 0.81%,
        #f4f5ff 28.06%,
        #ecf8ff 69%,
        #eefffc 100%
      );
    box-shadow: 0px 8px 40px rgba(43, 42, 107, 0.1);
    border-radius: 99px;
    padding: 11px 22px;
    margin-top: 23px;
    width: fit-content;
    position: relative;
    z-index: 9;
  }
  .disable-waiting-list-button {
    background: #e7e7e7;
  }
  @media screen and (max-width: 576px) {
    .booking-coach-wait-list {
      width: 100%;
      justify-content: center;
    }
  }
`;
