import UI from '../../base/UI';
import Level from '../../base/Level';

export default class HomeMenuLevel extends Level {

    setupAssets() {
        //this.assets.addMusic('music', '/assets/musics/music.mp3');
    }

    buildScene() {

        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

        // Make this scene transparent to see the document background
        this.scene.clearColor = new BABYLON.Color4(0,0,0,0);
 
        var menu = new UI('homeMenuUI');
        
        menu.addButton('playButton', 'Play Game', {
            'background': GAME.options.backgroundColor,
            'color': 'white',
            'onclick': () => GAME.goToLevel('FirstLevel')
        });
        
        menu.addButton('creditsButton', 'Credits', {
            'top': '70px',
            'background': GAME.options.backgroundColor,
            'color': 'white',
            'onclick': () => GAME.goToLevel('CreditsLevel')
        });

    }

}