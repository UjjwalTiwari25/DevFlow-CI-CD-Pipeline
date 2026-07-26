import css from 'styled-jsx/css';

export default css`
  .item-container-exp {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: flex-start;
    overflow: scroll;
  }
  ::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  @media screen and (max-width: 576px) {
    .item-container-exp {
      max-width: 356px;
    }
  }
  @media screen and (max-width: 375px) {
    .item-container-exp {
      max-width: 324px;
    }
  }
  @media screen and (max-width: 320px) {
    .item-container-exp {
      max-width: 280px;
    }
  }
`;
