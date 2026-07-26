import css from 'styled-jsx/css';

export default css`
  .loader-container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .rotate-ring {
    animation: AuraRingRotate linear 8s infinite;
  }
  @keyframes AuraRingRotate {
    0% {
      transform: rotate(-360deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
