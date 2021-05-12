/** https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify */
export function patchError(): void {
  if (!('toJSON' in Error.prototype)) {
    Object.defineProperty(Error.prototype, 'toJSON', {
      value: function () {
        const alt = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
          // @ts-expect-error alt is treated as `any`
          alt[key] = this[key];
        }, this);

        return alt;
      },
      configurable: true,
      writable: true,
    });
  }
}
