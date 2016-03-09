var margin = {
  top: 20,
  left: 40,
  bottom: 40,
  right: 20
};

var chart = document.getElementById('chart');
var loading = document.getElementById('loading');
var gender = document.getElementById('gender');
var metric = document.getElementById('metric');
var country = document.getElementById('country');
var scale = document.getElementById('scale');

d3.csv('IHME_GBD_2013_OBESITY_PREVALENCE_1990_2013_Y2014M10D08.CSV', function(csv) {
  loading.remove();

  var countryData = d3.nest()
    .key(function(d) { return d.location_name; })
    .sortKeys(d3.ascending)
    .entries(csv);

  // populate country select tag
  for (var i in countryData) {
    var option = document.createElement('option');
    option.text = countryData[i].key;
    option.value = countryData[i].key;
    country.add(option);
  }

  function initGraph() {
    var w = window.innerWidth - (margin.left + margin.right);
    var h = window.innerHeight - 2 * (margin.top + margin.bottom);

    // remove any prior visualization
    while (chart.firstChild) {
      chart.removeChild(chart.firstChild);
    }

    var data = d3.nest()
      .key(function(d) { return d.year; })
      .sortKeys(d3.ascending)
      .entries(csv);

    var meanArr = [];
    for (var i in data) { // for each year..
      meanArr.push(d3.mean(data[i].values.filter(function(d) {
        return d.sex == gender.value;
      }).filter(function(d) {
        if (metric.value == 'both') { return true; }
        return d.metric == metric.value;
      }).filter(function(d) {
        if (country.value == 'all') { return true; }
        return d.location_name == country.value;
      }).map(function(d) {
        return +d.mean; // find avg mean
      })));
    }

  // SVG container
  var svg = d3.select('#chart')
    .attr({
        'width': w + (margin.left + margin.right),
        'height': h + (margin.top + margin.bottom)
    })
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var x = d3.scale.ordinal().rangeRoundBands([0, w], 0.1)
    .domain(data.map(function(d) { return d.key; }));
  
  var domain = [];
  if (scale.value == 'relative') { domain = [d3.min(meanArr) - 0.01, d3.max(meanArr) + 0.01]; }
  if (scale.value == 'absolute') { domain = [0, 1]; }

  var y = d3.scale.linear()
    .range([h, 0])
    .domain(domain);

  // Axes
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(data.length);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(10, '%');

  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + h + ')')
    .call(xAxis)
    .append('text')
    .attr('x', w / 2)
    .attr('y', 2 * margin.top)
    .style('font-size', '14px')
    .style('text-anchor', 'middle')
    .text('Year');

  svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('font-size', '14px')
    .style('text-anchor', 'end')
    .text('Prevalence (Percentage)');

  // Bars
  svg.selectAll('bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function(d, i) { return x(d.key); })
    .attr('width', x.rangeBand())
    .attr('y', function(d, i) { return y(meanArr[i]); }) // y value of bar
    .attr('height', function(d, i) {return h - y(meanArr[i]); }); // bar height

  // Dynamic Title
  var genderText = gender.options[gender.selectedIndex].text;
  var metricText = metric.options[metric.selectedIndex].text;
  var countryText = country.options[country.selectedIndex].text;

  // Title
  svg.append('text')
    .attr('x', w / 2 )
    .attr('y', (margin.top / 2))
    .style('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('text-decoration', 'underline')
    .text('Average Prevalence of ' + metricText + ' ' + genderText + ' in ' + countryText + ' for Years 1990-2013');
  }

  // Event Listeners
  gender.addEventListener('change', function() {
    initGraph();
  });

  metric.addEventListener('change', function() {
    initGraph();
  });

  country.addEventListener('change', function() {
    initGraph();
  });

  scale.addEventListener('change', function() {
    initGraph();
  });

  initGraph();
});
