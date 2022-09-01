import PropTypes from 'prop-types';

export const configPropTypes = PropTypes.shape({
  display_base: PropTypes.oneOf(['/displays/', '/__self__/'] as const).isRequired,
  data_type: PropTypes.oneOf(['jsonp', 'json'] as const).isRequired,
  split_layout: PropTypes.bool.isRequired,
  has_legend: PropTypes.bool.isRequired,
  require_token: PropTypes.bool.isRequired,
  disclaimer: PropTypes.bool.isRequired,
  cog_server: PropTypes.shape({
    type: PropTypes.oneOf(['jsonp', 'json'] as const).isRequired,
    info: PropTypes.shape({
      base: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  config_base: PropTypes.string.isRequired,
});

export const displayPropTypes = PropTypes.shape({
  desc: PropTypes.string.isRequired,
  group: PropTypes.oneOf(['common', 'condVar', 'panelKey'] as Group[]).isRequired,
  height: PropTypes.number.isRequired,
  keySig: PropTypes.string.isRequired,
  n: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  updated: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
});
