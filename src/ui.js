
function setupUI(scene) {
    let advancedTexture;
    function throttleSlider() {}
    function timeSelector() {
        let timeIndicator = new BABYLON.GUI.TextBlock();
        timeIndicator.fontSize = 30;
        timeIndicator.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        timeIndicator.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        timeIndicator.height = "42px";
        timeIndicator.width = "150px";
        timeIndicator.paddingLeft = 20;
        timeIndicator.paddingBottom = 20;
        advancedTexture.addControl(timeIndicator);

        let timeMultiplierButton = BABYLON.GUI.Button.CreateSimpleButton("TimeMultiplierButton", "1x");
        timeMultiplierButton.width = "100px";
        timeMultiplierButton.height = "52px";
        timeMultiplierButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        timeMultiplierButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        timeMultiplierButton.paddingRight = 20;
        timeMultiplierButton.paddingBottom = 20;
        timeMultiplierButton.background = "#4DA6FF";
        timeMultiplierButton.onPointerClickObservable.add(function() {
            timeMultiplier *= 10;
            if (timeMultiplier == 100000) {
                timeMultiplier = 1;
            }
            timeMultiplierButton.textBlock.text = timeMultiplier + 'x';
        });
        advancedTexture.addControl(timeMultiplierButton);
        
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

            if (time.getHours() > 17 || time.getHours() < 6) {
                timeIndicator.color = "white";
            } else {
                timeIndicator.color = "black";
            }
        });
    }
    function compassIndicator() {}

    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);


    // await importGui();
    timeSelector();
}