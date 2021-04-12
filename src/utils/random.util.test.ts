import { RandomUtil } from './random.util';
import { TreeUtil } from './tree.util';
import range from 'lodash/range';

test('Thread generation test -- root node', () => {
  expect(RandomUtil.genThreadRegularDecrease(0).root.descendant.length).toBe(0);
  expect(RandomUtil.genThreadRegularDecrease(-1).root.descendant.length).toBe(
    RandomUtil.genThreadRegularDecrease(0).root.descendant.length
  );
  expect(RandomUtil.genThreadRegularDecrease(1).root.descendant.length).toBe(1);
});

test('Thread generation test -- number of nodes of a regular tree', () => {
  const expectedNbNodeRegular = (n: number) => {
    if (n === 1) return 1;
    if (n === 2) return 3;
    // Only true with n > 2
    return Math.floor(Math.pow(n, n) / (n - 1));
  };

  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(0).root)).toBe(1);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(1).root)).toBe(1);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(2).root)).toBe(3);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(3).root)).toBe(13);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(4).root)).toBe(85);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(5).root)).toBe(781);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(1).root)).toBe(expectedNbNodeRegular(1));
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(2).root)).toBe(expectedNbNodeRegular(2));
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(3).root)).toBe(expectedNbNodeRegular(3));
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(4).root)).toBe(expectedNbNodeRegular(4));
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegular(5).root)).toBe(expectedNbNodeRegular(5));
});

test('Thread generation test -- number of nodes', () => {
  const expectedRegularDecreaseNbDescendantNode = (n: number) => {
    const r = range(1, n + 1).reverse();
    return r.reduce((sum, _e, index) => {
      sum += r.slice(0, index + 1).reduce((acc, e) => acc * e, 1);
      return sum;
    }, 0);
  };

  const expectedNbNode = (n: number) => {
    const root = 1;
    return expectedRegularDecreaseNbDescendantNode(n) + root;
  };

  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(0).root)).toBe(1);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(1).root)).toBe(2);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(2).root)).toBe(5);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(3).root)).toBe(16);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(4).root)).toBe(65);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(5).root)).toBe(326);
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(1).root)).toBe(expectedNbNode(1));
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(2).root)).toBe(expectedNbNode(2));
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(3).root)).toBe(expectedNbNode(3));
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(4).root)).toBe(expectedNbNode(4));
  expect(TreeUtil.nbNodes(RandomUtil.genThreadRegularDecrease(5).root)).toBe(expectedNbNode(5));
});
