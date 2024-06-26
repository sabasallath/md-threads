import { scroller } from 'react-scroll';
import Constant from '../config/constant';
import store from '../store/store';

export function useScrollToNode(): (nodeId: string) => void {
  return (nodeId: string) => {
    scroller.scrollTo(nodeId, {
      duration: Constant.SCROLL_DURATION,
      delay: Constant.SCROLL_DELAY,
      smooth: true,
      // todo fix hardcoded value
      offset: store.getState().ui.searchBar ? -50 - 64 : -50,
    });
  };
}
