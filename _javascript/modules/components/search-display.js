/**
 * This script make #search-result-wrapper switch to unloaded or shown automatically.
 */
const $btnSearchTrigger = $('#search-trigger');
const $btnCancel = $('#search-cancel');
const $content = $('#main-wrapper>.container>.row');
const $topbarTitle = $('#topbar-title');
const $topbarToolbar = $('#topbar-toolbar');
const $topbarNavigation = $('#topbar-navigation');
const $search = $('search');
const $resultWrapper = $('#search-result-wrapper');
const $results = $('#search-results');
const $input = $('#search-input');
const $hints = $('#search-hints');
const $viewport = $('html,body');

// class names
const C_LOADED = 'loaded';
const C_UNLOADED = 'unloaded';
const C_FOCUS = 'input-focus';
const C_FLEX = 'd-flex';

class ScrollBlocker {
  static offset = 0;
  static resultVisible = false;

  static on() {
    ScrollBlocker.offset = window.scrollY;
    $viewport.scrollTop(0);
  }

  static off() {
    $viewport.scrollTop(ScrollBlocker.offset);
  }
}

/*--- Actions in mobile screens ---*/
class MobileSearchBar {
  static on() {
    $topbarTitle.addClass(C_UNLOADED);
    $topbarToolbar.addClass(C_UNLOADED);
    $topbarNavigation.addClass(C_UNLOADED);
    $btnSearchTrigger.addClass(C_UNLOADED);
    $search.addClass(C_FLEX);
    $btnCancel.addClass(C_LOADED);
  }

  static off() {
    $btnCancel.removeClass(C_LOADED);
    $search.removeClass(C_FLEX);
    $btnSearchTrigger.removeClass(C_UNLOADED);
    $topbarNavigation.removeClass(C_UNLOADED);
    $topbarToolbar.removeClass(C_UNLOADED);
    $topbarTitle.removeClass(C_UNLOADED);
  }
}

class ResultSwitch {
  static on() {
    if (!ScrollBlocker.resultVisible) {
      // the block method must be called before $(#main-wrapper>.container) unloaded.
      ScrollBlocker.on();
      $resultWrapper.removeClass(C_UNLOADED);
      $content.addClass(C_UNLOADED);
      ScrollBlocker.resultVisible = true;
    }
  }

  static off() {
    if (ScrollBlocker.resultVisible) {
      $results.empty();
      if ($hints.hasClass(C_UNLOADED)) {
        $hints.removeClass(C_UNLOADED);
      }
      $resultWrapper.addClass(C_UNLOADED);
      $content.removeClass(C_UNLOADED);

      // now the release method must be called after $(#main-wrapper>.container) display
      ScrollBlocker.off();

      $input.val('');
      ScrollBlocker.resultVisible = false;
    }
  }
}

function isMobileView() {
  return $btnCancel.hasClass(C_LOADED);
}

export function displaySearch() {
  $btnSearchTrigger.on('click', function () {
    MobileSearchBar.on();
    ResultSwitch.on();
    $input.trigger('focus');
  });

  $btnCancel.on('click', function () {
    MobileSearchBar.off();
    ResultSwitch.off();
  });

  $input.on('focus', function () {
    $search.addClass(C_FOCUS);
  });

  $input.on('focusout', function () {
    $search.removeClass(C_FOCUS);
  });

  $input.on('input', () => {
    if ($input.val() === '') {
      if (isMobileView()) {
        $hints.removeClass(C_UNLOADED);
      } else {
        ResultSwitch.off();
      }
    } else {
      ResultSwitch.on();
      if (isMobileView()) {
        $hints.addClass(C_UNLOADED);
      }
    }
  });
}
