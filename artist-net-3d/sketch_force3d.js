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
//var new_counter = 0 // n new added until the prev time step
//var new_counter_2 = 0 // n new added this timestep

// get the graph at a given timestamp
function getCurrGraph(timestamp){
  //var curr_net = {"nodes":[],"links":[]}
  for (var i = 0; i < net_data['links'].length; i++) {
    if(net_data['links'][i]['time'] == timestamp){
      var color=0xc42e0c;//new link
      var width = 20;
      curr_net['links'].push({'source':net_data['links'][i]['source'],
                              'target':net_data['links'][i]['target'],
                              'time':net_data['links'][i]['time'],
                              'color':color,
                              'width':width})
//      new_counter_2 +=1
    }else if(net_data['links'][i]['time'] == timestamp-1){
      curr_net['links'][past_counter_link]['color'] = 0x218ccf // old color
      curr_net['links'][past_counter_link]['width'] = 15 // old width
      past_counter_link+=1
    }
  }
  for (var i = 0; i < net_data['nodes'].length;i++){
    if(net_data['nodes'][i]['time']==timestamp){
      var color=0xc42e0c;//c42e0c; // new node
      curr_net['nodes'].push({'id':net_data['nodes'][i]['id'],
                              'label':net_data['nodes'][i]['label'],
                              'component':net_data['nodes'][i]['component'],
                              'color':color,
                              'n_art_sold':net_data['nodes'][i]['n_art_sold'],
                              'total_earn':net_data['nodes'][i]['total_earn']})
    }else if(net_data['nodes'][i]['time'] == timestamp-1){
      curr_net['nodes'][past_counter_node]['color'] = 0x218ccf
      past_counter_node+=1
    }

    }
  return curr_net
}

// setup dynamic graph
const Graph = ForceGraph3D()(elem)
        .enableNodeDrag(false)
        .graphData(curr_net)
        .nodeLabel(node =>{
          var content = ''.concat('<h3 style="color:black;">','Artist: ',node['label'],
                           '<br>Num art sold: ', node['n_art_sold'],
                           '<br>Total Earnings: $', Math.round(node['total_earn']),'<h3>')

          return content
        })
        .linkMaterial(link => {
          return new THREE.LineBasicMaterial({color:link['color']})})
        .linkWidth('width')
        .linkCurveRotation(0.2)
        .nodeVal('n_art_sold')
        .onNodeClick(node=>{
          var url = ''.concat('https://www.foundation.app/',node['label'])
          window.open(url);
        })
        .backgroundColor('#FAFAFA')
        .nodeRelSize(8)
        .cameraPosition({x:1000,y:100,z:-3000})

// update the link force
// force nodes away from one another
//sim = d3.forceSimulation(nodes)
//  .force("charge", d3.forceManyBody().strength(-2))//const linkForce = Graph
//      .d3Force("charge", d3.forceManyBody().theta(0.2))

// start date
var curr_date = 'Friday Jan 22 2021 00:00:00';
curr_date = new Date(curr_date)

// seconds * minutes * hours * milliseconds = 1 day
var day = 60 * 60 * 24 * 1000;
var counter = 0;
var maxcounter = 50;

var isAnimationActive = true;

var interval_func = function(){
  if(isAnimationActive){
        document.getElementById("myText").innerHTML = curr_date.toDateString();
        document.getElementById("myText2").innerHTML = counter.toString();
        var curr_net = getCurrGraph(counter)
        Graph.graphData(curr_net);
        counter+=1
        // update date
        curr_date = new Date(curr_date.getTime() + day);
        if(counter < maxcounter){
          clearInterval(interval)
          interval = setInterval(interval_func, counter*50+1000)
        }else{
          setTimeout(clearInterval(interval), counter*100+1000)
        }

  }
}

var interval = setInterval(interval_func, counter*50+1000);

// pause animation
document.getElementById('animationToggle').addEventListener('click', event => {
//      isAnimationActive ? Graph.pauseAnimation() : Graph.resumeAnimation();
      isAnimationActive = !isAnimationActive;
      event.target.innerHTML = `${(isAnimationActive ? 'Pause' : 'Resume')} Animation`;
});
