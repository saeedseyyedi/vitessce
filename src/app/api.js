import Ajv from 'ajv';

import datasetSchema from '../schemas/dataset.schema.json';

// Exported because used by the cypress tests: They route API requests to the fixtures instead.
export const urlPrefix = 'https://s3.amazonaws.com/vitessce-data/0.0.25/master_release';

function makeLayerNameToConfig(datasetPrefix) {
  return name => ({
    name,
    type: name.toUpperCase(),
    url: `${urlPrefix}/${datasetPrefix}/${datasetPrefix}.${name}.json`,
  });
}

const linnarssonLayerNames = [
  'cells',
  'clusters',
  'factors',
  'genes',
  'raster',
  'molecules',
  'neighborhoods',
];
const linnarssonDescription = 'Spatial organization of the somatosensory cortex revealed by cyclic smFISH';
const linnarssonBase = {
  description: linnarssonDescription,
  layers: linnarssonLayerNames
    .map(makeLayerNameToConfig('linnarsson')),
};
const linnarssonBaseNoClusters = {
  description: linnarssonDescription,
  layers: linnarssonLayerNames.filter(name => name !== 'clusters')
    .map(makeLayerNameToConfig('linnarsson')),
};

const driesDescription = 'Giotto, a pipeline for integrative analysis and visualization of single-cell spatial transcriptomic data';
const driesBase = {
  description: driesDescription,
  layers: [
    'cells',
    'factors',
  ].map(makeLayerNameToConfig('dries')),
};

const wangDescription = 'Multiplexed imaging of high-density libraries of RNAs with MERFISH and expansion microscopy';
const wangBase = {
  description: wangDescription,
  layers: [
    'cells',
    'molecules',
    'genes',
  ].map(makeLayerNameToConfig('wang')),
};

const vanderbiltDescription = 'High Bit Depth (uint16) Multiplex Immunofluorescence Imaging';
const vanderbiltBase = {
  description: vanderbiltDescription,
  layers: [
    {
      name: 'raster',
      type: 'RASTER',
      url: 'https://keller-mark.github.io/temp-vitessce-cell-sets/test_tiff.raster.json',
    },
  ],
};

/* eslint-disable object-property-newline */
/* eslint-disable object-curly-newline */
const configs = {
  'just-scatter': {
    public: false,
    layers: [
      {
        name: 'cells',
        type: 'CELLS',
        url: `${urlPrefix}/linnarsson/linnarsson.cells.json`,
        requestInit: {
          // Where the client checks that the value is from an enumeration,
          // I've chosen one of the allowed values,
          // but nothing on our S3 actually needs any of these.
          method: 'GET',
          headers: { 'x-foo': 'FAKE' },
          mode: 'cors',
          credentials: 'omit',
          cache: 'no-store',
          redirect: 'error',
          referrer: 'FAKE',
          integrity: 'FAKE',
        },
      },
    ],
    name: 'Linnarsson, just scatterplot',
    staticLayout: [
      {
        component: 'scatterplot',
        props: {
          mapping: 't-SNE',
          view: {
            zoom: 0.75,
            target: [0, 0, 0],
          },
        },
        x: 0, y: 0, w: 12, h: 2,
      },
    ],
  },
  'just-scatter-expression': {
    public: false,
    layers: [
      {
        name: 'cells',
        type: 'CELLS',
        url: 'https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.cells.json',
      },
      {
        name: 'genes',
        type: 'GENES',
        url: 'https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.genes.json',
      },
    ],
    name: 'Linnarsson, just scatterplot and expression',
    staticLayout: [
      {
        component: 'scatterplot',
        props: {
          mapping: 't-SNE',
          view: {
            zoom: 0.75,
            target: [0, 0, 0],
          },
        },
        x: 0, y: 0, w: 8, h: 2,
      },
      {
        component: 'genes',
        x: 8, y: 2, w: 4, h: 2,
      },
    ],
  },
  'linnarsson-2018': {
    ...linnarssonBase,
    name: 'Linnarsson',
    public: true,
    staticLayout: [
      { component: 'description',
        props: {
          description: `Linnarsson: ${linnarssonDescription}`,
        },
        x: 0, y: 0, w: 2, h: 2 },
      { component: 'layerController',
        x: 0, y: 2, w: 2, h: 3,
      },
      { component: 'status',
        x: 0, y: 5, w: 2, h: 1 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -5.5,
            target: [16000, 20000, 0],
          },
        },
        x: 2, y: 0, w: 4, h: 4 },
      { component: 'scatterplot',
        props: {
          mapping: 'PCA',
          // This intentionally does not have a  "view" prop,
          // in order to have an example that uses the default.
        },
        x: 6, y: 0, w: 3, h: 2 },
      { component: 'scatterplot',
        props: {
          mapping: 't-SNE',
          view: {
            zoom: 0.75,
            target: [0, 0, 0],
          },
        },
        x: 6, y: 2, w: 3, h: 2 },
      { component: 'factors',
        x: 9, y: 0, w: 2, h: 2 },
      { component: 'genes',
        x: 11, y: 2, w: 1, h: 2 },
      { component: 'cellSets',
        props: {
          datasetId: 'linnarsson-2018',
        },
        x: 9, y: 3, w: 3, h: 2 },
      { component: 'heatmap',
        x: 2, y: 4, w: 10, h: 2 },
    ],
  },
  'linnarsson-2018-two-spatial': {
    ...linnarssonBase,
    name: 'Linnarsson (two spatial)',
    staticLayout: [
      { component: 'spatial',
        props: {
          view: {
            zoom: -8,
            target: [18000, 18000, 0],
          },
        },
        x: 0, y: 0, w: 5, h: 2 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 2, w: 5, h: 2 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -6,
            target: [18000, 18000, 0],
          },
        },
        x: 5, y: 0, w: 5, h: 2 },
      { component: 'scatterplot',
        props: { mapping: 'PCA' },
        x: 5, y: 2, w: 5, h: 2 },
      { component: 'factors',
        x: 10, y: 0, w: 2, h: 2 },
      { component: 'genes',
        x: 10, y: 2, w: 2, h: 2 },
      { component: 'heatmap',
        x: 0, y: 4, w: 12 },
    ],
  },
  'linnarsson-2018-just-spatial': {
    ...linnarssonBaseNoClusters,
    name: 'Linnarsson (just spatial)',
    staticLayout: [
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 0, y: 0, w: 10, h: 2 },
      { component: 'factors',
        x: 10, y: 0, w: 2, h: 1 },
      { component: 'genes',
        x: 10, y: 1, w: 2, h: 1 },
    ],
  },
  'linnarsson-2018-static': {
    ...linnarssonBase,
    name: 'Linnarsson (static layout)',
    staticLayout: [
      { component: 'description',
        props: {
          description: `Linnarsson (static layout): ${linnarssonDescription}`,
        },
        x: 0, y: 0, w: 3, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 2, w: 3, h: 2 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 3, y: 0, w: 6, h: 4 },
      { component: 'factors',
        x: 9, y: 0, w: 3, h: 2 },
      { component: 'genes',
        x: 9, y: 2, w: 3, h: 2 },
      { component: 'heatmap',
        x: 0, y: 4, w: 12, h: 1 },
    ],
  },
  'linnarsson-2018-dozen': {
    ...linnarssonBase,
    name: 'Linnarsson (static layout, redundant components for performance testing)',
    staticLayout: [
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 0, y: 0, w: 4, h: 1 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 0, y: 1, w: 4, h: 1 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 4, y: 0, w: 4, h: 1 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 4, y: 1, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 2, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 3, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 4, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 5, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 'PCA' },
        x: 4, y: 2, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 'PCA' },
        x: 4, y: 3, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 'PCA' },
        x: 4, y: 4, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 'PCA' },
        x: 4, y: 5, w: 4, h: 1 },
      { component: 'factors',
        x: 8, y: 0, w: 4, h: 2 },
      { component: 'genes',
        x: 8, y: 2, w: 4, h: 2 },
      { component: 'heatmap',
        x: 8, y: 4, w: 4, h: 2 },
    ],
  },
  'dries-2019': {
    ...driesBase,
    name: 'Dries',
    public: true,
    staticLayout: [
      { component: 'description',
        props: {
          description: driesDescription,
        },
        x: 0, y: 0, w: 5, h: 2 },
      { component: 'status',
        x: 0, y: 1, w: 5, h: 2 },
      { component: 'scatterplot',
        props: {
          mapping: 't-SNE',
          view: {
            zoom: 3,
            target: [0, 0, 0],
          },
        },
        x: 0, y: 2, w: 5, h: 4 },
      { component: 'spatial',
        props: {
          cellRadius: 50,
          view: {
            zoom: -4.4,
            target: [3800, -900, 0],
          },
        },
        x: 5, y: 0, w: 5, h: 4 },
      { component: 'scatterplot',
        props: {
          mapping: 'UMAP',
          view: {
            zoom: 3,
            target: [0, 0, 0],
          },
        },
        x: 5, y: 4, w: 5, h: 4 },
      { component: 'factors',
        x: 10, y: 0, w: 2, h: 8 },
    ],
  },
  'wang-2019': {
    ...wangBase,
    name: 'Wang',
    public: true,
    staticLayout: [
      { component: 'spatial',
        props: {
          view: {
            zoom: -1,
            target: [0, 0, 0],
          },
          moleculeRadius: 2,
        },
        x: 0, y: 0, w: 10, h: 2 },
      { component: 'genes',
        x: 10, y: 0, w: 2, h: 2 },
    ],
  },

  vanderbilt: {
    ...vanderbiltBase,
    name: 'Spraggins',
    public: true,
    staticLayout: [
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [20000, 20000, 0],
          },
        },
        x: 0, y: 0, w: 9, h: 2 },
      { component: 'layerController',
        x: 9, y: 0, w: 3, h: 1,
      },
      { component: 'description',
        x: 9, y: 1, w: 3, h: 1,
      },
    ],
  },
  'just-higlass': {
    public: false,
    layers: [],
    name: 'HiGlass demo',
    staticLayout: [
      {
        component: 'higlass',
        props: {
          hgViewConfig: {
            editable: false,
            zoomFixed: false,
            trackSourceServers: [
              '//higlass.io/api/v1',
              'https://resgen.io/api/v1/gt/paper-data',
            ],
            exportViewUrl: '/api/v1/viewconfs',
            views: [
              {
                uid: 'aa',
                initialXDomain: [
                  0,
                  3100000000,
                ],
                autocompleteSource: '/api/v1/suggest/?d=OHJakQICQD6gTD7skx4EWA&',
                genomePositionSearchBox: {
                  autocompleteServer: '//higlass.io/api/v1',
                  autocompleteId: 'OHJakQICQD6gTD7skx4EWA',
                  chromInfoServer: '//higlass.io/api/v1',
                  chromInfoId: 'hg19',
                  visible: true,
                },
                chromInfoPath: '//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv',
                tracks: {
                  top: [
                    {
                      type: 'horizontal-gene-annotations',
                      height: 60,
                      tilesetUid: 'OHJakQICQD6gTD7skx4EWA',
                      server: '//higlass.io/api/v1',
                      uid: 'OHJakQICQD6gTD7skx4EWA',
                      options: {
                        name: 'Gene Annotations (hg19)',
                        fontSize: 10,
                        labelPosition: 'hidden',
                        labelLeftMargin: 0,
                        labelRightMargin: 0,
                        labelTopMargin: 0,
                        labelBottomMargin: 0,
                        minHeight: 24,
                        geneAnnotationHeight: 16,
                        geneLabelPosition: 'outside',
                        geneStrandSpacing: 4,
                        showMousePosition: true,
                        mousePositionColor: '#ff00ff',
                        plusStrandColor: '#fdff54',
                        minusStrandColor: '#68bf30',
                        labelColor: 'black',
                        trackBorderWidth: 0,
                        trackBorderColor: 'black',
                      },
                    },
                    {
                      chromInfoPath: '//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv',
                      type: 'horizontal-chromosome-labels',
                      height: 30,
                      uid: 'X4e_1DKiQHmyghDa6lLMVA',
                      options: {
                        color: '#808080',
                        stroke: 'black',
                        fontSize: 12,
                        fontIsLeftAligned: false,
                        showMousePosition: true,
                        mousePositionColor: '#ff00ff',
                      },
                    },
                  ],
                  left: [
                    {
                      type: 'vertical-gene-annotations',
                      width: 60,
                      tilesetUid: 'OHJakQICQD6gTD7skx4EWA',
                      server: '//higlass.io/api/v1',
                      options: {
                        labelPosition: 'bottomRight',
                        name: 'Gene Annotations (hg19)',
                        fontSize: 10,
                        labelLeftMargin: 0,
                        labelRightMargin: 0,
                        labelTopMargin: 0,
                        labelBottomMargin: 0,
                        minWidth: 24,
                        geneAnnotationHeight: 16,
                        geneLabelPosition: 'outside',
                        geneStrandSpacing: 4,
                        showMousePosition: true,
                        mousePositionColor: '#ff00ff',
                        plusStrandColor: '#fdff54',
                        minusStrandColor: '#68bf30',
                        labelColor: 'black',
                        trackBorderWidth: 0,
                        trackBorderColor: 'black',
                      },
                      uid: 'dqBTMH78Rn6DeSyDBoAEXw',
                    },
                    {
                      chromInfoPath: '//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv',
                      type: 'vertical-chromosome-labels',
                      width: 30,
                      uid: 'RHdQK4IRQ7yJeDmKWb7Pcg',
                      options: {
                        color: '#777777',
                        stroke: 'black',
                        fontSize: 12,
                        fontIsLeftAligned: false,
                        minWidth: 35,
                        showMousePosition: true,
                        mousePositionColor: '#ff00ff',
                      },
                    },
                  ],
                  center: [
                    {
                      uid: 'c1',
                      type: 'combined',
                      height: 600,
                      contents: [
                        {
                          server: '//higlass.io/api/v1',
                          tilesetUid: 'CQMd6V_cRw6iCI_-Unl3PQ',
                          type: 'heatmap',
                          options: {
                            maxZoom: null,
                            labelPosition: 'bottomRight',
                            name: 'Rao et al. (2014) GM12878 MboI (allreps) 1kb',
                            backgroundColor: 'black',
                            labelLeftMargin: 0,
                            labelRightMargin: 0,
                            labelTopMargin: 0,
                            labelBottomMargin: 0,
                            labelShowResolution: true,
                            labelShowAssembly: true,
                            labelColor: '#ffffff',
                            labelTextOpacity: 0.5,
                            labelBackgroundColor: 'black',
                            labelBackgroundOpacity: 0.01,
                            colorRange: [
                              '#000000',
                              '#222e54',
                              '#448db2',
                              '#68bf30',
                              '#fdff54',
                              '#FFFFFF',
                            ],
                            colorbarBackgroundColor: 'black',
                            colorbarBackgroundOpacity: 0.01,
                            colorbarPosition: 'topRight',
                            trackBorderWidth: 0,
                            trackBorderColor: 'black',
                            heatmapValueScaling: 'log',
                            showMousePosition: true,
                            mousePositionColor: '#ff00ff',
                            showTooltip: false,
                            extent: 'full',
                            zeroValueColor: null,
                            scaleStartPercent: '0.00000',
                            scaleEndPercent: '1.00000',
                          },
                          height: 500,
                          uid: 'GjuZed1ySGW1IzZZqFB9BA',
                          transforms: [
                            {
                              name: 'ICE',
                              value: 'weight',
                            },
                          ],
                        },
                      ],
                      options: {},
                    },
                  ],
                  right: [],
                  bottom: [],
                  whole: [],
                  gallery: [],
                },
                layout: {
                  w: 12,
                  h: 12,
                  x: 0,
                  y: 0,
                  moved: false,
                  static: false,
                },
                initialYDomain: [
                  496325459.31758535,
                  2603674540.682415,
                ],
              },
            ],
            zoomLocks: {
              locksByViewUid: {},
              locksDict: {},
            },
            locationLocks: {
              locksByViewUid: {},
              locksDict: {},
            },
            valueScaleLocks: {
              locksByViewUid: {},
              locksDict: {},
            },
          },
        },
        x: 0, y: 0, w: 8, h: 2,
      },
      { component: 'description',
        props: {
          description: 'IMR90 cells profiled using dilution HiC as described in Rao et al (2014).',
        },
        x: 8, y: 0, w: 4, h: 2 },
    ],
  },
};
/* eslint-enable */

export function listConfigs(showAll) {
  return Object.entries(configs).filter(
    entry => showAll || entry[1].public,
  ).map(
    ([id, config]) => ({
      id,
      name: config.name,
      description: config.description,
    }),
  );
}

export function getConfig(id) {
  const datasetConfig = configs[id];
  const validate = new Ajv().compile(datasetSchema);
  const valid = validate(datasetConfig);
  if (!valid) {
    const failureReason = JSON.stringify(validate.errors, null, 2);
    console.warn('dataset validation failed', failureReason);
  }
  return datasetConfig;
}
