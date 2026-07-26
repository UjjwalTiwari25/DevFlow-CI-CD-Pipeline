import css from 'styled-jsx/css';

export default css`
  .aura-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 218px;
    cursor: pointer;
    height: 56px;
    border-radius: 99px;
    padding: 0 32px;
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 0.81%,
        #f4f5ff 28.06%,
        #ecf8ff 69%,
        #eefffc 100%
      );
    border: 0px;
    outline: none;
  }
  .btn-disabled {
    background: grey;
  }
  .btn-shadow {
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.3);
  }
  .button-animation {
    animation: ButtonfadeIn ease 11s;
    -moz-animation: ButtonfadeIn ease 11s;
    -o-animation: ButtonfadeIn ease 11s;
    -ms-animation: ButtonfadeIn ease 11s;
  }
  @keyframes ButtonfadeIn {
    0% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes ButtonfadeIn {
    0% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes ButtonfadeIn {
    0% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes ButtonfadeIn {
    0% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
`;
