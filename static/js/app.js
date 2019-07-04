

function buildbarCharts(country) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/LifeExpectancy/${country}`;
  d3.json(url).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data

    var x_values = data.age;
    var y_values = data.year;
    // var m_size = data.age;
    // var m_colors = data.year; 
    var t_values = data.year;

    var trace1 = {
      x: x_values,
      y: y_values,
      name:country,
      text: t_values,
      type: 'bar',
      orientation: 'h',
      // mode: 'markers',
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
      // marker: {
        // color: 'rgba(255, 153, 51, 0, 6)',
        // width: 1
        // color: m_colors,
        // size: m_size
      // } 
    }
    var data = [trace1];

    var layout = {
      xaxis: { title: "Life Expectancy(total in years)"},
    };

     Plotly.newPlot('bar', data, layout);

  }

)};  
    

function buildlineCharts(country) {

    // @TODO: Use `d3S.json` to fetch the sample data for the plots
    var url = `/GDPGrowth/${country}`;    
    d3.json(url).then(function(data) {  

      var country = data.country;
      var year = data.year;
      var percent = data.percent  


      var trace2 = {
        type: "scatter",
        mode: "lines+markers",
        name: country,
        x: year,
        y: percent,
        line: {
          color: "#17BECF",
          width:3
        }
      }  
      var data = [trace2];
  
      var layout = {
        xaxis: {title: "GDP Growth(%)"},
        
      }; 
  
      Plotly.newPlot('scatter2', data, layout);
    }
  )};   

function buildCharts(country) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/TechExports/${country}`;    
    d3.json(url).then(function(data) {  
    
      var country = data.country;
      var year = data.year;
      var percent = data.percent  
    
    
      var trace3 = {
        type: "scatter",
        mode: "lines+markers",
        name: country,
        x: year,
        y: percent,
        line: {
          color: "#BECF17",
          width: 3
        }
      }  
      var data = [trace3];
    
      var layout = {
        xaxis: {title: "Tech Exports(% of Manufactured Exports"},
            
      };
    
      Plotly.newPlot('scatter', data, layout);
    }
    )};   


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of country names to populate the select options
  d3.json("/countries").then((countryNames) => {
    countryNames.forEach((country) => {
      selector
        .append("option")
        .text(country)
        .property("value", country);
    });

    // Use the first country from the list to build the initial plots
    const firstCountry = countryNames[0];
    buildbarCharts(firstCountry);
    buildlineCharts(firstCountry);
    buildCharts(firstCountry);
  });
}

function optionChanged(newCountry) {
  // Fetch new data each time a new sample is selected
  buildbarCharts(newCountry);
  buildlineCharts(newCountry);
  buildCharts(newCountry);
}

// Initialize the dashboard
init();
