
var width = 960,
    height = 600;

var projection = d3.geo.albersUsa()
  .scale(1240)
    .translate([width / 2, height / 2]);

var color = d3.scale.category20();

var path = d3.geo.path()
    .projection(null);

var svg = d3.select("#graph");

var g = svg.append('g')

// Add in the functions that generate the correct data
function get_newdata(start_year, end_year, team, initData) {
  
   // Use the sliding variables to flatten out the data and create a workable index
   //var index = Number(year) - 2009

   restructuredData = [];
   for (i = 0; i < initData.length; i++) {

      season = parseInt(initData[i].Season)
      string = initData[i]['coordinates']
      squad = initData[i].Team
      
      // Correct the coordinates if they are in string format for whatever reason
      if (typeof(string) === 'string') {
        x = string.replace("\"", "").split(': ')
        initData[i]['coordinates'] = {'latitude': parseInt(x[1].split(',')[0]),
                                      'longitude': parseInt(x[2].split('}')[0])}
      }

      if (season >= start_year && season <= end_year && squad == team) {
          restructuredData[i] = {'City': initData[i].City,
                      'Name': initData[i].Name,
                      'latitude': parseFloat(initData[i]['coordinates']['latitude']),
                      'longitude': parseFloat(initData[i]['coordinates']['longitude']),
                      'Hometown': initData[i].Hometown_adj,
                      'High School': initData[i]['High School'],
                      'Team': initData[i].Team,
                      'Season': initData[i].Season
                      };
      }
      else {
          restructuredData[i] = {'City': initData[i].City,
                      'Name': initData[i].Name,
                      'latitude': null,
                      'longitude': null,
                      'Hometown': initData[i].Hometown_adj,
                      'High School': initData[i]['High School'],
                      'Team': initData[i].Team,
                      'Season': initData[i].Season
                      }; 
      }
    }
    return restructuredData 
};

d3.json("https://cdn.rawgit.com/harvard-crimson/harvard-athletes-geography/f4dd4d68f484823f2667a8d8d03acada1a07c2a3/us.json", function(error, us) {
  if (error) return console.error(error);

  svg.append("path")
      .datum(topojson.feature(us, us.objects.nation))
      .attr("class", "land")
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "border border--state")
      .attr("d", path);


   d3.json("https://cdn.rawgit.com/harvard-crimson/harvard-athletes-geography/f4dd4d68f484823f2667a8d8d03acada1a07c2a3/data-ii.json", function(error, data) {

        // Set the initial base times
        start_time = 1970
        end_time = 2014
        line1_time = 1970
        line2_time = 2014
        cur_sport = "mbkb"

        initData = Array.prototype.slice.call(data)
        data = get_newdata(start_time, end_time, cur_sport, initData)

        // Register when the sort button is changed
        d3.selectAll("#sport_type").on("change", function() {

            // Update stuff and get new data
            cur_sport = this.value
            yeardata = get_newdata(start_time, end_time, cur_sport, initData)

            // Reupdate all the shit accordingly
            var node = svg.selectAll(".node")
                          .data(yeardata)
                        .enter()
                        .append("g")
                          .attr("class", "node")

              var circle = node
                          .append("circle")
                          .attr("r", 6)

              // Generate the force layout
              var force = d3.layout.force()
                  .size([width, height])
                  .charge(-60)
                  .linkDistance(300)
                  .on("tick", tick)

              // Project the data points onto the actual map itself
              yeardata.forEach (function(d,i) {
                if (d.latitude != null && d.longitude != null && d.latitude != undefined && d.longitude != undefined) {
                  if (projection([d.longitude, d.latitude]) != null) {
                    d.x = projection([d.longitude, d.latitude])[0]
                    d.y = projection([d.longitude, d.latitude])[1]
                  }
                  else {
                    d.x = 10000
                    d.y = 10000
                  }
                }
                else {
                  d.x = 10000
                  d.y = 10000
                }
              })

              // Update the graph with new node values
              graph_update(0)
        });

                // Note the changes within the slider
        d3.selectAll("#endpoint1").on("input", function() {

            // Update the base time 
            line1_time = this.value;

            // Update the relevant inputs
            start_time = d3.min([line1_time, line2_time])
            end_time = d3.max([line1_time, line2_time])

            yeardata = get_newdata(start_time, end_time, cur_sport, initData)

            // Use the same code as below to entirely recreate graph

            // Create the nodes that will represent any of the given countries
            var node = svg.selectAll(".node")
                          .data(yeardata)
                        .enter()
                        .append("g")
                          .attr("class", "node")

              var circle = node
                          .append("circle")
                          .attr("r", 6)

              // Generate the force layout
              var force = d3.layout.force()
                  .size([width, height])
                  .charge(-60)
                  .linkDistance(300)
                  .on("tick", tick)

              // Project the data points onto the actual map itself
              yeardata.forEach (function(d,i) {
                if (d.latitude != null && d.longitude != null && d.latitude != undefined && d.longitude != undefined) {
                  if (projection([d.longitude, d.latitude]) != null) {
                    d.x = projection([d.longitude, d.latitude])[0]
                    d.y = projection([d.longitude, d.latitude])[1]
                  }
                  else {
                    d.x = 10000
                    d.y = 10000
                  }
                }
                else {
                  d.x = 10000
                  d.y = 10000
                }
              })

              // Update the graph with new node values
              graph_update(0)
          })

        // Note the changes within the slider
        d3.selectAll("#endpoint2").on("input", function() {

            // Update the base time 
            line2_time = this.value;

            // Update the relevant inputs
            start_time = d3.min([line1_time, line2_time])
            end_time = d3.max([line1_time, line2_time])

            yeardata = get_newdata(start_time, end_time, cur_sport, initData)

            // Use the same code as below to entirely recreate graph

            // Create the nodes that will represent any of the given countries
            var node = svg.selectAll(".node")
                          .data(yeardata)
                        .enter()
                        .append("g")
                          .attr("class", "node")

              var circle = node
                          .append("circle")
                          .attr("r", 6)

              // Generate the force layout
              var force = d3.layout.force()
                  .size([width, height])
                  .charge(-60)
                  .linkDistance(300)
                  .on("tick", tick)

              // Project the data points onto the actual map itself
              yeardata.forEach (function(d,i) {
                if (d.latitude != null && d.longitude != null && d.latitude != undefined && d.longitude != undefined) {
                  if (projection([d.longitude, d.latitude]) != null) {
                    d.x = projection([d.longitude, d.latitude])[0]
                    d.y = projection([d.longitude, d.latitude])[1]
                  }
                  else {
                    d.x = 10000
                    d.y = 10000
                  }
                }
                else {
                  d.x = 10000
                  d.y = 10000
                }
              })

              // Update the graph with new node values
              graph_update(0)
          })

        var node = svg.selectAll(".node")
                    .data(data)
                   .enter()
                        .append("g")
                          .attr("class", "node")

                  //      .on('mouseover', function(d) {
                  //        tip.show
                 //         d3.selectAll('.node')
                   //     .style('opacity', 0.02)
                   //   d3.select(this)
                   //     .style('opacity',1)
                   //          .select("circle")
                   //           .attr('r', 15)
                   //      d3.select(this)
                   //     .append("svg:text")
                   //       .text('DOES THIS WORK')
                   //  })
                   //  .on('mouseover', tip.show)
                   //  .on('mouseout', function(d) {
                   //   tip.hide
                   //   d3.selectAll('.node')
                   //     .style('opacity', 1)
                   //     .select('circle')
                   //       .attr('r',6)
                   //  })
                   //  .on('mouseout', tip.hide)
                 //   .attr('id', function(d) {
                  //  return 'personid' + d.Name;
                  // })

        var circle = node
                    .append("circle")
                    .attr("r", 6)

        // Generate the force layout
        var force = d3.layout.force()
            .size([width, height])
            .charge(-60)
            .linkDistance(300)
            .on("tick", tick)

        function tick(e) {
          graph_update(0);
        }

        // Restart the node layout
        force.nodes(data)
          .start();

        // Stop the particles from moving 
        force.stop();

        // Establish the function that will update the graph for the tick
        function graph_update(duration) {

            node.transition().duration(duration)
                .attr("transform", function(d) { 
                  return "translate("+d.x+","+d.y+")"; 
                });

            d3.select("#startTime")
              .text(start_time)

            d3.select("#endTime")
              .text(end_time)

            d3.select("#sport").text(cur_sport == "mbkb" ? "Basketball" : "Football");
        }

        // Grab latitude and longitude scatterplot to overlay
        function longlat_scat () {

          // Project the data points onto the actual map itself
          data.forEach (function(d,i) {
            if (d.latitude != null && d.longitude != null && d.latitude != undefined && d.longitude != undefined) {
              if (projection([d.longitude, d.latitude]) != null) {
                d.x = projection([d.longitude, d.latitude])[0]
                d.y = projection([d.longitude, d.latitude])[1]
              }
              else {
                d.x = 1000
                d.y = 1000
              }
            }
            else {              
              d.x = 1000
              d.y = 1000
            }
          })

          // Update the graph with new node values
          graph_update(10)
        }

        longlat_scat()
   })
});

