import css from 'styled-jsx/css';

export default css`
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    margin-top: 24px;
    position: relative;
  }
  .exp-testimonial-container {
    width: 100%;
    padding: 24px;
    background: rgba(17, 25, 30, 0.8);
    border-radius: 16px;
    position: relative;
  }
  .testimonial-container {
    width: 100%;
    padding: 24px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    margin-bottom: 56px;
  }
  .five-star {
    height: 24px;
    margin-bottom: 12px;
  }
  .highlighted-text {
    font-weight: 700;
    color: #fae28e;
  }
  .profile {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .profile-initial {
    background: rgba(255, 255, 255, 0.16);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .review-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 100px;
  }
`;
