const useDevMode = () => {
  return process.env.NODE_ENV === 'development';
};

export default useDevMode;
