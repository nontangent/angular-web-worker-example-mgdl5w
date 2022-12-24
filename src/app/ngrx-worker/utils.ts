export const makeClassToken = (klass: any) => Symbol(klass).toString();
export const makeClassProvider = (klass: any) => ({
  provide: makeClassToken(klass),
  useClass: klass,
});
