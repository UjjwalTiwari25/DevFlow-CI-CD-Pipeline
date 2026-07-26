import React, { useEffect, useRef, useState } from 'react';
import usePreviousValue from '@/hooks/previousValue';
import Text from '../Text';
import styles, { progressBarAnimation } from './styles';

const START_COLOR = '#000';
const BACKGROUND_COLOR = '#0004';
export default function ProgressBar({
  startColor,
  endColor,
  style,
  step,
  total,
  showStepCounter,
}) {
  const progressTotalLength = 100;
  const previousStep = usePreviousValue(step);
  const progressBarRef = useRef();
  const [width, setWidth] = useState(null);
  const start = (previousStep / total) * progressTotalLength;
  const end = (step / total) * progressTotalLength;

  useEffect(() => {
    function handleResize() {
      if (progressBarRef.current) {
        // Sometimes, the ref is not created immediately, so this condition ensures
        // the component re-renders and the ref is created again.
        setWidth(progressBarRef.current.offsetWidth);
      }
    }
    setTimeout(() => {
      // This delay allows the component to fully render and layout updates to complete
      if (progressBarRef.current) {
        // Sometimes, the ref is not created immediately, so this condition ensures
        // the component re-renders and the ref is created again.
        setWidth(progressBarRef.current.offsetWidth);
      }
    }, 100);

    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
    };
  }, [showStepCounter]);

  useEffect(() => {
    setWidth(progressBarRef.current?.offsetWidth);
  }, []);

  const { className: progressAnimation, styles: animationStyles } =
    progressBarAnimation(
      showStepCounter,
      startColor || START_COLOR,
      endColor || START_COLOR,
      end,
      start
    );

  return (
    <div className="w-100">
      <div style={style}>
        {showStepCounter && (
          <div className={`circle ${step === 0 && 'static-step'}`}>
            <Text type="body" color="cta-blue" align="center">
              0
            </Text>
          </div>
        )}
        <div
          className="row w-100 h-100"
          ref={progressBarRef}
          style={{
            borderRadius: showStepCounter ? '3.5px' : '24px',
            backgroundColor: BACKGROUND_COLOR,
            height: 8,
          }}>
          <div className={progressAnimation}>
            {showStepCounter && step > 0 && step < total && (
              <div
                className="circle circle-1"
                style={{ left: `calc(${(end / 100) * width - 16}px)` }}>
                <Text type="body" color="cta-blue" align="center">
                  {step}
                </Text>
              </div>
            )}
          </div>
        </div>
        {showStepCounter && (
          <div className={`circle ${step >= total && 'static-step'}`}>
            <Text type="body" color="cta-blue" align="center">
              {total}
            </Text>
          </div>
        )}
      </div>
      {animationStyles}
      <style jsx>{styles}</style>
    </div>
  );
}
