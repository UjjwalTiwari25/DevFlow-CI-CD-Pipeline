import css from 'styled-jsx/css';

export default css`
  #testimonial {
    display: flex;
    flex-direction: column;
    justify-content: left;
    padding: 30px;
    width: 100%;
    height: 279px;
    margin: 16px 16px 16px 0px;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    align-items: flex-start;
  }
  #testimonial-exp {
    display: flex;
    flex-direction: column;
    justify-content: left;
    padding: 27px;
    min-width: 284px;
    min-height: 330px;
    margin: 16px 16px 36px 0px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    align-items: flex-start;
    position: relative;
  }
  #testimonial-bottom {
    display: flex;
    flex-direction: column;
    justify-content: left;
    padding: 30px;
    min-width: 284px;
    min-height: 300px;
    margin: 16px 16px 36px 0px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    align-items: flex-start;
    position: relative;
  }
  .mood-image {
    width: 44px;
    height: 44px;
    object-fit: contain;
    margin-right: 16px;
  }
  .background {
    opacity: 0.5;
  }
  .background-coach {
    opacity: 0.5;
    background-image: url(/static/images/coachplan/review-background.png);
    min-height: 300px;
    border-radius: 52px;
    position: absolute;
    z-index: -1;
    min-width: 280px;
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    filter: blur(30px);
    left: 50%;
    transform: translate(-50%, 0%) rotate(-180deg);
  }
  .background-exp {
    background-image: url(/static/images/background-gradient-1.png);
    min-height: 300px;
    border-radius: 52px;
    position: absolute;
    z-index: -1;
    min-width: 280px;
    backdrop-filter: blur(60px);
    filter: blur(30px);
    left: 50%;
    transform: translate(-44%, 0%) rotate(-180deg);
    opacity: 0.5;
  }
  .background-exp-dark {
    background-image: url(/static/images/background-gradient-1.png);
    min-height: 300px;
    border-radius: 52px;
    position: absolute;
    z-index: -1;
    min-width: 280px;
    backdrop-filter: blur(60px);
    filter: blur(30px);
    left: 50%;
    transform: translate(-44%, 0%) rotate(-180deg);
    opacity: 0.3;
  }
  @media screen and (max-width: 375px) {
    #testimonial-bottom {
      min-width: 100%;
    }
  }
`;
