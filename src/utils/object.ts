export default {
  Keys<T>(target: T): (keyof T)[] {
    return Object.keys(target) as any;
  },
};
