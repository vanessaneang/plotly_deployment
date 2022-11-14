function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var filterSample = sampleArray.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var resultSample = filterSample[0]; 

    // 2. Create a variable that holds the first sample in the metadata array.
    
    var resultMetadata = metadataArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleotuIds = resultSample.otu_ids
    var sampleotuLabels = resultSample.otu_labels
    var sampleValues = resultSample.sample_values

    // 3. Create a variable that holds the washing frequency.
    var wfreq = resultMetadata.wfreq
    // Create the yticks for the bar chart.
    var yticks = sampleotuIds.map(sampleId => "OTU " + sampleId.toString()).slice(0,10).reverse();
    // Use Plotly to plot the bar data and layout.
    var trace = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      barThickness: 20,
      text: sampleotuLabels.slice(0,10).reverse(),
      orientation: "h" 
    };
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    Plotly.newPlot("bar-plot", barData, barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    // Create the trace for the bubble chart.
    var trace2 = {
      x: sampleotuIds,
      y: sampleValues,
      text: sampleotuLabels,
      mode: 'markers',
      marker: {
            color: sampleotuIds,
            size: sampleValues,
          }
        };
    
    var bubbleData = [trace2];
    
        // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 500,
      width: 1200,
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
   

    // 4. Create the trace for the gauge chart.
    var trace3 = {
      domain: { x: [0,1], y: [0,1]},
      title: {text: "Belly Button Washing Frequency"},
      value: wfreq,
      type: "indicator",
      mode:"gauge+number",
      gauge: {
        axis: { range: [null, 10]},
        bar: { color: "black" },
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
      }

    };
    var gaugeData = [trace3];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 450,
      margin: {t:0, b:0}
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData, gaugeLayout);
  });
}

