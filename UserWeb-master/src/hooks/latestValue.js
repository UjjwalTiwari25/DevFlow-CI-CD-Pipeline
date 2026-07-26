import { useRef, useEffect } from 'react';

export default function useLatestValue(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
