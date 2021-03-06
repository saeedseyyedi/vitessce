import React from 'react';
import TitleInfo from '../TitleInfo';

export default function Status(props) {
  const warnClass = 'alert alert-warning my-0 details';
  const { info, warn, removeGridComponent } = props;
  const messages = [];
  if (info) {
    messages.push(<p className="details" key="info">{info}</p>);
  }
  if (warn) {
    console.warn(warn);
    messages.push(<p className={warnClass} key="warn">{warn}</p>);
  }
  return (
    <TitleInfo title="Status" removeGridComponent={removeGridComponent} isScroll>
      {messages}
    </TitleInfo>
  );
}
