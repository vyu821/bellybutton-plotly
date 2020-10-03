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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allSamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = allSamples.filter(element => element.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSamples[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = filteredSamples.map(ids => ids.otu_ids)[0];
    var labels = filteredSamples.map(labels => labels.otu_labels)[0];
    var sampleVals = filteredSamples.map(sampleVals => sampleVals.sample_values)[0];
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = ids.sort(function(a,b){return b - a}).slice(0,11);
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sampleVals.sort(function(a,b){return b-a}).slice(0,11),
      y: yticks,
      text: labels.sort(function(a,b){return b-a}).slice(0,11),
      type: 'bar',
      orientation: 'h'
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 bacteria Cultures Found'
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: ids,
      y: sampleVals,
      text: labels,
      mode: 'markers',
      marker: {
        size: sampleVals,
        color: ids
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      hovermode: 'closest'
    };
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);

    sampleMeta = data.metadata.filter(element => element.id == sample)[0];
    sampleWfreq = sampleMeta.wfreq
    // 4. Create the trace for the gauge chart.
    var gaugeData = {
      domain: { x: [0, 1], y: [0, 1] },
      value: sampleWfreq,
      type: 'indicator',
      mode: 'gauge+number'
    };
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}


