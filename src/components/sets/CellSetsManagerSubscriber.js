import React from 'react';
import PubSub from 'pubsub-js';
import {
  CELL_SETS_MODIFY, CELL_SETS_VIEW, CELLS_SELECTION,
  CELLS_ADD, STATUS_WARN, CELLS_COLOR,
} from '../../events';
import SetsManager from './SetsManager';
import TitleInfo from '../TitleInfo';
import SetsTree from './sets';

const setsType = 'cell';

export default class CellSetsManagerSubscriber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cellSets: new SetsTree(
        (obj) => {
          PubSub.publish(CELL_SETS_MODIFY, obj);
        },
        (cellIds, cellColors) => {
          PubSub.publish(CELLS_COLOR, cellColors);
          PubSub.publish(CELL_SETS_VIEW, cellIds);
        },
      ),
    };
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  componentWillMount() {
    this.cellsAddToken = PubSub.subscribe(
      CELLS_ADD, this.cellsAddSubscriber.bind(this),
    );
    this.cellSetsToken = PubSub.subscribe(
      CELL_SETS_MODIFY, this.cellSetsSubscriber.bind(this),
    );
    this.cellsSelectionToken = PubSub.subscribe(
      CELLS_SELECTION, this.cellsSelectionSubscriber.bind(this),
    );
  }

  componentDidMount() {
    const { onReady } = this.props;
    onReady();
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.cellsAddToken);
    PubSub.unsubscribe(this.cellSetsToken);
    PubSub.unsubscribe(this.cellsSelectionToken);
  }

  cellsAddSubscriber(msg, cells) {
    const { cellSets } = this.state;
    cellSets.setItems(Object.keys(cells));
  }

  cellSetsSubscriber(msg, cellSets) {
    this.setState({ cellSets });
  }

  cellsSelectionSubscriber(msg, cellIds) {
    const { cellSets } = this.state;
    cellSets.setCurrentSet(cellIds, true);
  }

  render() {
    const { cellSets, gridResizeEvent } = this.state;
    const { datasetId, removeGridComponent } = this.props;
    return (
      <TitleInfo
        title="Sets"
        isScroll
        removeGridComponent={removeGridComponent}
      >
        <SetsManager
          setsTree={cellSets}
          datasetId={datasetId}
          setsType={setsType}
          onError={err => PubSub.publish(STATUS_WARN, err)}
          gridResizeEvent={gridResizeEvent}
        />
      </TitleInfo>
    );
  }
}
