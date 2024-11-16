import { mat4, vec3 } from 'gl-matrix';
import { createShader, createProgram, vertexShaderSource, fragmentShaderSource } from './shaders.js';

export class Scene {
    constructor(gl) {
        this.gl = gl;
        this.models = [];
        this.camera = {
            position: vec3.fromValues(0, 2, 5),
            target: vec3.fromValues(0, 0, 0),
            up: vec3.fromValues(0, 1, 0),
            rotation: {
                x: 0,
                y: 0
            }
        };
        this.mouseDown = false;
        this.lastMousePos = { x: 0, y: 0 };
        this.setupGL();
        this.initShaders();
        this.setupMouseControls();
    }

    setupMouseControls() {
        const canvas = this.gl.canvas;

        canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.mouseDown = true;
            this.lastMousePos = {
                x: e.clientX,
                y: e.clientY
            };
        });

        window.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.mouseDown) return;

            const deltaX = e.clientX - this.lastMousePos.x;
            const deltaY = e.clientY - this.lastMousePos.y;

            this.camera.rotation.y += deltaX * 0.005;
            this.camera.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, 
                this.camera.rotation.x + deltaY * 0.005));

            this.updateCameraPosition();
            
            this.lastMousePos = {
                x: e.clientX,
                y: e.clientY
            };
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.001;
            const zoom = e.deltaY * zoomSpeed;
            const direction = vec3.create();
            vec3.subtract(direction, this.camera.position, this.camera.target);
            
            // Limit zoom range
            const currentDistance = vec3.length(direction);
            const newDistance = currentDistance * (1 + zoom);
            if (newDistance > 2 && newDistance < 10) {
                vec3.scale(direction, direction, 1 + zoom);
                vec3.add(this.camera.position, this.camera.target, direction);
            }
        });
    }

    updateCameraPosition() {
        const radius = vec3.length(vec3.subtract(vec3.create(), 
            this.camera.position, this.camera.target));
        
        this.camera.position[0] = this.camera.target[0] + radius * 
            Math.sin(this.camera.rotation.y) * Math.cos(this.camera.rotation.x);
        this.camera.position[1] = this.camera.target[1] + radius * 
            Math.sin(this.camera.rotation.x);
        this.camera.position[2] = this.camera.target[2] + radius * 
            Math.cos(this.camera.rotation.y) * Math.cos(this.camera.rotation.x);
    }

    setupGL() {
        const gl = this.gl;
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0.9, 0.9, 0.9, 1.0);
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const canvas = this.gl.canvas;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            this.gl.viewport(0, 0, canvas.width, canvas.height);
        }
    }

    initShaders() {
        const gl = this.gl;
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        this.program = createProgram(gl, vertexShader, fragmentShader);
        
        this.locations = {
            attributes: {
                position: gl.getAttribLocation(this.program, 'aPosition'),
                normal: gl.getAttribLocation(this.program, 'aNormal'),
                texCoord: gl.getAttribLocation(this.program, 'aTexCoord')
            },
            uniforms: {
                modelMatrix: gl.getUniformLocation(this.program, 'uModelMatrix'),
                viewMatrix: gl.getUniformLocation(this.program, 'uViewMatrix'),
                projMatrix: gl.getUniformLocation(this.program, 'uProjMatrix'),
                lightPos: gl.getUniformLocation(this.program, 'uLightPos'),
                viewPos: gl.getUniformLocation(this.program, 'uViewPos'),
                baseColor: gl.getUniformLocation(this.program, 'uBaseColor'),
                uTexture: gl.getUniformLocation(this.program, 'uTexture'),
                uUseTexture: gl.getUniformLocation(this.program, 'uUseTexture')
            }
        };
    }

    addModel(model) {
        model.setProgram(this.program, this.locations);
        this.models.push(model);
    }

    render() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const viewMatrix = mat4.create();
        const projMatrix = mat4.create();

        mat4.lookAt(viewMatrix, this.camera.position, this.camera.target, this.camera.up);
        mat4.perspective(projMatrix, 45 * Math.PI / 180, 
            gl.canvas.width / gl.canvas.height, 0.1, 100.0);

        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.locations.uniforms.viewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(this.locations.uniforms.projMatrix, false, projMatrix);
        gl.uniform3fv(this.locations.uniforms.lightPos, [5, 5, 5]);
        gl.uniform3fv(this.locations.uniforms.viewPos, this.camera.position);

        this.models.forEach(model => {
            model.render();
        });
    }
}

export function initScene(gl) {
    return new Scene(gl);
}