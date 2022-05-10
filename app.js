function assignment6(){
    var filePath="data.csv";
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
}
var rowConverter = function(d){
    for (n in d){
        if (isNaN(parseFloat(d[n])) == false){
            d[n] = parseFloat(d[n]);
        } else{
            continue;
        }
        
    }
    return d
}

function unroll(rollup, keys, label = "value", p = {}) {
    return Array.from(rollup, ([key, value]) => 
      value instanceof Map 
        ? unroll(value, keys.slice(1), label, Object.assign({}, { ...p, [keys[0]]: key } ))
        : Object.assign({}, { ...p, [keys[0]]: key, [label] : value })
    ).flat();
  }
  
var question0=function(filePath){
    d3.csv(filePath).then(function(data){
        // console.log(data);
    });
}

var question1=function(filePath){


    d3.csv(filePath, rowConverter).then(function(data){
        
        data = data.filter(function (d) {
            return d.Year >= 1980;
        });
        

        var groups = d3.group(data, d => d.Sex);
        var male = d3.rollup(groups.get('M'), v => v.length, d => d.Year);
        var female = d3.rollup(groups.get('F'), v => v.length, d => d.Year);

        let xScale = d3.scaleBand().domain(Array.from(male.keys()).sort()).range([100, 950]);
        let yScale = d3.scaleLinear().domain([0, d3.max([d3.max(female.values()), d3.max(male.values())])]).range([450,100]);
 
        var svg_q1 = d3.select('#q1_plot').append('svg')
            .attr('width', '1000')
            .attr('height', '500');

        svg_q1.selectAll('Male').data(male.keys()).enter().append('circle')
            .attr('r', 3)
            .attr('cx', function(d){return xScale(d)})
            .attr('cy', function(d){return yScale(male.get(d))})
            .style('fill', 'blue');

        svg_q1.selectAll('Female').data(female.keys()).enter().append('circle')
            .attr('r', 3)
            .attr('cx', function(d){return xScale(d)})
            .attr('cy', function(d){return yScale(female.get(d))})
            .style('fill', 'green');


        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);

        svg_q1.append('g').call(xAxis)
            .attr('class', 'xAxis')
            .attr('transform', 'translate(-42.5,450)');
        svg_q1.append('g').call(yAxis)
            .attr('class', 'yAxis')
            .attr('transform', 'translate(57.5,0)');
    });
   
      
}


var question2=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){  
        data = data.filter(function (d) {
            return d.Year > 1990;
        });
        data = data.filter(function (d) {
            return (d.Team == 'Russia' || d.Team == 'China' || d.Team == 'USA');
        });
        const keys = ['Gold', 'Silver', 'Bronze'];
        const colors = ['gold', 'silver', 'brown'];
        const countries = ['USA', 'China', 'Russia'];

        var rolled = d3.rollup(data, v => v.length, d => d.Team, d => d.Medal);
        var unrolled = unroll(rolled, ["Team", "Medal"], "count");

        var dataFinal = []
        dataFinal.push({Team : 'USA', Gold: unrolled[4]['count'], Silver: unrolled[3]['count'], Bronze: unrolled[5]['count']}) 
        dataFinal.push({Team : 'China', Gold: unrolled[8]['count'], Silver: unrolled[6]['count'], Bronze: unrolled[7]['count']}) 
        dataFinal.push({Team : 'Russia', Gold: unrolled[2]['count'], Silver: unrolled[0]['count'], Bronze: unrolled[1]['count']})
       
        var series =  d3.stack().keys(keys);
		var stack = series(dataFinal);

        var svgheight = 700;
		var svgwidth = 500;
		var padding = 40;

		var svg_q2 = d3.select("#q2_plot").append("svg")
			.attr("height", svgheight)
			.attr("width", svgwidth);

        
        var xScale = d3.scaleBand()
            .domain(d3.range(dataFinal.length)) 
            .range([padding, svgwidth-padding])
            .padding([0.1]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataFinal, function(d){ 
                return d.Gold + d.Silver + d.Bronze + padding;
            })])
            .range([svgheight-padding, padding]);

        const xAxis = d3.axisBottom().tickFormat(function(d) { return countries[d]}).scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);


        svg_q2.append('g').call(xAxis)
            .attr('class', 'xAxis')
            .attr('transform', "translate(0," + (svgheight - padding) + ")")
            .selectAll("text")
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(-45 15 35)');
            
        svg_q2.append('g').call(yAxis) 
            .attr('class', 'yAxis')
            .attr('transform', 'translate('+ padding + ',0)');


        var groups = svg_q2.selectAll('.gbars')
            .data(stack).enter().append('g')
            .attr('class', 'gbars')
            .style('fill', function(d){return colors[d.index]})
    


        var rects = groups.selectAll('rect').data(function(d){return d}).enter().append('rect')
			.attr('x', function(d,i){
				return xScale(i);
			})
			.attr('y', function(d){
                return yScale(d[1]);
			})
			.attr('width', function(d){
				return xScale.bandwidth();
			})
			.attr('height', function(d){
				return  yScale(d[0]) - yScale(d[1]);
			})
    })
      
}

var question3=function(filePath){
    

    d3.csv(filePath, rowConverter).then(function(data){  
        
        data = data.filter(function (d) {
            return d.Sport == 'Basketball';
        });

        var genders = ['M', 'F']
        var color = ['red', 'pink']
        var svgheight = 700;
        var svgwidth = 1000;
        var padding = 40;
    
        var svg_q3 = d3.select("#q3_plot").append("svg")
            .attr("height", svgheight)
            .attr("width", svgwidth);

    
        var xScale = d3.scaleLinear()
            .domain([d3.min(data, function(d){ return d.Height;})-10, 
                d3.max(data, function(d){ return d.Height;})+10])
            .range([padding, svgwidth-padding])

        var yScale = d3.scaleLinear()
            .domain([d3.min(data, function(d){ return d.Weight;})-10, 
                d3.max(data, function(d){ return d.Weight;})+10])
            .range([svgheight-padding, padding]);

        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);
                

        svg_q3.append('g').call(xAxis)
        .attr('transform', 'translate(0,660)');
        svg_q3.append('g').call(yAxis)
            .attr('transform', 'translate(40,0)');

        var male = data.filter(function (d) {
            return d.Sex == 'M';
        });
        var female = data.filter(function (d) {
            return d.Sex == 'F';
        });

        svg_q3.selectAll('Male').data(male).enter().append('circle')
            .attr('r', 3)
            .attr('cx', function(d){return xScale(d.Height)})
            .attr('cy', function(d){return yScale(d.Weight)})
            .style('fill', 'pink');

        svg_q3.selectAll('Female').data(female).enter().append('circle')
            .attr('r', 3)
            .attr('cx', function(d){return xScale(d.Height)})
            .attr('cy', function(d){return yScale(d.Weight)})
            .style('fill', 'red');
    })
}

var question4=function(filePath){

    d3.csv(filePath, rowConverter).then(function(data){  
        
        data = data.filter(function (d) {
            return d.Year > 2010;
        });
        data = data.filter(function (d) {
            return (d.Sport == 'Swimming' || d.Sport == 'Rowing' || d.Sport == 'Wrestling' || d.Sport == 'Football' || d.Sport == 'Athletics');
        });

        var svgheight = 700;
        var svgwidth = 1000;
        var padding = 40;

        var svg_q4 = d3.select("#q4_plot").append("svg")
            .attr("height", svgheight)
            .attr("width", svgwidth);

        var grouped = unroll(d3.rollup(data, v => v.length, d => d.Sport), ["Sport"], "count");
        
        var xScale = d3.scaleBand()
            .domain(d3.range(grouped.length)) 
            .range([padding, svgwidth-padding])
            .padding([0.1]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(grouped, function(d){ 
                return d.count + 50;
            })])
            .range([svgheight-padding, padding]);

        const xAxis = d3.axisBottom().scale(xScale).tickFormat(function(d){return grouped[d]['Sport']});
        const yAxis = d3.axisLeft().scale(yScale);

        svg_q4.append('g').call(xAxis)
        // .attr('transform', 'translate(0,660)')
        .attr('transform', "translate(0," + (svgheight - padding) + ")")
        .selectAll('text')
        .attr('transform', 'rotate(-45, 10,20)')
        svg_q4.append('g').call(yAxis)
            .attr('transform', 'translate(40,0)');

        var rects = svg_q4.selectAll('rect').data(d3.range(grouped.length)).enter().append('rect')
			.attr('x', function(d){
				return xScale(d);
			})
			.attr('y', 
                function(d){ return yScale(grouped[d]['count']);
			})
			.attr('width', function(d){
				return xScale.bandwidth();
			})
			.attr('height', function(d){
				return  svgheight-padding - yScale(grouped[d]['count']);
			})
            .style('fill', 'pink')
    })
}
