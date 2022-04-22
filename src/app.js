var rootDir = location.origin + location.pathname;
var canvas = null;
var engine = null;

function sleep(milliseconds) {  
    return new Promise(resolve => setTimeout(resolve, milliseconds));  
 }  

async function init() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(
        canvas,
        true,
        { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }
    );

    let scene = await createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

}

