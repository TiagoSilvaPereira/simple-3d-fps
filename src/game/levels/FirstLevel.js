import UI from '../../base/UI';
import Level from '../../base/Level';

export default class FirstLevel extends Level {

    setProperties() {

        // Menu
        this.menu = null;
        
    }

    setupAssets() {

        this.assets.addMusic('music', '/assets/musics/music.mp3');
        // this.assets.addSound('sound', '/assets/sounds/sound.mp3', { volume: 0.4 });
        
    }

    buildScene() {
        
        this.scene.clearColor = new BABYLON.Color3.FromHexString(GAME.options.backgroundColor);

        this.createMenus();

        // Sets the active camera
        var camera = this.createArcCamera();
        this.scene.activeCamera = camera;

        camera.attachControl(GAME.canvas, true);

    }

    createMenus() {
        this.menu = new UI('runnerMenuUI');
        
        let text = GAME.isMobile() ? 'You are in a mobile device' : 'You are not in a mobile device';

        // Small tutorial text
        this.menu.addText(text, {
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        this.menu.addButton('backButton', 'Return to Home', {
            'top': '70px',
            'onclick': () => GAME.goToLevel('HomeMenuLevel')
        });
    }

    createArcCamera() {
        let camera = new BABYLON.ArcRotateCamera("arcCamera", 0, 0, 0, BABYLON.Vector3.Zero(), this.scene);
    
        camera.ctype = 1;
        camera.setPosition(new BABYLON.Vector3(0, 1, -3));
        camera.radius = 2;

        return camera;
    }

    beforeRender() {
        if(!GAME.isPaused()) {
            // Do something
        }
    }
    
}