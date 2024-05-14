import { modeWatcher } from '../components/mode-watcher';
import { displaySearch } from '../components/search-display';

export function initTopbar() {
  modeWatcher();
  displaySearch();
}
