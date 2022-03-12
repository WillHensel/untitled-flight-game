// timeSelected: Time selected through GUI, defaults to real time when the game launches.
// timeNow: Time selected + amount of time passed since selection was made.
//          Should be zeroed when a change is made to timeSelected.
let timeSelected, timeNow;

async function createScene() {
    let scene, camera, shadowGenerator

    function setupScene() {
        scene = new BABYLON.Scene(engine);
        scene.collisionsEnabled = true;
    }
    function setupCamera() {
        camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 100, -20), scene);
        camera.radius = 20;
        camera.heightOffset = 1;
        camera.rotationOffset = 0;
        camera.cameraAcceleration = 0.5;
        camera.maxCameraSpeed = 100;
        camera.attachControl(canvas, true);
        camera.checkCollisions = true;

        cameraAttachment = BABYLON.MeshBuilder.CreateBox("CameraAttachment", {}, 0);
        cameraAttachment.isVisible = false;
    
        camera.lockedTarget = cameraAttachment;
        camera.rotationOffset = 180;

        scene.registerBeforeRender(function() {
            cameraAttachment.position = piperBody.position;
        });
    }


    function setupPiperMovement() {
        scene.registerBeforeRender(function() {
            piperBody.translate(new BABYLON.Vector3(-1, 0, 0), 1, BABYLON.Space.LOCAL);
        });
    }

    function setupInternalClock() {
        timeSelected = +new Date();
        timeNow = timeSelected;
        let timeStarted = +new Date();
        scene.registerBeforeRender(function() {
            let delta = +new Date() - timeStarted;
            if (delta >= 1000) {
                timeNow = timeSelected + delta;
            }        
        });

    }

    
    setupScene();
    setupInternalClock();
    setupCamera();
    setupEnvironment(scene);
    piperBody = await importAndSetupPiper(scene, camera);
    setupPiperMovement();
    setupUI();

    return scene;
};