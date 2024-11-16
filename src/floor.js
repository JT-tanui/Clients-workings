import { mat4 } from 'gl-matrix';

export class Floor {
    constructor(gl) {
        this.gl = gl;
        this.position = [0, 0, 0];
        this.rotation = 0;
        this.scale = [4, 0.02, 4]; // Wide and thin floor
        this.initBuffers();
    }

    initBuffers() {
        const gl = this.gl;
        
        // Simple plane vertices
        const vertices = [
            // Top face
            -1.0, 0.0, -1.0,
            -1.0, 0.0,  1.0,
             1.0, 0.0,  1.0,
             1.0, 0.0, -1.0,
        ];

        const normals = [
            // Top face normal
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ];

        const indices = [
            0, 1, 2,
            0, 2, 3,
        ];

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        this.indexCount = indices.length;
    }

    setProgram(program, locations) {
        this.program = program;
        this.locations = locations;
    }

    render() {
        const gl = this.gl;
        
        const modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, this.position);
        mat4.rotate(modelMatrix, modelMatrix, this.rotation, [0, 1, 0]);
        mat4.scale(modelMatrix, modelMatrix, this.scale);

        gl.uniformMatrix4fv(this.locations.uniforms.modelMatrix, false, modelMatrix);
        
        // Marble-like floor color with slight reflection
        gl.uniform1i(this.locations.uniforms.uUseTexture, 0);
        gl.uniform4fv(this.locations.uniforms.baseColor, [0.9, 0.9, 0.92, 1.0]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.locations.attributes.position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.locations.attributes.position);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.locations.attributes.normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.locations.attributes.normal);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    }
}

export function createFloor(gl) {
    return new Floor(gl);
}