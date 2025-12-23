import { LoadingState } from './States';

export const SuspenseFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: '50vh',
      width: '100%',
    }}
  >
    <LoadingState />
  </div>
);
