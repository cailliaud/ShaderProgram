
// =====================================================
var gl;
var shadersLoaded = 0;
var vertShaderTxt;
var fragShaderTxt;
var shaderProgram = null;
var vertexBuffer;
var colorBuffer;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
mat4.identity(objMatrix);



// =====================================================
function webGLStart() {
	var canvas = document.getElementById("WebGL-test");
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;

	initGL(canvas);
	initBuffers();
	loadShaders('shader');

	gl.clearColor(0.7, 0.7, 0.7, 1.0);
	gl.enable(gl.DEPTH_TEST);

//	drawScene();
	tick();
}

// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}


// =====================================================
function initBuffers() {
	//----------------------
	//		BUFFER DISQUE
	//---------------------
	vertexBuffer1 = gl.createBuffer();
	vertexBuffer1.numItems = 0;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
	vertices1 = [0.0,0.0,0.0];
	vertexBuffer1.numItems += 1;
	
	var part = 48.0;
	var deltaTheta = 2.0*Math.PI/part; 
	var rCircle = 0.3;
	var a,b,c,d;
	
	

	// boucle cercle
	for (i = 0; i <= part+1; i++){
		a = rCircle*Math.cos(i*deltaTheta);
		b= rCircle*Math.sin(i*deltaTheta) ;
		vertices1.push(a);
		vertices1.push(b );
		vertices1.push(0.0);
		vertices1. push(0.0,0.0,0.0);
		vertexBuffer1.numItems+=2;
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);
	vertexBuffer1.itemSize = 3;
	

	//----------------------
	//	BUFFFER ANNEAU
	//----------------------
	vertexBuffer2 = gl.createBuffer();
	vertexBuffer2.numItems = 0;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
	vertices2=[]
	// Boucle pour la création de l'anneau avec une translation deltaX et deltaY
	var deltaX = 1.0;
	var deltaY = -1.0 ;
	var r1Ring = 0.3;
	var r2Ring = 0.8;
	
	for (i = 0; i <= part+1; i++){
		a= r1Ring*Math.cos(i*deltaTheta) +deltaX;
		b= r1Ring*Math.sin(i*deltaTheta ) +deltaY;
		c = r2Ring*Math.cos(i*deltaTheta) + deltaX;
		d= r2Ring*Math.sin(i*deltaTheta)+ deltaY;
		
		vertices2.push(a );
		vertices2.push(b );
		vertices2.push(0.0);
		vertices2.push(c );
		vertices2.push(d );
		vertices2.push(0.0);
		vertexBuffer2.numItems+=2;
	}
	
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);
	vertexBuffer2.itemSize = 3;



	
}


// =====================================================
function loadShaders(shader) {
	loadShaderText(shader,'.vs');
	loadShaderText(shader,'.fs');
}

// =====================================================
function loadShaderText(filename,ext) {   // technique car lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { vertShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(ext=='.fs') { fragShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(shadersLoaded==2) {
				initShaders(vertShaderTxt,fragShaderTxt);
				shadersLoaded=0;
			}
    }
  }
  xhttp.open("GET", filename+ext, true);
  xhttp.send();
}

// =====================================================
function initShaders(vShaderTxt,fShaderTxt) {

	vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vshader, vShaderTxt);
	gl.compileShader(vshader);
	if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(vshader));
		return null;
	}

	fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fshader, fShaderTxt);
	gl.compileShader(fshader);
	if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(fshader));
		return null;
	}

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vshader);
	gl.attachShader(shaderProgram, fshader);

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);


	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


// =====================================================
function setMatrixUniforms() {
	if(shaderProgram != null) {
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	}
}

// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	if(shaderProgram != null) {
		
		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);
		mat4.multiply(mvMatrix, objMatrix);

		setMatrixUniforms();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
      	vertexBuffer1.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer1.numItems);
		
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
      	vertexBuffer2.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer2.numItems);
	}
}
