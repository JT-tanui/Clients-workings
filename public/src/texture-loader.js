export async function loadTexture(gl, url) {
    return new Promise((resolve, reject) => {
        const texture = gl.createTexture();
        const image = new Image();
        image.crossOrigin = "anonymous";
        
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            
            // Check if the image dimensions are powers of 2
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            resolve(texture);
        };
        
        image.onerror = () => {
            reject(new Error(`Failed to load texture: ${url}`));
        };
        
        image.src = url;
    });
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}