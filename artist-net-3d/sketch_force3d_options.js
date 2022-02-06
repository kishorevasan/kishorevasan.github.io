const elem = document.getElementById('3d-graph');

// large static graph
// setup dynamic graph

// rotation listener
var distance = 12000;
var angle = 0;
var isRotationActive = true;
var interval_func_rot = function(){
    if (isRotationActive) {
        Graph.cameraPosition({
          x: distance * Math.sin(angle),
          z: distance * Math.cos(angle)
        });
        angle += Math.PI / 300;
  }
}

var Graph = ForceGraph3D()(elem).backgroundColor('#FAFAFA');

//var interval_rotation = setInterval(interval_func_rot, 50)

// pause rotation
document.getElementById('rotationToggle').addEventListener('click', event => {
      isRotationActive = !isRotationActive;
      event.target.innerHTML = `${(isRotationActive ? 'Pause' : 'Resume')} Rotation`;
    });


//var json_parsed = JSON.parse(net_obj)


// toggle version stage
document.getElementById('version1').addEventListener('click',function(e){
  var objLoader = new THREE.ObjectLoader();
  var objMapperNodes = {}
  for(var i = 0; i<net_obj2['nodes'].length; i++){
    var s = net_obj2['nodes'][i]
    var key = Object.keys(s)[6]
    var s_parsed = objLoader.parse(s['__threeObj'])
    objMapperNodes[net_obj2['nodes'][i]['id']] = s_parsed
  }

  var objMapperLinks = {}
  for(var i = 0; i<net_obj2['links'].length; i++){
    var s = net_obj2['links'][i]
    var key = Object.keys(s)[7]
  //  console.log(s['__lineObj']["object"])
    objMapperLinks[net_obj2['links'][i]['index']] = objLoader.parse(s['__lineObj'])
  }

  Graph = ForceGraph3D()(elem)
      .graphData(net_obj2)
      .enableNodeDrag(false)
      .nodeLabel(node =>{
          var content = ''.concat('<h3 style="color:black;">','Artist: ',node['label'],
                           '<br>Num art sold: ', node['n_art_sold'],
                           '<br>Total Earnings: $', Math.round(node['total_earn']),'<h3>')
          return content
        })
        .linkMaterial(link => {
          return objMapperLinks[link['index']].material})
        .linkWidth('width')
        .onNodeClick(node=>{
          var url = ''.concat('https://www.foundation.app/',node['label'])
          window.open(url);
        })
        .nodeThreeObject(node=>{return objMapperNodes[node['id']]})
        .backgroundColor('#FAFAFA')
        .cameraPosition({x:10000,y:-10000,z:-3000})
        .d3VelocityDecay(1)
})

document.getElementById('version2').addEventListener('click',function(e){
  var objLoader = new THREE.ObjectLoader();
  var objMapperNodes = {}
  for(var i = 0; i<net_obj['nodes'].length; i++){
    var s = net_obj['nodes'][i]
    var key = Object.keys(s)[6]
    var s_parsed = objLoader.parse(s['__threeObj'])
    objMapperNodes[net_obj['nodes'][i]['id']] = s_parsed
  }

  var objMapperLinks = {}
  for(var i = 0; i<net_obj['links'].length; i++){
    var s = net_obj['links'][i]
    var key = Object.keys(s)[7]
  //  console.log(s['__lineObj']["object"])
    objMapperLinks[net_obj['links'][i]['index']] = objLoader.parse(s['__lineObj'])
  }

  Graph = ForceGraph3D()(elem)
      .graphData(net_obj)
      .enableNodeDrag(false)
      .nodeLabel(node =>{
          var content = ''.concat('<h3 style="color:black;">','Artist: ',node['label'],
                           '<br>Num art sold: ', node['n_art_sold'],
                           '<br>Total Earnings: $', Math.round(node['total_earn']),'<h3>')
          return content
        })
        .linkMaterial(link => {
          return objMapperLinks[link['index']].material})
        .linkWidth('width')
        .onNodeClick(node=>{
          var url = ''.concat('https://www.foundation.app/',node['label'])
          window.open(url);
        })
        .nodeThreeObject(node=>{return objMapperNodes[node['id']]})
        .backgroundColor('#FAFAFA')
        .cameraPosition({x:15000,y:-10000,z:-3000})
        .d3VelocityDecay(1)
})

document.getElementById('version3').addEventListener('click',function(e){
  var objLoader = new THREE.ObjectLoader();
  var objMapperNodes = {}
  for(var i = 0; i<net_obj3['nodes'].length; i++){
    var s = net_obj3['nodes'][i]
    var key = Object.keys(s)[6]
    var s_parsed = objLoader.parse(s['__threeObj'])
    objMapperNodes[net_obj3['nodes'][i]['id']] = s_parsed
  }

  var objMapperLinks = {}
  for(var i = 0; i<net_obj3['links'].length; i++){
    var s = net_obj3['links'][i]
    var key = Object.keys(s)[7]
  //  console.log(s['__lineObj']["object"])
    objMapperLinks[net_obj3['links'][i]['index']] = objLoader.parse(s['__lineObj'])
  }

  Graph = ForceGraph3D()(elem)
      .graphData(net_obj3)
      .enableNodeDrag(false)
      .nodeLabel(node =>{
          var content = ''.concat('<h3 style="color:black;">','Artist: ',node['label'],
                           '<br>Num art sold: ', node['n_art_sold'],
                           '<br>Total Earnings: $', Math.round(node['total_earn']),'<h3>')
          return content
        })
        .linkMaterial(link => {
          return objMapperLinks[link['index']].material})
        .linkWidth('width')
        .onNodeClick(node=>{
          var url = ''.concat('https://www.foundation.app/',node['label'])
          window.open(url);
        })
        .nodeThreeObject(node=>{return objMapperNodes[node['id']]})
        .backgroundColor('#FAFAFA')
        .cameraPosition({x:13000,y:-10500,z:-3300})
        .d3VelocityDecay(1)
})

document.getElementById('version4').addEventListener('click',function(e){
  var objLoader = new THREE.ObjectLoader();
  var objMapperNodes = {}
  for(var i = 0; i<net_obj1['nodes'].length; i++){
    var s = net_obj1['nodes'][i]
    var key = Object.keys(s)[6]
    var s_parsed = objLoader.parse(s['__threeObj'])
    objMapperNodes[net_obj1['nodes'][i]['id']] = s_parsed
  }

  var objMapperLinks = {}
  for(var i = 0; i<net_obj1['links'].length; i++){
    var s = net_obj1['links'][i]
    var key = Object.keys(s)[7]
  //  console.log(s['__lineObj']["object"])
    objMapperLinks[net_obj1['links'][i]['index']] = objLoader.parse(s['__lineObj'])
  }

  Graph = ForceGraph3D()(elem)
      .graphData(net_obj1)
      .enableNodeDrag(false)
      .nodeLabel(node =>{
          var content = ''.concat('<h3 style="color:black;">','Artist: ',node['label'],
                           '<br>Num art sold: ', node['n_art_sold'],
                           '<br>Total Earnings: $', Math.round(node['total_earn']),'<h3>')
          return content
        })
        .linkMaterial(link => {
          return objMapperLinks[link['index']].material})
        .linkWidth('width')
        .onNodeClick(node=>{
          var url = ''.concat('https://www.foundation.app/',node['label'])
          window.open(url);
        })
        .nodeThreeObject(node=>{return objMapperNodes[node['id']]})
        .backgroundColor('#FAFAFA')
        .cameraPosition({x:9000,y:-10000,z:-3200})
        .d3VelocityDecay(1)

})
