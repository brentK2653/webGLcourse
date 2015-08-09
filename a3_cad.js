"use strict";

var canvas ;
var gl ;

var maxNumVertices = 2000;

var vertices     = [] ;
var vertexColors = [] ;
var linePoints   = [] ;
var nLines       =  0 ;
var totalPoints  =  0 ;

var faceColor = -1;
var edgeColor = -1;

var shapeType = -1;
var baseShape = -1;

var baseDiameter = 1.;
var height       = 1.;

var bDraw     = True;



var vBuffer;
var cBuffer;
var lineWidthL = [];

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
];


function bDraw_check()
{
  bDraw = True;
  if (faceColor == -1)
    bDraw = False;
  if (edgeColor == -1)
    bDraw = False;
  if (shapeType == -1)
    bDraw = False;
  if (baseShape == -1)
    bDraw = False;
}



window.onload = function init()
{
  canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  //  Configure WebGL
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

  //  Load shaders and initialize attribute buffers
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  
  

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
  

  var faceColorPicker = document.getElementById("faceColor");
  faceColorPicker.addEventListener("click",
    function()
    {
      faceColor = faceColorPicker.selectedIndex;
    }
  )  

  var edgeColorPicker = document.getElementById("edgeColor");
  edgeColorPicker.addEventListener("click",
    function()
    {
      edgeColor = edgeColorPicker.selectedIndex;
    }
  )  

  var shapeTypePicker = document.getElementById("shapeType");
  shapeTypePicker.addEventListener("click",
    function()
    {
      shapeType = shapeTypePicker.selectedIndex;
    }
  )  

  var baseShapePicker = document.getElementById("baseShape");
  baseShapePicker.addEventListener("click",
    function()
    {
      baseShape = baseShapePicker.selectedIndex;
    }
  )  

  var drawButton = document.getElementById("drawButton");
  drawButton.addEventListener("click",
    function()
    {
      
      render();
    }
  )  
  
}




function render_prev()
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


function render()
{
  
  
  
  
}

