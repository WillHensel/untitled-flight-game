
function setupUI(scene) {
    let advancedTexture, panel;

    function setupPanel() {
        panel = new BABYLON.GUI.Rectangle();
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.width = "800px";
        panel.height = "75px";
        panel.color = "black";
        panel.background = "white";
        panel.paddingBottom = 20;
        panel.cornerRadius = 15;
        panel.thickness = 2;
        advancedTexture.addControl(panel);
    }
    function timeSelector() {
        let timeIndicator = new BABYLON.GUI.TextBlock();
        timeIndicator.fontSize = 30;
        timeIndicator.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        timeIndicator.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        timeIndicator.height = "42px";
        timeIndicator.width = "150px";
        timeIndicator.paddingLeft = 20;
        timeIndicator.color = "black";
        panel.addControl(timeIndicator);

        let timeMultiplierButton = BABYLON.GUI.Button.CreateSimpleButton("TimeMultiplierButton", "1x");
        timeMultiplierButton.width = "100px";
        timeMultiplierButton.height = "42px";
        timeMultiplierButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        timeMultiplierButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        timeMultiplierButton.paddingRight = 20;
        timeMultiplierButton.background = "#4DA6FF";
        timeMultiplierButton.onPointerClickObservable.add(function() {
            timeMultiplier *= 10;
            if (timeMultiplier == 100000) {
                timeMultiplier = 1;
            }
            timeMultiplierButton.textBlock.text = timeMultiplier + 'x';
        });
        panel.addControl(timeMultiplierButton);
        
        scene.registerBeforeRender(function() {
            let time = new Date(timeNow);
            let hours = time.getHours();
            if (hours > 12) {
                hours = hours - 12;
            } else if (hours == 0) {
                hours = 12;
            }
            timeIndicator.text = hours +
            ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) +
            ' ' + (time.getHours() >= 12 ? 'PM' : 'AM');
        });
    }
    function altitudeIndicator() {
        let altitudeIndicator = new BABYLON.GUI.TextBlock();
        altitudeIndicator.fontSize = 30;
        altitudeIndicator.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        altitudeIndicator.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        altitudeIndicator.height = "42px";
        altitudeIndicator.width = "300px";
        altitudeIndicator.color =  "black";

        panel.addControl(altitudeIndicator);

        scene.registerBeforeRender(function() {
            altitudeIndicator.text = Math.round(piperBody.position.y * 3.2808) + " ft";
        });
    }
    function compassIndicator() {}

    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    setupPanel();
    // await importGui();
    timeSelector();
    altitudeIndicator();
}