import React from 'react';

import TitleInfo from '../components/TitleInfo';
import StatusSubscriber from '../components/status/StatusSubscriber';
import FactorsSubscriber from '../components/factors/FactorsSubscriber';
import GenesSubscriber from '../components/genes/GenesSubscriber';
import CellSetsManagerSubscriber from '../components/sets/CellSetsManagerSubscriber';
import HoverableScatterplotSubscriber from '../components/scatterplot/HoverableScatterplotSubscriber';
import HoverableSpatialSubscriber from '../components/spatial/HoverableSpatialSubscriber';
import HoverableHeatmapSubscriber from '../components/heatmap/HoverableHeatmapSubscriber';
import ChannelsSubscriber from '../components/channels/ChannelsSubscriber';
import HiGlassSubscriber from '../components/higlass/HiGlassSubscriber';

class Description extends React.Component {
  componentDidMount() {
    const { onReady } = this.props;
    onReady();
  }

  render() {
    const { description, removeGridComponent } = this.props;
    return (
      <TitleInfo title="Data Set" removeGridComponent={removeGridComponent} isScroll>
        <p className="details">{description}</p>
      </TitleInfo>
    );
  }
}

const registry = {
  description: Description,
  status: StatusSubscriber,
  factors: FactorsSubscriber,
  genes: GenesSubscriber,
  cellSets: CellSetsManagerSubscriber,
  scatterplot: HoverableScatterplotSubscriber,
  spatial: HoverableSpatialSubscriber,
  heatmap: HoverableHeatmapSubscriber,
  channels: ChannelsSubscriber,
  higlass: HiGlassSubscriber,
};

export default function getComponent(name) {
  const component = registry[name];
  if (component === undefined) {
    throw new Error(`Could not find definition for "${name}" in registry.`);
  }
  return registry[name];
}
