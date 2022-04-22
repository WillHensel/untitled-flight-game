// timeSelected: Time selected through GUI, defaults to real time when the game launches.
// timeNow: Time selected + amount of time passed since selection was made.
//          Should be zeroed when a change is made to timeSelected.
let timeSelected, timeNow, timeMultiplier, piperBody, terrain;

async function createScene() {
    let scene, camera;

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
        camera.attachControl(canvas, false);
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
            let terrainHeight = terrain.getHeightFromMap(piperBody.position.x, piperBody.position.z);
            if (piperBody.position.y <= terrainHeight) {
                piperBody.crashParticleSystem.start();
                sleep(10 * 1000).then(() => {
                    piperBody.dispose();
                    scene.dispose();
                    engine.dispose();
                    init();    
                })
            } else {
                piperBody.translate(new BABYLON.Vector3(-1, 0, 0), 1, BABYLON.Space.LOCAL);
            }
        });
    }

    function setupPiperEnvironmentInteraction() {
        shadowGenerator.getShadowMap().renderList.push(piperBody);
        terrain.mesh.receiveShadows = true;
    }

    function setupInternalClock() {
        timeSelected = +new Date();
        timeNow = timeSelected;
        timeMultiplier = 1;
        let timeStarted = +new Date();
        scene.registerBeforeRender(function() {
            let delta = +new Date() - timeStarted;
            delta *= timeMultiplier;
            if (delta >= 1000) {
                timeStarted = +new Date();
                timeNow += delta;
            }        
        });

    }

    function setupMusic() {
        let music = new BABYLON.Sound("Music", rootDir + "../audio/music.mp3", scene, null, {
            loop: true,
            autoplay: true,
            length: 106,
        });
    }
    
    setupScene();
    setupInternalClock();
    setupCamera();
    piperBody = await importAndSetupPiper(scene, camera);
    setupEnvironment(scene);
    setupPiperMovement();
    setupPiperEnvironmentInteraction();
    setupUI(scene);
    setupMusic();


    return scene;
};