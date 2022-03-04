export default {
  *Keys<T>(target: T) {
    for (const key of Object.keys(target)) {
      yield key as keyof T;
    }
  },
};
