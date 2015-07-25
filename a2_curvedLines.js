"use strict";

var canvas ;
var gl ;

var maxNumVertices = 2000;

var vertices     = [] ;
var vertexColors = [] ;
var linePoints   = [] ;
var nLines       =  0 ;
var totalPoints  =  0 ;

var colorInd = 0;
var mDown    = false;

var vBuffer;
var cBuffer;
var lineWidthL = [];

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
];

window.onload = function init()
{
  canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  //  Configure WebGL
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.95, 0.95, 0.95, 1.0 );

  //  Load shaders and initialize attribute buffers
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  var colorIndPicker = document.getElementById("colors");
  colorIndPicker.addEventListener("click",
    function()
    {
      colorInd = colorIndPicker.selectedIndex;
    }
  )  
  
  

  // color array atrribute buffer

  vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

  // Event listeners
  
  //document.getElementById("lineButton").onclick = function () {
  //  addLine();
  //  render();
  //};
  
  render();
  var pos;
  var lineWidthCurr = 2;  
  
  /*
  document.getElementById("sliderLineWidth").onchange = function(target)
  {
    lineWidthCurr = parseInt(event.target.value);
    console.log(lineWidthCurr);
  };*/
  
  canvas.addEventListener("mousedown",
    function(event)
    {
      pos  = vec2(2*event.clientX/canvas.width-1,
                  2*(canvas.height-event.clientY)/canvas.height-1);
      if (typeof pos != undefined)
      {
        //start line
        nLines++;

        vertices.push(pos);
        vertexColors.push(colors[colorInd]);
        linePoints.push(1);
        mDown=true;
        
        lineWidthL.push(lineWidthCurr);
        console.log(lineWidthCurr);
      //addLine();
      }
    }
  );
  
  canvas.addEventListener("mouseup", function(event){mDown=false});
  
  canvas.addEventListener("mousemove",
    function(event)
    {
      if (mDown){
        pos  = vec2(2*event.clientX/canvas.width-1,
                    2*(canvas.height-event.clientY)/canvas.height-1);
        vertices.push(pos);
        vertexColors.push(colors[colorInd]);
        linePoints[nLines-1]++;

        render();
      }
    }
  );
  
  
  
  
  
}




function render()
{
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var v0=0;

  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));

  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertexColors));
  
  
  for (var i0=0; i0 < nLines; i0++)
  {
    //console.log(lineWidthL[i0]);
    gl.lineWidth(lineWidthL[i0]);
    gl.drawArrays(gl.LINE_STRIP, v0, linePoints[i0]);
    v0 += linePoints[i0];
    
  }
  
}

