/**
 * Material Symbols icons used on the site. Google Fonts only sends these glyphs
 * (~8 KB instead of the 1.1 MB full font).
 *
 * ADDING AN ICON: put its name here, otherwise it renders as plain text
 * (e.g. "shopping_cart"). Names: https://fonts.google.com/icons
 */
const ICON_NAMES = [
  'account_balance_wallet', 'add', 'arrow_forward', 'battery_full', 'call', 'chat', 'check',
  'check_circle', 'chevron_left', 'chevron_right', 'close', 'credit_card', 'delete', 'description',
  'error', 'expand_more', 'format_quote', 'gavel', 'home', 'image', 'info', 'keyboard_arrow_down',
  'language', 'local_shipping', 'location_on', 'lock', 'mail', 'memory', 'menu', 'money', 'payments',
  'person', 'photo_camera', 'progress_activity', 'remove', 'rocket_launch', 'search', 'search_off',
  'send', 'sentiment_dissatisfied', 'shield', 'shopping_cart', 'signal_cellular_alt', 'smartphone',
  'support_agent', 'tune', 'verified', 'verified_user',
];

// Only the axes the site uses: size 24, weight 400, fill off/on (FILL 1 is used for a few icons).
// Google requires icon_names in alphabetical order.
export const MATERIAL_SYMBOLS_URL =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0' +
  `&icon_names=${[...new Set(ICON_NAMES)].sort().join(',')}&display=block`;
