function init() {
    var selector  = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        buildMetadata(sampleNames[0]);
        buildCharts(sampleNames[0]);

        sampleNames.forEach((sample) => {
            selector.append("option").text(sample).property("value", sample);
        });
    });
}

function optionChanged(newSample) {
    console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
  }

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        Object.entries(result).forEach(([key, value]) =>
            PANEL.append("h6").text(key.toUpperCase()+": "+value));
        
    });    
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        
        var sample_values = result.sample_values.slice(0, 10);
        var otu_ids =result.otu_ids.slice(0, 10).map(String);
        var otu_id_label = otu_ids.map(id => "OTU " + id);
        var hover_text = result.otu_labels.slice(0, 10);

        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var wfreq = result.wfreq;

        // horizontal bar chart
        var trace_bar= {
            x: sample_values,
            y: otu_id_label,
            name: hover_text,
            type: "bar",
            orientation: "h"    
        };

        var layout_bar= {
            title: "Top 10 Bacterial Species by OTU_ID",
            yaxis: {
                autorange:'reversed'
            }
        };

        // bubble chart
        var trace_bubble= {
            x: otu_ids,
            y: sample_values,
            text: hover_text,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids  
            }
        };
        
        var layout_bubble= {
            title: "Top 10 Bacterial Species",
            xaxis: {
                title: "OTU ID"
            }
        };

        // gauge
        var trace_gauge= {
            domain: { x: [0,1], y:[0,1]},
            value: wfreq,
            title: { text: "Belly Button Washing Frequency", font: {size: 20}},
            subtitle: { text: "Scrubs per Week", font: {size: 15}},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 9], tickwidth: 1},
                steps: [
                    { range: [0,1], color: "#ffffff"},
                    { range: [1,2], color: '#ffe6e6'},
                    { range: [2,3], color: '#ffcccc'},
                    { range: [3,4], color: '#ffb3b3'},
                    { range: [4,5], color: '#ff9999'},
                    { range: [5,6], color: '#ff8080'},
                    { range: [6,7], color: '#ff6666'},
                    { range: [7,8], color: '#ff4d4d'},
                    { range: [8,9], color: '#ff3333'}
                ],
                bar: { color: "darkblue"}
            }
        };

        Plotly.newPlot("bar", [trace_bar], layout_bar);
        Plotly.newPlot("bubble", [trace_bubble], layout_bubble);
        Plotly.newPlot("gauge", [trace_gauge]);
    });
}
init();