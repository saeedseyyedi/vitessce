import React from 'react';

import { LIGHT_CARD } from '../components/classNames';
import version from '../version.json';
import { getPreferredTheme } from '../components/utils';

function DatasetList(props) {
  const { configs } = props;
  const aClassName = 'list-group-item list-group-item-action flex-column align-items-start bg-secondary';
  const links = configs.map(
    ({ id, name, description }) => (
      <div className={aClassName} key={id}>
        <a
          href={`?dataset=${id}`}
          key={id}
        >
          <h5>{name}</h5>
          <p>{description}</p>
        </a>
        <a
          href={`?dataset=${id}&small`}
          style={{ fontSize: '75%' }}
        >
          {name} as component
        </a>
      </div>
    ),
  );
  return (
    <div className="list-group">
      {links}
    </div>
  );
}

function Form(props) {
  const { configs } = props;
  return (
    <form method="GET">
      <h1><span role="img" aria-label="fast train!">🚄 </span> Vitessce</h1>
      <div>Select a dataset:</div>
      <DatasetList configs={configs} />

      <br />
      <div>Or specify URL of configuration:</div>
      <div className="input-group mb-3">
        <input type="text" name="url" className="form-control" />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="submit">Load</button>
        </div>
      </div>
    </form>
  );
}

function Info() {
  return (
    <React.Fragment>
      <p>
        This is a demo of key concepts for a
        {
          'visual integration tool for exploration of spatial single cell experiments'.split(' ')
            .map(
              (word, i) => (['for', 'of'].includes(word)
              /* eslint-disable react/no-array-index-key */
                ? <span key={i}> {word}</span>
                : <span key={i}> <b>{word[0]}</b>{word.slice(1)}</span>),
              /* eslint-enable */
            )
        }.
        This demo focusses on scalable, linked visualizations that support both
        spatial and non-spatial representation of cell-level and molecule-level data.
      </p>
      <p>
        Vitessce is supported by the NIH Common Fund, through
        the <a href="https://commonfund.nih.gov/HuBMAP">Human BioMolecular Atlas Program (HuBMAP)</a>,
        Integration, Visualization & Engagement (HIVE) Initiative,
        RFA-RM-18-001.
      </p>
      <p>
        More information:
      </p>
      <ul>
        <li><a href="https://github.com/hubmapconsortium/vitessce">GitHub</a></li>
        <li><a href="https://www.npmjs.com/package/vitessce">NPM</a></li>
      </ul>
      <p>
        This deployment: branch={version.branch} | hash={version.hash} | date={version.date}
      </p>
    </React.Fragment>
  );
}

export default function Welcome(props) {
  const { configs } = props;
  const theme = getPreferredTheme();
  return (
    <div className={`vitessce-container vitessce-theme-${theme}`}>
      <div className="react-grid-layout container-fluid" style={{ height: '100vh' }}>
        <div className="row">
          <div className="welcome-col-left">
            <div className={LIGHT_CARD}>
              <Form configs={configs} />
            </div>
          </div>
          <div className="welcome-col-right">
            <div className={LIGHT_CARD}>
              <Info />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
