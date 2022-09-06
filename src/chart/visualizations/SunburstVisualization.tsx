import React from 'react'
import { ResponsiveSunburst  } from '@nivo/sunburst'
import { ExtendedChartReportProps } from './VisualizationProps'
import { checkResultKeys,  mutateName, processHierarchyFromRecords, findObject, flatten } from './Utils'
import { useState } from 'react'
import { Tooltip } from '@material-ui/core'
import { HeroIcon, IconButton } from '@neo4j-ndl/react'

export default function SunburstVisualization(props: ExtendedChartReportProps) {
    const { records, first } = props

    if (!first) {
        return <p>Loading data...</p>
    }

    const error = checkResultKeys(first, ['index', 'key', 'value'])

    if (error !== false) {
        return <p>{error.message}</p>
    }

    const dataPre = processHierarchyFromRecords(records);
    dataPre.forEach(currentNode => mutateName(currentNode));

    // Where a user give us the hierarchy with a common root, in that case we can push the entire tree.
    // Where a user give us just the tree starting one hop away from the root. 
    // as Nivo needs a common root, so in that case, we create it for them.
    const commonProperties = { data : dataPre.length == 1 ? dataPre[0] : {name : "Total", children : dataPre}};

    const [data, setData] = useState(commonProperties.data);
    const [refreshable, setRefreshable] = useState(false);
    const settings = (props.settings) ? props.settings : {};
    const legendHeight = 20;
    const marginRight = (settings["marginRight"]) ? settings["marginRight"] : 24;
    const marginLeft = (settings["marginLeft"]) ? settings["marginLeft"] : 24;
    const marginTop = (settings["marginTop"]) ? settings["marginTop"] : 24;
    const marginBottom = (settings["marginBottom"]) ? settings["marginBottom"] : 40;
    const enableArcLabels = (settings["enableArcLabels"] !== undefined) ? settings["enableArcLabels"] : true;
    const interactive = (settings["interactive"]) ? settings["interactive"] : true;
    const borderWidth = (settings["borderWidth"]) ? settings["borderWidth"] : 0;
    const legend = (settings["legend"]) ? settings["legend"] : false;
    const arcLabelsSkipAngle = (settings["arcLabelsSkipAngle"]) ? settings["arcLabelsSkipAngle"] : 10;
    const cornerRadius = (settings["cornerRadius"]) ? settings["cornerRadius"] : 3;
    const colorScheme = (settings["colors"]) ? settings["colors"] : 'nivo';

    return (
        <>
            <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
                {refreshable ? 
                    <IconButton
                        aria-label="reset"
                        buttonSize="small"
                        clean
                        style={{ bottom: 12, right: 12, position: "absolute", zIndex: 5 }}>
                        <Tooltip title="Reset" aria-label="reset">
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="RefreshIcon"
                                onClick={() => {setData(commonProperties.data); setRefreshable(false);}}/>
                        </Tooltip>
                    </IconButton> : <div></div>
                }
                <ResponsiveSunburst
                    {...commonProperties}
                    id="name"
                    value="loc"
                    data={data}
                    transitionMode={"pushIn"}
                    isInteractive={interactive}
                    onClick={clickedData => {
                        const foundObject = findObject(flatten(data.children), clickedData.id)
                        if (foundObject && foundObject.children) {
                            setData(foundObject);
                            setRefreshable(true);
                        }
                    }}
                    enableArcLabels={enableArcLabels}
                    borderWidth={borderWidth}
                    cornerRadius={cornerRadius}
                    margin={{
                        top: marginTop,
                        right: marginRight,
                        bottom: (legend) ? legendHeight + marginBottom : marginBottom,
                        left: marginLeft
                    }}
                    childColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'brighter',
                                0.4
                            ]
                        ]
                    }}
                    animate={true}
                    arcLabelsSkipAngle={arcLabelsSkipAngle}
                    colors={{ scheme: colorScheme }}
                />
            </div>
        </>)
}