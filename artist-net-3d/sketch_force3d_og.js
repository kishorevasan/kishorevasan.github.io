//  <script src="three.js"></script>
//  <script src="OrbitControls.js"></script>
const elem = document.getElementById('3d-graph');

// large static graph
//const Graph = ForceGraph3D()(elem).jsonUrl('./data/artist_net_static.json')
//      .nodeAutoColorBy('component')
//      .nodeLabel(node => `${node.label}`)
//      .onNodeClick(node => window.open(`https://bl.ocks.org/${node.user}/${node.id}`, '_blank'));

var curr_net = {"nodes":[],"links":[]}
var past_counter_link = 0 // updating the old links at the next time step

var past_counter_node = 0 // updating the old nodes at the next time step
var node_idx_mapper = {} // maps the node id name to the graph name

var prev_nodes_timestep = [] // nodes added at the prev timestep with a custom x,y,z

//var new_counter = 0 // n new added until the prev time step
//var new_counter_2 = 0 // n new added this timestep

// generate graph links
var all_links = {}
for(var i = 0; i<net_data['links'].length; i++){
  all_links[net_data['links'][i]['source']] = net_data['links'][i]['target']
}

// get the graph at a given timestamp
function getCurrGraph(timestamp){
  var new_links_connections = {}
  var new_nodes_to_consider = []
  //var curr_net = {"nodes":[],"links":[]}
  for (var i = 0; i < net_data['links'].length; i++) {
    if(net_data['links'][i]['time'] == timestamp){
      var color=0xc42e0c;//new link
      var width = 15;
      curr_net['links'].push({'source':net_data['links'][i]['source'],
                              'target':net_data['links'][i]['target'],
                              'time':net_data['links'][i]['time'],
                              'color':color,
                              'width':width,
                              'opacity':1,
                              'transparent':false})

      var target_node_idx = net_data['links'][i]['target']
      var node_idx_tmp = node_idx_mapper[target_node_idx]

      // place the node close to the target
      if(node_idx_tmp != undefined){
        var tmpx = Graph.graphData().nodes[node_idx_tmp].x
        var tmpy = Graph.graphData().nodes[node_idx_tmp].y
        var tmpz = Graph.graphData().nodes[node_idx_tmp].z
        new_nodes_to_consider.push(net_data['links'][i]['source'])
        prev_nodes_timestep.push(net_data['links'][i]['source'])
        new_links_connections[net_data['links'][i]['source']] = [tmpx*0.95, tmpy*0.95, tmpz*0.95]
      }else{
        // try if the neighbors neighbor has a location

        var neigh_neigh_node = all_links[target_node_idx]
        // neigh exists
        if(neigh_neigh_node != undefined){
          // node already added?
          var node_idx_tmp = node_idx_mapper[neigh_neigh_node]

          if(node_idx_tmp != undefined){
            var tmpx = Graph.graphData().nodes[node_idx_tmp].x
            var tmpy = Graph.graphData().nodes[node_idx_tmp].y
            var tmpz = Graph.graphData().nodes[node_idx_tmp].z
            new_nodes_to_consider.push(net_data['links'][i]['source'])
            prev_nodes_timestep.push(net_data['links'][i]['source'])
            new_links_connections[net_data['links'][i]['source']] = [tmpx*0.85, tmpy*0.85, tmpz*0.85]
          }

        }

      }
    }else if(net_data['links'][i]['time'] == timestamp-1){
      curr_net['links'][past_counter_link]['color'] = 0x218ccf // old color
      curr_net['links'][past_counter_link]['width'] = 10 // old width
      curr_net['links'][past_counter_link]['opacity'] = 0.5 // old opacity
      curr_net['links'][past_counter_link]['transparent'] = true;
      past_counter_link+=1
    }
  }
  for (var i = 0; i < net_data['nodes'].length;i++){
    var node_id = net_data['nodes'][i]['id']
    if(net_data['nodes'][i]['time']==timestamp){
      var color=0xc42e0c;//c42e0c; // new node

      if(new_nodes_to_consider.includes(node_id)){
        curr_net['nodes'].push({'id':node_id,
                              'label':net_data['nodes'][i]['label'],
                              'component':net_data['nodes'][i]['component'],
                              'color':color,
                              'n_art_sold':net_data['nodes'][i]['n_art_sold'],
                              'total_earn':net_data['nodes'][i]['total_earn'],
                              'x':new_links_connections[node_id][0],
                              'y':new_links_connections[node_id][1],
                              'z':new_links_connections[node_id][2]})
      }else{
        curr_net['nodes'].push({'id':node_id,
                              'label':net_data['nodes'][i]['label'],
                              'component':net_data['nodes'][i]['component'],
                              'color':color,
                              'n_art_sold':net_data['nodes'][i]['n_art_sold'],
                              'total_earn':net_data['nodes'][i]['total_earn']})

      }

      // udpate the counter
      node_idx_mapper[node_id] = past_counter_node
      past_counter_node+=1
    }else if(net_data['nodes'][i]['time'] == timestamp-1){
      curr_net['nodes'][node_idx_mapper[node_id]]['color'] = 0x218ccf
    }

    }
  return curr_net
}

// get the list of components
var component_dict = {}
for(var i = 0; i<net_data['nodes'].length; i++){
  component_dict[net_data['nodes'][i]['id']] = net_data['nodes'][i]['component']
}

// color the top 10 components
var component_colors = {3:0xA452A7,
                        29:0x8CA231,
                        57:0xD74322,
                        15:0x4194A2,
                        53:0xACCAF0,
                        296:0xEF7232,
                        25:0x0B61EF,
                        43:0x07592A,
                        22:0xF1FF00,
                        238:0xEC9EE7}

// update the colors based on component
function updateComponentsColor(){
    for(var i = 0; i<curr_net['nodes'].length; i++){
      var col = component_colors[curr_net['nodes'][i]['component']]
      if(col != undefined){
        curr_net['nodes'][i]['color'] = col
      }else{
        curr_net['nodes'][i]['color'] = 0x808080
      }
    }

    for(var i = 0; i<curr_net['links'].length; i++){
      var source_id = curr_net['links'][i]['source']['id']
      if(source_id != undefined){
        var comp_id_tmp = component_dict[source_id]
      }else{
        var comp_id_tmp = component_dict[curr_net['links'][i]['source']]
      }
      var col = component_colors[comp_id_tmp]
      if(col != undefined){
        curr_net['links'][i]['color'] = col
        curr_net['links'][i]['opacity'] = 1
        curr_net['links'][i]['transparent'] = false;
      }else{
        curr_net['links'][i]['color'] = 0x808080
        curr_net['links'][i]['opacity'] = 0.5
        curr_net['links'][i]['transparent'] = true;
      }
    }
//    Graph.graphData(curr_net)
}

// setup dynamic graph
var Graph = ForceGraph3D()(elem)
        .enableNodeDrag(false)
        .graphData(curr_net)
        .nodeLabel(node =>{
          var content = ''.concat('<h3 style="color:black;">','Artist: ',node['label'],
                           '<br>Num art sold: ', node['n_art_sold'],
                           '<br>Total Earnings: $', Math.round(node['total_earn']),'<h3>')
          return content
        })
        .linkMaterial(link => {
          return new THREE.LineBasicMaterial({color:link['color'],opacity:link['opacity'],
            transparent:link['transparent']})})
        .linkWidth('width')
        .linkCurveRotation(5)
        .nodeVal(node => {return node['n_art_sold']*5})
        .onNodeClick(node=>{
          var url = ''.concat('https://www.foundation.app/',node['label'])
          window.open(url);
        })
        .backgroundColor('#FAFAFA')
        .nodeRelSize(8)
        .cameraPosition({x:1000,y:100,z:-3000})
        .d3VelocityDecay(0.5)
        .d3AlphaDecay(0.1)
//        .warmupTicks(15)

//
// Export to OBJ
//
function exportOBJGraph(){
  var oexporter = new THREE.OBJExporter();
  var result = oexporter.parse(Graph.scene());
  console.log(result.obj)
  download(result.obj, "net-model.obj", "text/plain")
  download(result.mtl, "net-material.mtl", "text/plain")
  console.log('obj exported...')
}

// start date
var curr_date = 'Friday Jan 22 2021 00:00:00';
curr_date = new Date(curr_date)

// seconds * minutes * hours * milliseconds = 1 day
var day = 60 * 60 * 24 * 1000;
var counter = 0;
var maxcounter = 140;

var isAnimationActive = true;
var isRotationActive = true;
var angle = 0;
var distance = 5000

var interval_func = function(){
  if(isAnimationActive){
        document.getElementById("myText").innerHTML = curr_date.toDateString();
        document.getElementById("myText2").innerHTML = (counter+1).toString();
        curr_net = getCurrGraph(counter)
        Graph.graphData(curr_net);

        counter+=1
        // update date
        curr_date = new Date(curr_date.getTime() + day);
        if(counter < maxcounter){
          clearInterval(interval)
          interval = setInterval(interval_func, counter*10+500)
        }else{
          updateComponentsColor()
          //setTimeout(exportOBJGraph(), 5000)
          setTimeout(clearInterval(interval), counter*10 + 500)
        }
  }
}

var interval_func_rot = function(){
    if (isRotationActive) {
        Graph.cameraPosition({
          x: distance * Math.sin(angle),
          z: distance * Math.cos(angle)
        });
        angle += Math.PI / 300;
  }
}

var interval_rotation = setInterval(interval_func_rot, 50)
var interval = setInterval(interval_func, counter*10+500);

// pause animation
document.getElementById('animationToggle').addEventListener('click', event => {
//      isAnimationActive ? Graph.pauseAnimation() : Graph.resumeAnimation();
    isAnimationActive = !isAnimationActive;
    event.target.innerHTML = `${(isAnimationActive ? 'Pause' : 'Resume')} Animation`;
});

// pause rotation
document.getElementById('rotationToggle').addEventListener('click', event => {
      isRotationActive = !isRotationActive;
      event.target.innerHTML = `${(isRotationActive ? 'Pause' : 'Resume')} Rotation`;
    });

///
// final stage click
///

const objLoader = new THREE.ObjectLoader();
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
  objMapperLinks[net_obj['links'][i]['index']] = objLoader.parse(s['__lineObj'])
}

function displayFinalGraph(){
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
        .cameraPosition({x:1000,y:100,z:-3000})
        .d3VelocityDecay(1)

  distance = 12000
  if(isAnimationActive == true){
    document.getElementById('animationToggle').click()
  }
  clearInterval(interval)
}

// toggle final stage
document.getElementById('finalStage').addEventListener('change',e =>{
    if(e.target.checked==true){
      displayFinalGraph()
    }
})
