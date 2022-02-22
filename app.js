var canvas = null;
var engine = null;

function createScene() {
    let scene, camera, light, ground;

    function setupScene() {
        scene = new BABYLON.Scene(engine);
    }
    function setupCamera() {
        camera = new BABYLON.ArcRotateCamera(
            "Camera",
            Math.PI / 2,
            Math.PI / 2,
            2,
            new BABYLON.Vector3(0, 0, 0),
            scene
        );
        camera.setPosition(new BABYLON.Vector3(0.5, 0.5, -5));
        camera.attachControl(canvas, true);
    }
    function setupLights() {
        light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    }
    function setupGround() {
        let whiteMat = new BABYLON.StandardMaterial("whiteMat", scene);
        whiteMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 4, height: 4 }, scene);
        ground.material = whiteMat;
    }
    function setupOrientationLines() {
        let xLine = BABYLON.MeshBuilder.CreateLines("xLine", {
            points: [new BABYLON.Vector3(0, 0.01, 0), new BABYLON.Vector3(4, 0.01, 0)],
            colors: [new BABYLON.Color4(1, 0, 0, 1), new BABYLON.Color4(1, 0, 0, 1)]
        }, scene);
        let yLine = BABYLON.MeshBuilder.CreateLines("yLine", {
            points: [new BABYLON.Vector3(0, 0.01, 0), new BABYLON.Vector3(0, 4.01, 0)],
            colors: [new BABYLON.Color4(0, 1, 0, 1), new BABYLON.Color4(0, 1, 0, 1)]
        }, scene);
        let zLine = BABYLON.MeshBuilder.CreateLines("zLine", {
            points: [new BABYLON.Vector3(0, 0.01, 0), new BABYLON.Vector3(0, 0.01, 4)],
            colors: [new BABYLON.Color4(0, 0, 1, 1), new BABYLON.Color4(0, 0, 1, 1)]
        }, scene);
    }

    setupScene();
    setupCamera();
    setupLights();
    setupGround();
    setupOrientationLines();

    return scene;
};

function init() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(
        canvas,
        true,
        { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }
    );

    let scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

}
