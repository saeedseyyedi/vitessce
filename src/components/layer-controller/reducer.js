import PubSub from 'pubsub-js';

import { LAYER_CHANGE } from '../../events';

const layerProperty = {
  color: 'colors',
  selection: 'selections',
  slider: 'sliders',
  visibility: 'visibilities',
};

function channelsToLayerProps(channels) {
  /*
  * Converts channels object to corresponding layerProps arrays
  *
  * const channels = {
  *   'c1': { color: [55, 55, 0], selection: [0, 0, 0], visibility: true, slider: [0, 200] }
  *   'c2': { color: [5, 20, 25], selection: [1, 0, 0], visibility: true, slider: [2, 300] }
  * };
  * const { selections, sliders, colors, visibilities } = channelsToLayerProps(channels);
  *
  */
  const selections = [];
  const sliders = [];
  const colors = [];
  const visibilities = [];
  Object.values(channels).forEach((c) => {
    selections.push(c.selection);
    sliders.push(c.slider);
    visibilities.push(c.visibility);
    colors.push(c.color);
  });
  return {
    selections, sliders, colors, visibilities,
  };
}

function getNewChannelProperty(channel, property, value) {
  if (property === 'visibility') {
    return !channel.visibility;
  }
  if (property === 'selection') {
    return { ...channel[property], ...value };
  }
  return value;
}

export default function reducer(channels, action) {
  const { type, layerId, payload } = action;
  switch (type) {
    case 'CHANGE_SINGLE_CHANNEL_PROPERTY': {
      // property is something like "selection" or "slider."
      // value is the actual change, like { channel: 0 }.
      const { channelId, property, value } = payload;
      // Update channel selection for new state.
      const nextChannels = {
        ...channels,
        [channelId]: {
          ...channels[channelId],
          [property]: getNewChannelProperty(
            channels[channelId],
            property,
            value,
          ),
        },
      };
      /*
      * Sending the entire state on each property change was causing performance issues.
      * Instead, LAYER_CHANGE events expect a `layerProps` object in the payload,
      * which just includes key value pairs which need to be updated for
      * the corresponding VivViewerLayer in Spatial.js.
      *
      * e.g. valid layerProps:
      *
      *  const changeOneLayerProp = { visibilities: [false, true] }
      *  const changeTwoLayerProps = {
      *    colors: [[255, 255, 255], [200, 0, 200]],
      *    sliders: [[0, 2000], [20, 2000]]
      *  }
      */
      const propertyToUpdate = layerProperty[property];
      const updatedValues = Object.values(nextChannels).map(c => c[property]);
      const layerProps = {
        [propertyToUpdate]: updatedValues,
      };
      // Publish deck.gl layer props.
      PubSub.publish(LAYER_CHANGE, { layerId, layerProps });
      return nextChannels;
    }
    case 'CHANGE_GLOBAL_CHANNELS_SELECTION': {
      const { selection, publish } = payload;
      // Update channel selection for new state.
      const nextChannels = {};
      // eslint-disable-next-line no-return-assign
      Object.keys(channels).forEach(channelId => (
        nextChannels[channelId] = {
          ...channels[channelId],
          selection: {
            ...channels[channelId].selection,
            ...selection,
          },
        }
      ));
      // See https://github.com/hubmapconsortium/vitessce-image-viewer/issues/176 for why
      // we don't publish on all changes - only on mouseup (this flag is set in LayerConroller).
      if (publish) {
        const updatedValues = Object.values(nextChannels).map(c => c.selection);
        const layerProps = { selections: updatedValues };
        // Publish deck.gl layer props.
        PubSub.publish(LAYER_CHANGE, { layerId, layerProps });
      }
      return nextChannels;
    }
    case 'ADD_CHANNEL': {
      const { selection } = payload;
      const channel = {
        selection,
        color: [255, 255, 255],
        visibility: true,
        slider: [0, 20000],
      };
      const channelId = String(Math.random());
      const nextChannels = { ...channels, [channelId]: channel };
      const layerProps = channelsToLayerProps(nextChannels);
      PubSub.publish(LAYER_CHANGE, { layerId, layerProps });
      return nextChannels;
    }
    case 'REMOVE_CHANNEL': {
      const { channelId } = action.payload;
      const { [channelId]: _, ...nextChannels } = channels;
      const layerProps = channelsToLayerProps(nextChannels);
      PubSub.publish(LAYER_CHANGE, { layerId, layerProps });
      return nextChannels;
    }
    case 'RESET_CHANNELS': {
      const layerProps = channelsToLayerProps({});
      PubSub.publish(LAYER_CHANGE, { layerId, layerProps });
      return {};
    }
    default:
      throw new Error(`Channel update type '${type}' is not valid.`);
  }
}
