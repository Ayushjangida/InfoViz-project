const canvas = d3.select(".canva");

const topo_url = "https://gist.githubusercontent.com/Ayushjangida/c42b366cb33ed967f91f77efb5324bac/raw/8511944973445eb533c99c8e57aa99447d12fd59/student_district.json";
//https://gist.githubusercontent.com/Ayushjangida/114c5fc51ef19e35bb4a7f880c7c5237/raw/0d8499924eafb0422c834cdda3bd63e9832d096b/simple_file.json
//https://gist.githubusercontent.com/Ayushjangida/c42b366cb33ed967f91f77efb5324bac/raw/8511944973445eb533c99c8e57aa99447d12fd59/student_district.json
//https://raw.githubusercontent.com/johan/world.geo.json/master/countries/CAN.geo.json
//https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json
const MARGIN = {
    TOP : 20,
    BOTTOM : 20,
    LEFT : 20,
    RIGHT : 20,
};

const GRAPH_WIDTH = 8000 - MARGIN.LEFT - MARGIN.RIGHT;
const GRAPH_HEIGHT = 8000 - MARGIN.TOP - MARGIN.BOTTOM;

const TRANSLATE_LEFT = 15500;
const TRANSLATE_BOTTOM = 12000;
 

const svg = canvas.append("svg")
                    .attr("width", GRAPH_WIDTH)
                    .attr("height", GRAPH_HEIGHT);

const mainCanvas = svg.append("g")
                        .attr("width", GRAPH_WIDTH)
                        .attr("height", GRAPH_HEIGHT)
                        .attr('transform', `translate(${TRANSLATE_LEFT}, ${TRANSLATE_BOTTOM})`);

 const bc_projection = d3.geoNaturalEarth1().scale(9000);             
 const bc_path = d3.geoPath().projection(bc_projection);   
 const graticule = d3.geoGraticule();                    

const g = svg.append("g");

d3.json(topo_url)
    .then(data => {
        console.log(data);
        const collect = topojson.feature(data, data.objects.collection);
//        console.log(collect);
//        const locate = collect.features;
        
//        console.log(data.features);
//        console.log(locate);
        console.log(collect.features)
        g.selectAll("path").data(collect.features)
                            .enter()
                            .append("path")
                            .attr('transform', `translate(${TRANSLATE_LEFT}, ${TRANSLATE_BOTTOM})`)
                            .attr("class", "collection")
                            .attr("d", bc_path)
                            .attr("fill", "white")
                            .attr("stroke", "black");
    })

// function drawMap(err, bc)    {
//     if(err) throw err

//     console.log(bc)

//     svg.append("path")
//         .datum(graticule)
//         .attr("class", "graticule")
//         .attr("d", bc_path);

//     svg.append("path")
//         .datum(graticule.outline)
//         .attr("class", "foregorund")
//         .attr("d", bc_path);

//     svg.append("g")
//         .selectAll("path")
//         .data(topojson.feature(bc, bc.objects.collection).features)
//         .enter().append("path")
//         .attr("d", bc_path);
// }

// d3.json(topo_url, drawMap);


        

