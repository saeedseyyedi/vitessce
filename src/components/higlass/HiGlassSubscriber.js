import React, { useMemo, useEffect, useState, useRef } from "react";
import PubSub from 'pubsub-js';

import TitleInfo from '../TitleInfo';
import { HiGlassComponent } from "higlass";

import { CELL_SETS_MODIFY } from '../../events';

import hgViewConfig from "./viewconfig.json";

// Convert [r, g, b] color to hex color string.
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const hgOptionsBase = {
    bounded: true,
    pixelPreciseMarginPadding: true,
    containerPaddingX: 0,
    containerPaddingY: 0,
    sizeMode: 'default',
    theme: 'dark'
};

export default function HiGlassSubscriber(props) {
    const { 
        removeGridComponent,
        onReady
    } = props;

    const hgRef = useRef();
    const [clusterColors, setClusterColors] = useState({});

    // Subscribe to CELL_SETS_MODIFY event, which is fired when cell sets are imported
    // and when cell set colors are changed. 
    useEffect(() => {
        const cellsSetsModifyToken = PubSub.subscribe(CELL_SETS_MODIFY, (msg, cellSets) => {
            const rootChildren = cellSets.root.getDescendantsFlat(1);
            const kmeansNode = rootChildren[0];
            console.assert(kmeansNode.name === "k-means with 10 clusters");

            const clusterNodes = kmeansNode.getDescendantsFlat(0);
            const clusterColors = {};
            for(const node of clusterNodes) {
                clusterColors[node.name] = rgbToHex(node.color[0], node.color[1], node.color[2]);
            }
            setClusterColors(clusterColors);
        });

        return () => PubSub.unsubscribe(cellsSetsModifyToken);
    });

    // When the `clusterColors` dict changes, update the bar colors of the higlass
    // tracks.
    useEffect(() => {
        try {
            const vc = hgRef.current.api.getViewConfig();
            for(const track of vc.views[0].tracks.top) {
                if(clusterColors[track.options.name]) {
                    track.options.barFillColor = clusterColors[track.options.name];
                }
            }
            hgRef.current.api.setViewConfig(vc);
        } catch(e) {
            console.log(e);
        }
    }, [hgRef, clusterColors]);

    // Only render the HiGlassComponent once.
    const hgComponent = useMemo(() => {
        const hgOptions = {
            ...hgOptionsBase,
            onViewConfLoaded: onReady
        };

        return (
            <HiGlassComponent 
                ref={hgRef}
                viewConfig={hgViewConfig} 
                options={hgOptions}
                zoomFixed={false}
            />
        );
    }, [hgRef, onReady]);

    console.log("HiGlassSubscriber.render");
    return (
        <div className="v-higlass-title-wrapper">
            <TitleInfo
                title="HiGlass"
                removeGridComponent={removeGridComponent}
            >
                <div className="v-higlass-wrapper-parent">
                    <div className="v-higlass-wrapper">
                        {hgComponent}
                    </div>
                </div>
            </TitleInfo>
        </div>
    );
}