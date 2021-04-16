import { RandomUtil } from './random.util';
import { ThreadUtil } from './thread.util';

function getNbNodePerLevelFactory(n: number) {
  const thread = RandomUtil.genThreadRegular(n);
  const flattenTree = ThreadUtil.flattenAndGroupById(thread);
  return (level: number) => {
    return Object.values(flattenTree).filter((e) => e.level === level).length;
  };
}

test('Thread flatten function test with n = 3', () => {
  const n = 3;
  const getNbNodeByLevel = getNbNodePerLevelFactory(n);
  expect(getNbNodeByLevel(0)).toBe(Math.pow(n, 0));
  expect(getNbNodeByLevel(1)).toBe(Math.pow(n, 1));
  expect(getNbNodeByLevel(2)).toBe(Math.pow(n, 2));
  expect(getNbNodeByLevel(3)).toBe(0);
});

test('Thread flatten function test with n = 4', () => {
  const n = 4;
  const getNbNodeByLevel = getNbNodePerLevelFactory(n);
  expect(getNbNodeByLevel(0)).toBe(Math.pow(n, 0));
  expect(getNbNodeByLevel(2)).toBe(Math.pow(n, 2));
  expect(getNbNodeByLevel(3)).toBe(Math.pow(n, 3));
  expect(getNbNodeByLevel(4)).toBe(0);
});
