/**
 * Map 类的超集，扩展了实用方法。
 * @extends {Map}
 */
export class Collection<K, V> extends Map<K, V> {
  /**
   * 返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
   * @param fn 用于检测的函数，返回值应当能被转换为 boolean。
   * @returns 集合中第一个满足所提供检测函数的元素的值，否则返回 undefined。
   */
  public find(fn: (value: V, key: K, collection: this) => unknown) {
    for (const [key, val] of this) {
      if (fn(val, key, this)) return val;
    }
    return undefined;
  }
}
