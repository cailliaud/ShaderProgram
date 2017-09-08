
precision mediump float;

varying float depht;

void main(void) {
	gl_FragColor = vec4(vec3(depht),1.0);

}
