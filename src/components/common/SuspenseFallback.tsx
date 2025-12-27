import { LoadingState } from './States';

const SuspenseFallback = () => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}
    >
      <LoadingState />
    </div>
  );
};

export default SuspenseFallback;
