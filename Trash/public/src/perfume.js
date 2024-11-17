import { mat4 } from 'gl-matrix';

class PerfumeBottle {
    constructor(gl) {
        this.gl = gl;
        this.position = [0, 0, 0];
        this.rotation = 0;
        this.scale = [0.12, 0.12, 0.12];
        this.initBuffers();
    }

    initBuffers() {
        const gl = this.gl;
        
        // Define geometry
        const positions = [
            // Main body - Front
            -0.4, -0.8,  0.4,
             0.4, -0.8,  0.4,
            -0.4,  0.8,  0.4,
             0.4,  0.8,  0.4,
            // Main body - Right
             0.4, -0.8,  0.4,
             0.4, -0.8, -0.4,
             0.4,  0.8,  0.4,
             0.4,  0.8, -0.4,
            // Main body - Back
             0.4, -0.8, -0.4,
            -0.4, -0.8, -0.4,
             0.4,  0.8, -0.4,
            -0.4,  0.8, -0.4,
            // Main body - Left
            -0.4, -0.8, -0.4,
            -0.4, -0.8,  0.4,
            -0.4,  0.8, -0.4,
            -0.4,  0.8,  0.4,
            // Main body - Bottom
            -0.4, -0.8, -0.4,
             0.4, -0.8, -0.4,
            -0.4, -0.8,  0.4,
             0.4, -0.8,  0.4,
            // Main body - Top
            -0.4,  0.8, -0.4,
             0.4,  0.8, -0.4,
            -0.4,  0.8,  0.4,
             0.4,  0.8,  0.4,
            // Neck
            -0.25,  0.8,  0.25,
             0.25,  0.8,  0.25,
            -0.25,  1.2,  0.25,
             0.25,  1.2,  0.25,
            // Cap front
            -0.3,  0.2,  0.3,
             0.3,  0.2,  0.3,
            -0.3,  1.3,  0.3,
             0.3,  1.3,  0.3,
            // Cap right
             0.3,  0.2,  0.3,
             0.3,  0.2, -0.3,
             0.3,  1.3,  0.3,
             0.3,  1.3, -0.3,
            // Cap back
             0.3,  0.2, -0.3,
            -0.3,  0.2, -0.3,
             0.3,  1.3, -0.3,
            -0.3,  1.3, -0.3,
            // Cap left
            -0.3,  0.2, -0.3,
            -0.3,  0.2,  0.3,
            -0.3,  1.3, -0.3,
            -0.3,  1.3,  0.3,
            // Cap top
            -0.3,  1.3, -0.3,
             0.3,  1.3, -0.3,
            -0.3,  1.3,  0.3,
             0.3,  1.3,  0.3
        ];

        const normals = [
            // Main body - Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            // Main body - Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            // Main body - Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            // Main body - Left
           -1.0,  0.0,  0.0,
           -1.0,  0.0,  0.0,
           -1.0,  0.0,  0.0,
           -1.0,  0.0,  0.0,
            // Main body - Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            // Main body - Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            // Neck
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            // Cap front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            // Cap right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            // Cap back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            // Cap left
           -1.0,  0.0,  0.0,
           -1.0,  0.0,  0.0,
           -1.0,  0.0,  0.0,
           -1.0,  0.0,  0.0,
            // Cap top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0
        ];

        const textureCoordinates = [
            // Main body - Front
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Main body - Right
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Main body - Back
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Main body - Left
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Main body - Bottom
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Main body - Top
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Neck
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Cap front
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Cap right
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Cap back
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Cap left
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            // Cap top
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ];

        // Create indices for triangles
        const indices = [];
        for (let i = 0; i < positions.length / 12; i++) {
            const baseIndex = i * 4;
            indices.push(
                baseIndex, baseIndex + 1, baseIndex + 2,
                baseIndex + 1, baseIndex + 3, baseIndex + 2
            );
        }

        // Create and bind buffers
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        this.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

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

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        gl.uniformMatrix4fv(this.locations.uniformLocations.modelMatrix, false, modelMatrix);
        gl.uniformMatrix4fv(this.locations.uniformLocations.normalMatrix, false, normalMatrix);

        // Bind vertex position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.locations.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.locations.attribLocations.vertexPosition);

        // Bind normal buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.locations.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.locations.attribLocations.vertexNormal);

        // Draw bottle body with glass material
        gl.uniform4fv(this.locations.uniformLocations.baseColor, [0.05, 0.1, 0.2, 0.9]);
        gl.uniform1f(this.locations.uniformLocations.shininess, 64.0);
        gl.drawElements(gl.TRIANGLES, this.indexCount * 2/3, gl.UNSIGNED_SHORT, 0);

        // Draw cap with metallic material
        gl.uniform4fv(this.locations.uniformLocations.baseColor, [0.8, 0.8, 0.85, 1.0]);
        gl.uniform1f(this.locations.uniformLocations.shininess, 128.0);
        gl.drawElements(gl.TRIANGLES, this.indexCount/3, gl.UNSIGNED_SHORT, this.indexCount * 4/3);
    }
}

export function createPerfumeBottle(gl) {
    return new PerfumeBottle(gl);
}