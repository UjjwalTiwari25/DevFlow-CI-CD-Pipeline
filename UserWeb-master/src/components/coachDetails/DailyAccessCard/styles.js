import css from 'styled-jsx/css';

export default css`
  .daily-access-info {
    width: 318px;
  }
  .daily-access {
    margin-top: 24px;
    width: 100%;
  }
  .booking-coach {
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
    padding: 11px 10px 11px 22px;
    margin-top: 23px;
    width: fit-content;
  }
  .spots {
    background: linear-gradient(
      89.96deg,
      #ff4c4c 0.03%,
      #ff00b8 99.97%,
      #fc323e 99.97%,
      #fc323e 99.97%
    );
    opacity: 0.6;
    border-radius: 999px;
    padding: 3px 6px;
    margin-left: 18px;
    position: relative;
    z-index: 2;
    height: 19px;
  }
  .shadow {
    background: linear-gradient(
      89.96deg,
      #ff4c4c 0.03%,
      #ff00b8 99.97%,
      #fc323e 99.97%,
      #fc323e 99.97%
    );
    opacity: 0.5;
    filter: blur(9px);
    border-radius: 999px;
    width: 69px;
    position: absolute;
    height: 15px;
    bottom: 0px;
    right: 0px;
  }
  .spots-container {
    position: relative;
  }
  .coach-chat {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    right: 239px;
    top: 91px;
  }
  .coach-chat-2 {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    right: 239px;
    top: 282px;
  }
  .coach-chat-3 {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    right: 239px;
    top: 350px;
  }
  .chat {
    position: relative;
    overflow: hidden;
  }
  .mobile {
    height: 367px;
  }
  @media screen and (max-width: 768px) {
    .daily-access {
      flex-direction: column;
      align-items: center;
    }
    .daily-access-info {
      max-width: 400px;
      align-items: center;
    }
    .chat {
      margin-left: -76px;
    }
  }
  @media screen and (max-width: 576px) {
    .daily-access {
      padding: 0px 29px;
    }
    .booking-coach {
      flex-direction: row;
      align-items: center;
      padding: 11px 22px 11px 22px;
      width: 100%;
      justify-content: space-between;
    }
    .spots-container {
      width: fit-content;
    }
  }
`;
