import range from 'lodash/range';
import chance from '../config/chance';

export class RandomContent {
  static lorem(p: number): string[] {
    return p > 0
      ? range(p).map(() => {
          return chance.paragraph({});
        })
      : [];
  }
}
