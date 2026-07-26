import css from 'styled-jsx/css';

export default css`
  .card {
    background-image: url('/static/images/yourplan-background.png');
    background-size: cover;
    border: none;
    border-radius: 6px;
    padding: 20px;
  }
  .card-short {
    background: transparent;
    background-size: cover;
    border: none;
    border-radius: 6px;
    padding: 20px;
  }
  .card-white {
    border: none;
    border-radius: 6px;
    background: #fff;
    margin-top: 10px;
  }
  .topics-container {
    display: inline-flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .single-topic {
    display: flex;
    flex: 0 48%;
    position: relative;
    justify-content: center;
    align-items: center;
    height: 90px;
    margin-bottom: 12px;
    border-radius: 8px;
    background-color: #a9a9a9;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .duration {
    display: flex;
    align-items: center;
  }
  .duration-icon {
    width: 43px;
    height: 43px;
    margin-right: 22px;
  }
  .sounds-container {
    display: block;
    margin-top: 30px;
  }
  .single-sound {
    display: flex;
    flex: 0 100%;
    position: relative;
    justify-content: center;
    align-items: center;
    height: 92px;
    margin-bottom: 16px;
    border-radius: 8px;
  }
  .counter-container {
    display: flex;
    justify-content: space-between;
    margin-top: 29px;
  }
  .therapists_counter {
    font-weight: 700;
    font-size: 32px;
    line-height: 39px;
    color: #2f3237;
    mix-blend-mode: normal;
    display: flex;
  }

  .tracks_counter {
    font-weight: 700;
    font-size: 32px;
    line-height: 39px;
    color: #2f3237;
    mix-blend-mode: normal;
    display: inline-flex;
  }

  .duration-container {
    display: block;
    margin-top: 30px;
  }
  .single-duration {
    display: flex;
    flex: 0 100%;
    position: relative;
    align-items: center;
    height: 92px;
    margin-bottom: 16px;
    border-radius: 8px;
  }
`;
