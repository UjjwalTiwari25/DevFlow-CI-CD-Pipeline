import css from 'styled-jsx/css';

export default css`
  .bottom-background-clean {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    object-fit: cover;
    z-index: -1;
  }
  @media screen and (min-width: 769px) {
    .bottom-background-clean {
      position: fixed;
      bottom: -10%;
      object-fit: fill;
    }
  }
`;
