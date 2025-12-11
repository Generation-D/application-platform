export const getPublicEnv = (key: string) => {
  if (typeof window !== "undefined" && window.env && window.env[key]) {
    return window.env[key];
  }

  const value = process.env[key];
  if (value === "") {
    return undefined;
  }
  return value;
};
