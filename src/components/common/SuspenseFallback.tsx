import { LoadingState } from './States';

const SuspenseFallback = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        minHeight: '50vh', // Minimum height to avoid collapse, but not full screen forced
      }}
    >
      <LoadingState />
    </div>
  );
};

export default SuspenseFallback;
