import UI from '../../base/UI';
import Level from '../../base/Level';

export default class CreditsLevel extends Level {

    setupAssets() {
        this.assets.addMusic('music', '/assets/musics/Guitar-Mayhem.mp3');
    }

    buildScene() {

        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

        // Make this scene transparent to see the background
        this.scene.clearColor = new BABYLON.Color4(0,0,0,0);
 
        this.makeUI();

    }

    makeUI() {
        var ui = new UI('creditsUI');
        
        ui.addText('Design and Code by Tiago Silva Pereira Rodrigues\nkingofcode.com.br\n\n\n', {
            'top': '30px',
            'fontSize': '20px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP
        });

        ui.addText('Music by Eric Matyas\nwww.soundimage.org\n\nPlease check the game license documentation before\nchanging the credits', {
            'top': '140px',
            'fontSize': '20px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP
        });

        ui.addButton('backButton', 'Return to Home', {
            'top': '220px',
            'background': GAME.options.backgroundColor,
            'color': 'white',
            'onclick': () => GAME.goToLevel('HomeMenuLevel')
        });
    }

}